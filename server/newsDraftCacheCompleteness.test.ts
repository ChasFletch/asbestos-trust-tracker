import type { Express } from "express";
import { afterEach, describe, expect, it, vi } from "vitest";

const START = Date.parse("2026-11-06T12:00:00Z");
const FIFTEEN_MINUTES = 15 * 60 * 1000;
const FIRST_URL = "https://example.test/first.md";
const SECOND_URL = "https://example.test/second.md";
const listing = [
  { name: "2026-11-02-first.md", download_url: FIRST_URL },
  { name: "2026-11-01-second.md", download_url: SECOND_URL },
];
const expectedFilenames = listing.map((entry) => entry.name);

type Failure = "listing-http" | "listing-not-found" | "listing-shape" | "card-http" | "card-network" | "card-body" | "card-empty";

function deferred() {
  let resolve!: () => void;
  const promise = new Promise<void>((done) => { resolve = done; });
  return { promise, resolve };
}

function installNewsSource(failure: Failure, beforeCardFailure?: () => Promise<void>) {
  let healthy = false;
  const requests: string[] = [];
  const fetchMock = vi.fn(async (input: RequestInfo | URL): Promise<Response> => {
    const url = String(input);
    requests.push(url);

    if (url.startsWith("https://api.github.com/")) {
      if (!healthy && failure === "listing-http") return new Response("unavailable", { status: 503 });
      if (!healthy && failure === "listing-not-found") return new Response("not found", { status: 404 });
      if (!healthy && failure === "listing-shape") return Response.json({ message: "invalid listing" });
      return Response.json(listing);
    }
    if (url === FIRST_URL) return new Response("# First\ndate: 2026-11-02\n\nFirst card.");
    if (url === SECOND_URL) {
      if (!healthy && failure.startsWith("card-")) {
        if (beforeCardFailure) await beforeCardFailure();
        if (failure === "card-network") throw new Error("connection failed");
        if (failure === "card-http") return new Response("unavailable", { status: 503 });
        if (failure === "card-empty") return new Response("  \n  ");
        const response = new Response("unreadable");
        response.text = async () => { throw new Error("response body failed"); };
        return response;
      }
      return new Response("# Second\ndate: 2026-11-01\n\nSecond card.");
    }
    throw new Error(`Unexpected fetch URL: ${url}`);
  });
  vi.stubGlobal("fetch", fetchMock);
  return {
    fetchMock,
    requests,
    listingRequests: () => requests.filter((url) => url.startsWith("https://api.github.com/")).length,
    recover: () => { healthy = true; },
    fail: () => { healthy = false; },
  };
}

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
  vi.resetModules();
});

describe("News feed cache completeness", () => {
  it.each<Failure>(["card-http", "card-network", "card-body", "card-empty", "listing-http", "listing-not-found", "listing-shape"])(
    "fails closed for %s in non-strict and strict requests, then refetches and caches the complete recovery",
    async (failure) => {
      // All requests are at the same instant: no failure can be hidden by waiting out the TTL.
      vi.spyOn(Date, "now").mockReturnValue(START);
      const source = installNewsSource(failure);
      const { fetchNewsDrafts } = await import("./dataRoutes");

      // This is the API/SSR sequence from receiver-repro.ts. A selected card can
      // succeed while another fails; the lenient call must not return or cache it.
      const apiOutcome = await fetchNewsDrafts(false).then(
        (value) => ({ status: "fulfilled" as const, value }),
        (reason) => ({ status: "rejected" as const, reason }),
      );
      if (failure.startsWith("card-")) {
        expect(source.requests).toContain(FIRST_URL);
        expect(source.requests).toContain(SECOND_URL);
      }
      const listingsAfterApiFailure = source.listingRequests();

      // The SSR call must actually retry, and still signal an error while the
      // source remains unavailable, rather than return a partial or empty feed.
      await expect(fetchNewsDrafts(true)).rejects.toThrow();
      expect(apiOutcome.status).toBe("rejected");
      expect(source.listingRequests()).toBeGreaterThan(listingsAfterApiFailure);

      source.recover();
      const callsBeforeRecovery = source.fetchMock.mock.calls.length;
      const recovered = await fetchNewsDrafts(true);
      expect(recovered.map((draft) => draft.filename)).toEqual(expectedFilenames);
      expect(recovered.map((draft) => draft.title)).toEqual(["First", "Second"]);
      expect(source.fetchMock.mock.calls.length).toBeGreaterThan(callsBeforeRecovery);

      const callsAfterRecovery = source.fetchMock.mock.calls.length;
      await expect(fetchNewsDrafts(true)).resolves.toEqual(recovered);
      await expect(fetchNewsDrafts(false)).resolves.toEqual(recovered);
      expect(source.fetchMock).toHaveBeenCalledTimes(callsAfterRecovery);
    },
  );

  it("returns an observable API error on a partial feed before a strict request retries and recovers", async () => {
    vi.spyOn(Date, "now").mockReturnValue(START);
    const source = installNewsSource("card-http");
    const { registerDataRoutes, fetchNewsDrafts } = await import("./dataRoutes");
    const handlers = new Map<string, (...args: any[]) => Promise<void>>();
    const app = { get: (path: string, handler: (...args: any[]) => Promise<void>) => handlers.set(path, handler) };
    registerDataRoutes(app as unknown as Express);
    const response = {
      status: vi.fn().mockReturnThis(),
      set: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis(),
    };

    const handler = handlers.get("/api/news-drafts");
    expect(handler).toBeDefined();
    await handler!({}, response);
    expect(response.status).toHaveBeenCalledOnce();
    expect(response.status.mock.calls[0][0]).toBeGreaterThanOrEqual(400);
    expect(response.json).toHaveBeenCalledWith(expect.objectContaining({ error: expect.any(String) }));

    const listingsAfterError = source.listingRequests();
    source.recover();
    const recovered = await fetchNewsDrafts(true);
    expect(source.listingRequests()).toBeGreaterThan(listingsAfterError);
    expect(recovered.map((draft) => draft.filename)).toEqual(expectedFilenames);
    const callsAfterRecovery = source.fetchMock.mock.calls.length;
    await expect(fetchNewsDrafts(true)).resolves.toEqual(recovered);
    expect(source.fetchMock).toHaveBeenCalledTimes(callsAfterRecovery);
  });

  it("uses a complete cache until the TTL expires and then fetches a complete feed again", async () => {
    const clock = vi.spyOn(Date, "now").mockReturnValue(START);
    const source = installNewsSource("card-http");
    source.recover();
    const { fetchNewsDrafts } = await import("./dataRoutes");
    const initial = await fetchNewsDrafts(true);
    expect(initial.map((draft) => draft.filename)).toEqual(expectedFilenames);
    const callsAfterInitial = source.fetchMock.mock.calls.length;

    clock.mockReturnValue(START + FIFTEEN_MINUTES - 1);
    await expect(fetchNewsDrafts(false)).resolves.toEqual(initial);
    await expect(fetchNewsDrafts(true)).resolves.toEqual(initial);
    expect(source.fetchMock).toHaveBeenCalledTimes(callsAfterInitial);

    clock.mockReturnValue(START + FIFTEEN_MINUTES);
    const refreshed = await fetchNewsDrafts(true);
    expect(refreshed.map((draft) => draft.filename)).toEqual(expectedFilenames);
    expect(source.fetchMock.mock.calls.length).toBeGreaterThan(callsAfterInitial);
  });

  it("does not serve or renew an expired cache when its attempted refresh is incomplete", async () => {
    const clock = vi.spyOn(Date, "now").mockReturnValue(START);
    const source = installNewsSource("card-http");
    source.recover();
    const { fetchNewsDrafts } = await import("./dataRoutes");
    const initial = await fetchNewsDrafts(true);
    expect(initial.map((draft) => draft.filename)).toEqual(expectedFilenames);

    clock.mockReturnValue(START + FIFTEEN_MINUTES);
    source.fail();
    await expect(fetchNewsDrafts(false)).rejects.toThrow();
    const listingsAfterApiFailure = source.listingRequests();
    await expect(fetchNewsDrafts(true)).rejects.toThrow();
    expect(source.listingRequests()).toBeGreaterThan(listingsAfterApiFailure);

    source.recover();
    const callsBeforeRecovery = source.fetchMock.mock.calls.length;
    const recovered = await fetchNewsDrafts(true);
    expect(recovered.map((draft) => draft.filename)).toEqual(expectedFilenames);
    expect(source.fetchMock.mock.calls.length).toBeGreaterThan(callsBeforeRecovery);
    const callsAfterRecovery = source.fetchMock.mock.calls.length;
    await expect(fetchNewsDrafts(false)).resolves.toEqual(recovered);
    expect(source.fetchMock).toHaveBeenCalledTimes(callsAfterRecovery);
  });

  it("does not poison the cache when non-strict and strict requests overlap during a card failure", async () => {
    vi.spyOn(Date, "now").mockReturnValue(START);
    const entered = deferred();
    const release = deferred();
    let paused = false;
    const source = installNewsSource("card-http", async () => {
      if (!paused) {
        paused = true;
        entered.resolve();
        await release.promise;
      }
    });
    const { fetchNewsDrafts } = await import("./dataRoutes");

    const apiResult = fetchNewsDrafts(false).then(
      (value) => ({ status: "fulfilled" as const, value }),
      (reason) => ({ status: "rejected" as const, reason }),
    );
    await entered.promise;
    const ssrResult = fetchNewsDrafts(true).then(
      (value) => ({ status: "fulfilled" as const, value }),
      (reason) => ({ status: "rejected" as const, reason }),
    );
    release.resolve();
    const results = await Promise.all([apiResult, ssrResult]);
    expect(results.map((result) => result.status)).toEqual(["rejected", "rejected"]);

    source.recover();
    const callsBeforeRecovery = source.fetchMock.mock.calls.length;
    const recovered = await fetchNewsDrafts(true);
    expect(source.fetchMock.mock.calls.length).toBeGreaterThan(callsBeforeRecovery);
    expect(recovered.map((draft) => draft.filename)).toEqual(expectedFilenames);
    const callsAfterRecovery = source.fetchMock.mock.calls.length;
    await expect(fetchNewsDrafts(false)).resolves.toEqual(recovered);
    expect(source.fetchMock).toHaveBeenCalledTimes(callsAfterRecovery);
  });

  it("caches a successfully fetched genuinely empty listing", async () => {
    vi.spyOn(Date, "now").mockReturnValue(START);
    const fetchMock = vi.fn(async () => Response.json([]));
    vi.stubGlobal("fetch", fetchMock);
    const { fetchNewsDrafts } = await import("./dataRoutes");
    await expect(fetchNewsDrafts(false)).resolves.toEqual([]);
    await expect(fetchNewsDrafts(true)).resolves.toEqual([]);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("rejects a selected markdown entry without a download URL and retries", async () => {
    vi.spyOn(Date, "now").mockReturnValue(START);
    const fetchMock = vi.fn(async () => Response.json([{ name: listing[0].name, download_url: null }]));
    vi.stubGlobal("fetch", fetchMock);
    const { fetchNewsDrafts } = await import("./dataRoutes");
    await expect(fetchNewsDrafts(false)).rejects.toThrow("News card URL unavailable");
    await expect(fetchNewsDrafts(true)).rejects.toThrow("News card URL unavailable");
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it("does not let a later failed partial refresh overwrite a concurrent complete success", async () => {
    vi.spyOn(Date, "now").mockReturnValue(START);
    const entered = deferred();
    const release = deferred();
    let secondCardCalls = 0;
    const fetchMock = vi.fn(async (input: RequestInfo | URL): Promise<Response> => {
      const url = String(input);
      if (url.startsWith("https://api.github.com/")) return Response.json(listing);
      if (url === FIRST_URL) return new Response("# First\ndate: 2026-11-02\n\nFirst card.");
      if (url === SECOND_URL) {
        if (++secondCardCalls === 1) {
          entered.resolve();
          await release.promise;
          return new Response("unavailable", { status: 503 });
        }
        return new Response("# Second\ndate: 2026-11-01\n\nSecond card.");
      }
      throw new Error(`Unexpected fetch URL: ${url}`);
    });
    vi.stubGlobal("fetch", fetchMock);
    const { fetchNewsDrafts } = await import("./dataRoutes");
    const apiResult = fetchNewsDrafts(false).then(
      () => "fulfilled",
      () => "rejected",
    );
    await entered.promise;
    const complete = await fetchNewsDrafts(true);
    expect(complete.map(draft => draft.filename)).toEqual(expectedFilenames);
    release.resolve();
    expect(await apiResult).toBe("rejected");
    const callsAfterBoth = fetchMock.mock.calls.length;
    await expect(fetchNewsDrafts(true)).resolves.toEqual(complete);
    expect(fetchMock).toHaveBeenCalledTimes(callsAfterBoth);
  });

  it("does not let an older successful refresh overwrite a newer complete snapshot", async () => {
    vi.spyOn(Date, "now").mockReturnValue(START);
    const entered = deferred();
    const release = deferred();
    let listings = 0;
    let firstCardCalls = 0;
    const fetchMock = vi.fn(async (input: RequestInfo | URL): Promise<Response> => {
      const url = String(input);
      if (url.startsWith("https://api.github.com/")) {
        return Response.json(++listings === 1 ? listing.slice(0, 1) : listing);
      }
      if (url === FIRST_URL) {
        if (++firstCardCalls === 1) { entered.resolve(); await release.promise; }
        return new Response("# First\ndate: 2026-11-02\n\nFirst card.");
      }
      if (url === SECOND_URL) return new Response("# Second\ndate: 2026-11-01\n\nSecond card.");
      throw new Error(`Unexpected fetch URL: ${url}`);
    });
    vi.stubGlobal("fetch", fetchMock);
    const { fetchNewsDrafts } = await import("./dataRoutes");
    const older = fetchNewsDrafts(false);
    await entered.promise;
    const newer = await fetchNewsDrafts(true);
    expect(newer.map(draft => draft.filename)).toEqual(expectedFilenames);
    release.resolve();
    expect(await older).toEqual(newer);
    const callsAfterBoth = fetchMock.mock.calls.length;
    await expect(fetchNewsDrafts(true)).resolves.toEqual(newer);
    expect(fetchMock).toHaveBeenCalledTimes(callsAfterBoth);
  });
});

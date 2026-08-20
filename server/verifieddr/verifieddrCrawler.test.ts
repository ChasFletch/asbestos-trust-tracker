import { describe, expect, it, beforeEach, vi } from "vitest";
import type { Request, Response } from "express";
import {
  isVerifiedDrAiCrawler,
  reportVerifiedDrCrawlerEvent,
  resetVerifiedDrCrawlerSourceRegistration,
} from "./verifieddrCrawler";

function makeRequest(userAgent: string, originalUrl = "/trusts?sort=name"): Request {
  return {
    originalUrl,
    url: originalUrl,
    method: "GET",
    get: (name: string) => {
      if (name.toLowerCase() === "user-agent") return userAgent;
      if (name.toLowerCase() === "referer") return "https://example.org/origin?ref=1";
      return undefined;
    },
  } as unknown as Request;
}

function makeResponse(statusCode = 200): Response {
  return { statusCode } as Response;
}

describe("VerifiedDR crawler reporting", () => {
  beforeEach(() => resetVerifiedDrCrawlerSourceRegistration());

  it("recognizes expected AI crawler user agents without matching ordinary visitors", () => {
    expect(isVerifiedDrAiCrawler("GPTBot/1.2")).toBe(true);
    expect(isVerifiedDrAiCrawler("ClaudeBot/1.0")).toBe(true);
    expect(isVerifiedDrAiCrawler("Mozilla/5.0")).toBe(false);
  });

  it("reports a crawler with its finished status and registers the source once", async () => {
    const calls: Array<{ method?: string; body?: string }> = [];
    const fetchImpl = vi.fn(async (_url: string | URL | Request, init?: RequestInit) => {
      calls.push({ method: init?.method, body: init?.body as string });
      return new Response("{}", { status: 200 });
    }) as unknown as typeof fetch;

    const scheduled = await reportVerifiedDrCrawlerEvent(makeRequest("GPTBot/1.2"), makeResponse(206), {
      token: "vdrcrawl_test-token",
      canonicalOrigin: "https://asbestostrusts.org",
      fetchImpl,
      now: () => new Date("2026-08-20T17:30:00.000Z"),
    });

    expect(scheduled).toBe(true);
    expect(calls.map((call) => call.method).sort()).toEqual(["POST", "PUT"]);
    const event = JSON.parse(calls.find((call) => call.method === "POST")?.body ?? "[]")[0];
    expect(event).toMatchObject({
      hostname: "asbestostrusts.org",
      path: "/trusts",
      user_agent: "GPTBot/1.2",
      method: "GET",
      status: 206,
      timestamp: "2026-08-20T17:30:00.000Z",
      referrer: "/origin",
    });
  });

  it("does not send data for an ordinary visitor", async () => {
    const fetchImpl = vi.fn() as unknown as typeof fetch;
    const scheduled = await reportVerifiedDrCrawlerEvent(makeRequest("Mozilla/5.0"), makeResponse(), {
      token: "vdrcrawl_test-token",
      canonicalOrigin: "https://asbestostrusts.org",
      fetchImpl,
    });

    expect(scheduled).toBe(false);
    expect(fetchImpl).not.toHaveBeenCalled();
  });
});

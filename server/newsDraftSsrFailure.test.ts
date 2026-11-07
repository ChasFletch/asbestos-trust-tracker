import { afterEach, describe, expect, it, vi } from "vitest";

afterEach(() => { vi.unstubAllGlobals(); vi.resetModules(); });

describe("SSR News draft completeness", () => {
  it("throws on unavailable listing instead of silently omitting cards", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false, status: 503 }));
    const { fetchNewsDrafts } = await import("./dataRoutes");
    await expect(fetchNewsDrafts(true)).rejects.toThrow("News listing unavailable");
    await expect(fetchNewsDrafts()).rejects.toThrow("News listing unavailable");
  });

  it("throws if one listed card cannot be fetched", async () => {
    vi.stubGlobal("fetch", vi.fn()
      .mockResolvedValueOnce({ ok: true, json: async () => [{ name: "2026-10-01-existing.md", download_url: "https://example.test/existing.md" }] })
      .mockResolvedValueOnce({ ok: false, status: 503 }));
    const { fetchNewsDrafts } = await import("./dataRoutes");
    await expect(fetchNewsDrafts(true)).rejects.toThrow("News card unavailable");
  });

  it("does not mistake a failed listing, including 404, for a complete empty feed", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false, status: 404 }));
    const { fetchNewsDrafts } = await import("./dataRoutes");
    await expect(fetchNewsDrafts(true)).rejects.toThrow("News listing unavailable: 404");
  });
});

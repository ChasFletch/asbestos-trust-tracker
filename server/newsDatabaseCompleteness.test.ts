import { QueryClient } from "@tanstack/react-query";
import { afterEach, describe, expect, it, vi } from "vitest";
import { prefetchForPath, type SsrPrefetch } from "../client/src/ssr/prefetch";

afterEach(() => { vi.unstubAllEnvs(); vi.resetModules(); });

describe("News database completeness", () => {
  it("rejects a missing database instead of returning an apparently complete empty list", async () => {
    vi.stubEnv("DATABASE_URL", "");
    vi.resetModules();
    const { getVisibleNews } = await import("./db");
    await expect(getVisibleNews()).rejects.toThrow("News database unavailable");
  });

  it("propagates a database feed failure from News SSR", async () => {
    const source = {
      newsList: async () => { throw new Error("News database unavailable"); },
      newsDrafts: async () => [],
    } as unknown as SsrPrefetch;
    await expect(prefetchForPath("/news", new QueryClient(), source)).rejects.toThrow("News database unavailable");
  });
});

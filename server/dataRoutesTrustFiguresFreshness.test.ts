import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { trustFiguresSourceUrl } from "./dataRoutes";

const root = resolve(import.meta.dirname, "..");
const dataRoutes = readFileSync(resolve(root, "server/dataRoutes.ts"), "utf8");

describe("runtime trust-figure freshness", () => {
  it("uses a cache-busted GitHub raw URL when refreshing independently maintained tracker data", () => {
    expect(trustFiguresSourceUrl(1_788_750_000_000)).toBe(
      "https://raw.githubusercontent.com/ChasFletch/asbestos-trust-tracker/main/client/src/data/trust-figures.json?cachebust=1788750000000"
    );
    expect(dataRoutes).toContain("const CACHE_TTL_MS = 5 * 60 * 1000");
    expect(dataRoutes).toContain("fetch(trustFiguresSourceUrl(now)");
  });

  it("does not let browsers or edge caches retain stale trust API or CSV source revisions", () => {
    const noStoreOccurrences = (dataRoutes.match(/res\.set\("Cache-Control", "no-store"\)/g) ?? []).length;

    expect(noStoreOccurrences).toBeGreaterThanOrEqual(3);
  });
});

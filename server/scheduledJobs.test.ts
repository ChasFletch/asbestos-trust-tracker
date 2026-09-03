import { describe, expect, it } from "vitest";
import { checkCrawlerVisibility } from "./scheduledJobs";

const fixtureOrigin = "https://example.test";
const remaining = 16_033_489_279;
const payouts = 30_033_989_206;
const expectedRemaining = "$16,033,489,279";
const expectedPayouts = "$30,033,989,206";
const expectedCoverage = "Documented floor: $16,033,489,279 across 43 of roughly 60 active trusts.";
const expectedDateScope = "underlying asset figures span FY2021–2025";
const trustRows = [
  ...Array.from({ length: 2 }, () => ({ netAssets: 1, assetsAsOf: "2021-12-31", status: "active" })),
  ...Array.from({ length: 23 }, () => ({ netAssets: 1, assetsAsOf: "2022-12-31", status: "active" })),
  ...Array.from({ length: 18 }, () => ({ netAssets: 1, assetsAsOf: "2025-12-31", status: "active" })),
];

function healthyFetch(url: string | URL | Request) {
  const href = String(url);
  if (href.includes("/api/trust-figures")) {
    return Promise.resolve(new Response(JSON.stringify({
      asOf: "2026-09-01",
      aggregate: { remainingAssetsPoint: remaining, cumulativePayoutsBottomUp: payouts, activeTrustsEstimated: 60 },
      trusts: trustRows,
    }), { status: 200 }));
  }
  if (href.includes("/trusts.csv")) {
    return Promise.resolve(new Response("name,shortName,netAssets,assetsAsOf\nExample,Example,1,2026-09-01", { status: 200 }));
  }
  return Promise.resolve(new Response(`<main>${expectedRemaining} ${expectedPayouts} ${expectedCoverage} ${expectedDateScope}</main>`, { status: 200 }));
}

describe("scheduled crawler visibility monitor", () => {
  it("passes only when the homepage, embed, and CSV expose the expected live data", async () => {
    const result = await checkCrawlerVisibility({
      canonicalOrigin: fixtureOrigin,
      fetchImpl: healthyFetch as typeof fetch,
    });

    expect(result.ok).toBe(true);
    expect(result.expected).toEqual({
      remaining: expectedRemaining,
      payouts: expectedPayouts,
      coverage: expectedCoverage,
      dateScope: expectedDateScope,
    });
    expect(result.checks).toEqual([
      expect.objectContaining({ path: "/", ok: true }),
      expect.objectContaining({ path: "/embed/clock", ok: true }),
      expect.objectContaining({ path: "/trusts.csv", ok: true }),
    ]);
  });

  it("fails when a page returns a placeholder instead of the current compensation figures", async () => {
    const fetchImpl = ((url: string | URL | Request) => {
      const href = String(url);
      if (href.includes("/api/trust-figures")) return healthyFetch(url);
      if (href.includes("/trusts.csv")) return healthyFetch(url);
      if (href.includes("/embed/clock")) return Promise.resolve(new Response("<main>$0</main>", { status: 404 }));
      return healthyFetch(url);
    }) as typeof fetch;

    const result = await checkCrawlerVisibility({ canonicalOrigin: fixtureOrigin, fetchImpl });

    expect(result.ok).toBe(false);
    expect(result.checks).toContainEqual(expect.objectContaining({ path: "/embed/clock", ok: false, detail: "HTTP 404" }));
  });
});

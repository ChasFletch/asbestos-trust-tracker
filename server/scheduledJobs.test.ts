import { describe, expect, it } from "vitest";
import { checkCrawlerVisibility, checkManvillePaymentNotice } from "./scheduledJobs";

const fixtureOrigin = "https://example.test";
const remaining = 16_033_489_279;
const payouts = 30_033_989_206;
const expectedRemaining = "$16,033,489,279";
const expectedPayouts = "$30,033,989,206";
const expectedCoverage = "Documented floor: $16,033,489,279 across 43 of 54 active tracker records.";
const expectedDateScope = "underlying asset figures span FY2021–2025";
const trustRows = [
  ...Array.from({ length: 2 }, () => ({ netAssets: 1, assetsAsOf: "2021-12-31", status: "active" })),
  ...Array.from({ length: 23 }, () => ({ netAssets: 1, assetsAsOf: "2022-12-31", status: "active" })),
  ...Array.from({ length: 18 }, () => ({ netAssets: 1, assetsAsOf: "2025-12-31", status: "active" })),
  ...Array.from({ length: 10 }, () => ({ netAssets: null, assetsAsOf: null, status: "active" })),
  { netAssets: null, assetsAsOf: null, status: "active_deferral" },
];

function healthyFetch(url: string | URL | Request) {
  const href = String(url);
  if (href.includes("/api/trust-figures")) {
    return Promise.resolve(new Response(JSON.stringify({
      asOf: "2026-09-01",
      aggregate: { remainingAssetsPoint: remaining, cumulativePayoutsBottomUp: payouts },
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

  it("uses the existing weekly monitor to flag a newer official Manville payment notice for source review", async () => {
    const fetchImpl = ((url: string | URL | Request) => {
      const href = String(url);
      if (href.includes("/api/trust-figures")) {
        return Promise.resolve(new Response(JSON.stringify({
          trusts: [{
            name: "Manville Personal Injury Settlement Trust",
            paymentPctNoticePublishedAt: "2026-09-03",
          }],
        }), { status: 200 }));
      }
      if (href.includes("claimsres.com/category/manville/feed")) {
        return Promise.resolve(new Response(`<?xml version="1.0"?><rss><channel><item><title>Manville: Increase in the pro rata payment percentage</title><link>https://www.claimsres.com/newer-manville-notice/</link><pubDate>Mon, 05 Oct 2026 12:00:00 +0000</pubDate></item></channel></rss>`, { status: 200 }));
      }
      return Promise.resolve(new Response("Not found", { status: 404 }));
    }) as typeof fetch;

    const result = await checkManvillePaymentNotice({ canonicalOrigin: fixtureOrigin, fetchImpl });

    expect(result.ok).toBe(false);
    expect(result.latestNoticeDate).toBe("2026-10-05");
    expect(result.latestNoticeUrl).toBe("https://www.claimsres.com/newer-manville-notice/");
    expect(result.detail).toContain("source review required");
  });

  it("passes the Manville notice check when the reviewed tracker notice date matches the official feed", async () => {
    const fetchImpl = ((url: string | URL | Request) => {
      const href = String(url);
      if (href.includes("/api/trust-figures")) {
        return Promise.resolve(new Response(JSON.stringify({
          trusts: [{
            name: "Manville Personal Injury Settlement Trust",
            paymentPctNoticePublishedAt: "2026-09-03",
          }],
        }), { status: 200 }));
      }
      return Promise.resolve(new Response(`<?xml version="1.0"?><rss><channel><item><title><![CDATA[Manville: Increase in the pro rata payment percentage]]></title><link>https://www.claimsres.com/2026/09/03/manville-increase-in-the-pro-rata-payment-percentage/</link><pubDate>Thu, 03 Sep 2026 14:54:20 +0000</pubDate></item></channel></rss>`, { status: 200 }));
    }) as typeof fetch;

    const result = await checkManvillePaymentNotice({ canonicalOrigin: fixtureOrigin, fetchImpl });

    expect(result).toMatchObject({
      ok: true,
      latestNoticeDate: "2026-09-03",
      latestNoticeUrl: "https://www.claimsres.com/2026/09/03/manville-increase-in-the-pro-rata-payment-percentage/",
    });
  });
});

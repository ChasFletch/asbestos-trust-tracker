import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { NEWS_BRIEFS_BY_SLUG, getNewsBriefsForTrust } from "../client/src/data/newsBriefs";
import { OFFICIAL_PAYMENT_NOTICES } from "../client/src/data/paymentNoticeHistory";

const figures = JSON.parse(readFileSync("client/src/data/trust-figures.json", "utf8"));
const thorpe = figures.trusts.find((trust: { name: string }) => trust.name === "J.T. Thorpe Settlement Trust (CA)");

describe("J.T. Thorpe September 2026 payment-percentage release", () => {
  const brief = NEWS_BRIEFS_BY_SLUG["jt-thorpe-payment-percentage-review-september-2026"];

  it("records the official 53.7% announcement without inventing an effective date or completed implementation", () => {
    expect(thorpe).toBeDefined();
    expect(thorpe.paymentPercentage).toBe(53.7);
    expect(thorpe.paymentPctAsOf).toBe("2026-09-18");
    expect(thorpe.paymentPctNoticePublishedAt).toBe("2026-09-18");
    expect(thorpe.paymentPctEffective).toBeUndefined();
    expect(thorpe.paymentPctImplementationStatus).toBe("announced_pending_implementation");
    expect(thorpe.paymentPctImplementationNote).toContain("necessary claims-processing-system");
    expect(thorpe.paymentPercentageSourceUrl).toBe("https://www.jttstrust.com");
    expect(thorpe.paymentPercentageSource).toContain("50% to 53.7%");
    expect(thorpe.note).toContain("not a completed-payment record");
    expect(thorpe.netAssets).toBe(116_383_926);
    expect(thorpe.assetsAsOf).toBe("2025-12-31");
  });

  it("adds the reviewed notice to public history with the implementation limitation intact", () => {
    const notice = OFFICIAL_PAYMENT_NOTICES.find((item) => item.id === "jt-thorpe-2026-09-18");
    expect(notice).toBeDefined();
    expect(notice).toMatchObject({
      trustSlug: "j-t-thorpe-settlement-trust-ca",
      priorPercentage: 50,
      currentPercentage: 53.7,
      publishedDate: "2026-09-18",
      sourceUrl: "https://www.jttstrust.com",
    });
    expect(notice?.effectiveDate).toBeUndefined();
    expect(notice?.summary).toContain("updates are completed");
  });

  it("publishes a source-led article and matching News card without attorney-review attribution", () => {
    expect(brief).toBeDefined();
    expect(brief.date).toBe("2026-09-23");
    expect(brief.sourceUrl).toBe("https://www.jttstrust.com");
    expect(brief.relatedTrustSlugs).toEqual(["j-t-thorpe-settlement-trust-ca"]);
    expect(brief.markdown).toContain("50% to 53.7%");
    expect(brief.markdown).toContain("updates were complete");
    expect(brief.markdown).toContain("No article-specific attorney review is recorded");
    expect(getNewsBriefsForTrust("j-t-thorpe-settlement-trust-ca")).toContain(brief);

    const card = readFileSync("client/src/data/news-drafts/2026-09-23-jt-thorpe-payment-percentage-review-september-2026.md", "utf8");
    expect(card).toContain("category: payment_change");
    expect(card).toContain("full source-linked brief");
    expect(card).toContain("implementation was complete");
  });

  it("exposes the article and pending-implementation status to crawlers and data users", () => {
    const sitemap = readFileSync("client/public/sitemap.xml", "utf8");
    const detailPage = readFileSync("client/src/pages/TrustDetail.tsx", "utf8");
    const trustList = readFileSync("client/src/pages/Trusts.tsx", "utf8");
    const csvRoute = readFileSync("server/dataRoutes.ts", "utf8");

    expect(sitemap).toContain("https://asbestostrusts.org/news/jt-thorpe-payment-percentage-review-september-2026");
    expect(detailPage).toContain('paymentPctImplementationStatus === "announced_pending_implementation"');
    expect(detailPage).toContain('trust.paymentPctImplementationStatus !== "announced_pending_implementation"');
    expect(trustList).toContain("announced · implementation pending");
    expect(csvRoute).toContain('"paymentPctImplementationStatus"');
    expect(csvRoute).toContain('"paymentPctImplementationNote"');
  });
});

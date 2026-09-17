import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { getNewsBriefsForTrust, NEWS_BRIEFS_BY_SLUG } from "../client/src/data/newsBriefs";

describe("Wednesday 2026 payment-notice detailed articles", () => {
  const manville = NEWS_BRIEFS_BY_SLUG["manville-payment-percentage-increase-september-2026"];
  const explainer = NEWS_BRIEFS_BY_SLUG["understanding-2026-asbestos-trust-payment-percentage-notices"];

  it("keeps the Manville 5.6 percent update tied to its administrator announcement", () => {
    expect(manville).toBeDefined();
    expect(manville.sourceUrl).toBe("https://www.claimsres.com/2026/09/03/manville-increase-in-the-pro-rata-payment-percentage/");
    expect(manville.markdown).toContain("5.1% to 5.6%");
    expect(manville.markdown).toContain("September 2, 2026");
    expect(manville.markdown).toContain("does **not** publish a new Manville balance-sheet figure");
    expect(manville.markdown).toContain("No article-specific attorney review is recorded");
    expect(getNewsBriefsForTrust("manville-personal-injury-settlement-trust")).toContain(manville);
  });

  it("distinguishes rate changes, pending-consent rates, and a reconsideration without collapsing sub-account scope", () => {
    expect(explainer).toBeDefined();
    expect(explainer.markdown).toContain("Babcock & Wilcox");
    expect(explainer.markdown).toContain("T&N Sub-Account");
    expect(explainer.markdown).toContain("Armstrong");
    expect(explainer.markdown).toContain("not a new payment percentage");
    expect(explainer.markdown).toContain("No article-specific attorney review is recorded");
  });

  it("provides matching source-linked News cards for both detailed articles", () => {
    const manvilleDraft = readFileSync("client/src/data/news-drafts/2026-09-09-manville-payment-percentage-increase.md", "utf8");
    const explainerDraft = readFileSync("client/src/data/news-drafts/2026-09-09-payment-percentage-notices-explainer.md", "utf8");

    expect(manvilleDraft).toContain("category: payment_change");
    expect(manvilleDraft).toContain("full source-linked brief");
    expect(explainerDraft).toContain("category: payment_change");
    expect(explainerDraft).toContain("full source-linked explainer");
  });
});

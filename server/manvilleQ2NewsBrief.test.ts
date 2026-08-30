import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { NEWS_BRIEFS_BY_SLUG } from "../client/src/data/newsBriefs";

describe("Manville Q2 2026 detailed news brief", () => {
  const brief = NEWS_BRIEFS_BY_SLUG["manville-q2-2026-financial-statements"];

  it("publishes the verified filing facts with a durable source link", () => {
    expect(brief).toBeDefined();
    expect(brief.sourceUrl).toContain("Manville-Q2-2026-Financial-Statements-Doc4480");
    expect(brief.markdown).toContain("$570,516,505");
    expect(brief.markdown).toContain("1,041,171");
    expect(brief.markdown).toContain("$13,891,553");
  });

  it("clearly distinguishes quarter-end equity from the tracker payout series", () => {
    expect(brief.markdown).toContain("$30,033,989,206");
    expect(brief.markdown).toContain("Neither number should be substituted for the other");
  });

  it("has a matching news-feed draft that routes readers to the detailed brief", () => {
    const draft = readFileSync("client/src/data/news-drafts/2026-08-29-manville-q2-2026-financial-statements.md", "utf8");
    expect(draft).toContain("category: annual_report");
    expect(draft).toContain("1,041,171");
    expect(draft).toContain("full source-linked brief");
  });

  it("is surfaced from the Manville trust-detail related-news section", () => {
    const detailPage = readFileSync("client/src/pages/TrustDetail.tsx", "utf8");
    expect(detailPage).toContain("manville-personal-injury-settlement-trust");
    expect(detailPage).toContain("manville-q2-2026-financial-statements");
    expect(detailPage).toContain("href={`/news/${detailedBrief.slug}`}");
    expect(detailPage).toContain("isLoading && !detailedBrief");
  });
});

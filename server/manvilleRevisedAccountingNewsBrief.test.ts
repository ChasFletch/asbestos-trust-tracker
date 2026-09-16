import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { getNewsBriefsForTrust, NEWS_BRIEFS_BY_SLUG } from "../client/src/data/newsBriefs";

describe("Manville revised 2025 Trustee’s Accounting detailed news brief", () => {
  const brief = NEWS_BRIEFS_BY_SLUG["manville-revised-2025-trustees-accounting"];

  it("uses the public revised 2025 account for its annual cash-payment facts", () => {
    expect(brief).toBeDefined();
    expect(brief.sourceUrl).toBe("https://mantrust.claimsres.com/wp-content/uploads/2026/09/Trustees-Accounting-2025__final-REVISED.pdf");
    expect(brief.sourceCutoffAt).toBe("2025-12-31");
    expect(brief.markdown).toContain("18,413");
    expect(brief.markdown).toContain("$56,311,218");
    expect(brief.markdown).toContain("$563,345,749");
  });

  it("keeps annual cash payments distinct from later equity and the cumulative liquidated-claims convention", () => {
    expect(brief.markdown).toContain("$570,516,505 as of June 30, 2026");
    expect(brief.markdown).toContain("not a pure cumulative cash-paid total");
    expect(brief.markdown).toContain("does **not** supersede the later Q2 2026 figure");
  });

  it("does not invent a reason or legal significance for the revised label", () => {
    expect(brief.markdown).toContain("do not explain the reason for the revision");
    expect(brief.markdown).toContain("No article-specific attorney review is recorded");
    expect(getNewsBriefsForTrust("manville-personal-injury-settlement-trust")).toContain(brief);
    expect(readFileSync("client/public/sitemap.xml", "utf8")).toContain(
      "https://asbestostrusts.org/news/manville-revised-2025-trustees-accounting",
    );
    const card = readFileSync("client/src/data/news-drafts/2026-09-16-manville-revised-2025-trustees-accounting.md", "utf8");
    expect(card).toContain("$56,311,218");
    expect(card).toContain("full source-linked brief");
  });

  it("labels the annual accounting accurately in the detailed-news template", () => {
    const detailTemplate = readFileSync("client/src/pages/NewsDetail.tsx", "utf8");
    expect(detailTemplate).toContain('brief.category === "annual_report" ? "Filed annual report"');
    expect(detailTemplate).not.toContain('brief.category === "annual_report" ? "Filed quarterly report"');
  });
});

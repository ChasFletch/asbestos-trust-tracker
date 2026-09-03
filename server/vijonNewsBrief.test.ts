import { describe, expect, it } from "vitest";
import { NEWS_BRIEFS_BY_CARD_TITLE, NEWS_BRIEFS_BY_SLUG } from "../client/src/data/newsBriefs";

describe("Vi-Jon detailed news brief", () => {
  const brief = NEWS_BRIEFS_BY_SLUG["vijon-chapter11-talc-trust"];

  it("provides a source-linked article that distinguishes a proposal from an operational trust", () => {
    expect(brief).toBeDefined();
    expect(brief.sourceUrl).toBe("https://omniagentsolutions.com/Vi-Jon");
    expect(brief.markdown).toContain("Case No. **26-11216 (MFW)**");
    expect(brief.markdown).toContain("subject to Bankruptcy Court approval and other conditions");
    expect(brief.markdown).toContain("not as an operating trust");
    expect(brief.markdown).toContain("$25 million");
  });

  it("uses WikiMesothelioma and Asbestos Atlas as clearly scoped background sources", () => {
    expect(brief.markdown).toContain("wikimesothelioma.com/wiki/Asbestos_Trust_Funds");
    expect(brief.markdown).toContain("https://asbestosatlas.org/");
    expect(brief.markdown).toContain("not a source for Vi-Jon’s case-specific filings");
    expect(brief.markdown).toContain("does not establish the status, funding, or legal effect");
  });

  it("uses the existing News-card identifier as its canonical internal destination", () => {
    expect(brief.slug).toBe("vijon-chapter11-talc-trust");
    expect(brief.keywords).toContain("Vi-Jon Chapter 11");
    expect(NEWS_BRIEFS_BY_CARD_TITLE["Vi-Jon Files Chapter 11 to Channel Talc Claims into 524(g) Trust"]?.slug)
      .toBe("vijon-chapter11-talc-trust");
  });
});

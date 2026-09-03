import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { NEWS_BRIEFS_BY_SLUG } from "../client/src/data/newsBriefs";

describe("Hopeman Brothers detailed news article", () => {
  const slug = "hopeman-brothers-plan-confirmed";
  const brief = NEWS_BRIEFS_BY_SLUG[slug];

  it("publishes a court-sourced article with a stable canonical destination", () => {
    expect(brief).toBeDefined();
    expect(brief.sourceUrl).toBe("https://www.veritaglobal.net/hopeman/document/2432428260820000000000005");
    expect(brief.markdown).toContain("Docket No. 1542");
    expect(brief.markdown).toContain("Docket No. 1549");
    expect(brief.markdown).toContain("Case No. 26-2188");
  });

  it("does not misstate plan confirmation as an operating or open trust", () => {
    expect(brief.markdown).toContain("that a trust is currently operating, that claimants can file with it");
    expect(brief.markdown).toContain("not list Hopeman as an operating trust");
    expect(brief.markdown).toContain("do not provide a public asbestos-trust portal");
    expect(brief.markdown).toContain("does not repeat circulating proposed-funding estimates as a current trust balance");
  });

  it("links the matching news card to the internal article while preserving the primary source link", () => {
    const newsPage = readFileSync("client/src/pages/News.tsx", "utf8");
    const sitemap = readFileSync("client/public/sitemap.xml", "utf8");
    expect(newsPage).toContain("NEWS_BRIEFS_BY_SLUG[item.slug]");
    expect(newsPage).toContain("Read more");
    expect(newsPage).toContain("Source <ExternalLink");
    expect(sitemap).toContain("https://asbestostrusts.org/news/hopeman-brothers-plan-confirmed");
  });
});

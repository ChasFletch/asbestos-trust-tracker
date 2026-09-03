import { describe, expect, it } from "vitest";
import { NEWS_BRIEFS_BY_SLUG } from "../client/src/data/newsBriefs";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

describe("Owens-Illinois detailed news brief", () => {
  const brief = NEWS_BRIEFS_BY_SLUG["owens-illinois-payment-percentage-increase"];

  it("maps the existing Owens-Illinois card slug to a source-linked detailed article", () => {
    expect(brief).toBeDefined();
    expect(brief.title).toContain("65%");
    expect(brief.sourceUrl).toBe("/manus-storage/OI-Trust-Payment-Percentage-Increase-2026-08-19_418b2c7d.pdf");
    expect(brief.markdown).toContain("increased its payment percentage from **50% to 65%**");
    expect(brief.markdown).toContain("effective **August 19, 2026**");
  });

  it("keeps primary notice facts separate from individual outcome and balance claims", () => {
    expect(brief.markdown).toContain("supplemental payment");
    expect(brief.markdown).toContain("does not announce a new trust balance");
    expect(brief.markdown).toContain("does not attempt to calculate individual supplemental-payment amounts");
    expect(brief.markdown).toContain("not infer one from the percentage change");
  });

  it("uses WikiMesothelioma and Asbestos Atlas only as scoped supporting references", () => {
    expect(brief.markdown).toContain("https://wikimesothelioma.com/wiki/Asbestos_Trust_Funds");
    expect(brief.markdown).toContain("https://asbestosatlas.org/");
    expect(brief.markdown).toContain("does not determine the terms, eligibility, or payment outcome");
    expect(brief.markdown).toContain("does not establish the amount, payment percentage, claim status, or eligibility");
  });

  it("includes the canonical Owens-Illinois article route in the sitemap", () => {
    const sitemap = readFileSync(resolve(process.cwd(), "client/public/sitemap.xml"), "utf8");
    expect(sitemap).toContain("https://asbestostrusts.org/news/owens-illinois-payment-percentage-increase");
  });
});

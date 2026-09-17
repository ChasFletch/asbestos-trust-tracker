import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { NEWS_BRIEFS_BY_SLUG } from "../client/src/data/newsBriefs";

describe("Bestwall detailed news brief", () => {
  const brief = NEWS_BRIEFS_BY_SLUG["bestwall-scotus-cert-denial"];

  it("maps the existing Bestwall card slug to a detailed court-sourced article", () => {
    expect(brief).toBeDefined();
    expect(brief.title).toContain("Supreme Court Declines Bestwall Appeal");
    expect(brief.sourceUrl).toBe("https://www.supremecourt.gov/docket/docketfiles/html/public/25-1013.html");
    expect(brief.markdown).toContain("denied the petition for certiorari on June 1, 2026");
    expect(brief.markdown).toContain("Case No. 17-31795");
  });

  it("keeps the denial and active case distinct from an operational asbestos trust", () => {
    expect(brief.markdown).toContain("does **not** itself confirm a reorganization plan");
    expect(brief.markdown).toContain("do not establish a confirmed and effective §524(g) trust");
    expect(brief.markdown).toContain("watch-list Chapter 11 matter");
    expect(brief.markdown).toContain("not as an operating trust record");
  });

  it("uses WikiMesothelioma and Asbestos Atlas only as scoped supporting references", () => {
    expect(brief.markdown).toContain("https://wikimesothelioma.com/wiki/Asbestos_Trust_Funds");
    expect(brief.markdown).toContain("https://asbestosatlas.org/");
    expect(brief.markdown).toContain("does not source the Bestwall docket");
    expect(brief.markdown).toContain("does not establish Bestwall’s legal status");
  });

  it("includes the canonical Bestwall article route in the sitemap", () => {
    const sitemap = readFileSync(resolve(process.cwd(), "client/public/sitemap.xml"), "utf8");
    expect(sitemap).toContain("https://asbestostrusts.org/news/bestwall-scotus-cert-denial");
  });
});

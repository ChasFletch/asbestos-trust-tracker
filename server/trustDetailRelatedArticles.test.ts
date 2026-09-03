import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { getNewsBriefsForTrust } from "../client/src/data/newsBriefs";

describe("trust detail related-article modules", () => {
  it("links each detailed article only to explicitly reviewed trust records", () => {
    expect(getNewsBriefsForTrust("manville-personal-injury-settlement-trust").map((article) => article.slug)).toEqual([
      "manville-q2-2026-financial-statements",
    ]);
    expect(getNewsBriefsForTrust("paddock-enterprises-owens-illinois-asbestos-trust").map((article) => article.slug)).toEqual([
      "owens-illinois-payment-percentage-increase",
    ]);
    expect(getNewsBriefsForTrust("owens-corning-fibreboard-asbestos-pi-trust")).toEqual([]);
    expect(getNewsBriefsForTrust("bestwall-llc")).toEqual([]);
  });

  it("renders canonical internal destinations in an accessible related-article section", () => {
    const detailPage = readFileSync(resolve(process.cwd(), "client/src/pages/TrustDetail.tsx"), "utf8");

    expect(detailPage).toContain('aria-labelledby="related-articles-heading"');
    expect(detailPage).toContain("Related Articles");
    expect(detailPage).toContain("getNewsBriefsForTrust(slug)");
    expect(detailPage).toContain("href={`/news/${article.slug}`}");
    expect(detailPage).toContain("Read article");
    expect(detailPage).not.toContain('slug === "manville-personal-injury-settlement-trust"');
    expect(detailPage).not.toContain("trpc.news.byTrust.useQuery");
  });
});

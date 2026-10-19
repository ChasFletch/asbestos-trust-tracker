import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

type SubAccount = {
  name: string;
  value?: number;
  effective?: string;
  as_of?: string;
  noticeDate?: string;
  note?: string;
};

type TrustRecord = {
  name: string;
  shortName?: string;
  commonName?: string;
  paymentPercentage?: number | null;
  paymentPercentageFB?: number | null;
  paymentPercentageSource?: string;
  paymentPercentageSourceUrl?: string;
  paymentPercentageFBSourceUrl?: string;
  paymentPctSourceStatus?: string;
  paymentPctEffective?: string;
  paymentPctAsOf?: string;
  paymentPctNoticePublishedAt?: string;
  paymentPctImplementationStatus?: string;
  paymentPctTimingStatus?: string;
  paymentPctTimingNote?: string;
  paymentPctPresentation?: string;
  paymentPctImplementationNote?: string;
  paymentPctScopeNote?: string;
  paymentPctHistoricalNote?: string;
  paymentPctHistoricalSourceUrl?: string;
  subAccounts?: SubAccount[];
  website?: string;
};

type TrustFigures = { asOf: string; trusts: TrustRecord[] };

const root = process.cwd();
const figures = JSON.parse(
  readFileSync(resolve(root, "client/src/data/trust-figures.json"), "utf8")
) as TrustFigures;
const trustDetailSource = readFileSync(resolve(root, "client/src/pages/TrustDetail.tsx"), "utf8");
const trustsSource = readFileSync(resolve(root, "client/src/pages/Trusts.tsx"), "utf8");
const prefetchSource = readFileSync(resolve(root, "client/src/ssr/prefetch.ts"), "utf8");
const routerSource = readFileSync(resolve(root, "server/routers.ts"), "utf8");
const csvSource = readFileSync(resolve(root, "server/dataRoutes.ts"), "utf8");
const sitemap = readFileSync(resolve(root, "client/public/sitemap.xml"), "utf8");

function trust(name: string) {
  const result = figures.trusts.find((item) => item.name === name);
  expect(result, `Expected ${name} in the canonical dataset`).toBeDefined();
  return result!;
}

describe("trust provenance transparency", () => {
  it("does not describe every trust detail page as primary-sourced", () => {
    expect(prefetchSource).not.toContain("Primary-sourced from court filings and TDP documents.");
    expect(prefetchSource).toContain("paymentPercentageSourceUrl");
    expect(prefetchSource).toContain("A primary source URL for the recorded payment percentage has not yet been established.");
  });

  it("withholds a payment percentage where its date is not established", () => {
    const undated = figures.trusts.filter((item) =>
      item.paymentPercentage !== null &&
      item.paymentPercentage !== undefined &&
      !item.paymentPctEffective &&
      !item.paymentPctAsOf &&
      !item.paymentPctNoticePublishedAt
    );

    expect(undated.map((item) => item.name)).toEqual([
      "DII Industries (Halliburton/Harbison-Walker)",
      "Thorpe Insulation Company Asbestos Settlement Trust",
      "Plant Asbestos Settlement Trust",
      "Maremont Asbestos PI Trust",
      "Bondex (Specialty Products Holding Corp.) Trust",
      "Flintkote Asbestos Trust",
      "Motors Liquidation Co. (GM) Asbestos PI Trust",
      "H.K. Porter Asbestos Trust",
    ]);
    for (const item of undated) {
      expect(item.paymentPctTimingStatus).toBe("not_established");
      expect(item.paymentPctTimingNote).toContain("date");
    }

    expect(trustDetailSource).toContain("Rate date not established");
    expect(trustDetailSource).toContain("hasPaymentPercentageDate");
    expect(trustsSource).toContain("rate date not established");
    expect(trustsSource).toContain("paymentPercentageDate(trust)");
  });

  it("marks every rate without a source URL as not established instead of implying a primary source", () => {
    const withoutSourceUrl = figures.trusts.filter((item) =>
      item.paymentPercentage !== null &&
      item.paymentPercentage !== undefined &&
      !item.paymentPercentageSourceUrl
    );

    expect(withoutSourceUrl).toHaveLength(27);
    for (const item of withoutSourceUrl) {
      expect(item.paymentPctSourceStatus).toBe("not_established");
      expect(item.paymentPercentageSource).toContain("primary source URL");
    }
  });

  it("adds source URLs without overstating scope or finality for the October 19 rate-source release", () => {
    const abb = trust("ABB Lummus Global Inc. 524(g) Asbestos PI Trust");
    const asarco = trust("ASARCO Asbestos PI Settlement Trust");
    const acands = trust("ACandS Asbestos Settlement Trust");
    const artra = trust("ARTRA 524(g) Asbestos Trust");
    const federalMogul = trust("Federal-Mogul Asbestos PI Trust");

    expect(abb).toMatchObject({ paymentPercentage: 9.5, paymentPctEffective: "2024-01-01" });
    expect(abb.paymentPercentageSourceUrl).toContain("34ed7cf8");
    expect(abb.paymentPctScopeNote).toContain("TDP Determined");

    expect(asarco).toMatchObject({ paymentPercentage: 35, paymentPctAsOf: "2026-04-29" });
    expect(asarco.paymentPercentageSourceUrl).toContain("334d4a6c");
    expect(asarco.paymentPctScopeNote).toContain("does not state an effective date");

    expect(acands).toMatchObject({ paymentPercentage: 2.89, paymentPctEffective: "2026-05-11", paymentPctImplementationStatus: "proposed_pending_tac_fcr_consent" });
    expect(acands.paymentPercentageSourceUrl).toContain("308c0849");
    expect(acands.paymentPctImplementationNote).toContain("consent");

    expect(artra.paymentPctHistoricalNote).toContain("undated 0.50%");
    expect(artra.paymentPctHistoricalSourceUrl).toContain("Notice-of-Payment-Percentage.pdf");

    expect(federalMogul.paymentPctScopeNote).toContain("T&N Sub-Account");
    expect(federalMogul.paymentPctScopeNote).toContain("12.2%");
    expect(federalMogul.paymentPctScopeNote).toContain("not combined or averaged");

    const fmp = federalMogul.subAccounts?.find((account) => account.name === "FMP Sub-Account");
    expect(fmp).toMatchObject({ name: "FMP Sub-Account", value: 12.2, noticeDate: "2024-04-15" });
    expect(fmp?.effective).toBeUndefined();
    expect(fmp?.as_of).toBeUndefined();
    expect(fmp?.note).toContain("does not state an effective date");
  });

  it("keeps the tracker-wide snapshot date unchanged for a narrow source-and-qualifier release", () => {
    expect(figures.asOf).toBe("2026-10-08");
  });

  it("keeps Owens Corning and Fibreboard as separately sourced, separately dated rates", () => {
    const ocfb = trust("Owens Corning/Fibreboard Asbestos PI Trust");
    expect(ocfb.website).toBe("https://www.ocfbasbestostrust.com");
    expect(ocfb.paymentPercentage).toBe(4.3);
    expect(ocfb.paymentPercentageFB).toBe(3.5);
    expect(ocfb.paymentPctEffective).toBe("2026-06-30");
    expect(ocfb.paymentPctPresentation).toBe("dual_rate");
    expect(ocfb.paymentPercentageSourceUrl).toContain("OC-Subfund-Payment-Percentage-Notice");
    expect(ocfb.paymentPercentageFBSourceUrl).toContain("FB-Subfund-Payment-Percentage-Notice");
    expect(trustDetailSource).toContain("Two separate rates · not a trust-wide figure");
    expect(trustDetailSource).toContain("Source notices:");
  });

  it("exposes approved aliases and normalized G-I timing across the page, metadata, and CSV", () => {
    const owensIllinois = trust("Paddock Enterprises (Owens-Illinois) Asbestos Trust");
    const than = trust("T H Agriculture & Nutrition, L.L.C. Asbestos Personal Injury Trust (THAN)");
    const gaf = trust("G-I Holdings (GAF) Asbestos PI Settlement Trust");

    expect(owensIllinois.commonName).toBe("Owens-Illinois");
    expect(than.commonName).toBe("TH");
    expect(than.shortName).toBe("THAN Asbestos Trust");
    expect(gaf.paymentPctEffective).toBe("2022-11-22");
    expect(gaf.paymentPctImplementationStatus).toBe("announced_pending_implementation");
    expect(trustDetailSource).toContain("Also known as:");
    expect(trustsSource).toContain("trust.commonName ?");
    expect(prefetchSource).toContain('"alternateName": commonName');
    expect(prefetchSource).toContain('"dateModified": "2026-10-17"');
    expect(routerSource).toContain("commonName:");
    expect(csvSource).toContain('"commonName"');
    expect(csvSource).toContain('"paymentPctSourceStatus"');
  });

  it("includes a lastmod element for every trust detail URL in the sitemap", () => {
    const trustBlocks = sitemap.match(/<url>\s*<loc>https:\/\/asbestostrusts\.org\/trusts\/[^<]+<\/loc>[\s\S]*?<\/url>/g) ?? [];
    expect(trustBlocks).toHaveLength(55);
    for (const block of trustBlocks) {
      expect(block).toContain("<lastmod>2026-10-17</lastmod>");
    }
  });
});

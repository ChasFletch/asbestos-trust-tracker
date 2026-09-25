import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import trustFigures from "../client/src/data/trust-figures.json";
import { figureProvenance } from "../client/src/data/figureProvenance";

const root = process.cwd();
const sourcePdf = "https://leslie.mfrclaims.com/assets/documents/resources/LESLIE%20CONTROLS%20TRUST_Annual%20_Report_2025.pdf";
const paymentNotice = "https://leslie.mfrclaims.com/assets/documents/resources/Notice%20regarding%20Payment%20Percentage%20%287-14-25%29.pdf";

describe("Leslie Controls FY2025 filed asset update", () => {
  const leslie = trustFigures.trusts.find((trust) => trust.name === "Leslie Controls, Inc. Asbestos Personal Injury Trust");

  it("records the filed FY2025 net-claimants-equity figure without inventing a payment effective day", () => {
    expect(leslie).toMatchObject({
      netAssets: 63969328,
      assetsAsOf: "2025-12-31",
      assetsBasisUrl: sourcePdf,
      confidence: "filed",
      netAssetsConfidence: "filed",
      paymentPercentage: 6.25,
      paymentPctAsOf: "2025-07-14",
      paymentPctNoticePublishedAt: "2025-07-14",
      paymentPctConfidence: "filed",
      paymentPercentageSourceUrl: paymentNotice,
    });
    expect(leslie?.paymentPctEffective ?? null).toBeNull();
    expect(leslie?.assetsBasis).toContain("Doc 825");
    expect(leslie?.assetsBasis).toContain("p. 4");
  });

  it("reconciles the public asset floor and its filed-source subtotal", () => {
    const assetSum = trustFigures.trusts
      .filter((trust) => trust.netAssets != null && trust.status !== "closed")
      .reduce((total, trust) => total + (trust.netAssets ?? 0), 0);

    expect(trustFigures.asOf).toBe("2026-09-24");
    expect(assetSum).toBe(16097458607);
    expect(trustFigures.aggregate.remainingAssetsPoint).toBe(16097458607);
    expect(trustFigures.aggregate.remainingAssetsLow).toBe(16097458607);
    expect(trustFigures.aggregate.remainingAssetsHigh).toBe(21821068941);
    expect(trustFigures.aggregate.trustsWithFigures).toBe(44);
    expect(trustFigures.aggregate.remainingAssetsPointMethodology).toContain("20 from filed");
    expect(trustFigures.aggregate.remainingAssetsPointMethodology).toContain("$8,282,454,424");
  });

  it("exposes a direct annual-report link and public provenance trail", () => {
    const provenance = figureProvenance.find((entry) => entry.id === "2026-09-24-leslie-controls-filed-assets");
    expect(provenance).toMatchObject({
      priorValue: "$16,033,489,279 across 43 records",
      currentValue: "$16,097,458,607 across 44 records",
    });
    expect(provenance?.sources).toContainEqual(expect.objectContaining({
      url: sourcePdf,
      evidenceClass: "a",
    }));

    const methodology = readFileSync(resolve(root, "client/src/pages/Methodology.tsx"), "utf8");
    const llms = readFileSync(resolve(root, "client/public/llms.txt"), "utf8");
    const corrections = readFileSync(resolve(root, "client/src/pages/Corrections.tsx"), "utf8");
    const trustDetail = readFileSync(resolve(root, "client/src/pages/TrustDetail.tsx"), "utf8");
    expect(methodology).toContain("$16,097,458,607");
    expect(methodology).toContain("44 of the tracker&apos;s 54 active records");
    expect(llms).toContain("2026-09-24");
    expect(llms).toContain("$16,097,458,607");
    expect(corrections).toContain("Leslie Controls, Inc. Asbestos Personal Injury Trust");
    expect(trustDetail).toContain("About Leslie Controls' July 2025 payment-cycle qualification");
    expect(trustDetail).toContain("The July 14, 2025 notice confirms the 6.25% rate");
    expect(trustDetail).toContain("does not give a specific calendar effective day");
  });
});

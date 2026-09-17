import { describe, expect, it } from "vitest";
import trustFigures from "../client/src/data/trust-figures.json";
import { figureProvenance } from "../client/src/data/figureProvenance";
import { primarySourceDocumentsBySlug } from "../client/src/data/primarySourceDocuments";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const trustByName = (name: string) => trustFigures.trusts.find((trust) => trust.name === name);
const root = process.cwd();
const llms = readFileSync(resolve(root, "client/public/llms.txt"), "utf8");
const prefetch = readFileSync(resolve(root, "client/src/ssr/prefetch.ts"), "utf8");

describe("August 29, 2026 primary-source trust update", () => {
  it("corrects Owens-Illinois to the filed 65% payment percentage", () => {
    const paddock = trustByName("Paddock Enterprises (Owens-Illinois) Asbestos Trust");

    expect(paddock).toMatchObject({
      paymentPercentage: 65,
      paymentPctEffective: "2026-08-19",
      direction: "up",
      confidence: "filed",
      paymentPctConfidence: "filed",
    });
    expect(paddock?.paymentPercentageSource).toContain("50 to 65%");
    expect(paddock?.paymentPercentageSourceUrl).toContain("O-I-Trust-Notice-re-Increase-Payment-Percentage");
    expect(primarySourceDocumentsBySlug["paddock-enterprises-owens-illinois-asbestos-trust"]?.map((document) => document.url)).toContain(
      "/manus-storage/OI-Trust-Payment-Percentage-Increase-2026-08-19_418b2c7d.pdf"
    );
  });

  it("uses Manville's Q2 filed equity figures and the later source-verified payment-increase notice", () => {
    const manville = trustByName("Manville Personal Injury Settlement Trust");

    expect(manville).toMatchObject({
      netAssets: 570516505,
      assetsAsOf: "2026-06-30",
      cumulativePaid: 5343613806,
      cumulativePaidAsOf: "2026-06-30",
      cumulativeClaims: 1041171,
      paymentPercentage: 5.6,
      paymentPctEffective: "2026-09-02",
      paymentPctAsOf: "2026-09-02",
      paymentPctNoticePublishedAt: "2026-09-03",
      paymentPctConfidence: "filed",
      direction: "up",
    });
    expect(manville?.cumulativePaidSource).toContain("Total Trust Liquidated Claims");
    expect(manville?.cumulativePaidSource).toContain("unpaid claims");
    expect(manville?.assetsBasisUrl).toBe("/manus-storage/Manville-Q2-2026-Financial-Statements-Doc4480_0eacb16f.pdf");
    expect(primarySourceDocumentsBySlug["manville-personal-injury-settlement-trust"]?.map((document) => document.url)).toContain(
      "/manus-storage/Manville-Q2-2026-Financial-Statements-Doc4480_0eacb16f.pdf"
    );
    expect(manville?.paymentPercentageSource).toContain("from 5.1% to 5.6%");
    expect(manville?.paymentPercentageSourceUrl).toBe(
      "https://www.claimsres.com/2026/09/03/manville-increase-in-the-pro-rata-payment-percentage/"
    );
  });

  it("reconciles current aggregate and bottom-up payout totals", () => {
    expect(trustFigures.asOf).toBe("2026-09-03");
    expect(trustFigures.aggregate.remainingAssetsPoint).toBe(16033489279);
    expect(trustFigures.aggregate.cumulativePayoutsBottomUp).toBe(30033989206);
    expect(trustFigures.aggregate.cumulativePayoutsBottomUpFiled).toBe(17124219757);
    expect(trustFigures.bottomUpPayouts.headlineTotal).toBe(30033989206);
    expect(trustFigures.bottomUpPayouts.tiers.filed.amount).toBe(17124219757);

    const assetSum = trustFigures.trusts.reduce((total, trust) => total + (trust.netAssets ?? 0), 0);
    const filedSum = trustFigures.bottomUpPayouts.tiers.filed.components.reduce((total, component) => total + component.amount, 0);
    expect(assetSum).toBe(trustFigures.aggregate.remainingAssetsPoint);
    expect(filedSum).toBe(trustFigures.aggregate.cumulativePayoutsBottomUpFiled);
  });

  it("adds the two current source updates to the public figure timeline", () => {
    const currentEntries = figureProvenance.filter((entry) => entry.date === "2026-08-29");

    expect(currentEntries).toHaveLength(2);
    expect(currentEntries.some((entry) => entry.currentValue === "$16,018,528,449")).toBe(true);
    expect(currentEntries.some((entry) => entry.currentValue === "65%, effective August 19, 2026")).toBe(true);
  });

  it("keeps crawler-facing canonical figures and the payment-percentage range current", () => {
    expect(llms).toContain("$16,033,489,279");
    expect(llms).toContain("43 of 54 active tracker records");
    expect(llms).toContain("$30,033,989,206");
    expect(llms).toContain("0.7% (ARTRA) to 100% (NARCO)");
    expect(llms).not.toContain("100% (NARCO; Paddock)");
    expect(prefetch).toContain("Owens-Illinois increased from 50% to 65% effective August 19, 2026");
    expect(prefetch).toContain("$17,124,219,757");
  });
});

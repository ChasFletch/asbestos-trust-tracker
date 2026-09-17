import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import trustFigures from "../client/src/data/trust-figures.json";

type KaiserRecord = {
  name: string;
  netAssets: number;
  assetsAsOf: string;
  assetsBasis: string;
  paymentPercentage: number;
  paymentPctEffective: string;
  hasDiseaseLevelScheduledValueMatrix: boolean;
  paymentPercentageBasisLabel: string;
  scheduledValues?: unknown;
  cumulativePaid: number | null;
  cumulativePaidCalculation?: string;
  cumulativePaidExplanation: {
    text: string;
    source: string;
    sourceUrl: string;
  };
  claimMechanics: {
    source: string;
    sourceUrl: string;
    deductibleTiers: Array<{ firstExposure: string; deductible: number }>;
    insuredSummary: string;
    uninsuredSummary: string;
  };
  claimsActivity: {
    asOf: string;
    insuredAddedSinceInception: number;
    statuses: Array<{ label: string; count: number }>;
    unnamedStatusCount: number;
    uninsuredFiled: number;
    caveat: string;
    uninsuredNote: string;
  };
  filingWindows: {
    source: string;
    uninsuredClaims: string;
    uninsuredPortionsOfInsuredClaims: string;
    caveat: string;
  };
};

const kaiser = trustFigures.trusts.find(
  trust => trust.name === "Kaiser Gypsum Asbestos PI Trust"
) as KaiserRecord | undefined;

const projectRoot = resolve(import.meta.dirname, "..");
const detailPage = readFileSync(
  resolve(projectRoot, "client/src/pages/TrustDetail.tsx"),
  "utf8"
);
const router = readFileSync(resolve(projectRoot, "server/routers.ts"), "utf8");

describe("Kaiser Gypsum trust profile enhancement", () => {
  it("preserves the verified headline figures and fixes the Doc 2927 filing date at the dataset source", () => {
    expect(kaiser).toBeDefined();
    expect(kaiser?.netAssets).toBe(63_680_663);
    expect(kaiser?.assetsAsOf).toBe("2025-12-31");
    expect(kaiser?.paymentPercentage).toBe(62);
    expect(kaiser?.paymentPctEffective).toBe("2026-05-19");
    expect(kaiser?.assetsBasis).toContain("Doc 2927 PDF p.12 of 24");
    expect(kaiser?.assetsBasis).toContain("filed 2026-04-23");
    expect(kaiser?.assetsBasis).not.toContain("filed 2026-04-24");
  });

  it("models Kaiser as a no-scheduled-value-matrix trust with the three TDP deductible tiers", () => {
    expect(kaiser?.hasDiseaseLevelScheduledValueMatrix).toBe(false);
    expect(kaiser?.paymentPercentageBasisLabel).toBe(
      "not tied to a disease-level scheduled-value matrix"
    );
    expect(kaiser?.scheduledValues).toBeUndefined();
    expect(kaiser?.claimMechanics.source).toContain("printed pp.20–23");
    expect(kaiser?.claimMechanics.deductibleTiers).toEqual([
      { firstExposure: "On or before December 31, 1975", deductible: 5_000 },
      { firstExposure: "January 1, 1976–March 31, 1981", deductible: 50_000 },
      { firstExposure: "April 1, 1981–March 31, 1983", deductible: 100_000 },
    ]);
    expect(kaiser?.claimMechanics.uninsuredSummary).toContain(
      "pre-petition tort-system history"
    );
    expect(kaiser?.claimMechanics.uninsuredSummary).toContain(
      "does not publish a disease-level scheduled-value matrix"
    );
  });

  it("keeps the FIFO status disclosure explicitly non-exhaustive and does not infer why uninsured filings are zero", () => {
    const activity = kaiser?.claimsActivity;
    expect(activity?.asOf).toBe("2025-12-31");
    expect(activity?.insuredAddedSinceInception).toBe(783);
    const namedStatusTotal = activity?.statuses.reduce(
      (sum, status) => sum + status.count,
      0
    );
    expect(namedStatusTotal).toBe(735);
    expect(
      (activity?.insuredAddedSinceInception ?? 0) - (namedStatusTotal ?? 0)
    ).toBe(48);
    expect(activity?.unnamedStatusCount).toBe(48);
    expect(activity?.caveat).toContain("not an exhaustive breakdown");
    expect(activity?.uninsuredFiled).toBe(0);
    expect(activity?.uninsuredNote).toContain("published in early 2024");
    expect(activity?.uninsuredNote).toContain("does not establish why");
  });

  it("leaves cumulative paid blank and refuses to manufacture a total from conflicting annual disclosures", () => {
    expect(kaiser?.cumulativePaid).toBeNull();
    expect(kaiser?.cumulativePaidCalculation).toBeUndefined();
    expect(kaiser?.cumulativePaidExplanation.text).toContain(
      "No inception-to-date cumulative dollar total is disclosed"
    );
    expect(kaiser?.cumulativePaidExplanation.text).toContain(
      "does not calculate a substitute"
    );
    expect(kaiser?.cumulativePaidExplanation.source).toContain(
      "pp.5 and 23 of 24"
    );
  });

  it("preserves claim-category scoping in the approved filing-window copy", () => {
    expect(kaiser?.filingWindows.source).toContain(
      "§5.1(a)(2), printed pp.11–12"
    );
    expect(kaiser?.filingWindows.uninsuredClaims).toContain(
      "three years after the six-month anniversary"
    );
    expect(kaiser?.filingWindows.uninsuredClaims).toContain(
      "whichever occurs later"
    );
    expect(kaiser?.filingWindows.uninsuredPortionsOfInsuredClaims).toContain(
      "uninsured portion of an Insured Asbestos Claim"
    );
    expect(kaiser?.filingWindows.uninsuredPortionsOfInsuredClaims).toContain(
      "within three years after the applicable insurer paid"
    );
    expect(kaiser?.filingWindows.caveat).toContain(
      "not a single universal deadline"
    );
  });

  it("passes the structured fields through the detail router and renders source-backed generic sections", () => {
    for (const field of [
      "hasDiseaseLevelScheduledValueMatrix",
      "paymentPercentageBasisLabel",
      "claimMechanics",
      "claimsActivity",
      "filingWindows",
      "cumulativePaidExplanation",
    ]) {
      expect(router).toContain(`${field}:`);
    }

    expect(detailPage).toContain("How This Trust Values Claims");
    expect(detailPage).toContain("Claims Activity");
    expect(detailPage).toContain("Filing Windows Depend on Claim Type");
    expect(detailPage).toContain("Non-exhaustive status disclosure");
    expect(detailPage).toContain(
      "trust.hasDiseaseLevelScheduledValueMatrix === false"
    );
    expect(detailPage).toContain("trust.cumulativePaid === null");
    expect(detailPage).toContain("trust.cumulativePaidExplanation");
  });
});

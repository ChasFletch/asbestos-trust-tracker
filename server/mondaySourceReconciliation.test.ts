import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const tracker = JSON.parse(readFileSync(new URL("../client/src/data/trust-figures.json", import.meta.url), "utf8"));

function trust(name: string) {
  return tracker.trusts.find((item: { name: string }) => item.name === name);
}

describe("Monday official-source reconciliation", () => {
  it("preserves the June 2026 T&N notice as Federal-Mogul's primary displayed rate source", () => {
    const federalMogul = trust("Federal-Mogul Asbestos PI Trust");
    expect(federalMogul).toMatchObject({
      paymentPercentage: 2.9,
      paymentPctAsOf: "2026-06-30",
      paymentPctEffective: "2026-06-30",
      paymentPercentageSourceUrl: expect.stringContaining("Notice-of-Payment-Percentage-Change-TN-Subfund"),
    });
    expect(federalMogul.paymentPercentageSource).toContain("FMP Sub-Account rate remains 12.2%");
  });

  it("records Armstrong's current-rate reconsideration notice without inventing an effective date", () => {
    const armstrong = trust("Armstrong World Industries Asbestos PI Trust");
    expect(armstrong).toMatchObject({
      paymentPercentage: 10.8,
      paymentPctAsOf: "2026-06-11",
      paymentPctEffective: null,
      paymentPercentageSourceUrl: expect.stringContaining("awi-notice-of-payment-percentage-reconsideration"),
    });
    expect(armstrong.paymentPercentageSource).toContain("not a new rate notice");
  });
});

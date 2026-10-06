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

  it("supersedes Armstrong's reconsideration notice with the October interim-rate notice and consent qualification", () => {
    const armstrong = trust("Armstrong World Industries Asbestos PI Trust");
    expect(armstrong).toMatchObject({
      paymentPercentage: 7.8,
      paymentPctAsOf: "2026-10-05",
      paymentPctEffective: "2026-10-05",
      paymentPctImplementationStatus: "proposed_pending_tac_fcr_consent",
      paymentPercentageSourceUrl: expect.stringContaining("AWI-Notice-re-Payment-Percentage-Reduction-10.5.26.pdf"),
    });
    expect(armstrong.paymentPercentageSource).toContain("requested that the TAC and FCR consent");
    expect(armstrong.paymentPctImplementationNote).toContain("Payments began on the proposed basis");
  });
});

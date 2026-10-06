import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const root = resolve(import.meta.dirname, "..");
const read = (relativePath: string) => readFileSync(resolve(root, relativePath), "utf8");

describe("Armstrong October 2026 payment percentage disclosure", () => {
  it("retains the official 7.8% proposal date and controlling notice without presenting consent as complete", () => {
    const figures = JSON.parse(read("client/src/data/trust-figures.json"));
    const armstrong = figures.trusts.find((trust: { name: string }) => trust.name === "Armstrong World Industries Asbestos PI Trust");

    expect(armstrong).toMatchObject({
      paymentPercentage: 7.8,
      paymentPctEffective: "2026-10-05",
      paymentPctNoticePublishedAt: "2026-10-05",
      paymentPctImplementationStatus: "proposed_pending_tac_fcr_consent",
      paymentPctConfidence: "filed",
      paymentPercentageSourceUrl: "https://www.armstrongworldasbestostrust.com/wp-content/uploads/2026/10/AWI-Notice-re-Payment-Percentage-Reduction-10.5.26.pdf",
    });
    expect(armstrong.paymentPctImplementationNote).toContain("TAC/FCR consent remains pending");
    expect(armstrong.paymentPctImplementationNote).toContain("within 30 days are paid at 10.8%");
  });

  it("labels the rate as interim and the October 5 date as a proposal, not a final adoption", () => {
    const detail = read("client/src/pages/TrustDetail.tsx");
    const prefetch = read("client/src/ssr/prefetch.ts");
    expect(detail).toContain('trust.paymentPctImplementationStatus === "proposed_pending_tac_fcr_consent"');
    expect(detail).toContain("Interim rate; consent pending.");
    expect(detail).toContain('"proposal dated" : "effective"');
    expect(detail).toContain("hasImplementedPaymentRate");
    expect(prefetch).toContain("proposed ${jsonTrust.paymentPercentage}% interim payment rate (TAC/FCR consent pending)");
  });
});

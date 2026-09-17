import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import trustFigures from "../client/src/data/trust-figures.json";

const root = resolve(import.meta.dirname, "..");
const dataRoutes = readFileSync(resolve(root, "server/dataRoutes.ts"), "utf8");

describe("trusts.csv payment-percent provenance", () => {
  it("exports current payment timing and notice provenance fields instead of dropping them", () => {
    for (const field of [
      "paymentPctEffective",
      "paymentPctAsOf",
      "paymentPctNoticePublishedAt",
      "paymentPercentageSourceUrl",
    ]) {
      expect(dataRoutes).toContain(`"${field}"`);
    }
  });

  it("retains the official September 3 Manville notice fields in the canonical dataset", () => {
    const manville = trustFigures.trusts.find(
      (trust) => trust.name === "Manville Personal Injury Settlement Trust"
    );

    expect(manville).toMatchObject({
      paymentPercentage: 5.6,
      paymentPctEffective: "2026-09-02",
      paymentPctAsOf: "2026-09-02",
      paymentPctNoticePublishedAt: "2026-09-03",
      paymentPercentageSourceUrl:
        "https://www.claimsres.com/2026/09/03/manville-increase-in-the-pro-rata-payment-percentage/",
    });
  });
});

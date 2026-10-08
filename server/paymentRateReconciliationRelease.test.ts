import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import trustFigures from "../client/src/data/trust-figures.json";
import { OFFICIAL_PAYMENT_NOTICES } from "../client/src/data/paymentNoticeHistory";

const root = resolve(import.meta.dirname, "..");
const read = (relativePath: string) => readFileSync(resolve(root, relativePath), "utf8");
const trust = (name: string) => {
  const found = (trustFigures.trusts as any[]).find((t) => t.name === name);
  if (!found) throw new Error(`missing trust ${name}`);
  return found;
};

describe("2026-10-08 bounded payment-rate reconciliation release", () => {
  it("publishes the six release-safe rates with effective dates and official sources", () => {
    expect(trust("API, Inc. Asbestos Settlement Trust")).toMatchObject({ paymentPercentage: 44, paymentPctEffective: "2026-09-01" });
    expect(trust("API, Inc. Asbestos Settlement Trust").paymentPctScopeNote).toContain("Enhanced Claims");
    expect(trust("Raytech (Raymark) Trust")).toMatchObject({ paymentPercentage: 1.35, paymentPctEffective: "2024-11-14" });
    expect(trust("Keene Creditors Trust")).toMatchObject({ paymentPercentage: 1.05, paymentPctEffective: "2024-10-24" });
    expect(trust("Burns and Roe Personal Injury Settlement Trust")).toMatchObject({ paymentPercentage: 36.87, paymentPctEffective: "2024-03-13" });
    expect(trust("Burns and Roe Personal Injury Settlement Trust").paymentPctScopeNote).toContain("cash-discount");
    expect(trust("Brauer 524(g) Asbestos Trust (Brauer Supply Company)")).toMatchObject({ paymentPercentage: 9.5, paymentPctEffective: "2023-04-01" });
    const than = trust("T H Agriculture & Nutrition, L.L.C. Asbestos Personal Injury Trust (THAN)");
    expect(than).toMatchObject({ paymentPercentage: 16.3, paymentPctEffective: "2026-09-01" });
    expect(than.paymentPctScopeNote).toContain("FIFO Payment Queue");
    expect(than.paymentPctScopeNote).toContain("supplemental payments");
    for (const name of [
      "API, Inc. Asbestos Settlement Trust",
      "Raytech (Raymark) Trust",
      "Keene Creditors Trust",
      "Burns and Roe Personal Injury Settlement Trust",
      "Brauer 524(g) Asbestos Trust (Brauer Supply Company)",
      "T H Agriculture & Nutrition, L.L.C. Asbestos Personal Injury Trust (THAN)",
    ]) {
      expect(trust(name).paymentPercentageSourceUrl).toMatch(/^https:\/\//);
    }
  });

  it("applies the packet's qualified presentation to the six conditional records", () => {
    const quigley = trust("Quigley Company Asbestos PI Trust");
    expect(quigley).toMatchObject({ paymentPercentage: 13.3, paymentPercentageFB: 3.3, paymentPctPresentation: "dual_rate", paymentPercentageLabel: "Non-Releasing", paymentPercentageFBLabel: "Releasing", paymentPctEffective: "2025-10-30" });
    expect(quigley.subAccounts.map((s: any) => s.value)).toEqual([13.3, 3.3]);

    const kaiser = trust("Kaiser Asbestos PI Trust");
    expect(kaiser).toMatchObject({ paymentPercentage: 10.6, paymentPctEffective: "2025-02-05", paymentPctImplementationStatus: "proposed_pending_tac_fcr_consent" });
    expect(kaiser.paymentPctImplementationNote).toContain("consent-pending");
    expect(kaiser.paymentPctImplementationNote).toContain("Not a final");

    const duro = trust("Duro Dyne Asbestos Personal Injury Trust");
    expect(duro.paymentPercentage).toBe(20);
    expect(duro.paymentPctScopeNote).toContain("40% is only a proposed rate");

    const ai = trust("A & I Corporation Asbestos Bodily Injury Trust");
    expect(ai.paymentPercentage).toBeNull();
    expect(ai.paymentPctHistoricalNote).toContain("not an operating payment rate");
    expect(ai.paymentPctHistoricalNote).toContain("8.46%");

    for (const name of ["Eagle-Picher Industries PI Settlement Trust", "A-Best Products Asbestos Trust"]) {
      const t = trust(name);
      expect(t.paymentPercentage).toBeNull();
      expect(t.paymentPctAvailability).toBe("not_publicly_reported");
      expect(t.paymentPctEffective).toBeUndefined();
      expect(t.paymentPctAvailabilityNote).toContain("No rate is inferred");
    }
  });

  it("logs every release record, leaves NGC unchanged, and exposes the qualifications to every projection", () => {
    const released = (trustFigures.changes as any[]).filter((c) => c.date === "2026-10-08");
    expect(released).toHaveLength(12);
    for (const c of released) expect(c.detail).toContain("approver: C.V.F.");
    expect(trust("NGC Bodily Injury Trust (National Gypsum)").paymentPercentage).toBe(45);
    expect(OFFICIAL_PAYMENT_NOTICES.find((n) => n.id === "kaiser-2025-02-05")?.effectiveDate).toBeUndefined();
    expect(OFFICIAL_PAYMENT_NOTICES.find((n) => n.id === "duro-dyne-2026-07-10")?.currentPercentage).toBe(20);

    const dataRoutes = read("server/dataRoutes.ts");
    for (const field of ["paymentPctScopeNote", "paymentPctHistoricalNote", "paymentPercentageFB", "paymentPercentageLabel", "paymentPercentageFBLabel"]) {
      expect(dataRoutes).toContain(`"${field}"`);
    }
    const router = read("server/routers.ts");
    expect(router).toContain("paymentPctScopeNote: (trust.paymentPctScopeNote ?? null)");
    expect(router).toContain("subAccounts: (Array.isArray(trust.subAccounts)");
    const detail = read("client/src/pages/TrustDetail.tsx");
    expect(detail).toContain('trust.paymentPctPresentation === "dual_rate"');
    expect(detail).toContain("Historical only — not a current payment rate.");
    expect(detail).toContain("Rate scope:");
    const list = read("client/src/pages/Trusts.tsx");
    expect(list).toContain("not publicly reported");
    expect(list).toContain("Separate Claimant-Group Payment Percentages");
    const prefetch = read("client/src/ssr/prefetch.ts");
    expect(prefetch).toContain("two separate payment rates");
    expect(prefetch).toContain("current payment percentage not publicly reported");
  });
});

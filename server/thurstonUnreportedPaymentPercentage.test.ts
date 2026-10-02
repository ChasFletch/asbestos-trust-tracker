import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const root = resolve(import.meta.dirname, "..");
const read = (relativePath: string) => readFileSync(resolve(root, relativePath), "utf8");

describe("C.E. Thurston payment-percentage availability", () => {
  it("keeps the public record explicitly unreported rather than inferring a rate", () => {
    const figures = JSON.parse(read("client/src/data/trust-figures.json"));
    const thurston = figures.trusts.find((trust: { name: string }) => trust.name === "C.E. Thurston & Sons Asbestos Trust");

    expect(thurston).toMatchObject({
      paymentPercentage: null,
      paymentPctAsOf: "2026-10-02",
      paymentPctAvailability: "not_publicly_reported",
      paymentPercentageSourceUrl: "https://www.claimsres.com/documents/c-e-thurston/",
    });
    expect(thurston.paymentPctAvailabilityNote).toContain("No rate is inferred");
    expect(thurston.note).toContain("50% is unverified");
  });

  it("renders a source-backed rate-unreported disclosure on the trust detail and makes it exportable", () => {
    const detail = read("client/src/pages/TrustDetail.tsx");
    const router = read("server/routers.ts");
    const dataRoutes = read("server/dataRoutes.ts");

    expect(detail).toContain('trust.paymentPctAvailability === "not_publicly_reported"');
    expect(detail).toContain("Not publicly reported");
    expect(detail).toContain("Current rate unavailable from official public materials.");
    expect(router).toContain("paymentPctAvailability: (trust.paymentPctAvailability ?? null)");
    expect(router).toContain("paymentPctAvailabilityNote: (trust.paymentPctAvailabilityNote ?? null)");
    expect(dataRoutes).toContain('"paymentPctAvailability", "paymentPctAvailabilityNote"');
  });
});

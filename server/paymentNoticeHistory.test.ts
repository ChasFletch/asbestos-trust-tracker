import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";
import { OFFICIAL_PAYMENT_NOTICES } from "../client/src/data/paymentNoticeHistory";

const root = path.resolve(import.meta.dirname, "..");
const read = (relativePath: string) => fs.readFileSync(path.join(root, relativePath), "utf8");

describe("official payment-notice history", () => {
  it("keeps every public history entry source-linked, scoped, and limited to reviewed official records", () => {
    expect(OFFICIAL_PAYMENT_NOTICES).toHaveLength(8);
    for (const item of OFFICIAL_PAYMENT_NOTICES) {
      expect(item.sourceUrl).toMatch(/^https:\/\//);
      expect(item.sourceLabel.length).toBeGreaterThan(20);
      expect(item.scope.length).toBeGreaterThan(15);
      expect(item.currentPercentage).toBeGreaterThanOrEqual(0);
      expect(item.trustSlug).not.toHaveLength(0);
    }
    expect(OFFICIAL_PAYMENT_NOTICES.find((item) => item.id === "manville-2026-09-03")).toMatchObject({ priorPercentage: 5.1, currentPercentage: 5.6, effectiveDate: "2026-09-02" });
    expect(OFFICIAL_PAYMENT_NOTICES.find((item) => item.id === "jt-thorpe-2026-09-18")).toMatchObject({ priorPercentage: 50, currentPercentage: 53.7, publishedDate: "2026-09-18" });
    expect(OFFICIAL_PAYMENT_NOTICES.find((item) => item.id === "jt-thorpe-2026-09-18")?.effectiveDate).toBeUndefined();
    expect(OFFICIAL_PAYMENT_NOTICES.find((item) => item.id === "armstrong-2026-06-11")?.effectiveDate).toBeUndefined();
    expect(OFFICIAL_PAYMENT_NOTICES.find((item) => item.id === "armstrong-2026-10-05")).toMatchObject({
      priorPercentage: 10.8,
      currentPercentage: 7.8,
      publishedDate: "2026-10-05",
      interimPaymentDate: "2026-10-05",
      trustSlug: "armstrong-world-industries-asbestos-pi-trust",
    });
    expect(OFFICIAL_PAYMENT_NOTICES.find((item) => item.id === "armstrong-2026-10-05")?.effectiveDate).toBeUndefined();
    expect(OFFICIAL_PAYMENT_NOTICES.find((item) => item.id === "federal-mogul-tn-2026-06-30")).toMatchObject({
      priorPercentage: 3.9,
      currentPercentage: 2.9,
      interimPaymentDate: "2026-06-30",
    });
    expect(OFFICIAL_PAYMENT_NOTICES.find((item) => item.id === "federal-mogul-tn-2026-06-30")?.effectiveDate).toBeUndefined();
    expect(OFFICIAL_PAYMENT_NOTICES.find((item) => item.id === "federal-mogul-tn-2026-06-30")?.summary).toContain("consent remains pending");
    const page = read("client/src/pages/PaymentNoticeHistory.tsx");
    expect(page).toContain("Proposed interim rate");
    expect(page).toContain("Proposal / interim-payment date");
    expect(read("client/src/pages/TrustDetail.tsx")).toContain('sa.implementationStatus === "proposed_pending_tac_fcr_consent"');
    const trustList = read("client/src/pages/Trusts.tsx");
    expect(trustList).toContain("interim · consent pending");
    expect(trustList).toContain("Interim payment rate; consent pending:");
    expect(OFFICIAL_PAYMENT_NOTICES.find((item) => item.id === "federal-mogul-tn-2026-06-30")?.scope).toContain("T&N Sub-Account only");
  });

  it("registers a crawler-visible, canonical route and does not describe the record as complete", () => {
    const page = read("client/src/pages/PaymentNoticeHistory.tsx");
    const app = read("client/src/App.tsx");
    const prefetch = read("client/src/ssr/prefetch.ts");
    const nav = read("client/src/components/SiteNav.tsx");
    const sitemap = read("client/public/sitemap.xml");
    expect(page).toContain("Official Payment-Notice History");
    expect(page).toContain("not a complete rate history");
    expect(app).toContain('path="/payment-notices"');
    expect(prefetch).toContain('clean === "/payment-notices"');
    expect(prefetch).toContain('canonicalPath: "/payment-notices"');
    expect(nav).toContain('href: "/payment-notices"');
    expect(sitemap).toContain("https://asbestostrusts.org/payment-notices");
  });
});

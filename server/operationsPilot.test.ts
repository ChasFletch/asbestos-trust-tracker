import { describe, expect, it } from "vitest";
import { LIVING_TRACKER_PILOT, monitoringBodyIsUsable, monitoringFetchTarget, pilotIsActive, registrySeedFromTracker, sourceGapCandidateId } from "./operationsPilot";
import { SOURCE_REGISTRY_OVERRIDES } from "./sourceRegistryOverrides";
import trustFigures from "../client/src/data/trust-figures.json";
import { MONTHLY_HISTORICAL_SOURCE_MINUTES, monthlyHistoricalSourceWorklist } from "../shared/historicalSourceBacklog";

describe("living-tracker pilot policy", () => {
  it("has a bounded Central-time 30-day pilot with no-charge and no-unreviewed-publication safeguards", () => {
    expect(LIVING_TRACKER_PILOT.startDate).toBe("2026-09-06");
    expect(LIVING_TRACKER_PILOT.endDate).toBe("2026-10-05");
    expect(LIVING_TRACKER_PILOT.timezone).toBe("America/Chicago");
    expect(LIVING_TRACKER_PILOT.noChargePacer).toBe(true);
    expect(LIVING_TRACKER_PILOT.publicationAuthority).toContain("Unreviewed automatic publication is prohibited");
    expect(LIVING_TRACKER_PILOT.researchOwner).toBe("Manus Research Desk");
    expect(LIVING_TRACKER_PILOT.researchBackupOwner).toBe("RON — independent verifier");
    expect(LIVING_TRACKER_PILOT.articleReviewPolicy).toContain("article-specific review actually occurred");
    expect(LIVING_TRACKER_PILOT.researchLimits).toContain("30 minutes");
    expect(LIVING_TRACKER_PILOT.usageLimits).toContain("No PACER purchases");
  });

  it("recognizes the approved pilot window in America/Chicago", () => {
    expect(pilotIsActive(new Date("2026-09-06T12:00:00Z"))).toBe(true);
    expect(pilotIsActive(new Date("2026-10-05T18:00:00Z"))).toBe(true);
    expect(pilotIsActive(new Date("2026-10-06T12:00:00Z"))).toBe(false);
  });

  it("builds a reviewed registry without treating missing source URLs as no-change findings", () => {
    const seed = registrySeedFromTracker({
      trusts: [
        { name: "Example Trust", website: "https://example-trust.org" },
        { name: "No Source Trust" },
        { name: "Manville Personal Injury Settlement Trust", paymentPercentageSourceUrl: "https://www.claimsres.com/notice" },
      ],
    });
    expect(seed.registered.some((entry) => entry.trustSlug === "example-trust")).toBe(true);
    expect(seed.registered.find((entry) => entry.trustSlug === "manville-personal-injury-settlement-trust")?.checkCadence).toBe("daily");
    expect(seed.registered.some((entry) => entry.id === "source-manville-official-announcement-feed")).toBe(true);
    expect(seed.sourceGaps).toEqual([{ trustSlug: "no-source-trust", trustName: "No Source Trust" }]);
  });

  it("uses bounded durable identifiers for source gaps with long trust names", () => {
    const id = sourceGapCandidateId("t-h-agriculture-nutrition-l-l-c-asbestos-personal-injury-trust-than");
    expect(id).toMatch(/^source-gap-[a-f0-9]{24}$/);
    expect(id.length).toBeLessThanOrEqual(64);
  });

  it("promotes reviewed public source registrations and preserves direct filed-document URLs", () => {
    const seed = registrySeedFromTracker({
      trusts: [
        { name: "A-Best Products Asbestos Trust" },
        { name: "ABB Lummus Global Inc. 524(g) Asbestos PI Trust", sourceUrl: "https://trust.example/filed-report.pdf" },
      ],
    });
    expect(Object.keys(SOURCE_REGISTRY_OVERRIDES)).toHaveLength(36);
    expect(seed.sourceGaps).toEqual([]);
    expect(seed.registered.find((entry) => entry.trustSlug === "a-best-products-asbestos-trust")?.sourceUrl)
      .toBe("https://www.abestasbestostrust.com/");
    expect(seed.registered.find((entry) => entry.trustSlug === "abb-lummus-global-inc-524-g-asbestos-pi-trust")?.sourceUrl)
      .toBe("https://www.abblummustrust.org/");
  });

  it("resolves every canonical trust record into a registered source or a reviewed override", () => {
    const seed = registrySeedFromTracker(trustFigures);
    expect(seed.sourceGaps).toEqual([]);
    expect(seed.registered).toHaveLength(trustFigures.trusts.length + 1);
  });

  it("keeps Keene's official CPF notice as the controlling source while using only its reviewed no-charge monitoring transport", () => {
    const seed = registrySeedFromTracker({ trusts: [{ name: "Keene Creditors Trust" }] });
    const keene = seed.registered.find((entry) => entry.trustSlug === "keene-creditors-trust");
    expect(keene?.sourceUrl).toBe("https://www.cpf-inc.com/keene-trust-payment-percentage2024");
    const target = monitoringFetchTarget({ trustSlug: keene?.trustSlug ?? null, sourceUrl: keene?.sourceUrl ?? "" });
    expect(target).toEqual({
      url: "https://r.jina.ai/https://www.cpf-inc.com/keene-trust-payment-percentage2024",
      usesTransport: true,
    });
    expect(monitoringBodyIsUsable("Title: Keene Trust Payment Percentage\nMarkdown Content:\nThe Trustee approved 1.05%.", true)).toBe(true);
    expect(monitoringBodyIsUsable("Title: News\nMarkdown Content:", true)).toBe(false);
  });

  it("keeps Bondex's CPF page as the controlling source while using its reviewed no-charge monitoring transport", () => {
    const seed = registrySeedFromTracker({ trusts: [{ name: "Bondex (Specialty Products Holding Corp.) Trust" }] });
    const bondex = seed.registered.find((entry) => entry.trustSlug === "bondex-specialty-products-holding-corp-trust");
    expect(bondex?.sourceUrl).toBe("https://www.cpf-inc.com/trusts/bondex-trust");
    expect(monitoringFetchTarget({ trustSlug: bondex?.trustSlug ?? null, sourceUrl: bondex?.sourceUrl ?? "" })).toEqual({
      url: "https://r.jina.ai/https://www.cpf-inc.com/trusts/bondex-trust",
      usesTransport: true,
    });
  });

  it("keeps Maremont's administrator portal as the controlling source while using its reviewed no-charge monitoring transport", () => {
    const seed = registrySeedFromTracker({ trusts: [{ name: "Maremont Asbestos PI Trust" }] });
    const maremont = seed.registered.find((entry) => entry.trustSlug === "maremont-asbestos-pi-trust");
    expect(maremont?.sourceUrl).toBe("https://maremont.mfrclaims.com/");
    expect(monitoringFetchTarget({ trustSlug: maremont?.trustSlug ?? null, sourceUrl: maremont?.sourceUrl ?? "" })).toEqual({
      url: "https://r.jina.ai/https://maremont.mfrclaims.com/",
      usesTransport: true,
    });
  });

  it("replaces only failed legacy hosts with verified official trust routes", () => {
    const seed = registrySeedFromTracker({
      trusts: [
        { name: "Quigley Company Asbestos PI Trust" },
        { name: "W.R. Grace Asbestos PI Trust" },
        { name: "Yarway Asbestos PI Trust" },
      ],
    });
    expect(seed.registered.find((entry) => entry.trustSlug === "quigley-company-asbestos-pi-trust")?.sourceUrl)
      .toBe("https://www.quigleytrust.com/");
    expect(seed.registered.find((entry) => entry.trustSlug === "w-r-grace-asbestos-pi-trust")?.sourceUrl)
      .toBe("https://www.wrgraceasbestostrust.com/");
    expect(seed.registered.find((entry) => entry.trustSlug === "yarway-asbestos-pi-trust")?.sourceUrl)
      .toBe("https://www.yarwaytrust.com/");
  });

  it("uses verified no-charge reader transports only to observe certificate- or CAPTCHA-limited official sources", () => {
    const cases = [
      ["raytech-raymark-trust", "https://www.cpf-inc.com/trusts/raytech-trust/"],
      ["eagle-picher-industries-pi-settlement-trust", "https://www.cpf-inc.com/trusts/epi-trust/"],
      ["united-gilsonite-ugl-asbestos-pi-trust", "https://www.ugltrust.com/"],
    ] as const;
    for (const [trustSlug, sourceUrl] of cases) {
      expect(monitoringFetchTarget({ trustSlug, sourceUrl })).toEqual({
        url: `https://r.jina.ai/${sourceUrl}`,
        usesTransport: true,
      });
    }
  });

  it("uses a ranked, no-charge historical-source worklist that fits the monthly research cap", () => {
    const worklist = monthlyHistoricalSourceWorklist();
    expect(worklist.map((item) => item.trustName)).toEqual([
      "Pittsburgh Corning Corporation Asbestos PI Trust",
      "Celotex Asbestos Settlement Trust",
      "Owens Corning/Fibreboard Asbestos PI Trust",
      "Armstrong World Industries Asbestos PI Trust",
      "United States Gypsum (USG) Asbestos Trust",
    ]);
    expect(worklist.reduce((total, item) => total + item.expectedMinutes, 0)).toBe(MONTHLY_HISTORICAL_SOURCE_MINUTES);
    expect(worklist.every((item) => /public|no-charge/i.test(item.noChargeResearchPath))).toBe(true);
  });
});

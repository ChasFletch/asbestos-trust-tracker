import { describe, expect, it } from "vitest";
import { LIVING_TRACKER_PILOT, pilotIsActive, registrySeedFromTracker, sourceGapCandidateId } from "./operationsPilot";

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
});

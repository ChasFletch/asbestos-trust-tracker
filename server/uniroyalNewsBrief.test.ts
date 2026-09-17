import { describe, expect, it } from "vitest";
import { NEWS_BRIEFS_BY_SLUG } from "../client/src/data/newsBriefs";

describe("Uniroyal detailed news brief", () => {
  const brief = NEWS_BRIEFS_BY_SLUG["uniroyal-disclosure-hearing-sept-10"];

  it("provides a source-linked article destination for the existing Uniroyal news card", () => {
    expect(brief).toBeDefined();
    expect(brief?.title).toContain("September 10");
    expect(brief?.sourceUrl).toBe("https://omniagentsolutions.com/Uniroyal");
    expect(brief?.markdown).toContain("September 10, 2026, at 11:30 a.m. EDT");
  });

  it("separates the official hearing calendar from unverified funding and an operational trust", () => {
    expect(brief?.markdown).toContain("does **not** establish that a plan has been confirmed");
    expect(brief?.markdown).toContain("approximately $31.5 million");
    expect(brief?.markdown).toContain("does **not** include that amount in its trust figures");
    expect(brief?.markdown).toContain("funded and operating asbestos trust");
  });

  it("uses WikiMesothelioma and Asbestos Atlas only as labeled supporting resources", () => {
    expect(brief?.markdown).toContain("https://wikimesothelioma.com/wiki/Asbestos_Trust_Funds");
    expect(brief?.markdown).toContain("That background does not establish the status of the Uniroyal proceedings");
    expect(brief?.markdown).toContain("https://asbestosatlas.org/");
    expect(brief?.markdown).toContain("not to the legal status or funding of the Uniroyal case");
  });
});

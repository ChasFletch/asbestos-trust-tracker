import { describe, expect, it } from "vitest";
import {
  DESIGNATED_LEGAL_REVIEWERS,
  PAUL_DANZIGER,
  ROD_DE_LLANO,
  RESEARCH_DESK,
} from "../client/src/data/researchDeskPeople";

describe("Research Desk attorney identities", () => {
  it("uses the verified Wikidata entities for the designated legal review team", () => {
    expect(PAUL_DANZIGER.wikidataUrl).toBe("https://www.wikidata.org/wiki/Q139044594");
    expect(ROD_DE_LLANO.wikidataUrl).toBe("https://www.wikidata.org/wiki/Q139044724");
  });

  it("preserves the two designated legal reviewers and the Research Desk author", () => {
    expect(DESIGNATED_LEGAL_REVIEWERS.map((reviewer) => reviewer.id)).toEqual([
      "paul-danziger",
      "rod-de-llano",
    ]);
    expect(RESEARCH_DESK.role).toBe("Research and editorial team");
  });

  it("does not repeat the unresolved Rod de Llano educational claim", () => {
    expect(ROD_DE_LLANO.credentials.join(" ")).not.toMatch(/Princeton|Northwestern|University of Texas School of Law/i);
  });
});

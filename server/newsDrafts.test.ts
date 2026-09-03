import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { parseNewsDraft } from "./dataRoutes";

describe("news draft parser", () => {
  it("uses the first body paragraph as the card summary instead of exposing metadata", () => {
    const draft = parseNewsDraft(
      "2026-08-29-owens-illinois-payment-percentage-increase.md",
      `# Owens-Illinois Trust Raises Payment Percentage to 65%
date: 2026-08-29
category: payment_percentage
url: https://example.com/notice.pdf

The **Owens-Illinois Asbestos Personal Injury Trust** increased its payment percentage from **50% to 65%**.

## Tracker update`
    );

    expect(draft).toMatchObject({
      date: "2026-08-29",
      category: "payment_percentage",
      title: "Owens-Illinois Trust Raises Payment Percentage to 65%",
      url: "https://example.com/notice.pdf",
    });
    expect(draft.summary).toBe("The Owens-Illinois Asbestos Personal Injury Trust increased its payment percentage from 50% to 65%.");
    expect(draft.summary).not.toContain("date:");
    expect(draft.summary).not.toContain("category:");
    expect(draft.summary).not.toContain("url:");
  });

  it("ends long card summaries at a complete sentence rather than a fixed character boundary", () => {
    const firstSentence = `The confirmation order provides for a newly created asbestos personal-injury trust and channels specified liabilities to that trust under its proposed permanent channeling injunction.[1]`;
    const draft = parseNewsDraft(
      "2026-09-03-sentence-safe-summary.md",
      `# Sentence-safe summary\ndate: 2026-09-03\ncategory: system_update\n\n${firstSentence} ${"A later sentence that should not appear in the card summary. ".repeat(15)}`
    );

    expect(draft.summary.length).toBeLessThanOrEqual(400);
    expect(draft.summary).toMatch(/\.$/);
    expect(draft.summary).toContain(firstSentence);
  });

  it("labels Uniroyal hearing dates as official case-agent information without presenting them as filed material", () => {
    const uniroyal = readFileSync(
      resolve(process.cwd(), "client/src/data/news-drafts/2026-09-03-uniroyal-disclosure-hearing-sept-10.md"),
      "utf8"
    );

    expect(uniroyal).toContain("official case-agent site");
    expect(uniroyal).toContain("official case-agent source for hearing dates");
    expect(uniroyal).toContain("not a substitute for the complete court record");
    expect(uniroyal).not.toContain("filed/case-agent");
  });

  it("keeps the Hopeman confirmation update tied to primary docket sources and out of operational-trust status", () => {
    const hopeman = readFileSync(
      resolve(process.cwd(), "client/src/data/news-drafts/2026-09-03-hopeman-brothers-plan-confirmed.md"),
      "utf8"
    );

    expect(hopeman).toContain("https://www.veritaglobal.net/hopeman/document/2432428260820000000000005");
    expect(hopeman).toContain("https://www.veritaglobal.net/hopeman/document/2432428260901000000000001");
    expect(hopeman).toContain("trust is open or accepting claims");
    expect(hopeman).toContain("not included in the tracker’s operating-trust figures");
    expect(hopeman).not.toContain("establishing an asbestos personal injury trust");
  });

  it("renders the Hopeman card summary as a complete first sentence", () => {
    const hopeman = readFileSync(
      resolve(process.cwd(), "client/src/data/news-drafts/2026-09-03-hopeman-brothers-plan-confirmed.md"),
      "utf8"
    );
    const draft = parseNewsDraft("2026-09-03-hopeman-brothers-plan-confirmed.md", hopeman);

    expect(draft.summary).toContain("proposed permanent channeling injunction.[1]");
    expect(draft.summary).not.toContain("Eastern Distri");
  });
});

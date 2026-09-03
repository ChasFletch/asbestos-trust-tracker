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
});

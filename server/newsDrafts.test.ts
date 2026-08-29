import { describe, expect, it } from "vitest";
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
});

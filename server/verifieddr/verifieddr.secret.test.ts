import { describe, expect, it } from "vitest";
import { VERIFIEDDR_CRAWLER_ENDPOINT } from "./verifieddrCrawler";

describe("VerifiedDR crawler token", () => {
  it("is configured with an accepted crawler-token prefix", () => {
    const token = process.env.VERIFIEDDR_CRAWLER_TOKEN;
    expect(token).toMatch(/^vdrcrawl_|^vdr_/);
  });

  it.runIf(process.env.RUN_LIVE_VERIFIEDDR_TESTS === "1")("is accepted by the lightweight source-registration endpoint", async () => {
    const token = process.env.VERIFIEDDR_CRAWLER_TOKEN;
    const response = await fetch(VERIFIEDDR_CRAWLER_ENDPOINT, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        "User-Agent": "AsbestosTrusts.org VerifiedDR secret validation",
      },
      body: JSON.stringify({ hostname: "asbestostrusts.org", provider: "server" }),
      signal: AbortSignal.timeout(10_000),
    });

    expect(response.ok).toBe(true);
  }, 12_000);
});

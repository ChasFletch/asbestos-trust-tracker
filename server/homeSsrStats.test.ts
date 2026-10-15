import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import {
  BW_CORRECTED_SUMMARY,
  BW_HOMEPAGE_NEWS_ID,
  BW_OBSOLETE_RECENCY_SUMMARY,
  shouldCorrectBAndWHomepageSummary,
} from "./db";

const homeSource = readFileSync(
  resolve(process.cwd(), "client/src/pages/Home.tsx"),
  "utf8"
);
const seedSource = readFileSync(resolve(process.cwd(), "seed.mjs"), "utf8");

describe("Homepage statistic SSR", () => {
  it("renders statistic targets in the initial SSR-compatible state", () => {
    expect(homeSource).toContain("const [value, setValue] = useState(target);");
    expect(homeSource).toContain("setValue(0);");
    expect(homeSource).toContain("{displayed}");
    expect(homeSource).not.toContain("{inView ? displayed : 0}");
  });

  it("includes the source-qualified Manville trust update with usable reader links", () => {
    expect(homeSource).toContain("Recent Trust Updates");
    expect(homeSource).toContain("Payment percentage increased from");
    expect(homeSource).toContain("5.1%");
    expect(homeSource).toContain("5.6%");
    expect(homeSource).toContain("/news/manville-payment-percentage-increase-september-2026");
    expect(homeSource).toContain("https://www.claimsres.com/2026/09/03/manville-increase-in-the-pro-rata-payment-percentage/");
    expect(homeSource).toContain("rel=\"noopener noreferrer\"");
  });

  it("keeps the B and W update without an unsupported system-wide recency claim", () => {
    expect(seedSource).toContain(
      "The B&W Asbestos Settlement Trust issued a payment percentage change notice reducing its rate from 4.7% to 4.3%, effective June 30, 2026."
    );
    expect(seedSource).not.toContain("This is the most recent payment percentage change in the entire asbestos trust system.");
  });

  it("limits the production B and W repair to the exact legacy row and summary", () => {
    expect(shouldCorrectBAndWHomepageSummary({ id: BW_HOMEPAGE_NEWS_ID, summary: BW_OBSOLETE_RECENCY_SUMMARY })).toBe(true);
    expect(shouldCorrectBAndWHomepageSummary({ id: BW_HOMEPAGE_NEWS_ID, summary: BW_CORRECTED_SUMMARY })).toBe(false);
    expect(shouldCorrectBAndWHomepageSummary({ id: 2, summary: BW_OBSOLETE_RECENCY_SUMMARY })).toBe(false);
  });
});

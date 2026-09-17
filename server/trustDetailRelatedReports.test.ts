import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { getRelatedReportIdsForTrust } from "../client/src/data/reportRelations";

describe("trust detail related research reports", () => {
  it("maps only trust pages with sustained direct report coverage", () => {
    expect(getRelatedReportIdsForTrust("manville-personal-injury-settlement-trust")).toEqual([
      "ATR-2026-Q3",
      "ATR-2026-Q2",
      "ATR-2026-Q1",
    ]);
    expect(getRelatedReportIdsForTrust("narco-asbestos-trust")).toEqual([
      "ATR-2026-Q3",
      "ATR-2026-Q2",
      "ATR-2026-Q1",
      "ATR-2025-Q4",
    ]);
    expect(getRelatedReportIdsForTrust("paddock-enterprises-owens-illinois-asbestos-trust")).toEqual([]);
    expect(getRelatedReportIdsForTrust("asbestos-trust-without-substantial-report-coverage")).toEqual([]);
  });

  it("renders canonical report links and prefetched report metadata for crawler visibility", () => {
    const detailPage = readFileSync(resolve(process.cwd(), "client/src/pages/TrustDetail.tsx"), "utf8");
    const prefetch = readFileSync(resolve(process.cwd(), "client/src/ssr/prefetch.ts"), "utf8");

    expect(detailPage).toContain('aria-labelledby="related-reports-heading"');
    expect(detailPage).toContain("Related Research Reports");
    expect(detailPage).toContain("getRelatedReportIdsForTrust(slug)");
    expect(detailPage).toContain("href={`/reports/${report.id}`}");
    expect(detailPage).toContain("Read report");
    expect(prefetch).toContain("const reportIds = getRelatedReportIdsForTrust(slug)");
    expect(prefetch).toContain("reportIds.length > 0 ? p.reportsIndex() : Promise.resolve(null)");
    expect(prefetch).toContain("getQueryKey(trpc.trustFiguresExtra.reportsIndex, undefined, \"query\")");
  });
});

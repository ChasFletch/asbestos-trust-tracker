import { describe, expect, it } from "vitest";
import { primarySourceDocumentsBySlug, sourceFilesByTrust } from "../client/src/data/primarySourceDocuments";
import { primarySourcePdfUrls } from "../client/src/data/primarySourcePdfUrls";

const intentionallyExcluded = new Set([
  // Duplicate binary variants of sources already mapped to the same trust.
  "cg-annual-report.pdf",
  "KG_Annual_Report_FY2025.pdf",
  "kg-annual-report.pdf",
  "KG_Resolution_Adjusted_PaymentPct_2026-05-19.pdf",
  "KG_TDP_2.pdf",
  "KG_TDP_amendment_20211022.pdf",
  // Case research for entities without an operating trust record in this dataset.
  "BESTWALL_ca4_241493_20250801.pdf",
  "DBMP_ca4_242109_20260211.pdf",
  "GARLOCK_CRP_5th_amendment.pdf",
  "GARLOCK_estimation_order_dkt3296.pdf",
  "GARLOCK_max_settlement_values_increase.pdf",
  "GARLOCK_opening_announcement.pdf",
]);

describe("primary source document library", () => {
  const documents = Object.values(primarySourceDocumentsBySlug).flat();

  it("maps every applicable verified artifact to an existing trust source panel", () => {
    const mappedUrls = new Set(documents.map((document) => document.url));
    const applicableUrls = Object.entries(primarySourcePdfUrls)
      .filter(([fileName]) => !intentionallyExcluded.has(fileName))
      .map(([, url]) => url);

    expect(mappedUrls.size).toBe(applicableUrls.length);
    expect([...mappedUrls].sort()).toEqual([...applicableUrls].sort());
  });

  it("provides a secure site-hosted PDF URL and readable label for every link", () => {
    for (const document of documents) {
      expect(document.url).toMatch(/^\/manus-storage\/[^\s]+\.pdf$/);
      expect(document.title.length).toBeGreaterThan(3);
      expect(document.documentType.length).toBeGreaterThan(3);
    }
  });

  it("preserves every trust-specific source list and its document count", () => {
    for (const [slug, fileNames] of Object.entries(sourceFilesByTrust)) {
      const renderedDocuments = primarySourceDocumentsBySlug[slug];
      expect(renderedDocuments, `missing document panel data for ${slug}`).toBeDefined();
      expect(renderedDocuments).toHaveLength(fileNames.length);
      expect(renderedDocuments.map((document) => document.url)).toEqual(
        fileNames.map((fileName) => primarySourcePdfUrls[fileName])
      );
      expect(renderedDocuments.every((document) => document.title && document.documentType)).toBe(true);
    }
  });
});

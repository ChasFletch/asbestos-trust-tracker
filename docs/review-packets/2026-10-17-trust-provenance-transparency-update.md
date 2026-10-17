# Trust Provenance Transparency Update

**Status:** Approved for implementation and release; validated locally October 17, 2026  
**Scope:** Trust-list and trust-detail payment-rate presentation, crawler metadata, CSV provenance fields, aliases, and trust-detail sitemap dates.  
**Authority:** Owner approval following the October 17, 2026 Ledger recommendation review.  
**Public data boundary:** This update does not change a payment percentage, net-asset figure, cumulative-payment figure, or trust status. It corrects the presentation and provenance status of existing fields.

## Purpose

The existing UI and server-rendered metadata could display every stored payment percentage as a current rate and describe every detail page as “Primary-sourced,” even when the record lacked an effective/as-of date or a primary-source URL. That presentation was broader than the evidence supported.

## Implemented changes

1. **Rate-date boundary.** A rate is now displayed as a current percentage only when the record supplies an effective date or as-of date. Eight records with a stored percentage but neither date now state that the rate date is not established rather than presenting a current percentage:
   - DII Industries (Halliburton/Harbison-Walker)
   - Thorpe Insulation Company Asbestos Settlement Trust
   - Plant Asbestos Settlement Trust
   - Maremont Asbestos PI Trust
   - Bondex (Specialty Products Holding Corp.) Trust
   - Flintkote Asbestos Trust
   - Motors Liquidation Co. (GM) Asbestos PI Trust
   - H.K. Porter Asbestos Trust

2. **Source-URL boundary.** Every non-null percentage without a `paymentPercentageSourceUrl` is now explicitly marked `paymentPctSourceStatus: "not_established"`; its source text says that a primary source URL has not yet been established. This is a provenance disclosure, not a finding that a rate is incorrect. After adding the two verified Owens Corning/Fibreboard notices described below, 30 percentage-bearing records remain in that category.

3. **Owens Corning/Fibreboard dual sub-accounts.** The record now links each sub-account rate to its own official June 30, 2026 notice and displays both notices separately. The notices say that the Trustees proposed the reductions, that TAC/FCR consent is required, and that the 4.3% Owens Corning rate and 3.5% Fibreboard rate apply during the consent process. The UI retains the “not a trust-wide figure” disclosure.
   - Owens Corning notice: <https://www.ocfbasbestostrust.com/wp-content/uploads/2026/06/OCFB.-OC-Subfund-Payment-Percentage-Notice.6.30.26-C1221413x9DB18-4933-6912-9401-v.1-4905-4767-3529.1.pdf>
   - Fibreboard notice: <https://www.ocfbasbestostrust.com/wp-content/uploads/2026/06/OCFB.-FB-Subfund-Payment-Percentage-Notice.6.30.26-C1221412x9DB18-4916-0109-8937.1.pdf>

4. **Aliases and source dates.** Trust presentation and SSR/JSON-LD now identify “Owens-Illinois” as the common name for the Paddock Enterprises record and “TH” as the common name for the THAN record. The G-I Holdings rate date is normalized from free text to `2022-11-22` while its pending-implementation qualification is retained. Trust-detail Article structured data now has `dateModified: 2026-10-17`; it uses alias information as `alternateName` where recorded.

5. **Crawler/export transparency.** The CSV includes aliases, rate-timing status/note, source-status, and separate Fibreboard source URL fields. The fixed sitemap has a `<lastmod>2026-10-17</lastmod>` element for each of its 55 trust-detail URLs.

## Explicitly preserved facts and limitations

- The Kaiser record remains a **10.6% interim rate pending consent**, with the February 5, 2025 official notice as the controlling reference for the reduction from 15.5%. The Corrections page’s reference to 15.5% identifies the *prior* rate; it does not claim that 15.5% is current.
- This update does not create a primary-source URL for any record lacking one and does not convert an undated stored percentage into a current rate.
- Existing net-asset “as of” labels and cumulative-payment historical-source labels remain in place. Their figures are not refreshed or reclassified by this update.
- The NGC 45%/40% official-source conflict remains separately unresolved and is not changed by this update.

## Validation

- TypeScript check passed.
- Full Vitest suite passed: 42 files, 154 tests; one opt-in crawler-token test remained skipped.
- Production build passed.
- Added `server/trustProvenanceTransparency.test.ts` to lock the date boundary, source-status disclosure, dual OCFB source links, aliases, G-I normalization, CSV projections, `dateModified`, and all 55 sitemap trust-detail `lastmod` elements.

## Correction history

| Date | Change | Reason |
|---|---|---|
| 2026-10-17 | Replaced blanket “Primary-sourced” trust-detail metadata language with source-conditional language. | Thirty percentage-bearing records lack a mapped primary-source URL. |
| 2026-10-17 | Withheld eight undated stored percentages from current-rate display. | A current rate requires an effective or as-of date. |
| 2026-10-17 | Added separate OCFB sub-account notice URLs and updated the effective date to June 30, 2026. | The verified official notices control the two separate, consent-pending payment terms. |

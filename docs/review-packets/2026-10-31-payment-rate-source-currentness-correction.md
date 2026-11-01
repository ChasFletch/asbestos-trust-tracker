# October 31, 2026 — Payment-Rate Source and Currentness Correction

**Classification:** Tier 1 routine tracker correction/update
**Status:** Validated release candidate; publication decision follows the project's Tier 1 routine-update process.
**Scope cutoff:** Official public materials retrieved or rechecked through October 31, 2026.
**Prepared by:** Manus research desk; no attorney, ANCHOR, or CLEO review is represented by this packet.

## Purpose

This correction resolves every tracker record that previously displayed a non-null payment percentage without a mapped `paymentPercentageSourceUrl`, except the three records for which a current official rate remains unresolved. It also corrects the Maremont rate from 28.4% to 34% and corrects source/currentness labels so historical notices, interim rates, and official conflicts are not presented as final current trust-wide rates.

## Included numeric change

| Trust | Old public field | New public field | Controlling source | Date/scope boundary |
|---|---:|---:|---|---|
| Maremont Asbestos PI Trust | 28.4% | **34%** | [Maremont Notice Regarding Payment Percentage (Sept. 29, 2026)](https://maremont.mfrclaims.com/assets/documents/resources/Maremont%20Trust_Notice%20Regarding%20Payment%20Percentage%20%289-29-2026%29.pdf) | Applies beginning with the September 2026 payment of claims; no calendar effective date stated. Shade Tree Mechanic Claims (Disease Level V) are excluded from supplemental payments, and no supplemental payment is made below $250. |

No financial, assets, cumulative-payment, aggregate, trust-status, or claim-count field changes are included.

## Source and qualifier corrections

### Current-rate or qualified official documents now mapped

| Trust | Tracker treatment after correction | Official source |
|---|---|---|
| United States Gypsum (USG) | 10% is retained as an **interim, TAC/FCR-consent-pending** rate; the unsupported 2006 effective date is removed. The June 30, 2026 notice’s cutoff exception is retained. | [USG Payment Percentage Notice (June 30, 2026)](https://www.usgasbestostrust.com/wp-content/uploads/2026/06/USG.-Payment-Percentage-Notice.6.30.26C1221411x9DB18-4915-8025-8745.2.pdf) |
| W.R. Grace | 30.1% remains qualified as proposed/interim pending consent; no final-effective-date claim. | [WRG April 17, 2025 notice](https://www.wrgraceasbestostrust.com/wp-content/uploads/2025/04/WRG-Payment-Percentage-Notice-4.17.25-C1357213x9DB18-002.pdf) |
| Combustion Engineering | 15.3% remains proposed/interim pending consent; the April 1, 2026 document date is not presented as an adopted effective date. | [CE April 1, 2026 notice](https://www.cetrust.org/assets/uploadedFiles/3cde7a07-3e42-463a-b8b7-71517496b679.pdf) |
| Babcock & Wilcox | 4.3% remains proposed/interim pending consent; the June 30, 2026 document date is not presented as a final effective date. | [B&W June 30, 2026 notice](https://www.bwasbestostrust.com/wp-content/uploads/2026/06/BW-Payment-Percentage-Notice.6.30.26-C1221410x9DB18-4901-7726-4057.1-1.pdf) |
| Yarway | 27.5% remains linked to its dated May 2024 notice; the later reconsideration notice is not treated as a replacement rate. | [Yarway May 2024 notice](https://www.yarwaytrust.com/assets/uploadedFiles/6cf5296d-f3ef-49eb-9226-eef43d6c3628.pdf) |
| Motors Liquidation Co. | 10.3% remains proposed/interim pending consent; a notice date is retained without an unsupported effective date. | [MLC December 2025 notice](https://www.claimsres.com/wp-content/uploads/December-3-2025-Payment-Percentage-Notice-MLC-Trust-4915-8509-0686.pdf) |
| ACandS | 2.89% remains proposed/interim pending consent; the May 11, 2026 notice and its release exception are retained. | [ACandS Payment Percentage Notice](https://www.acandsasbestostrust.com/assets/uploadedFiles/308c0849-826e-4c47-83ba-f74daeb899d6.pdf) |
| H.K. Porter | 3% is retained with the dated official rate source; it is not historical-only. | [H.K. Porter payment-percentage notice](https://www.hkporterasbestostrust.org/) |

The audit also reverified the existing direct official mappings for A.P. Green, ASARCO, A-Best, API, Duro Dyne, Eagle-Picher, Kaiser Gypsum, Keene, Owens Corning/Fibreboard, Raytech, and THAN. Those records are not assigned a new current-rate fact merely because a source link was rechecked.

### Historical-only, not current-rate proof

The following records now keep their official links for context but do **not** show the historical figure as a current payment rate in trust-list cards, trust-detail rate headlines, or crawler metadata:

- Bondex (Specialty Products Holding Corp.) Trust
- G-I Holdings (GAF) Asbestos PI Settlement Trust
- Hercules Chemical Co. Asbestos Settlement Trust
- United Gilsonite (UGL) Asbestos PI Trust
- United States Mineral Products Company Asbestos PI Settlement Trust

### Holds preserved

| Trust | Status after correction | Reason |
|---|---|---|
| NGC Bodily Injury Trust | No mapped current-rate URL | The January 2023 45% notice and undated 40% FAQ remain in conflict; neither is silently treated as stale. |
| Christy Refractories | `conflict_unresolved` | An official historical 55% notice and 50% FAQ conflict; the current rate is labeled under review rather than displayed. |
| Shook & Fletcher | No mapped current-rate URL | The official historical 58% notice and 50% FAQ conflict remains unresolved. |

## Rendering and provenance changes

- Source-status semantics are rendered consistently in the trust list, trust detail, SSR metadata, public API, and CSV: `historical_only` means **not a current rate**, and `conflict_unresolved` means **current rate under review**.
- Maremont’s notice establishes a named payment cycle rather than a fabricated calendar effective date.
- USG and the other qualified notices preserve interim, consent, cutoff, and sub-account/scope language rather than presenting a notice date as final adoption.
- Official USG and Maremont change entries are added to the public correction history. Payment-notice history receives the two source-linked entries.

## Explicit exclusions

- No rate is inferred from an inaccessible page, stale content, a search snippet, an annual cash-payment figure, or the absence of a later notice.
- No NGC, Christy, or Shook & Fletcher numerical rate is changed.
- No trust-wide total, financial figure, aggregate, claims statistic, or attorney-review credit changes.
- The separate ABB Lummus and ASARCO FY2025 financial-field packets remain out of scope.

## Validation

- TypeScript: passed.
- Focused provenance and payment-notice tests: 10/10 passed.
- Full test suite: 43 files passed; 159 tests passed; one existing opt-in test skipped.
- Production build and `git diff --check`: passed.
- Targeted data invariants confirm three remaining source-URL holds, Maremont 34% with a `September 2026` payment cycle (not an effective date), and USG’s consent-pending qualifier without an unsupported effective date.

## Correction history

- **2026-10-31:** Maremont 28.4% → 34% after direct verification of the September 29, 2026 official notice.
- **2026-10-31:** USG’s unsupported 2006 effective date removed; 10% is now sourced and described as interim/consent-pending under the June 30, 2026 notice.
- **2026-10-31:** Historical-only and conflict-source statuses made visible so cited historical records are not mistaken for current payment rates.

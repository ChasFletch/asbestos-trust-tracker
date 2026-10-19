# Six-Trust Source and Qualifier Transparency Release — October 19, 2026

**Status:** Approved Tier 1 implementation; locally validated October 19, 2026; public GitHub/production release pending an explicit disposition  
**Authority:** Charles’s October 19, 2026 instruction: “Approve the Tier 1 source/qualifier release for the six trusts and update the private tracker accordingly.”  
**Source cut-off:** Official documents directly reviewed through October 19, 2026.  
**Scope:** Canonical payment-rate provenance, scope/finality qualifiers, and official payment-notice history for Kaiser, Federal-Mogul, ABB Lummus, ARTRA, ASARCO, and ACandS.  
**Out of scope:** Any payment-percentage number change; net assets, cumulative payments, annual cash paid/settled amounts, aggregate totals, a tracker-wide snapshot refresh, articles, attorney-review credit, and the unresolved NGC and Shook & Fletcher conflicts.

## Release boundary

This is a source-and-qualifier release. It does not change any displayed payment percentage. The canonical tracker-wide `asOf` value remains **2026-10-08** because this is not a refresh of all tracker data.

The release adds three verified primary-source URLs to the canonical rate fields, reducing non-null payment-percentage records without a mapped `paymentPercentageSourceUrl` from **30 to 27**. It adds source-history entries for Federal-Mogul FMP, ABB Lummus, ASARCO, and ACandS, and corrects unsupported date semantics on the Federal-Mogul FMP sub-account record.

## Primary sources and exact treatment

| Trust / scope | Existing number | Release treatment | Direct official source | Date and qualifier retained |
| --- | ---: | --- | --- | --- |
| Kaiser Aluminum & Chemical Corporation Asbestos PI Trust | 10.6% | No new dataset mutation: the existing official February 5, 2025 source and interim/consent-pending qualification already match the direct review. | [Kaiser notice](https://www.kaiserasbestostrust.com/assets/uploadedFiles/a9fa8368-7c64-4c40-9312-d95c42ff8c06.pdf) | 15.5% is the prior rate. The notice directs interim 10.6% payments while TAC/FCR consent is pending; no later final adoption is asserted. |
| Federal-Mogul — T&N Sub-Account | 2.9% | Retains the existing T&N-only, interim, consent-pending qualifier and makes the separate FMP source history explicit. | [T&N notice](https://www.federalmogulasbestostrust.com/wp-content/uploads/2026/06/Notice-of-Payment-Percentage-Change-TN-Subfund-June-18-2026-4923-8029-8166-v.1-1.pdf) | T&N is not a Federal-Mogul-wide rate; the stated documentation cutoff preserves 3.9% for the specified claims. |
| Federal-Mogul — FMP Subfund | 12.2% | Adds a dated official notice-history entry documenting 6.9% → 12.2% after TAC/FCR consent. Removes the incorrectly inferred `effective` and `as_of` fields from the sub-account presentation. | [FMP notice](https://www.federalmogulasbestostrust.com/wp-content/uploads/2024/04/Payment-Percentage-Notice-FMP-April-2024-C1309774x9DB18.pdf) | The notice is dated April 15, 2024. It does **not** state an effective date. FMP remains separate from T&N and the two rates are never combined or averaged. |
| ABB Lummus | 9.5% | Adds the reviewed official rate-notice URL, a January 1, 2024 payment context, scope, and consent wording; adds a linked notice-history record. | [ABB notice](https://www.abblummustrust.org/assets/uploadedFiles/34ed7cf8-61ba-464b-93fc-9851a0670df7.pdf) | Applies to specified TDP-determined Lummus claims paid January 1, 2024 and thereafter, subject to the notice’s TDP §4.3 context. The notice itself is undated. |
| ARTRA | 0.70% | Preserves the dated 0.70% notice and adds the separately linked undated 0.50% notice as an unsequenced historical source. The history entry now records the 0.60% prior rate and avoids inventing a publication date. | [0.70% notice](https://www.artratrust.com/assets/uploadedFiles/6a303f42-bfb7-4d18-b4c3-7118599892e5.pdf); [undated 0.50% notice](https://www.artratrust.com/assets/documents/Notice-of-Payment-Percentage.pdf) | The dated notice supports 0.60% → 0.70%, effective April 1, 2025. The 0.50% notice is not called stale and does not displace the dated record because its chronology is not established. |
| ASARCO | 35% | Adds the FY2025 annual-report URL, filed-source label, report filing date, scope note, and a current-rate-statement history record. | [ASARCO FY2025 annual report](https://www.asarcotrust.com/assets/uploadedFiles/334d4a6c-1b94-4adc-bf73-5566b7a5137f.pdf) | The FY2025 annual report (Doc. 17049, filed April 29, 2026) says the percentage “remains at 35%.” April 29 is report-source context, not an effective date. |
| ACandS | 2.89% | Adds the official Trustee Notice URL, source-date fields, a proposed/interim consent-pending label, exception note, and linked history record. | [ACandS Trustee Notice](https://www.acandsasbestostrust.com/assets/uploadedFiles/308c0849-826e-4c47-83ba-f74daeb899d6.pdf) | The Trustee proposed 3.2% → 2.89% and began interim payment treatment on May 11, 2026 while TAC/FCR consider consent. The notice does not establish final adoption and identifies stated release/court/probate exceptions. |

## Explicit financial-field exclusion

ABB Lummus’s existing $14,960,830 net-assets field and ASARCO’s existing $625,807,675 net-claimants-equity field are unchanged by this release. The corresponding FY2025 annual-report field packets are separate documents:

- `docs/review-packets/2026-10-19-abb-lummus-financial-field-packet.md`
- `docs/review-packets/2026-10-19-asarco-financial-field-packet.md`

Neither packet authorizes promotion of annual settled or paid amounts into a cumulative or current total.

## Correction history

| Date | Prior presentation | Corrected presentation | Reason |
| --- | --- | --- | --- |
| 2026-10-19 | FMP’s April 15, 2024 notice date was stored as an effective/as-of date; an earlier note said 12.2% “stands” based on absence of a later notice. | The FMP source record describes the April 15 notice as dated, records the 6.9% → 12.2% adjustment and consent, and says it does not state an effective date. | Direct retrieval of the 2024 FMP notice provided affirmative support for the rate history but not an effective date. |
| 2026-10-19 | ABB Lummus, ASARCO, and ACandS were marked without a mapped primary payment-rate URL. | Each now has a direct official source URL and field-specific scope/finality language. | Reviewed trust-issued or filed primary material directly supports the mapping. |
| 2026-10-19 | ARTRA’s history entry did not identify the 0.60% prior rate or the separate undated official 0.50% notice. | The history identifies the prior rate and preserves the undated notice as unsequenced historical material. | The dated and undated official documents are distinct and cannot be silently sequenced. |

## Acceptance criteria

1. No payment percentage, financial field, aggregate, trust status, or tracker-wide snapshot date changes.
2. The official payment-notice history lists FMP, ABB Lummus, ASARCO, and ACandS with direct source links and correct date labels.
3. The FMP sub-account no longer labels April 15, 2024 as an effective date; its direct notice and 6.9% → 12.2% history remain visible.
4. Trust-detail pages render ABB, ASARCO, ACandS, ARTRA, and Federal-Mogul scope/finality language in server-rendered HTML.
5. Source-less non-null payment-percentage records number exactly 27; NGC and Shook & Fletcher remain unchanged.
6. No attorney review is claimed. No production deployment is reported until a deployment and public verification actually occur.

## Local validation and release-path boundary

- `git diff --check`, TypeScript, and the focused provenance/reconciliation/notice-history tests passed.
- The full Vitest suite passed: **42 files, 156 tests passed, 1 opt-in test skipped**. The production client build and server bundle completed successfully.
- A mechanical data-scope check confirms: no payment-percentage or financial-field changes; tracker-wide `asOf` remains `2026-10-08`; 27 non-null payment-percentage records remain without a mapped source URL; and the NGC and Shook & Fletcher held records are byte-for-byte unchanged.
- The local development server intentionally loads canonical tracker data from `https://raw.githubusercontent.com/ChasFletch/asbestos-trust-tracker/main/client/src/data/trust-figures.json`. It therefore continues to serve the committed remote data until a GitHub push occurs. Its pre-push SSR and CSV responses cannot verify this unpushed candidate. Pushing this candidate would be a public data release through that runtime path, even if no separate WebDev deployment were requested.

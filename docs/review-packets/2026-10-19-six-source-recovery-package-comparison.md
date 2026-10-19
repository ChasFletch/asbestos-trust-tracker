# Six Official-Source Recovery Packages — Provenance-Aware Comparison

**Status:** Internal research and correction-packet preparation only — not a public tracker update, article, deployment, or release authorization  
**Prepared:** October 19, 2026  
**Scope:** Kaiser Aluminum & Chemical Corporation Asbestos PI Trust; Federal-Mogul Asbestos PI Trust (T&N and FMP subfunds); ABB Lummus Global Inc. 524(g) Asbestos PI Trust; ARTRA 524(g) Asbestos Trust; ASARCO Asbestos PI Settlement Trust; and ACandS Asbestos Settlement Trust.  
**Purpose:** Compare two user-supplied official-source recovery packages, retain their independent provenance, and identify only the source mapping / scope work that may later be presented for a separate Tier 1 release decision.

## Boundary and handling rule

The two packages are **not silently merged** and neither package is itself a public-data release. The direct official documents named below control the factual conclusions, not a package README, filename, or summary. The package contents are evidence transport and retrieval records only.

The user identified the first archive as Grok material and indicated that the second may be a Claude Science correction/revision. The first archive declares itself “Grok Bot.” The second archive does **not** declare an author in its own README or manifest. Therefore this record calls the latter **Package B — possible Claude Science revision (user-reported)** rather than assigning authorship as an established fact.

No new rate, financial value, source-status field, public source link, API/CSV field, article, code, or deployment was changed as a result of this comparison.

## Artifact identity and mechanical checks

| Package | Declared / reported identity | ZIP SHA-256 | Manifest record count | Recovered records | PDFs | Mechanical result |
| --- | --- | --- | ---: | ---: | ---: | --- |
| **Package A** | Declares “Grok Bot” | `4c3a2ce3dfa6082ae32399b03407fe1bbf2c0f993db1f6de800bc13033dc33ce` | 43 | 42 | 16 | ZIP integrity passed; 16 PDFs carry `%PDF-` magic; each saved file hash matched its manifest. |
| **Package B** | Possible Claude Science revision per user; no author declaration inside archive | `24fa71a74ec6b3e94a40658187652696760e8b7c77bffc883d0fe319cd9d415a` | 70 | 58 | 25 | ZIP integrity passed; 25 PDFs carry `%PDF-` magic; every saved-file hash matched its manifest; no recovered PDF retained the package’s `navigation` relevance label. |

Package B also contains 11 `not_linked` inventory observations and one local allowlist access observation. Those are not trust-side evidence that a document is absent or inaccessible.

## Overlap and difference

The packages are **substantially overlapping, but not duplicate copies**:

- **42 URLs overlap**.
- **35 overlapping URLs have the same retrieval result and identical SHA-256 bytes** in both manifests.
- The remaining seven shared URLs are navigation/listing pages that Package A retrieved while Package B recorded as not-linked/inventory observations. This is a packaging-method difference, not contradictory primary-document content.
- Package A has **one URL not in Package B**: the Federal-Mogul FMP April 2024 rate-notice URL. Package A records it as `not_linked` with no HTTP response, bytes, or hash. It is an unverified lead, not recovered evidence.
- Package B has **17 URLs not in Package A**: two older Kaiser notices, eight additional ACandS notices, and seven Federal-Mogul navigation/settlement/FAQ/archive pages. Its unique material is chiefly deeper historical and navigation coverage, not a different current rate finding.

### Assessment

Package B is the stronger **research archive**: it includes more official pages/documents, page/section locators, current-subfund site statements, and more complete ACandS history. Package A remains useful corroboration because it independently recovered the core documents in a short separate window and supplies matching bytes for the major shared PDFs.

Neither package is superior on its own for current-status conclusions where an official page is undated or documents conflict. Those claims require the trust document’s own date/scope language and the qualifications below.

## Independent official-source checks in this review

This review separately retrieved and read the following official documents/pages after the package comparison. These direct official materials control the conclusions in the next table.

1. [Kaiser February 5, 2025 notice](https://www.kaiserasbestostrust.com/assets/uploadedFiles/a9fa8368-7c64-4c40-9312-d95c42ff8c06.pdf)
2. [Federal-Mogul T&N June 30, 2026 notice](https://www.federalmogulasbestostrust.com/wp-content/uploads/2026/06/Notice-of-Payment-Percentage-Change-TN-Subfund-June-18-2026-4923-8029-8166-v.1-1.pdf)
3. [Federal-Mogul official homepage](https://www.federalmogulasbestostrust.com/)
4. [ABB Lummus rate notice](https://www.abblummustrust.org/assets/uploadedFiles/34ed7cf8-61ba-464b-93fc-9851a0670df7.pdf)
5. [ABB Lummus FY2025 annual report / financial statements](https://www.abblummustrust.org/assets/uploadedFiles/04e9a249-cf90-4bfd-a2cb-21a0016473ad.pdf)
6. [ARTRA 0.70% adjustment notice](https://www.artratrust.com/assets/uploadedFiles/6a303f42-bfb7-4d18-b4c3-7118599892e5.pdf)
7. [ARTRA undated 0.50% adjustment notice](https://www.artratrust.com/assets/documents/Notice-of-Payment-Percentage.pdf)
8. [ASARCO FY2025 annual report](https://www.asarcotrust.com/assets/uploadedFiles/334d4a6c-1b94-4adc-bf73-5566b7a5137f.pdf)
9. [ACandS May 11, 2026 notice](https://www.acandsasbestostrust.com/assets/uploadedFiles/308c0849-826e-4c47-83ba-f74daeb899d6.pdf)

### October 19 direct-FMP verification addendum

After this comparison was prepared, the requested direct retrieval of the [Federal-Mogul FMP April 2024 notice](https://www.federalmogulasbestostrust.com/wp-content/uploads/2024/04/Payment-Percentage-Notice-FMP-April-2024-C1309774x9DB18.pdf) succeeded. The one-page notice is dated **April 15, 2024** and states that, after consultation with and consent of the TAC and FCR, the Trustees adjusted the FMP Subfund payment percentage from **6.9% to 12.2%**. It does **not** state an effective date.

This addendum supersedes only the FMP row’s earlier conclusion that no dated FMP rate-change notice was available. It does not establish an effective date, a Federal-Mogul-wide rate, or the result of the separate April 2026 FMP reconsideration notice.

## Fact-by-fact reconciliation

| Trust / scope | What both packages corroborate | Material difference / limit | Direct controlling conclusion | Public-data disposition under current authority |
| --- | --- | --- | --- | --- |
| **Kaiser Aluminum & Chemical Corporation Asbestos PI Trust** | The same February 5, 2025 notice: Trustees sought consent for a **15.5% → 10.6%** decrease and directed payment at 10.6% from February 5 under TDP §4.3. | Neither package establishes later TAC/FCR consent or final adoption; neither produces an annual report. | **10.6% remains the documented interim paid rate**, pending consent. The 15.5% figure is prior rate, not current rate. | Map the official notice URL and retain the existing interim/consent qualifier in a later, separately approved Tier 1 source-provenance release. No numeric change. |
| **Federal-Mogul — T&N Sub-Account** | The same June 30, 2026 notice: **3.9% → 2.9%**, with 2.9% applied during TAC/FCR consent; claims meeting the specified cutoff retain 3.9%. | Filename says June 18 while the letter date is June 30. Neither package establishes final adoption. | **2.9% is a T&N-only interim rate, not a Federal-Mogul-wide rate**, beginning after the notice’s stated June 30 documentation cutoff. | Map the official notice URL and retain existing sub-account/interim/cutoff qualifications only. No numeric change. |
| **Federal-Mogul — FMP Sub-Account** | Both recover the April 27, 2026 FMP reconsideration notice, which states no new rate. | Package A’s unique April 2024 URL has no bytes. Package B adds a current official homepage statement that says **12.2%** for FMP, but no dated notice or effective date. | The official homepage supports an **undated current-page statement of 12.2% for FMP**. It does **not** establish an effective date, a dated rate-change notice, or the result of the April 2026 reconsideration. | Do not alter the number from 12.2%. A later release may add an official-homepage source with an explicit `undated current-page statement` qualification, separate from T&N. Do not infer an effective date or final adoption. |
| **ABB Lummus** | Same official rate notice: **9.5%** for claims paid on/after January 1, 2024, with TAC/FCR consent. Same FY2025 report confirms 9.5% for 2025. | Rate notice itself is undated; “01-22-2024” is a link-title date. No material after FY2025 was recovered. | **9.5%** is source-supported for the stated claims paid on/after January 1, 2024. FY2025 report, D. Del. 06-10401 Doc. 529, filed April 28, 2026, reports net assets of **$14,960,830** at December 31, 2025. | Map rate and annual-report URLs / dates only if separately released. Do not infer a later rate or turn FY2025 annual cash payments into a current total. |
| **ARTRA** | Same 0.70% notice: **0.60% → 0.70%**, effective April 1, 2025, with TAC/FCR consent, and “shall remain” until further adjusted. | Package B adds a second official but undated 0.50% notice. Its chronology relative to the April 2025 notice is not established from the undated document alone. | The dated/effective April 1, 2025 0.70% notice supports retaining **0.70%**. The undated 0.50% document must remain visible as an older/unsequenced official source; it must not be called stale merely because it lacks a date. No later adjustment was recovered. | Retain 0.70%; a later source-status/history release should link the dated 0.70% notice and separately preserve the undated 0.50% conflict/history document. No reverse rate change. |
| **ASARCO** | FY2025 annual report says payment percentage “remains at **35%**.” It is filed April 29, 2026, for fiscal year ended December 31, 2025. | No standalone rate notice or effective date was recovered. Package B is clearer about separate annual report / financial statement documents and locators. | **35%** is sourced to an annual-report status statement, as of report filing; it has no stated effective date. The report also states $625,807,675 net claimants’ equity at December 31, 2025 and $802,230,852 cumulative payments on unliquidated claims excluding premises claims, but those are distinct financial fields requiring their own release decision. | Map the annual-report source / as-of context only if separately released. Do not add financial fields or invent a rate-effective date under this packet. |
| **ACandS** | Same May 11, 2026 notice: proposed decrease to **2.89%**, paid from the proposal date while TAC/FCR evaluate; timely release and probate exceptions exist. | Package B adds historical notices and confirms 3.2% was last adopted September 29, 2025. Neither package establishes final adoption of 2.89% or a post-2013 annual report. | **2.89% is a proposed/interim applied rate**, not an unqualified final rate; **3.2%** remains relevant only for the specified exceptions / last-adopted history. | Map the May 11 notice and add the interim/consent / exception qualification only in a later approved Tier 1 release. Do not change the current 2.89% number or report a newer annual report. |

## What the comparison does **not** establish

- It does not establish later final TAC/FCR consent for Kaiser, T&N, or ACandS.
- It does not establish a current FMP effective date or the outcome of the April 2026 FMP reconsideration. The April 15, 2024 FMP notice is a dated rate-change notice, but it does not state when the adjustment became effective.
- It does not prove a later ARTRA change or the chronology of the undated 0.50% notice.
- It does not establish an ASARCO 35% effective date.
- It does not establish later annual reports for Kaiser, Federal-Mogul, ARTRA, or ACandS.
- It does not authorize current-rate claims from a date-free historical page, inferred absence of a newer notice, or any public data/release action.

## Recommended release split (not yet approved)

### Tier 1 — source and qualifier transparency

A future bounded release could add only the directly supported primary-source URLs and the following transparency labels: Kaiser/T&N/ACandS interim consent status; Federal-Mogul’s distinct T&N and FMP source scopes; ABB Lummus January 1, 2024 rate-effective context; ARTRA’s dated 0.70% notice plus the separate undated 0.50% document; and ASARCO’s annual-report date rather than an invented effective date.

### Separate figure update packet

Any change to ASARCO cumulative paid, ASARCO net assets, ABB Lummus net assets, or annual-report values needs its own field-level correction/release packet with exact field, source page/table, period, as-of date, scope, old/new value, and aggregate impact. It is outside this source-recovery comparison.

## Next step

Keep both packages retained as independent source-recovery evidence. Prepare one narrowly scoped Tier 1 source-mapping/qualifier correction packet only if a specific release decision is requested. Retain the NGC conflict and all other current holds unchanged.

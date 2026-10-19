# Post-Pilot Payment-Rate and Annual-Report Monitoring Log — October 19, 2026

- **Authorization:** [Post-pilot rate and annual-report monitoring authorization](../post-pilot-rate-monitoring-authorization-2026-10-06.md), October 6–November 5, 2026 (America/Chicago)
- **Run ID:** `run-postpilot-rateannual-20261019`
- **Run window:** 2026-10-19 18:02:53–18:03:15 UTC (21.910 seconds)
- **Purpose:** Bounded detection and controlling-source review for U.S. asbestos-trust payment-percentage changes and annual-report postings only.
- **Public-release authority:** None. No public tracker data, article, source code, deployment, or reviewer attribution was changed.
- **Cost boundary:** No PACER purchase, paid record, paid API, or paid external tool was used.

## Required preflight

Before any source request, the run reviewed the active official-source registry, unresolved candidate queue, the October 16 monitoring artifact/log, and the source-coverage state.

| Preflight item | Result |
| --- | --- |
| Registered sources | 75 total; 62 active |
| Sources due under cadence | 25 |
| In-scope sources selected for request | 23 |
| Excluded before request | 2: *Herlihy v. DBMP, LLC* (court) and *In re Miyoshi America, Inc.* (case agent). Those are outside this pass’s rate/report-only scope. |
| Queue at preflight | 59 `detected`, 1 `under_review`, 9 `blocked` records; 29 were associated with today’s due cohort. |
| Latest completed comparable run | October 16, 2026 post-pilot rate/report detection; no controlling payment-rate or annual-report event identified. |

The 23 requested sources did not exceed the 25-source cap. A content fingerprint is a detection aid only and was not treated as a source fact.

## Detection result

| Measure | Result |
| --- | ---: |
| Requested in-scope official/administrator/primary-document sources | 23 |
| Usable retrievals | 7 |
| Fingerprint signals | 3 |
| Access outcomes | 16 |
| New non-duplicate operational queue records | 8 |
| Verified rate or annual-report candidates | 0 |
| Correction packets prepared | 0 |

The raw, reproducible detection outcome is retained as [`2026-10-19-detection-pass.json`](2026-10-19-detection-pass.json). It records each registered source URL, request outcome, timestamps, previous/current fingerprint where usable, and candidate ID where one was created. The registered official source remains controlling when a transport-assisted retrieval is used.

## Review of the three fingerprint signals

All three changed-source signals were reviewed against the applicable official or official-administrator material. No review used a snippet or secondary legal-marketing source as evidence.

### 1. Manville Personal Injury Settlement Trust — no new material event

- **Registered official-administrator source:** [Manville: Increase in the pro rata payment percentage](https://www.claimsres.com/2026/09/03/manville-increase-in-the-pro-rata-payment-percentage/)
- **Related official index reviewed:** [Claims Resolution Management Corporation — Manville category](https://www.claimsres.com/category/manville/)
- **Document date:** September 3, 2026
- **Known notice terms:** Trustees, with the concurrence of the Selected Counsel for the Beneficiaries and the Legal Representative of Future Claimants, approved an immediate increase in the pro rata payment percentage from **5.1% to 5.6%**. The notice says e-Claims set future offers and reissued outstanding offers at 5.6% on September 2, 2026.
- **October 19 disposition:** The category index identifies the September 3 notice as its newest Manville payment-rate post. It identifies neither a later payment-percentage action nor a Manville annual-report posting. The fingerprint signal does not establish a new rate or report.

This notice was already covered by the post-pilot reconciliation; it was not a new candidate for public change.

### 2. C.E. Thurston & Sons Asbestos Trust — no new material event

- **Registered official source:** [C.E. Thurston & Sons Asbestos Trust](https://www.thurstonasbestostrust.com/)
- **Official administrator document index reviewed:** [C.E. Thurston & Sons Asbestos Trust — Documents](https://www.claimsres.com/documents/c-e-thurston/)
- **October 19 disposition:** The trust homepage directs filers to the official CRMC document section. The document index lists procedure, form, release, policy, and trust-document materials, including several document revisions, but no dated payment-percentage notice and no annual-report posting newer than October 16, 2026. The page-content fingerprint change alone does not establish a rate or report.

The existing public treatment that the payment percentage is not publicly reported remains outside this run’s change scope; no inference was made from the index.

### 3. Bondex (Specialty Products Holding Corp.) Trust — no new material event

- **Registered official administrator source:** [Claims Processing Facility — Bondex Trust](https://www.cpf-inc.com/trusts/bondex-trust)
- **Official administrator document index reviewed:** [Claims Processing Facility — Forms & Letters](https://www.cpf-inc.com/documents)
- **October 19 disposition:** The Bondex overview describes the trust and links to its trust-distribution procedures. The documents index’s visible Bondex materials are dated 2016–2019 and are procedures, forms, and agreements. Neither page identifies a payment-percentage notice or an annual-report posting newer than October 16, 2026. The signal does not establish a rate or report.

The existing October 4 Bondex fingerprint candidate is therefore a non-material detection duplicate, not a public-data change.

## Access outcomes — recorded, not inferred

Sixteen registered sources returned an access outcome through this bounded monitor: Kaiser, Armstrong, A & I, Federal-Mogul, ABB Lummus, Burns and Roe, Babcock & Wilcox, ARTRA, Brauer, Celotex, ASARCO, Congoleum, Christy Refractories, DII Industries, Duro Dyne, and ACandS. The detailed status code/error is in the detection artifact and operations queue.

These are operational access observations only. They do **not** show that a trust made no change, that a document is absent, or that a tracker value should be revised. New non-duplicate access observations were recorded for Kaiser, Federal-Mogul, ABB Lummus, ARTRA, ASARCO, and ACandS; existing open access records were preserved for the remaining affected sources.

## Disposition and next step

No new controlling payment-percentage change or annual-report posting was verified in this pass. The Manville, C.E. Thurston, and Bondex fingerprint signals are being closed in the operations queue as reviewed non-material detection signals. No correction packet is required, and nothing has been released publicly.

The next bounded weekday pass should use the registry’s updated due dates, retain the same primary-source and no-charge boundaries, and recheck access-limited sources only through their registered official source or a documented no-charge method.

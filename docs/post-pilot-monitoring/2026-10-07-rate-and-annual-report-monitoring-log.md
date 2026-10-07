# Post-Pilot Payment-Rate and Annual-Report Monitoring Log — October 7, 2026

**Authorization:** Post-Pilot Payment-Rate and Annual-Report Monitoring Authorization, October 6–November 5, 2026 (America/Chicago)  
**Run class:** Weekday initial detection and bounded candidate review  
**Public action:** None — no tracker data, public news, source code, or deployment changed.  
**Scope:** U.S. asbestos-trust payment-percentage changes and annual-report postings only.

## Preconditions reviewed

| Internal evidence | Current finding |
|---|---|
| Former living-tracker pilot | Completed October 5, 2026; its post-expiry detection handlers are correctly skipped and were not used for this authorization. |
| Active monitoring authorization | Active through November 5, 2026, Central time; it permits internal detection and correction packets only. |
| Source registry | 61 active registered sources; the most recent completed weekly coverage checked 60 on October 4, with 19 fingerprint signals and no access failure recorded in that run. |
| Existing queue | The October 7 payment-rate reconciliation packet remains pending Charles’s specific release decision. It was not changed by this run. |
| Staged editorial work | DBMP and Miyoshi items remain outside this rate/report-only monitoring pass and were not reviewed as rate or annual-report candidates. |

## Detection pass

The pass directly checked **25 registered controlling URLs** in **under 15 seconds**, well below the 12-minute cap. It used the registered official URLs directly; no reader transport was treated as source evidence.

| Detection result | Count | Handling |
|---|---:|---|
| Registered sources checked | 25 | Within the daily cap. |
| Usable responses with changed fingerprints | 4 | Deduplicated before review; a fingerprint is only a signal. |
| Distinct in-scope rate/report candidates reviewed | 2 | Below the three-candidate cap. |
| New controlling rate or annual-report facts established | 0 | No correction packet created or amended. |
| Direct access errors | 19 | Recorded as operational limitations only; no absence-of-change inference. |

The full machine-readable detection record is [`2026-10-07-detection-pass.json`](./2026-10-07-detection-pass.json). It retains the checked source URLs, status/error results, and prior/current fingerprints.

## Deduplicated controlling-source review

### 1. Manville Personal Injury Settlement Trust — no new in-scope event

- **Signals:** The Manville feed and the September 3 notice both changed fingerprint. They are one trust/event cluster, not two candidates.
- **Controlling source:** [Claims Resolution Management Corporation’s Manville notice](https://www.claimsres.com/2026/09/03/manville-increase-in-the-pro-rata-payment-percentage/) and [Manville announcement feed](https://www.claimsres.com/category/manville/feed/).
- **Result:** The newest feed item remains the September 3, 2026 notice: the pro rata percentage increased from **5.1% to 5.6%**, changes were implemented in e-Claims on September 2, 2026, and the notice says the increase was effective immediately.
- **Disposition:** Already reflected by the existing tracker history; no newer payment-percentage notice or annual-report posting was identified. **No candidate, correction, or release action.**

### 2. C.E. Thurston & Sons Asbestos Trust — no rate/report fact

- **Signal:** The official trust homepage changed fingerprint.
- **Controlling source:** [C.E. Thurston & Sons Asbestos Trust](https://www.thurstonasbestostrust.com/).
- **Result:** The page provides links to CRMC announcements and trust documents but does not state a current payment percentage or identify a newly posted annual report.
- **Disposition:** The current public posture remains **payment percentage not publicly reported**. The changed page does not establish a rate, annual-report posting, or no-change conclusion. **No correction packet.**

### Excluded signal: Herlihy v. DBMP, LLC

The public Supreme Court docket changed fingerprint, but it is a court-development/article lead rather than a payment-percentage or annual-report item. It remains outside this authorization’s narrow scope and was not substantively reviewed in this pass.

## Access and registry notes

Nineteen direct requests were unusable in this runtime (HTTP 403 or connection failure), including Armstrong, A-Best, A&I, APG, ABB Lummus, ACandS, ARTRA, ASARCO, Babcock & Wilcox, Bondex, Brauer, Burns and Roe, Celotex, Christy Refractories, Congoleum, DII, Duro Dyne, and Eagle-Picher. These results are **access observations only**. They do not mean a trust did not publish a notice or report, and they do not alter the registry’s prior successful-access history.

No replacement source was registered in this run. Existing documented browser-compatible paths and monitoring-only transports remain subject to their existing constraints. Any source replacement proposal requires a separate recorded registry decision before use as public-fact evidence.

## Next action

- Keep the October 7 payment-rate reconciliation packet pending the requested specific release decision.
- Revisit the listed direct-access blockers only under the weekday authorization, using lawful documented retrieval methods and without treating a reader transport as controlling evidence.
- Do not alter the Manville or C.E. Thurston public records from this pass.

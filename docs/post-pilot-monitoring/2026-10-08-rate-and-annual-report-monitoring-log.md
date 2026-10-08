# Post-Pilot Payment-Rate and Annual-Report Monitoring Log — October 8, 2026

**Authorization:** Post-Pilot Payment-Rate and Annual-Report Monitoring Authorization, October 6–November 5, 2026 (America/Chicago)  
**Run class:** Weekday initial detection and bounded candidate review  
**Public action:** None — no tracker data, public news, source code, or deployment changed.  
**Scope:** U.S. asbestos-trust payment-percentage changes and annual-report postings only.

## Preconditions reviewed

| Internal evidence | Current finding |
|---|---|
| Authorization | Active through November 5, 2026, Central time; it permits internal detection and correction packets only. |
| Former pilot schedule | Its latest automated runs remain correctly marked **skipped** outside the September pilot dates; this separate post-pilot workflow was used instead. |
| Source registry | 61 active registered sources; none currently carry a persisted failure count, and one has never had a successful recorded check. |
| Candidate queue | The October 4 weekly coverage left routine fingerprint candidates open; the October 7 payment-rate reconciliation packet remains pending Charles’s specific release decision. |
| Latest coverage | The October 4 weekly coverage checked 60 sources, logged 19 fingerprint changes, and recorded no access failure. |

## Detection pass

The pass directly checked **25 registered controlling URLs** in **20 seconds**, within the 12-minute limit. It used the registered URLs directly and did not treat reader transports as evidence.

| Detection result | Count | Handling |
|---|---:|---|
| Registered sources checked | 25 | Within the daily cap. |
| Usable responses with changed fingerprints | 4 | Signals only; deduplicated by trust/source/event. |
| Distinct in-scope candidates reviewed | 2 | Below the three-candidate cap. |
| New controlling rate or annual-report facts established | 0 | No correction packet created or amended. |
| Direct access errors | 19 | Operational observations only; no absence-of-change inference. |

The machine-readable detection record is [`2026-10-08-detection-pass.json`](./2026-10-08-detection-pass.json).

## Deduplicated controlling-source review

### Manville Personal Injury Settlement Trust — previously covered payment notice

The Manville feed and the September 3 notice changed fingerprint but refer to the same already-covered event. The controlling [administrator notice](https://www.claimsres.com/2026/09/03/manville-increase-in-the-pro-rata-payment-percentage/) remains dated **September 3, 2026**. It states that the trustees approved an immediate increase in the pro rata percentage from **5.1% to 5.6%**; e-Claims implemented 5.6% for future and re-issued outstanding offers on **September 2, 2026**. It mentions planned mid-October retroactive supplemental payments, but does not announce a newer rate or annual report.

**Disposition:** Already represented by the existing tracker history. No new candidate, correction packet, or public action.

### C.E. Thurston & Sons Asbestos Trust — no rate or annual-report posting

The official [C.E. Thurston & Sons Asbestos Trust homepage](https://www.thurstonasbestostrust.com/) changed fingerprint. Its current content describes the trust, links to the CRMC announcements/document pages, and does not state a current payment percentage or announce a newly posted annual report.

**Disposition:** Continue the public posture that the payment percentage is **not publicly reported**. The fingerprint change does not establish a rate, annual-report posting, or no-change conclusion. No correction packet.

### Excluded signal: *Herlihy v. DBMP, LLC*

The public Supreme Court docket changed fingerprint but is a court-development/article lead rather than a payment-percentage or annual-report item. It was not substantively reviewed under this narrow authorization.

## Access and registry notes

The same 19 direct requests encountered HTTP 403 or connection failures in this runtime: Armstrong, A-Best, A&I, APG, ABB Lummus, ACandS, ARTRA, ASARCO, Babcock & Wilcox, Bondex, Brauer, Burns and Roe, Celotex, Christy Refractories, Congoleum, DII, Duro Dyne, and Eagle-Picher. These are access observations, **not** findings that a trust did not publish a notice or report. No source replacement was registered.

## Next action

Keep the October 7 payment-rate reconciliation packet pending a specific release decision. Revisit direct-access blockers only under the active weekday authorization, and do not alter public records based on this run.

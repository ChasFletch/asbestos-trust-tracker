# Post-Pilot Payment-Rate and Annual-Report Monitoring Log — October 9, 2026

**Authorization:** Post-Pilot Payment-Rate and Annual-Report Monitoring Authorization, October 6–November 5, 2026 (America/Chicago)
**Run class:** Weekday initial detection and bounded candidate review
**Public action:** None — no tracker data, public news, source code, or deployment changed.
**Scope:** U.S. asbestos-trust payment-percentage changes and annual-report postings only.

## Preconditions reviewed

| Internal evidence | Current finding |
| --- | --- |
| Authorization | Active through November 5, 2026, Central time; internal detection and correction packets only. |
| Source registry | 61 active registered sources. The due cohort was limited to 25 official-trust, administrator, or primary-document URLs. Court-development endpoints were excluded because they cannot establish an in-scope rate or annual-report fact. |
| Candidate queue | The queue contains prior fingerprint records and the completed October 8 payment-rate reconciliation release. Repeat signals must be deduplicated against the newest dated controlling event. |
| Recent monitoring | October 7 and October 8 passes found no new controlling rate or annual-report fact. October 8 reviewed the same Manville notice and C.E. Thurston page; the NGC 45%/40% conflict remains separately tracked without a public change. |
| Coverage findings | October 4 coverage checked 60 registered sources. Direct-request access limitations are tracked operationally and do not establish absence of a notice or report. |

## Detection pass

The pass directly checked **25 registered controlling URLs** in **5.8 seconds**, within the 12-minute limit. It did not use a reader transport, PACER, a paid service, or an unregistered URL.

| Detection result | Count | Handling |
| --- | ---:| --- |
| Registered sources checked | 25 | Within the daily cap. |
| Usable responses with changed fingerprints | 5 | Detection signals only. |
| Deduplicated trust/source events | 4 | Manville’s feed and individual notice are one event. |
| Distinct in-scope candidate reviews | 3 | API, MLC, and C.E. Thurston; within the three-candidate cap. |
| New controlling rate or annual-report facts established | 0 | No correction packet. |
| Direct access errors | 18 | Recorded operationally in the run queue; no absence-of-change inference. |
| New source-registration need | 0 | Existing registered URLs remain the relevant official-source locations. |

The machine-readable detection record is [`2026-10-09-detection-pass.json`](./2026-10-09-detection-pass.json).

## Deduplicated controlling-source review

### Manville Personal Injury Settlement Trust — already-covered event

The Manville feed and the September 3 notice again produced changed fingerprints, but both refer to the already-covered administrator notice dated **September 3, 2026**. The notice remains the same 5.1% to 5.6% pro rata payment-percentage increase, with September 2 e-Claims implementation; it does not supply a later rate notice or annual report.

**Disposition:** Deduplicated to the existing published event. No candidate review slot, correction packet, or public action.

### API, Inc. Asbestos Settlement Trust — no rate or annual-report posting identified

The official [API trust homepage](https://apiincasbestossettlementtrust.com/) rendered only generic trust-purpose and contact information. It did not state a payment percentage, link a payment-percentage notice, or identify an annual report.

**Disposition:** The fingerprint signal does not establish a new rate or report. No correction packet.

### Motors Liquidation Company (GM) Asbestos PI Trust — no post-2025 rate or report item

The official [MLC document repository](https://www.claimsres.com/documents/mlc/) lists its latest payment-percentage notice as **December 3, 2025** and also displays a March 2022 reconsideration notice. The additional 2026 entries visible in the repository are generic e-Claims/user materials, not a new trust rate notice or annual report. No report posting after the October 5 review was identified.

**Disposition:** The fingerprint signal is not a new in-scope fact. No correction packet.

### C.E. Thurston & Sons Asbestos Trust — rate remains not publicly reported

The official [C.E. Thurston homepage](https://www.thurstonasbestostrust.com/) continues to describe the trust and link to CRMC announcements and document pages. It does not state a current payment percentage or announce a new annual report.

**Disposition:** Retain the existing **not publicly reported** rate posture. The fingerprint signal does not establish a rate, annual-report posting, or no-change conclusion beyond the reviewed page content. No correction packet.

## Access and registry notes

Eighteen direct requests returned HTTP 403 or connection/fetch failure in this runtime: Armstrong (June notice and October rate-reduction PDF), Kaiser, H.K. Porter, ARTRA, ASARCO, Babcock & Wilcox, Bondex, Brauer, Burns and Roe, Celotex, Christy Refractories, Congoleum, DII, Duro Dyne, Eagle-Picher, Yarway, and W.R. Grace.

These are source-access observations only. They do **not** establish that a trust did not post a notice or annual report. No new source URL was registered because no source replacement decision was supported by this pass.

## Internal disposition

Three reviewed signal records and the full 25-source result set were recorded in the existing operations queue. No controlling payment-percentage change or annual-report posting qualified for a correction packet. No public data, source mapping, article, code, deployment, or reviewer attribution changed.

## Next action

Continue the bounded weekday workflow through November 5, 2026 Central. Revisit the recorded access blockers only through their existing registered official source routes or documented no-charge fallback methods; do not infer source content from an access result.

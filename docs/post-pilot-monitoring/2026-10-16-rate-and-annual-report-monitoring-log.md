# Post-Pilot Payment-Rate and Annual-Report Monitoring — October 16, 2026

## Authorization and boundary

- **Authorization:** `docs/post-pilot-rate-monitoring-authorization-2026-10-06.md`
- **Window:** October 6 through November 5, 2026, America/Chicago
- **Run ID:** `run-postpilot-rateannual-20261016`
- **Started / completed:** 2026-10-16 18:08:47–18:09:03 UTC (15.7 seconds)
- **Purpose:** bounded detection of new official payment-percentage changes and annual-report postings only.
- **Publication boundary:** no public tracker data, source code, article, or deployment changed in this run.
- **Cost boundary:** no PACER purchase, paid record, paid API, or paid external tool was used.

## Preflight

The active registry contained 62 sources. Fifty-eight were eligible at the run time. The 25 highest-priority due sources were selected, satisfying the authorization cap. Two selected sources were excluded before requesting them because they were a court source and a case-agent source outside this rate/report-only pass:

1. Herlihy v. DBMP, LLC — U.S. Supreme Court docket source.
2. In re Miyoshi America, Inc. — Stretto case-agent source.

The remaining **23 eligible official trust, administrator, or primary-document sources** were requested. The registry and candidate queue were reviewed before requests; 85 unresolved records were present (76 detected, 9 blocked). Existing open source-change records were used for deduplication.

## Detection result

| Measure | Result |
|---|---:|
| Selected before class exclusion | 25 |
| Eligible sources requested | 23 |
| Usable responses | 8 |
| Fingerprint differences | 6 |
| Inaccessible/failed responses | 15 |
| New candidates created | 0 |
| Verified new payment-rate or annual-report event | 0 |

A fingerprint difference is a detection signal, not evidence of a changed rate, report, or other public fact. All six signals already had an open record for the same trust/source class; the run therefore created no duplicate candidate.

## Controlling-source rechecks

Three existing detection signals were checked against their registered official material, within the three-candidate review limit.

| Trust / source | Official material checked | Result and disposition |
|---|---|---|
| Manville Personal Injury Settlement Trust | [Claims Resolution Management Corporation notice, posted September 3, 2026](https://www.claimsres.com/2026/09/03/manville-increase-in-the-pro-rata-payment-percentage/) | The dated notice remains the latest controlling event found. It states that the Trustees, with SCB and Legal Representative concurrence, increased the pro rata payment percentage **from 5.1% to 5.6%, effective immediately**; e-Claims changes were implemented September 2 for future and outstanding offers. No later rate or annual-report posting was found in this review. Earlier fingerprint records are closed as superseded by this already-recorded notice, not treated as a new event. |
| C.E. Thurston & Sons Asbestos Trust | [Official trust homepage](https://www.thurstonasbestostrust.com/) | The page directs readers to CRMC announcements and trust documents but publishes no dated payment-percentage statement or annual-report posting. This does not establish a rate or a no-change finding. The signal is closed as a non-substantive page-fingerprint change; the existing public “not publicly reported” treatment remains outside this run’s change authority. |
| API, Inc. Asbestos Settlement Trust | [Official trust homepage](https://apiincasbestossettlementtrust.com/) | The retrieved homepage is an undated welcome page and contains no payment-percentage statement or annual-report posting. It supplies no new controlling rate/report fact. The signal is closed as a non-substantive page-fingerprint change. |

The remaining three fingerprint signals were **not** elevated into additional material reviews: Combustion Engineering remains an already-blocked generic GoDaddy landing-page result; Bondex and Eagle-Picher were changes in the documented reader-transport output and already have open access/source-change records. They support no rate or report inference.

## Access outcomes

Fifteen requested sources were inaccessible through this run’s direct/registered transport: A & I, Babcock & Wilcox, Burns and Roe, ACandS, Armstrong, Celotex, Brauer, Christy Refractories, A.P. Green, A-Best, ABB Lummus, ASARCO, Duro Dyne, Congoleum, and J.T. Thorpe (TX). The observed results were either HTTP 403 or transport fetch failures. They were retained as access observations in the source registry; none is evidence that a trust has no update.

## Conclusion

**No new controlling payment-percentage change or annual-report posting was verified.** The dated Manville September 3 notice remains the newest controlling rate event identified in this bounded pass. The run is complete as a partial-access monitoring record, with no public release or correction packet required.

## Reproducibility

The normalized per-source detection artifact is `docs/post-pilot-monitoring/2026-10-16-detection-pass.json`. It preserves the registered official URL, the actual monitoring target where a reviewed reader transport is needed, prior/current fingerprints, response outcome, and the two preflight exclusions.

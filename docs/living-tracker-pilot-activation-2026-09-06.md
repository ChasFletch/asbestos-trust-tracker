# AsbestosTrusts.org Living-Tracker Pilot — Activation Record

**Pilot period:** September 6–October 5, 2026, inclusive  
**Operating timezone:** America/Chicago  
**Status:** Active, bounded pilot  
**Digest destination:** Existing project queue only  
**Activation record created:** September 6, 2026 Central time

## Purpose and Authority

This record activates the approved 30-day hybrid operating pilot for the AsbestosTrusts.org Research Desk. Its purpose is to discover and triage new primary-source developments, maintain the public trust tracker, and pursue a quality-dependent target of three substantive articles per week. The pilot is restricted to U.S. asbestos bankruptcy trusts, trust formation, claims procedures, annual financial reporting, material court developments, and public explainers within the defined AsbestosTrusts.org scope.

Routine tracker updates and news publication may proceed only after documented editorial and technical checks. **Unreviewed automatic publication remains prohibited.** The pilot does not authorize advertisements, other websites, individualized legal advice, new firm positions, PACER purchases, paid records, paid external data services, or a separate paid usage allowance. The pilot ends automatically after October 5, 2026; any continuation requires a separate decision following the end-of-pilot assessment.

## Assigned Operating Owners

| Responsibility | Primary owner | Backup / independent check | Required evidence |
|---|---|---|---|
| Source detection and candidate triage | Manus Research Desk | RON — independent verifier | Candidate record with source URL, observed date, evidence, and next action |
| Editorial drafting and source reconciliation | Manus Research Desk | RON — independent verifier | Research record and completed editorial checklist |
| Technical validation and project release | Manus project release operator | RON — independent verifier | Regression/build record, deployment record, and post-release raw-HTML check where relevant |
| Attorney review credit | Paul Danziger or Rod De Llano, only if review actually occurs | — | Article-specific reviewer name, scope, and review date in the release record |

> A standing affiliation or role designation is not evidence that Paul Danziger or Rod De Llano reviewed a particular article. No attorney-review credit may be displayed or recorded without the required article-specific evidence.

## Numerical Operating Limits

| Work type | Ceiling | Stop rule |
|---|---:|---|
| Daily official-source detection | 25 sources; 12 minutes | Record remaining due sources for the weekly coverage run |
| Weekday candidate triage | 3 material candidates; 25 minutes | Record the blocker and owner rather than consuming an open-ended workday |
| Material rate/status candidate | 30 minutes; one extension to 60 minutes only when a controlling source requires reconciliation | Escalate as a documented candidate; do not infer a change or buy a record |
| Monthly research | 5 highest-priority gaps plus 1 analysis topic; 3 hours total | Queue uncompleted items for a later, scoped pass |
| Quarterly preparation | 8 hours total against a declared source cutoff | Produce an audit-preparation record; do not enlarge the workstream automatically |

The no-charge PACER rule is encoded in the pilot policy and its operating limits. Access restrictions, unpublished materials, and source failures must be recorded as gaps or blockers; they are never evidence of no change.

## Active Schedule

All recurring project jobs are visible in the project scheduled-tasks calendar. Times below are **America/Chicago** during the pilot.

| Cadence | Central time | Job | Identifier | Function | Publication authority |
|---|---:|---|---|---|---|
| Daily | 6:30 a.m. | Official-source detection | `KThitgnxekcCVrUSxUJbnD` | Checks a bounded set of priority due sources; records internal candidates only | None |
| Weekly | Sunday, 9:00 a.m. | Existing technical-health check | `MEkbV88b53GWfXaB2EkM97` | Tests stale-field flags, crawler-visible figures, embed response, and CSV response | None |
| Weekly | Sunday, 10:00 a.m. | Full source-coverage scan | `LVGFdh5YwzEhEP2MAmcmHP` | Scans every executable registered source and records completion, failures, and candidates | None |
| Weekly | Sunday, 11:30 a.m. | Project-queue digest | `ETZkxNridE7etbkqZdXg3Y` | Summarizes candidates, coverage, blockers, and article-target shortfalls in the project queue | None |
| Monthly | First Tuesday, 6:30 a.m. | Research preparation | `6v33ZCHPFKpqauH6Jyt8cw` | Opens the five highest-priority research gaps before the weekday research desk begins | None |
| Quarterly | First Monday of January, April, July, and October, 6:00 a.m. | Audit preparation | `fCyYutkUMw8TQNkbGknzyS` | Opens scoped fact-check and source-cutoff preparation before the weekday research desk begins | None |
| Weekdays | 8:00 a.m. | Research Desk task | `49seKRPuRD9pNsnNXsUH2F` | Runs quality-gated research, drafting, and release preparation; Monday/Wednesday/Friday are article-target days | Only after documented editorial and technical checks |

The Research Desk task expires at **2026-10-06T05:00:00Z**. It is restricted to the repository integration and its own stated scope; it is not configured to use advertising, email, or Slack integrations. The recurring monitoring handlers record a skipped run rather than performing source work outside the approved pilot window.

## Initial Source-Registry Position

The initial registry contains **32 executable public source records**: two daily priority records and 30 weekly records. It also contains **44 explicit source-gap candidates** where the canonical tracker did not yet provide a qualifying public official, administrator, case-agent, court, government, or primary-document URL. A source gap is a research backlog item, not a claim that the trust has had no development.

This initial split is deliberately transparent. The daily monitor does not claim whole-system coverage: it reads at most 25 due sources. The weekly coverage job is responsible for scanning every executable registered source; the monthly preparation job ranks unresolved source gaps. Expansion of the registry must be documented as a source-registry decision and remain inside the pilot’s permitted public, no-charge methods.

## Activation Verification

Two scheduled activation checks were completed through the same production scheduling and data-recording path used by the pilot.

| Check | Scheduled execution | Result | Durable record | Interpretation |
|---|---|---|---|---|
| Controlled detection test | 2026-09-07 04:17:49 UTC | Success, HTTP 200, 3,264 ms | `run-controlled_test-bDzUTQ9zA36LVl`; candidate `controlled-test-BGa2_JekAu1tmj1Q` | Created one synthetic, non-public candidate as audit evidence. The activation-only schedule was then paused. |
| First actual scheduled daily detection | 2026-09-07 04:25:44 UTC | Success, HTTP 200, 14,882 ms; **partial** | `run-daily_detection-b9N9QZZzhQxkzG` | Checked 25 registered sources, found no changed source fingerprint, and recorded nine access/source failures as internal candidates. The activation-only schedule was then paused. |

The source-gap identifier repair was deployed before the successful checks. The failed pre-repair controlled attempt is retained in scheduler history for transparency but is paused and cannot recur. The successful activation records demonstrate that the pilot can create durable run and candidate evidence without changing public data or publishing an article.

## Quality Gates and Weekly Accountability

Every potential public update must retain source URL, source date, observation date, change type, evidence, confidence, reviewer/owner, and disposition. Primary court, trust, administrator, case-agent, and government sources control legal and operational facts. Background sources may add context but never displace controlling primary evidence. Payment percentages, asset amounts, trust status, claims procedures, and court posture require direct supporting evidence before publication.

The three-article weekly objective is a quality-dependent target, not a quota. The weekly project-queue digest must state the number of timely briefs, analyses/explainers, published pieces, held candidates, blocked source gaps, and any article shortfall. It must explain a shortfall rather than permit filler, unsupported synthesis, or an unreviewed publication.

At the end of the pilot, the Research Desk must produce one assessment covering source coverage, detection latency, candidate disposition, publication quality, article output, access failures, time-cap adherence, and the usefulness of the digest. The pilot does not renew automatically.

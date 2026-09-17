# Revised Operating Plan: A Living Asbestos Bankruptcy Trust Research Desk

**Prepared:** September 6, 2026  
**Status:** Approval required before recurring-work configuration  
**Scope:** Keeping the tracker current and publishing useful, source-grounded news and analysis without making Charles the routine approval queue.

## Executive Decision

The recommended model is a **hybrid, review-owned research operation**. It combines lightweight daily detection with scheduled investigative work and prompt publication of verified material developments. It does **not** queue ordinary work for Charles’s approval. Instead, routine verification, editing, and release proceed under standing editorial authority, while Charles receives one concise weekly digest and is interrupted only for a defined set of exceptional decisions.

The operating targets are:

| Outcome | 30-day target |
|---|---:|
| Substantive published articles | **3 each week**: 2 timely news briefs + 1 analysis or explainer |
| Detection frequency | Official source checks **daily, including weekends** |
| Official-source coverage | Every registered source checked at least once every **7 days**, or recorded as inaccessible with owner and next action |
| Material rate/status change | Verified and dispositioned within **1 business day** of detection |
| Routine owner interruptions | One concise weekly digest; urgent interruption only for specified owner decisions |
| Reliability evidence | Durable run record for every scheduled job and a controlled change-detection test before expanding public status reporting |

> **Core rule:** automated work may detect, compare, classify, draft, and test. It may not turn a lead into a public trust fact without controlling evidence and the applicable verification gate.

## Why the Current Arrangement Is Not Enough

The existing enabled weekly job was created on September 3, runs Monday at 09:00 UTC, and currently checks stale source dates, crawler-visible pages, the CSV export, and the official Manville announcement feed. It is useful but narrow: it does not yet provide daily detection, system-wide registered-source coverage, a durable candidate queue, routine editorial production, or a recorded successful run. [1] [2]

The revised plan fixes that at the operating-model level. One shared **source registry** identifies what is checked; one shared **candidate queue** records what changed and who owns disposition; one shared **release record** preserves the source, decisions, test evidence, and production verification. Daily, weekly, monthly, and quarterly work all reuse those same records rather than producing disconnected lists.

## Central-Time Publishing and Research Calendar

All work is scheduled in **America/Chicago**. The system should calculate Central-local execution times across daylight-saving changes instead of silently converting the business calendar into a fixed UTC hour.

| Cadence | Central-local target | Job purpose | Required output | Publication authority |
|---|---:|---|---|---|
| **Daily source sentinel** | 06:30, every day | Lightweight comparison of official feeds, announcement pages, case-agent updates, court/public-agency sources, and high-priority docket leads | Candidate queue entries with source URL, detection timestamp, observed change, affected trust(s), and severity | No direct publication; urgent candidates are escalated to same-day verification |
| **Weekday editorial triage** | 09:30, Monday–Friday | Decide candidate disposition, source depth, article angle, and required verification | Prioritized worklist; article draft assignments; explicit “no change / inaccessible / needs source” records | Research and editorial owners may proceed under standing authority |
| **Timely publication window** | As verified, not held for a slot | Publish material rate, status, procedure, report, or court developments promptly | Source-linked article and/or data release with tests and production verification | Release owner publishes once verification gate is satisfied |
| **Weekly official-source sweep** | Tuesday 10:00 | Check every registered trust, case-agent, and official source at least once per seven days; rotate extended checks across the full system | Coverage report: checked / changed / inaccessible, source owner, next action, and overdue list | No automatic fact publication; verified changes move to release workflow |
| **Weekly publication review** | Friday 14:00 | Confirm the three-article target, quality, queue health, and the weekly digest | Publication log: 2 timely briefs + 1 deeper piece, or an explicit shortfall reason | Routine release proceeds without Charles’s approval |
| **Monthly research sprint** | First full business week | Investigate source gaps, conflicting evidence, missing reports, inaccessible dockets, trust-formation matters, and one or more deeper stories | Research memorandum, updated priority queue, source-gap owners, and deeper-analysis draft(s) | Proposed material changes follow normal verification gates |
| **Quarterly system audit** | Begins within 10 business days after quarter end | Fact check tracker, figures, sources, coverage, public pages, structured data, exports, and reports | Preliminary snapshot plus a later final audit/report tied to actual filing availability | Full report receives editorial/legal-review attribution before release |

The quarter-end deliverable should use two stages. The **preliminary snapshot** begins within ten business days and reports exactly what has been filed or verified at that cutoff. The **final quarterly report** is scheduled only after the known trust-report and court-filing windows have matured. Late filings are added through the normal update workflow, not retroactively described as if they were part of a complete quarter-end census.

## Publishing Program: Three Articles per Week

The weekly target is **three substantive publications**, not three arbitrary posts. The editorial queue must stay four weeks deep so a quiet news cycle produces useful claimant-facing research rather than filler or recycled summaries.

| Article lane | Weekly target | Appropriate subject matter | Evidence standard | Example output |
|---|---:|---|---|---|
| Timely trust-system news | 2 | Payment percentage, trust formation, claims procedure, annual/quarterly results, significant order, appeal, or case-agent notice | Controlling primary source for factual claims; secondary sources may add clearly labeled context | “Trust announces payment percentage increase: effective date, scope, and what claimants should know” |
| Deep analysis / explainer | 1 | Trust payment mechanics, annual-report interpretation, 524(g) process status, claims procedure, source methodology, historic floors, or a current system-wide development | Direct sources plus careful contextual references; no individualized legal advice | “How payment percentage notices affect liquidated and pending claims” |
| Four-week reserve queue | 12 ready topics minimum | Source-backed explainers, report follow-ups, status updates, and trust-specific background | A primary source set must be identified before drafting begins | A reviewed reserve item used only when timely news is sparse |

### Editorial qualification rules

A story qualifies as **timely news** when it contains a newly verified material development. A story qualifies as a **deeper analysis** when it helps readers understand a documented development or the trust system without repeating a previous page. Articles distinguish reporting from individualized legal advice: they explain public records, definitions, and process implications, and direct readers to legal counsel rather than advising a particular claimant about a claim.

Material developments publish promptly upon verification. They should not wait for Friday’s batch. A quiet week can draw from the reserve queue, but no publication should be created merely to satisfy a numeric target.

## Source Registry and Seven-Day Coverage Commitment

The source registry is the operational backbone. Each tracked source must have a canonical identity, a defined fact class, a check interval, and an accountable disposition. This solves the difference between “we looked” and “we can demonstrate what was checked.”

| Registry field | Requirement |
|---|---|
| Record identity | Trust or case name, canonical tracker slug, and associated entity where applicable |
| Source class | Official trust, administrator, case agent, court, government, controlling document, or secondary lead |
| Source URL and retrieval profile | Canonical URL, document/feed URL, expected content type, legitimate header/WAF requirements, and access restrictions |
| Fact classes monitored | Payment percentage, effective date, implementation date, claims process, operational status, assets, cumulative payment, filing, court event, or background only |
| Distinct dates | Publication date, effective date, system-implementation date, financial reporting date, and last successful source check—never substituted for one another |
| Fingerprint and last result | Content hash/ETag or dated comparison result, including no-change and inaccessible outcomes |
| Owner and next action | Named research owner, escalation rule, next check, and follow-up date |
| Evidence level | Field-level primary/qualified-secondary/lead status, rather than a single confidence label applied to unrelated facts |

The weekly coverage requirement is absolute: every registered source is checked at least once within seven days, or the record explicitly says it was inaccessible, why, who owns the remediation, and when it will be retried. No “no change” conclusion is permitted for a source not actually reached.

## Ownership and Continuity

Routine review is assigned to the Research Desk, not to Charles. The plan uses named roles now and supports individual assignment later in the project queue.

| Responsibility | Primary owner | Backup owner | Escalate to Charles only when |
|---|---|---|---|
| Source detection and registry health | Research owner | Monitoring owner | A required official source is inaccessible for two consecutive coverage cycles and an external account, expense, or policy decision is required |
| Evidence verification and field mapping | Research owner | Editorial owner | The source is conflicting, materially ambiguous, or requires an unapproved paid record request |
| News and explainer drafting | Editorial owner | Research owner | The story involves an unapproved editorial position, reputationally sensitive issue, or requires a new standing topic boundary |
| Legal/accuracy review attribution | Paul Danziger and Rod De Llano, under the existing review model | The available reviewer under that model | A legal assertion cannot be supported from public primary material or needs individual-case advice |
| Release and production verification | Release owner | Technical owner | Tests, raw server HTML, source links, or deployment checks fail and a rollback/exception decision is required |
| Weekly owner digest | Operations owner | Research owner | A decision is required from Charles under the escalation rules below |

If a primary owner is unavailable, the backup either completes the task or records the exact blocker in the queue. Work does not silently stop and it does not create repeated approval requests to Charles.

## Verification, Release, and Escalation Rules

| Change class | Required evidence | Target time to disposition | Release rule |
|---|---|---:|---|
| Payment percentage, effective date, or system implementation | Official trust/administrator notice, governing procedure, or filed source with direct URL and source excerpt | 1 business day | Update only the supported field(s); preserve publication, effective, and implementation dates; run source/API/CSV/raw-HTML checks |
| Trust operating status or claims procedure | Official trust, case-agent, plan, or court source | 1 business day | Distinguish confirmation, effectiveness, formation, funding, portal availability, and active claims processing; no inference from a plan alone |
| Annual or quarterly financial result | Filed financial record or official report | 2 business days | Preserve as-of date, measure definition, and field-level confidence; recompute aggregates only where supportable |
| Major court development | Order, docket, or official case-agent source | 1 business day | Publish a source-linked brief when materially relevant; avoid claims beyond the procedural record |
| Secondary-source lead | Credible report, article, or research lead | 2 business days | Create/retain candidate only until controlling source is found; it cannot set tracker facts |

The review gate asks what a source **means**, not simply whether two agents retrieved the same file. For example, a later payment notice can coexist with an older financial filing, provided the site retains each date and measure in its own field. A payment rate unchanged for years is not automatically wrong; it becomes a source-review candidate when the evidence itself is stale or a newer controlling source appears.

## Durable Monitoring Evidence

Before adding public monitoring surfaces, the operation must prove that monitoring works in the records it already controls. Every run must persist or produce a durable record containing:

| Run record field | Required content |
|---|---|
| Scheduled and actual execution time | Central-local scheduled time plus UTC execution timestamp |
| Job identity and version | What ran, against which source-registry version and ruleset |
| Sources checked | Every URL/record attempted and the outcome |
| Failures | HTTP/access issue, parsing issue, timeout, changed source format, or unavailable document |
| Candidates detected | Old/new observation, source evidence, severity, and linked trust/article record |
| Disposition | Verified/released, queued, rejected, inaccessible, or pending—plus accountable owner |
| Release evidence | Test run, raw HTML/API/CSV verification, and published version where applicable |

The first operating milestone is a controlled test that simulates a changed official notice and proves it produces one candidate, one assigned disposition, and no automatic unsupported publication. The second milestone is the next real scheduled run, with the complete run record retained. A public monitor-status page should be considered only after those two proof points exist.

## Notification Policy

Routine operational output stays in the existing project queue. Charles receives **one weekly digest** containing: articles actually published, material corrections, source-coverage gaps, monitored-source failures, decisions only Charles can make, and the 30-day pilot metrics. Repeated reminders are prohibited when a blocked item already has an owner and next action.

Urgent notification is reserved for the following situations: a verified material change that cannot be released under standing authority; a source conflict affecting published high-impact data; a paid-record purchase or legal/policy choice needing explicit approval; a critical production/crawler failure; or a decision that affects firm reputation, legal posture, or external publication policy.

## Thirty-Day Pilot and Bounded Operating Limits

The initial 30 days should be a controlled operating pilot. It proves reliability before adding broad public reporting and records enough evidence to tune the cadence intelligently.

| Pilot metric | Target / limit | Why it matters |
|---|---|---|
| Daily detection passes | 30, including weekends | Establishes a reliable change-detection habit |
| Weekly source coverage | 100% of registry or documented exception | Measures actual coverage, not intent |
| Publications | 12 substantive items minimum, subject to source quality | Measures the three-per-week editorial target without allowing filler |
| Timely-change disposition | 1 business day for material payment/status candidates | Measures response time where accuracy matters most |
| False alerts | Logged and categorized | Tunes source fingerprints and escalation rules |
| Missed changes | Logged with root cause and corrective action | Prevents repeat Manville-type gaps |
| Post-publication corrections | Logged with source and impact | Measures publication quality |
| Charles interventions | Count and reason | Tests whether routine work is truly delegated |
| Research usage | Capped and reported weekly | Prevents open-ended operating cost |

### Proposed initial usage limits

The exact meter depends on the selected execution model and source availability, so the proposal sets **operational ceilings**, not a financial commitment. The daily scanner is limited to lightweight source comparisons and candidate extraction. The weekday editorial pass is limited to the highest-priority candidates. Monthly deep research is limited to the defined source-gap list plus the planned analysis topic. Quarterly work remains a scoped audit with a declared source cutoff rather than an unlimited crawl.

| Work class | Initial limit | Escalation rule |
|---|---:|---|
| Daily detection | One lightweight daily pass; high-priority official sources first | Defer non-critical deep inspection to weekly/monthly queue unless a material change is found |
| Timely verification | One business-day effort for rate/status changes | If unresolved, record blocker and owner; do not repeat unbounded research or notify Charles unless a defined decision is needed |
| Weekly sweep | Registered-source coverage only | New source families enter after registry approval, not by uncontrolled expansion |
| Monthly deep research | Top 5 unresolved source gaps plus 1 deeper-analysis topic | Expand only if the weekly digest shows acceptable reliability and usage |
| Quarterly audit | Defined cutoff and report scope | Late filings enter routine update flow rather than reopening the entire audit |

At the 30-day review, adjust the source registry size, article mix, response-time service level, and research limits based on actual data: published work, missed developments, false alerts, corrections, required interventions, and resource use.

## Configuration Sequence After Approval

1. Establish the source registry and candidate/release queue data model; assign the primary and backup role names.
2. Make the existing weekly monitor observable: persist run records, perform a controlled detection test, and verify its next real scheduled execution.
3. Add the daily sentinel and weekday editorial triage, initially producing queue items and drafts only.
4. Add the weekly all-source coverage sweep and Friday weekly digest.
5. Add the monthly research sprint and quarterly two-stage audit/report cycle.
6. Review 30-day evidence before enabling any narrowly constrained automatic-publication rule.

## Remaining Standing Permissions to Confirm

| Decision | Recommended default | Approval needed |
|---|---|---|
| Operating model | Hybrid staged rollout: review-owned routine releases, no automatic material facts at launch | Confirm |
| Delivery destination | Existing project queue for routine output; one weekly owner digest | Confirm whether the digest should also go to email or Slack |
| Routine data/news publication | Release owner may publish once the documented source and technical gates pass | Confirm standing authority and any excluded topic types |
| Legal reviewer availability | Use the established Paul Danziger/Rod De Llano attribution model, with backup handling as above | Confirm whether any content class requires one named reviewer specifically |
| Urgent escalation window | Interrupt only for the defined exceptional cases | Confirm preferred urgent channel and response expectation |
| Paid sources and PACER | No purchase/charge without express approval remains unchanged | No new permission requested |
| Central-local timing | All operational deadlines follow America/Chicago | Confirm preferred daily and weekly hours if different from the proposed times |

## Recommended Approval

Approve the **hybrid staged rollout** for a 30-day pilot. It is the fastest path to a living tracker without turning every detection into a manual Charles approval or letting automated content make unsupported legal and financial claims. It creates the evidence needed to decide later whether narrowly constrained primary-source updates can publish automatically.

## References

[1]: https://github.com/ChasFletch/asbestos-trust-tracker/blob/main/server/scheduledJobs.ts "Existing weekly staleness, crawler-visibility, and Manville official-feed checks"

[2]: https://asbestostrusts.org/api/trust-figures "Public tracker source used by production monitoring"

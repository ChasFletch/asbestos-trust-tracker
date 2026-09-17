# Proposal: Proactive Living-Tracker Operations

**Prepared:** September 6, 2026  
**Status:** Proposal for approval — **no new recurring jobs or automatic publication rules have been created**

## Purpose

AsbestosTrusts.org should detect material developments before a third party needs to identify them: payment-percentage notices, trust operating-status changes, claim-process announcements, court orders, annual reports, and system-wide regulatory or litigation developments. The objective is not maximum publishing volume. It is a dependable, source-first research operation that identifies meaningful changes quickly, verifies them against controlling materials, and leaves a durable public audit trail.

The September Manville update illustrates the gap to close. The existing weekly job checks source-age thresholds and crawler visibility, but it was not designed to inspect the Trust’s official announcements for a new payment notice. It was created on September 3, is enabled, is scheduled for Mondays at 09:00 UTC, and presently has no recorded executions. [1] [2] The job has now been extended to compare the official CRMC Manville feed with the reviewed tracker record, but one trust-specific check is not an operating system for the entire trust landscape.

> **Operating principle:** Detection may be automated; material legal, operational, and financial facts are not published unless the record contains a direct controlling source, a date, and a source-to-display verification.

## Recommended Operating Model

The proposed program separates **detection**, **verification**, **publication**, and **quality assurance**. This avoids two opposite failures: a static database that misses developments and an automated feed that spreads an unverified assertion.

| Layer | Purpose | Output | Publication rule |
|---|---|---|---|
| Source registry | Maintains each trust’s official site, announcement feed, case-agent page, court/docket lead, document type, retrieval method, and last successful check | Durable monitored-source inventory | Never publishes by itself |
| Detection | Finds new or changed source material | Dated candidate-update queue with URLs, document hashes, and affected records | Never directly changes public facts |
| Verification | Confirms the candidate against controlling primary material and compares it with the existing record | Verified change packet with source excerpt, effective date, field-level confidence, and impact | Required before any material data change |
| Publication | Updates tracker data, news, reports, schema, and internal links as appropriate | Tested release and public provenance entry | Only after required verification gate passes |
| Post-release QA | Checks the deployed raw HTML, API, CSV, schema, and source links | Release evidence and rollback target | Required for data-dependent changes |

## Proposed Cadence

The suggested hours below are a starting point. Background jobs use UTC; if Charles prefers a constant Central-local hour, the UTC expression should be adjusted at daylight-saving transitions.

| Cadence | Suggested target time | Scope | Expected result | Automation and review boundary |
|---|---:|---|---|---|
| **Daily, weekdays** | 08:00 Central | Light source and news scout: official trust/case-agent announcements, bankruptcy and appellate dockets, court press releases, U.S. Trustee material, selected trade/legal news, and the existing editorial queue | A concise internal “nothing material found / candidates found” digest; source-backed news ideas; escalation flags for rate or operating-status changes | Detection and draft creation may be automated. No material tracker fact or full article publishes solely from the daily pass. |
| **Weekly, Monday** | 09:00 Central | Systematic official-source sweep of the source registry: payment notices, annual/quarterly reports, claim-procedure changes, trust status, claims portals, and document availability; raw-HTML/API/CSV health checks | Verified updates ready for release; exception list of unavailable or changed sources; source-age report; crawler health record | Deterministic page/feed comparisons run in the site background. Source interpretation, legal-status assessment, and data changes require direct-source verification. |
| **Monthly** | First business week | Deep research across all tracked trusts and active trust-in-formation matters: court dockets, case agents, trust sites, annual reports, source gaps, payment-rate history, monitoring failures, and public record availability | Monthly research memorandum, priority pull/verification queue, proposed updates, and a refreshed detailed-article queue | Research may produce drafts and recommended changes. Publication occurs only after the normal source and reviewer gates. |
| **Quarterly** | First 10 business days after quarter end | Full system fact check: every tracker record, aggregate arithmetic, provenance timeline, report archive, source links, schema, sitemaps, embeds, public trust-status language, and outstanding corrections | Quarterly “State of the Asbestos Trust System” report, recorded revisions, full data QA log, and release verification | Changes are source-verified and regression-tested; the quarter-end report receives editorial/legal review before public release. |
| **Event-driven escalation** | Immediately upon detection | Payment-percentage change, trust opening/closure/deferral, claims portal change, plan confirmation/effective date, major court ruling, annual report, or primary-source correction | Same-day source-review packet and a release decision | High-impact facts receive priority verification; no inference-based publication. |

## What Each Cadence Should Monitor

### Daily signal sources

Daily work should favor sources capable of changing the site’s public claims: trust and administrator announcement pages, case-agent sites, bankruptcy-court and appellate materials, U.S. Trustee releases, official claim portals, and primary documents newly posted by a trust. Secondary legal/trade reporting can identify leads and support contextual news coverage, but it does not control a payment percentage, asset figure, claim process, or operational status.

The daily briefing should identify whether a candidate is one of three things: a **primary-source update**, a **credible lead needing source confirmation**, or **background-only news**. For the latter category, it can propose a source-linked article outline but should not force an article merely to meet a publishing cadence.

### Weekly source-registry sweep

The weekly sweep should begin with high-volatility records: trusts with recent rate changes, deferrals, open claims-process issues, recent annual reports, trusts in formation, and documents governed by changing case-agent portals. It should then rotate through the full registry so every tracked trust has a documented current source check within a defined window.

Each source-registry row should carry the following minimum fields:

| Field | Why it matters |
|---|---|
| Canonical trust name and tracker slug | Prevents source-to-record mismatches |
| Official source URL(s) and source type | Distinguishes trust, administrator, case agent, court, and secondary sources |
| Checked fact types | Separates payment percentage, assets, claims process, status, and annual reports |
| Retrieval requirements | Records legitimate browser-header/WAF handling and protects against false “site unavailable” findings |
| Last successful check and content fingerprint | Makes source changes detectable and auditable |
| Confidence and publication owner | Preserves field-level provenance rather than one label for an entire record |
| Escalation rule | Identifies changes requiring prompt human/legal review |

### Monthly deep-research review

The monthly review is where an investigator can reconcile multi-source developments: a new docket entry with a case-agent notice, a filed report with the prior year’s claims data, or a payment notice with its effective date and supplemental-payment terms. It should include a **negative-findings section**: sites reviewed but unavailable, account-restricted documents, WAF behavior, and evidence that a claimed update could not yet be verified. “No update found” must be limited to sources actually checked.

### Quarterly fact-check and publication cycle

The quarterly cycle should be the site’s most thorough public reliability event. It should recompute every aggregate from current records; check every non-null financial field against its source-date label; identify records older than the source-age policy; validate source links and PDF previews; test raw HTML, structured data, sitemap, and CSV; review the Figure History timeline; and publish a dated report explaining substantive revisions.

## Verification and Publication Gates

The site should not trade speed for unsupported certainty. A candidate change moves through the following gates.

| Change type | Minimum controlling evidence | Additional requirement | Public action |
|---|---|---|---|
| Payment percentage or effective date | Official trust/administrator notice, governing procedure, or filed record | Preserve direct URL, publication date, effective date, quoted language, and prior value | Update tracked record, source panel, CSV/API, change log, provenance; run data and raw-HTML checks |
| Net assets or cumulative payments | Filed trust/court financial material or a clearly labeled qualified secondary source | Preserve as-of date, measure definition, and confidence by field | Update only the specific supported field; recompute aggregates; label historical figures as floors where appropriate |
| Operating status or claims process | Official trust, plan, case-agent, or court material | Distinguish confirmation, effectiveness, formation, funding, portal availability, and active claims processing | Update status language with explicit limits; publish news only when sufficient source depth exists |
| Court development | Court order/docket or reliable official case-agent material | Identify jurisdiction, case number, filing/order date, and procedural posture | Create a source-linked news brief if materially relevant; do not imply a trust is operational without proof |
| Secondary reporting lead | Credible reporting only | Obtain a controlling source or label as unverified context | May enter internal queue; does not control tracker facts |

Any payment percentage, trust-status, or claims-process update should create a provenance entry and pass the existing cross-page and crawler-visible checks before release. Automated text should not convert a qualified lead into a data fact.

## Two Viable Implementation Approaches

| Approach | Tradeoffs | Cost | Setup complexity |
|---|---|---|---|
| **Review-first research operation** | Daily, monthly, and quarterly research passes identify and draft changes; the existing site background job checks deterministic sources and site health. Every public data or article release is reviewed before publication. Safest at launch, but requires a review step for time-sensitive updates. | Recurring research runs consume usage when full investigation is needed; deterministic site checks remain lightweight. | Moderate: source registry, queue, alert format, and enhanced weekly monitor. |
| **Constrained proactive publication** | Same detection and verification layers, with automatic release allowed only for narrowly defined, unambiguous primary-source events—such as a trust-issued payment notice where rate, effective date, and source URL are explicit and tests pass. Faster, but needs carefully defined exception handling and regular audit. | Lower routine review burden after setup; still requires periodic deep research and governance review. | Higher: field-level rules, release locks, rollback procedure, and durable audit trail. |
| **Hybrid staged rollout** | Start review-first for 30–60 days while measuring false positives and source reliability. Then allow constrained automatic updates only for proven, high-confidence source patterns while retaining manual approval for legal posture, trust operation, and substantive articles. | Moderate initially; becomes more efficient as rules mature. | Moderate to high, phased rather than all at once. |

## Proposed First 30 Days After Approval

The first month should prioritize reliability over volume. First, build the source registry around all tracked trusts and establish a high-priority cohort covering payment-rate volatility, source gaps, deferrals, operating-status questions, and trusts in formation. Second, make the current weekly job demonstrably operational: record a successful execution, retain its output, and validate that it alerts on a controlled source-change test. Third, begin daily source/news scouting and a monthly deep-research memorandum, with each candidate stored in an editorial/verification queue rather than becoming a public assertion immediately.

After 30 days, evaluate detection quality, source availability, false-positive rate, review time, and whether a limited automatic-publication policy is appropriate. The quarterly review should remain a formal audit even if narrower updates become automated.

## Decisions Requested Before Configuration

1. Choose an implementation approach: **review-first**, **constrained proactive publication**, or a **hybrid staged rollout**.
2. Confirm the desired delivery location for daily/weekly/monthly findings: project notification, email, Slack, or a site-admin queue.
3. Confirm whether “same day” means a target of **within one business day** for verified rate/status changes, or a faster emergency path for specific event classes.
4. Confirm whether Charles wants a fixed Central-local delivery hour year-round, which requires daylight-saving-aware schedule adjustments, or a fixed UTC time.

## References

[1]: https://github.com/ChasFletch/asbestos-trust-tracker/blob/main/server/scheduledJobs.ts "Existing staleness, crawler-visibility, and Manville notice monitor"

[2]: https://asbestostrusts.org/api/trust-figures "Public tracker data API monitored by the existing job"

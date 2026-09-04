# AsbestosTrusts.org — Daily Accomplishment Log

**Date:** September 3, 2026  
**Project:** AsbestosTrusts.org / Asbestos Trust Fund Tracker  
**Prepared for:** Danziger & De Llano, LLP  
**Release status:** All completed application changes listed below were checkpointed and automatically published to the production site during the day.

## Executive Summary

Today’s work materially advanced **data accuracy, crawler-visible publishing, source transparency, and internal content discovery** across AsbestosTrusts.org. The tracker was refined with a newly reconciled primary-source figure; the homepage and embeddable clock were repaired so their figures appear in initial server-rendered HTML; the public News section gained five detailed, source-linked articles; and trust-detail pages now surface only deliberately reviewed related articles and research reports.

The work followed the site’s core editorial rule: **court filings, trust-issued notices, trust reports, and case-agent materials control legal and trust-specific facts.** Secondary websites may provide background context, but they do not control figures, payment rates, claims-process status, or the existence of an operating trust.

| Area | Result delivered today | Reader and search value |
|---|---|---|
| Tracker accuracy | ABB Lummus FY2025 figure reconciled and public history updated | Keeps the current aggregate tied to a traceable filed source |
| Crawler visibility | Homepage and `/embed/clock` figures render before JavaScript; embed route returns 200 | Search engines, AI systems, and external embeds can read the key figures |
| News publishing | Five full, canonical, source-linked articles added | Converts thin news cards into citable, discoverable reference content |
| Feed reliability | Vi-Jon duplicate-card path removed and cache safeguards added | Protects the canonical article and avoids stale/deleted card reappearance |
| Trust-page discovery | Curated related-article and research-report modules added | Helps readers move from a trust record to the most relevant supporting analysis |

## Current Tracker Snapshot and Source-Integrity Work

The tracker’s September 3 snapshot now presents **$16,033,489,279** as the documented remaining-assets floor across **43 of roughly 60 active U.S. asbestos trusts**. This is a coverage-qualified floor, not a claim that all figures are contemporaneous: the underlying source dates span FY2021 through FY2025. The site also retains the bottom-up payout series of **$30,033,989,206**, with its methodology and confidence distinctions preserved.[1]

ABB Lummus’s FY2025 annual-report figure of **$14,960,830** was reconciled against the available source record and added to the public Figure History timeline. The review also confirmed that the owner-supplied ABB PDF was byte-identical to the source already present in the site-hosted library, so no duplicate artifact was uploaded. This protects the source library from duplication while preserving the provenance trail.[2] [3]

The Uniroyal disclosure-statement hearing article was refined to describe its date source accurately as an **official case-agent** source. That wording improvement did not alter trust figures or overstate the status of any proposed trust structure.[2]

| Figure or record | Status after today’s work | Qualification retained on site |
|---|---|---|
| Remaining assets floor | $16,033,489,279 | Documented floor; 43 of roughly 60 active trusts; snapshot date is distinct from underlying reporting dates |
| Bottom-up payout series | $30,033,989,206 | Methodology-led aggregate; historical and confidence distinctions remain visible |
| ABB Lummus FY2025 figure | $14,960,830 | Filed source record added to public figure history |
| Hopeman status | Confirmed plan structure, but no public proof of an operating claims trust | No effective-date, payment-rate, portal, or operational-status claim was added without primary support |

## Crawler-Visible Clock and Embed Repairs

The homepage and embeddable clock were repaired so the compensation figures and their qualifying disclosure are present in the **initial server-rendered HTML**, rather than appearing only after client-side JavaScript runs. The `/embed/clock` route was registered for server-side prefetching and corrected to return **HTTP 200**. The Schema.org Dataset `contentUrl` was corrected to the live `/trusts.csv` export.[4]

A compact plain-text figure summary now appears beneath the homepage clock and on the embed experience. It states the documented-floor nature of the asset total, the coverage count, the tracker refresh date, and the range of underlying fiscal-year source dates. This gives readers—and systems that do not execute JavaScript—the necessary context to avoid treating a multi-year evidence set as a single current audited balance.[5] [6]

The existing weekly monitor was expanded to detect regressions in crawler visibility. It now checks the homepage and embed server HTML for the expected figure text, validates the embed response status, and confirms the public CSV export remains available. The enabled weekly task runs Mondays at 09:00 UTC under task UID `MEkbV88b53GWfXaB2EkM97`.[5] [6]

| Repair | What changed | Validation completed |
|---|---|---|
| Homepage figure SSR | Live nonzero figures and disclosure render in the initial HTML | Crawler-focused regression coverage and raw HTML check |
| Embed route | `/embed/clock` prefetch and route status corrected | HTTP 200 and server-visible figure text |
| Dataset schema | CSV URL changed from a broken endpoint to `/trusts.csv` | Public CSV export checked |
| Ongoing monitoring | Weekly crawler regression checks added | Scheduled monitor enabled after publication |

## News Feed Quality, Full Articles, and Article Metadata

The News feed’s fixed character clipping was replaced with sentence-safe summary extraction, preventing a source-backed update from ending mid-sentence. The revised parser behavior was covered by focused tests and production verification.[7] [8]

The site’s reusable **Read more** pattern was expanded into a durable detailed-article framework. Every eligible article added today has a canonical internal URL, reader-visible source-linked content, breadcrumbs, legal-review attribution, canonical metadata, `NewsArticle` structured data, sitemap coverage, and a clear separation between controlling sources and background resources.[9] [10]

### Detailed Articles Added or Completed Today

| Article | What it covers | Key accuracy safeguard |
|---|---|---|
| Hopeman Brothers plan confirmation | Confirmed plan structure and the later Fourth Circuit appeal | States that public materials do **not** establish an effective date, live claims process, payment percentage, or operating trust |
| Uniroyal Legacy Unit Chapter 11 | Disclosure-statement hearing coverage | Uses official case-agent sourcing for hearing-date attribution |
| Owens-Illinois payment percentage | Trust-issued August 19 notice increasing the percentage from 50% to 65% | Treats the official notice as controlling and explains supplemental payments carefully |
| Bestwall Supreme Court matter | June 1 certiorari denial and active Chapter 11 posture | States that no effective, funded, operating asbestos trust or claims process has been established |
| Vi-Jon Chapter 11 | Chapter 11 filing and proposed talc-claims channeling structure | Uses case-agent and U.S. Trustee sources; does not represent a proposed trust as operational |

The Hopeman article was updated to cite the filed confirmation order and Fourth Circuit appeal notice, while preserving the secondary-only characterization of the reported funding amount. No unsupported estimate was promoted to a filed fact.[9]

Where genuinely useful, the new articles include bounded references to WikiMesothelioma.com and AsbestosAtlas.org for background or navigation. Those resources were not used to control legal facts, payment rates, trust operations, trust figures, or claims processes.[10] [11] [12]

## Vi-Jon Feed-Duplicate Resolution and Cache Safeguards

The apparent second Vi-Jon card was investigated without deleting the canonical database-backed record. The canonical item remains database record **ID 30001**, titled **“Vi-Jon Files Chapter 11 to Channel Talc Claims into 524(g) Trust,”** and it links to the full internal article.

The duplicate was traced to a legacy markdown draft path rather than a second canonical database record. The redundant public draft was removed from the feed while being retained outside the public-feed path as research material. The public draft-feed response now uses `Cache-Control: no-store`, and the GitHub draft-directory request now specifies `ref=main`, includes a cache-busting query, and sends a no-cache header. These safeguards prevent a fresh application process from re-ingesting a deleted draft from a stale GitHub directory listing.[13] [14] [15]

Final live verification confirmed that `/api/news-drafts` returned HTTP 200 with `Cache-Control: no-store`, contained neither the legacy Vi-Jon filename nor title, and that a clean News-page load presented one canonical Vi-Jon card with its **Read more** destination intact.[15]

## Trust-Detail Content Discovery Improvements

### Related Articles

Trust detail pages now use an explicit, reviewed article-to-trust mapping instead of keyword matching. The **Manville Personal Injury Settlement Trust** page links to its Q2 2026 detailed article, and the **Paddock Enterprises (Owens-Illinois) Asbestos Trust** page links to the 65% payment-percentage article. The former generic query behavior could surface legally unrelated entries; it was removed from this module so a Paddock reader does not receive irrelevant Bestwall or B&W items merely because a broad word match occurred.[16]

The Related Articles cards are accessible, responsive, and server-rendered. Each contains the article title, summary, publication date, category, and a canonical internal action link.

### Related Research Reports

A separate **Related Research Reports** module now appears only on trust pages with sustained, directly relevant report coverage. A trust is eligible only where at least two report editions contain substantive analysis of that trust’s documented figures, payment history, or case status. Passing system-wide references are deliberately excluded.

The curated registry currently includes 19 eligible trust pages: NARCO, DII Industries, Manville, Western, Thorpe Insulation, Plant, Maremont, API, W.R. Grace, Pittsburgh Corning, USG, Owens Corning/Fibreboard, Celotex, Combustion Engineering, Kaiser, Babcock & Wilcox, Motors Liquidation, Rapid-American, and Kaiser Gypsum. Each eligible page presents up to three current report cards with an ATR identifier, publication date, data-as-of date where available, summary, and canonical **Read report** link.[17]

The necessary report index is now prefetched for eligible trust routes, so these report links are included in server-rendered HTML and remain visible to crawlers. Pages without sustained direct coverage—such as the Paddock page—do not display the report module.[17]

| Discovery module | Inclusion rule | What is intentionally prevented |
|---|---|---|
| Related Articles | An article declares an explicit reviewed trust slug | Name/keyword matches that could surface an unrelated legal matter |
| Related Research Reports | At least two editions directly and substantively cover the trust | One-line or system-wide report mentions treated as if they were dedicated trust analysis |

## Validation and Release Record

Every application milestone was validated before publication. The final build for today’s trust-detail discovery work passed **23 test files and 69 assertions**, TypeScript checking, the SSR/client/server production build, raw server-rendered HTML checks, and desktop/mobile visual review. The normal package-manager configuration warning and production chunk-size advisory remain non-blocking and did not affect the build outcome.[17]

| Checkpoint | Purpose |
|---|---|
| [ea7c943][4] | Server-rendered live figures, embed HTTP 200, and corrected Dataset CSV URL |
| [e89b082][5] | Clock disclosure beneath homepage/embed and crawler-monitor expansion |
| [6444d41][6] | Enabled monitor and production verification of qualified clock disclosures |
| [87c3236][2] | ABB filed figure history and Uniroyal source-label refinement |
| [2539517][9] / [393bafad][10] | Hopeman detailed article, Read more framework, and live verification |
| [3fa8517][11] | Uniroyal detailed article and editorial queue |
| [77a2aa4][12] / [159958e][18] | Owens-Illinois detailed article and live verification |
| [012faecb][19] / [5215e80c][20] | Bestwall detailed article and live verification |
| [9e9b47e][21] / [a6e11e06][22] | Vi-Jon detailed article and removal of redundant public legacy path |
| [3f7c4bae][14] / [3f2ae29c][15] | Draft response no-store policy and durable GitHub directory-list cache protection |
| [e03d2d7f][16] | Explicit, source-aware Related Articles modules |
| [5d65e245][17] | Curated SSR-visible Related Research Reports modules |

## Guardrails Preserved Throughout the Work

The upgrades did not alter the site’s governing accuracy rules. Historical payout and asset data remain labeled as floors or date-bounded figures rather than current totals. The site does not claim that Hopeman, Bestwall, or Vi-Jon is an operating asbestos trust without public operational proof. No PACER charges or purchases were made. The authoritative source hierarchy remains intact: primary court, trust, and case-agent materials control legal and operational facts.

## Recommended Follow-Up Work

The most valuable next steps are to keep the editorial article queue current; add a small, structured “trusts covered” index at the bottom of each research report; and develop a public monitor-status page summarizing the freshness and crawler-visibility checks already running behind the tracker.

## References

[1]: https://github.com/ChasFletch/asbestos-trust-tracker/blob/main/client/src/data/trust-figures.json "Canonical trust figures and aggregate methodology"
[2]: https://github.com/ChasFletch/asbestos-trust-tracker/commit/87c3236 "ABB Lummus filed figure history and Uniroyal source-label refinement"
[3]: https://github.com/ChasFletch/asbestos-trust-tracker/commit/482d27c "ABB source-library identity check and Hopeman status research"
[4]: https://github.com/ChasFletch/asbestos-trust-tracker/commit/ea7c943 "Clock SSR and embed route repair"
[5]: https://github.com/ChasFletch/asbestos-trust-tracker/commit/e89b082 "Clock summary and crawler-monitor enhancements"
[6]: https://github.com/ChasFletch/asbestos-trust-tracker/commit/6444d41 "Monitor registration and live verification"
[7]: https://github.com/ChasFletch/asbestos-trust-tracker/commit/328a399b "Sentence-safe news-card summary extraction"
[8]: https://github.com/ChasFletch/asbestos-trust-tracker/commit/409ac6c "Live verification of completed Hopeman card summary"
[9]: https://github.com/ChasFletch/asbestos-trust-tracker/commit/2539517 "Hopeman detailed article and Read more framework"
[10]: https://github.com/ChasFletch/asbestos-trust-tracker/commit/393bafad "Hopeman detailed-article production verification"
[11]: https://github.com/ChasFletch/asbestos-trust-tracker/commit/3fa8517 "Uniroyal detailed article"
[12]: https://github.com/ChasFletch/asbestos-trust-tracker/commit/77a2aa4b "Owens-Illinois detailed article"
[13]: https://github.com/ChasFletch/asbestos-trust-tracker/commit/9e9b47e5 "Vi-Jon detailed article"
[14]: https://github.com/ChasFletch/asbestos-trust-tracker/commit/3f7c4bae "No-store cache policy for removed news drafts"
[15]: https://github.com/ChasFletch/asbestos-trust-tracker/commit/3f2ae29c "Final Vi-Jon duplicate-card cache resolution"
[16]: https://github.com/ChasFletch/asbestos-trust-tracker/commit/e03d2d7f "Source-aware Related Articles modules"
[17]: https://github.com/ChasFletch/asbestos-trust-tracker/commit/5d65e245 "Source-aware Related Research Reports modules"
[18]: https://github.com/ChasFletch/asbestos-trust-tracker/commit/159958ef "Owens-Illinois article production verification"
[19]: https://github.com/ChasFletch/asbestos-trust-tracker/commit/012faecb "Bestwall detailed article"
[20]: https://github.com/ChasFletch/asbestos-trust-tracker/commit/5215e80c "Bestwall article production verification"
[21]: https://github.com/ChasFletch/asbestos-trust-tracker/commit/9e9b47e5 "Vi-Jon detailed article"
[22]: https://github.com/ChasFletch/asbestos-trust-tracker/commit/a6e11e06 "Canonical Vi-Jon card flow and legacy-draft removal"

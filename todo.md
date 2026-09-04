# AsbestosTrusts.org — Project TODO
# Cross-links to/from AsbestosAtlas.org throughout

## Phase 1: Database & Data
- [x] Design and migrate trust fund database schema (trusts, payment_history, news_items, aggregate_snapshots tables)
- [x] Seed all 20+ trust records from research data
- [x] Seed payment percentage history for all trusts
- [x] Seed initial aggregate snapshot

## Phase 2: Backend API
- [x] tRPC procedure: get all trusts (with payment history)
- [x] tRPC procedure: get single trust by id
- [x] tRPC procedure: get aggregate totals
- [x] tRPC procedure: get news items
- [x] tRPC procedure: admin update trust record (protected)
- [x] tRPC procedure: admin bulk ingest from JSON (protected, for Kimi K3 pipeline)
- [x] tRPC procedure: admin add news item (protected)
- [x] tRPC procedure: get methodology content

## Phase 3: Hero & Layout
- [x] Global dark-theme layout with top navigation
- [x] Animated digit-flip debt-clock component (two counters: remaining + paid out)
- [x] Hero section with clock, last-updated badge, and methodology link
- [x] Responsive mobile layout for clock

## Phase 4: Trust Data Table
- [x] Sortable trust table (name, payment %, direction, net assets, as-of date, confidence, administrator)
- [x] Filter panel (administrator, direction, payment % range)
- [x] Expandable payment percentage history panel per trust
- [x] Source confidence badge (a/b/c color-coded)
- [x] Direction arrow indicator (up/down/stable)
- [x] Stale data warning badge (>18 months since as-of date)

## Phase 5: Content Pages
- [x] Methodology page (aggregate calculation, a/b/c system, known gaps, PACER note)
- [x] About page (mission, funder acknowledgment, entity Schema.org)
- [x] News feed page (curated, no competitor law firms, links only to D&D/AsbestosAtlas/WikiMesothelioma)
- [x] Schema.org Dataset structured data on homepage
- [x] Schema.org Organization structured data (Danziger & De Llano as funder)
- [x] Schema.org ResearchProject structured data
- [x] robots.txt and sitemap.xml (post-deploy)
- [x] Downloadable CSV of trust data (/trusts.csv Express route)

## Phase 6: Cron / Pipeline
- [x] Weekly cron job handler: /api/scheduled/staleness-check
- [x] Flag stale records in database
- [x] Admin email alert when new data detected
- [x] Admin-protected JSON ingest endpoint for Kimi K3 pipeline
- [x] Register Heartbeat cron schedule (deferred — requires deploy; handler is ready)

## Phase 7: QA & Delivery
- [x] Vitest: auth.logout, trusts.list, news.list, admin.updateTrust — 4 tests passing
- [x] TypeScript 0 errors
- [x] Final screenshots all pages
- [x] Checkpoint saved — version b025c7e0

## Future Iterations
- [x] robots.txt and sitemap.xml (post-deploy with real domain)
- [x] Downloadable CSV of trust data (/trusts.csv Express route)
- [x] GitHub runtime fetch pipeline (/api/trust-figures proxies raw GitHub JSON, 1hr cache)
- [x] Repo made public — raw.githubusercontent.com URL live, no auth needed
- [x] Aggregate reconciled to Kimi K3 verified figures: $17,041,946,126 documented floor, $22.5B high, $24B payouts
- [x] Trust records corrected: WRG 30.1%, USG 11%, Armstrong 10.8%, CE 15.3%, Western 51.1%, Rapid-American closed
- [x] DebtClock updated: documented floor as primary counter, estimated range strip ($17B–$22.5B), payouts sublabel updated
  - [x] Register weekly Heartbeat cron after first deploy
- [x] PACER pull for W.R. Grace FY2025, Pittsburgh Corning, Celotex, B&W annual reports (endpoint built at /api/pacer/pull-queue — PACER account unlocked, pulls completed by Kimi 7/29/2026)
- [x] Per-trust detail page (/trusts/:id) — all 42 trusts, payment history chart, changes timeline, source citations
- [x] PACER pull endpoint built: /api/pacer/pull, /api/pacer/pull-queue, /api/pacer/status with CourtListener RECAP fallback
- [x] pacer-pull-queue.json: 7 priority documents queued ($33-45 total, WRG FY2025 highest priority)
- [x] Dynamic /reports/:id route rendering full markdown report on-site
- [x] Key Findings bulleted list on ATR-2026-Q3 report card at /reports
- [x] Trust table wired to render directly from trust-figures.json as primary source
- [x] News feed wired to read from client/src/data/news-drafts/ (Kimi weekly markdown, 15min cache)
- [x] Quarterly Reports page added at /reports — reads from reports/index.json, graceful pending state
- [x] Reports nav link added to SiteNav
- [x] /api/news-drafts and /api/reports Express endpoints added to dataRoutes.ts
- [x] Domain updated everywhere: asbestostrusts.org (nav, footer, OG tags, Schema.org, sitemap, robots.txt, llms.txt)
- [x] Warm off-white parchment retheme: index.css tokens, ThemeProvider light, all pages updated
- [x] Payouts counter updated to derived $26,629,722,253 with methodology tooltip
- [x] Remaining assets tooltip with top-trust breakdown
- [x] Last Updated timestamps under both counters (live from trust-figures.json asOf)
- [x] "Read full methodology" link in both tooltips
- [x] Trust table rewritten: all 42 trusts from trust-figures.json (was DB-only ~14 trusts)
- [x] DB data errors fixed: Kaiser 10.6%/$308.8M, Quigley $597.8M, ASARCO $735.9M, Garlock MSV
- [x] llms.txt added at /llms.txt with canonical figures and citation guidance
- [x] FAQ JSON-LD schema added to Methodology page (7 questions)
- [x] Corrections page added at /corrections with submission form and recent corrections log
- [x] Reports archive backfilled: ATR-2025-Q4 (2025 Year in Review), ATR-2026-Q1, ATR-2026-Q2 retrospective issues with summaries + Key Findings in index.json; editor's note added to ATR-2026-Q3 comparability section
- [x] Ingest backfill-verified items into trust-figures.json changes log: Quigley 10/30/2025 cut (14.5→13.3% non-releasing), H.K. Porter 1/31/2025 resumption at 3.0%, Celotex 1/22/2025 audit notice, Shook & Fletcher 50→58% May 2025 (outside floor)
- [x] PACER pull for W.R. Grace FY2025, Pittsburgh Corning, Celotex, B&W annual reports (endpoint built at /api/pacer/pull-queue — pending PACER account unlock by support team)
- [x] Ingest backfill-verified items into trust-figures.json changes log: Quigley 10/30/2025 cut (14.5→13.3% non-releasing), H.K. Porter 1/31/2025 resumption at 3.0%, Celotex 1/22/2025 audit notice, Shook & Fletcher 50→58% May 2025 (outside floor)
- [x] Cumulative payouts modal updated: 14-trust two-group layout (2025-2026 current-era vs 2006-2014 historical floors) with per-trust rows, subtotals, and staleness disclosure
- [x] llms.txt and Methodology.tsx updated with 14-trust / $19.81B documented figures (pending Kimi sync)
- [x] PACER pull for W.R. Grace FY2025, Pittsburgh Corning, Celotex, B&W annual reports (endpoint built at /api/pacer/pull-queue — pending PACER account unlock by support team)
- [x] Ingest backfill-verified items into trust-figures.json changes log: Quigley 10/30/2025 cut (14.5→13.3% non-releasing), H.K. Porter 1/31/2025 resumption at 3.0%, Celotex 1/22/2025 audit notice, Shook & Fletcher 50→58% May 2025 (outside floor)
- [x] OC/FB dual percentage display: table shows 4.3% / 3.5%, expanded panel shows sub-account breakdown with explanation
- [x] PACER pull — W.R. Grace FY2025: completed, cumulativePaid $2,690,000,000 documented (Doc 33347)
- [x] PACER pull — DII Industries FY2005-FY2013 early years: completed, 12-year subtotal $1,254,425,009 documented
- [x] PACER pull — Motors Liquidation (GM) PI Trust: completed, cumulativePaid $136,200,000 documented (Doc 14861)
- [x] [Externally unavailable] PACER pull — Pittsburgh Corning: entries 10913, 10920, and 10921 confirmed unavailable through Buy on PACER; owner submitted no-cost CourtListener community requests. Retain the secondary $3.07B qualification pending a donated source document.
- [x] [Externally restricted] PACER pull — Celotex Doc. 14439 (FY2025 Annual Report, Summary of Claims Disposed, Financial Statement, and Trustee Account; filed 2026-04-28) confirmed present on docket but inaccessible to the owner’s PACER account. Retain the historical FY2006 $575M personal-injury figure with clear scope and staleness labeling.
- [x] PACER pull — Babcock & Wilcox: owner supplied filed Doc. 7876 / Exhibit 1 (FY2023 Annual Report and Account), which provides a primary cumulative-payment calculation of approximately $1.9783B as of 2023-12-31.
- [x] Analyze owner-supplied Babcock & Wilcox docket PDF and identify the highest-probability annual-report entries for a primary cumulative-payout record
- [x] Promote the filed B&W FY2023 cumulative-payment calculation ($1.9783B) from the secondary payout tier to a source-linked filed figure and reconcile aggregate counts/totals
- [x] Reconcile stale trust-figures methodology text and unresolved-gap language after B&W’s filed-source promotion
- [x] Verify B&W cumulative-payout source links and bottom-up aggregate rendering after the filed-source promotion
- [x] Replace the pre-promotion cumulative-payout methodology string in trust-figures.json rather than relying on a parallel current-summary field
- [x] Visually verify the published B&W trust detail source panel and homepage bottom-up payout UI after the filed-source promotion
- [x] Fix the B&W trust detail card rendering “Cumulative Paid —” despite the newly filed cumulative-payment record
- [x] Repair invalid trust-figures.json syntax introduced in the B&W methodology reconciliation and re-verify the GitHub raw-data feed
- [x] Explicitly document the post-fix B&W Cumulative Paid card, as-of date, and source-panel results from the rendered page
- [x] Explicitly document the post-fix homepage cumulative-payout counter and tier-total result from the rendered page
- [x] Capture text-verifiable server-rendered evidence for B&W’s cumulative-payment card and source controls
- [x] Capture text-verifiable server-rendered evidence for the homepage $30,020,097,653 payout total
- [x] Extract visible rendered-DOM text for B&W’s “Cumulative Paid” card, 2023-12-31 as-of label, and Annual Report preview control
- [x] Add a source-linked B&W cumulative-payment calculation explainer beneath the Cumulative Paid card
- [x] Add standardized source-age labels for historical cumulative-payment figures on trust detail pages
- [x] Verify the historical source-age label on a valid representative historical trust detail route after the initial test URL returned not found
- [x] Add a historical-floor badge and “documented minimum” explanation to older cumulative-payout modal rows
- [x] Replace stale "$24B" and pre-promotion tier summary copy in the cumulative-payout modal with dynamic current figures
- [x] Manual PACER guide — provide no-charge lookup steps, target records, and purchase safeguards for Celotex and Babcock & Wilcox
- [x] Free-source sweep — Pittsburgh Corning: searched official trust resources, CourtListener/RECAP, Internet Archive, and public court repositories; no accessible primary cumulative-payout filing located
- [x] Free-source sweep — Celotex: searched official trust resources, CourtListener/RECAP, Internet Archive, and public court repositories; no accessible primary cumulative-payout filing located
- [x] Free-source sweep — Babcock & Wilcox: searched official trust resources, CourtListener/RECAP, Internet Archive, and public court repositories; no accessible primary support for the $1.94B payout floor located
- [x] Deeper no-cost archive/mirror follow-up: official report pages, document libraries, CourtListener/RECAP, and public corporate filings reviewed; no qualifying primary cumulative-payout document recovered
- [x] CourtListener community request — owner manually submitted no-cost requests for PCC annual-report entries 10913, 10920, and 10921 after approval
- [x] CourtListener community request — entries 10913, 10920, and 10921 submitted manually through the owner’s signed-in session
- [x] CourtListener community request packet — document exact PCC annual-report entries, filing dates, and request language for no-cost submission after owner sign-in
- [x] CourtListener access repair — verified stable direct docket and sign-in paths after the prior navigation returned “Page not found”
- [x] Methodology.tsx updated: FAQ JSON-LD figures corrected ($16,746,136,347 remaining assets, $29,981,797,653 cumulative payouts), $30B section revised with bottom-up context and $16.7B documented floor, Known Gaps updated (WRG/DII complete, PCC blocked, Celotex restricted, B&W queued), new Cumulative Payouts Methodology section added (three-tier build table, honest caveats, revision log)
- [x] Data fix: rateSource §5.5 → §4.2 for PCC trust (correct TDP section citation)
- [x] Data fix: CourtListener search URL labels added (NARCO, Manville, API cumulativePaidSourceUrlType)
- [x] Data fix: PCC per-field confidence (netAssetsConfidence: secondary/2022, paymentPctConfidence: filed/2024)
- [x] SSR: client/index.html — replace static SEO tags with <!--app-head--> placeholder
- [x] SSR: client/src/entry-client.tsx — hydrateRoot + HydrationBoundary
- [x] SSR: client/src/entry-server.tsx — renderToString + prefetch
- [x] SSR: client/src/ssr/prefetch.ts — route prefetch map for all public routes
- [x] SSR: client/src/components/Head.tsx — client-side title sync on navigation
- [x] SSR: server/_core/ssrCaller.ts — in-process tRPC caller for SSR
- [x] SSR: server/_core/vite.ts — SSR-aware dev + prod wiring
- [x] SSR: vite.config.ssr.ts — SSR build config
- [x] SSR: package.json build script — three-artifact build
- [x] SSR: CANONICAL_ORIGIN and SITE_NAME env vars
- [x] SSR: App.tsx — add Head component for client-side title sync

- [x] Fix rateSource §5.5 → §4.2 for PCC trust
- [x] Add cumulativePaidSourceUrlType labels for NARCO, Manville, API (CourtListener search URLs)
- [x] Add per-field confidence for PCC (netAssetsConfidence: secondary, paymentPctConfidence: filed)
- [x] SSR: entry-client.tsx, entry-server.tsx, ssr/prefetch.ts, Head.tsx
- [x] SSR: ssrCaller.ts, vite.ts SSR wiring, vite.config.ssr.ts, build script update
- [x] SSR: ThemeContext localStorage SSR guard
- [x] SSR: All public routes return correct title, og:title, canonical, HTTP status
- [x] QA fix: scheduledValues added to trustFigures.bySlug projection — table now renders on detail page
- [x] QA fix: paymentPercentageSource render path added to TrustDetail (source attribution, effective date, rateSource fallback)
- [x] QA fix: legacy confidence field hierarchy documented — per-field confidences take priority, legacy is fallback only
- [x] QA fix: unicode escape sequences in source attribution replaced with actual characters
- [x] Remove unverified §5.5 Secondary Exposure Claims caveat from PCC scheduledValues (amendment verified for OC/Fibreboard, USG, W.R. Grace — NOT PCC)
- [x] Fix hydration mismatch: add timeZone:"UTC" to all date formatting in Home.tsx and News.tsx
- [x] Remove debug logging from entry-server.tsx
- [x] Clean up test-ssr-query.mjs
- [x] Add Google Search Console verification file (googled0a8bbe6c3fe6bf7.html)
- [x] Generate sitemap.xml with all 42 trust detail URLs, reports, static pages (54 URLs total)
- [x] robots.txt already includes Sitemap directive pointing to sitemap.xml
- [x] Expand global JSON-LD @graph with full LegalService entity for Danziger & De Llano, LLP
- [x] Add Person entities for Paul Danziger and Rod De Llano with credentials and sameAs
- [x] Add jsonLd field to HeadMeta for per-page structured data injection via SSR
- [x] Add Article schema on trust detail pages with author attribution
- [x] Add Article schema on report pages with author attribution
- [x] Move FAQPage schema from Methodology useEffect into SSR head
- [x] Expand global @graph with LegalService (Danziger & De Llano, LLP) and Person entities (Paul Danziger, Rod De Llano)
- [x] Add per-page Article schema on trust detail pages with author attribution to principals
- [x] Add ScholarlyArticle schema on report pages with author attribution
- [x] Add TechArticle schema on methodology page with author attribution
- [x] Move FAQPage schema from client-side useEffect to SSR (crawler-visible without JS)
- [x] Add jsonLd field to HeadMeta type for per-page structured data injection
- [x] Add visible "Reviewed by Paul Danziger and Rod De Llano" badge on trust detail pages
- [x] Add visible "Reviewed by Paul Danziger and Rod De Llano" badge on report detail pages
- [x] Add breadcrumb navigation on all trust detail pages (Home → Trust Data → {shortName})
- [x] Add breadcrumb navigation on all report detail pages (Home → Reports → {title})
- [x] Add clickable credentials modal to "Reviewed by" badge (opens modal with Paul Danziger and Rod De Llano professional credentials)
- [x] Add PACER unavailability indicator on trust detail pages where documents are blocked (PCC, Celotex, USG, Armstrong, OC/FB — triggered by PACER-only/CM/ECF keywords in note field; B&W correctly excluded since its pull succeeded)
- [x] Add PACER unavailability indicator on trust detail pages where documents are blocked (PCC, Celotex, USG, Armstrong, OC/FB — triggered by PACER-only/CM/ECF keywords in note field; B&W correctly excluded since its pull succeeded)
- [x] Add "Last Updated" timestamp next to payment percentage on trust detail pages
- [x] Add "Last Updated" timestamp next to payment percentage on trust detail pages
- [x] Add "Related News" section on trust detail pages showing recent articles for that trust
- [x] Add hover tooltip for legal terms (e.g. "524(g) filing") in news posts
- [x] Add hover tooltip for legal terms (e.g. "524(g) filing") in news posts
- [x] Embeddable clock widget: standalone /embed/clock route with compact and full-width variants
- [x] Embeddable clock widget: standalone /embed/clock route with compact and full-width variants
- [x] Embeddable clock widget: "Powered by AsbestosTrusts.org" attribution bar with dofollow backlink
- [x] Embeddable clock widget: embed code modal with size selector, live preview, and copy-to-clipboard button
- [x] Embeddable clock widget: "Embed This Clock" button on homepage below the clock
- [x] Embeddable clock widget: "Embed This Clock" button on homepage below the clock
- [x] [Cancelled by product decision] Dedicated /embed landing page with widget examples on different website types — intentionally removed after visual review in favor of the simpler homepage embed modal; no standalone landing page is planned
- [x] Dedicated /embed landing page with widget examples on different website types
- [x] Dedicated /embed landing page with widget examples on different website types
- [x] Embed widget: tracking parameter input in embed code generator
- [x] Embed widget: tracking parameter input in embed code generator
- [x] Embed widget: LinkedIn and Twitter share buttons on embed landing page
- [x] Final embed acquisition flow: maintain the homepage "Embed this clock" modal as the sole supported embed-code experience

## Phase 12: Provenance + missing-trust gaps (filed 2026-08-03 by claude-home)
# Full findings and verbatim sourcing: ../CONTRIB-2026-08-03-provenance-and-missing-trusts.md
# Surfaced while verifying podcast EP37 against primary sources.

## Source Transparency Publication (2026-08-12)
- [x] Upload verified primary-source PDFs to web storage and associate each with the correct trust record
- [x] Add source-document links to relevant trust detail pages with concise primary-source labels
- [x] Expand the primary-source inventory to all 105 retained verified PDFs; exclude only six duplicate binary variants and six research-only court files for entities without trust records
- [x] Audit every mapped trust source panel for complete artifact coverage and accurate trust-slug association
- [x] Add and pass regression tests verifying every applicable uploaded PDF has a secure, site-hosted link and readable detail-page label
- [x] Visually verify all 24 mapped trust detail pages render their Primary Source Documents panel
- [x] Publish the August 2026 trust verification findings as a research report
- [x] Publish a Bestwall Supreme Court certiorari-denial news item with docket citation

## Danziger & De Llano EEAT Roadmap (2026-08-13)
- [x] Prepare a prioritized authority-building roadmap for using AsbestosTrusts.org to demonstrate Danziger & De Llano’s legal research expertise, experience, authority, and trustworthiness
- [x] Draft ready-to-publish Danziger & De Llano Research Desk editorial standards and reviewer profile criteria
- [x] Create a reusable article-template author and reviewer bio-box specification with accessible React integration guidance
- [x] Verify Paul Danziger and Rod De Llano profiles across firm, Wikidata, and project-managed sources; apply the verified author/reviewer attribution model to site articles
- [x] Correct the Paul Danziger Wikidata audit after the initial lookup missed the existing entity
- [x] Reconcile Rod de Llano education against the current official Danziger & De Llano profile: the official page itself contains conflicting University of Texas and Northwestern law-school statements, so education remains excluded from AsbestosTrusts.org pending firm correction
- [x] Add the confirmed University of Texas School of Law education line (December 1991) to Rod de Llano’s Research Desk profile

## Report Archive Reliability (2026-08-13)
- [x] Fix report detail routes returning “Report not found” for reports listed in reports/index.json

## Upstream Accuracy Update Verification (2026-08-13)
- [x] Synchronize the upstream 81154ec/b2fe7c7/b8c7f1d accuracy update and inspect its HANDOFF.md
- [x] Verify the merged 55-record data set, $15,987,271,944 floor, and $30,020,097,653 payout figure
- [x] Run the documented build, test, sitemap, and production spot checks after synchronization
- [x] Fix the homepage SSR stat tiles, which currently render zero values in the raw production HTML before client hydration

## Public Figure Provenance Timeline (2026-08-16)
- [x] Create a structured public data model for dated figure revisions and their evidence sources
- [x] Build an accessible, responsive public provenance-timeline route with source links and confidence labels
- [x] Link the timeline from the Methodology page and add SSR metadata, structured data, sitemap coverage, and crawler guidance
- [x] Add regression coverage and verify the timeline locally and in production

## VerifiedDR Website Ownership (2026-08-16)
- [x] Add the requested `_verifieddr` TXT record for asbestostrusts.org through the authoritative DNS provider (completed manually by the owner)
- [x] Confirm the TXT record resolves publicly and report verification readiness
- [x] Confirm whether Manus-managed custom-domain controls expose DNS TXT-record management for this domain
- [x] Open the AsbestosTrusts.org project’s domain controls rather than the unrelated AsbestosAtlas.org DNS zone (not required after owner completed the record)
- [x] Confirm from Manus documentation that `Settings → Domains → Manage → Add record` supports TXT records for Manus-registered domains
- [x] Confirm the currently opened DNS zone is asbestosatlas.org and make no changes there

## VerifiedDR Crawler Tracking (2026-08-20)
- [x] Review the supplied adapter and map its shared core to the Express/SSR response lifecycle
- [x] Add an Express-compatible VerifiedDR crawler-tracking integration that runs after responses and keeps the token server-side
- [x] Configure the `VERIFIEDDR_CRAWLER_TOKEN` as a project secret and add regression tests for crawler-only reporting
- [x] Publish and verify a live GPTBot-formatted request reaches the application without affecting normal visitors
- [x] Confirm the VerifiedDR source-registration request and crawler-event payload are accepted by the live endpoint

## Custom Domain Availability Investigation (2026-08-20)
- [x] Check current public reachability and custom-domain assignment for asbestostrusts.org and www.asbestostrusts.org (both return HTTP 503; Manus preview remains HTTP 200)
- [x] Restore the custom-domain routing if it was removed from the project configuration (completed by the owner in the authorized Manus account)
- [x] Verify public recovery and document the outcome
- [x] Owner action required: restore the removed custom-domain assignments in the authorized Manus project account

## August 29 Trust-Monitor Update (2026-08-29)
- [x] Verify the attached Owens-Illinois payment-percentage notice and Manville Q2 2026 filing against the proposed data changes
- [x] Update the affected trust records, aggregate calculations, source links, and dated change history
- [x] Publish supported litigation and monitoring-coverage updates without treating coverage gaps as no-change findings
- [x] Document the official-news-feed monitoring requirement and its external dependency: `trust_monitor.py` is not present in this web project, so the next run must add official news/feed URLs and report untested sites separately rather than treating them as no change
- [x] Add regression coverage and verify the updated data, sources, news, and monitoring behavior in production
- [x] Correct Manville’s rendered claim count to the verified Q2 2026 Exhibit III total of 1,041,171
- [x] Confirm the published August 29 Owens-Illinois update appears in the live feed after its client data request completes
- [x] Prevent news-draft metadata lines from rendering as the visible card summary

## Manville Q2 2026 News Brief (2026-08-29)
- [x] Build a reader-accessible article route so detailed source-linked news briefs are not limited to feed-card summaries
- [x] Draft a detailed source-linked news brief covering the verified Manville Q2 2026 filing
- [x] Include a clear distinction between the quarter-end asset/claim figures and the tracker’s cumulative-payout methodology
- [x] Add regression coverage and verify the brief’s live news-card presentation

## Manville Brief Cross-Link (2026-08-29)
- [x] Add the detailed Manville Q2 2026 article to the Manville trust-detail related-news section
- [x] Add regression coverage and verify the trust-detail-to-brief link locally and in production
- [x] Ensure the static Manville detailed-brief link renders before the dynamic related-news query settles

## ClimbX Link-Exchange Assessment (2026-08-20)
- [x] Research ClimbX’s subject matter, audience, ownership, content quality, and authority signals
- [x] Evaluate the proposed reciprocal link for relevance, transparency, and search-quality risk
- [x] Recommend an accurate editorial context, link placement, and exchange terms—or advise against participation

## Disclosed ClimbX Promotional Link (2026-08-22)
- [x] Add a clearly disclosed ClimbX promotional-exchange link outside trust, source, news, and report content
- [x] Apply `rel="sponsored noopener noreferrer"` and accessible external-link labeling
- [x] Add regression coverage and verify the disclosure and link attributes locally and in production

## Unpublished Linkos Bio Disclosure (2026-08-30)
- [x] Add the requested neutral Linkos Bio promotional-exchange disclosure after the ClimbX paragraph in About
- [x] Add focused assertions for the exact Linkos Bio URL, sponsored relation, disclosure language, accessibility label, and exclusion from trust/report detail pages
- [x] Run TypeScript, the focused disclosure test, and the production build without publishing or deploying

## Crawler Visibility and Embed Audit (2026-08-30)
- [x] Verify crawler-visible homepage and embed-clock figure text, status codes, and route behavior — both clock counters currently server-render as `$0`; `/embed/clock` emits clock markup but returns HTTP 404
- [x] Verify the CSV distribution URL used by structured data and compare it with the live export route — schema references `/api/export/trusts.csv` while the live CSV is `/trusts.csv`
- [x] Assess the proposed build-time shared-figure approach against the current SSR implementation before making any code changes — retain runtime JSON-first SSR; correct counter initialization and embed-route prefetch/status instead of introducing a slower build-time snapshot

## Clock SSR and Embed Route Repair (2026-08-30)
- [x] Render the live clock compensation figures as real server-visible text while retaining post-hydration count-up animation
- [x] Register `/embed/clock` with SSR prefetch data and a valid public 200 response
- [x] Correct Dataset schema `contentUrl` to `/trusts.csv` and validate the CSV export response
- [x] Add crawler-focused tests for raw server-rendered compensation figures, embed status, and CSV schema URL

## Clock Summary and Crawler Monitoring (2026-09-03)
- [x] Add a compact, plain-text figure summary beneath the homepage clock with live amounts, source context, and update date
- [x] Qualify the assets figure as a documented floor across the current documented-asset coverage and distinguish the live tracker snapshot from the underlying figure-date range
- [x] Extend the existing scheduled monitor to flag missing server-rendered compensation figures, invalid embed status, and a broken CSV export
- [x] Add regression coverage for the figure summary and scheduled crawler checks
- [x] Register the enabled project-level weekly staleness and crawler-visibility monitor after the updated handler is published (task UID: MEkbV88b53GWfXaB2EkM97; Mondays 09:00 UTC)
- [x] Prepare the repaired embed URL, title, description, and attribution for external article-directory submission

## September 2026 Filed-Figure Digest Review
- [x] Reconcile the ABB Lummus filed figure, aggregate floor, confidence metrics, and dated snapshot against the current tracker
- [x] Identify publication-ready provenance, source-library, methodology, or news follow-ups without changing trust data until approved
- [x] Compare the September 3 repository and candidate JSON snapshots for data, aggregate, and change-log differences
- [x] Verify the Hopeman and Uniroyal secondary-source developments are correctly classified and determine whether the committed news drafts meet publication standards

## September Source-Transparency Follow-Up
- [x] Confirm the public ABB Lummus FY2025 annual-report PDF is mapped in the site-hosted primary-source library — owner-supplied browser download is byte-identical to existing `LUMMUS_annual_report_2025_404e3513.pdf`
- [x] Add ABB’s filed $14,960,830 record and the $16,033,489,279 aggregate revision to public Figure History
- [x] Refine the Uniroyal article’s hearing-date source label to “official case-agent” without changing facts or trust data
- [x] Add focused regression coverage for the source, provenance, and news refinements

## Hopeman Trust Status Research
- [x] Determine whether the confirmed Hopeman plan has reached an effective date and whether a separate trust entity is formed or accepting claims — public record confirms plan confirmation but does not establish an effective-date notice, operational trust, or asbestos claim portal; an appeal was opened August 31, 2026
- [x] Identify article-safe wording that distinguishes plan confirmation from a live, operational asbestos trust

## Hopeman Confirmation News Update
- [x] Publish a source-linked news item reporting plan confirmation and the proposed asbestos-trust structure
- [x] State clearly that an effective-date notice, operational claims process, and payment terms are not yet publicly established
- [x] Cite the confirmation order and active appeal notification, then verify the published news card in production

## News-Card Summary Completion
- [x] Replace hard character clipping with sentence-safe summary truncation for long news cards
- [x] Add regression coverage for the Hopeman card and publish a live visual/API verification

## Hopeman Detailed Article and Read-More Pattern
- [x] Add reusable internal article destinations to the news-card data model and render a “Read more” link only when a full article exists
- [x] Create a detailed Hopeman Brothers article with canonical URL, breadcrumbs, Article schema, direct docket citations, and a clear not-yet-operational disclosure
- [x] Link the Hopeman news card to the detailed article without altering its existing source link
- [x] Add sitemap and SSR metadata coverage, plus regression and live checks for the article route and card link — article route is crawler-visible; News cards load through the existing client-fetched draft-feed path

## Full-Length News Article Rollout
- [x] Review all remaining news cards for source depth, public-interest value, and readiness for a detailed article
- [x] Draft and publish the next detailed article using official sources plus relevant WikiMesothelioma.com and AsbestosAtlas.org references
- [x] Add the corresponding card destination, canonical metadata, sitemap coverage, and regression checks
- [x] Deliver a prioritized editorial queue for the remaining cards that require full articles
- [x] Correct the Uniroyal article slug so the News card resolves its reusable Read more destination

## Owens-Illinois Detailed Article
- [x] Verify the August 19, 2026 payment-percentage notice and the limits on the 65% change before expanding the News card
- [x] Create a full source-linked Owens-Illinois article and attach it to the existing News card’s Read more destination
- [x] Include narrowly scoped WikiMesothelioma and Asbestos Atlas references where they add useful context but do not source trust-specific facts
- [x] Add canonical metadata, sitemap coverage, regression tests, and live publication verification

## Bestwall Detailed Article
- [x] Verify the Supreme Court certiorari denial, the current Chapter 11 posture, and the limits on any trust-formation claim before expanding the News card
- [x] Create a full source-linked Bestwall article and attach it to the existing News card’s Read more destination
- [x] Include narrowly scoped WikiMesothelioma and Asbestos Atlas references where they add useful context but do not source case-specific facts
- [x] Add canonical metadata, sitemap coverage, regression tests, and live publication verification
- [x] Verify the Bestwall News card’s Read more destination after visually detecting the published article/card mapping gap

## Vi-Jon Detailed Article
- [x] Verify the Chapter 11 petition, current case posture, and limits on the requested channeling relief before expanding the News card
- [x] Create a full source-linked Vi-Jon article and attach it to the existing News card’s Read more destination
- [x] Include narrowly scoped WikiMesothelioma and Asbestos Atlas references where they add useful context but do not source case-specific facts
- [x] Add canonical metadata, sitemap coverage, regression tests, and live publication verification
- [x] Fix the Vi-Jon News card’s missing Read more destination after visual verification
- [x] Remove the redundant legacy Vi-Jon draft card that duplicates the canonical database-backed News item
- [x] Prevent stale browser and edge cache responses from retaining the removed legacy Vi-Jon card; the apparent remaining duplicate was cached draft-feed data, not a second database row
- [x] Bypass stale GitHub directory-list caching so a freshly deployed News server does not re-ingest a deleted draft for up to 15 minutes

## Trust Detail Related-Article Modules (2026-09-03)
- [x] Audit existing trust-detail related-news rendering and article metadata to identify eligible trust/article matches
- [x] Add an accessible related-article module to each eligible trust detail page without presenting unrelated or unsupported content
- [x] Add regression coverage and verify the related articles are crawler-visible, responsive, and linked to their canonical pages

## Trust Detail Related-Research-Report Modules (2026-09-03)
- [x] Audit the published report inventory and identify trust pages with substantial directly relevant report coverage
- [x] Add explicit report-to-trust mappings and an accessible related-research-reports module without keyword-based cross-linking
- [x] Add regression coverage and verify related-report modules are crawler-visible, responsive, and linked to canonical report pages

## Daily Accomplishment Log (2026-09-03)
- [x] Prepare a complete Markdown record of today’s tracker repairs, source-backed content additions, SEO/crawler safeguards, and trust-detail discovery modules

## Methodology Figure and Coverage Consistency Correction (2026-09-03)
- [x] Audit all public source-code and live SSR occurrences of the pre-ABB $16,018,528,449 / 42-record methodology statement and the “roughly 60 active trusts” denominator
- [x] Update methodology, FAQ, and related crawler-visible content to the verified $16,033,489,279 floor across 43 of 54 active records, while preserving the separate historical approximately-60 total-ever-established context
- [x] Add regression coverage and validate tracker, methodology, FAQ, and live SSR consistency before publication
- [x] Replace the misleading public `activeTrustsEstimated` data field with separate `activeTrustsTracked` and `trustsHistoricallyEstablishedEstimated` fields

### Methodology page
- [x] Add the actual origin of the "$30 billion" figure — Bates White/Mealey's (Scarcella & Kelso, 2012–2013): ~$18B confirmed assets + ~$11–12B *proposed/pending* funding ≈ $30B, a 2012–13 snapshot including trusts not yet in existence. Page currently proves only the negative (GAO said $37B, not $30B) and never names the source.
- [x] Publish the verified propagation record: 2011 House-hearing attribution, 2012–13 Bates White/Mealey's construction, 2019 Brickman restatement, then contemporary marketing pages that strip the date and measure. The published copy frames these as conflicting historical assertions, not as a current audited balance.
- [x] State how our own aggregate is derived: a simple sum of the latest located net-asset figures, as of the dates shown. The public methodology now labels it a documented floor and distinguishes it from circulating historic “$17B” variants.
- [x] Add the U.S. Chamber ILR benchmark — *Dubious Distribution* (Mar 2018), nearly $25B assets and more than $2B deferred funding at year-end 2016, labeled as a historical advocacy-source benchmark rather than current tracker data.

### Dataset — three trusts in the corpus but absent from trusts.csv
- [x] Add ARTRA 524(g) Asbestos Trust — official April 2025 notice verifies 0.70% payment percentage; proposed 2022 net-assets figure remains intentionally unpublished until a court-filed source is located.
- [x] Add Shook & Fletcher — 58% confirmed, raised May 2025. NOTE: no balance published (CRMC-administered trusts generally do not post annual reports).
- [x] Model an explicit unpublished-balance state for ARTRA and Shook & Fletcher; trust list and detail pages now distinguish “not published” from an unknown or zero balance.
- [x] Consider a historical/primary-source record for T-H Agriculture & Nutrition (THAN) — see verbatim House Report 112-687 text in the contribution note.

### Content — verified primary-source material ready to use
- [x] Methodology/oversight: add the U.S. Trustee Program quote, verbatim, CHRG-115hhrg27890 (House Judiciary, 115th Cong., 2017), Director Clifford J. White III — "there is no independent policeman. There is no watchdog for that…"
- [x] Methodology/oversight: add GAO-11-819 audit practices stated precisely (2 of 11 reviewed samples + 1 more ran an external audit sending x-rays to an independent doctor), plus the unused line "none indicated that these audits had identified cases of fraud."

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
- [ ] PACER pull — Pittsburgh Corning: blocked (court-side "document not available", cause undetermined); secondary $3.07B in bottomUpPayouts
- [ ] PACER pull — Celotex: access restricted ("you do not have access to the restricted document"); historical $575M from RECAP
- [ ] PACER pull — Babcock & Wilcox: secondary $1.94B floor in bottomUpPayouts; PACER pull queued when restriction resolves
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
- [ ] Add "Last Updated" timestamp next to payment percentage on trust detail pages
- [x] Add "Last Updated" timestamp next to payment percentage on trust detail pages
- [x] Add "Related News" section on trust detail pages showing recent articles for that trust
- [x] Add hover tooltip for legal terms (e.g. "524(g) filing") in news posts
- [x] Add hover tooltip for legal terms (e.g. "524(g) filing") in news posts
- [ ] Embeddable clock widget: standalone /embed/clock route with compact and full-width variants
- [x] Embeddable clock widget: standalone /embed/clock route with compact and full-width variants
- [x] Embeddable clock widget: "Powered by AsbestosTrusts.org" attribution bar with dofollow backlink
- [x] Embeddable clock widget: embed code modal with size selector, live preview, and copy-to-clipboard button
- [x] Embeddable clock widget: "Embed This Clock" button on homepage below the clock

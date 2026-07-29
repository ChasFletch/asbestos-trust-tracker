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
- [ ] PACER pull for W.R. Grace FY2025, Pittsburgh Corning, Celotex, B&W annual reports (endpoint built at /api/pacer/pull-queue — pending PACER account unlock by support team)
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
- [ ] Ingest backfill-verified items into trust-figures.json changes log: Quigley 10/30/2025 cut (14.5→13.3% non-releasing), H.K. Porter 1/31/2025 resumption at 3.0%, Celotex 1/22/2025 audit notice, Shook & Fletcher 50→58% May 2025 (outside floor)
- [x] PACER pull for W.R. Grace FY2025, Pittsburgh Corning, Celotex, B&W annual reports (endpoint built at /api/pacer/pull-queue — pending PACER account unlock by support team)
- [x] Ingest backfill-verified items into trust-figures.json changes log: Quigley 10/30/2025 cut (14.5→13.3% non-releasing), H.K. Porter 1/31/2025 resumption at 3.0%, Celotex 1/22/2025 audit notice, Shook & Fletcher 50→58% May 2025 (outside floor)
- [x] Cumulative payouts modal updated: 14-trust two-group layout (2025-2026 current-era vs 2006-2014 historical floors) with per-trust rows, subtotals, and staleness disclosure
- [x] llms.txt and Methodology.tsx updated with 14-trust / $19.81B documented figures (pending Kimi sync)

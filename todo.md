# TrustFundClock.org — Project TODO
# (placeholder domain — will be updated when final domain is selected)
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
- [ ] Register weekly Heartbeat cron after first deploy
- [ ] PACER pull for W.R. Grace FY2025, Pittsburgh Corning, Celotex, B&W annual reports (pending PACER account review)
- [ ] Per-trust detail page (/trusts/:id)

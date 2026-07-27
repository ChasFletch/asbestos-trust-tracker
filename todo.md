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
- [ ] robots.txt and sitemap.xml (post-deploy)
- [ ] Downloadable CSV of trust data (next iteration)

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
- [ ] robots.txt and sitemap.xml (post-deploy with real domain)
- [ ] Downloadable CSV of trust data
- [ ] Register weekly Heartbeat cron after first deploy
- [ ] PACER pull for W.R. Grace FY2025, Pittsburgh Corning, Celotex, B&W annual reports (pending PACER account review)
- [ ] Per-trust detail page (/trusts/:id)

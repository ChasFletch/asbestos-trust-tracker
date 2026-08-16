# Public Figure-Provenance Timeline — Verification Record

**Verification date:** 2026-08-16  
**Route:** `/provenance`

## Desktop verification

The public route renders a chronological, source-linked history of eight documented changes. Each entry visibly presents the date, prior value, published revision, explanatory rationale, category label, evidence-class badge, source trail, and linked source-control commit.

The page maintains the tracker’s warm-paper research-ledger visual system and retains explicit caveats about historical floors, source grades, and unresolved gaps. The `Methodology` page now includes a visible **Open figure history** callout next to its compact recent-revision table, and primary navigation plus the research footer expose the new route.

## Production verification

The live `/provenance` route returned HTTP 200 and server-rendered its page title, source-trail entries, `CollectionPage` JSON-LD, `BreadcrumbList` JSON-LD, and sitemap entry. The visible timeline contains eight revisions. The **Asset floor** filter was exercised on production and correctly narrowed the list to the two asset-floor records while retaining their direct source links and evidence labels.

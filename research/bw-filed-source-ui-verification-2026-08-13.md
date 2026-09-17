# Babcock & Wilcox Filed-Source Promotion — Rendered UI Verification

**Verified:** 2026-08-13

## Babcock & Wilcox detail page

The rendered page at `/trusts/babcock-wilcox-asbestos-pi-settlement-trust` was checked after the repaired GitHub `main` data feed was loaded.

| Surface | Rendered result | Verification outcome |
|---|---|---|
| Cumulative Paid card | **$1.98B** | The card no longer renders an em dash. |
| As-of value | **2023-12-31** | Matches the FY2023 Annual Report and Account calculation date. |
| Card attribution | **source** link | Present next to the Cumulative Paid heading. |
| Primary Source Documents panel | **Annual Report — 2023** with **Preview** control | Present and usable for the filed source document. |

## Homepage aggregate interface

The full-page homepage render showed the cumulative-payout clock at **$30,020,097,653**. This matches the reconciled `aggregate.cumulativePayoutsBottomUp` value after promoting Babcock & Wilcox’s approximately $1.9783B filed figure.

## Data integrity checks

The GitHub `main` raw-data path, queried with the post-repair revision, returned a valid JSON document with Babcock & Wilcox at `cumulativePaid: 1978300000` and `cumulativePaidAsOf: "2023-12-31"`. TypeScript and the source-library regression tests also passed.

The server-rendered HTML for the Babcock & Wilcox detail route contains the dehydrated trust payload with the same `cumulativePaid`, `cumulativePaidAsOf`, full FY2023 source citation, and site-hosted annual-report PDF URL. The server-rendered homepage HTML contains the exact `$30,020,097,653` payout-counter value.

## Rendered-DOM text extraction

After stripping scripts and styles from a headless-browser DOM dump of the live development route, the visible text included, in order: **“Cumulative Paid source”**, **“$1.98B”**, **“as of 2023-12-31”**, **“Annual Report — 2023”**, and **“Preview.”** This independently verifies the card value, as-of date, and source-preview control as rendered elements rather than only hydrated data.

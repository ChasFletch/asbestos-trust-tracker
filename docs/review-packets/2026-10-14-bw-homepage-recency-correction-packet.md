# B&W Homepage “Latest” Claim — Tier 1 Correction Packet

**Prepared:** October 14, 2026  
**Intake handoff:** `AT-INTAKE-20261014-03`  
**Status:** Released and production-verified — October 14, 2026  
**Affected public URL:** `https://asbestostrusts.org/`

## Issue

The homepage’s **Latest Updates** strip displays this B&W summary:

> “The B&W Asbestos Settlement Trust issued a payment percentage change notice reducing its rate from 4.7% to 4.3%, effective June 30, 2026. **This is the most recent payment percentage change in the entire asbestos trust system.**”

The final sentence is now obsolete. It is contradicted by the later, primary-sourced Manville notice posted September 3, 2026. The issue is a **system-wide recency assertion only**. This packet does not re-audit or change the B&W rate, date, consent/implementation qualification, source, trust record, history, assets, payouts, counts, API, or CSV.

## Shared-field audit

| Field | Recovered result |
|---|---|
| Runtime source | Visible `news_items` database row, returned by the public `news.list` query as row `id: 1` |
| Affected row title | *B&W Asbestos Trust Cuts Payment Percentage to 4.3% — Effective June 30, 2026* |
| Current row date | 2026-06-30 |
| Current row source label | B&W Trust Notice |
| Current destination | `null`; the card does not currently link to a detail route |
| Homepage renderer | `client/src/pages/Home.tsx`, which maps the three visible `news.list` rows and prints `item.summary` without editorial transformation |
| Seed provenance | `seed.mjs` contains the same row and obsolete final sentence; the live visible row is a database-backed summary, so a code-only edit would not correct production |

## Primary source supporting the correction

**Controlling source:** [Claims Resolution Management Corporation, “Manville: Increase in the pro rata payment percentage,” posted September 3, 2026](https://www.claimsres.com/2026/09/03/manville-increase-in-the-pro-rata-payment-percentage/).

The notice states that Manville’s Trustees approved an immediate pro rata payment-percentage increase from **5.1% to 5.6%**, and that e-Claims changes were implemented September 2, 2026. This establishes a later published payment-percentage event than B&W’s June 30 summary. It does **not** establish that Manville is the system’s latest payment event today, and this packet makes no such claim.

## Exact bounded edit

| Version | Text |
|---|---|
| **Old** | “The B&W Asbestos Settlement Trust issued a payment percentage change notice reducing its rate from 4.7% to 4.3%, effective June 30, 2026. **This is the most recent payment percentage change in the entire asbestos trust system.**” |
| **New** | “The B&W Asbestos Settlement Trust issued a payment percentage change notice reducing its rate from 4.7% to 4.3%, effective June 30, 2026.” |

**Correction reason:** A later Manville payment-percentage notice was posted September 3, 2026. Removing the superseded comparative claim avoids replacing it with another unsupported system-wide ranking.

## Acceptance criteria for a separately authorized release

1. The quoted system-wide “most recent” sentence is absent from both the rendered homepage and initial crawler-visible homepage HTML.
2. No new recency/ranking statement replaces it.
3. The B&W title, 4.7%→4.3% rate, June 30, 2026 date, source label, and row positioning are otherwise unchanged by this packet.
4. No trust-data, payment-history, asset, payout, aggregate, API, CSV, article, authorship, or reviewer field changes.
5. The exact old/new text, Manville primary source, and correction reason remain in the release record.
6. A documented Tier 1 production-release decision and production verification occur before any public mutation.

## Release and disposition

Charles authorized the bounded remove-only correction on October 14, 2026. The database-backed B&W summary and seed source were changed to the exact new text above; a guarded production migration updates only row `id: 1` when its summary exactly matches the documented legacy text. A focused regression test prevents the obsolete system-wide claim from being reintroduced.

**Production verification:** A cache-busted fetch of the homepage confirmed that the B&W card still displays the unchanged title, 4.7%→4.3% rate, June 30, 2026 date, and source label, while the system-wide “most recent” sentence is absent from crawler-visible HTML. No replacement ranking claim, trust-data, payment-history, asset, payout, aggregate, API, CSV, article, authorship, or reviewer field was changed.

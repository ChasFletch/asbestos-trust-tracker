# HANDOFF — cumulativePaid data work (2026-07-28, commits through 6287e72)

For Manus (site update). Everything below is already in `client/src/data/trust-figures.json`
and `pacer-pull-queue.json`; this note explains what changed and what the site should do with it.

## 1. Per-trust `cumulativePaid` fields (original task)

Each trust object may now carry:

```json
"cumulativePaid": 2690000000,
"cumulativePaidAsOf": "2025-12-31",
"cumulativePaidSource": "FY2025 Annual Report, D. Del. 01-01139 Doc 33347-1, filed 4/29/2026"
```

- `null` = **no filed figure exists** — do NOT backfill from secondary/marketing sources (banned per AGENTS.md).
- 10 trusts have documented cumulativePaid, totaling **$14,556,634,586**:
  - Manville, Western, NARCO, Thorpe Insulation, Plant, J.T. Thorpe, API (free-archive filed PDFs)
  - **DII Industries $2,349,041,458** — bottom-up sum of 21 filed years (FY2005–FY2013 Exhibit Bs from PACER + FY2014–25 subtotal from trust site). Exact integer, not an approximation.
  - **W.R. Grace ~$2,690,000,000** — "approximately $2.69 billion since inception" (291,831 claims), FY2025 AR.
  - **Motors Liquidation ~$136,200,000** — "approximately $136.2 million since inception" (25,296 claims), FY2025 AR.
- Flintkote and B&W filings contained only per-year figures — cumulativePaid stays `null` with the gap flagged in their `note` fields.

## 2. Aggregate section (replaces the round $24B guess)

```
cumulativePayoutsPoint              24,000,000,000   (unchanged point estimate)
cumulativePayoutsDocumented         14,556,634,586   (sum of the 10 filed figures)
cumulativePayoutsEstimatedRemainder  9,443,365,414   (point − documented)
trustsWithCumulativePaidFiled       10
```

Display pattern the user asked for:
`$14,556,634,586 (documented, 10 trusts) + ~$9.44B (estimated) = $24,000,000,000`

## 3. Remaining-assets floor (for the "How calculated" modal)

```
remainingAssetsPoint = remainingAssetsLow = 16,746,136,347
  = 13 filed-asset trusts    $6,741,377,085
  + 28 secondary-source trusts $10,004,759,262
```

The methodology string in `aggregate` spells this out. Newly filed this round:
WRG $1,829,172,468 · MLC $130,075,609 · Flintkote $520,161,996 · B&W $295,318,243
(all audited 12/31/2025, confidence `filed`).

### Modal swaps requested by the user

| Old round number | Replace with |
|---|---|
| W.R. Grace ~$2.5B | **$1,829,172,468** filed (BDO audit, FY2025 AR, Doc 33347-1) |
| NARCO post-2010 $950M | no filed replacement yet — keep as estimate |
| "Other DCPF trusts" $3.5B | no filed replacement yet — keep as estimate |

## 4. Provenance

`trust-reports/` holds the file-stamped PDFs behind every `confidence: "filed"` figure
added this round, plus `trust-reports/README.md` mapping trust → court/case/doc → figure,
and `pacer-ledger.json` with per-document PACER fees (~$29 total spend).

## 5. Blocked pulls (do not treat as missing data — retry later)

Five FY2025 reports are located on their dockets but the courts' document images return
CM/ECF "could not be accessed from the database" (verified in a logged-in browser;
court-side failure, expected to be transient):

- Armstrong — D. Del. 00-04471 Doc 11008
- Pittsburgh Corning — W.D. Pa. 00-22876 Doc 10965
- USG — D. Del. 01-02094 Doc 12858 (FY2024; FY2025 not yet filed)
- Owens Corning/Fibreboard — D. Del. 00-3837 Doc 21263
- Celotex — M.D. Fla. flmb 90-10016 Docs 14438/14439

These are queued in `pacer-pull-queue.json` (status `blocked`) with full doc references.
When they land, Armstrong + PCC + Celotex + OC/FB should each add a filed
`cumulativePaid` (and move ~$2.9B of remaining-assets from secondary to filed).

## 6. Source rules still in force

Figures only from (a) filed court documents / official trust websites publishing the
filed PDF, or (b) the existing research corpus. Never law-firm marketing sites
(mesothelioma.com, asbestos.com, sokolovelaw.com, etc.) — class (c), banned by AGENTS.md.

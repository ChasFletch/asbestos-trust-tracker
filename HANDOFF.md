# HANDOFF — cumulativePaid data work (2026-07-29, bottom-up update; earlier notes 2026-07-28)

For Manus (site update). Everything below is already in `client/src/data/trust-figures.json`
and `pacer-pull-queue.json`; this note explains what changed and what the site should do with it.

## 0. NEW 2026-07-29 — bottom-up payout total replaces the round $24B clock figure

The clock's cumulative-payouts number should switch from `aggregate.cumulativePayoutsPoint`
(24,000,000,000 — a round estimate) to **`aggregate.cumulativePayoutsBottomUp` = 29,981,797,653**,
derived in the new top-level `bottomUpPayouts` section. `cumulativePayoutsPoint` stays in the
JSON as a legacy reference only — do not display it as the headline.

`aggregate.displayHints.cumulativePayoutsFigure` = `"cumulativePayoutsBottomUp"` marks the switch.

Three tiers (itemized in `bottomUpPayouts.tiers`, every component carries source + as-of):

| Tier | Amount | What it is |
|---|---|---|
| `filed` | $19,810,476,508 | 14 trusts, inception-to-date figures read from filed reports (class-a). As-of dates 2006–2026 — the 4 historical ones (OCFB 2009, Armstrong 2014, USG 2008, Celotex 2006) are floors. |
| `secondaryCitingFiled` | $6,671,321,145 | 5 components from secondary compilations that cite the trusts' own filed annual reports (class-b): Pittsburgh Corning $3,071,420,000 (2022), B&W $1.94B floor (2024), Celotex post-2006 growth $783,146,017 (2021), OC/FB post-2009 growth $534,090,000 (2022), G-I Holdings $342,665,128 (2022). Each labeled with confidence; none verified against the filed document yet. |
| `estimatedResidual` | $3,500,000,000 (range $2.5–5B) | ~25 trusts with no public cumulative figure (ACandS, ASARCO, Bondex, Combustion Engineering, Eagle-Picher, Quigley, T&N, Garlock GST, Paddock, Rapid-American, etc.). Basis string in JSON. |
| **Total** | **$29,981,797,653** | |

Modal breakdown should read approximately:
- **$19,810,476,508** — 14 trusts — filed annual reports/quarterly filings (2006–2026 as-of dates)
- **+ $6,671,321,145** — 5 components — secondary sources citing filed reports (labeled, unverified)
- **+ ~$3,500,000,000** — ~25 trusts — estimated (no public figure; range $2.5–5B)
- **= $29,981,797,653** — bottom-up estimate

Cross-checks (in JSON): GAO-11-819's $17.5B was frozen at 2010; Bates White documented $14.0B
paid in 2006–2011 alone; the research corpus assesses 2026 cumulative as "plausibly $30B+".
This total is consistent with all three; the old $24B was likely LOW.

Also fixed this round: Armstrong's per-trust `cumulativePaid` field (it was null while the
aggregate already counted it — aggregate math unchanged; re-verified from filed FY2014 AR:
579,458 claims, $1,600,408,304, inception through 12-31-2014).

Memorialized in **`docs/methodology-cumulative-payouts.md`** — written so its text can be
lifted directly into `Methodology.tsx` (which still needs updating per earlier checkpoints).
Suggest also adding a Corrections-page entry: "Cumulative payouts figure revised from
$24,000,000,000 (placeholder) to $29,981,797,653 (bottom-up build), 2026-07-29."

**Convention going forward:** every figure change on the site gets one line in
**`docs/figure-provenance-changelog.md`** (newest first, with source tier + commit hash)
before or with the commit that changes it. Manus: please append when the site picks up
new JSON figures; Kimi appends when the JSON itself changes.

---

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
cumulativePayoutsDocumented         19,810,476,508   (sum of 14 filed figures)
cumulativePayoutsEstimatedRemainder  4,189,523,492   (point − documented)
trustsWithCumulativePaidFiled       14
```

The documented pool has two tiers, spelled out in the aggregate methodology string:
- **10 current-era trusts** ($14,556,634,586, as-of 2025/2026): Manville, DII, WRG, Western, NARCO, Thorpe Ins., Plant, J.T. Thorpe, API, MLC
- **4 historical filed figures** ($5,253,841,922, as-of 2006–2014 — floors, true current values higher): OC/FB $2,465,910,000 (2009), Armstrong $1,600,408,304 (2014), USG $612,130,000 (2008), Celotex $575,393,618 (2006). Recovered 2026-07-28 via a non-PACER sweep (RECAP/Wayback/cross-docket exhibits); sources in `trust-reports/non-pacer-recovery/`. Every figure was re-verified against the source PDF (OCFB + Celotex visually — OCR corrupts both).

Display pattern the user asked for:
`$19,810,476,508 (documented, 14 trusts) + ~$4.19B (estimated) = $24,000,000,000`
The modal should disclose that 4 of the 14 documented figures are dated 2006–2014.

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

- Armstrong — D. Del. 00-04471 Doc 11008 · **partially covered**: historical cumulativePaid merged (see §2)
- Pittsburgh Corning — W.D. Pa. 00-22876 Doc 10965 · **no data found anywhere** — circulating ~$1.29B/~$3.14B figures are marketing-only; PACER is the sole route
- USG — D. Del. 01-02094 Doc 12858 (FY2024; FY2025 not yet filed) · **partially covered** (historical)
- Owens Corning/Fibreboard — D. Del. 00-3837 Doc 21263 · **partially covered** (historical); OC 4.3% / FB 3.5% payment percentages eff. 2026-06-30 now on file
- Celotex — M.D. Fla. flmb 90-10016 Docs 14438/14439 · **partially covered** (historical)

These are queued in `pacer-pull-queue.json` (status `blocked`) with full doc references.
When the FY2025 images are restored, each pull replaces a historical floor with a current
filed figure (and PCC adds its first documented figure at all).

## 6. Source rules still in force

Figures only from (a) filed court documents / official trust websites publishing the
filed PDF, or (b) the existing research corpus. Never law-firm marketing sites
(mesothelioma.com, asbestos.com, sokolovelaw.com, etc.) — class (c), banned by AGENTS.md.

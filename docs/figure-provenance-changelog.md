# Figure Provenance Changelog

One line per figure change. Newest first. Every number that appears on the site
should be traceable to a line here, and every line to a source document.

**Format:** `| Date | Figure | Old → New | Source (tier) | Commit |`

Tiers: **(a)** filed document read directly · **(b)** secondary citing a filed
document, labeled, unverified · **(c)** derived estimate/allowance with stated
assumption. Marketing sites are never a source (AGENTS.md).

| Date | Figure | Old → New | Source (tier) | Commit |
|---|---|---|---|---|
| 2026-07-29 | Cumulative payouts headline | $24,000,000,000 (placeholder) → **$29,981,797,653** | Bottom-up build: $19,810,476,508 filed (a, 14 trusts) + $6,671,321,145 secondary-citing-filed (b, 5 components) + ~$3.5B residual (c, range $2.5–5B). Methodology: `docs/methodology-cumulative-payouts.md` | `2b2ecf1` |
| 2026-07-29 | Armstrong per-trust `cumulativePaid` | `null` → **$1,600,408,304** @2014-12-31 | FY2014 Annual Report, Claim Report exhibit p.33 (579,458 claims paid, inception through 12-31-2014), Bankr. D. Del. 00-04471 (a). Aggregate had already counted it; field restored | `2b2ecf1` |
| 2026-07-29 | Tier-2 components added | — → PCC **$3,071,420,000** @2022 · B&W **$1,940,000,000** floor @2024 · Celotex growth **+$783,146,017** @2021 · OCFB growth **+$534,090,000** @2022 · GAF **$342,665,128** @2022 | Secondary compilations citing filed annual reports, via research corpus (b). Each graduates to (a) when its filed report is pulled | `2b2ecf1` |
| 2026-07-28 | Documented filed total | $14,556,634,586 (10 trusts) → **$19,810,476,508** (14 trusts) | Non-PACER recovery sweep (RECAP/Wayback/cross-docket exhibits): OCFB **$2,465,910,000** @2009, Armstrong **$1,600,408,304** @2014, USG **$612,130,000** @2008, Celotex **$575,393,618** @2006 (a). PDFs in `trust-reports/non-pacer-recovery/`; all re-verified (OCFB + Celotex visually — OCR corrupts both) | `dbf367a` |
| 2026-07-28 | DII Industries `cumulativePaid` | gap → **$2,349,041,458** @2025-12-31 | Bottom-up sum of 21 filed years: FY2005–FY2013 Exhibit Bs (PACER) + FY2014–25 from trust site (a). Exact integer, not an approximation | `6287e72` |
| 2026-07-28 | W.R. Grace `cumulativePaid` | secondary-only → **~$2,690,000,000** @2025-12-31 | FY2025 Annual Report, D. Del. 01-01139 Doc 33347, filed 4/29/2026 (a, PACER pull): "approximately $2.69 billion since inception", 291,831 claims | `6287e72` |
| 2026-07-28 | Motors Liquidation (GM) `cumulativePaid` | gap → **~$136,200,000** @2025-12-31 | FY2025 Annual Report, S.D.N.Y. 09-50026 Doc 14861 (a, PACER pull): "approximately $136.2 million since inception", 25,296 claims | `6287e72` |
| 2026-07-28 | Flintkote, B&W `cumulativePaid` | — → remain `null` (per-year figures only) | FY2025 filings contained per-year, not inception-to-date, figures (a). Gaps flagged in `note` fields and `pacer-pull-queue.json` | `6287e72` |
| 2026-07-27 | Initial `cumulativePaid` fields | — → 10 trusts documented, **$14,556,634,586** | Free-archive filed PDFs: Manville $5.33B, Western $2.24B, NARCO $904M, Thorpe Ins. $434M, Plant $192M, J.T. Thorpe $190M, API $94M (a) + DII, WRG, MLC above | `6287e72` |

## Pending graduation queue

Tier-2/3 figures that become Tier-1 (or get corrected) when these pulls land —
full details in `pacer-pull-queue.json`:

- Pittsburgh Corning FY2024+ annual report → verify $3.07B → Tier 1
- B&W earlier-year reports → replace $1.94B secondary floor with filed sum
- Celotex CY2024 financial statements (M.D. Fla. 90-10016, filed, PACER-only)
- OCFB FY2025 report (not confirmed docketed as of 2026-07-27)
- USG FY2025 report (status report filed 7/13/2026, 01-02094 Doc 12923, PACER-only)
- ~25 residual-tier trusts: any filed report with an inception-to-date line
  shrinks the $3.5B allowance dollar-for-dollar

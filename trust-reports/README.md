# Trust Reports — Filed Source Documents

File-stamped annual reports pulled from PACER (federal bankruptcy court dockets)
to back the `cumulativePaid` / `netAssets` fields in `client/src/data/trust-figures.json`.
Every figure marked `"confidence": "filed"` traces to a PDF in this directory.

## Contents (as of 2026-07-28)

| Trust | Court / Case | Doc | Files | Figures extracted |
|---|---|---|---|---|
| DII Industries | D. Del. 03-10926 | 2601, 2686, 2697, 2754-2, 2764-2, 2812-2, 2836-2, 2855-2, 2913-1 (FY2005–FY2013 Exhibit B) | `dii-20*-exhibit-b.pdf` | cumulativePaid $2,349,041,458 inception-to-date (bottom-up sum of 21 filed years; FY2014–25 subtotal $1,254,425,009 from trust site) |
| W.R. Grace (WRG) | D. Del. 01-01139 | 33347-1, filed 4/29/2026 | `wrg-fy2025-ar-*.pdf` | netAssets $1,829,172,468 audited 12/31/2025 (BDO); cumulativePaid ~$2.69B ("approximately $2.69 billion since inception", 291,831 claims) |
| Motors Liquidation (GM) | S.D.N.Y. 09-50026 | 14861-1, filed 4/30/2026 | `mlc-fy2025-ar-*.pdf` | netAssets $130,075,609 audited 12/31/2025; cumulativePaid ~$136.2M ("approximately $136.2 million since inception", 25,296 claims) |
| Flintkote | D. Del. 04-11300 | 9503, filed 4/27/2026 | `flintkote-fy2025-ar-*.pdf` | netAssets $520,161,996 audited 12/31/2025 (BDO). No inception-to-date line — cumulativePaid gap (per-year Exhibit 1.B tables summable) |
| Babcock & Wilcox | E.D. La. 00-10992 | 7890, filed 4/28/2026 | `bw-fy2025-ar-*.pdf` | netAssets $295,318,243 audited 12/31/2025. No inception-to-date line — cumulativePaid gap |

`pacer-ledger.json` records per-document pull status and PACER fees.

## Blocked pulls (see pacer-pull-queue.json `queue` entries, status `blocked`)

Five FY2025 filings are located on their dockets but ALL document images return
CM/ECF "Document … could not be accessed from the database" (verified in a
logged-in browser — court-side image failure, not access/session):

- Armstrong — D. Del. 00-04471 Doc 11008
- Pittsburgh Corning — W.D. Pa. 00-22876 Doc 10965
- USG — D. Del. 01-02094 Doc 12858 (FY2024; FY2025 not yet filed, case reopened 1/2026)
- Owens Corning/Fibreboard — D. Del. 00-3837 Doc 21263
- Celotex — M.D. Fla. (flmb) 90-10016 Docs 14438/14439

Retry these later; none of these DCPF-administered trusts publish annual reports
on their public websites.

## Scripts

`scripts/pacer-pull-doc.mjs` — generic puller:
`node scripts/pacer-pull-doc.mjs --court=<ecf-code> --case=<case-no> --prefix=<name> [--doc=N | --from=MM/DD/YYYY --to=MM/DD/YYYY]`
Requires `pacer-session-<court>.txt` (cookie string harvested from a logged-in
browser session; NOT committed — contains session credentials).

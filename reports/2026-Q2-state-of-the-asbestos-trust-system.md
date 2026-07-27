---
report_id: ATR-2026-Q2
title: "State of the Asbestos Trust System — Q2 2026"
series: "State of the Asbestos Trust System (quarterly)"
as_of: 2026-06-30
published: 2026-07-01
data_contract: client/src/data/trust-figures.json (asbestos-trust-figures/v1)
schema: asbestos-trust-report/v1
---

# State of the Asbestos Trust System — Q2 2026

**Report ID:** ATR-2026-Q2 · **Data as of:** June 30, 2026 · **Published:** July 1, 2026 · **Issue:** Q2 2026

*Editor's note (July 28, 2026). This is a retrospective issue, backfilled to complete the series archive. It was reconstructed from the dataset's documented changes log and contemporaneous primary sources, and its analysis is limited to information documented as of June 30, 2026. Two reconciliations against the first real-time issue, ATR-2026-Q3 (data as of July 27, 2026): (1) this issue prints the floor as $17,042,880,106 with Maremont and API at their FY2025 filed values, while ATR-2026-Q3 printed $17,041,946,126 carrying those two trusts at FY2024 pending verification — a documentation-vintage difference of $933,980, not system movement; (2) this issue counts eight fully documented payment-percentage cuts since January 2023, including Quigley's October 2025 cut verified from the official notice during backfill, where ATR-2026-Q3 printed seven from its dataset snapshot. The first issue of the series produced in real time is ATR-2026-Q3.*

**Methodology note.** This report follows the source-confidence and aggregation rules documented on the site's [Methodology page](https://asbestostrusts.org/methodology). Every figure carries an inline tag: **(a)** filed court document (annual report, quarterly filing, or payment-percentage notice); **(b)** secondary source citing a primary document; **(c)** estimate or inference. Class-(c) figures are excluded from point sums and appear only in ranges, per the methodology. All underlying data: `client/src/data/trust-figures.json` in this repository. No untagged figures are used. Nothing here is legal or financial advice.

**How to cite:** Asbestos Trust Tracker, *State of the Asbestos Trust System — Q2 2026* (ATR-2026-Q2), data as of June 30, 2026, asbestostrusts.org.

**Comparability note.** The reporting window is April 1 – June 30, 2026; the prior issue is ATR-2026-Q1 (data as of March 31, 2026). Quarter-over-quarter movement is reconstructed from the dataset's documented changes log.

## A. Aggregate remaining assets: the filing season lands — $17,042,880,106 documented, 23.3% of it on filed paper

The April–June annual-report cycle transformed the floor's composition. The documented floor now stands at an exact **$17,042,880,106** — the arithmetic sum of the latest located net-asset figure for each of 41 active trusts. The filed-document tier more than held its share: **$3,966,648,769 (23.3%) across 9 trusts (a)**, every one now on an FY2025 annual report or a Q1 2026 quarterly:

| Trust | Net assets (filed) | As of |
|---|---|---|
| NARCO Asbestos Trust | $1,260,412,792 | 2025-12-31 |
| DII Industries (Halliburton/Harbison-Walker) | $1,149,918,344 | 2025-12-31 |
| Manville Personal Injury Settlement Trust | $539,260,000 | 2026-03-31 |
| Western Asbestos Settlement Trust | $355,761,441 | 2025-12-31 |
| Thorpe Insulation Company Asbestos Settlement Trust | $338,761,788 | 2025-12-31 |
| Plant Asbestos Settlement Trust | $148,824,786 | 2025-12-31 |
| J.T. Thorpe Settlement Trust (CA) | $116,383,926 | 2025-12-31 |
| Maremont Asbestos PI Trust | $49,591,466 | 2025-12-31 |
| API, Inc. Asbestos Settlement Trust | $7,734,226 | 2025-12-31 |

The secondary tier is unchanged at exactly **$13,076,231,337 across 32 trusts (b)** — 28 at FY2022 vintages, 4 at FY2021 — because none of those 32 produced a retrievable free filing this season; their FY2025 reports either sit behind PACER or were not confirmed docketed (Section E). The estimated high end of the working range remains **$22.5B (c)** on the previously documented anchors (ILR YE2016 (b); Honeywell $1.325B January 2023 (a); Western deferred contribution completed 2024 (b); net depletion ~$0.5B/yr (c)), and ~19 of ~60 active trusts still publish nothing retrievable.

**Quarter-over-quarter movement.** Against Q1's ≈$17.0B carried at FY2024/FY2022 vintages, the floor is up modestly in dollars — the nine refiling trusts were, in aggregate, roughly flat to slightly up year over year — and up substantially in quality: the class-(a) share enters the summer at 23.3%, the highest documented footing this series has recorded. Direction of travel, however, remains downward at the margin: two payment-percentage cuts and three reconsideration notices landed in the window (Section B), each a documented signal of continued net depletion at the trusts involved.

## B. Payment-percentage direction: two cuts, three reconsideration notices, and a documented template

The April filings did what the April filings were expected to do (ATR-2026-Q1, Section B): they put fresh audited numbers in front of trustees, and the percentage actions followed within weeks.

**Cut this window:**

- **Combustion Engineering** — cut to 15.3% in April 2026 (b). The documented history (18.5% → 29.5% → 15.3% (b)) remains the system's clearest raise-then-reverse case: a trust that raised on early post-formation optimism, then cut hard as claim volumes persisted.
- **Babcock & Wilcox** — cut 4.7% → 4.3% by trust letter dated **June 30, 2026** (a). The 4.3% rate applies "until further notice," pending TAC/FCR consent — the same consent architecture that has held Pittsburgh Corning's November 2024 cut (24.5% → 19%, with a true-up rider if not adopted (a)) in procedural limbo for twenty months.

**Also documented:** the **Owens Corning Subfund** of the OC/Fibreboard trust cut its payment percentage in June 2026 (b); the magnitude is not yet documented in the dataset, and we flag that gap rather than print an unverified figure.

**Reconsideration notices — the pipeline for next quarter:**

- **Maremont** — TDP §4.3 reconsideration of the 28.4% payment percentage announced **April 7, 2026** (a, official notice).
- **USG** — payment-percentage reconsideration notice issued in **May 2026**, holding at 11% in the meantime (b).
- **Babcock & Wilcox** — TDP §4.2 reconsideration announced **May 7, 2026** (a) — and converted to the June 30 cut above in **seven weeks**, now the documented notice-to-cut template.

**Held this window (documented):** NARCO at 100% (a), DII Industries at 60% (a), Thorpe Insulation at 58.6% (a), Western at 51.1% (a), Plant at 20% (a), API at 22% (a, confirmed in its FY2025 report), Manville at 5.1% (a, Q1 2026 filing).

**Trailing record since January 2023:** eight fully documented cuts — Celotex (June 2023), Pittsburgh Corning (November 2024), Kaiser (February 2025), W.R. Grace (April 2025), Quigley (October 2025), Motors Liquidation (December 2025), Combustion Engineering (April 2026), Babcock & Wilcox (June 2026) — plus the OC Subfund cut of undocumented magnitude, and **zero raises** within the tracked set. The median across the 21 published percentages in and around the floor now sits at **15.0%** (derived from (a)/(b) figures), and the mid-teens cluster still carrying FY2022-era asset data (CE 15.3%, Flintkote 15.0%, Federal-Mogul 12.2%, USG 11.0%, Armstrong 10.8%, Kaiser 10.6%, MLC 10.3% — all (b)) faces the same downward pressure that just reached CE and B&W as their own FY2025 filings land.

**Forward 12–24 month outlook (hedged).** The documented pattern — cuts only, no raises, across 2023–2026 — supports expecting further downward adjustments rather than increases. Specifically: (1) a Maremont decision follows its April notice, on the same notice-then-decision sequence B&W just completed (b, pattern inference); (2) a USG cut is possible within 12–24 months on the same sequence (b, pattern inference); (3) the sub-8% tier (Celotex 7% (a, in deferral), Manville 5.1% (a), B&W 4.3% (a)) has limited room before percentages approach nominal-recovery territory, which Celotex's January 2025 Deferral Period (a) suggests is handled by deferral rather than further cuts. These are projections from documented patterns, not certainties; consent processes can and do stall outcomes.

## C. Payouts and depletion: the FY2025 filings put fresh payout numbers on the record

The filing season delivered the first filed 2025 payout figures:

- **DII Industries** reported **$121.1M in claims expense in 2025** (a, FY2025 annual report) while maintaining its 60% percentage — the system's largest single-trust payout line item newly on file.
- **Manville's** Q1 2026 filing (filed April 27, 2026) puts its cumulative record at **$5.33B paid on 1.04M claims** (a), at a 5.1% pro rata percentage unchanged since February 2021.
- **Maremont** paid **166 claims totaling $2.09M in 2025** (a, FY2025 report filed April 20, 2026), with net claimants' equity at $49.59M.
- **API, Inc.** made **$151.7K in distributions in 2025**, bringing its cumulative claims paid to **$93.99M through December 31, 2025** (a, FY2025 report filed April 29, 2026).

The older anchors stand: the documented eight-trust subset paid **~$591.9M in 2022 and ~$561.2M in 2024** (a); the hard cumulative floor is the GAO's **$17.5B paid on 3.3M claims, 1988–2010** (a); the working point estimate for cumulative payouts through mid-2026 is **~$24B (c)**, order-of-magnitude. The structural inference from prior issues holds and is strengthened by DII's filing: documented gross outflows (~$0.56–0.59B/yr across just eight trusts (a), plus DII's $121.1M (a)) comfortably exceed estimated systemwide *net* depletion (~$0.5B/yr (c)) — investment returns and residual funding continue to offset a large share of gross payouts (c, inference, to be quoted as such). One year on from Rapid-American's June 6, 2025 closure (b), no other trust is documented within sight of depletion; the bottom tier's documented response to pressure remains deferral and cuts, not closure.

## D. System events: Georgia-Pacific abandons Bestwall, and the formation pipeline reshuffles

**Formations.** No new §524(g) trust was funded in the window, but the pipeline reshuffled significantly. **Georgia-Pacific abandoned the Bestwall vehicle** and is planning a new Chapter 11 (b, docket reporting), with a ~$1B+ trust expected in the next wave (b; size estimate (c)). The Supreme Court certiorari petition in Bestwall (No. 25-1013, filed February 2026 (a, docket)) was pending when the strategy shifted; its disposition is not documented in the dataset — flagged, not speculated on. After eight years, the Bestwall chapter closes without a trust, and the GP asbestos liability — one of the largest unfunded blocks in the tort system — heads back to square one. **DBMP LLC (CertainTeed)** moved into plan-process territory post-*Herlihy* (a, docket), the ~60,000 stayed lawsuits (b) still channelled toward an eventual trust. Trane's **Aldrich Pump and Murray Boiler** units showed no documented movement (b; in Chapter 11 since June 2020). None of the three carries a figure in the dataset; none should be counted until funding is documented.

**Closures.** None in the window. Rapid-American (closed June 6, 2025 (b)) remains the system's most recent end-of-life data point.

**Governance.** The **Cross-Trust Audit Program** completed its second full quarter of monthly random audits across the 10 DCPF trusts (a, per the December 2025 notices); no findings have been published — flagged as a gap. **TDP §5.5** completed its second full quarter in effect (a, effective November 14, 2025), with no documented spread of the verbatim text beyond the DCPF block. **Pittsburgh Corning's** consent process over the reconsidered 19% entered its twentieth month (a) — the system's standing reminder that administrator-level decisions are only as fast as their slowest consent requirement. DCPF's 10 named trusts continue to account for roughly **$8.7B, about 51% of the documented floor** (derived from (a)/(b) figures with mixed as-of dates).

## E. Data-quality ledger

| Class | Trusts | Assets carried | Share of documented floor |
|---|---|---|---|
| (a) Filed court document | 9 | $3,966,648,769 | 23.3% |
| (b) Secondary citing primary | 32 | $13,076,231,337 | 76.7% |
| (c) Estimate/inference | 0 | excluded from point sum | — |

**Upgraded this quarter:** all nine public filers moved to FY2025 (or Q1 2026) filed footing — NARCO, DII, Western, Thorpe Insulation, Plant, and J.T. Thorpe (CA) at FY2025; Manville at Q1 2026 (filed April 27, 2026); Maremont at FY2025 (filed April 20, 2026, D. Del. 19-10118-LSS Doc 374); API at FY2025 (filed April 29, 2026, Bankr. D. Minn. 05-30073-GFK). **Filed but PACER-only:** W.R. Grace FY2025 (filed April 29, 2026, D. Del. 01-01139 Doc 33347), Motors Liquidation FY2025 (filed April 30, 2026, S.D.N.Y. 09-50026 Doc 14861), Armstrong FY2025 (served April 30, 2026, 00-04471 Doc 11009), Flintkote FY2025 (served April 28, 2026, 04-11300 Doc 9504), Pittsburgh Corning FY2025 (filed ~April 2026, W.D. Pa. 00-22876), Celotex FY2025 (M.D. Fla. 90-10016) — docket notices free via CourtListener mirrors, exhibits behind PACER (a); the dataset deliberately retains FY2021/FY2022 secondary figures for these trusts rather than upgrade on unverified reads. **Not confirmed docketed as of June 30, 2026:** Owens Corning/Fibreboard FY2025, Federal-Mogul FY2025, Paddock FY2025, USG FY2025 (a/b, docket mirrors). **Staleness:** the 32 class-(b) figures remain 28 FY2022 and 4 FY2021, all beyond the 18-month threshold — the PACER queue is now the single largest floor-quality upgrade available. **New gaps identified this quarter:** the OC Subfund cut magnitude; the Bestwall cert petition's disposition. **Aggregate-level class-(c) figures in use:** the $22.5B high, the ~$24B cumulative-payout point, the ~$0.5B/yr net-depletion rate.

## F. Watch list — next quarter

1. **Maremont reconsideration outcome** — decision on the 28.4% percentage following the April 7 notice, on B&W's seven-week template or longer (a/b).
2. **B&W consent process** — whether TAC/FCR consent ratifies 4.3% or forces adjustment under the "until further notice" letter (a).
3. **USG reconsideration** — a cut within 12–24 months is possible per the documented notice-then-cut pattern (b).
4. **Pittsburgh Corning true-up** — adoption or reversion of the 19% reconsidered percentage, month twenty-one and counting (a).
5. **PACER pulls** — the six FY2025 reports queued behind PACER (W.R. Grace highest priority), plus any late-docketed FY2025 reports for OC, Federal-Mogul, Paddock, and USG (a).
6. **Manville Q2 2026 quarterly filing** — due on the quarterly cadence that produced the April 27 Q1 filing; the system's highest-frequency class-(a) data point (b, cadence).
7. **OC Subfund cut magnitude** — documentation of the June change (b; flagged gap).
8. **Georgia-Pacific refiling** — the new Chapter 11 vehicle and any trust sizing beyond the ~$1B+ expectation (b; size (c)).
9. **Cross-Trust Audit Program** — first published findings (a; flagged gap).
10. **Celotex deferral** — status of the 7% percentage in the Deferral Period's third year (a).

---

*Next issue: ATR-2026-Q3, expected October 2026. Corrections and sourcing disputes: open an issue on this repository. Figures marked (c) must not be cited as primary evidence.*

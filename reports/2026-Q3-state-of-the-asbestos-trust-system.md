---
report_id: ATR-2026-Q3
title: "State of the Asbestos Trust System — Q3 2026"
series: "State of the Asbestos Trust System (quarterly)"
as_of: 2026-07-28
published: 2026-07-28
data_contract: client/src/data/trust-figures.json (asbestos-trust-figures/v1)
schema: asbestos-trust-report/v1
---

# State of the Asbestos Trust System — Q3 2026

**Report ID:** ATR-2026-Q3 · **Data as of:** July 28, 2026 · **Published:** July 28, 2026 · **Issue:** Q3 2026

**Methodology note.** This report follows the source-confidence and aggregation rules documented on the site's [Methodology page](https://asbestostrusts.org/methodology). Every figure carries an inline tag: **(a)** filed court document (annual report, quarterly filing, or payment-percentage notice); **(b)** secondary source citing a primary document; **(c)** estimate or inference. Class-(c) figures are excluded from point sums and appear only in ranges, per the methodology. All underlying data: `client/src/data/trust-figures.json` in this repository. No untagged figures are used. Nothing here is legal or financial advice.

**How to cite:** Asbestos Trust Tracker, *State of the Asbestos Trust System — Q3 2026* (ATR-2026-Q3), data as of July 28, 2026, asbestostrusts.org.

**Comparability note.** The prior issue is ATR-2026-Q2 (data as of June 30, 2026). Quarter-over-quarter movement is reconstructed from the dataset's documented changes log. Two reconciliations against the first-published Q3 draft (July 28, 2026): Maremont and API are now carried at their FY2025 filed values ($49.59M and $7.73M respectively (a)), correcting a prior under-verification that understated the documented floor by $933,980; the seven-cut trailing record is consistent with the dataset's changes array.

## A. Aggregate remaining assets: the filing season closes at a $17.04B documented floor

The spring–summer annual-report cycle closed on July 28 with the documented floor standing at an exact **$17,042,880,106** — the arithmetic sum of the latest located net-asset figure for each of 41 active trusts. Two tiers compose it: **$3,966,648,769 (a)** across 9 trusts from filed annual reports and quarterly filings (FY2025 annuals or Manville's Q1 2026 quarterly), and **$13,076,231,337 (b)** across 32 trusts from credible secondary compilations of trust annual reports (mostly FY2022 as-of dates).

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

The floor is not a census, and it is deliberately conservative. Roughly 19 of the ~60 active trusts publish no retrievable figure, and 28 of the 32 class-(b) figures carry FY2022 as-of dates (4 carry FY2021). Because trusts deplete over time, dated figures overstate some balances — but the uncounted ~19 trusts and deferred-obligation funding push the other way. The true current balance is higher than the floor; how much higher is the estimated range.

The estimated high end is **$22.5B (c)**, anchored on documented waypoints: the Institute for Legal Reform's 2018 *Dubious Distribution* study found ~$25B in trust assets plus ~$2B in deferred funding obligations at year-end 2016 (b); more than $1.5B of those deferred obligations have since funded, including Honeywell's $1.325B buyout into NARCO in January 2023 (a) and the Western Asbestos deferred contribution completed in 2024 (b); against that, net depletion has run at roughly $0.5B per year since 2016 (c). The working range for the system is therefore **$17.0B documented floor to ~$22.5B estimated high**, with the truth most likely in the low-to-mid $20Bs.

**Quarter-over-quarter movement.** Against ATR-2026-Q2's identical $17,042,880,106 floor, the headline aggregate is flat — there was no system-wide asset revaluation event in July. The composition, however, improved: Maremont and API moved from "filed but figures pending extraction" to fully verified FY2025 class-(a) footing (a), raising the verified share of the floor to a confirmed 23.3% and eliminating the $933,980 documentation-vintage gap that separated the Q2 and Q3 drafts. Direction of travel at the margin remains downward: the only payment-percentage action in the July window was the confirmation of Babcock & Wilcox's June 30 cut (Section B).

One citation correction worth repeating, because it remains the most-quoted wrong number in the system: the ubiquitous "$30 billion in asbestos trusts" traces to GAO-11-819's finding of ~$36.8B in **total capitalization** — initial funding plus investment returns — across 60 trusts established by 2011 (a). That was never a current balance, and the same report documented $17.5B already paid on 3.3 million claims through 2010 (a). The documented floor above is the first public figure built the other way: summed from current filings, trust by trust.

## B. Payment-percentage direction: seven documented cuts, zero raises since January 2023

The dataset's changes log records the direction of travel unambiguously. Since January 2023, seven trusts have cut their payment percentages and none has raised one within the tracked set. The most recent documented increase anywhere in the system remains Manville's 4.3% → 5.1% raise of February 2021, which carried a retroactive true-up of ~$5.6M (a).

**Cuts since January 2023 (documented):**

- **Celotex** — 8% → 7% in June 2023 (a).
- **Pittsburgh Corning** — 24.5% → 19% in November 2024 (a), pending TAC/FCR consent process with a true-up rider if not adopted.
- **Kaiser** — 18.1% → 10.6% in February 2025 (b).
- **W.R. Grace** — 31.7% → 30.1% in April 2025 (a).
- **Motors Liquidation (GM)** — 12.2% → 10.3% in December 2025 (b).
- **Combustion Engineering** — cut to 15.3% in April 2026 (b). The documented history (18.5% → 29.5% → 15.3% (b)) remains the system's clearest raise-then-reverse case.
- **Babcock & Wilcox** — cut 4.7% → 4.3% by trust letter dated June 30, 2026 (a). The 4.3% rate applies "until further notice," pending TAC/FCR consent — the same consent architecture that has held Pittsburgh Corning's November 2024 cut in procedural limbo for twenty-one months.

**Held this window (documented):** NARCO at 100% (a), DII Industries at 60% (a), Thorpe Insulation at 58.6% (a), Western at 51.1% (a), Plant at 20% (a), Manville at 5.1% (a), Maremont at 28.4% (a), API at 22% (a).

**Pending reconsiderations:** USG issued a payment-percentage reconsideration notice in May 2026 while holding at 11% (b); B&W's June 30 cut emerged from a TDP §4.2 reconsideration announced May 7, 2026 (a) — a seven-week notice-to-cut elapsed time that is now the documented template. Maremont's TDP §4.3 reconsideration announced April 7, 2026 (a) remains unresolved; no decision had been documented as of July 28.

**Forward 12–24 month outlook (hedged).** The documented pattern — cuts only, no raises, across 2023–2026 — supports expecting further downward adjustments rather than increases. Specifically: (1) a Maremont decision follows its April notice, on the same notice-then-decision sequence B&W just completed (b, pattern inference); (2) a USG cut is possible within 12–24 months, following the same sequence (b, pattern inference); (3) the 18 trusts with published percentages show a median of 15.15% (derived from (a)/(b) figures), and the mid-teens cluster still carrying FY2022-era asset data (CE 15.3%, Flintkote 15.0%, Federal-Mogul 12.2%, USG 11.0%, Armstrong 10.8%, Kaiser 10.6%, MLC 10.3% — all (b)) faces renewed downward pressure as FY2025–FY2026 filings land; (4) the sub-8% tier (Celotex 7% (a), Manville 5.1% (a), B&W 4.3% (a)) has limited room left before percentages approach nominal-recovery territory, which historically has triggered deferral periods — Celotex has been in one since January 2025 (a) — rather than further cuts. The high-percentage outliers (NARCO 100%, DII 60%, both (a)) are structurally different stories — funded late and large — and no documented pattern suggests near-term cuts there. These are projections from documented patterns, not certainties; consent processes can and do stall outcomes.

## C. Payout and depletion trends: FY2025 filings put fresh numbers on the record

Where documents exist, the outflow is substantial and persistent. The filing season delivered verified 2025 payout figures from the two smallest public filers and confirmation of DII's earlier-reported expense:

- **DII Industries** reported **$121.1M in claims expense in 2025** (a, FY2025 annual report) while maintaining its 60% percentage — the system's largest single-trust payout line item on file.
- **Manville's** Q1 2026 filing (filed April 27, 2026) puts its cumulative record at **$5.33B paid on 1.04M claims** (a), at a 5.1% pro rata percentage unchanged since February 2021.
- **Maremont** paid **166 claims totaling $2.09M in 2025** (a, FY2025 report filed April 20, 2026), with net claimants' equity at $49.59M.
- **API, Inc.** made **$151.7K in distributions in 2025**, bringing its cumulative claims paid to **$93.99M through December 31, 2025** (a, FY2025 report filed April 29, 2026).

The older anchors stand: a documented eight-trust subset — Pittsburgh Corning, W.R. Grace, Manville, GAF, Western, Plant, API, and Combustion Engineering — paid **~$591.9M in claims in 2022 and ~$561.2M in 2024** (a). The system's hard documented payout floor is the GAO's **$17.5B paid on 3.3M claims, 1988–2010** (a); the working point estimate for cumulative payouts through today is **~$24B (c)**, an extrapolation from the documented subset and explicitly order-of-magnitude.

One analytical observation follows from putting the documented and estimated figures side by side (c, inference): the eight-trust subset's *gross* payout run-rate (~$0.56–0.59B/yr) already exceeds the estimated *systemwide net* depletion (~$0.5B/yr (c)). If both are roughly right, investment returns and residual funding events are offsetting a large share of gross payouts — meaning aggregate balances are declining more slowly than the pace of checks written would suggest. This is an inference from mixed-confidence inputs, not an audited fact, and it should be quoted as such.

Claimant mortality acts on the system slowly and is not separately quantified in the dataset — we flag that gap rather than estimate around it. The documented contours: claim volumes that produced 3.3M claims through 2010 (a) continue at reduced rates more than a decade later, and trust after trust cites sustained filings — not asset exhaustion alone — when cutting percentages (a/b, per the notices above). Depletion today is driven by the interaction of persistent filings, maturing deferred funding, and returns; mortality bends the curve gradually, and no public dataset quantifies its quarterly contribution.

## D. System events: a quiet quarter for formations and closures, but governance consolidation continues

**Formations.** No new §524(g) trust was funded in the April–July window. The pipeline remains active at the petition stage: **Georgia-Pacific** abandoned the Bestwall vehicle and is planning a new Chapter 11, with a ~$1B+ trust expected in the next wave (b; size estimate (c)). **DBMP LLC (CertainTeed)** remains in Chapter 11 in the W.D.N.C. — on February 11, 2026 the Fourth Circuit affirmed denial of stay relief in *Herlihy v. DBMP*, leaving roughly 60,000 stayed lawsuits channelled toward an eventual §524(g) trust (a, appellate opinion; claim count (b)). **Trane's** Aldrich Pump and Murray Boiler units have been in Chapter 11 since June 2020 (b) with no trust yet confirmed. None of the three carries a figure in the dataset; none should be counted until funding is documented.

**Closures.** None in the window. The most recent remains **Rapid-American**, which stopped accepting claims and depleted on June 6, 2025, with final payouts in the ~18–21% range (b). Its record is retained in the dataset as the system's most recent end-of-life data point, now fourteen months in the past.

**Administrator migration and concentration.** NARCO paused claims intake on December 31, 2025 and resumed January 12, 2026 under **DCPF** administration (a). DCPF now administers 10 named trusts — Armstrong, B&W, Celotex, Federal-Mogul, Flintkote, NARCO, Owens Corning/Fibreboard, Pittsburgh Corning, USG, and W.R. Grace (b, site methodology) — which between them account for roughly **$8.7B, about 51% of the documented floor** (derived from (a)/(b) trust figures with mixed as-of dates). Administrator concentration at that scale is the system's defining structural fact of 2026.

**Governance programs.** Two documented programs show that concentration converting into coordination. The **Cross-Trust Audit Program**, launched by identical notices dated December 10–11, 2025, subjects approved-but-unpaid claims across all 10 DCPF trusts to monthly random audits using pooled claimant data (a) — the first cross-trust fraud-detection infrastructure the system has had. And **TDP §5.5 amendments** effective November 14, 2025 tightened eligibility for non-mesothelioma secondary-exposure claims, requiring exposure durations at least five times those of worker claims — verbatim-identical text across the DCPF trusts (a). When one administrator's policy change propagates to half the system's documented assets within a quarter, administrator-level governance *is* system-level governance. That is a documented observation, and it will shape every future issue of this report.

## E. Data-quality ledger

| Class | Trusts | Assets carried | Share of documented floor |
|---|---|---|---|
| (a) Filed court document | 9 | $3,966,648,769 | 23.3% |
| (b) Secondary citing primary | 32 | $13,076,231,337 | 76.7% |
| (c) Estimate/inference | 0 | excluded from point sum | — |

**Upgraded this cycle:** all nine public filers are now on FY2025 or Q1 2026 filed footing — NARCO, DII, Western, Thorpe Insulation, Plant, and J.T. Thorpe (CA) at FY2025; Manville at Q1 2026 (filed April 27, 2026); Maremont at FY2025 (filed April 20, 2026, D. Del. 19-10118-LSS Doc 374, posted free at maremont.mfrclaims.com); API at FY2025 (filed April 29, 2026, Bankr. D. Minn. 05-30073-GFK, posted free at apiincasbestossettlementtrust.com). **Filed but PACER-only (exhibits not yet extracted):** W.R. Grace FY2025 (filed April 29, 2026, D. Del. 01-01139 Doc 33347), Motors Liquidation FY2025 (filed April 30, 2026, S.D.N.Y. 09-50026 Doc 14861) — docket notices free via CourtListener mirrors, exhibits behind PACER (a); the dataset deliberately retains FY2022 secondary figures for these trusts rather than upgrade on unverified reads. **Not confirmed docketed as of July 28, 2026:** Owens Corning/Fibreboard FY2025, Federal-Mogul FY2025, Paddock FY2025, USG FY2025, Armstrong FY2025, Flintkote FY2025 (a/b, docket mirrors). **Staleness:** 28 of 32 class-(b) figures are dated FY2022 and 4 FY2021 — every one beyond the site's 18-month staleness threshold. **Known gaps:** ~19 of ~60 active trusts publish no retrievable figure; the Delticus/Bendix trust publishes no public financials; the OC Subfund cut magnitude (June 2026) is not yet documented. **Aggregate-level class-(c) figures in use:** the $22.5B high, the ~$24B cumulative-payout point, and the ~$0.5B/yr net-depletion rate.

## F. Watch list — next quarter

1. **Maremont reconsideration outcome** — decision on the 28.4% percentage following the April 7 notice; B&W's seven-week template or longer (a/b).
2. **B&W consent process** — whether TAC/FCR consent ratifies 4.3% or forces adjustment under the "until further notice" letter (a).
3. **USG reconsideration** — a cut within 12–24 months is possible per the documented notice-then-cut pattern (b).
4. **Pittsburgh Corning true-up** — adoption or reversion of the 19% reconsidered percentage, month twenty-one and counting (a).
5. **PACER pulls** — the six FY2025 reports queued behind PACER (W.R. Grace and Motors Liquidation highest priority), plus any late-docketed FY2025 reports for OC, Federal-Mogul, Paddock, USG, Armstrong, and Flintkote (a).
6. **Manville Q2 2026 quarterly filing** — due on the quarterly cadence that produced the April 27 Q1 filing; the system's highest-frequency class-(a) data point (b, cadence).
7. **OC Subfund cut magnitude** — documentation of the June change (b; flagged gap).
8. **Georgia-Pacific refiling** — the new Chapter 11 vehicle and any trust sizing beyond the ~$1B+ expectation (b; size (c)).
9. **Cross-Trust Audit Program** — first published findings (a; flagged gap).
10. **Celotex deferral** — status of the 7% percentage in the Deferral Period's second year (a).

---

*Next issue: ATR-2026-Q4, expected October 2026. Corrections and sourcing disputes: open an issue on this repository. Figures marked (c) must not be cited as primary evidence.*

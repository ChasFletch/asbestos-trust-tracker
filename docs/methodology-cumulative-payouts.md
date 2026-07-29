# Cumulative Payouts: Bottom-Up Methodology (2026-07-29)

**Canonical figure: $29,981,797,653** (`aggregate.cumulativePayoutsBottomUp` in
`client/src/data/trust-figures.json`). This supersedes the round
`cumulativePayoutsPoint` of $24,000,000,000, which is retained in the JSON as a
legacy reference only.

## Why the number changed from $24B to ~$30B

The $24B was a placeholder point estimate. The bottom-up build says it was not
just round — it was probably **low**. Three independent anchors point the same
way:

- GAO-11-819's often-quoted "$17.5 billion paid" was frozen at **December 31,
  2010**. It says nothing about the last 15+ years.
- Bates White / Mealey's tables (via the research corpus, dim12) document
  **$14.0 billion paid in 2006–2011 alone** — six years.
- The research corpus's own assessment: cumulative payments by 2026 are
  "plausibly $30B+" (RAND documented ~$3.3B of trust outlays in 2008).

## How the total is built

Every component is itemized in `bottomUpPayouts.tiers` with source and as-of
date. Three tiers:

### Tier 1 — filed figures: $19,810,476,508 (14 trusts)

Inception-to-date claims payments read directly from filed annual reports,
quarterly statements, or court documents. As-of dates range 2006–2026; the four
historical figures (Owens Corning/Fibreboard 2009, Armstrong 2014, USG 2008,
Celotex 2006) are **floors** — those trusts kept paying after their last
publicly retrievable report.

### Tier 2 — secondary citing filed: $6,671,321,145 (5 components)

Used only where no filed figure is in hand. Each comes from a secondary
compilation that cites the trust's own filed annual report, is labeled with a
confidence level, and is **not yet verified against the filed document**:

| Component | Amount | As of | Confidence |
|---|---|---|---|
| Pittsburgh Corning — cumulative since inception | $3,071,420,000 | 2022 | high |
| Babcock & Wilcox — cumulative since inception (stated floor, "+") | $1,940,000,000 | 2024 | medium-high |
| Celotex — post-2006 growth over filed figure | $783,146,017 | 2021 | medium-high |
| Owens Corning/Fibreboard — post-2009 growth over filed figure | $534,090,000 | 2022 | medium |
| G-I Holdings (GAF) — cumulative since establishment | $342,665,128 | 2022 | high |

### Tier 3 — estimated residual: ~$3,500,000,000 (range $2.5–5B)

~25 active trusts publish no inception-to-date payment figure anywhere free
(DCPF-administered trusts report only to PACER): ACandS, A.P. Green, ASARCO,
Bondex, Combustion Engineering, Eagle-Picher, Federal-Mogul (T&N), Fuller-Austin,
Garlock GST, Kaiser, Paddock, Quigley, Rapid-American, Yarway, and others. The
allowance is derived from system payout run-rates (~$1.5–2B/yr documented by
Bates White and RAND) net of the itemized components, and from these trusts'
combined documented balances vs. their initial funding.

## Honest caveats (for the Methodology page)

1. **It is a floor-leaning estimate.** Several Tier 1/2 as-of dates are stale;
   payments after those dates are only partly captured. B&W is a stated floor.
2. **The residual is an allowance, not a measurement.** We publish the range
   ($2.5–5B), not false precision.
3. **Every Tier 2 figure graduates to Tier 1** (or gets corrected) when its
   filed annual report is pulled — see `pacer-pull-queue.json`.
4. Marketing-site figures ("$30 billion available", mesothelioma.com etc.) are
   banned as sources per AGENTS.md; nothing class-c is used anywhere in this
   build.

## Revision log

| Date | Figure | Change |
|---|---|---|
| pre-2026-07-29 | $24,000,000,000 | Round placeholder point estimate |
| 2026-07-29 | $29,981,797,653 | Bottom-up build (commit `2b2ecf1`): 14 filed + 5 secondary-citing-filed + labeled residual |

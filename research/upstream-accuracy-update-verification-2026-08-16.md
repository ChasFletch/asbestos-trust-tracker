# Upstream Accuracy Update — Production Verification Record

**Verification date:** 2026-08-16  
**Deployment:** upstream accuracy update `81154ec`, changelog follow-up `b2fe7c7`, and handoff `b8c7f1d` synchronized through checkpoint `fa381cbd`.

## Observed production homepage values

After the animated counters and client data refresh settled, the live homepage exposed the following accessible counter labels:

| Counter | Observed value |
|---|---:|
| Documented Remaining Assets | $15,987,271,944 |
| Cumulative Payouts Since 1988 | $30,020,097,653 |

The homepage also identified the data as last updated **August 16, 2026** and displayed the full system estimate range of **$16.0B–$21.7B**. The animated stat-tile values were still at their initial zero state in the first browser extraction and require a settled-DOM follow-up check.

## Methodology route

The live `/methodology` route displayed the August 16, 2026 aggregate note and revision-log line. The revision record states that Hercules Chemical and United Gilsonite (UGL) were added, moving the remaining-assets floor from $15,967,208,224 to **$15,987,271,944**, and identifies the new per-claimant-statistics section.

The production page includes **“Per-Claimant Statistics: A Measured Void.”** Its text correctly frames the data limitation: no public dataset can calculate either a typical claimant’s number of trust filings or total cross-trust recovery. The page then qualifies the Garlock, Ableman, and ILR figures by source and measure.

## New-record route check

The production Hercules trust route resolves at `/trusts/hercules-chemical-co-asbestos-settlement-trust`. It displays the following synchronized values: **$4.0M** net assets as of 2022-12-31, **2%** payment percentage effective 2022-10-17, Verus Claims Services as administrator, and a last-verified date of August 16, 2026.

The production UGL trust route resolves at `/trusts/united-gilsonite-ugl-asbestos-pi-trust`. It displays **$16.0M** net assets as of 2022-12-31 and **3.35%** for standard claims, effective 2024-04-11. The page separately discloses the 11% payment percentage for released claims.

## Structured-data inspection status

The fetched `/methodology` HTML includes the synchronized asset-floor and payout values in its JSON-LD. An initial exact-string check did not find the section heading “Per-Claimant Statistics: A Measured Void” inside the JSON-LD, so the FAQ objects require a semantic question-and-answer check rather than a heading-string check.

Semantic inspection confirmed the FAQPage JSON-LD carries the current asset-floor and payout figures and includes the new question: **“How many asbestos trusts does a typical claimant file with?”** Its answer makes clear that no public dataset can calculate the figure and identifies the RAND, Garlock, Ableman, and ILR limitations.

## SSR statistic correction

The first production-HTML check showed the homepage statistics as zero before hydration. This was a presentation defect in the count-up component, not an aggregate-data defect: the component hid its initialized target whenever its Intersection Observer had not yet run.

The local correction initializes the count-up display with its target and renders that value in server HTML; once a tile enters view, the existing effect resets it to zero and performs the count-up animation. A local SSR check now exposes **54** active trusts, **22** court-filed sources, **18** current-year records, and **42** records with documented assets. The typecheck and seven Vitest files, totaling **16 tests**, passed after the correction. Development screenshots confirm the synchronized homepage, methodology page, and both new trust-detail pages render as expected.

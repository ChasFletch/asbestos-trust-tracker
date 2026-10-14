# Kaiser Report Amendment Provenance Packet — October 14, 2026

**Status:** Complete internal Tier 1 packet — **held pending a specific production-release decision**  
**Scope:** Two existing research reports only: `ATR-2025-Q4` and `ATR-2026-Q3`  
**Prepared by:** Manus AI  
**Reviewer status:** No ANCHOR, CLEO, Paul Danziger, or Rod de Llano review is claimed.  
**Public action:** None authorized or taken by this packet.

## Purpose

The October 14, 2026 production correction fixed the Kaiser historical baseline in two public reports: both now say that the February 2025 payment-percentage action moved from **15.5% to 10.6%**, rather than from 18.1% to 10.6%.

The correction is numerically complete and live. This packet addresses the remaining **provenance and amendment-disclosure gap only**: each report still displays its original publication date as its material-update date, does not expose a report-specific correction notice, and does not link the corrected Kaiser statement directly to the official notice.

This is not evidence of a new Kaiser rate, a final consent outcome, or a later change to the tracker.

## Verified source record

| Field | Verified record |
|---|---|
| Trust | Kaiser Aluminum & Chemical Corporation Asbestos Personal Injury Trust |
| Source | [Notice of Request for Consent to Decrease Payment Percentage](https://www.kaiserasbestostrust.com/assets/uploadedFiles/a9fa8368-7c64-4c40-9312-d95c42ff8c06.pdf) |
| Notice date | February 5, 2025 |
| Prior / proposed payment percentage | 15.5% → 10.6% |
| Interim-payment qualification | The Trustees sought TAC/FCR consent; under TDP §4.3, because the proposal had not yet been adopted, they directed Verus Claims Services to pay the lower proposed 10.6% beginning February 5, 2025. |
| What the notice does **not** establish | A later consent decision, a later final adoption, or a newer current rate as of October 14, 2026. |

The official notice directly supports the corrected historical baseline, the pending-consent qualification, and the February 5 interim-payment direction. It supports an **official trust payment-percentage notice** source classification under each report’s existing methodology; it does not support a court-filing or annual-report label.

## Current public state verified October 14

| Report | Corrected report sentence | Remaining disclosure gap |
|---|---|---|
| `ATR-2025-Q4` | “Kaiser — cut to 10.6% (from 15.5%), February 2025 (b).” | The page still displays January 1, 2026 as “Materially updated”; it contains no report-specific correction note or direct official-notice link. |
| `ATR-2026-Q3` | “Kaiser — 15.5% → 10.6% in February 2025 (b).” | The page still displays July 28, 2026 as “Materially updated”; it contains no report-specific correction note or direct official-notice link. |

The public `/corrections` page already records the earlier Kaiser tracker correction and its 15.5% baseline. It does **not** record the separate October 14 amendment to these two reports. That existing tracker record must remain intact; it must not be overwritten or recast as a report-amendment notice.

## Proposed bounded release

If a specific release decision is later given, apply the following narrow report-provenance update only.

1. **Retain the original report publication date and source cutoff.**
   - `ATR-2025-Q4`: published January 1, 2026; source cutoff December 31, 2025.
   - `ATR-2026-Q3`: published July 28, 2026; source cutoff July 28, 2026.

2. **Expose the actual amendment date as October 14, 2026.**
   - Add `materially_updated: 2026-10-14` to each report’s frontmatter.
   - Update the report-detail metadata flow so that this field—not `published`—drives the visible “Materially updated” value and affected structured/API/PDF metadata.
   - The October 14 date is the date of the documented report amendment; it is not an original-publication date or an asserted new source cutoff.

3. **Add this report-specific historical-correction notice once in each report, after the comparability note and before the substantive sections.**

   > **Historical-rate correction — October 14, 2026.** This report previously gave 18.1% as the prior Kaiser Aluminum & Chemical Corporation Asbestos Personal Injury Trust payment percentage for the February 2025 action. The prior percentage has been corrected to 15.5%, based on the Trust’s [February 5, 2025 Notice of Request for Consent to Decrease Payment Percentage](https://www.kaiserasbestostrust.com/assets/uploadedFiles/a9fa8368-7c64-4c40-9312-d95c42ff8c06.pdf). The notice sought consent to reduce 15.5% to 10.6% and directed payment at 10.6% effective February 5 while consent was pending. This corrects the historical baseline; it is not evidence of a new current rate or later final adoption.

4. **Correct only the source-confidence tag attached to each amended Kaiser statement.**
   - `ATR-2025-Q4`: replace `(b)` with `(a, official trust notice)`.
   - `ATR-2026-Q3`: replace `(b)` with `(a, official trust notice)`.
   - Do not modify any other rate, rate history, asset, aggregate, analysis, trust record, corrections-page entry, or reviewer attribution.

5. **Add one distinct report-amendment correction record.**
   - Do not alter the existing July 27 or October 8 Kaiser tracker corrections.
   - The correction record must name the two report IDs, show **old: 18.1%** / **new: 15.5%**, cite the dated official notice, distinguish the source classification change, and state that no current-rate or final-adoption conclusion was made.

## Implementation constraints discovered during packet preparation

The present report-detail component constructs `materiallyUpdatedAt` from `meta.date`, which is the original report publication date. Report frontmatter parsing does not currently expose a distinct `materially_updated` field. Therefore, a truthful material-update date requires a bounded metadata-rendering change in addition to the two report Markdown updates. Merely altering the published date would be inaccurate.

The release must preserve:

- original `published` and `as_of` frontmatter values;
- the existing `ATR-2025-Q4` and `ATR-2026-Q3` canonical URLs and report IDs;
- the existing July 27 and October 8 Kaiser tracker/corrections history; and
- the absence of article-specific legal-review claims.

## Acceptance criteria for a later authorized release

- [ ] Both reports retain their original publication date and source cutoff.
- [ ] Both show **Materially updated: October 14, 2026** through the report-detail experience.
- [ ] Both expose the exact historical correction notice and direct official PDF link.
- [ ] Both use only the notice-supported `a, official trust notice` classification for the corrected Kaiser bullet.
- [ ] A distinct report-amendment correction record shows 18.1% → 15.5%, the source, scope, and no-new-current-rate qualification without overwriting earlier Kaiser entries.
- [ ] Affected API, raw SSR, visible page, structured data, and PDF/print pathways agree on published date, material-update date, and source cutoff.
- [ ] No rate, asset, aggregate, report analysis, tracker data, or reviewer attribution changes beyond this packet’s stated scope.

## Internal disposition

**Hold complete.** The packet passes factual source and date QA for the limited historical-baseline amendment. The October 14 authorization covered only the already-completed two-line correction and production verification. It did not authorize this separate public provenance follow-up. Do not implement, publish, deploy, or create a duplicate article unless a later specific release instruction covers this packet.

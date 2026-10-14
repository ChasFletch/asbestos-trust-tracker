# Manville Homepage Update — Artifact, Citation, and Release-State QA

**Date:** October 14, 2026  
**Intake handoff:** `AT-INTAKE-20261014-02`  
**Scope:** Bounded verification of the existing “Recent Trust Updates” homepage card and its existing Manville detailed brief. This record makes no tracker-data change, article-content change, deployment request, or publication decision.

## Scope and authority boundary

The owner requested a homepage section for the already-covered Manville payment-percentage event. The accompanying intake handoff requested recovery and QA of that existing artifact, not another implementation or a new release. This packet documents what was recovered and observed; it does not independently authorize a deployment.

The underlying monitoring authority remains limited to official payment-percentage and annual-report work through November 5, 2026 (America/Chicago). This homepage item is presentation and navigation for an existing, previously covered payment notice—not a new October rate/report discovery.

## Recovered staged artifact

| Item | Recovered result |
|---|---|
| Checkpoint | `c5c827be` — existing homepage card and focused regression test |
| Homepage placement | A `Recent Trust Updates` section between the summary statistics and the existing latest-updates strip |
| Card subject | Manville Personal Injury Settlement Trust |
| Exact rate wording | “Payment percentage increased from 5.1% to 5.6%” |
| Notice/implementation wording | “Notice posted September 3, 2026”; e-Claims changes implemented September 2, 2026 |
| Reader destination | `/news/manville-payment-percentage-increase-september-2026` |
| Primary-source destination | `https://www.claimsres.com/2026/09/03/manville-increase-in-the-pro-rata-payment-percentage/` |
| Notice-history destination | `/payment-notices` |

The detailed destination is a complete, rate-specific *NewsArticle*, not a news-list anchor or a Manville financial-report article. It provides the rate change, notice date, e-Claims implementation context, source link, source boundary, and a no-individual-advice statement.

## Primary-source fact check

**Controlling source:** [Claims Resolution Management Corporation — “Manville: Increase in the pro rata payment percentage” (posted September 3, 2026)](https://www.claimsres.com/2026/09/03/manville-increase-in-the-pro-rata-payment-percentage/).

The administrator’s notice states that the Trustees, with concurrence of the Selected Counsel for the Beneficiaries and Legal Representative of Future Claimants, approved an immediate increase in Manville’s **pro rata payment percentage from 5.1% to 5.6%**. It separately says that on **September 2, 2026**, e-Claims changes set future offers to 5.6% and re-issued outstanding offers at 5.6%.

The source says certain claims identified by law firm were eligible for a retroactive supplemental-payment adjustment and that payments were **planned** for mid-October. The homepage card and full brief do not present that plan as completed payments, do not make an individual eligibility/value statement, and do not infer a new asset balance or cumulative-payout total.

## Verification results

| Check | Result |
|---|---|
| Source scope and dates | **Pass.** Manville-only 5.1%→5.6% rate fact, September 3 post date, and September 2 implementation context agree with the controlling administrator notice. |
| Homepage copy | **Pass.** Source-qualified wording, no suggestion of a new October event, trust-system-wide rate, asset total, payout total, individual outcome, or completed supplemental payment. |
| Read-more destination | **Pass.** Local SSR route returned HTTP 200 and initial HTML contained the complete rate brief, its official source URL, September 3 and September 2 dates, and `NewsArticle` structured data. |
| Official-source link | **Pass.** Homepage and detailed brief link to the exact CRMC notice. The detailed-brief primary-source anchor opens in a new tab with `rel="noopener noreferrer"`. |
| SSR/crawler visibility | **Pass.** Local initial HTML included the homepage card, 5.1%, 5.6%, the detailed-brief path, and the CRMC source URL; the detailed route’s initial HTML included the full rate brief. |
| Schema/visible-copy agreement | **Pass.** The detailed route exposes a `NewsArticle` schema block whose title, summary, canonical URL, and published date align with the visible detailed brief. |
| Accessibility | **Pass.** The card section is labelled by the visible `Recent Trust Updates` heading; external-link text includes an accessible new-tab label. |
| Mobile-width rendering | **Pass.** A 390-pixel-wide headless-browser capture showed a readable card, distinct full-update and official-notice links, and no visible horizontal clipping. |
| Authorship/review truth | **Pass.** The detailed brief states that no article-specific attorney review is recorded; no review by Paul Danziger or Rod de Llano is claimed. |

## Observed public state and release disposition

At approximately **2026-10-14 19:05 UTC**, independent public fetches of `https://asbestostrusts.org/` and the detailed Manville URL both returned the recovered card and complete rate brief. The homepage card is therefore **already live**.

No deploy or publication command was initiated in response to the intake handoff. The relevant owner request asked to create the homepage section; the intake handoff did not provide a separate release instruction. Because the feature was already publicly observable, no repeat deployment is appropriate. This QA packet records the observed release state only; it does not expand the monitoring authorization or retroactively claim an unrecorded release decision.

## Disposition

**No further site action.** Retain the live card and detailed brief as the verified presentation of the September 3 Manville notice. Future monitoring must continue to treat this as an already-covered event unless a later controlling official Manville notice or annual report appears.

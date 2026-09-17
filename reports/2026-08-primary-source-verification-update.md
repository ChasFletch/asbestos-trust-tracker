---
report_id: ATR-2026-VERIFY
title: "Primary-Source Verification Update — August 2026"
series: "Asbestos Trust Research Notes"
as_of: 2026-08-12
published: 2026-08-12
data_contract: client/src/data/trust-figures.json (asbestos-trust-figures/v1)
schema: asbestos-trust-report/v1
---

# Primary-Source Verification Update — August 2026

**Report ID:** ATR-2026-VERIFY · **Data as of:** August 12, 2026 · **Published:** August 12, 2026

This research note documents an August 2026 verification pass across U.S. asbestos bankruptcy trust records. The work compared published trust notices, annual reports, trust distribution procedures, bankruptcy dockets, and the tracker’s existing data. It is a source-quality update, not legal or financial advice.

> **Result:** The tracker now covers **52 documented trust records**: **51 active** trusts and **1 closed** trust. The published source library contains **105 retained PDFs**. Of those, **93 applicable primary-source documents** are available directly from **24 trust detail pages** for readers to inspect in-page; six duplicate binary variants and six case-research documents for entities without operating trust records are retained but not shown in a trust panel.

## What the verification changed

The verification pass recovered four FY2025 net-asset figures from trust annual reports and financial statements. The records for ASARCO, Combustion Engineering, Kaiser Gypsum, and Congoleum now use their FY2025 figures rather than older values. The annual reports support net assets of $625,807,675 for ASARCO, $385,240,071 for Combustion Engineering, $63,680,663 for Kaiser Gypsum, and $148,083,220 for Congoleum as of December 31, 2025.[1] [2] [3] [4]

The pass also filled or refreshed twelve payment-percentage records using trust notices and reports. These include 35% for ASARCO, 62% for Kaiser Gypsum, 100% for Paddock Enterprises (Owens-Illinois), 18% for A-Best Products, 6% for A.P. Green, 2.89% for ACandS, 55% for Christy Refractories, 8.67% for Congoleum, 35% for Eagle-Picher, 45% for Fuller-Austin, 5% for G-I Holdings, 45% for National Gypsum, and 27.5% for Yarway. Where a trust notice did not state a new effective date, the tracker preserves the report date and labels it accordingly rather than inferring one.

| Verification finding | Treatment in the tracker |
|---|---|
| **Paddock funding is not a balance sheet.** The previously carried $610 million represents a plan-funding commitment, not reported net assets. | Removed from `netAssets`; Paddock’s 100% initial payment percentage is retained with the TDP as its source.[5] |
| **Kaiser Gypsum and Kaiser Aluminum are distinct trusts.** The 10.6% figure belongs to Kaiser Aluminum; Kaiser Gypsum’s current percentage is 62%. | Records remain separate; the Kaiser Gypsum trust page links to the FY2025 annual report and May 2026 payment-percentage resolution.[4] |
| **Owens Corning/Fibreboard and Federal-Mogul each have separate pools.** A single percentage would conceal a material distinction. | The tracker presents source links for the separate Owens Corning and Fibreboard notices and preserves separate sub-account display.[6] |
| **Legacy balance figures need their own source classification.** A current payment notice does not prove an older balance-sheet figure. | Asset fields without a retrievable filed report are carried as secondary rather than being upgraded by association with a payment notice. |

## Primary-source document library

The publication batch includes the full set of PDFs retained during the verification process and maps each applicable document to the exact trust record it supports. The linked documents can be previewed in the trust page’s **Primary Source Documents** panel. The library includes annual reports, payment-percentage notices, reconsideration notices, a deferral notice, trust distribution procedures, claims-resolution procedures, and related notices.

| Trust detail page | Documents now available |
|---|---|
| ASARCO; Combustion Engineering; Congoleum | FY2025 annual reports and related rate notice |
| Armstrong; Celotex; USG; Owens Corning/Fibreboard | Multi-year annual-report, payment-notice, and reconsideration histories |
| Federal-Mogul; Kaiser Gypsum; Paddock | TDPs, subfund notices, resolutions, and related procedures |
| A-Best; ACandS; Christy; H.K. Porter; Leslie; NGC; Shook & Fletcher; U.S. Mineral Products; Yarway | Primary payment-percentage, liquidity, or procedure notices |
| J.T. Thorpe (TX); Porter Hayden; ABB Lummus; T H Agriculture & Nutrition | Trust procedures, annual reports, and payment-percentage notices |

The library does **not** treat every published document as a balance-sheet source. For example, a payment-percentage notice is strong evidence of the rate described in that notice, but it does not independently establish a trust’s net assets or cumulative payouts. The tracker retains per-field confidence labels for this reason.

## Coverage gaps that remain visible

Several current annual-report exhibits remain inaccessible outside PACER or are restricted on the court side. Pittsburgh Corning’s latest annual-report entries are unavailable through the court document system; Celotex’s relevant documents remain access restricted; and some other trusts file financial exhibits in forms that are not freely retrievable. The tracker flags these limitations on the relevant trust pages and does not represent historical substitute figures as current results.

The work also confirmed that Bestwall LLC and DBMP LLC are still pending Chapter 11 cases rather than formed, funded asbestos trusts. Neither has a payment percentage or trust balance to add to the dataset. These cases remain watch-list items until a plan is confirmed and a trust is actually created.

## Methodology and audit trail

The verification uses the site’s source hierarchy: **(a)** a filed court document or official trust document, **(b)** a secondary source that identifies its primary source, and **(c)** an estimate or inference. A value is not moved to filed confidence merely because another field on the same record has a primary source. The report also distinguishes a trust’s payment percentage from its scheduled value, current assets, cumulative distributions, and plan funding commitments.

Readers can review the site’s continuing standards on the [Methodology page](https://asbestostrusts.org/methodology), inspect the affected records in the [Trust Fund Database](https://asbestostrusts.org/trusts), and report potential corrections through the [Corrections page](https://asbestostrusts.org/corrections).

## References

[1] [ASARCO Asbestos PI Settlement Trust, FY2025 Annual Report](https://asbestostrusts.org/manus-storage/asarco-fy2025-annual-report_efe6cce4.pdf).

[2] [Combustion Engineering 524(g) Asbestos PI Trust, FY2025 Annual Report](https://asbestostrusts.org/manus-storage/ce-fy2025-annual-report_fa3a10c4.pdf).

[3] [Congoleum Plan Trust, FY2025 Annual Report and Financial Statements](https://asbestostrusts.org/manus-storage/CG_Annual_Report_and_Financial_Statements_2025_995aa0a3.pdf).

[4] [Kaiser Gypsum Asbestos PI Trust, FY2025 Annual Report](https://asbestostrusts.org/manus-storage/KG_Annual_Report_FY2025_073535b6.pdf) and [May 2026 Payment-Percentage Resolution](https://asbestostrusts.org/manus-storage/KG_Resolution_Adjusted_Payment_Percentage_2026-05-19_d569137d.pdf).

[5] [Paddock Enterprises (Owens-Illinois) Asbestos Trust, First Amended Trust Distribution Procedures](https://asbestostrusts.org/manus-storage/PADDOCK_TDP_First_Amended_2023_f665b5f7.pdf).

[6] [Owens Corning Subfund June 2026 Payment Percentage Notice](https://asbestostrusts.org/manus-storage/ocfb-oc-subfund-payment-pct-notice-2026-06-30_d6141122.pdf) and [Fibreboard Subfund June 2026 Payment Percentage Notice](https://asbestostrusts.org/manus-storage/ocfb-fb-subfund-payment-pct-notice-2026-06-30_662d210b.pdf).

---

*Corrections or additional primary documents are welcome. Please use the site’s Corrections page so the research record remains auditable.*

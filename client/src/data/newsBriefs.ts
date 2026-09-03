export type NewsBrief = {
  slug: string;
  title: string;
  cardTitles?: string[];
  relatedTrustSlugs?: string[];
  date: string;
  category: string;
  summary: string;
  sourceUrl: string;
  sourceLabel: string;
  sourceCutoffAt?: string;
  keywords?: string;
  about?: string;
  markdown: string;
};

export const NEWS_BRIEFS: NewsBrief[] = [
  {
    slug: "manville-q2-2026-financial-statements",
    title: "Manville Trust Q2 2026: Net Claimants’ Equity Rises to $570.5M; Liquidated Claims Reach 1.04M",
    date: "2026-08-29",
    category: "annual_report",
    summary: "The Manville Personal Injury Settlement Trust’s Q2 2026 court filing reports $570.5 million in net claimants’ equity and 1,041,171 cumulative liquidated claims through June 30, 2026.",
    sourceUrl: "/manus-storage/Manville-Q2-2026-Financial-Statements-Doc4480_0eacb16f.pdf",
    sourceLabel: "Manville Q2 2026 Financial Statements and Report (S.D.N.Y. Doc. 4480)",
    sourceCutoffAt: "2026-06-30",
    keywords: "Manville Trust, Manville Q2 2026, asbestos trust annual report, asbestos claim payments, bankruptcy trust filing",
    about: "Manville Personal Injury Settlement Trust Q2 2026 filing",
    relatedTrustSlugs: ["manville-personal-injury-settlement-trust"],
    markdown: `The Manville Personal Injury Settlement Trust’s second-quarter 2026 financial statements report **$570,516,505 in net claimants’ equity as of June 30, 2026**, following $539,264,338 at March 31. The report was filed in the Johns-Manville bankruptcy on July 27, 2026 as **S.D.N.Y. Case No. 82 B 11656 (KYP), Doc. 4480**.[1]

## What the Q2 filing reports

The filing’s special-purpose statement of net claimants’ equity lists **$635,822,702 in total assets** and **$65,306,197 in total liabilities**, resulting in the $570.5 million quarter-end equity figure.[1] Cash equivalents and investments totaled $632,971,774, including $44.5 million restricted and $588,471,774 unrestricted.[1]

For the three months ended June 30, the Trust reported $47,659,071 in net investment income and $13,891,553 in claims settled for personal-injury claims. Its cash-flow statement separately reports **$13,711,468 in claim payments made during the quarter**. Those are distinct accounting measures and should not be treated as interchangeable.[1]

| Filed Q2 2026 measure | Reported amount | What it represents |
|---|---:|---|
| Total assets | $635,822,702 | Balance-sheet assets at June 30, 2026 |
| Total liabilities | $65,306,197 | Reported liabilities at June 30, 2026 |
| Net claimants’ equity | $570,516,505 | Assets less reported liabilities at quarter end |
| Claim payments made (Q2) | $13,711,468 | Cash-flow payments during April–June 2026 |
| Claims settled (Q2) | $13,891,553 | Quarter’s statement-of-equity claim-settlement deduction |

## Claim volume through June 30

Exhibit III reports **1,041,171 cumulative Trust claims liquidated** through June 30, 2026. That figure is a claim-volume measure; it does not state a cumulative dollar amount paid by the Trust.[1]

The tracker now uses the 1,041,171 total on the Manville trust record and replaces the prior Q1 count of 1,036,966. The difference is **4,205 liquidated claims** between the two quarterly reporting dates. This comparison uses the Trust’s cumulative liquidated-claim totals, not a newly created claim count.[1]

## How this affects the tracker’s cumulative-payout series

The public tracker’s bottom-up payout series is not a balance-sheet line item. It combines the best retrievable inception-to-date or cumulative payment information from individual trusts and applies specifically labeled methods where a later filing updates a component.

For Manville, the prior documented component was updated by the **$13,891,553** “claims settled for personal injury claims” amount reported for Q2 in the statement of changes in net claimants’ equity. The tracker therefore now presents **$30,033,989,206** as the bottom-up cumulative-payout series, up from $30,020,097,653. This is a transparent series update, not a claim that the Q2 filing itself reports an inception-to-date cash-paid total.[1]

> **Important distinction:** $570.5 million is a June 30, 2026 quarter-end net-equity figure. The $30.03 billion tracker figure is a cross-trust, historical bottom-up payout series. Neither number should be substituted for the other.

## Source and review notes

This brief relies on the filed quarterly report and its exhibits. The report requires the Trustees to submit quarterly financial statements and supplemental information, including the number of Trust claims liquidated and the average amount per Trust claim paid or payable.[1] The source PDF is retained in the site’s primary-source library and may be opened directly below.

[1]: /manus-storage/Manville-Q2-2026-Financial-Statements-Doc4480_0eacb16f.pdf "Manville Personal Injury Settlement Trust, Financial Statements and Report for the Period Ending June 30, 2026, S.D.N.Y. Doc. 4480, filed July 27, 2026"
`,
  },
  {
    slug: "hopeman-brothers-plan-confirmed",
    title: "Hopeman Brothers Plan Confirmed: What the Proposed Asbestos Trust Does—and Does Not—Mean Yet",
    date: "2026-09-03",
    category: "court_filing",
    summary: "The official Hopeman Brothers docket records a confirmed Chapter 11 plan that provides for a newly created asbestos personal-injury trust. Public materials reviewed as of September 3, 2026 do not establish that the plan is effective, the trust is operational, or asbestos claims are being accepted.",
    sourceUrl: "https://www.veritaglobal.net/hopeman/document/2432428260820000000000005",
    sourceLabel: "Hopeman Brothers confirmation order and Third Modified Amended Plan (Docket No. 1542)",
    sourceCutoffAt: "2026-09-03",
    keywords: "Hopeman Brothers bankruptcy, proposed asbestos trust, asbestos trust effective date, Chapter 11 confirmation order, asbestos claim filing instructions",
    about: "Hopeman Brothers Chapter 11 plan confirmation and proposed asbestos personal-injury trust",
    markdown: `The official Hopeman Brothers bankruptcy docket records a confirmation order for the company’s Chapter 11 plan. The confirmed plan provides for a **newly created asbestos personal-injury trust** and a proposed permanent channeling injunction for specified asbestos-related liabilities.[1]

That is a meaningful court development. It is **not**, by itself, public confirmation that a trust is currently operating, that claimants can file with it, or that any payment percentage has been set. This article explains the distinction and identifies the documents readers should watch next.

## What the court confirmed

On August 20, 2026, the official case docket recorded **Docket No. 1542**, the order confirming Hopeman Brothers, Inc.’s amended Chapter 11 plan and approving the related disclosure statement. The order incorporates the Third Modified Amended Plan dated August 17, 2026.[1]

The plan describes a structure under which specified asbestos-related liabilities would be channeled to a newly created asbestos trust. It also contemplates a permanent channeling injunction as part of the proposed reorganization framework.[1]

> **Confirmed:** A bankruptcy court confirmed a plan that provides for an asbestos personal-injury trust.
>
> **Not yet established by the public materials reviewed:** That the plan has become effective, that the trust is operational, or that asbestos claims are currently being accepted.

## Why confirmation is not the same as an open trust

In a Chapter 11 case, plan confirmation and plan effectiveness are distinct milestones. A confirmed plan may still contain conditions that must be satisfied before its Effective Date. For a claimant-facing asbestos trust, public implementation materials would ordinarily be expected to identify the operative trust arrangements, claims procedures, and other practical filing information.

As of September 3, 2026, the public Hopeman case materials reviewed do not provide a notice that the plan has reached its Effective Date. They also do not provide a public asbestos-trust portal, asbestos claim form, payment percentage, Trust Distribution Procedure, or claimant filing instructions.[1]

For that reason, AsbestosTrusts.org does not list Hopeman as an operating trust or include it in the tracker’s trust-count, payment-percentage, net-asset, or cumulative-payment figures.

## The current appeal posture

The official docket also records a Fourth Circuit appeal notice. Docket No. 1549, entered September 1, 2026, states that Case No. 26-2188 was opened after Century Indemnity Company and Westchester Fire Insurance Company filed a notice of appeal on August 28, 2026.[2]

The presence of an appeal does not itself determine the ultimate outcome of the plan or proposed trust. It is, however, a material reason to avoid describing the proposed trust as final, funded, or open for claims until the court record and trust-administration materials say so.

## What readers should watch next

| Document or development | Why it matters |
|---|---|
| Notice of Effective Date | Confirms that the plan’s stated conditions have been satisfied or waived. |
| Trust agreement and trustee notice | Identifies the legal trust structure and responsible administrator. |
| Trust Distribution Procedure or payment-percentage notice | Explains claim valuation, payment mechanics, and any initial payment percentage. |
| Public claim form or claims portal | Establishes whether and how asbestos claimants may submit claims. |
| Appellate orders or disposition | Clarifies the status of the appeal reflected in the public docket. |

This article will be updated when an official notice supplies one of those missing implementation facts. It intentionally does not repeat circulating proposed-funding estimates as a current trust balance, because the public materials reviewed do not establish an operational trust balance or payment terms.[1] [2]

## Sources and editorial note

The confirmation order and appeal notice are primary docket materials hosted through the official Hopeman case agent. They are the basis for the confirmed-plan and appeal statements above. This article does not provide legal advice and does not suggest that any claimant should delay or file a claim based on the present status alone.

[1]: https://www.veritaglobal.net/hopeman/document/2432428260820000000000005 "Hopeman Brothers, Inc., Order Confirming the Amended Plan of Reorganization and Third Modified Amended Plan, Docket No. 1542"
[2]: https://www.veritaglobal.net/hopeman/document/2432428260901000000000001 "Hopeman Brothers, Inc., Fourth Circuit appeal notification, Docket No. 1549"
    `,
  },
  {
    slug: "uniroyal-disclosure-hearing-sept-10",
    title: "Uniroyal’s September 10 Disclosure Statement Hearing: What the Court Date Does—and Does Not—Mean for a Proposed Asbestos Trust",
    date: "2026-09-03",
    category: "new_trust",
    summary: "Uniroyal Holding and Great Hill Corporation’s Chapter 11 disclosure-statement hearing is scheduled for September 10, 2026. The posted calendar confirms a case milestone, not an effective plan, funded asbestos trust, or open trust-claim process.",
    sourceUrl: "https://omniagentsolutions.com/Uniroyal",
    sourceLabel: "Omni Agent Solutions — Uniroyal Holding, Inc. case calendar and public case information",
    sourceCutoffAt: "2026-09-03",
    keywords: "Uniroyal Holding bankruptcy, Great Hill Chapter 11, disclosure statement hearing, proposed asbestos trust, asbestos trust effective date",
    about: "Uniroyal Holding and Great Hill Corporation Chapter 11 disclosure statement hearing",
    markdown: `The Uniroyal Holding, Inc. and Great Hill Corporation Chapter 11 cases have a **disclosure statement approval hearing scheduled for September 10, 2026, at 11:30 a.m. EDT**. The official case-agent calendar also lists September 8 deadlines for general and claims bar dates.[1]

That calendar entry is an important procedural milestone. It does **not** establish that a plan has been confirmed, that any proposed asbestos trust has been funded or become effective, or that a claimant can file an asbestos trust claim today.

## What the posted case calendar confirms

Uniroyal Holding, Inc. and Great Hill Corporation each filed voluntary Chapter 11 petitions on July 31, 2026. The cases are pending in the United States Bankruptcy Court for the District of New Jersey under lead case number 26-18668.[1]

The public case-agent site lists the following upcoming milestones:

| Posted event | Date and time | What it indicates |
|---|---|---|
| General bar date | September 8, 2026, 5:00 p.m. EDT | A deadline for certain bankruptcy proofs of claim, as specified by the case notice. |
| Claims bar date | September 8, 2026, 5:00 p.m. EDT | A second calendar entry for claims-related deadlines in the Chapter 11 case. |
| Disclosure statement approval hearing | September 10, 2026, 11:30 a.m. EDT | A hearing on whether the court should approve the disclosure statement for plan solicitation. |

The case-agent page also links a plan and disclosure-statement document category and a disclosure-statement notice. Those materials show that the debtors are moving through the Chapter 11 solicitation process; they do not, by themselves, prove that a future asbestos trust is operational.[1]

## Why a disclosure-statement hearing is not an open trust

In Chapter 11, a disclosure statement is the document intended to provide creditors and other voting parties information about a proposed plan before solicitation. Court approval of a disclosure statement is distinct from plan confirmation, and plan confirmation is distinct from an Effective Date and the practical launch of any contemplated trust.

For a proposed asbestos trust, claimant-facing implementation materials would normally need to identify the operative trust agreement, trust distribution procedures, initial payment percentage if applicable, administrator or trustee, and a claim-submission process. The public Uniroyal materials reviewed for this article do not establish those implementation facts.

> **What is confirmed:** The Chapter 11 case has a posted September 10 disclosure-statement hearing and public calendar deadlines.
>
> **What is not yet established by the materials reviewed:** Plan confirmation, an effective plan, a funded and operating asbestos trust, a trust payment percentage, or a public asbestos trust claim portal.

For general educational background on how established asbestos trust funds operate after bankruptcy proceedings, readers may consult [WikiMesothelioma’s asbestos trust funds overview][2]. That background does not establish the status of the Uniroyal proceedings and should not be treated as a source for their case-specific dates or terms.

## Treat funding estimates with care

Secondary reporting has described a proposed asbestos-trust funding amount of approximately $31.5 million. AsbestosTrusts.org does **not** include that amount in its trust figures. The plan document itself has not been verified here as a primary source for the reported amount, and a proposed funding figure is not the same as a funded operational trust balance.

This distinction matters because a Chapter 11 case can change materially between solicitation, confirmation, effectiveness, and post-confirmation implementation. Until official plan and trust materials establish the relevant milestones, it would be premature to identify Uniroyal as an operating asbestos trust or to report a payment percentage, current assets, or claimant filing terms.

## Where related research fits

The legal status of the Uniroyal restructuring should be evaluated through the court record and official case administration materials. For a separate, citation-verified resource on historical occupational asbestos exposure in American shipbuilding, researchers can consult [Asbestos Atlas][3]. Its shipyard-exposure dataset is relevant to exposure research generally, not to the legal status or funding of the Uniroyal case.

## What to watch next

| Document or development | Why it matters |
|---|---|
| Disclosure statement hearing outcome | Clarifies whether solicitation may proceed. |
| Plan-confirmation order | Identifies whether the court confirms a reorganization plan. |
| Effective-date notice | Establishes whether stated plan conditions have been satisfied or waived. |
| Trust agreement and Trust Distribution Procedure | Supplies the governing structure for any claimant-facing trust. |
| Payment-percentage or claims-administration notice | Establishes how an operational trust will value and process claims. |

The official case-agent website states that it is provided as a convenience and does not contain the complete official Bankruptcy Court record. Accordingly, this article treats the posted calendar as evidence of the case agent’s public schedule while reserving final legal conclusions for the relevant court orders and controlling plan documents.[1]

## Sources and editorial note

This article distinguishes public case-calendar information from unverified secondary funding estimates. It does not provide legal advice or claim-filing advice. It will be updated if court orders or trust-administration documents establish a confirmed plan, effective date, or claimant-facing trust procedures.

[1]: https://omniagentsolutions.com/Uniroyal "Omni Agent Solutions — Uniroyal Holding, Inc. restructuring website and case calendar"
[2]: https://wikimesothelioma.com/wiki/Asbestos_Trust_Funds "WikiMesothelioma — Asbestos Trust Funds"
[3]: https://asbestosatlas.org/ "Asbestos Atlas — U.S. Shipyard Exposure Map"
    `,
  },
  {
    slug: "owens-illinois-payment-percentage-increase",
    title: "Owens-Illinois Trust Payment Percentage Rises to 65%: What the August 2026 Notice Says",
    date: "2026-08-29",
    category: "payment_percentage",
    summary: "The Owens-Illinois Asbestos Personal Injury Trust increased its payment percentage from 50% to 65%, effective August 19, 2026. The Trust’s notice also provides for supplemental payments to eligible claimants who previously received a lower percentage.",
    sourceUrl: "/manus-storage/OI-Trust-Payment-Percentage-Increase-2026-08-19_418b2c7d.pdf",
    sourceLabel: "Owens-Illinois Asbestos Personal Injury Trust — Notice re: O-I Payment Percentage Increase (Aug. 19, 2026)",
    sourceCutoffAt: "2026-08-19",
    keywords: "Owens-Illinois asbestos trust, Paddock Enterprises trust, payment percentage increase, asbestos claim supplemental payment, Trust Distribution Procedures",
    about: "Owens-Illinois Asbestos Personal Injury Trust payment percentage increase effective August 19, 2026",
    relatedTrustSlugs: ["paddock-enterprises-owens-illinois-asbestos-trust"],
    markdown: `The **Owens-Illinois Asbestos Personal Injury Trust** increased its payment percentage from **50% to 65%**, effective **August 19, 2026**. The Trust’s notice says the Trustees approved the change after a payment-percentage review with the Trust Advisory Committee and the Future Claimants’ Representative.[1]

The notice also addresses claimants who previously received payments at a lower percentage. It states that eligible claimants will receive a **supplemental payment** under §4.3 of the Trust Distribution Procedures. The notice is important because it updates the Trust’s payment framework; it does not announce a new trust balance, a new cumulative-payment figure, or a guaranteed recovery for any individual claimant.[1]

## The reported change

| Trust-issued item | Prior public record | Current notice |
|---|---:|---:|
| Payment percentage | 50% | **65%** |
| Effective date | December 2023 installment notice | **August 19, 2026** |
| Payment direction | No increase reflected in the prior record | **Increase** |
| Trust balance | Not publicly posted in the notice | Not newly reported |

AsbestosTrusts.org has updated the Paddock Enterprises (Owens-Illinois) trust record to 65% and identifies the effective date shown in the Trust-issued notice. The update also corrects a former structured-data value of 100%, which did not match the prior 50% notice or the current notice.[1]

## What a payment percentage does—and does not—mean

A payment percentage is a payment-control mechanism used by an asbestos trust. It is applied within the Trust’s governing claims framework; it is not a standalone valuation of a person’s claim and does not replace the Trust Distribution Procedures or the facts needed to evaluate an individual submission. The 65% figure therefore should not be read as a promise that every claimant will receive 65% of a particular figure without reference to the applicable procedures and claim determination.

For general background on how established asbestos trust funds are structured and how payment-percentage frameworks fit into their operations, readers may consult [WikiMesothelioma’s overview of asbestos trust funds][2]. That background resource does not determine the terms, eligibility, or payment outcome of an Owens-Illinois claim; the August 19 Trust notice is the controlling source for this update.[1] [2]

## Supplemental payments described in the notice

The supplemental-payment language matters because it recognizes that some payments may have been made while a lower percentage was in effect. The notice states that the Trust will make supplemental payments under §4.3 of its Trust Distribution Procedures for claimants who received payment at the lower percentage, subject to the procedures that govern that process.[1]

This article intentionally does not attempt to calculate individual supplemental-payment amounts. The notice does not provide an individualized award table, claimant-level eligibility determination, or a universal payment calculation. Those questions depend on the governing procedures and the particulars of a claim.

> **Confirmed by the Trust’s August 19 notice:** The payment percentage increased from 50% to 65%, effective August 19, 2026, and the notice provides for supplemental payments under §4.3 for prior lower-percentage payments.
>
> **Not established by that notice:** A new trust balance, a cumulative amount paid, a claimant’s individual award, or universal eligibility for a supplemental payment.

## What the notice does not change in the public tracker

The payment-percentage change does not supply a current net-asset balance. AsbestosTrusts.org continues to distinguish between a verified payment percentage and an unavailable or unpublished balance rather than treating a payment adjustment as evidence of a new balance.

Similarly, the notice does not provide a new inception-to-date payout total. The tracker does not infer one from the percentage change. This distinction is part of the site’s source-by-source methodology: a document is used only for the figure or fact it actually supports.

## Related research and source boundaries

Owens-Illinois is associated with asbestos exposure history that may arise in broader occupational or product research. For a separate, citation-verified resource on historical U.S. shipyard asbestos exposure, researchers may consult [Asbestos Atlas][3]. That resource is offered as background research only; it does not establish the amount, payment percentage, claim status, or eligibility for an Owens-Illinois trust claim.

The controlling source for this article remains the Trust’s payment-percentage notice. Readers seeking the legal and administrative terms for a potential claim should review the Trust’s governing procedures and obtain qualified advice appropriate to their circumstances.

## Source and editorial note

This article relies on the primary payment-percentage notice retained in the AsbestosTrusts.org source library. It reports the notice’s stated percentage, effective date, approval context, and supplemental-payment reference without extrapolating a new balance, payout total, or individual claimant outcome.

[1]: /manus-storage/OI-Trust-Payment-Percentage-Increase-2026-08-19_418b2c7d.pdf "Owens-Illinois Asbestos Personal Injury Trust, Notice re: O-I Payment Percentage Increase, August 19, 2026"
[2]: https://wikimesothelioma.com/wiki/Asbestos_Trust_Funds "WikiMesothelioma — Asbestos Trust Funds"
[3]: https://asbestosatlas.org/ "Asbestos Atlas — U.S. Shipyard Exposure Map"
    `,
  },
  {
    slug: "vijon-chapter11-talc-trust",
    title: "Vi-Jon’s Chapter 11 Talc Settlement Proposal: What the August 2026 Filing Does—and Does Not—Establish",
    cardTitles: ["Vi-Jon Files Chapter 11 to Channel Talc Claims into 524(g) Trust"],
    date: "2026-09-03",
    category: "court_filing",
    summary: "Vi-Jon, LLC filed Chapter 11 in Delaware on August 2, 2026. Official case materials describe a proposed settlement-trust structure for alleged talc-related claims, subject to Bankruptcy Court approval and other conditions; they do not establish an effective, operating trust or a payment percentage.",
    sourceUrl: "https://omniagentsolutions.com/Vi-Jon",
    sourceLabel: "Omni Agent Solutions — Vi-Jon, LLC official restructuring website",
    sourceCutoffAt: "2026-09-03",
    keywords: "Vi-Jon Chapter 11, Vi-Jon talc claims, Vi-Jon settlement trust, Delaware bankruptcy 26-11216, talc bankruptcy claims process",
    about: "Vi-Jon LLC Chapter 11 filing and proposed talc-related settlement trust",
    markdown: `Vi-Jon, LLC filed a voluntary Chapter 11 petition on **August 2, 2026**, in the U.S. Bankruptcy Court for the District of Delaware, Case No. **26-11216 (MFW)**, before Judge Mary F. Walrath.[1] The public case materials describe a proposed Chapter 11 plan intended to resolve current and future alleged talc-related personal-injury claims through a settlement trust funded by Vi-Jon’s parent-side affiliate, Emprise HPC, LLC.[1] [2]

That proposal is a significant development in the case. It is **not**, however, public confirmation that a court-approved plan is effective, a settlement trust is funded and operating, a payment percentage has been set, or a separate trust claims process is open. This article explains the current public record and the distinctions readers should keep in view.

## What the official materials confirm

Vi-Jon’s official restructuring website states that the debtor entered a Restructuring Support Agreement on July 30, 2026 with Emprise, Emprise HPC, and counsel representing more than 75% of holders of talc-related personal-injury claims. The materials describe a negotiated Chapter 11 plan that would resolve current and future alleged talc-related claims through a settlement trust funded by Emprise HPC, but expressly state that the contemplated plan remains subject to Bankruptcy Court approval and other conditions.[1] [2]

The U.S. Trustee independently identifies Vi-Jon, LLC, Case No. 26-11216 (MFW), as a voluntary Chapter 11 case in the District of Delaware in its August 4 committee-solicitation notice.[3]

| Confirmed public item | What the record says | What it does **not** establish |
|---|---|---|
| Chapter 11 filing | Vi-Jon filed August 2, 2026 in Delaware, Case No. 26-11216 (MFW). | That a settlement trust has become effective. |
| Proposed settlement structure | The RSA contemplates resolving alleged talc-related claims through a settlement trust. | Court approval, effectiveness, or final terms of that proposal. |
| Proposed plan support | The official FAQ says counsel representing more than 75% of talc-related personal-injury claim holders joined the RSA. | A completed vote, confirmation order, or final distribution procedure. |
| Affiliate participation | Emprise and multiple affiliates are identified as non-debtors. | That the non-debtors’ proposed contributions are final, unconditional trust assets. |

## Funding described in the proposal

The official FAQ says Emprise HPC agreed, subject to Bankruptcy Court approval, to contribute approximately **$32 million when the plan takes effect**. It describes $25 million of that amount as intended to fund the proposed settlement trust for talc claimants and approximately $7 million as intended for remaining Chapter 11 process costs.[2]

Those are stated components of a proposed, court-supervised restructuring—not a current trust-balance report. AsbestosTrusts.org therefore does not include the proposed $25 million contribution in the active-trust database, the documented asset floor, or any cumulative-payout calculation. A proposed contribution cannot substitute for a filed financial statement of an operational trust.[1] [2]

> **Confirmed:** Vi-Jon is in Chapter 11, and its public case materials describe a proposed settlement trust for alleged talc-related claims.
>
> **Not yet established by the materials reviewed:** A confirmed and effective plan, funded operating settlement trust, Trust Distribution Procedure, payment percentage, or separate settlement-trust claim-submission process.

## Claims, the automatic stay, and the posted bankruptcy process

The official FAQ says the Chapter 11 filing does not by itself dismiss pending state-court claims; instead, the automatic stay generally pauses litigation against Vi-Jon unless the Bankruptcy Court orders otherwise.[2] It also says that any future claim-treatment, notice, and submission requirements will be governed by Bankruptcy Court-approved procedures.[2]

The case website currently includes a general Chapter 11 proof-of-claim function and lists a September 26, 2026 general bar date. The FAQ, however, says that no bar date had been set at the time that FAQ was published and instructs claimants to follow later court-approved notices and orders.[1] [2] The appropriate reading is therefore narrow: these materials concern the pending bankruptcy process. They do **not** announce that a proposed talc settlement trust has opened, and they do not provide the terms for a separate trust claim.

Readers with case-specific questions should consult the notices and orders issued in the bankruptcy case and obtain advice from counsel of their choice. This article does not provide legal advice or claim-filing instructions.

## Why a proposed settlement trust is not the same as an operating trust

An operational claimant-facing trust ordinarily requires implementation materials: an effective plan, trust agreement, trustee or administrator notice, governing distribution procedures, a payment percentage if applicable, and claim-submission instructions. The public Vi-Jon materials reviewed for this article do not establish those facts.[1] [2]

For general educational background on established asbestos trust-fund structures, readers may consult [WikiMesothelioma’s asbestos trust funds overview][4]. That resource is not a source for Vi-Jon’s case-specific filings, funding terms, or claim procedures. For distinct, citation-verified background on historical occupational asbestos exposure in U.S. shipbuilding, readers may consult [Asbestos Atlas][5]. It is a separate exposure-research resource and does not establish the status, funding, or legal effect of the Vi-Jon Chapter 11 case.

## What to watch next

| Future document or event | Why it matters |
|---|---|
| Bankruptcy Court orders on the plan or disclosure statement | May clarify whether the proposed restructuring can move forward. |
| Confirmation order and notice of effective date | Would distinguish a proposed plan from an implemented restructuring. |
| Trust agreement and administrator/trustee notice | Would identify the legal entity and responsible parties for any claimant-facing trust. |
| Trust Distribution Procedure or payment-percentage notice | Would provide a governing payment framework if a trust becomes operational. |
| Court-approved claims notices and forms | Would establish any applicable bankruptcy or later trust-submission process. |

Until these materials are available, AsbestosTrusts.org will track Vi-Jon as a **pending Chapter 11 matter with a proposed settlement-trust structure**, not as an operating trust. The site will not assign Vi-Jon a payment percentage, current trust assets, or cumulative payments based on the proposal alone.

## Sources and editorial note

This article relies on the public restructuring website, the official FAQ, and the U.S. Trustee notice cited below. The debtor’s and case agent’s descriptions are treated as case-status materials and are not substituted for court-approved implementation documents. The article will be updated when a court order or trust-administration notice establishes a confirmed plan, effective date, operational trust, or claimant-facing procedures.

[1]: https://omniagentsolutions.com/Vi-Jon "Omni Agent Solutions — Vi-Jon, LLC restructuring website"
[2]: https://cases.omniagentsolutions.com/content/index?clientid=3792&vid=817070 "Vi-Jon, LLC — Master Q&A: Vi-Jon Chapter 11"
[3]: https://www.justice.gov/ust/media/1455901/dl?inline "U.S. Trustee, District of Delaware — Vi-Jon, LLC Case No. 26-11216 (MFW), committee-solicitation notice"
[4]: https://wikimesothelioma.com/wiki/Asbestos_Trust_Funds "WikiMesothelioma — Asbestos Trust Funds"
[5]: https://asbestosatlas.org/ "Asbestos Atlas — U.S. Shipyard Exposure Map"
`,
  },
  {
    slug: "bestwall-scotus-cert-denial",
    title: "Supreme Court Declines Bestwall Appeal: What the June 2026 Denial Means for the Pending Chapter 11 Case",
    date: "2026-09-03",
    category: "court_filing",
    summary: "The Supreme Court denied the asbestos claimants’ Bestwall certiorari petition on June 1, 2026. The denial leaves the Chapter 11 case active, but it does not create, fund, or open an asbestos trust for claims.",
    sourceUrl: "https://www.supremecourt.gov/docket/docketfiles/html/public/25-1013.html",
    sourceLabel: "U.S. Supreme Court — Official Committee of Asbestos Claimants of Bestwall LLC v. Bestwall LLC, No. 25-1013",
    sourceCutoffAt: "2026-09-03",
    keywords: "Bestwall LLC bankruptcy, Bestwall Supreme Court denial, asbestos trust formation, Section 524(g), Georgia-Pacific Chapter 11",
    about: "Bestwall LLC Supreme Court certiorari denial and ongoing Chapter 11 case",
    markdown: `The U.S. Supreme Court **denied the petition for certiorari on June 1, 2026** in *Official Committee of Asbestos Claimants of Bestwall LLC v. Bestwall LLC*, No. 25-1013.[1] The petition asked the Court to review litigation connected to Bestwall LLC’s Chapter 11 case and the Fourth Circuit proceedings below.

The entry is a material legal development, but its practical meaning is narrow: the denial ends that request for Supreme Court review. It does **not** itself confirm a reorganization plan, establish a §524(g) asbestos trust, set a payment percentage, fund a trust, or open a claimant filing process.

## What the Supreme Court docket establishes

The Supreme Court’s public docket identifies the petitioner as the Official Committee of Asbestos Claimants of Bestwall LLC and the respondent as Bestwall LLC. It records that the Court distributed the matter for its May 28, 2026 conference and entered “Petition DENIED” on June 1, 2026.[1]

| Docket item | Confirmed public record |
|---|---|
| Case | *Official Committee of Asbestos Claimants of Bestwall LLC v. Bestwall LLC*, No. 25-1013 |
| Supreme Court action | Petition for certiorari denied |
| Date of denial | June 1, 2026 |
| Direct effect | The Supreme Court review request ended; the denial itself does not create a trust or claims program |

The Court’s docket is the controlling source for the denial date and disposition. It should not be read as a finding about a claimant’s eligibility, an individual claim value, or the terms of any future trust.[1]

## Bestwall’s Chapter 11 case remains active

Bestwall’s public case-administration site continues to identify the matter as an active Chapter 11 case in the Western District of North Carolina, Charlotte Division, Case No. 17-31795. The public docket displayed filings through September 3, 2026, showing that the bankruptcy case remains procedurally active.[2]

An active bankruptcy docket is not the same thing as an operating asbestos trust. A claimant-facing trust would require its own governing and implementation materials. As of the source cutoff for this article, the public materials reviewed do not establish a confirmed and effective §524(g) trust, a funded trust balance, a Trust Distribution Procedure, a payment percentage, or a public asbestos-trust claims portal.[1] [2]

> **Confirmed:** The Supreme Court denied the certiorari petition, and Bestwall’s Chapter 11 docket remains active.
>
> **Not established by the sources reviewed:** An effective plan, funded operating asbestos trust, payment percentage, trust assets, or an open asbestos-trust claim-submission process.

## Why the distinction matters

An asbestos bankruptcy case can involve several separate milestones: a Chapter 11 filing, a disclosure statement, plan confirmation, an effective date, trust funding, adoption of distribution procedures, and the opening of a claims process. The existence of litigation about a possible future §524(g) channeling injunction does not establish that all of those steps have occurred.

For general background on how already-established asbestos trust funds are structured, readers may consult [WikiMesothelioma’s asbestos trust funds overview][3]. That resource is educational context only; it does not source the Bestwall docket, the Supreme Court result, or the status of any Bestwall trust.

For separate historical research on occupational asbestos exposure in U.S. shipbuilding, readers may consult [Asbestos Atlas][4]. It is a distinct exposure-research resource and does not establish Bestwall’s legal status, trust funding, or claim procedures.

## What to watch next

| Future development | Why it would matter |
|---|---|
| Bankruptcy court plan-confirmation order | Could establish whether the court confirms a proposed reorganization plan. |
| Notice of effective date | Would indicate whether stated conditions to a confirmed plan have been satisfied or waived. |
| Trust agreement and trustee or administrator notice | Would identify the entity and parties responsible for any claimant-facing trust. |
| Trust Distribution Procedure or payment-percentage notice | Would supply the payment framework for an operational trust. |
| Claim form or public claims portal | Would establish whether and how asbestos claimants may submit claims. |

Until those primary materials are available, AsbestosTrusts.org will continue to treat Bestwall as a **watch-list Chapter 11 matter**, not as an operating trust record. The tracker will not add payment, asset, or payout figures merely because a Supreme Court petition was denied or because the bankruptcy docket has continued activity.

## Sources and editorial note

This article is limited to the public Supreme Court and case-administration materials cited below. It does not provide legal advice, determine claim eligibility, or predict the terms or timing of any future Bestwall trust. The article will be updated if future court or trust-administration materials establish an effective plan or claimant-facing procedures.

[1]: https://www.supremecourt.gov/docket/docketfiles/html/public/25-1013.html "U.S. Supreme Court, Docket No. 25-1013 — Official Committee of Asbestos Claimants of Bestwall LLC v. Bestwall LLC"
[2]: https://bankruptcy.angeiongroup.com/Clients/bw/Dockets "Bestwall LLC public case-administration docket, W.D.N.C. Case No. 17-31795"
[3]: https://wikimesothelioma.com/wiki/Asbestos_Trust_Funds "WikiMesothelioma — Asbestos Trust Funds"
[4]: https://asbestosatlas.org/ "Asbestos Atlas — U.S. Shipyard Exposure Map"
`,
  },
];

export const NEWS_BRIEFS_BY_SLUG = Object.fromEntries(
  NEWS_BRIEFS.map((brief) => [brief.slug, brief])
) as Record<string, NewsBrief>;

export const NEWS_BRIEFS_BY_CARD_TITLE = Object.fromEntries(
  NEWS_BRIEFS.flatMap((brief) =>
    (brief.cardTitles ?? []).map((cardTitle) => [cardTitle, brief])
  )
) as Record<string, NewsBrief>;

/**
 * Detailed articles are deliberately related to trust pages only through an
 * explicit, reviewed trust-slug declaration. Avoiding name matching prevents
 * a company reference or shared bankruptcy term from surfacing unrelated legal
 * content on a trust record.
 */
export function getNewsBriefsForTrust(trustSlug: string): NewsBrief[] {
  return NEWS_BRIEFS.filter((brief) => brief.relatedTrustSlugs?.includes(trustSlug));
}

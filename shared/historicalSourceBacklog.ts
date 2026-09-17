export type HistoricalSourceBacklogItem = {
  rank: number;
  trustSlug: string;
  trustName: string;
  focus: string;
  historicalCutoff: string;
  currentEvidence: string;
  publicValue: string;
  noChargeResearchPath: string;
  expectedMinutes: number;
  archiveRecheckOn: string;
};

/**
 * A reviewed research queue, not a statement of fact. Each entry identifies
 * the source gap that must be resolved before the tracker changes a figure,
 * confidence label, or historical narrative.
 */
export const HISTORICAL_SOURCE_BACKLOG: readonly HistoricalSourceBacklogItem[] = [
  {
    rank: 1,
    trustSlug: "pittsburgh-corning-asbestos-pi-settlement-trust",
    trustName: "Pittsburgh Corning Corporation Asbestos PI Trust",
    focus: "Recover a filed annual report or court account that supports or corrects the qualified 2022 secondary cumulative-payment component.",
    historicalCutoff: "2022 secondary component; filed document remains unavailable",
    currentEvidence: "The official PCC documents page does not list annual reports. Public CourtListener docket metadata confirms annual-report-and-account notice entries for fiscal years 2018–2023, including FY2022 (Doc. 10942) and FY2023 (Doc. 10943), but the listed report attachments remain unavailable through the reviewed no-charge routes. The tracker therefore retains its qualified secondary component pending an accessible filed annual report.",
    publicValue: "Highest payout-tier impact; a filed record could upgrade, correct, or remove a material secondary component.",
    noChargeResearchPath: "Check the official trust site and document library; CourtListener/RECAP docket and community-request status; public bankruptcy-docket repositories; Internet Archive captures. Record inaccessible documents rather than purchasing them.",
    expectedMinutes: 35,
    archiveRecheckOn: "2026-09-24",
  },
  {
    rank: 2,
    trustSlug: "celotex-asbestos-settlement-trust",
    trustName: "Celotex Asbestos Settlement Trust",
    focus: "Locate a public primary report after the filed 2006 PI-pool figure and reconcile the qualified post-2006 secondary-growth component.",
    historicalCutoff: "Filed PI-pool figure through 2006; qualified secondary growth through 2021",
    currentEvidence: "Public court-docket indexes corroborate the April 28, 2026 FY2025 annual-report entry and the August 18, 2026 approval order, but neither the report nor the order PDF is publicly retrievable in the no-charge sources reviewed. The tracker therefore retains historical and secondary labels rather than treating any FY2025 figure as current.",
    publicValue: "High; a newer primary report would materially improve the age and confidence of the trust’s payout history.",
    noChargeResearchPath: "Check the official trust site and administrator materials; CourtListener/RECAP; public bankruptcy-docket mirrors; Internet Archive; and free court-record indexes. Do not attempt a paid PACER pull.",
    expectedMinutes: 35,
    archiveRecheckOn: "2026-09-24",
  },
  {
    rank: 3,
    trustSlug: "owens-corning-fibreboard-asbestos-pi-trust",
    trustName: "Owens Corning/Fibreboard Asbestos PI Trust",
    focus: "Find a public filed report that advances the 2009 filed cumulative-payment floor or independently verifies the qualified post-2009 secondary-growth component.",
    historicalCutoff: "Filed cumulative figure through 2009; qualified secondary growth through 2022",
    currentEvidence: "The official trust resource and documents pages provide current payment notices, TDP materials, and claimant resources, but no annual-report or trustee-account download. Trust Online is login-gated, and the public Internet Archive index returned no matching annual-report PDF capture. No direct filed report was located through the reviewed no-charge court-index route. A secondary page describes 2022 annual-report activity, but it is not controlling evidence. The tracker therefore retains the filed 2009 amount as a historical floor and the later growth component as qualified pending an accessible filed report.",
    publicValue: "High; two subaccounts and a large historical payment base make a primary update especially useful for accuracy and presentation.",
    noChargeResearchPath: "Search the official administrator resource pages and trust notices; CourtListener/RECAP and public docket attachments; Internet Archive; and direct public annual-report libraries. Preserve separate OC and FB payment-rate treatment.",
    expectedMinutes: 30,
    archiveRecheckOn: "2026-09-24",
  },
  {
    rank: 4,
    trustSlug: "armstrong-world-industries-asbestos-pi-trust",
    trustName: "Armstrong World Industries Asbestos PI Trust",
    focus: "Locate a newer publicly accessible annual report or claim account after the filed FY2014 historical cumulative-payment figure.",
    historicalCutoff: "Filed cumulative figure through 2014",
    currentEvidence: "The official trust documents page does not list an annual report after 2014, and its public WordPress media and search indexes return only the 2013 and 2014 annual-report files. A public docket index identifies FY2025 annual-report Notice of Service Doc. 11008, with Annual Report, Audited Financial Statements, and Claims Summary attachments, but does not provide those attachments through the reviewed no-charge path. The reviewed Internet Archive index also identifies no newer annual-report PDF capture. The tracker therefore retains the FY2014 figure as a historical floor pending an accessible controlling filing.",
    publicValue: "High; a 2014 floor is materially stale and a public later filing would improve payout chronology.",
    noChargeResearchPath: "Search official administrator notices and public document libraries, CourtListener/RECAP, no-charge docket mirrors, and archive captures. Record court-side access limitations without inferring a current value.",
    expectedMinutes: 25,
    archiveRecheckOn: "2026-09-24",
  },
  {
    rank: 5,
    trustSlug: "united-states-gypsum-usg-asbestos-trust",
    trustName: "United States Gypsum (USG) Asbestos Trust",
    focus: "Recover a public filed cumulative-payment report after the 2008 historical figure and reconcile it with current payment-percentage notices.",
    historicalCutoff: "Filed cumulative figure through 2008",
    currentEvidence: "The tracker has a source-linked 2008 figure and separately current payment-percentage notices. The official document library and public WordPress media/search indexes expose current procedures and notices but no annual report or trustee account. Public CourtListener docket metadata identifies later Annual Report and Claims Summary filings, including Doc. 12842 (2018), Doc. 12844 (2020), and Doc. 12846 (2021), with financial-statement attachments, but the reviewed attachments are not in RECAP and remain unavailable through no-charge routes. The reviewed Internet Archive index did not surface an annual-report PDF capture. The tracker therefore retains the 2008 figure as a historical floor pending an accessible controlling filing.",
    publicValue: "High; this is the oldest filed floor in the current top-five worklist and should not be implied to be current.",
    noChargeResearchPath: "Search the official trust site, payment notices, CourtListener/RECAP, public docket indexes, and archive snapshots. Treat payment-rate notices as rate evidence only, not as evidence of cumulative payouts.",
    expectedMinutes: 25,
    archiveRecheckOn: "2026-09-24",
  },
  {
    rank: 6,
    trustSlug: "dii-industries-halliburton-harbison-walker",
    trustName: "DII Industries, LLC Asbestos PI Trust",
    focus: "Seek the missing FY2005–FY2013 annual-report sequence needed to convert the documented FY2014–FY2025 subtotal into an inception-to-date series.",
    historicalCutoff: "Documented per-year subtotal FY2014–FY2025; early years unresolved",
    currentEvidence: "The official annual-report archive begins with FY2014 and supplies a documented 12-year cash-basis subtotal, but not the FY2005–FY2013 sequence needed for a complete cumulative figure. A public Internet Archive index likewise begins with FY2014 annual-report captures, and reviewed public docket indexes identify the bankruptcy case but do not provide the missing report attachments through no-charge routes. The tracker therefore retains the FY2014–FY2025 subtotal as a bounded period result rather than an inception-to-date cumulative-paid figure.",
    publicValue: "Medium-high; a complete no-charge series would add a meaningful bottom-up historical component.",
    noChargeResearchPath: "Review the official report archive, public docket indexes and attachments, Internet Archive snapshots, and free court repositories. Do not sum incomplete years into an inception-to-date field.",
    expectedMinutes: 40,
    archiveRecheckOn: "2026-09-27",
  },
  {
    rank: 7,
    trustSlug: "g-i-holdings-gaf-asbestos-pi-settlement-trust",
    trustName: "G-I Holdings Inc. Asbestos Personal Injury Settlement Trust",
    focus: "Locate the filed document underlying the qualified 2022 cumulative-payment component.",
    historicalCutoff: "Qualified secondary-citing-filed component through 2022",
    currentEvidence: "The component remains qualified rather than filed because a direct underlying report has not been retained in the public source library. The official Verus-hosted trust Resources page exposes claim forms, TDP materials, and payment or policy notices, including a December 1, 2022 payment-percentage notice, but no annual report, trustee account, or audited financial statements. Public CourtListener metadata identifies special-purpose financial-statement and auditor-report filings through the years ended 2018 and 2017, but the reviewed entries require paid PACER retrieval and do not supply the underlying report content through no-charge RECAP. The reviewed Internet Archive index likewise surfaced procedures and notices, not a 2022 annual report. The qualified component therefore remains unchanged pending an accessible underlying filing.",
    publicValue: "Medium; upgrading or revising a discrete qualified component improves the bottom-up method’s transparency.",
    noChargeResearchPath: "Search official trust or administrator resources, CourtListener/RECAP, public docket repositories, and archive captures. Maintain the secondary label unless the underlying filing is obtained.",
    expectedMinutes: 30,
    archiveRecheckOn: "2026-09-24",
  },
  {
    rank: 8,
    trustSlug: "maremont-asbestos-pi-trust",
    trustName: "Maremont Corporation Asbestos Disease Compensation Trust",
    focus: "Recover official FY2019–FY2021 reports and determine whether the annual payment series can be completed without confusing a partial subtotal with inception-to-date payments.",
    historicalCutoff: "FY2022–FY2025 official annual reports: $11,512,985 cash-payment subtotal; partial four-year series, not inception-to-date",
    currentEvidence: "Official Maremont annual reports for FY2022 (DN 371), FY2023 (DN 372), FY2024 (DN 373), and FY2025 (DN 374) provide annual cash payments totaling $11,512,985 for those four years. The reports provide inception-to-date claim counts but no inception-to-date dollar amount. Public docket indexes identify earlier annual-report filings, but FY2019–FY2021 reports were not recovered in the reviewed no-charge archive paths. The tracker therefore remains without a cumulative-paid field and does not present the four-year subtotal as a total paid since inception.",
    publicValue: "Medium; the recovered four-year official series improves historical transparency, but only a complete and reproducible sequence can support a broader bottom-up calculation.",
    noChargeResearchPath: "Continue with the official administrator report archive, public docket indexes and attachments, and Internet Archive captures. Record partial years separately and stop short of an inception-to-date figure unless the complete series is recovered.",
    expectedMinutes: 25,
    archiveRecheckOn: "2026-09-25",
  },
];

export const MONTHLY_HISTORICAL_SOURCE_LIMIT = 5;
export const MONTHLY_HISTORICAL_SOURCE_MINUTES = 150;

export function monthlyHistoricalSourceWorklist(limit = MONTHLY_HISTORICAL_SOURCE_LIMIT) {
  return HISTORICAL_SOURCE_BACKLOG.slice(0, limit);
}

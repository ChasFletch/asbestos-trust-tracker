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
    currentEvidence: "The tracker retains a qualified secondary-citing-filed component pending an accessible primary annual report. Prior public and no-charge court/archive searches did not recover the requested filing.",
    publicValue: "Highest payout-tier impact; a filed record could upgrade, correct, or remove a material secondary component.",
    noChargeResearchPath: "Check the official trust site and document library; CourtListener/RECAP docket and community-request status; public bankruptcy-docket repositories; Internet Archive captures. Record inaccessible documents rather than purchasing them.",
    expectedMinutes: 35,
  },
  {
    rank: 2,
    trustSlug: "celotex-asbestos-settlement-trust",
    trustName: "Celotex Asbestos Settlement Trust",
    focus: "Locate a public primary report after the filed 2006 PI-pool figure and reconcile the qualified post-2006 secondary-growth component.",
    historicalCutoff: "Filed PI-pool figure through 2006; qualified secondary growth through 2021",
    currentEvidence: "The FY2025 court docket entry is known but account-restricted; the public tracker uses clear historical and secondary labels rather than treating the figure as current.",
    publicValue: "High; a newer primary report would materially improve the age and confidence of the trust’s payout history.",
    noChargeResearchPath: "Check the official trust site and administrator materials; CourtListener/RECAP; public bankruptcy-docket mirrors; Internet Archive; and free court-record indexes. Do not attempt a paid PACER pull.",
    expectedMinutes: 35,
  },
  {
    rank: 3,
    trustSlug: "owens-corning-fibreboard-asbestos-pi-trust",
    trustName: "Owens Corning/Fibreboard Asbestos PI Trust",
    focus: "Find a public filed report that advances the 2009 filed cumulative-payment floor or independently verifies the qualified post-2009 secondary-growth component.",
    historicalCutoff: "Filed cumulative figure through 2009; qualified secondary growth through 2022",
    currentEvidence: "The tracker labels the filed 2009 amount as a historical floor and keeps the later growth component qualified pending a directly accessible filed report.",
    publicValue: "High; two subaccounts and a large historical payment base make a primary update especially useful for accuracy and presentation.",
    noChargeResearchPath: "Search the official administrator resource pages and trust notices; CourtListener/RECAP and public docket attachments; Internet Archive; and direct public annual-report libraries. Preserve separate OC and FB payment-rate treatment.",
    expectedMinutes: 30,
  },
  {
    rank: 4,
    trustSlug: "armstrong-world-industries-asbestos-pi-trust",
    trustName: "Armstrong World Industries Asbestos PI Trust",
    focus: "Locate a newer publicly accessible annual report or claim account after the filed FY2014 historical cumulative-payment figure.",
    historicalCutoff: "Filed cumulative figure through 2014",
    currentEvidence: "The FY2014 annual-report figure is source-linked and presented as a historical floor; newer annual-report access has been identified as court-restricted or PACER-only.",
    publicValue: "High; a 2014 floor is materially stale and a public later filing would improve payout chronology.",
    noChargeResearchPath: "Search official administrator notices and public document libraries, CourtListener/RECAP, no-charge docket mirrors, and archive captures. Record court-side access limitations without inferring a current value.",
    expectedMinutes: 25,
  },
  {
    rank: 5,
    trustSlug: "united-states-gypsum-usg-asbestos-trust",
    trustName: "United States Gypsum (USG) Asbestos Trust",
    focus: "Recover a public filed cumulative-payment report after the 2008 historical figure and reconcile it with current payment-percentage notices.",
    historicalCutoff: "Filed cumulative figure through 2008",
    currentEvidence: "The tracker has a source-linked 2008 figure and a separately current payment-percentage notice; the annual-report history remains court-restricted.",
    publicValue: "High; this is the oldest filed floor in the current top-five worklist and should not be implied to be current.",
    noChargeResearchPath: "Search the official trust site, payment notices, CourtListener/RECAP, public docket indexes, and archive snapshots. Treat payment-rate notices as rate evidence only, not as evidence of cumulative payouts.",
    expectedMinutes: 25,
  },
  {
    rank: 6,
    trustSlug: "dii-industries-halliburton-harbison-walker",
    trustName: "DII Industries, LLC Asbestos PI Trust",
    focus: "Seek the missing FY2005–FY2013 annual-report sequence needed to convert the documented FY2014–FY2025 subtotal into an inception-to-date series.",
    historicalCutoff: "Documented per-year subtotal FY2014–FY2025; early years unresolved",
    currentEvidence: "The current annual-report archive supplies a 12-year cash-basis subtotal but not the early-report sequence needed for a complete cumulative figure.",
    publicValue: "Medium-high; a complete no-charge series would add a meaningful bottom-up historical component.",
    noChargeResearchPath: "Review the official report archive, public docket indexes and attachments, Internet Archive snapshots, and free court repositories. Do not sum incomplete years into an inception-to-date field.",
    expectedMinutes: 40,
  },
  {
    rank: 7,
    trustSlug: "g-i-holdings-gaf-asbestos-pi-settlement-trust",
    trustName: "G-I Holdings Inc. Asbestos Personal Injury Settlement Trust",
    focus: "Locate the filed document underlying the qualified 2022 cumulative-payment component.",
    historicalCutoff: "Qualified secondary-citing-filed component through 2022",
    currentEvidence: "The component remains qualified rather than filed because a direct underlying report has not been retained in the public source library.",
    publicValue: "Medium; upgrading or revising a discrete qualified component improves the bottom-up method’s transparency.",
    noChargeResearchPath: "Search official trust or administrator resources, CourtListener/RECAP, public docket repositories, and archive captures. Maintain the secondary label unless the underlying filing is obtained.",
    expectedMinutes: 30,
  },
  {
    rank: 8,
    trustSlug: "maremont-asbestos-pi-trust",
    trustName: "Maremont Corporation Asbestos Disease Compensation Trust",
    focus: "Determine whether free annual reports before FY2025 support a complete, clearly scoped bottom-up payment series.",
    historicalCutoff: "FY2025 reports per-year payments and inception-to-date claim counts, not cumulative dollars",
    currentEvidence: "The current record intentionally remains without a cumulative-paid field because a single annual report does not provide an inception-to-date payment amount.",
    publicValue: "Medium; a complete series is useful only if enough free years can be documented without mixing claim counts and payments.",
    noChargeResearchPath: "Review the official report archive and no-charge court/administrator repositories. Stop if the archive cannot establish a complete, reproducible time series within the monthly cap.",
    expectedMinutes: 25,
  },
];

export const MONTHLY_HISTORICAL_SOURCE_LIMIT = 5;
export const MONTHLY_HISTORICAL_SOURCE_MINUTES = 150;

export function monthlyHistoricalSourceWorklist(limit = MONTHLY_HISTORICAL_SOURCE_LIMIT) {
  return HISTORICAL_SOURCE_BACKLOG.slice(0, limit);
}

export type FigureProvenanceCategory = "assets" | "payouts" | "methodology";
export type EvidenceClass = "a" | "b" | "c" | "audit";

export type ProvenanceSource = {
  label: string;
  url: string;
  evidenceClass: EvidenceClass;
  detail: string;
};

export type FigureProvenanceEntry = {
  id: string;
  date: string;
  category: FigureProvenanceCategory;
  figure: string;
  priorValue: string;
  currentValue: string;
  headline: string;
  explanation: string;
  sources: ProvenanceSource[];
  commit?: string;
};

const repo = "https://github.com/ChasFletch/asbestos-trust-tracker";
const changelogUrl = `${repo}/blob/main/docs/figure-provenance-changelog.md`;

export const figureProvenance: FigureProvenanceEntry[] = [
  {
    id: "2026-09-01-abb-lummus-filed-assets",
    date: "2026-09-01",
    category: "assets",
    figure: "Documented remaining-assets floor",
    priorValue: "$16,018,528,449 across 42 records",
    currentValue: "$16,033,489,279 across 43 records",
    headline: "ABB Lummus’s filed FY2025 annual report completed a previously unquantified trust record.",
    explanation:
      "The filed ABB Lummus FY2025 annual report reports $14,960,830 in net assets available for the payment of claims as of December 31, 2025. Adding that primary figure raised the exact documented floor by $14,960,830. The floor remains a mixed-date sum, not a current census of all U.S. asbestos trust assets.",
    sources: [
      {
        label: "ABB Lummus FY2025 annual report",
        url: "https://abblummustrust.org/assets/uploadedFiles/04e9a249-cf90-4bfd-a2cb-21a0016473ad.pdf",
        evidenceClass: "a",
        detail: "Bankr. D. Del. 06-10401 (MFW), Doc 529; filed April 28, 2026; Exhibit A, page 15 reports $14,960,830 in net assets available for claims",
      },
      {
        label: "Trust database",
        url: "/trusts",
        evidenceClass: "audit",
        detail: "Current ABB Lummus record and exact aggregate reconciliation",
      },
    ],
    commit: "7ff0adb",
  },
  {
    id: "2026-08-29-manville-q2-assets",
    date: "2026-08-29",
    category: "assets",
    figure: "Documented remaining-assets floor",
    priorValue: "$15,987,271,944",
    currentValue: "$16,018,528,449",
    headline: "Manville’s Q2 filing added a current, filed net-equity figure to the asset floor.",
    explanation:
      "Manville’s filed June 30, 2026 statement increased its net claimants’ equity component from $539,260,000 to $570,516,505. The exact floor rose by $31,256,505; it remains a mixed-date sum rather than an actuarial estimate or a current census.",
    sources: [
      {
        label: "Manville Q2 2026 financial statements",
        url: "/manus-storage/Manville-Q2-2026-Financial-Statements-Doc4480_0eacb16f.pdf",
        evidenceClass: "a",
        detail: "S.D.N.Y. 82-11656, Doc 4480; filed July 27, 2026; page 6 reports $570,516,505 in net claimants’ equity",
      },
      {
        label: "Manville trust detail",
        url: "/trusts/manville-personal-injury-settlement-trust",
        evidenceClass: "audit",
        detail: "Current record, source label, and as-of date",
      },
    ],
  },
  {
    id: "2026-08-29-oi-payment-percentage",
    date: "2026-08-29",
    category: "methodology",
    figure: "Owens-Illinois payment percentage",
    priorValue: "50% notice; erroneous structured 100% field",
    currentValue: "65%, effective August 19, 2026",
    headline: "A filed O-I notice corrected the Paddock record and documented a payment-percentage increase.",
    explanation:
      "The primary notice states that the Trustees approved an increase from 50% to 65%, effective August 19, 2026, and provides for supplemental payments for claimants previously paid at a lower percentage. The tracker now reflects the notice rather than the prior inconsistent 100% structured value.",
    sources: [
      {
        label: "O-I payment-percentage increase notice",
        url: "/manus-storage/OI-Trust-Payment-Percentage-Increase-2026-08-19_418b2c7d.pdf",
        evidenceClass: "a",
        detail: "Trust-issued notice dated August 19, 2026; 50% to 65% increase and TDP §4.3 supplemental-payment language",
      },
      {
        label: "Paddock trust detail",
        url: "/trusts/paddock-enterprises-owens-illinois-asbestos-trust",
        evidenceClass: "audit",
        detail: "Current payment percentage, effective date, and primary source panel",
      },
    ],
  },
  {
    id: "2026-08-16-provenance-sync",
    date: "2026-08-16",
    category: "methodology",
    figure: "Public figure definitions and claimant-data caveat",
    priorValue: "Stale display fallbacks and no dedicated claimant-data explanation",
    currentValue: "Current figures synchronized; “Measured Void” methodology published",
    headline: "The site-wide display layer was synchronized with the current data record.",
    explanation:
      "Homepage fallbacks, the FAQ, crawler guidance, and the payment-percentage range were rechecked against the 55-record dataset. A new per-claimant section documents that no public dataset can calculate a typical claimant’s cross-trust filings or total recovery.",
    sources: [
      {
        label: "Methodology: Per-Claimant Statistics",
        url: "/methodology",
        evidenceClass: "audit",
        detail: "RAND, Garlock, Ableman, and ILR limitations and source context",
      },
      {
        label: "Display-layer synchronization record",
        url: changelogUrl,
        evidenceClass: "audit",
        detail: "FAQ, crawler guidance, and fallback reconciliation",
      },
    ],
    commit: "81154ec",
  },
  {
    id: "2026-08-16-assets-coverage",
    date: "2026-08-16",
    category: "assets",
    figure: "Documented remaining-assets floor",
    priorValue: "$15,967,208,224",
    currentValue: "$15,987,271,944",
    headline: "Two additional trust records expanded the documented asset floor.",
    explanation:
      "Hercules Chemical and United Gilsonite (UGL) added $20,063,720 in located FY2022 asset figures. The tracker expanded to 55 records, 42 with a located asset figure. The total remains a documented floor, not a current census.",
    sources: [
      {
        label: "Hercules and UGL verification record",
        url: changelogUrl,
        evidenceClass: "b",
        detail: "Research corpus followup_dim08, citing FY2022 trust reporting",
      },
      {
        label: "Hercules trust detail",
        url: "/trusts/hercules-chemical-co-asbestos-settlement-trust",
        evidenceClass: "b",
        detail: "2.0% payment percentage and $4,018,899 assets",
      },
      {
        label: "UGL trust detail",
        url: "/trusts/united-gilsonite-ugl-asbestos-pi-trust",
        evidenceClass: "b",
        detail: "3.35% standard-claim percentage and $16,044,821 assets",
      },
    ],
    commit: "81154ec",
  },
  {
    id: "2026-08-13-bw-promotion",
    date: "2026-08-13",
    category: "payouts",
    figure: "Cumulative payouts since 1988",
    priorValue: "$29,981,797,653",
    currentValue: "$30,020,097,653",
    headline: "Babcock & Wilcox moved from a secondary floor into the filed tier.",
    explanation:
      "A filed FY2023 Annual Report and Account established an approximately $1.9783B inception-to-date Babcock & Wilcox figure. The filed tier increased from 11 to 12 trusts while the qualified secondary tier was reconciled downward to avoid double counting.",
    sources: [
      {
        label: "B&W FY2023 Annual Report and Account",
        url: "/manus-storage/babcock-wilcox-fy2023-annual-report-doc7876_2e0c8d40.pdf",
        evidenceClass: "a",
        detail: "E.D. La. 00-10992, Doc 7876-1; filed April 29, 2024",
      },
      {
        label: "B&W figure-change record",
        url: changelogUrl,
        evidenceClass: "audit",
        detail: "Tier reconciliation and calculation explanation",
      },
    ],
    commit: "41def537",
  },
  {
    id: "2026-08-12-reclassification",
    date: "2026-08-12",
    category: "assets",
    figure: "Documented remaining-assets floor",
    priorValue: "$16,746,136,347",
    currentValue: "$15,967,208,224",
    headline: "A provenance audit removed unsupported certainty rather than preserving a higher total.",
    explanation:
      "A merge-patch audit applied 18 data corrections, including six downgrades and ten additions. Older Owens Corning/Fibreboard, Armstrong, and USG cumulative figures were re-tiered from direct-filed to secondary-citing-filed where direct retrieval was not retained.",
    sources: [
      {
        label: "Provenance audit change record",
        url: changelogUrl,
        evidenceClass: "audit",
        detail: "Merge-patch v2 and tier-reclassification rationale",
      },
      {
        label: "Methodology source classifications",
        url: "/methodology",
        evidenceClass: "audit",
        detail: "Definitions for filed, secondary-citing-filed, and estimate tiers",
      },
    ],
    commit: "034d529",
  },
  {
    id: "2026-07-29-bottom-up",
    date: "2026-07-29",
    category: "payouts",
    figure: "Cumulative payouts since 1988",
    priorValue: "$24,000,000,000",
    currentValue: "$29,981,797,653",
    headline: "The round top-down placeholder was replaced with an itemized bottom-up build.",
    explanation:
      "The replacement decomposed payouts into $19.81B in filed figures, $6.67B in qualified secondary-citing-filed figures, and a labeled residual allowance of approximately $3.5B. The historic $24B figure remains documented as a retired estimate, not as a current calculation.",
    sources: [
      {
        label: "Cumulative payouts methodology",
        url: `${repo}/blob/main/docs/methodology-cumulative-payouts.md`,
        evidenceClass: "audit",
        detail: "Three-tier build, assumptions, and revision rationale",
      },
      {
        label: "Figure-change record",
        url: changelogUrl,
        evidenceClass: "audit",
        detail: "Documented transition away from the round placeholder",
      },
    ],
    commit: "2b2ecf1",
  },
  {
    id: "2026-07-28-nonpacer-recovery",
    date: "2026-07-28",
    category: "payouts",
    figure: "Filed cumulative-payment pool",
    priorValue: "$14,556,634,586 across 10 trusts",
    currentValue: "$19,810,476,508 across 14 trusts",
    headline: "Archived court material expanded the filed pool without relying on marketing summaries.",
    explanation:
      "A non-PACER recovery sweep located historical annual-report figures for Owens Corning/Fibreboard, Armstrong, USG, and Celotex. The records retain their historical as-of dates and are presented as historical floors where later payments are not captured.",
    sources: [
      {
        label: "Non-PACER recovery change record",
        url: changelogUrl,
        evidenceClass: "a",
        detail: "RECAP, Wayback, and cross-docket exhibit recovery summary",
      },
      {
        label: "Historical-floor explanation",
        url: "/methodology",
        evidenceClass: "audit",
        detail: "Why old reports are minimums rather than current totals",
      },
    ],
    commit: "dbf367a",
  },
  {
    id: "2026-07-28-new-filed-records",
    date: "2026-07-28",
    category: "payouts",
    figure: "Trust-level cumulative-payment records",
    priorValue: "Gaps in directly sourced fields",
    currentValue: "DII $2,349,041,458; W.R. Grace ~$2.69B; Motors Liquidation ~$136.2M",
    headline: "New annual reports converted three high-priority gaps into source-linked records.",
    explanation:
      "The DII figure is an exact bottom-up sum of 21 filed years. W.R. Grace and Motors Liquidation use the annual reports’ own stated approximate inception-to-date language, preserving the reports’ level of precision.",
    sources: [
      {
        label: "Annual-report recovery record",
        url: changelogUrl,
        evidenceClass: "a",
        detail: "DII, W.R. Grace, and Motors Liquidation filed-report citations",
      },
      {
        label: "Trust database",
        url: "/trusts",
        evidenceClass: "audit",
        detail: "Current trust-level source panels and as-of labels",
      },
    ],
    commit: "6287e72",
  },
  {
    id: "2026-07-27-initial-pool",
    date: "2026-07-27",
    category: "payouts",
    figure: "Initial filed cumulative-payment pool",
    priorValue: "No structured cumulative-paid fields",
    currentValue: "$14,556,634,586 across 10 trusts",
    headline: "The tracker began publishing trust-level cumulative-payment fields from retained primary records.",
    explanation:
      "The initial pool combined free-archive annual reports for Manville, Western, NARCO, Thorpe Insulation, Plant, J.T. Thorpe, and API with the first recovered annual-report records for DII, W.R. Grace, and Motors Liquidation.",
    sources: [
      {
        label: "Initial filed-pool change record",
        url: changelogUrl,
        evidenceClass: "a",
        detail: "Primary-record inventory and trust-level figures",
      },
    ],
    commit: "6287e72",
  },
];

export const provenanceChangelogUrl = changelogUrl;
export const provenanceCommitUrl = (hash: string) => `${repo}/commit/${hash}`;

export type OfficialPaymentNotice = {
  id: string;
  trustName: string;
  trustSlug: string;
  scope: string;
  noticeKind: "payment_change" | "current_rate_statement" | "reconsideration";
  priorPercentage?: number;
  currentPercentage: number;
  effectiveDate?: string;
  publishedDate?: string;
  sourceLabel: string;
  sourceUrl: string;
  summary: string;
};

/**
 * Public notice history is deliberately limited to trust or administrator
 * records with a direct, reviewed source URL. It is not a complete rate history
 * for every trust and absence here is never evidence of an unchanged rate.
 */
export const OFFICIAL_PAYMENT_NOTICES: OfficialPaymentNotice[] = [
  {
    id: "jt-thorpe-2026-09-18",
    trustName: "J.T. Thorpe Settlement Trust (CA)",
    trustSlug: "j-t-thorpe-settlement-trust-ca",
    scope: "Trust-wide payment percentage — announced; implementation pending",
    noticeKind: "payment_change",
    priorPercentage: 50,
    currentPercentage: 53.7,
    publishedDate: "2026-09-18",
    sourceLabel: "J.T. Thorpe Settlement Trust — J.T. Thorpe Payment Percentage Review",
    sourceUrl: "https://www.jttstrust.com",
    summary: "The Trust states that Trustees increased the rate from 50% to 53.7% of total liquidated claim value. Claims will be paid under the change after necessary claims-system and payment-procedure updates are completed; the notice does not state a completed implementation date.",
  },
  {
    id: "manville-2026-09-03",
    trustName: "Manville Personal Injury Settlement Trust",
    trustSlug: "manville-personal-injury-settlement-trust",
    scope: "Trust-wide pro rata payment percentage",
    noticeKind: "payment_change",
    priorPercentage: 5.1,
    currentPercentage: 5.6,
    effectiveDate: "2026-09-02",
    publishedDate: "2026-09-03",
    sourceLabel: "CRMC — Manville: Increase in the pro rata payment percentage",
    sourceUrl: "https://www.claimsres.com/2026/09/03/manville-increase-in-the-pro-rata-payment-percentage/",
    summary: "CRMC states that eClaims changes were implemented September 2, 2026 and that the Trustees approved an immediate increase from 5.1% to 5.6%.",
  },
  {
    id: "owens-illinois-2026-08-19",
    trustName: "Owens-Illinois Asbestos Personal Injury Trust",
    trustSlug: "paddock-enterprises-llc-asbestos-pi-trust",
    scope: "Owens-Illinois sub-account; separate Fibreboard terms are not represented by this entry",
    noticeKind: "payment_change",
    priorPercentage: 50,
    currentPercentage: 65,
    effectiveDate: "2026-08-19",
    publishedDate: "2026-08-19",
    sourceLabel: "Owens-Illinois Trust — Notice re: Payment Percentage Increase",
    sourceUrl: "https://www.oiasbestospersonalinjurytrust.com/wp-content/uploads/2026/08/O-I-Trust-Notice-re-Increase-Payment-Percentage.8.19.26-4905-3046-9064.1.pdf",
    summary: "The Trust notice states that the Trustees approved an increase in the Owens-Illinois payment percentage from 50% to 65%, effective August 19, 2026.",
  },
  {
    id: "federal-mogul-tn-2026-06-30",
    trustName: "Federal-Mogul Asbestos Personal Injury Trust",
    trustSlug: "federal-mogul-asbestos-pi-trust",
    scope: "T&N Sub-Account only; the separate FMP Sub-Account is not changed by this notice",
    noticeKind: "payment_change",
    currentPercentage: 2.9,
    effectiveDate: "2026-06-30",
    publishedDate: "2026-06-30",
    sourceLabel: "Federal-Mogul Trust — Notice of Payment Percentage Change, T&N Sub-Account",
    sourceUrl: "https://www.federalmogulasbestostrust.com/wp-content/uploads/2026/06/Notice-of-Payment-Percentage-Change-TN-Subfund-June-18-2026-4923-8029-8166-v.1-1.pdf",
    summary: "The trust notice supports a 2.9% payment percentage for the T&N Sub-Account. The separate FMP Sub-Account remains a distinct rate and must not be collapsed into this entry.",
  },
  {
    id: "armstrong-2026-06-11",
    trustName: "Armstrong World Industries Asbestos Trust",
    trustSlug: "armstrong-world-industries-asbestos-trust",
    scope: "Current trust payment percentage reconsideration",
    noticeKind: "reconsideration",
    currentPercentage: 10.8,
    publishedDate: "2026-06-11",
    sourceLabel: "Armstrong World Industries Asbestos Trust — Notice of Payment Percentage Reconsideration",
    sourceUrl: "https://www.armstrongworldasbestostrust.com/awi-notice-of-payment-percentage-reconsideration-6-11-2026/",
    summary: "The notice identifies 10.8% as the current payment percentage and opens reconsideration under TDP §4.2. It does not announce a new rate or state a new effective date.",
  },
  {
    id: "artra-2025-04-01",
    trustName: "ARTRA 524(g) Asbestos Trust",
    trustSlug: "artra-524g-asbestos-trust",
    scope: "Trust-wide payment percentage adjustment",
    noticeKind: "payment_change",
    currentPercentage: 0.7,
    effectiveDate: "2025-04-01",
    publishedDate: "2025-04-01",
    sourceLabel: "ARTRA 524(g) Asbestos Trust — Notice of Payment Percentage Adjustment",
    sourceUrl: "https://www.artratrust.com/assets/uploadedFiles/6a303f42-bfb7-4d18-b4c3-7118599892e5.pdf",
    summary: "The published ARTRA notice supports a 0.70% payment percentage effective April 1, 2025. The rate is shown to two decimal places in the source and rounded to 0.7% in tracker displays.",
  },
  {
    id: "pittsburgh-corning-2024-11-07",
    trustName: "Pittsburgh Corning Corporation Asbestos PI Trust",
    trustSlug: "pittsburgh-corning-corporation-asbestos-pi-trust",
    scope: "Current trust rate statement: Expedited Review scheduled value and Individual Review gross settlement value",
    noticeKind: "current_rate_statement",
    currentPercentage: 19,
    effectiveDate: "2024-11-07",
    sourceLabel: "Pittsburgh Corning Asbestos Trust — current payment percentage statement",
    sourceUrl: "https://www.pccasbestostrust.com",
    summary: "The official trust site states a current 19% payment percentage for both Expedited Review and Individual Review, measured against their respective claim-value bases.",
  },
];

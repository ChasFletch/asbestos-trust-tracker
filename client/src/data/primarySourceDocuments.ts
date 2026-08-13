import { primarySourcePdfUrls } from "@/data/primarySourcePdfUrls";

export type PrimarySourceDocument = {
  title: string;
  documentType: string;
  dateLabel: string | null;
  url: string;
  citation: string;
};

type SourceFileName = keyof typeof primarySourcePdfUrls;

/**
 * Full mapping of retained, verified artifact PDFs to the matching trust record.
 * Research PDFs for Bestwall, DBMP, and Garlock are intentionally not mapped here:
 * those entities do not currently have an operating trust record in this dataset.
 */
export const sourceFilesByTrust: Record<string, SourceFileName[]> = {
  "a-best-products-asbestos-trust": [
    "ABEST_Notice_Reduce_Payment_Percentage_2020.pdf",
  ],
  "acands-asbestos-settlement-trust": [
    "ACS_Sep2025_Notice_Payment_Percentage_Reduction.pdf",
    "ACS_May2026_Notice_Payment_Percentage_Reduction.pdf",
  ],
  "armstrong-world-industries-asbestos-pi-trust": [
    "armstrong-fy2013-annual-report.pdf",
    "armstrong-fy2014-annual-report.pdf",
    "awi-2013-12-11-pp-increase.pdf",
    "awi-2016-11-5233290_2.pdf",
    "awi-2018-06-notice.pdf",
    "awi-2019-07-30-pp-reduction.pdf",
    "awi-2020-10-10285296_2.pdf",
    "awi-2023-05-31-pp-reduction.pdf",
    "awi-2025-03-28-pp-reduction.pdf",
    "awi-2026-06-11-pp-reconsideration.pdf",
  ],
  "asarco-asbestos-pi-settlement-trust": [
    "asarco-fy2025-annual-report.pdf",
  ],
  "babcock-wilcox-asbestos-pi-settlement-trust": [
    "babcock-wilcox-fy2023-annual-report-doc7876.pdf",
  ],
  "combustion-engineering-524-g-asbestos-pi-trust": [
    "ce-fy2025-annual-report.pdf",
  ],
  "celotex-asbestos-settlement-trust": [
    "celotex-fy2006-doc13816-annual-report.pdf",
    "celotex-2006-payment-change-letter-8-1-2006.pdf",
    "celotex-2013-notice-payment-percentage-change.pdf",
    "celotex-2015-notice-payment-percentage-change.pdf",
    "celotex-2021-notice-payment-percentage-adjustment.pdf",
    "celotex-2023-notice-payment-percentage-adjustment.pdf",
    "celotex-2025-notice-deferral-period-effective-1-1-25.pdf",
  ],
  "christy-refractories-asbestos-pi-trust": [
    "CHRISTY_Notice_Payment_Percentage_Change_eff_2022-10-31.pdf",
    "CHRISTY_Notice_Limited_Liquidity.pdf",
  ],
  "congoleum-plan-trust": [
    "CG_Annual_Report_and_Financial_Statements_2025.pdf",
    "CG_Notice_Payment_Percentage_2023-10-12.pdf",
  ],
  "federal-mogul-asbestos-pi-trust": [
    "FM_TDP_2010.pdf",
    "FM_TN_PaymentPct_Change_2022-08.pdf",
    "FM_TN_PaymentPct_Change_2024-03.pdf",
    "FM_TN_PaymentPct_Reconsideration_2026-04.pdf",
    "FM_TN_PaymentPct_Change_2026-06-18.pdf",
    "FM_TN_SOL_Notice.pdf",
    "FM_FMP_SOL_Notice_2022-02.pdf",
    "FM_FMP_PaymentPct_Notice_2024-04.pdf",
    "FM_FMP_PaymentPct_Reconsideration_2026-04.pdf",
    "FM_TDP55_Amendment_2025-11-24.pdf",
  ],
  "h-k-porter-asbestos-trust": [
    "HKP_First_Amendment_ACRP.pdf",
    "HKP_Notice_Regarding_Payment_Percentage_Change.pdf",
  ],
  "j-t-thorpe-company-successor-trust-tx": [
    "THORPE_TX_Claims_Resolution_Procedures.pdf",
  ],
  "kaiser-gypsum-asbestos-pi-trust": [
    "KG_2025_Trust_Annual_Report.pdf",
    "KG_Opening_Announcement.pdf",
    "KG_Announcement_PreEffective_Liquidated.pdf",
    "KG_Announcement_Limitations_PreEffective_Liquidated_Insured.pdf",
    "KG_Payment_Percentage_Notice.pdf",
    "KG_Resolution_Adjusted_Payment_Percentage_2026-05-19.pdf",
    "KG_Revised_Opening_Date.pdf",
    "KG_TDP.pdf",
    "KG_TDP_First_Amendment_2021-10-22.pdf",
  ],
  "leslie-controls-inc-asbestos-personal-injury-trust": [
    "LESLIE_payment_pct_20250714.pdf",
  ],
  "abb-lummus-global-inc-524-g-asbestos-pi-trust": [
    "LUMMUS_annual_report_2025.pdf",
    "LUMMUS_payment_pct_20240122.pdf",
  ],
  "ngc-bodily-injury-trust-national-gypsum": [
    "NGC_NGCBIT_Pmt_Percentage_Increase_45.pdf",
  ],
  "owens-corning-fibreboard-asbestos-pi-trust": [
    "ocfb-fy2009-annual-report-court-filed.pdf",
    "ocfb-oc-subaccount-pct-change-2015-12.pdf",
    "ocfb-fb-subaccount-pct-change-2015-12.pdf",
    "ocfb-oc-payment-pct-notice-2019-08-02.pdf",
    "ocfb-fb-payment-pct-notice-2019-08-02.pdf",
    "ocfb-oc-subfund-payment-pct-notice-2022-08-01.pdf",
    "ocfb-fb-subfund-payment-pct-notice-2022-08-01.pdf",
    "ocfb-oc-subfund-payment-pct-notice-2024-11-07.pdf",
    "ocfb-fb-subfund-payment-pct-notice-2024-11-07.pdf",
    "ocfb-oc-reconsideration-payment-pct-2026-05-07.pdf",
    "ocfb-fb-reconsideration-payment-pct-2026-05-07.pdf",
    "ocfb-oc-subfund-payment-pct-notice-2026-06-30.pdf",
    "ocfb-fb-subfund-payment-pct-notice-2026-06-30.pdf",
  ],
  "paddock-enterprises-owens-illinois-asbestos-trust": [
    "PADDOCK_TDP_First_Amended_2023.pdf",
    "PADDOCK_Resolution_Installment_2023-12.pdf",
    "PADDOCK_Notice_Installment_SOL_2023-12.pdf",
    "PADDOCK_SOL_Notice_2024-08.pdf",
    "PADDOCK_Resolution_SOL_Deadline.pdf",
  ],
  "pittsburgh-corning-asbestos-pi-settlement-trust": [
    "pcc-recap-doc9409.pdf",
    "pcc-recap-doc10029.pdf",
    "pcc-payment-pct-notice-2017-03-20.pdf",
    "pcc-payment-pct-notice-2018-06.pdf",
    "pcc-payment-pct-notice-2022-10.pdf",
    "pcc-payment-pct-notice-2022-11-29.pdf",
    "pcc-payment-pct-notice-2024-06-25.pdf",
    "pcc-payment-pct-notice-2024-11-07.pdf",
  ],
  "porter-hayden-bodily-injury-trust": [
    "PH_Second_Revised_TDP_2021-07-15.pdf",
  ],
  "shook-fletcher-asbestos-settlement-trust": [
    "SHOOK_payment_notice_250602.pdf",
  ],
  "t-h-agriculture-nutrition-l-l-c-asbestos-personal-injury-trust-than": [
    "THAN_annual_report_2023.pdf",
    "THAN_payment_pct_20200422.pdf",
  ],
  "united-states-gypsum-usg-asbestos-trust": [
    "usg-fy2008-annual-report-narrative.pdf",
    "usg-payment-percentage-notice-2012-09-28.pdf",
    "usg-payment-percentage-change-2015-12-02.pdf",
    "usg-payment-percentage-notice-2017-08-08.pdf",
    "usg-payment-percentage-notice-2019-08-02.pdf",
    "usg-payment-percentage-notice-2022-08-01.pdf",
    "usg-payment-percentage-notice-2024-11-07.pdf",
    "usg-pp-reconsideration-notice-2026-05-07.pdf",
    "usg-payment-percentage-notice-2026-06-30.pdf",
  ],
  "united-states-mineral-products-company-asbestos-pi-settlement-trust": [
    "USMINERAL_payment_pct_increase.pdf",
  ],
  "yarway-asbestos-pi-trust": [
    "YARWAY_0_fbfe877a-f5f1-426d-a7ea-a972196e5d55.pdf",
  ],
};

function inferDateLabel(fileName: string): string | null {
  const date = fileName.match(/(20\d{2})[-_](\d{2})[-_](\d{2})/);
  if (date) return `${date[1]}-${date[2]}-${date[3]}`;
  const compactDate = fileName.match(/(20\d{2})(\d{2})(\d{2})/);
  if (compactDate) return `${compactDate[1]}-${compactDate[2]}-${compactDate[3]}`;
  const yearMonth = fileName.match(/(20\d{2})[-_](\d{2})/);
  if (yearMonth) return `${yearMonth[1]}-${yearMonth[2]}`;
  const year = fileName.match(/(20\d{2})/);
  return year ? year[1] : null;
}

function inferDocumentType(fileName: string): string {
  const name = fileName.toLowerCase();
  if (name.includes("annual")) return "Annual report";
  if (name.includes("tdp")) return "Trust distribution procedure";
  if (name.includes("crp") || name.includes("claims_resolution")) return "Claims resolution procedure";
  if (name.includes("reconsideration")) return "Reconsideration notice";
  if (name.includes("limited_liquidity")) return "Limited-liquidity notice";
  if (name.includes("sol") || name.includes("limitations")) return "Statute-of-limitations notice";
  if (name.includes("opening") || name.includes("pre_effective")) return "Trust opening announcement";
  if (name.includes("resolution")) return "Trust resolution";
  if (name.includes("amendment")) return "Procedure amendment";
  if (name.includes("recap")) return "Bankruptcy docket filing";
  if (name.includes("deferral")) return "Deferral notice";
  return "Payment percentage notice";
}

function inferTitle(fileName: string, documentType: string, dateLabel: string | null): string {
  const dateSuffix = dateLabel ? ` — ${dateLabel}` : "";
  if (documentType === "Annual report") return `Annual Report${dateSuffix}`;
  if (documentType === "Trust distribution procedure") return `Trust Distribution Procedures${dateSuffix}`;
  if (documentType === "Claims resolution procedure") return `Claims Resolution Procedures${dateSuffix}`;
  if (documentType === "Reconsideration notice") return `Payment Percentage Reconsideration Notice${dateSuffix}`;
  if (documentType === "Limited-liquidity notice") return `Limited Liquidity Notice${dateSuffix}`;
  if (documentType === "Statute-of-limitations notice") return `Statute of Limitations Notice${dateSuffix}`;
  if (documentType === "Trust opening announcement") return `Trust Opening Announcement${dateSuffix}`;
  if (documentType === "Trust resolution") return `Trust Resolution${dateSuffix}`;
  if (documentType === "Procedure amendment") return `Procedure Amendment${dateSuffix}`;
  if (documentType === "Bankruptcy docket filing") return `Bankruptcy Docket Filing${dateSuffix}`;
  if (documentType === "Deferral notice") return `Deferral Period Notice${dateSuffix}`;
  const specific = fileName.toLowerCase().includes("increase")
    ? "Payment Percentage Increase Notice"
    : fileName.toLowerCase().includes("reduce") || fileName.toLowerCase().includes("reduction")
    ? "Payment Percentage Reduction Notice"
    : fileName.toLowerCase().includes("change") || fileName.toLowerCase().includes("adjustment")
    ? "Payment Percentage Change Notice"
    : "Payment Percentage Notice";
  return `${specific}${dateSuffix}`;
}

function toSourceDocument(fileName: SourceFileName): PrimarySourceDocument {
  const dateLabel = inferDateLabel(fileName);
  const documentType = inferDocumentType(fileName);
  const title = inferTitle(fileName, documentType, dateLabel);
  return {
    title,
    documentType,
    dateLabel,
    url: primarySourcePdfUrls[fileName],
    citation: `Verified primary-source PDF: ${title}.`,
  };
}

export const primarySourceDocumentsBySlug: Record<string, PrimarySourceDocument[]> = Object.fromEntries(
  Object.entries(sourceFilesByTrust).map(([slug, files]) => [slug, files.map(toSourceDocument)])
);

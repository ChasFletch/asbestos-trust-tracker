/**
 * Trust-detail report discovery is intentionally curated. A trust appears here
 * only where at least two published report editions contain direct, substantive
 * trust-specific analysis, rather than a passing system-wide mention.
 */
const REPORT_IDS_BY_TRUST_SLUG: Record<string, readonly string[]> = {
  "narco-asbestos-trust": ["ATR-2026-Q3", "ATR-2026-Q2", "ATR-2026-Q1", "ATR-2025-Q4"],
  "dii-industries-halliburton-harbison-walker": ["ATR-2026-Q3", "ATR-2026-Q2", "ATR-2026-Q1"],
  "manville-personal-injury-settlement-trust": ["ATR-2026-Q3", "ATR-2026-Q2", "ATR-2026-Q1"],
  "western-asbestos-settlement-trust": ["ATR-2026-Q3", "ATR-2026-Q2", "ATR-2026-Q1"],
  "thorpe-insulation-company-asbestos-settlement-trust": ["ATR-2026-Q3", "ATR-2026-Q2", "ATR-2026-Q1"],
  "plant-asbestos-settlement-trust": ["ATR-2026-Q3", "ATR-2026-Q2", "ATR-2026-Q1"],
  "maremont-asbestos-pi-trust": ["ATR-2026-Q3", "ATR-2026-Q2"],
  "api-inc-asbestos-settlement-trust": ["ATR-2026-Q3", "ATR-2026-Q2", "ATR-2026-Q1"],
  "wr-grace-asbestos-pi-trust": ["ATR-2026-Q3", "ATR-2026-Q1", "ATR-2025-Q4"],
  "pittsburgh-corning-asbestos-pi-settlement-trust": ["ATR-2026-Q3", "ATR-2026-Q2", "ATR-2026-Q1", "ATR-2025-Q4"],
  "united-states-gypsum-usg-asbestos-trust": ["ATR-2026-Q3", "ATR-2026-Q2"],
  "owens-corning-fibreboard-asbestos-pi-trust": ["ATR-2026-VERIFY", "ATR-2026-Q2"],
  "celotex-asbestos-settlement-trust": ["ATR-2026-Q3", "ATR-2026-Q2", "ATR-2026-Q1", "ATR-2025-Q4"],
  "combustion-engineering-524-g-asbestos-pi-trust": ["ATR-2026-Q3", "ATR-2026-Q2", "ATR-2026-Q1"],
  "kaiser-asbestos-pi-trust": ["ATR-2026-Q3", "ATR-2025-Q4"],
  "babcock-wilcox-asbestos-pi-settlement-trust": ["ATR-2026-Q3", "ATR-2026-Q2", "ATR-2026-Q1"],
  "motors-liquidation-co-gm-asbestos-pi-trust": ["ATR-2026-Q3", "ATR-2025-Q4"],
  "rapid-american-asbestos-pi-trust": ["ATR-2026-Q3", "ATR-2026-Q2", "ATR-2025-Q4"],
  "kaiser-gypsum-asbestos-pi-trust": ["ATR-2026-VERIFY", "ATR-2026-Q1"],
};

export function getRelatedReportIdsForTrust(trustSlug: string): readonly string[] {
  return REPORT_IDS_BY_TRUST_SLUG[trustSlug] ?? [];
}

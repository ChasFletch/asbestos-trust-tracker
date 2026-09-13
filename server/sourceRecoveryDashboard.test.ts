import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { HISTORICAL_SOURCE_BACKLOG, monthlyHistoricalSourceWorklist } from "../shared/historicalSourceBacklog";
import { nextScheduledMonitoringCheck, sourceAccessAgeLabel } from "./operationsPilot";

const root = process.cwd();
const pageSource = readFileSync(resolve(root, "client/src/pages/SourceRecovery.tsx"), "utf8");
const prefetchSource = readFileSync(resolve(root, "client/src/ssr/prefetch.ts"), "utf8");
const routerSource = readFileSync(resolve(root, "server/routers.ts"), "utf8");
const sitemap = readFileSync(resolve(root, "client/public/sitemap.xml"), "utf8");

describe("Public historical-document recovery dashboard", () => {
  it("keeps the reviewed historical worklist explicit, ranked, and no-charge", () => {
    expect(HISTORICAL_SOURCE_BACKLOG).toHaveLength(8);
    expect(monthlyHistoricalSourceWorklist()).toHaveLength(5);
    expect(HISTORICAL_SOURCE_BACKLOG.map((item) => item.rank)).toEqual([1, 2, 3, 4, 5, 6, 7, 8]);
    expect(HISTORICAL_SOURCE_BACKLOG.every((item) => /public|no-charge/i.test(item.noChargeResearchPath))).toBe(true);
  });

  it("distinguishes corroborated Celotex docket metadata from an unretrieved primary report", () => {
    const celotex = HISTORICAL_SOURCE_BACKLOG.find((item) => item.trustSlug === "celotex-asbestos-settlement-trust");
    expect(celotex?.currentEvidence).toContain("Public court-docket indexes corroborate");
    expect(celotex?.currentEvidence).toContain("neither the report nor the order PDF is publicly retrievable");
    expect(celotex?.currentEvidence).toContain("rather than treating any FY2025 figure as current");
  });

  it("records Pittsburgh Corning annual-report docket metadata without promoting unavailable attachments to filed evidence", () => {
    const pcc = HISTORICAL_SOURCE_BACKLOG.find((item) => item.trustSlug === "pittsburgh-corning-asbestos-pi-settlement-trust");
    expect(pcc?.currentEvidence).toContain("official PCC documents page does not list annual reports");
    expect(pcc?.currentEvidence).toContain("FY2022 (Doc. 10942)");
    expect(pcc?.currentEvidence).toContain("FY2023 (Doc. 10943)");
    expect(pcc?.currentEvidence).toContain("attachments remain unavailable through the reviewed no-charge routes");
  });

  it("records the Owens Corning/Fibreboard no-charge report-search limit without promoting secondary annual-report references", () => {
    const ocfb = HISTORICAL_SOURCE_BACKLOG.find((item) => item.trustSlug === "owens-corning-fibreboard-asbestos-pi-trust");
    expect(ocfb?.currentEvidence).toContain("no annual-report or trustee-account download");
    expect(ocfb?.currentEvidence).toContain("Trust Online is login-gated");
    expect(ocfb?.currentEvidence).toContain("no matching annual-report PDF capture");
    expect(ocfb?.currentEvidence).toContain("secondary page describes 2022 annual-report activity, but it is not controlling evidence");
    expect(ocfb?.currentEvidence).toContain("filed 2009 amount as a historical floor");
  });

  it("records Armstrong's FY2025 docket metadata without promoting inaccessible attachments to current filed evidence", () => {
    const armstrong = HISTORICAL_SOURCE_BACKLOG.find((item) => item.trustSlug === "armstrong-world-industries-asbestos-pi-trust");
    expect(armstrong?.currentEvidence).toContain("only the 2013 and 2014 annual-report files");
    expect(armstrong?.currentEvidence).toContain("FY2025 annual-report Notice of Service Doc. 11008");
    expect(armstrong?.currentEvidence).toContain("does not provide those attachments through the reviewed no-charge path");
    expect(armstrong?.currentEvidence).toContain("no newer annual-report PDF capture");
    expect(armstrong?.currentEvidence).toContain("FY2014 figure as a historical floor");
  });

  it("records USG's later annual-report docket metadata without promoting unavailable attachments to filed evidence", () => {
    const usg = HISTORICAL_SOURCE_BACKLOG.find((item) => item.trustSlug === "united-states-gypsum-usg-asbestos-trust");
    expect(usg?.currentEvidence).toContain("public WordPress media/search indexes expose current procedures and notices but no annual report or trustee account");
    expect(usg?.currentEvidence).toContain("Doc. 12842 (2018), Doc. 12844 (2020), and Doc. 12846 (2021)");
    expect(usg?.currentEvidence).toContain("reviewed attachments are not in RECAP and remain unavailable through no-charge routes");
    expect(usg?.currentEvidence).toContain("did not surface an annual-report PDF capture");
    expect(usg?.currentEvidence).toContain("2008 figure as a historical floor");
  });

  it("keeps G-I Holdings' 2022 component qualified when the official library and public docket metadata do not provide the underlying report", () => {
    const giHoldings = HISTORICAL_SOURCE_BACKLOG.find((item) => item.trustSlug === "g-i-holdings-gaf-asbestos-pi-settlement-trust");
    expect(giHoldings?.currentEvidence).toContain("December 1, 2022 payment-percentage notice, but no annual report, trustee account, or audited financial statements");
    expect(giHoldings?.currentEvidence).toContain("special-purpose financial-statement and auditor-report filings through the years ended 2018 and 2017");
    expect(giHoldings?.currentEvidence).toContain("require paid PACER retrieval and do not supply the underlying report content through no-charge RECAP");
    expect(giHoldings?.currentEvidence).toContain("procedures and notices, not a 2022 annual report");
    expect(giHoldings?.currentEvidence).toContain("qualified component therefore remains unchanged");
  });

  it("records Maremont's recovered four-year official payment series without promoting the partial subtotal to inception-to-date payments", () => {
    const maremont = HISTORICAL_SOURCE_BACKLOG.find((item) => item.trustSlug === "maremont-asbestos-pi-trust");
    expect(maremont?.historicalCutoff).toContain("$11,512,985");
    expect(maremont?.currentEvidence).toContain("FY2022 (DN 371), FY2023 (DN 372), FY2024 (DN 373), and FY2025 (DN 374)");
    expect(maremont?.currentEvidence).toContain("annual cash payments totaling $11,512,985");
    expect(maremont?.currentEvidence).toContain("not present the four-year subtotal as a total paid since inception");
  });

  it("records DII's reviewed archive boundary without promoting its 2014–2025 period subtotal to inception-to-date payments", () => {
    const dii = HISTORICAL_SOURCE_BACKLOG.find((item) => item.trustSlug === "dii-industries-halliburton-harbison-walker");
    expect(dii?.currentEvidence).toContain("official annual-report archive begins with FY2014");
    expect(dii?.currentEvidence).toContain("Internet Archive index likewise begins with FY2014");
    expect(dii?.currentEvidence).toContain("bounded period result rather than an inception-to-date cumulative-paid figure");
  });

  it("renders bounded recovery language and live registry status rather than unverified trust facts", () => {
    expect(pageSource).toContain("research progress—not new trust facts");
    expect(pageSource).toContain("Access is not substance");
    expect(pageSource).toContain("Source reachable");
    expect(pageSource).toContain("Access attention");
    expect(pageSource).toContain("Open monitored public source");
    expect(pageSource).toContain("no-charge research cycle");
    expect(pageSource).toContain("Source access age");
    expect(pageSource).toContain("Next scheduled check");
    expect(pageSource).toContain("Next archive recheck");
    expect(pageSource).toContain("planned research review");
    expect(pageSource).toContain("America/Chicago");
    expect(pageSource).toContain("Source access repairs");
    expect(pageSource).toContain("Fallback verified");
    expect(routerSource).toContain("sourceAccessAge");
    expect(routerSource).toContain("nextScheduledCheckAt");
    expect(routerSource).toContain("archiveRecheckOn");
    expect(routerSource).toContain("accessRepairs");
  });

  it("derives source-age labels and next monitoring slots on the server", () => {
    const mondayMorning = new Date("2026-09-07T13:00:00Z"); // 8:00 a.m. CDT
    expect(sourceAccessAgeLabel(new Date("2026-09-06T13:00:00Z"), mondayMorning)).toBe("1 day since successful access");
    expect(nextScheduledMonitoringCheck("daily", mondayMorning).toISOString()).toBe("2026-09-08T11:30:00.000Z");
    expect(nextScheduledMonitoringCheck("weekly", mondayMorning).toISOString()).toBe("2026-09-13T15:00:00.000Z");
  });

  it("assigns visible, upcoming archive-recheck dates to every ranked recovery target", () => {
    expect(HISTORICAL_SOURCE_BACKLOG.every((item) => /^2026-09-(24|25|27)$/.test(item.archiveRecheckOn))).toBe(true);
    expect(HISTORICAL_SOURCE_BACKLOG.find((item) => item.trustSlug === "dii-industries-halliburton-harbison-walker")?.archiveRecheckOn).toBe("2026-09-27");
  });

  it("is publicly queryable, server-rendered, canonicalized, and indexed", () => {
    expect(routerSource).toContain("recoveryDashboard: publicProcedure.query");
    expect(prefetchSource).toContain('clean === "/source-recovery"');
    expect(prefetchSource).toContain("Historical Source Recovery");
    expect(sitemap).toContain("https://asbestostrusts.org/source-recovery");
  });
});

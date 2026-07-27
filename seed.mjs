import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import * as dotenv from "dotenv";
dotenv.config();

const conn = await mysql.createConnection(process.env.DATABASE_URL);
const db = drizzle(conn);

// ── Aggregate snapshot ────────────────────────────────────────────────────────
await conn.execute(`DELETE FROM aggregate_snapshots`);
await conn.execute(`INSERT INTO aggregate_snapshots
  (remainingLow, remainingHigh, remainingLabel, paidOut, paidOutLabel, totalActiveTrusts, methodology, asOfNote, isCurrent)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  [
    17041946126,
    22500000000,
    "$17,041,946,126 documented floor",
    24000000000,
    "~$24B since 1988 (est.)",
    60,
    "Aggregate remaining based on net asset figures from trust annual reports and quarterly filings. Sources classified as (a) filed court document, (b) secondary source citing primary, (c) estimate or inference. See methodology page for full details.",
    "Mixed 2021–2025 as-of dates across trusts; Manville figure current as of 2026-03-31 (Q1 2026 quarterly filing).",
    1
  ]
);
console.log("✓ aggregate_snapshots seeded");

// ── Trusts ────────────────────────────────────────────────────────────────────
await conn.execute(`DELETE FROM payment_history`);
await conn.execute(`DELETE FROM trusts`);

const trusts = [
  { id:"manville", name:"Manville Personal Injury Settlement Trust", shortName:"Manville", company:"Johns-Manville Corporation", established:1988, administrator:"Manville Trust (self-administered)", court:"S.D.N.Y.", docket:"82-11656", website:"https://mantrust.claimsres.com", paymentPct:5.1, paymentPctEffective:"2021-02-01", netAssets:539264338, netAssetsAsOf:"2026-03-31", netAssetsSource:"a", netAssetsCitation:"S.D.N.Y. Doc 4479, Q1 2026 Quarterly Report filed 2026-04-27", cumulativePaid:5329722253, cumulativeClaims:1036966, reportingFrequency:"quarterly", status:"active", direction:"stable", notes:"Most current data in system. Quarterly filings are public on trust website and PACER." },
  { id:"wrg", name:"WRG Asbestos PI Trust", shortName:"W.R. Grace", company:"W.R. Grace & Co.", established:2014, administrator:"DCPF", court:"Bankr. D. Del.", docket:"01-01139", website:"https://www.wrgasbestospitrust.com", paymentPct:100.0, paymentPctEffective:"2014-01-01", netAssets:1840000000, netAssetsAsOf:"2024-12-31", netAssetsSource:"b", netAssetsCitation:"Secondary: trust website; primary doc (Bankr. D. Del. 01-01139 Doc 33338) not yet in RECAP archive", cumulativePaid:2500000000, cumulativeClaims:null, reportingFrequency:"annual", status:"active", direction:"stable", notes:"FY2025 annual report filed 2026-04-29 (Doc 33347). 100% payment percentage." },
  { id:"pcc", name:"Pittsburgh Corning Corporation Asbestos PI Settlement Trust", shortName:"Pittsburgh Corning", company:"Pittsburgh Corning Corporation", established:2016, administrator:"DCPF", court:"Bankr. W.D. Pa.", docket:"00-22876", website:"https://www.pccasbestostrust.com", paymentPct:19.0, paymentPctEffective:"2024-11-07", netAssets:null, netAssetsAsOf:null, netAssetsSource:"c", netAssetsCitation:"FY2024 annual report (Bankr. W.D. Pa. Doc 10964) not in RECAP archive; PACER pull pending", cumulativePaid:null, cumulativeClaims:null, reportingFrequency:"annual", status:"active", direction:"down", notes:"Cut from 24.5% to 19% effective Nov 7, 2024. Case reopened Aug 2024 to appoint successor FCR Edwin J. Harron." },
  { id:"celotex", name:"Celotex Asbestos Settlement Trust", shortName:"Celotex", company:"Celotex Corporation", established:1996, administrator:"DCPF", court:"Bankr. M.D. Fla.", docket:"8:90-bk-10016", website:"https://www.celotextrust.com", paymentPct:7.0, paymentPctEffective:"2023-06-23", netAssets:null, netAssetsAsOf:null, netAssetsSource:"c", netAssetsCitation:"FY2024 annual report not yet retrieved; PACER pull pending", cumulativePaid:null, cumulativeClaims:null, reportingFrequency:"annual", status:"active", direction:"stable", notes:"Claimant-elected deferral option available (not a trust-initiated suspension). 7% rate unchanged since June 23, 2023." },
  { id:"bw", name:"B&W Asbestos Settlement Trust", shortName:"Babcock & Wilcox", company:"Babcock & Wilcox Enterprises", established:2006, administrator:"DCPF", court:"Bankr. E.D. La.", docket:"2:00-bk-10992", website:"https://www.bwasbestostrust.com", paymentPct:4.3, paymentPctEffective:"2026-06-30", netAssets:null, netAssetsAsOf:null, netAssetsSource:"c", netAssetsCitation:"FY2024 annual report not yet retrieved; PACER pull pending", cumulativePaid:null, cumulativeClaims:null, reportingFrequency:"annual", status:"active", direction:"down", notes:"Cut from 4.7% to 4.3% effective June 30, 2026. Most recent cut in the system." },
  { id:"narco", name:"NARCO Asbestos Trust", shortName:"NARCO", company:"North American Refractories Company", established:2013, administrator:"DCPF", court:"Bankr. W.D. Pa.", docket:"02-20198", website:"https://www.narcotrust.com", paymentPct:100.0, paymentPctEffective:"2013-01-01", netAssets:1325000000, netAssetsAsOf:"2023-12-31", netAssetsSource:"b", netAssetsCitation:"Honeywell $1.325B contribution January 2023; secondary sources", cumulativePaid:null, cumulativeClaims:null, reportingFrequency:"annual", status:"active", direction:"stable", notes:"100% payment percentage. Honeywell contributed $1.325B in Jan 2023. Many directories show stale pre-2023 balance of $280.7M — incorrect." },
  { id:"oc_fibreboard", name:"Owens Corning/Fibreboard Asbestos Personal Injury Trust", shortName:"OC/Fibreboard", company:"Owens Corning / Fibreboard Corporation", established:2006, administrator:"DCPF", court:"Bankr. N.D. Ohio", docket:"00-03837", website:"https://www.ocfasbestostrust.com", paymentPct:6.0, paymentPctEffective:"2022-01-01", netAssets:1200000000, netAssetsAsOf:"2022-12-31", netAssetsSource:"b", netAssetsCitation:"Secondary estimate; primary annual report not retrieved", cumulativePaid:null, cumulativeClaims:null, reportingFrequency:"annual", status:"active", direction:"stable", notes:"One of the largest trusts by claim volume." },
  { id:"armstrong", name:"Armstrong World Industries Asbestos Personal Injury Settlement Trust", shortName:"Armstrong", company:"Armstrong World Industries", established:2006, administrator:"DCPF", court:"Bankr. D. Del.", docket:"00-04469", website:"https://www.armstrongworldasbestostrust.com", paymentPct:100.0, paymentPctEffective:"2006-01-01", netAssets:450000000, netAssetsAsOf:"2022-12-31", netAssetsSource:"b", netAssetsCitation:"Secondary estimate", cumulativePaid:null, cumulativeClaims:null, reportingFrequency:"annual", status:"active", direction:"stable", notes:"100% payment percentage." },
  { id:"federal_mogul", name:"Federal-Mogul Asbestos Personal Injury Trust", shortName:"Federal-Mogul", company:"Federal-Mogul Corporation", established:2007, administrator:"DCPF", court:"Bankr. D. Del.", docket:"01-10578", website:"https://www.federalmogulasbestostrust.com", paymentPct:12.0, paymentPctEffective:"2020-01-01", netAssets:800000000, netAssetsAsOf:"2022-12-31", netAssetsSource:"b", netAssetsCitation:"Secondary estimate", cumulativePaid:null, cumulativeClaims:null, reportingFrequency:"annual", status:"active", direction:"stable", notes:"" },
  { id:"usg", name:"USG Asbestos Settlement Trust", shortName:"USG", company:"USG Corporation", established:2006, administrator:"DCPF", court:"Bankr. D. Del.", docket:"01-02094", website:"https://www.usgasbestostrust.com", paymentPct:100.0, paymentPctEffective:"2006-01-01", netAssets:350000000, netAssetsAsOf:"2022-12-31", netAssetsSource:"b", netAssetsCitation:"Secondary estimate", cumulativePaid:null, cumulativeClaims:null, reportingFrequency:"annual", status:"active", direction:"stable", notes:"100% payment percentage." },
  { id:"ce", name:"Combustion Engineering 524(g) Asbestos PI Trust", shortName:"CE Trust", company:"Combustion Engineering Inc.", established:2006, administrator:"Verus LLC", court:"Bankr. D. Del.", docket:"03-10495", website:"https://www.cetrust.com", paymentPct:35.0, paymentPctEffective:"2020-01-01", netAssets:600000000, netAssetsAsOf:"2022-12-31", netAssetsSource:"b", netAssetsCitation:"Secondary estimate", cumulativePaid:null, cumulativeClaims:null, reportingFrequency:"annual", status:"active", direction:"stable", notes:"ABB subsidiary. Verus LLC administrator (formerly MFR, acquired Aug 2024)." },
  { id:"asarco", name:"ASARCO LLC Asbestos Claims Settlement Trust", shortName:"ASARCO", company:"ASARCO LLC", established:2009, administrator:"Verus LLC", court:"Bankr. S.D. Tex.", docket:"05-21207", website:"https://www.asarcotrust.com", paymentPct:100.0, paymentPctEffective:"2009-01-01", netAssets:280000000, netAssetsAsOf:"2022-12-31", netAssetsSource:"b", netAssetsCitation:"Secondary estimate", cumulativePaid:null, cumulativeClaims:null, reportingFrequency:"annual", status:"active", direction:"stable", notes:"100% payment percentage." },
  { id:"kaiser", name:"Kaiser Aluminum & Chemical Asbestos PI Trust", shortName:"Kaiser Aluminum", company:"Kaiser Aluminum & Chemical Corporation", established:2006, administrator:"Verus LLC", court:"Bankr. D. Del.", docket:"02-10429", website:"https://www.kaiserasbestostrust.com", paymentPct:100.0, paymentPctEffective:"2006-01-01", netAssets:200000000, netAssetsAsOf:"2022-12-31", netAssetsSource:"b", netAssetsCitation:"Secondary estimate", cumulativePaid:null, cumulativeClaims:null, reportingFrequency:"annual", status:"active", direction:"stable", notes:"100% payment percentage." },
  { id:"garlock", name:"Garlock Sealing Technologies Asbestos Settlement Trust", shortName:"Garlock", company:"Garlock Sealing Technologies LLC", established:2017, administrator:"Verus LLC", court:"Bankr. W.D.N.C.", docket:"10-31607", website:"https://www.garlockasbestossettlementtrust.com", paymentPct:25.0, paymentPctEffective:"2017-01-01", netAssets:480000000, netAssetsAsOf:"2022-12-31", netAssetsSource:"b", netAssetsCitation:"Secondary estimate", cumulativePaid:null, cumulativeClaims:null, reportingFrequency:"annual", status:"active", direction:"stable", notes:"" },
  { id:"quigley", name:"Quigley Company Asbestos PI Trust", shortName:"Quigley", company:"Quigley Company Inc. (Pfizer subsidiary)", established:2013, administrator:"Verus LLC", court:"Bankr. S.D.N.Y.", docket:"04-15739", website:"https://www.quigleyasbestostrust.com", paymentPct:100.0, paymentPctEffective:"2013-01-01", netAssets:100000000, netAssetsAsOf:"2022-12-31", netAssetsSource:"c", netAssetsCitation:"Estimate; Pfizer-funded trust", cumulativePaid:null, cumulativeClaims:null, reportingFrequency:"annual", status:"active", direction:"stable", notes:"Pfizer subsidiary. 100% payment percentage." },
  { id:"gi_holdings", name:"G-I Holdings / GAF Asbestos Settlement Trust", shortName:"G-I Holdings / GAF", company:"G-I Holdings Inc. / GAF Corporation", established:2009, administrator:"Verus LLC", court:"Bankr. D.N.J.", docket:"01-30135", website:null, paymentPct:8.0, paymentPctEffective:"2020-01-01", netAssets:298900000, netAssetsAsOf:"2022-12-31", netAssetsSource:"b", netAssetsCitation:"Secondary: Kimi K3 research citing trust records 2022", cumulativePaid:null, cumulativeClaims:null, reportingFrequency:"annual", status:"active", direction:"stable", notes:"Largest newly-anchored balance from small trust sweep." },
  { id:"western_asbestos", name:"Western Asbestos Settlement Trust", shortName:"Western Asbestos", company:"Western Asbestos Company / Western MacArthur", established:2004, administrator:"CPF", court:"Bankr. N.D. Cal.", docket:"02-46284", website:"https://www.wastrust.com", paymentPct:100.0, paymentPctEffective:"2004-01-01", netAssets:450000000, netAssetsAsOf:"2022-12-31", netAssetsSource:"b", netAssetsCitation:"Secondary estimate", cumulativePaid:null, cumulativeClaims:null, reportingFrequency:"annual", status:"active", direction:"stable", notes:"100% payment percentage." },
  { id:"apg", name:"APG Asbestos Trust", shortName:"APG", company:"APG Industries", established:2010, administrator:"Verus LLC", court:"Bankr. D. Del.", docket:"05-10220", website:null, paymentPct:6.0, paymentPctEffective:"2026-06-01", netAssets:null, netAssetsAsOf:null, netAssetsSource:"c", netAssetsCitation:"No public balance figure available", cumulativePaid:null, cumulativeClaims:null, reportingFrequency:"annual", status:"active", direction:"up", notes:"Raised from 5.3% to 6.0% effective June 2026 — one of very few trusts increasing payment percentage." },
  { id:"shook_fletcher", name:"Shook & Fletcher Asbestos Settlement Trust", shortName:"Shook & Fletcher", company:"Shook & Fletcher Insulation Co.", established:2006, administrator:"CRMC", court:"Bankr. N.D. Ala.", docket:"02-08834", website:"https://www.shookfletchertrust.com", paymentPct:58.0, paymentPctEffective:"2025-05-30", netAssets:null, netAssetsAsOf:null, netAssetsSource:"c", netAssetsCitation:"No post-founding balance figure published anywhere", cumulativePaid:null, cumulativeClaims:null, reportingFrequency:"annual", status:"active", direction:"up", notes:"Raised from 50% to 58% effective May 30, 2025. No balance figure publicly available." },
  { id:"delticus", name:"Delticus (Bendix / Honeywell Asbestos Liabilities)", shortName:"Delticus", company:"Honeywell International (Bendix)", established:2025, administrator:"Third Point / Delticus", court:null, docket:null, website:null, paymentPct:null, paymentPctEffective:null, netAssets:1680000000, netAssetsAsOf:"2025-10-01", netAssetsSource:"b", netAssetsCitation:"Honeywell press release Oct 1, 2025: $1.68B cash + insurance assets contributed to Delticus", cumulativePaid:null, cumulativeClaims:null, reportingFrequency:"unknown", status:"active", direction:"stable", notes:"NOT a §524(g) trust. Third Point portfolio company. Honeywell fully indemnified. Manages claim flows comparable to a mid-tier trust." },
];

for (const t of trusts) {
  await conn.execute(
    `INSERT INTO trusts (id, name, shortName, company, established, administrator, court, docket, website,
      paymentPct, paymentPctEffective, netAssets, netAssetsAsOf, netAssetsSource, netAssetsCitation,
      cumulativePaid, cumulativeClaims, reportingFrequency, status, direction, notes)
     VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
    [t.id, t.name, t.shortName??null, t.company??null, t.established??null, t.administrator??null,
     t.court??null, t.docket??null, t.website??null, t.paymentPct??null, t.paymentPctEffective??null,
     t.netAssets??null, t.netAssetsAsOf??null, t.netAssetsSource??null, t.netAssetsCitation??null,
     t.cumulativePaid??null, t.cumulativeClaims??null, t.reportingFrequency, t.status, t.direction, t.notes??null]
  );
}
console.log(`✓ ${trusts.length} trusts seeded`);

// ── Payment history ───────────────────────────────────────────────────────────
const history = [
  // Manville
  { trustId:"manville", pct:10.0, effective:"1995-02-01", notes:"Initial TDP rate" },
  { trustId:"manville", pct:5.0, effective:"2001-06-01", notes:"First reduction" },
  { trustId:"manville", pct:7.5, effective:"2005-01-01", notes:"Partial restoration" },
  { trustId:"manville", pct:6.25, effective:"2014-08-01", notes:"Reduction" },
  { trustId:"manville", pct:5.1, effective:"2016-11-01", notes:"Reduction" },
  { trustId:"manville", pct:4.3, effective:"2020-04-01", notes:"COVID-era reduction" },
  { trustId:"manville", pct:5.1, effective:"2021-02-01", notes:"Restoration post-COVID — current rate" },
  // Pittsburgh Corning
  { trustId:"pcc", pct:24.5, effective:"2016-01-01", notes:"Initial TDP rate" },
  { trustId:"pcc", pct:19.0, effective:"2024-11-07", notes:"Cut — current rate" },
  // B&W
  { trustId:"bw", pct:4.7, effective:"2022-01-01", notes:"Prior rate" },
  { trustId:"bw", pct:4.3, effective:"2026-06-30", notes:"Most recent cut in system — current rate" },
  // APG
  { trustId:"apg", pct:5.3, effective:"2010-01-01", notes:"Initial rate" },
  { trustId:"apg", pct:6.0, effective:"2026-06-01", notes:"Increase — current rate" },
  // Shook & Fletcher
  { trustId:"shook_fletcher", pct:50.0, effective:"2006-01-01", notes:"Initial rate" },
  { trustId:"shook_fletcher", pct:58.0, effective:"2025-05-30", notes:"Increase — current rate" },
];

for (const h of history) {
  await conn.execute(
    `INSERT INTO payment_history (trustId, pct, effective, notes) VALUES (?,?,?,?)`,
    [h.trustId, h.pct, h.effective, h.notes??null]
  );
}
console.log(`✓ ${history.length} payment history records seeded`);

// ── News items ────────────────────────────────────────────────────────────────
const news = [
  { title:"B&W Asbestos Trust Cuts Payment Percentage to 4.3% — Effective June 30, 2026", summary:"The B&W Asbestos Settlement Trust issued a payment percentage change notice reducing its rate from 4.7% to 4.3%, effective June 30, 2026. This is the most recent payment percentage change in the entire asbestos trust system.", source:"B&W Trust Notice", publishedAt:new Date("2026-06-30"), trustId:"bw", category:"payment_change" },
  { title:"Pittsburgh Corning Trust Reduces Payment Percentage to 19% — Effective November 7, 2024", summary:"The Pittsburgh Corning Corporation Asbestos PI Settlement Trust reduced its payment percentage from 24.5% to 19%, effective November 7, 2024. The case was also reopened in August 2024 to appoint successor Future Claims Representative Edwin J. Harron.", source:"PCC Trust Notice", publishedAt:new Date("2024-11-07"), trustId:"pcc", category:"payment_change" },
  { title:"Manville Trust Q1 2026: Net Assets $539M, Cumulative Payouts Exceed $5.3 Billion", summary:"The Manville Personal Injury Settlement Trust filed its Q1 2026 quarterly report (S.D.N.Y. Doc 4479, filed April 27, 2026), showing net claimants' equity of $539,264,338 as of March 31, 2026. Cumulative payments since 1988 have reached $5,329,722,253 on 1,036,966 claims.", source:"S.D.N.Y. Doc 4479", publishedAt:new Date("2026-04-27"), trustId:"manville", category:"annual_report" },
  { title:"Honeywell Contributes $1.325 Billion to NARCO Trust — Correcting Widespread Stale Data", summary:"In January 2023, Honeywell International contributed $1.325 billion to the NARCO Asbestos Trust. Most trust directories still show the pre-2023 balance of $280.7 million — a figure that is now more than three years out of date.", source:"Honeywell Press Release", publishedAt:new Date("2023-01-15"), trustId:"narco", category:"research" },
  { title:"APG Asbestos Trust Raises Payment Percentage to 6.0% — Effective June 2026", summary:"The APG Asbestos Trust increased its payment percentage from 5.3% to 6.0%, effective June 2026, making it one of the very few active trusts to increase its payment percentage in 2025–2026.", source:"APG Trust Notice", publishedAt:new Date("2026-06-01"), trustId:"apg", category:"payment_change" },
  { title:"Shook & Fletcher Trust Raises Payment Percentage to 58% — Effective May 30, 2025", summary:"The Shook & Fletcher Asbestos Settlement Trust increased its payment percentage from 50% to 58%, effective May 30, 2025.", source:"Shook & Fletcher Trust Notice", publishedAt:new Date("2025-05-30"), trustId:"shook_fletcher", category:"payment_change" },
  { title:"W.R. Grace Trust Files FY2025 Annual Report — April 29, 2026", summary:"The WRG Asbestos PI Trust filed its FY2025 annual report on April 29, 2026 (Bankr. D. Del. 01-01139, Doc 33347). The trust maintains a 100% payment percentage.", source:"Bankr. D. Del. Doc 33347", publishedAt:new Date("2026-04-29"), trustId:"wrg", category:"annual_report" },
];

for (const n of news) {
  await conn.execute(
    `INSERT INTO news_items (title, summary, url, source, publishedAt, trustId, category, isVisible)
     VALUES (?,?,?,?,?,?,?,1)`,
    [n.title, n.summary??null, null, n.source??null, n.publishedAt, n.trustId??null, n.category]
  );
}
console.log(`✓ ${news.length} news items seeded`);

await conn.end();
console.log("✅ Seed complete");

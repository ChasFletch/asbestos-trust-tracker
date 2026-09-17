import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const dataPath = path.join(root, "client/src/data/trust-figures.json");
const sitemapPath = path.join(root, "client/public/sitemap.xml");
const data = JSON.parse(fs.readFileSync(dataPath, "utf8"));
const sitemap = fs.readFileSync(sitemapPath, "utf8");
const trustUrlMatches = sitemap.match(/<loc>https:\/\/asbestostrusts\.org\/trusts\//g) ?? [];
const byName = (name) => data.trusts.find((trust) => trust.name === name);
const hercules = byName("Hercules Chemical Co. Asbestos Settlement Trust");
const ugl = byName("United Gilsonite (UGL) Asbestos PI Trust");
const countByStatus = data.trusts.reduce((counts, trust) => {
  counts[trust.status] = (counts[trust.status] ?? 0) + 1;
  return counts;
}, {});

const assertions = [
  ["55 trust records", data.trusts.length === 55, data.trusts.length],
  ["42 trusts with located figures", data.aggregate.trustsWithFigures === 42, data.aggregate.trustsWithFigures],
  ["$15,987,271,944 remaining-assets floor", data.aggregate.remainingAssetsPoint === 15987271944, data.aggregate.remainingAssetsPoint],
  ["$21,742,138,783 remaining-assets high figure", data.aggregate.remainingAssetsHigh === 21742138783, data.aggregate.remainingAssetsHigh],
  ["$30,020,097,653 bottom-up payouts", data.aggregate.cumulativePayoutsBottomUp === 30020097653, data.aggregate.cumulativePayoutsBottomUp],
  ["$17,110,328,204 filed payout tier", data.aggregate.cumulativePayoutsBottomUpFiled === 17110328204, data.aggregate.cumulativePayoutsBottomUpFiled],
  ["$9,409,769,449 secondary payout tier", data.aggregate.cumulativePayoutsBottomUpSecondary === 9409769449, data.aggregate.cumulativePayoutsBottomUpSecondary],
  ["Hercules record", hercules?.netAssets === 4018899 && hercules?.paymentPercentage === 2, hercules ? `${hercules.netAssets} / ${hercules.paymentPercentage}%` : "missing"],
  ["United Gilsonite record", ugl?.netAssets === 16044821 && ugl?.paymentPercentage === 3.35, ugl ? `${ugl.netAssets} / ${ugl.paymentPercentage}%` : "missing"],
  ["Hercules sitemap URL", sitemap.includes("/trusts/hercules-chemical-co-asbestos-settlement-trust"), "present"],
  ["UGL sitemap URL", sitemap.includes("/trusts/united-gilsonite-ugl-asbestos-pi-trust"), "present"],
  ["55 trust detail URLs in sitemap", trustUrlMatches.length === 55, trustUrlMatches.length],
];

console.log("Status counts:", JSON.stringify(countByStatus));
for (const [label, passed, actual] of assertions) {
  console.log(`${passed ? "PASS" : "FAIL"} — ${label}: ${actual}`);
}
if (assertions.some(([, passed]) => !passed)) process.exitCode = 1;

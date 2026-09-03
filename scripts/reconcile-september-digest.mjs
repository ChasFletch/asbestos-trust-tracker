import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

const root = process.cwd();
const files = {
  local: resolve(root, "client/src/data/trust-figures.json"),
  repository: "/home/ubuntu/upload/trust-figures-repo-2026-09-03.json",
  candidate: "/home/ubuntu/upload/trust-figures-updated-2026-09-03.json",
};

const load = async (path) => JSON.parse(await readFile(path, "utf8"));
const summarize = (data) => {
  const trusts = data.trusts ?? [];
  const confidence = Object.fromEntries(
    ["filed", "secondary", "estimated"].map((level) => [level, trusts.filter((trust) => trust.confidence === level).length])
  );
  const nonZeroAssets = trusts.filter((trust) => typeof trust.netAssets === "number" && trust.netAssets > 0);
  const assetTotal = nonZeroAssets.reduce((sum, trust) => sum + trust.netAssets, 0);
  const abb = trusts.find((trust) => trust.name === "ABB Lummus Global Inc. 524(g) Asbestos PI Trust");

  return {
    asOf: data.asOf,
    trustCount: trusts.length,
    aggregateFloor: data.aggregate?.remainingAssetsPoint,
    recomputedAssetFloor: assetTotal,
    trustsWithFigures: nonZeroAssets.length,
    confidence,
    abb: abb && {
      netAssets: abb.netAssets,
      assetsAsOf: abb.assetsAsOf,
      paymentPercentage: abb.paymentPercentage,
      confidence: abb.confidence,
      sourceUrl: abb.sourceUrl,
    },
    septemberChanges: (data.changes ?? []).filter((change) => change.date === "2026-09-03"),
  };
};

const [local, repository, candidate] = await Promise.all(Object.values(files).map(load));
const report = {
  local: summarize(local),
  repository: summarize(repository),
  candidate: summarize(candidate),
  localMatchesCandidate: JSON.stringify(local) === JSON.stringify(candidate),
};

console.log(JSON.stringify(report, null, 2));

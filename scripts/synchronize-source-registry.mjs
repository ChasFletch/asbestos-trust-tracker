import { runDailySourceDetection, synchronizeSourceRegistry } from "../server/operationsPilot.ts";

const result = await synchronizeSourceRegistry();
const requestedCheck = process.argv.slice(2).filter((value) => value !== "--check");
const checkResult = process.argv.includes("--check") && requestedCheck.length > 0
  ? await runDailySourceDetection({
    force: true,
    scanAllSources: true,
    limit: requestedCheck.length,
    trustSlugs: requestedCheck,
  })
  : null;

console.log(JSON.stringify({ ...result, checkResult }, null, 2));

if (result.unresolvedSourceGaps.length > 0) {
  process.exitCode = 1;
}

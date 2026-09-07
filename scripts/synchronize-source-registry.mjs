import { synchronizeSourceRegistry } from "../server/operationsPilot.ts";

const result = await synchronizeSourceRegistry();
console.log(JSON.stringify(result, null, 2));

if (result.unresolvedSourceGaps.length > 0) {
  process.exitCode = 1;
}

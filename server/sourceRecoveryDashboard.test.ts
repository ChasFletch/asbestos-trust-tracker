import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { HISTORICAL_SOURCE_BACKLOG, monthlyHistoricalSourceWorklist } from "../shared/historicalSourceBacklog";

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

  it("renders bounded recovery language and live registry status rather than unverified trust facts", () => {
    expect(pageSource).toContain("research progress—not new trust facts");
    expect(pageSource).toContain("Access is not substance");
    expect(pageSource).toContain("Source reachable");
    expect(pageSource).toContain("Access attention");
    expect(pageSource).toContain("Open monitored public source");
    expect(pageSource).toContain("no-charge research cycle");
  });

  it("is publicly queryable, server-rendered, canonicalized, and indexed", () => {
    expect(routerSource).toContain("recoveryDashboard: publicProcedure.query");
    expect(prefetchSource).toContain('clean === "/source-recovery"');
    expect(prefetchSource).toContain("Historical Source Recovery");
    expect(sitemap).toContain("https://asbestostrusts.org/source-recovery");
  });
});

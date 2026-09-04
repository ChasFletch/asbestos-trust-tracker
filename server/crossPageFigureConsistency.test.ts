import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import * as React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { ClockFigureSummary } from "../client/src/components/ClockFigureSummary";
import trustFigures from "../client/src/data/trust-figures.json";

const projectRoot = resolve(import.meta.dirname, "..");
const readProjectFile = (relativePath: string) => readFileSync(resolve(projectRoot, relativePath), "utf8");
const currency = (value: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value);
const formatAsOfDate = (value: string) =>
  new Intl.DateTimeFormat("en-US", { month: "long", day: "numeric", year: "numeric", timeZone: "UTC" })
    .format(new Date(`${value}T00:00:00Z`));

// Vitest uses the classic JSX test runtime for imported components.
(globalThis as typeof globalThis & { React?: typeof React }).React = React;

describe("cross-page figure consistency", () => {
  const methodology = readProjectFile("client/src/pages/Methodology.tsx");
  const home = readProjectFile("client/src/pages/Home.tsx");
  const embed = readProjectFile("client/src/pages/EmbedClock.tsx");
  const prefetch = readProjectFile("client/src/ssr/prefetch.ts");
  const llms = readProjectFile("client/public/llms.txt");
  const router = readProjectFile("server/routers.ts");
  const scheduledMonitor = readProjectFile("server/scheduledJobs.ts");

  const activeTrusts = trustFigures.trusts.filter(
    (trust) => trust.status === "active" || trust.status === "active_deferral"
  );
  const trustsWithAssets = trustFigures.trusts.filter(
    (trust) => trust.netAssets != null && trust.status !== "closed"
  );
  const assetYears = trustsWithAssets
    .map((trust) => Number(trust.assetsAsOf?.slice(0, 4)))
    .filter((year) => Number.isInteger(year));
  const remainingAssets = trustFigures.aggregate.remainingAssetsPoint;
  const payouts = trustFigures.aggregate.cumulativePayoutsBottomUp;
  const asOf = trustFigures.asOf;
  const coverage = `Documented floor: ${currency(remainingAssets)} across ${trustsWithAssets.length} of ${activeTrusts.length} active tracker records.`;
  const dateScope = `FY${Math.min(...assetYears)}–FY${Math.max(...assetYears)}`;

  it("reconstructs the public documented-assets floor and coverage denominator from canonical trust rows", () => {
    const assetSum = trustsWithAssets.reduce((sum, trust) => sum + (trust.netAssets ?? 0), 0);

    expect(assetSum).toBe(remainingAssets);
    expect(trustsWithAssets).toHaveLength(trustFigures.aggregate.trustsWithFigures);
    expect(activeTrusts).toHaveLength(trustFigures.aggregate.activeTrustsTracked);
    expect(trustFigures.aggregate.trustsHistoricallyEstablishedEstimated).toBe(60);
    expect((trustFigures.aggregate as Record<string, unknown>).activeTrustsEstimated).toBeUndefined();
    expect(assetYears.length).toBeGreaterThan(0);
  });

  it("renders the canonical figure, coverage, and date scope in the server-visible clock summary", () => {
    const html = renderToStaticMarkup(
      React.createElement(ClockFigureSummary, {
        remaining: remainingAssets,
        payouts,
        lastUpdated: asOf,
        documentedAssetTrusts: trustsWithAssets.length,
        activeTrustsTracked: activeTrusts.length,
        assetDataRange: dateScope,
      })
    );

    expect(html).toContain(currency(remainingAssets));
    expect(html).toContain(currency(payouts));
    expect(html).toContain(coverage);
    expect(html).toContain(`Snapshot refreshed ${formatAsOfDate(asOf)}; underlying asset figures span ${dateScope}.`);
  });

  it("keeps reader-facing, structured-data, and crawler guidance synchronized to the canonical snapshot", () => {
    expect(methodology).toContain(`As of ${formatAsOfDate(asOf)}, the documented asset floor is`);
    expect(methodology).toContain(currency(remainingAssets));
    expect(methodology).toContain(`across ${trustsWithAssets.length} of the tracker&apos;s ${activeTrusts.length} active records`);

    expect(prefetch).toContain(`As of ${formatAsOfDate(asOf)}, the documented remaining-assets floor`);
    expect(prefetch).toContain(currency(remainingAssets));
    expect(prefetch).toContain(`${trustsWithAssets.length} of the tracker’s ${activeTrusts.length} active records`);

    expect(llms).toContain(`## Canonical Figures (as of ${asOf})`);
    expect(llms).toContain(currency(remainingAssets));
    expect(llms).toContain(`${trustsWithAssets.length} of ${activeTrusts.length} active tracker records`);
    expect(llms).toContain("trusts historically established");
  });

  it("uses the shared summary and data-derived active count for homepage, embed, aggregate API, and crawler monitoring", () => {
    expect(home).toContain("<ClockFigureSummary");
    expect(home).toContain("activeTrustsTracked={activeTrustsTracked}");
    expect(embed).toContain("<ClockFigureSummary");
    expect(embed).toContain("activeTrustsTracked={activeTrustsTracked}");
    expect(router).toContain('trust.status === "active" || trust.status === "active_deferral"');
    expect(router).toContain("totalActiveTrusts: activeTrustsTracked || 54");
    expect(router).toContain("totalTrustsHistoricallyEstablished: agg.trustsHistoricallyEstablishedEstimated ?? 60");
    expect(scheduledMonitor).toContain('trust.status === "active" || trust.status === "active_deferral"');
    expect(scheduledMonitor).toContain("of ${activeTrustsTracked} active tracker records.");
  });
});

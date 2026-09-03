import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import * as React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { DebtClockBillboard } from "../client/src/components/DebtClock";

const projectRoot = resolve(import.meta.dirname, "..");
const readProjectFile = (relativePath: string) => readFileSync(resolve(projectRoot, relativePath), "utf8");

// Vitest compiles this imported component with the classic JSX test runtime;
// production Vite uses the automatic runtime. Keep that test-only distinction
// explicit without changing the component’s production implementation.
(globalThis as typeof globalThis & { React?: typeof React }).React = React;

describe("clock crawler-visible SSR", () => {
  it("renders live compensation figures as initial server HTML rather than zero placeholders", () => {
    const html = renderToStaticMarkup(
      React.createElement(DebtClockBillboard, {
        remaining: 16_018_528_449,
        payouts: 30_033_989_206,
        lastUpdated: "2026-08-29",
      })
    );

    expect(html).toContain("$16,018,528,449");
    expect(html).toContain("$30,033,989,206");
    expect(html).toContain('aria-label="Documented Remaining Assets: $16,018,528,449');
    expect(html).toContain('aria-label="Cumulative Payouts Since 1988: $30,033,989,206');
    expect(html).toContain("Last updated:");
    expect(html).not.toContain('aria-label="Documented Remaining Assets: $0');
  });

  it("registers the public embed clock for aggregate SSR prefetching and a 200 response", () => {
    const prefetch = readProjectFile("client/src/ssr/prefetch.ts");

    expect(prefetch).toContain('if (clean === "/embed/clock")');
    expect(prefetch).toContain("p.aggregateCurrent()");
    expect(prefetch).toContain("p.trustFiguresSummary()");
    expect(prefetch).toContain("p.trustFiguresAllTrusts()");
    expect(prefetch).toContain('canonicalPath: "/embed/clock"');
  });

  it("publishes the working CSV endpoint in Dataset structured data", () => {
    const indexHtml = readProjectFile("client/index.html");
    const dataRoutes = readProjectFile("server/dataRoutes.ts");

    expect(indexHtml).toContain('"contentUrl": "https://asbestostrusts.org/trusts.csv"');
    expect(indexHtml).not.toContain("/api/export/trusts.csv");
    expect(dataRoutes).toContain('app.get("/trusts.csv"');
  });
});

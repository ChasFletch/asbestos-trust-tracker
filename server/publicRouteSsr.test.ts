import { QueryClient } from "@tanstack/react-query";
import { getQueryKey } from "@trpc/react-query";
import { describe, expect, it } from "vitest";
import { prefetchForPath, type SsrPrefetch } from "../client/src/ssr/prefetch";
import { trpc } from "../client/src/lib/trpc";
import { NEWS_DRAFTS_QUERY_KEY } from "../shared/newsDrafts";
import { createReportContent, reportContentQueryKey } from "../shared/reportContent";
import { OFFICIAL_PAYMENT_NOTICES } from "../client/src/data/paymentNoticeHistory";
import { readFileSync } from "node:fs";

function prefetch(overrides: Partial<SsrPrefetch> = {}): SsrPrefetch {
  return {
    aggregateCurrent: async () => ({} as any),
    newsList: async () => [],
    trustFiguresSummary: async () => ({ asOf: null, topTrusts: [] }),
    trustFiguresAllTrusts: async () => ({ asOf: null, trusts: [] }),
    trustFiguresBySlug: async () => null,
    trustsList: async () => [],
    trustsBySlug: async () => null,
    reportsIndex: async () => ({ reports: [] }),
    recoveryDashboard: async () => ({} as any),
    newsDrafts: async () => [],
    reportContent: async () => null,
    ...overrides,
  };
}

describe("public-route initial HTML delivery", () => {
  it("seeds the exact News database and draft keys before rendering", async () => {
    const qc = new QueryClient();
    const news = [{ id: 1, title: "Existing database card" }] as any;
    const drafts = [{ filename: "2026-10-01-existing.md", title: "Existing weekly card", date: "2026-10-01", summary: "Existing summary.", category: "system_update" }];
    const head = await prefetchForPath("/news", qc, prefetch({ newsList: async () => news, newsDrafts: async () => drafts }));
    expect(head.canonicalPath).toBe("/news");
    expect(qc.getQueryData(getQueryKey(trpc.news.list, { limit: 50, category: undefined }, "query"))).toEqual(news);
    expect(qc.getQueryData(NEWS_DRAFTS_QUERY_KEY)).toEqual(drafts);
  });

  it("seeds a report's complete body and refuses a successful empty shell", async () => {
    const report = { id: "ATR-2026-Q3", title: "Existing report", date: "2026-07-28", asOf: "2026-07-28", path: "reports/existing.md", summary: null, highlights: [] };
    const qc = new QueryClient();
    const content = createReportContent(report.id, report, "# Existing report\n\nComplete existing body.")!;
    const p = prefetch({ reportsIndex: async () => ({ reports: [report] }), reportContent: async () => content });
    const head = await prefetchForPath(`/reports/${report.id}`, qc, p);
    expect(head.notFound).not.toBe(true);
    expect(qc.getQueryData(reportContentQueryKey(report.id))).toEqual(content);
    await expect(prefetchForPath(`/reports/${report.id}`, new QueryClient(), { ...p, reportContent: async () => null })).rejects.toThrow("Report body unavailable");
  });

  it("identifies unknown routes and unknown detail identifiers as not found", async () => {
    for (const path of ["/not-a-real-page", "/trusts/not-a-trust", "/reports/NOT-A-REPORT", "/news/not-an-article", "/embed/clock/unknown"]) {
      const head = await prefetchForPath(path, new QueryClient(), prefetch());
      expect(head.notFound, path).toBe(true);
      expect(head.canonicalPath, path).toBeUndefined();
    }
  });

  it("uses the full trust name for canonical and JSON-LD even for a supported short alias", async () => {
    const head = await prefetchForPath("/trusts/artra", new QueryClient(), prefetch({
      trustFiguresBySlug: async () => ({ name: "ARTRA 524(g) Asbestos Trust", paymentPercentage: 0.7, paymentPctEffective: "2025-04-01", netAssets: null }) as any,
    }));
    expect(head.canonicalPath).toBe("/trusts/artra-524-g-asbestos-trust");
    expect(JSON.stringify(head.jsonLd)).not.toContain('"https://asbestostrusts.org/trusts/artra"');
  });

  it("repairs only existing canonical notice destinations", () => {
    const values: Record<string, string> = {
      "artra-2025-04-01": "artra-524-g-asbestos-trust",
      "owens-illinois-2026-08-19": "paddock-enterprises-owens-illinois-asbestos-trust",
      "pittsburgh-corning-2024-11-07": "pittsburgh-corning-asbestos-pi-settlement-trust",
    };
    const figures = JSON.parse(readFileSync(new URL("../client/src/data/trust-figures.json", import.meta.url), "utf8"));
    const slugs = new Set(figures.trusts.map((t: { name: string }) => t.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")));
    for (const [id, slug] of Object.entries(values)) {
      expect(OFFICIAL_PAYMENT_NOTICES.find((n) => n.id === id)?.trustSlug).toBe(slug);
      expect(slugs.has(slug)).toBe(true);
    }
  });
});

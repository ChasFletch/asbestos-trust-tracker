import type { QueryClient } from "@tanstack/react-query";
import { getQueryKey } from "@trpc/react-query";
import type { inferRouterOutputs } from "@trpc/server";
import { trpc } from "@/lib/trpc";
import { SITE_NAME, SITE_TITLE, SITE_DESC } from "@shared/const";
import type { AppRouter } from "../../../server/routers";

export type HeadMeta = {
  title: string;
  description: string;
  ogType?: "website" | "article";
  ogImage?: string;
  ogImageWidth?: number;
  ogImageHeight?: number;
  ogImageAlt?: string;
  publishedTime?: string;
  modifiedTime?: string;
  canonicalPath?: string;
  locale?: string;
  noindex?: boolean;
  notFound?: boolean;
};

type RO = inferRouterOutputs<AppRouter>;

export type SsrPrefetch = {
  aggregateCurrent: () => Promise<RO["aggregate"]["current"]>;
  newsList: (input?: { limit?: number }) => Promise<RO["news"]["list"]>;
  trustFiguresSummary: () => Promise<RO["trustFigures"]["summary"]>;
  trustFiguresAllTrusts: () => Promise<RO["trustFigures"]["allTrusts"]>;
  trustFiguresBySlug: (slug: string) => Promise<RO["trustFigures"]["bySlug"]>;
  trustsList: () => Promise<RO["trusts"]["list"]>;
  trustsBySlug: (slug: string) => Promise<RO["trusts"]["bySlug"]>;
  reportsIndex: () => Promise<RO["trustFiguresExtra"]["reportsIndex"]>;
};

async function seed(qc: QueryClient, key: unknown, data: unknown) {
  qc.setQueryData(key as any, data);
}

const SITE = SITE_TITLE;
const DESC = SITE_DESC;

export async function prefetchForPath(url: string, qc: QueryClient, p: SsrPrefetch): Promise<HeadMeta> {
  let pathOnly = url.split("?")[0];
  try { pathOnly = decodeURI(pathOnly); } catch { /* malformed */ }
  const clean = pathOnly.replace(/\/+$/, "") || "/";

  // ── Home (/): prefetch aggregate + news + trust figures ──────────────────
  if (clean === "/") {
    const [agg, news, summary, allTrusts] = await Promise.all([
      p.aggregateCurrent(),
      p.newsList({ limit: 3 }),
      p.trustFiguresSummary(),
      p.trustFiguresAllTrusts(),
    ]);
    await seed(qc, getQueryKey(trpc.aggregate.current, undefined, "query"), agg);
    await seed(qc, getQueryKey(trpc.news.list, { limit: 3 }, "query"), news);
    await seed(qc, getQueryKey(trpc.trustFigures.summary, undefined, "query"), summary);
    await seed(qc, getQueryKey(trpc.trustFigures.allTrusts, undefined, "query"), allTrusts);
    return {
      title: SITE,
      description: DESC,
      ogType: "website",
      canonicalPath: "/",
    };
  }

  // ── Trust list (/trusts) ─────────────────────────────────────────────────
  if (clean === "/trusts") {
    const [allTrusts, trusts] = await Promise.all([
      p.trustFiguresAllTrusts(),
      p.trustsList(),
    ]);
    await seed(qc, getQueryKey(trpc.trustFigures.allTrusts, undefined, "query"), allTrusts);
    await seed(qc, getQueryKey(trpc.trusts.list, undefined, "query"), trusts);
    return {
      title: `Trust Fund Data · ${SITE_NAME}`,
      description: "Primary-sourced data on all active U.S. asbestos bankruptcy trust funds — net assets, payment percentages, cumulative payouts, and court docket references.",
      ogType: "website",
      canonicalPath: "/trusts",
    };
  }

  // ── Trust detail (/trusts/:slug) ─────────────────────────────────────────
  const trustMatch = clean.match(/^\/trusts\/([^/]+)$/);
  if (trustMatch) {
    const slug = trustMatch[1];
    const [jsonTrust, dbTrust] = await Promise.all([
      p.trustFiguresBySlug(slug),
      p.trustsBySlug(slug),
    ]);
    if (!jsonTrust) {
      return { title: SITE, description: DESC, notFound: true };
    }
    await seed(qc, getQueryKey(trpc.trustFigures.bySlug, { slug }, "query"), jsonTrust);
    await seed(qc, getQueryKey(trpc.trusts.bySlug, { slug }, "query"), dbTrust);
    const pct = jsonTrust.paymentPercentage !== null ? ` · ${jsonTrust.paymentPercentage}% payment` : "";
    const assets = jsonTrust.netAssets ? ` · $${(jsonTrust.netAssets / 1e9).toFixed(2)}B assets` : "";
    return {
      title: `${jsonTrust.name} · AsbestosTrusts.org`,
      description: `${jsonTrust.name} asbestos trust fund data${pct}${assets}. Primary-sourced from court filings and TDP documents.`,
      ogType: "article",
      canonicalPath: `/trusts/${slug}`,
    };
  }

  // ── News (/news) ─────────────────────────────────────────────────────────
  if (clean === "/news") {
    const news = await p.newsList({ limit: 50 });
    await seed(qc, getQueryKey(trpc.news.list, { limit: 50 }, "query"), news);
    return {
      title: `Trust Fund News · ${SITE_NAME}`,
      description: "Latest updates on U.S. asbestos trust fund payment changes, annual reports, and court filings.",
      ogType: "website",
      canonicalPath: "/news",
    };
  }

  // ── Reports (/reports) ───────────────────────────────────────────────────
  if (clean === "/reports") {
    const reports = await p.reportsIndex();
    await seed(qc, getQueryKey(trpc.trustFiguresExtra.reportsIndex, undefined, "query"), reports);
    return {
      title: `Research Reports · ${SITE_NAME}`,
      description: "In-depth research reports on U.S. asbestos trust fund assets, payment trends, and litigation data.",
      ogType: "website",
      canonicalPath: "/reports",
    };
  }

  // ── Report detail (/reports/:id) ─────────────────────────────────────────
  const reportMatch = clean.match(/^\/reports\/([^/]+)$/);
  if (reportMatch) {
    const id = reportMatch[1];
    const reports = await p.reportsIndex();
    await seed(qc, getQueryKey(trpc.trustFiguresExtra.reportsIndex, undefined, "query"), reports);
    const report = reports.reports.find((r: { id: string }) => r.id === id);
    if (!report) {
      return { title: SITE, description: DESC, notFound: true };
    }
    return {
      title: `${report.title} · ${SITE_NAME}`,
      description: report.summary ?? DESC,
      ogType: "article",
      canonicalPath: `/reports/${id}`,
      publishedTime: report.date,
    };
  }

  // ── Static pages ─────────────────────────────────────────────────────────
  if (clean === "/methodology") {
    return {
      title: `Methodology · ${SITE_NAME}`,
      description: "How AsbestosTrusts.org collects, classifies, and cites trust fund data — source hierarchy, confidence levels, and update cadence.",
      canonicalPath: "/methodology",
    };
  }
  if (clean === "/about") {
    return {
      title: `About · ${SITE_NAME}`,
      description: "About AsbestosTrusts.org — an independent public research platform tracking U.S. asbestos bankruptcy trust funds.",
      canonicalPath: "/about",
    };
  }
  if (clean === "/corrections") {
    return {
      title: `Corrections · ${SITE_NAME}`,
      description: "Corrections and updates to AsbestosTrusts.org data. We publish corrections promptly and transparently.",
      canonicalPath: "/corrections",
    };
  }

  // ── 404 ──────────────────────────────────────────────────────────────────
  return { title: SITE, description: DESC, notFound: true };
}

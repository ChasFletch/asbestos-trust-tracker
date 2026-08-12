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
  jsonLd?: Record<string, unknown> | Record<string, unknown>[];
  keywords?: string;
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
      keywords: "asbestos trust fund, payment percentage, mesothelioma compensation, bankruptcy trust, trust fund assets, asbestos claims, trust fund payout",
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
      jsonLd: [
        {
          "@context": "https://schema.org",
          "@type": "Article",
          "headline": `${jsonTrust.name} — Trust Fund Data`,
          "description": `${jsonTrust.name} asbestos trust fund data${pct}${assets}. Primary-sourced from court filings and TDP documents.`,
          "url": `https://asbestostrusts.org/trusts/${slug}`,
          "mainEntityOfPage": `https://asbestostrusts.org/trusts/${slug}`,
          "author": [
            { "@id": "https://asbestostrusts.org/#paul-danziger" },
            { "@id": "https://asbestostrusts.org/#rod-de-llano" }
          ],
          "publisher": { "@id": "https://asbestostrusts.org/#org" },
          "isPartOf": { "@id": "https://asbestostrusts.org/#website" },
          "about": {
            "@type": "GovernmentService",
            "name": jsonTrust.name,
            "description": "U.S. asbestos bankruptcy trust fund established under Section 524(g)"
          }
        },
        {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://asbestostrusts.org/" },
            { "@type": "ListItem", "position": 2, "name": "Trust Data", "item": "https://asbestostrusts.org/trusts" },
            { "@type": "ListItem", "position": 3, "name": jsonTrust.shortName ?? jsonTrust.name, "item": `https://asbestostrusts.org/trusts/${slug}` }
          ]
        }
      ],
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
      jsonLd: [
        {
          "@context": "https://schema.org",
          "@type": "ScholarlyArticle",
          "headline": report.title,
          "description": report.summary ?? DESC,
          "url": `https://asbestostrusts.org/reports/${id}`,
          "mainEntityOfPage": `https://asbestostrusts.org/reports/${id}`,
          "datePublished": report.date,
          "author": [
            { "@id": "https://asbestostrusts.org/#paul-danziger" },
            { "@id": "https://asbestostrusts.org/#rod-de-llano" }
          ],
          "publisher": { "@id": "https://asbestostrusts.org/#org" },
          "about": "U.S. asbestos bankruptcy trust funds"
        },
        {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://asbestostrusts.org/" },
            { "@type": "ListItem", "position": 2, "name": "Reports", "item": "https://asbestostrusts.org/reports" },
            { "@type": "ListItem", "position": 3, "name": report.title, "item": `https://asbestostrusts.org/reports/${id}` }
          ]
        }
      ],
    };
  }

  // ── Static pages ─────────────────────────────────────────────────────────
  if (clean === "/methodology") {
    return {
      title: `Methodology · ${SITE_NAME}`,
      description: "How AsbestosTrusts.org collects, classifies, and cites trust fund data — source hierarchy, confidence levels, and update cadence.",
      canonicalPath: "/methodology",
      jsonLd: [
        {
          "@context": "https://schema.org",
          "@type": "TechArticle",
          "headline": "Methodology — AsbestosTrusts.org",
          "description": "How AsbestosTrusts.org collects, classifies, and cites trust fund data — source hierarchy, confidence levels, and update cadence.",
          "url": "https://asbestostrusts.org/methodology",
          "author": [
            { "@id": "https://asbestostrusts.org/#paul-danziger" },
            { "@id": "https://asbestostrusts.org/#rod-de-llano" }
          ],
          "publisher": { "@id": "https://asbestostrusts.org/#org" }
        },
        {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": [
            { "@type": "Question", "name": "How much money is left in asbestos trust funds?", "acceptedAnswer": { "@type": "Answer", "text": "As of July 2026, the documented remaining assets floor of the U.S. asbestos bankruptcy trust system is $16,746,136,347, based on filed figures from 42 trusts. This is a floor, not a ceiling — trusts with no retrievable filed figure are excluded. Source: AsbestosTrusts.org." } },
            { "@type": "Question", "name": "Is the $30 billion asbestos trust fund figure accurate?", "acceptedAnswer": { "@type": "Answer", "text": "The '$30 billion available in asbestos trust funds' figure that circulates on law firm sites refers to total capitalization since 1988, not remaining assets. Remaining assets as of 2026 are approximately $16.7B (documented floor). Separately, our bottom-up estimate of cumulative payouts since 1988 is $29,981,797,653 — which is also approximately $30B. This is a coincidence of scale: the two figures measure completely different things." } },
            { "@type": "Question", "name": "How many asbestos trust funds exist in the United States?", "acceptedAnswer": { "@type": "Answer", "text": "AsbestosTrusts.org documents 42 U.S. asbestos bankruptcy trusts established under §524(g) of the Bankruptcy Code. As of June 2025, 41 are active and 1 (Rapid-American) has been depleted and closed." } },
            { "@type": "Question", "name": "What is a payment percentage in an asbestos trust?", "acceptedAnswer": { "@type": "Answer", "text": "A payment percentage is the fraction of the scheduled value of an approved asbestos claim that the trust actually pays. Payment percentages range from 4.3% (Babcock & Wilcox) to 100% (NARCO) as of 2026." } },
            { "@type": "Question", "name": "How much has been paid out from asbestos trust funds?", "acceptedAnswer": { "@type": "Answer", "text": "The bottom-up estimate for cumulative payouts since 1988 is $29,981,797,653 — built from 14 filed annual reports ($19,810,476,508), 5 secondary-citing-filed components ($6,671,321,145), and a labeled residual allowance of ~$3.5B for ~25 trusts with no public figures. Source: AsbestosTrusts.org." } },
            { "@type": "Question", "name": "Which asbestos trust fund has the most money?", "acceptedAnswer": { "@type": "Answer", "text": "As of 2026, the W.R. Grace Asbestos PI Trust has the largest documented net assets at approximately $1.995 billion. The NARCO Asbestos Trust has $1.260 billion (filed, December 2025), and Pittsburgh Corning has $1.294 billion." } },
            { "@type": "Question", "name": "What is the source classification system used by AsbestosTrusts.org?", "acceptedAnswer": { "@type": "Answer", "text": "AsbestosTrusts.org uses three tiers: (a) Filed Court Document — drawn directly from a U.S. bankruptcy court filing; (b) Secondary Source Citing Primary — a secondary source that explicitly cites a primary filing; (c) Estimate or Inference — derived from available data or actuarial projections." } }
          ]
        }
      ],
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

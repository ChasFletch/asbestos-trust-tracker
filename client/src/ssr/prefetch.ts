import type { QueryClient } from "@tanstack/react-query";
import { getQueryKey } from "@trpc/react-query";
import type { inferRouterOutputs } from "@trpc/server";
import { trpc } from "@/lib/trpc";
import { SITE_NAME, SITE_TITLE, SITE_DESC } from "@shared/const";
import type { AppRouter } from "../../../server/routers";
import { NEWS_BRIEFS_BY_SLUG } from "@/data/newsBriefs";
import { getRelatedReportIdsForTrust } from "@/data/reportRelations";

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

  // ── Embeddable clock (/embed/clock) ───────────────────────────────────────
  // The iframe is public and needs the same aggregate snapshot as the homepage
  // so its initial server HTML contains the live counter values and returns 200.
  if (clean === "/embed/clock") {
    const [agg, summary, allTrusts] = await Promise.all([
      p.aggregateCurrent(),
      p.trustFiguresSummary(),
      p.trustFiguresAllTrusts(),
    ]);
    await seed(qc, getQueryKey(trpc.aggregate.current, undefined, "query"), agg);
    await seed(qc, getQueryKey(trpc.trustFigures.summary, undefined, "query"), summary);
    await seed(qc, getQueryKey(trpc.trustFigures.allTrusts, undefined, "query"), allTrusts);
    return {
      title: `Embeddable Asbestos Trust Fund Clock · ${SITE_NAME}`,
      description: "Live, source-classified U.S. asbestos bankruptcy trust fund figures from AsbestosTrusts.org.",
      ogType: "website",
      canonicalPath: "/embed/clock",
      keywords: "asbestos trust fund clock, asbestos compensation data, bankruptcy trust fund figures",
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
      keywords: "asbestos trust fund data, payment percentage table, trust fund net assets, bankruptcy trust list, asbestos claims database",
    };
  }

  // ── Trust detail (/trusts/:slug) ─────────────────────────────────────────
  const trustMatch = clean.match(/^\/trusts\/([^/]+)$/);
  if (trustMatch) {
    const slug = trustMatch[1];
    const reportIds = getRelatedReportIdsForTrust(slug);
    const [jsonTrust, dbTrust, reports] = await Promise.all([
      p.trustFiguresBySlug(slug),
      p.trustsBySlug(slug),
      reportIds.length > 0 ? p.reportsIndex() : Promise.resolve(null),
    ]);
    if (!jsonTrust) {
      return { title: SITE, description: DESC, notFound: true };
    }
    await seed(qc, getQueryKey(trpc.trustFigures.bySlug, { slug }, "query"), jsonTrust);
    await seed(qc, getQueryKey(trpc.trusts.bySlug, { slug }, "query"), dbTrust);
    if (reports) {
      await seed(qc, getQueryKey(trpc.trustFiguresExtra.reportsIndex, undefined, "query"), reports);
    }
    const pct = jsonTrust.paymentPercentage !== null ? ` · ${jsonTrust.paymentPercentage}% payment` : "";
    const assets = jsonTrust.netAssets ? ` · $${(jsonTrust.netAssets / 1e9).toFixed(2)}B assets` : "";
    return {
      title: `${jsonTrust.name} · AsbestosTrusts.org`,
      description: `${jsonTrust.name} asbestos trust fund data${pct}${assets}. Primary-sourced from court filings and TDP documents.`,
      ogType: "article",
      canonicalPath: `/trusts/${slug}`,
      keywords: `${jsonTrust.shortName ?? jsonTrust.name}, asbestos trust fund, payment percentage, scheduled value, trust distribution procedure`,
      jsonLd: [
        {
          "@context": "https://schema.org",
          "@type": "Article",
          "headline": `${jsonTrust.name} — Trust Fund Data`,
          "description": `${jsonTrust.name} asbestos trust fund data${pct}${assets}. Primary-sourced from court filings and TDP documents.`,
          "url": `https://asbestostrusts.org/trusts/${slug}`,
          "mainEntityOfPage": `https://asbestostrusts.org/trusts/${slug}`,
          "author": { "@id": "https://asbestostrusts.org/#org" },
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
      keywords: "asbestos trust news, payment percentage change, trust fund update, bankruptcy court filing, annual report",
    };
  }

  // ── News detail (/news/:slug) ───────────────────────────────────────────
  const newsBriefMatch = clean.match(/^\/news\/([^/]+)$/);
  if (newsBriefMatch) {
    const slug = newsBriefMatch[1];
    const brief = NEWS_BRIEFS_BY_SLUG[slug];
    if (!brief) return { title: SITE, description: DESC, notFound: true };
    return {
      title: `${brief.title} · ${SITE_NAME}`,
      description: brief.summary,
      ogType: "article",
      canonicalPath: `/news/${slug}`,
      publishedTime: brief.date,
      keywords: brief.keywords ?? "asbestos trust news, bankruptcy court filing, asbestos claim update",
      jsonLd: [
        {
          "@context": "https://schema.org",
          "@type": "NewsArticle",
          "headline": brief.title,
          "description": brief.summary,
          "url": `https://asbestostrusts.org/news/${slug}`,
          "mainEntityOfPage": `https://asbestostrusts.org/news/${slug}`,
          "datePublished": brief.date,
          "author": { "@id": "https://asbestostrusts.org/#research-desk" },
          "publisher": { "@id": "https://asbestostrusts.org/#org" },
          "about": brief.about ?? brief.title
        },
        {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://asbestostrusts.org/" },
            { "@type": "ListItem", "position": 2, "name": "News", "item": "https://asbestostrusts.org/news" },
            { "@type": "ListItem", "position": 3, "name": brief.title, "item": `https://asbestostrusts.org/news/${slug}` }
          ]
        }
      ],
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
      keywords: "asbestos trust research, trust fund analysis, payment trend report, litigation data, mesothelioma compensation research",
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
          "author": { "@id": "https://asbestostrusts.org/#research-desk" },
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
      keywords: "asbestos trust methodology, data sourcing, court filing verification, trust fund research method, source classification",
      jsonLd: [
        {
          "@context": "https://schema.org",
          "@type": "TechArticle",
          "headline": "Methodology — AsbestosTrusts.org",
          "description": "How AsbestosTrusts.org collects, classifies, and cites trust fund data — source hierarchy, confidence levels, and update cadence.",
          "url": "https://asbestostrusts.org/methodology",
          "author": { "@id": "https://asbestostrusts.org/#research-desk" },
          "publisher": { "@id": "https://asbestostrusts.org/#org" }
        },
        {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": [
            { "@type": "Question", "name": "How much money is left in asbestos trust funds?", "acceptedAnswer": { "@type": "Answer", "text": "As of August 29, 2026, the documented remaining assets floor of the U.S. asbestos bankruptcy trust system is $16,018,528,449 — the exact sum of the latest located net-asset figure for each of the 42 records that have one (18 from filed reports, 24 from secondary compilations citing filed reports). This is a floor, not a ceiling — records with no located figure are excluded. Source: AsbestosTrusts.org." } },
            { "@type": "Question", "name": "Is the $30 billion asbestos trust fund figure accurate?", "acceptedAnswer": { "@type": "Answer", "text": "No — not as a current balance. The circulating '$30 billion available' figure traces to Bates White/Mealey's consulting commentaries (Scarcella & Kelso, 2012–2013): ~$18B in confirmed trust assets plus ~$11–12B in proposed or pending funding, a 2012–13 snapshot that included trusts not yet in existence. Later citations stripped the date. Documented remaining assets as of August 29, 2026 are $16,018,528,449 (floor). Separately, our bottom-up estimate of cumulative payouts since 1988 is $30,033,989,206 — a similarly scaled but distinct flow measure." } },
            { "@type": "Question", "name": "How many asbestos trust funds exist in the United States?", "acceptedAnswer": { "@type": "Answer", "text": "AsbestosTrusts.org documents 55 U.S. asbestos bankruptcy trust records established under §524(g) of the Bankruptcy Code. As of August 2026, 54 are active (one with claims intake in deferral), and 1 (Rapid-American) has been depleted and closed. Approximately 60 trusts have been established in total (GAO-11-819)." } },
            { "@type": "Question", "name": "What is a payment percentage in an asbestos trust?", "acceptedAnswer": { "@type": "Answer", "text": "A payment percentage is the fraction of the scheduled value of an approved asbestos claim that the trust actually pays. Published payment percentages currently range from 0.7% (ARTRA) to 100% (NARCO) as of August 29, 2026. Owens-Illinois increased from 50% to 65% effective August 19, 2026." } },
            { "@type": "Question", "name": "How much has been paid out from asbestos trust funds?", "acceptedAnswer": { "@type": "Answer", "text": "The bottom-up estimate for cumulative payouts since 1988 is $30,033,989,206 — built from 12 trusts' filed or official inception-to-date figures ($17,124,219,757), 7 secondary-citing-filed components ($9,409,769,449), and a labeled residual allowance of ~$3.5B for trusts with no public figures. Source: AsbestosTrusts.org." } },
            { "@type": "Question", "name": "Which asbestos trust fund has the most money?", "acceptedAnswer": { "@type": "Answer", "text": "As of August 2026, the W.R. Grace Asbestos PI Trust has the largest documented net assets at $1,829,172,468 (filed FY2025 annual report). Pittsburgh Corning has $1.294 billion and the NARCO Asbestos Trust has $1.260 billion." } },
            { "@type": "Question", "name": "How many asbestos trusts does a typical claimant file with?", "acceptedAnswer": { "@type": "Answer", "text": "No public dataset can answer this — trusts see only their own claimants, and RAND states the figure cannot be computed from trust-level data (TR-872, 2010, p. xvii). The only measured figures are adversarial in origin: the 2014 Garlock ruling found a 'typical' claimant alleged exposure to 22 trusts with about $600,000 in trust recoveries (2010-era data, debtor's expert); a verified 2015 Mealey's study found an average of 18 trust claim forms actually filed in 1,844 Crane Co. cases (2007–2011); a 2024 Philadelphia study found claimants qualified for ~13 trusts. Marketing-site figures such as a '$41,000 average payout' or '$300,000–$400,000 total' are unsourced or misdescribed." } },
            { "@type": "Question", "name": "What is the source classification system used by AsbestosTrusts.org?", "acceptedAnswer": { "@type": "Answer", "text": "AsbestosTrusts.org uses three tiers: (a) Filed Court Document — drawn directly from a U.S. bankruptcy court filing; (b) Secondary Source Citing Primary — a secondary source that explicitly cites a primary filing; (c) Estimate or Inference — derived from available data or actuarial projections." } }
          ]
        }
      ],
    };
  }
  if (clean === "/provenance") {
    return {
      title: `Figure Provenance Timeline · ${SITE_NAME}`,
      description: "A public, source-linked history of major AsbestosTrusts.org asset and cumulative-payout figure revisions, including evidence classifications and change rationales.",
      canonicalPath: "/provenance",
      keywords: "asbestos trust figure history, data provenance, trust fund payout revisions, asset floor methodology, source verification timeline",
      jsonLd: [
        {
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          "name": "Figure Provenance Timeline",
          "description": "A public, source-linked history of major AsbestosTrusts.org asset and cumulative-payout figure revisions, including evidence classifications and change rationales.",
          "url": "https://asbestostrusts.org/provenance",
          "isPartOf": { "@id": "https://asbestostrusts.org/#website" },
          "publisher": { "@id": "https://asbestostrusts.org/#org" },
          "about": "Provenance and revisions for U.S. asbestos bankruptcy trust fund figures"
        },
        {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://asbestostrusts.org/" },
            { "@type": "ListItem", "position": 2, "name": "Methodology", "item": "https://asbestostrusts.org/methodology" },
            { "@type": "ListItem", "position": 3, "name": "Figure Provenance Timeline", "item": "https://asbestostrusts.org/provenance" }
          ]
        }
      ]
    };
  }
  if (clean === "/about") {
    return {
      title: `About · ${SITE_NAME}`,
      description: "About AsbestosTrusts.org — an independent public research platform tracking U.S. asbestos bankruptcy trust funds.",
      canonicalPath: "/about",
      keywords: "AsbestosTrusts.org, Danziger De Llano, asbestos trust research, independent legal research, Paul Danziger, Rod De Llano",
    };
  }
  if (clean === "/corrections") {
    return {
      title: `Corrections · ${SITE_NAME}`,
      description: "Corrections and updates to AsbestosTrusts.org data. We publish corrections promptly and transparently.",
      canonicalPath: "/corrections",
      keywords: "data corrections, asbestos trust updates, transparency, error reporting",
    };
  }

  // ── 404 ──────────────────────────────────────────────────────────────────
  return { title: SITE, description: DESC, notFound: true };
}

import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { protectedProcedure, publicProcedure, router } from "./_core/trpc";
import { fetchTrustFigures, fetchReportsIndex } from "./dataRoutes";
import {
  addNewsItem,
  addPaymentHistoryEntry,
  getAllPaymentHistory,
  getAllTrusts,
  getVisibleNews,
  markTrustStale,
  updateAggregate,
  updateTrust,
  upsertTrustFromPipeline,
} from "./db";

// ── JSON-first trust helpers ─────────────────────────────────────────────────
// trust-figures.json is the single source of truth for financials.
// DB retains supplementary metadata (administrator, court, payment history).

function slugify(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

async function loadJsonTrusts() {
  const data = (await fetchTrustFigures()) as any;
  return {
    asOf: (data?.asOf ?? null) as string | null,
    aggregate: data?.aggregate ?? {},
    trusts: (data?.trusts ?? []) as any[],
    changes: (data?.changes ?? []) as any[],
  };
}

async function buildTrustMergeMap() {
  const json = await loadJsonTrusts();
  const [dbTrusts, allHistory] = await Promise.all([getAllTrusts(), getAllPaymentHistory()]);

  const historyMap: Record<string, typeof allHistory> = {};
  for (const h of allHistory) {
    if (!historyMap[h.trustId]) historyMap[h.trustId] = [];
    historyMap[h.trustId].push(h);
  }

  const dbBySlug = new Map<string, (typeof dbTrusts)[number]>();
  for (const t of dbTrusts) {
    dbBySlug.set(t.id, t);
    dbBySlug.set(slugify(t.name), t);
    if (t.shortName) dbBySlug.set(slugify(t.shortName), t);
  }

  return { json, dbTrusts, dbBySlug, historyMap };
}

function mergeTrust(jsonTrust: any, dbTrust?: any, history?: any[]) {
  const slug = slugify(jsonTrust.name);
  return {
    id: slug,
    name: jsonTrust.name,
    shortName: jsonTrust.shortName ?? jsonTrust.name.split(" ").slice(0, 3).join(" "),
    company: dbTrust?.company ?? null,
    established: jsonTrust.established ?? dbTrust?.established ?? null,
    administrator: dbTrust?.administrator ?? null,
    court: dbTrust?.court ?? null,
    docket: dbTrust?.docket ?? null,
    website: dbTrust?.website ?? null,
    // ── Financials: JSON is authoritative ──
    paymentPct: jsonTrust.paymentPercentage ?? null,
    paymentPctFB: (jsonTrust as any).paymentPercentageFB ?? null,
    paymentPctEffective: dbTrust?.paymentPctEffective ?? null,
    netAssets: jsonTrust.netAssets ?? null,
    netAssetsAsOf: jsonTrust.assetsAsOf ?? null,
    netAssetsSource: jsonTrust.confidence === "filed" ? "a" : jsonTrust.confidence === "secondary" ? "b" : "c",
    netAssetsCitation: jsonTrust.assetsBasis ?? null,
    cumulativePaid: jsonTrust.cumulativePaid ?? dbTrust?.cumulativePaid ?? null,
    cumulativePaidAsOf: jsonTrust.cumulativePaidAsOf ?? null,
    cumulativePaidSource: jsonTrust.cumulativePaidSource ?? null,
    cumulativePaidSourceUrl: (jsonTrust as any).cumulativePaidSourceUrl ?? null,
    netAssetsCitationUrl: (jsonTrust as any).assetsBasisUrl ?? null,
    cumulativeClaims: dbTrust?.cumulativeClaims ?? null,
    reportingFrequency: dbTrust?.reportingFrequency ?? null,
    status: jsonTrust.status ?? "active",
    direction: dbTrust?.direction ?? null,
    confidence: jsonTrust.confidence ?? "c",
    note: jsonTrust.note ?? null,
    isStale: dbTrust?.isStale ?? false,
    paymentHistory: history ?? [],
  };
}

// Admin guard middleware
const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.role !== "admin") {
    throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
  }
  return next({ ctx });
});

export const appRouter = router({
  system: systemRouter,

  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),

  // ── Trusts (JSON-first; DB supplies metadata + payment history) ─────────────
  trusts: router({
    list: publicProcedure.query(async () => {
      const { json, dbBySlug, historyMap } = await buildTrustMergeMap();
      return json.trusts.map((jt: any) => {
        const slug = slugify(jt.name);
        const db = dbBySlug.get(slug) ?? dbBySlug.get(jt.name.toLowerCase());
        return mergeTrust(jt, db, historyMap[db?.id ?? ""] ?? []);
      });
    }),

    byId: publicProcedure
      .input(z.object({ id: z.string() }))
      .query(async ({ input }) => {
        const { json, dbBySlug, historyMap } = await buildTrustMergeMap();
        const jt = json.trusts.find((t: any) => slugify(t.name) === input.id || t.name.toLowerCase() === input.id);
        if (!jt) throw new TRPCError({ code: "NOT_FOUND" });
        const db = dbBySlug.get(input.id) ?? dbBySlug.get(jt.name.toLowerCase());
        return mergeTrust(jt, db, historyMap[db?.id ?? ""] ?? []);
      }),

    bySlug: publicProcedure
      .input(z.object({ slug: z.string() }))
      .query(async ({ input }) => {
        const { json, dbBySlug, historyMap } = await buildTrustMergeMap();
        const jt = json.trusts.find((t: any) => slugify(t.name) === input.slug || (t.shortName && slugify(t.shortName) === input.slug));
        if (!jt) return null;
        const db = dbBySlug.get(input.slug) ?? dbBySlug.get(jt.name.toLowerCase());
        return mergeTrust(jt, db, historyMap[db?.id ?? ""] ?? []);
      }),
  }),

  // ── Aggregate (JSON-first) ─────────────────────────────────────────────────
  aggregate: router({
    current: publicProcedure.query(async () => {
      const { asOf, aggregate: agg } = await loadJsonTrusts();
      return {
        remainingLow: agg.remainingAssetsPoint ?? 17041946126,
        remainingHigh: agg.remainingAssetsHigh ?? 22500000000,
        remainingLabel: `$${(agg.remainingAssetsPoint ?? 17041946126).toLocaleString()} documented floor`,
        paidOut: agg.cumulativePayoutsBottomUp ?? agg.cumulativePayoutsPoint ?? 24000000000,
        paidOutLabel: `$${(agg.cumulativePayoutsBottomUp ?? agg.cumulativePayoutsPoint ?? 24000000000).toLocaleString()} paid to claimants (bottom-up estimate)`,
        totalActiveTrusts: agg.activeTrustsEstimated ?? 60,
        paidOutDocumented: agg.cumulativePayoutsDocumented ?? 0,
        paidOutEstimatedRemainder: agg.cumulativePayoutsEstimatedRemainder ?? 0,
        trustsWithCumulativePaidFiled: agg.trustsWithCumulativePaidFiled ?? 0,
        paidOutBottomUp: agg.cumulativePayoutsBottomUp ?? null,
        paidOutBottomUpFiled: agg.cumulativePayoutsBottomUpFiled ?? null,
        paidOutBottomUpSecondary: agg.cumulativePayoutsBottomUpSecondary ?? null,
        paidOutBottomUpResidual: agg.cumulativePayoutsBottomUpResidual ?? null,
        paidOutBottomUpAsOf: agg.cumulativePayoutsBottomUpAsOf ?? null,
        methodology: "Aggregate remaining based on net asset figures from trust annual reports and quarterly filings. Sources classified as (a) filed court document, (b) secondary source citing primary, (c) estimate or inference. See methodology page for full details.",
        asOfNote: `Mixed 2021–${asOf?.substring(0, 4) ?? "2026"} as-of dates across trusts; see trust-figures.json for per-trust sources.`,
        isCurrent: true,
      };
    }),
  }),

  // ── News ────────────────────────────────────────────────────────────────────
  // ── Trust Figures (GitHub JSON) ─────────────────────────────────────────────
  trustFigures: router({
    summary: publicProcedure.query(async () => {
      try {
        const data = await fetchTrustFigures() as any;
        if (!data) return { asOf: null, topTrusts: [] };
        // Sort trusts by netAssets descending, take top 8
        const sorted = [...(data.trusts ?? [])]
          .filter((t: any) => t.netAssets && t.netAssets > 0)
          .sort((a: any, b: any) => (b.netAssets ?? 0) - (a.netAssets ?? 0))
          .slice(0, 8)
          .map((t: any) => ({
            name: t.shortName ?? t.name,
            netAssets: t.netAssets as number,
            assetsAsOf: t.assetsAsOf as string | null,
            confidence: t.confidence as string,
          }));
        return {
          asOf: (data.asOf ?? null) as string | null,
          topTrusts: sorted,
        };
      } catch {
        return { asOf: null, topTrusts: [] };
      }
    }),
    allTrusts: publicProcedure.query(async () => {
      try {
        const data = await fetchTrustFigures() as any;
        if (!data) return { asOf: null, trusts: [] };
        const trusts = (data.trusts ?? []).map((t: any) => ({
          name: t.name as string,
          shortName: (t.shortName ?? t.name.split(' ').slice(0, 3).join(' ')) as string,
          netAssets: (t.netAssets ?? null) as number | null,
          assetsAsOf: (t.assetsAsOf ?? null) as string | null,
          assetsBasis: (t.assetsBasis ?? null) as string | null,
          paymentPercentage: (t.paymentPercentage ?? null) as number | null,
          status: (t.status ?? 'active') as string,
          confidence: (t.confidence ?? 'c') as string,
          note: (t.note ?? null) as string | null,
          cumulativePaid: (t.cumulativePaid ?? null) as number | null,
          cumulativePaidAsOf: (t.cumulativePaidAsOf ?? null) as string | null,
          cumulativePaidSource: (t.cumulativePaidSource ?? null) as string | null,
          cumulativePaidSourceUrl: (t.cumulativePaidSourceUrl ?? null) as string | null,
          established: (t.established ?? null) as number | null,
          paymentPercentageFB: (t.paymentPercentageFB ?? null) as number | null,
          assetsBasisUrl: (t.assetsBasisUrl ?? null) as string | null,
        }));
        return {
          asOf: (data.asOf ?? null) as string | null,
          trusts,
        };
      } catch {
        return { asOf: null, trusts: [] };
      }
    }),
    bySlug: publicProcedure
      .input(z.object({ slug: z.string() }))
      .query(async ({ input }) => {
        try {
          const data = await fetchTrustFigures() as any;
          if (!data) return null;
          // Slugify helper (mirrors client-side)
          const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
          const trust = (data.trusts ?? []).find((t: any) =>
            slugify(t.name) === input.slug ||
            (t.shortName && slugify(t.shortName) === input.slug)
          );
          if (!trust) return null;
          const slug = slugify(trust.name);
          const changes = (data.changes ?? []).filter((c: any) =>
            slugify(c.trust) === slug ||
            slugify(c.trust) === input.slug ||
            (trust.shortName && slugify(c.trust) === slugify(trust.shortName)) ||
            c.trust === trust.name
          );
          return {
            name: trust.name as string,
            shortName: (trust.shortName ?? trust.name) as string,
            netAssets: (trust.netAssets ?? null) as number | null,
            assetsAsOf: (trust.assetsAsOf ?? null) as string | null,
            assetsBasis: (trust.assetsBasis ?? null) as string | null,
          paymentPercentage: (trust.paymentPercentage ?? null) as number | null,
          status: (trust.status ?? 'active') as string,
          confidence: (trust.confidence ?? 'c') as string,
          note: (trust.note ?? null) as string | null,
          established: (trust.established ?? null) as number | null,
          cumulativePaid: (trust.cumulativePaid ?? null) as number | null,
          cumulativePaidAsOf: (trust.cumulativePaidAsOf ?? null) as string | null,
          cumulativePaidSource: (trust.cumulativePaidSource ?? null) as string | null,
          cumulativePaidSourceUrl: (trust.cumulativePaidSourceUrl ?? null) as string | null,
          assetsBasisUrl: (trust.assetsBasisUrl ?? null) as string | null,
          changes: changes.map((c: any) => ({
              date: c.date as string,
              type: c.type as string,
              detail: c.detail as string,
              source: (c.source ?? null) as string | null,
            })),
          };
        } catch {
          return null;
        }
      }),
  }),
  trustFiguresExtra: router({
    reportsIndex: publicProcedure.query(async () => {
      try {
        const data = await fetchReportsIndex() as any;
        if (!data) return { reports: [] };
        return {
          reports: (data.reports ?? []).map((r: any) => ({
            id: r.id as string,
            title: r.title as string,
            date: r.date as string,
            asOf: (r.asOf ?? null) as string | null,
            path: (r.path ?? null) as string | null,
            summary: (r.summary ?? null) as string | null,
            highlights: (r.highlights ?? []) as string[],
          })),
        };
      } catch {
        return { reports: [] };
      }
    }),
  }),
  news: router({
    list: publicProcedure
      .input(z.object({
        limit: z.number().min(1).max(100).default(20),
        category: z.enum(["payment_change", "annual_report", "court_filing", "trust_news", "system_update"]).optional(),
      }).optional())
      .query(async ({ input }) => {
        return getVisibleNews(input?.limit ?? 20, input?.category);
      }),
  }),

  // ── Admin ───────────────────────────────────────────────────────────────────
  admin: router({
    // Update a single trust field
    updateTrust: adminProcedure
      .input(
        z.object({
          id: z.string(),
          paymentPct: z.number().optional(),
          paymentPctEffective: z.string().optional(),
          netAssets: z.number().nullable().optional(),
          netAssetsAsOf: z.string().nullable().optional(),
          netAssetsSource: z.enum(["a", "b", "c"]).optional(),
          netAssetsCitation: z.string().nullable().optional(),
          direction: z.enum(["up", "down", "stable"]).optional(),
          notes: z.string().nullable().optional(),
          isStale: z.boolean().optional(),
        })
      )
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        await updateTrust(id, data);
        return { success: true };
      }),

    // Add payment history entry
    addPaymentHistory: adminProcedure
      .input(
        z.object({
          trustId: z.string(),
          pct: z.number(),
          effective: z.string(),
          notes: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        await addPaymentHistoryEntry(input);
        return { success: true };
      }),

    // Update aggregate snapshot
    updateAggregate: adminProcedure
      .input(
        z.object({
          remainingLow: z.number(),
          remainingHigh: z.number(),
          remainingLabel: z.string(),
          paidOut: z.number(),
          paidOutLabel: z.string(),
          totalActiveTrusts: z.number(),
          methodology: z.string().optional(),
          asOfNote: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        await updateAggregate(input);
        return { success: true };
      }),

    // Bulk ingest from Kimi K3 pipeline JSON
    bulkIngest: adminProcedure
      .input(
        z.object({
          trusts: z
            .array(
              z.object({
                id: z.string(),
                name: z.string(),
                shortName: z.string().optional(),
                company: z.string().optional(),
                administrator: z.string().optional(),
                paymentPct: z.number().nullable().optional(),
                paymentPctEffective: z.string().nullable().optional(),
                netAssets: z.number().nullable().optional(),
                netAssetsAsOf: z.string().nullable().optional(),
                netAssetsSource: z.enum(["a", "b", "c"]).optional(),
                netAssetsCitation: z.string().nullable().optional(),
                direction: z.enum(["up", "down", "stable"]).optional(),
                notes: z.string().nullable().optional(),
              })
            )
            .optional(),
          aggregate: z
            .object({
              remainingLow: z.number(),
              remainingHigh: z.number(),
              remainingLabel: z.string(),
              paidOut: z.number(),
              paidOutLabel: z.string(),
              totalActiveTrusts: z.number(),
              asOfNote: z.string().optional(),
            })
            .optional(),
          paymentHistory: z
            .array(
              z.object({
                trustId: z.string(),
                pct: z.number(),
                effective: z.string(),
                notes: z.string().optional(),
              })
            )
            .optional(),
          newsItems: z
            .array(
              z.object({
                title: z.string(),
                summary: z.string().optional(),
                url: z.string().optional(),
                source: z.string().optional(),
                publishedAt: z.string().optional(),
                trustId: z.string().optional(),
                category: z
                  .enum(["payment_change", "annual_report", "court_filing", "research", "general"])
                  .optional(),
              })
            )
            .optional(),
        })
      )
      .mutation(async ({ input }) => {
        const results = { trusts: 0, paymentHistory: 0, newsItems: 0, aggregate: false };
        if (input.trusts) {
          for (const t of input.trusts) {
            await upsertTrustFromPipeline(t as any);
            results.trusts++;
          }
        }
        if (input.paymentHistory) {
          for (const h of input.paymentHistory) {
            await addPaymentHistoryEntry(h);
            results.paymentHistory++;
          }
        }
        if (input.newsItems) {
          for (const n of input.newsItems) {
            await addNewsItem({
              ...n,
              publishedAt: n.publishedAt ? new Date(n.publishedAt) : undefined,
              isVisible: true,
            } as any);
            results.newsItems++;
          }
        }
        if (input.aggregate) {
          await updateAggregate(input.aggregate as any);
          results.aggregate = true;
        }
        return results;
      }),

    // Add news item
    addNews: adminProcedure
      .input(
        z.object({
          title: z.string(),
          summary: z.string().optional(),
          url: z.string().optional(),
          source: z.string().optional(),
          publishedAt: z.string().optional(),
          trustId: z.string().optional(),
          category: z
            .enum(["payment_change", "annual_report", "court_filing", "research", "general"])
            .optional(),
        })
      )
      .mutation(async ({ input }) => {
        await addNewsItem({
          ...input,
          publishedAt: input.publishedAt ? new Date(input.publishedAt) : undefined,
          isVisible: true,
        } as any);
        return { success: true };
      }),

    // Mark trust stale
    markStale: adminProcedure
      .input(z.object({ id: z.string(), isStale: z.boolean() }))
      .mutation(async ({ input }) => {
        await markTrustStale(input.id, input.isStale);
        return { success: true };
      }),
  }),
});

export type AppRouter = typeof appRouter;

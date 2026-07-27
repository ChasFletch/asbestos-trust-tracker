import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { protectedProcedure, publicProcedure, router } from "./_core/trpc";
import { fetchTrustFigures } from "./dataRoutes";
import {
  addNewsItem,
  addPaymentHistoryEntry,
  getAllPaymentHistory,
  getAllTrusts,
  getCurrentAggregate,
  getPaymentHistoryForTrust,
  getTrustById,
  getVisibleNews,
  markTrustStale,
  updateAggregate,
  updateTrust,
  upsertTrustFromPipeline,
} from "./db";

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

  // ── Trusts ──────────────────────────────────────────────────────────────────
  trusts: router({
    list: publicProcedure.query(async () => {
      const [allTrusts, allHistory] = await Promise.all([getAllTrusts(), getAllPaymentHistory()]);
      const historyMap: Record<string, typeof allHistory> = {};
      for (const h of allHistory) {
        if (!historyMap[h.trustId]) historyMap[h.trustId] = [];
        historyMap[h.trustId].push(h);
      }
      return allTrusts.map((t) => ({ ...t, paymentHistory: historyMap[t.id] ?? [] }));
    }),

    byId: publicProcedure
      .input(z.object({ id: z.string() }))
      .query(async ({ input }) => {
        const [trust, history] = await Promise.all([
          getTrustById(input.id),
          getPaymentHistoryForTrust(input.id),
        ]);
        if (!trust) throw new TRPCError({ code: "NOT_FOUND" });
        return { ...trust, paymentHistory: history };
      }),
  }),

  // ── Aggregate ───────────────────────────────────────────────────────────────
  aggregate: router({
    current: publicProcedure.query(async () => {
      const agg = await getCurrentAggregate();
      if (!agg) throw new TRPCError({ code: "NOT_FOUND", message: "No aggregate snapshot found" });
      return agg;
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
        }));
        return {
          asOf: (data.asOf ?? null) as string | null,
          trusts,
        };
      } catch {
        return { asOf: null, trusts: [] };
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

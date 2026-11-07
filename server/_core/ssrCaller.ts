import type { Request, Response } from "express";
import { appRouter } from "../routers";
import { createContext } from "./context";
import type { SsrPrefetch } from "../../client/src/ssr/prefetch";
import { fetchNewsDrafts, fetchReportMarkdown, fetchReportsIndex } from "../dataRoutes";
import { createReportContent, type ReportMetadataResponse } from "../../shared/reportContent";

export async function buildSsrPrefetch(req: Request, res: Response): Promise<SsrPrefetch> {
  const ctx = await createContext({ req, res } as any);
  const caller = appRouter.createCaller(ctx);
  return {
    aggregateCurrent: () => caller.aggregate.current(),
    newsList: (input) => caller.news.list(input),
    trustFiguresSummary: () => caller.trustFigures.summary(),
    trustFiguresAllTrusts: () => caller.trustFigures.allTrusts(),
    trustFiguresBySlug: (slug) => caller.trustFigures.bySlug({ slug }),
    trustsList: () => caller.trusts.list(),
    trustsBySlug: (slug) => caller.trusts.bySlug({ slug }),
    reportsIndex: () => caller.trustFiguresExtra.reportsIndex(),
    recoveryDashboard: () => caller.operations.recoveryDashboard(),
    newsDrafts: () => fetchNewsDrafts(true),
    reportContent: async (id) => {
      const [index, markdown] = await Promise.all([fetchReportsIndex(), fetchReportMarkdown(id)]);
      const report = (index as { reports?: ReportMetadataResponse[] } | null)?.reports?.find((entry) => entry.id === id);
      return createReportContent(id, report, markdown);
    },
  };
}

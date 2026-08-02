import type { Request, Response } from "express";
import { appRouter } from "../routers";
import { createContext } from "./context";
import type { SsrPrefetch } from "../../client/src/ssr/prefetch";

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
  };
}

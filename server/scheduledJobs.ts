import type { Request, Response } from "express";
import { sql } from "drizzle-orm";
import { getDb } from "./db";
import { trusts, newsItems } from "../drizzle/schema";
import { sdk } from "./_core/sdk";
import { notifyOwner } from "./_core/notification";

/**
 * Weekly staleness check — called by the Heartbeat cron every Monday 09:00 UTC.
 * Marks trust records as stale if their net_assets_as_of date is > 14 months old,
 * or if the payment_pct_effective date is > 13 months old.
 * Sends an admin notification listing all stale trusts.
 */
export async function stalenessCheckHandler(req: Request, res: Response) {
  try {
    const user = await sdk.authenticateRequest(req);
    if (!user.isCron) {
      return res.status(403).json({ error: "cron-only endpoint" });
    }

    const db = await getDb();
    if (!db) {
      return res.status(500).json({ error: "DB not available" });
    }

    // Threshold: 14 months ago (assets) and 13 months ago (payment %)
    const now = new Date();
    const assetThreshold = new Date(now);
    assetThreshold.setMonth(assetThreshold.getMonth() - 14);
    const pctThreshold = new Date(now);
    pctThreshold.setMonth(pctThreshold.getMonth() - 13);

    const assetThresholdStr = assetThreshold.toISOString().slice(0, 10);
    const pctThresholdStr = pctThreshold.toISOString().slice(0, 10);

    // Fetch all trusts
    const allTrusts = await db.select({
      id: trusts.id,
      name: trusts.name,
      netAssetsAsOf: trusts.netAssetsAsOf,
      paymentPctEffective: trusts.paymentPctEffective,
      isStale: trusts.isStale,
    }).from(trusts);

    const nowStale: string[] = [];
    const alreadyStale: string[] = [];

    for (const trust of allTrusts) {
      const assetStale = trust.netAssetsAsOf && trust.netAssetsAsOf < assetThresholdStr;
      const pctStale = trust.paymentPctEffective && trust.paymentPctEffective < pctThresholdStr;
      const shouldBeStale = !!(assetStale || pctStale);

      if (shouldBeStale && !trust.isStale) {
        await db.update(trusts)
          .set({ isStale: true })
          .where(sql`id = ${trust.id}`);
        nowStale.push(trust.name);
      } else if (shouldBeStale && trust.isStale) {
        alreadyStale.push(trust.name);
      }
    }

    // Add a news item if any trusts became newly stale
    if (nowStale.length > 0) {
      await db.insert(newsItems).values({
        title: `Data Staleness Alert: ${nowStale.length} trust(s) flagged for update`,
        summary: `Trusts flagged as stale (data older than threshold): ${nowStale.join(", ")}. These records require updated annual report data.`,
        category: "general",
        publishedAt: new Date(),
        isVisible: false,
        trustId: null,
        url: null,
        source: "System",
      });
    }

    // Send admin notification
    const message = nowStale.length > 0
      ? `Weekly staleness check: ${nowStale.length} trust(s) newly flagged as stale: ${nowStale.join(", ")}. ${alreadyStale.length} already stale.`
      : `Weekly staleness check: No new stale records. ${alreadyStale.length} already stale.`;

    await notifyOwner({
      title: "AsbestosTrusts — Weekly Staleness Check",
      content: message,
    });

    return res.json({
      ok: true,
      newlyStale: nowStale,
      alreadyStale,
      timestamp: now.toISOString(),
    });
  } catch (err: any) {
    console.error("[staleness-check]", err);
    return res.status(500).json({
      error: err?.message ?? "unknown error",
      stack: err?.stack,
      context: { url: req.url },
      timestamp: new Date().toISOString(),
    });
  }
}

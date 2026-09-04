import type { Request, Response } from "express";
import { sql } from "drizzle-orm";
import { getDb } from "./db";
import { trusts, newsItems } from "../drizzle/schema";
import { sdk } from "./_core/sdk";
import { notifyOwner } from "./_core/notification";
import { ENV } from "./_core/env";

type CrawlerCheck = {
  path: string;
  ok: boolean;
  detail: string;
};

export type CrawlerVisibilityResult = {
  ok: boolean;
  expected: { remaining: string; payouts: string; coverage: string; dateScope: string } | null;
  checks: CrawlerCheck[];
};

const formatCurrency = (value: number) => `$${value.toLocaleString("en-US")}`;

/**
 * Confirms that no-JavaScript crawlers can read the live figures after the
 * public server response is assembled. The check deliberately derives its
 * expected values from the same JSON-first API used by the site, avoiding
 * brittle hard-coded figure assertions as source data changes.
 */
export async function checkCrawlerVisibility(options: {
  canonicalOrigin?: string;
  fetchImpl?: typeof fetch;
} = {}): Promise<CrawlerVisibilityResult> {
  const canonicalOrigin = (options.canonicalOrigin ?? ENV.canonicalOrigin).replace(/\/$/, "");
  const fetchImpl = options.fetchImpl ?? fetch;
  const headers = {
    "User-Agent": "AsbestosTrusts-SSR-Monitor/1.0 (+https://asbestostrusts.org/methodology)",
    "Cache-Control": "no-cache",
  };
  const checks: CrawlerCheck[] = [];

  try {
    const sourceResponse = await fetchImpl(`${canonicalOrigin}/api/trust-figures`, {
      headers,
      signal: AbortSignal.timeout(15_000),
    });
    if (!sourceResponse.ok) {
      return { ok: false, expected: null, checks: [{ path: "/api/trust-figures", ok: false, detail: `HTTP ${sourceResponse.status}` }] };
    }

    const source = await sourceResponse.json() as {
      asOf?: string;
      aggregate?: { remainingAssetsPoint?: number; cumulativePayoutsBottomUp?: number };
      trusts?: Array<{ netAssets?: number | null; assetsAsOf?: string | null; status?: string }>;
    };
    const remainingValue = source.aggregate?.remainingAssetsPoint;
    const payoutValue = source.aggregate?.cumulativePayoutsBottomUp;
    if (typeof remainingValue !== "number" || typeof payoutValue !== "number") {
      return { ok: false, expected: null, checks: [{ path: "/api/trust-figures", ok: false, detail: "Missing aggregate figure values" }] };
    }

    const assetsWithFigures = (source.trusts ?? []).filter((trust) => trust.netAssets != null && trust.status !== "closed");
    const assetYears = assetsWithFigures
      .map((trust) => Number(trust.assetsAsOf?.slice(0, 4)))
      .filter((year) => Number.isInteger(year));
    if (assetsWithFigures.length === 0 || assetYears.length === 0 || !source.asOf) {
      return { ok: false, expected: null, checks: [{ path: "/api/trust-figures", ok: false, detail: "Missing asset coverage or date-range data" }] };
    }
    const activeTrustsTracked = (source.trusts ?? []).filter((trust) => trust.status === "active" || trust.status === "active_deferral").length;
    if (activeTrustsTracked === 0) {
      return { ok: false, expected: null, checks: [{ path: "/api/trust-figures", ok: false, detail: "Missing active trust coverage data" }] };
    }
    const coverage = `Documented floor: ${formatCurrency(remainingValue)} across ${assetsWithFigures.length} of ${activeTrustsTracked} active tracker records.`;
    const dateScope = `underlying asset figures span FY${Math.min(...assetYears)}–${Math.max(...assetYears)}`;
    const expected = { remaining: formatCurrency(remainingValue), payouts: formatCurrency(payoutValue), coverage, dateScope };
    const nonce = `crawler-monitor=${Date.now()}`;
    for (const path of ["/", "/embed/clock"]) {
      const response = await fetchImpl(`${canonicalOrigin}${path}?${nonce}`, {
        headers,
        signal: AbortSignal.timeout(15_000),
      });
      const html = await response.text();
      const hasRequiredDisclosure = html.includes(expected.remaining)
        && html.includes(expected.payouts)
        && html.includes(expected.coverage)
        && html.includes(expected.dateScope);
      checks.push({
        path,
        ok: response.status === 200 && hasRequiredDisclosure,
        detail: response.status !== 200
          ? `HTTP ${response.status}`
          : hasRequiredDisclosure
            ? "Live figures and scope disclosure present in server HTML"
            : "Live figures or scope disclosure missing from server HTML",
      });
    }

    const csvResponse = await fetchImpl(`${canonicalOrigin}/trusts.csv?${nonce}`, {
      headers,
      signal: AbortSignal.timeout(15_000),
    });
    const csv = await csvResponse.text();
    checks.push({
      path: "/trusts.csv",
      ok: csvResponse.status === 200 && csv.startsWith("name,shortName,netAssets,"),
      detail: csvResponse.status !== 200
        ? `HTTP ${csvResponse.status}`
        : csv.startsWith("name,shortName,netAssets,")
          ? "CSV header present"
          : "Unexpected CSV response",
    });

    return { ok: checks.every((check) => check.ok), expected, checks };
  } catch (error) {
    return {
      ok: false,
      expected: null,
      checks: [{ path: "monitor", ok: false, detail: error instanceof Error ? error.message : "Unknown fetch failure" }],
    };
  }
}

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

    const crawlerVisibility = await checkCrawlerVisibility();

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

    const crawlerMessage = crawlerVisibility.ok
      ? "Crawler visibility check: homepage, embed clock, and CSV export are healthy."
      : `Crawler visibility check FAILED: ${crawlerVisibility.checks.filter((check) => !check.ok).map((check) => `${check.path} (${check.detail})`).join("; ")}.`;

    await notifyOwner({
      title: "AsbestosTrusts — Weekly Staleness Check",
      content: `${message}\n\n${crawlerMessage}`,
    });

    return res.json({
      ok: true,
      newlyStale: nowStale,
      alreadyStale,
      crawlerVisibility,
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

import type { Express } from "express";
import { getAllTrusts } from "./db";

const TRUST_FIGURES_RAW_URL =
  "https://raw.githubusercontent.com/ChasFletch/asbestos-trust-tracker/main/client/src/data/trust-figures.json";

// In-memory cache: refresh at most once per hour
let cachedFigures: unknown = null;
let cacheTimestamp = 0;
const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour

export async function fetchTrustFigures(): Promise<unknown> {
  const now = Date.now();
  if (cachedFigures && now - cacheTimestamp < CACHE_TTL_MS) {
    return cachedFigures;
  }
  try {
    const res = await fetch(TRUST_FIGURES_RAW_URL, {
      headers: { "Cache-Control": "no-cache" },
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) throw new Error(`GitHub raw fetch failed: ${res.status}`);
    cachedFigures = await res.json();
    cacheTimestamp = now;
    return cachedFigures;
  } catch (err) {
    console.error("[dataRoutes] GitHub fetch failed, returning cached or null:", err);
    return cachedFigures; // fall back to stale cache
  }
}

export function registerDataRoutes(app: Express) {
  // ── /api/trust-figures — proxy the live GitHub JSON ─────────────────────────
  app.get("/api/trust-figures", async (_req, res) => {
    try {
      const data = await fetchTrustFigures();
      if (!data) {
        res.status(503).json({ error: "Trust figures temporarily unavailable" });
        return;
      }
      res.set("Cache-Control", "public, max-age=3600");
      res.json(data);
    } catch (err) {
      res.status(500).json({ error: "Internal error" });
    }
  });

  // ── /trusts.csv — downloadable CSV of all trust records ─────────────────────
  app.get("/trusts.csv", async (_req, res) => {
    try {
      const trusts = await getAllTrusts();
      const headers = [
        "id", "name", "shortName", "company", "established", "administrator",
        "court", "docket", "website", "paymentPct", "paymentPctEffective",
        "netAssets", "netAssetsAsOf", "netAssetsSource", "netAssetsCitation",
        "cumulativePaid", "cumulativeClaims", "reportingFrequency", "status",
        "direction", "notes",
      ];
      const escape = (v: unknown) => {
        if (v == null) return "";
        const s = String(v);
        if (s.includes(",") || s.includes('"') || s.includes("\n")) {
          return `"${s.replace(/"/g, '""')}"`;
        }
        return s;
      };
      const rows = [
        headers.join(","),
        ...trusts.map((t) => headers.map((h) => escape((t as Record<string, unknown>)[h])).join(",")),
      ];
      res.set("Content-Type", "text/csv; charset=utf-8");
      res.set("Content-Disposition", 'attachment; filename="asbestos-trusts.csv"');
      res.set("Cache-Control", "public, max-age=3600");
      res.send(rows.join("\r\n"));
    } catch (err) {
      res.status(500).json({ error: "Failed to generate CSV" });
    }
  });
}

import type { Express } from "express";
import { getAllTrusts } from "./db";

const GITHUB_REPO = "ChasFletch/asbestos-trust-tracker";
const GITHUB_API_BASE = `https://api.github.com/repos/${GITHUB_REPO}`;
const GITHUB_RAW_BASE = `https://raw.githubusercontent.com/${GITHUB_REPO}/main`;

const TRUST_FIGURES_RAW_URL = `${GITHUB_RAW_BASE}/client/src/data/trust-figures.json`;

// ── Cache slots ──────────────────────────────────────────────────────────────
let cachedFigures: unknown = null;
let cacheTimestamp = 0;
const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour

let cachedNewsDrafts: Array<NewsDraft> | null = null;
let newsDraftsCacheTs = 0;
const NEWS_CACHE_TTL = 15 * 60 * 1000; // 15 min

let cachedReportsIndex: unknown = null;
let reportsCacheTs = 0;
// Force cache bust on each server restart by initialising to 0 (already the case)
// but also expose a manual bust endpoint for development

// ── Types ────────────────────────────────────────────────────────────────────
interface NewsDraft {
  filename: string;
  date: string;
  title: string;
  summary: string;
  category: string;
  url?: string;
}

// ── Trust figures ────────────────────────────────────────────────────────────
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
    return cachedFigures;
  }
}

// ── News drafts ──────────────────────────────────────────────────────────────
async function fetchNewsDrafts(): Promise<NewsDraft[]> {
  const now = Date.now();
  if (cachedNewsDrafts && now - newsDraftsCacheTs < NEWS_CACHE_TTL) {
    return cachedNewsDrafts;
  }
  try {
    // List the directory via GitHub API (returns 404 if dir doesn't exist yet)
    const listRes = await fetch(
      `${GITHUB_API_BASE}/contents/client/src/data/news-drafts`,
      {
        headers: {
          Accept: "application/vnd.github.v3+json",
          "User-Agent": "asbestostrusts-server/1.0",
        },
        signal: AbortSignal.timeout(8000),
      }
    );
    if (!listRes.ok) return cachedNewsDrafts ?? []; // dir not yet created
    const listing = (await listRes.json()) as Array<{ name: string; download_url: string }>;
    if (!Array.isArray(listing)) return cachedNewsDrafts ?? [];

    // Filter .md files, sort newest first (filenames: YYYY-MM-DD-*.md)
    const mdFiles = listing
      .filter((f) => f.name.endsWith(".md"))
      .sort((a, b) => b.name.localeCompare(a.name))
      .slice(0, 20);

    const drafts = await Promise.all(
      mdFiles.map(async (f): Promise<NewsDraft | null> => {
        try {
          const r = await fetch(f.download_url, { signal: AbortSignal.timeout(5000) });
          if (!r.ok) return null;
          const text = await r.text();
          const lines = text.split("\n");
          // Defaults from filename
          let title = f.name
            .replace(/^\d{4}-\d{2}-\d{2}-/, "")
            .replace(/\.md$/, "")
            .replace(/-/g, " ");
          let date = f.name.substring(0, 10);
          let category = "system_update";
          let url: string | undefined;
          let bodyStart = 0;
          // Parse simple frontmatter (lines before first blank line or first heading)
          for (let i = 0; i < Math.min(lines.length, 15); i++) {
            const l = lines[i].trim();
            if (l.startsWith("# ")) { title = l.slice(2).trim(); bodyStart = i + 1; }
            else if (l.startsWith("date:")) date = l.slice(5).trim().replace(/^["']|["']$/g, "");
            else if (l.startsWith("category:")) category = l.slice(9).trim().replace(/^["']|["']$/g, "");
            else if (l.startsWith("url:")) url = l.slice(4).trim().replace(/^["']|["']$/g, "");
          }
          // Summary = first non-empty paragraph after frontmatter (strip markdown)
          const body = lines.slice(bodyStart).join("\n").trim();
          const summary = (body.split(/\n\n/)[0] ?? "")
            .replace(/^#+\s*/gm, "")
            .replace(/\*\*/g, "")
            .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
            .trim()
            .slice(0, 400);
          return { filename: f.name, date, title, summary, category, url };
        } catch {
          return null;
        }
      })
    );

    const valid = drafts.filter(Boolean) as NewsDraft[];
    cachedNewsDrafts = valid;
    newsDraftsCacheTs = now;
    return valid;
  } catch {
    return cachedNewsDrafts ?? [];
  }
}

// ── Reports index ────────────────────────────────────────────────────────────
async function fetchReportsIndex(): Promise<unknown> {
  const now = Date.now();
  if (cachedReportsIndex && now - reportsCacheTs < CACHE_TTL_MS) {
    return cachedReportsIndex;
  }
  try {
    const res = await fetch(`${GITHUB_RAW_BASE}/reports/index.json`, {
      headers: { "Cache-Control": "no-cache" },
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return null; // file not yet created
    const data = await res.json();
    cachedReportsIndex = data;
    reportsCacheTs = now;
    return data;
  } catch {
    return cachedReportsIndex ?? null;
  }
}

// ── Express routes ───────────────────────────────────────────────────────────
export function registerDataRoutes(app: Express) {
  // /api/trust-figures — proxy the live GitHub JSON
  app.get("/api/trust-figures", async (_req, res) => {
    try {
      const data = await fetchTrustFigures();
      if (!data) {
        res.status(503).json({ error: "Trust figures temporarily unavailable" });
        return;
      }
      res.set("Cache-Control", "public, max-age=3600");
      res.json(data);
    } catch {
      res.status(500).json({ error: "Internal error" });
    }
  });

  // /trusts.csv — downloadable CSV of all trust records
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
    } catch {
      res.status(500).json({ error: "Failed to generate CSV" });
    }
  });

  // /api/news-drafts — weekly Kimi markdown drafts from GitHub
  app.get("/api/news-drafts", async (_req, res) => {
    try {
      const drafts = await fetchNewsDrafts();
      res.set("Cache-Control", "public, max-age=900");
      res.json({ drafts });
    } catch {
      res.status(500).json({ error: "Failed to fetch news drafts" });
    }
  });

  // /api/reports — quarterly reports index from GitHub
  app.get("/api/reports", async (_req, res) => {
    try {
      const data = await fetchReportsIndex();
      res.set("Cache-Control", "public, max-age=3600");
      res.json(data ?? { reports: [] });
    } catch {
      res.status(500).json({ error: "Failed to fetch reports index" });
    }
  });
}

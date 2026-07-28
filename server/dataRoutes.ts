import type { Express } from "express";
import { marked } from "marked";
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
let reportsCacheTs = 0; // reset on every server start to force fresh fetch
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
export async function fetchReportsIndex(): Promise<unknown> {
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

// ── Individual report markdown ───────────────────────────────────────────────
interface ReportEntry { id: string; path: string; title?: string; date?: string; asOf?: string; }
const reportMarkdownCache = new Map<string, { content: string; ts: number }>();
const REPORT_MD_TTL = 60 * 60 * 1000;

async function fetchReportMarkdown(reportId: string): Promise<string | null> {
  const cached = reportMarkdownCache.get(reportId);
  if (cached && Date.now() - cached.ts < REPORT_MD_TTL) return cached.content;
  const index = (await fetchReportsIndex()) as { reports?: ReportEntry[] } | null;
  if (!index?.reports) return null;
  const entry = index.reports.find((r: ReportEntry) => r.id === reportId);
  if (!entry?.path) return null;
  try {
    const url = `${GITHUB_RAW_BASE}/${entry.path}`;
    const res = await fetch(url, { headers: { "Cache-Control": "no-cache" }, signal: AbortSignal.timeout(10000) });
    if (!res.ok) return null;
    const content = await res.text();
    reportMarkdownCache.set(reportId, { content, ts: Date.now() });
    return content;
  } catch {
    return reportMarkdownCache.get(reportId)?.content ?? null;
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

  // /trusts.csv — downloadable CSV of all trust records (JSON-first)
  app.get("/trusts.csv", async (_req, res) => {
    try {
      const data = await fetchTrustFigures() as any;
      const jsonTrusts = data?.trusts ?? [];
      const headers = [
        "name", "shortName", "netAssets", "assetsAsOf", "assetsBasis",
        "paymentPercentage", "status", "confidence", "note",
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
        ...jsonTrusts.map((t: any) => headers.map((h: string) => escape(t[h])).join(",")),
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

  // /api/reports/:id/markdown — full markdown for a single report
  app.get("/api/reports/:id/markdown", async (req, res) => {
    try {
      const { id } = req.params;
      if (!/^ATR-\d{4}-Q[1-4]$/.test(id)) { res.status(400).json({ error: "Invalid report ID" }); return; }
      const content = await fetchReportMarkdown(id);
      if (!content) { res.status(404).json({ error: "Report not found" }); return; }
      res.set("Cache-Control", "public, max-age=3600");
      res.set("Content-Type", "text/plain; charset=utf-8");
      res.send(content);
    } catch { res.status(500).json({ error: "Failed to fetch report" }); }
  });

  // /api/reports/:id/pdf — styled printable HTML page (user prints to PDF via browser)
  app.get("/api/reports/:id/pdf", async (req, res) => {
    try {
      const { id } = req.params;
      if (!/^ATR-\d{4}-Q[1-4]$/.test(id)) { res.status(400).json({ error: "Invalid report ID" }); return; }
      const content = await fetchReportMarkdown(id);
      if (!content) { res.status(404).json({ error: "Report not found" }); return; }
      const bodyHtml = await marked.parse(content);
      const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${id} — AsbestosTrusts.org</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Source+Serif+4:wght@400;600;700&family=Source+Code+Pro:wght@400;500&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    font-family: 'Source Serif 4', Georgia, serif;
    font-size: 11pt;
    line-height: 1.65;
    color: #1a1a1a;
    background: #fff;
    max-width: 720px;
    margin: 0 auto;
    padding: 48px 40px;
  }
  .site-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-bottom: 16px;
    border-bottom: 2px solid #c0392b;
    margin-bottom: 36px;
  }
  .site-name { font-size: 13pt; font-weight: 700; color: #c0392b; letter-spacing: 0.02em; }
  .report-id { font-family: 'Source Code Pro', monospace; font-size: 9pt; color: #666; background: #f5f5f5; padding: 3px 8px; border-radius: 3px; }
  h1 { font-size: 20pt; font-weight: 700; line-height: 1.25; margin-bottom: 8px; color: #111; }
  h2 { font-size: 13pt; font-weight: 700; margin-top: 28px; margin-bottom: 10px; color: #111; border-bottom: 1px solid #e0e0e0; padding-bottom: 4px; }
  h3 { font-size: 11pt; font-weight: 600; margin-top: 20px; margin-bottom: 6px; color: #222; }
  p { margin-bottom: 12px; }
  ul, ol { margin: 0 0 12px 20px; }
  li { margin-bottom: 4px; }
  code { font-family: 'Source Code Pro', monospace; font-size: 9pt; background: #f5f5f5; padding: 1px 4px; border-radius: 2px; }
  pre { background: #f5f5f5; padding: 12px 16px; border-radius: 4px; overflow-x: auto; margin-bottom: 12px; }
  pre code { background: none; padding: 0; }
  blockquote { border-left: 3px solid #c0392b; padding-left: 14px; color: #555; margin: 12px 0; }
  table { width: 100%; border-collapse: collapse; margin-bottom: 16px; font-size: 9.5pt; }
  th { background: #f0f0f0; font-weight: 600; text-align: left; padding: 6px 10px; border: 1px solid #ddd; }
  td { padding: 5px 10px; border: 1px solid #ddd; }
  tr:nth-child(even) td { background: #fafafa; }
  a { color: #c0392b; text-decoration: none; }
  hr { border: none; border-top: 1px solid #e0e0e0; margin: 24px 0; }
  .footer { margin-top: 48px; padding-top: 16px; border-top: 1px solid #e0e0e0; font-size: 8.5pt; color: #888; }
  @media print {
    body { padding: 0; max-width: 100%; }
    .no-print { display: none !important; }
    h2, h3 { page-break-after: avoid; }
    table, pre, blockquote { page-break-inside: avoid; }
  }
  .print-btn {
    display: inline-flex; align-items: center; gap: 6px;
    background: #c0392b; color: #fff; border: none; border-radius: 4px;
    padding: 8px 16px; font-size: 10pt; font-family: sans-serif;
    cursor: pointer; margin-bottom: 24px;
  }
  .print-btn:hover { background: #a93226; }
</style>
</head>
<body>
<div class="site-header">
  <span class="site-name">AsbestosTrusts.org</span>
  <span class="report-id">${id}</span>
</div>
<button class="print-btn no-print" onclick="window.print()">⬇ Save as PDF</button>
${bodyHtml}
<div class="footer">
  Published by AsbestosTrusts.org — an independent public research platform. Data sourced from filed court documents, trust annual reports, and quarterly filings. This is not legal advice.
</div>
<script class="no-print">
  // Auto-trigger print dialog when opened from download link
  if (window.location.search.includes('print=1')) { window.addEventListener('load', () => setTimeout(() => window.print(), 400)); }
<\/script>
</body>
</html>`;
      res.set("Content-Type", "text/html; charset=utf-8");
      res.set("Cache-Control", "public, max-age=3600");
      res.send(html);
    } catch { res.status(500).json({ error: "Failed to generate PDF page" }); }
  });

  // /api/reports/:id — report metadata only
  app.get("/api/reports/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const index = (await fetchReportsIndex()) as { reports?: ReportEntry[] } | null;
      const entry = index?.reports?.find((r: ReportEntry) => r.id === id);
      if (!entry) { res.status(404).json({ error: "Report not found" }); return; }
      res.set("Cache-Control", "public, max-age=3600");
      res.json(entry);
    } catch { res.status(500).json({ error: "Failed to fetch report metadata" }); }
  });
}

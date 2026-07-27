import React from "react";
import { ExternalLink, FileText, Calendar, ChevronRight } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { Link } from "wouter";

// Kimi's actual index.json schema (asbestos-trust-reports/v1)
interface KimiReport {
  id: string;        // e.g. "ATR-2026-Q3"
  title: string;
  date: string;      // ISO date "2026-07-28"
  asOf?: string;     // data as-of date
  path: string;      // repo-relative path to the markdown file
  // optional enrichment fields (future quarters may add these)
  summary?: string;
  highlights?: string[];
  fileUrl?: string;  // explicit URL override
}

// Hard-coded key findings per report ID (populated from Kimi's digest)
const KEY_FINDINGS: Record<string, string[]> = {
  "ATR-2026-Q3": [
    "Documented floor: $17,041,946,126 across 41 of ~60 active trusts -- 23.3% rests on filed documents (a-class)",
    "Direction of travel is unambiguous: 7 documented percentage cuts, zero raises since January 2023",
    "Two cuts this window: B&W 4.7%->4.3% (June 30) and Combustion Engineering to 15.3% (April)",
    "DCPF controls ~$8.7B -- 51% of the documented floor -- and its S.5.5 amendments now propagate systemwide",
    "USG issued a reconsideration notice in May 2026; B&W's 7-week notice-to-cut is now the documented template",
    "Formation pipeline: GP, DBMP/CertainTeed (~60,000 stayed claims), Trane -- none counted until funded",
    'The "$30B" myth corrected in print for the first time with a bottom-up filed figure',
  ],
};

interface ReportsIndex {
  schema?: string;
  reports: KimiReport[];
  lastUpdated?: string;
}

const GITHUB_RAW_BASE = "https://raw.githubusercontent.com/ChasFletch/asbestos-trust-tracker/main";

function deriveFileUrl(report: KimiReport): string {
  if (report.fileUrl) return report.fileUrl;
  return `${GITHUB_RAW_BASE}/${report.path}`;
}

export default function Reports() {
  const { data, isLoading: loading } = trpc.trustFiguresExtra.reportsIndex.useQuery();
  const reports = (data?.reports ?? []) as KimiReport[];
  const nextReportDate = "January 1, 2027";
  const nextReportId = "ATR-2027-Q1";

  return (
    <div className="container py-10 max-w-3xl">
      <div className="mb-8">
        <div className="text-xs font-mono text-primary/70 uppercase tracking-widest mb-2">
          Research Reports
        </div>
        <h1 className="font-display font-bold uppercase tracking-wider text-2xl mb-2">
          State of the Asbestos Trust System
        </h1>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Quarterly flagship reports covering aggregate movement, payment-percentage direction analysis,
          depletion trends, system events, and a data-quality ledger. Each report carries a stable
          identifier (ATR-YYYY-QN) for citation. Published on the 1st of January, April, July, and October.
        </p>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 rounded border border-border/40 bg-card/40 animate-pulse" />
          ))}
        </div>
      ) : reports.length === 0 ? (
        /* ── Pending state ───────────────────────────────────────────────── */
        <div className="space-y-6">
          <div className="p-6 rounded border border-dashed border-border/60 bg-card/30 text-center">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <FileText size={22} className="text-primary/60" />
            </div>
            <p className="text-sm font-semibold text-foreground mb-1">
              Next report due {nextReportDate}
            </p>
            <p className="text-xs text-muted-foreground mb-3">
              Identifier: <span className="font-mono text-primary/80">{nextReportId}</span>
            </p>
          </div>

          <div className="p-5 rounded border border-border/40 bg-card/40">
            <h2 className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-4">
              What Each Report Covers
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { label: "Aggregate movement", desc: "Documented floor vs. prior quarter, range update" },
                { label: "Payment-% direction", desc: "Which trusts cut, held, or raised their rates" },
                { label: "Depletion trends", desc: "Projected depletion dates for top-10 trusts" },
                { label: "System events", desc: "New filings, closures, court orders, amendments" },
                { label: "Data-quality ledger", desc: "Count of (a)/(b)/(c) records, upgrades this quarter" },
                { label: "Watch list", desc: "Trusts with pending decisions in the next 90 days" },
              ].map((item) => (
                <div key={item.label} className="flex items-start gap-2.5">
                  <ChevronRight size={14} className="text-primary/50 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs font-semibold text-foreground">{item.label}</p>
                    <p className="text-xs text-muted-foreground">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* ── Reports list ─────────────────────────────────────────────── */
        <div className="space-y-4">
          {reports
            .slice()
            .sort((a, b) => b.date.localeCompare(a.date))
            .map((report) => (
              <div
                key={report.id}
                className="p-5 rounded border border-border/50 bg-card/40 hover:border-border transition-colors"
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                    <FileText size={18} className="text-primary/60" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1.5">
                      <span className="text-xs font-mono px-1.5 py-0.5 rounded bg-primary/10 text-primary/80 border border-primary/20">
                        {report.id}
                      </span>
                      <span className="text-xs text-muted-foreground/60 flex items-center gap-1">
                        <Calendar size={10} />
                        {new Date(report.date + "T12:00:00Z").toLocaleDateString("en-US", {
                          month: "long", day: "numeric", year: "numeric",
                        })}
                      </span>
                      {report.asOf && (
                        <span className="text-xs text-muted-foreground/50">
                          Data as of {new Date(report.asOf + "T12:00:00Z").toLocaleDateString("en-US", {
                            month: "short", day: "numeric", year: "numeric",
                          })}
                        </span>
                      )}
                    </div>
                    <h3 className="text-sm font-semibold text-foreground leading-snug mb-2">
                      {report.title}
                    </h3>
                    {report.summary && (
                      <p className="text-xs text-muted-foreground leading-relaxed mb-2">
                        {report.summary}
                      </p>
                    )}
                    {/* Key findings: prefer report.highlights, fall back to hard-coded per-ID findings */}
                    {((report.highlights && report.highlights.length > 0) || KEY_FINDINGS[report.id]) && (
                      <div className="mb-3">
                        <p className="text-xs font-semibold text-foreground/70 uppercase tracking-wider mb-1.5">Key Findings</p>
                      <ul className="space-y-0.5 mb-2">
                        {(report.highlights ?? KEY_FINDINGS[report.id] ?? []).map((h, i) => (
                          <li key={i} className="flex items-start gap-1.5 text-xs text-muted-foreground">
                            <ChevronRight size={12} className="text-primary/40 mt-0.5 shrink-0" />
                            {h}
                          </li>
                        ))}
                      </ul>
                      </div>
                    )}
                    <div className="flex items-center gap-3">
                      <Link
                        href={`/reports/${report.id}`}
                        className="inline-flex items-center gap-1 text-xs text-primary hover:underline font-medium"
                      >
                        Read full report →
                      </Link>
                      <a
                        href={deriveFileUrl(report)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
                      >
                        Raw on GitHub <ExternalLink size={9} />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ))}

          <div className="pt-4 p-5 rounded border border-border/40 bg-card/40">
            <h2 className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-4">
              What Each Report Covers
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { label: "Aggregate movement", desc: "Documented floor vs. prior quarter, range update" },
                { label: "Payment-% direction", desc: "Which trusts cut, held, or raised their rates" },
                { label: "Depletion trends", desc: "Projected depletion dates for top-10 trusts" },
                { label: "System events", desc: "New filings, closures, court orders, amendments" },
                { label: "Data-quality ledger", desc: "Count of (a)/(b)/(c) records, upgrades this quarter" },
                { label: "Watch list", desc: "Trusts with pending decisions in the next 90 days" },
              ].map((item) => (
                <div key={item.label} className="flex items-start gap-2.5">
                  <ChevronRight size={14} className="text-primary/50 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs font-semibold text-foreground">{item.label}</p>
                    <p className="text-xs text-muted-foreground">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <p className="text-xs text-muted-foreground/40 text-center pt-2">
            Reports are committed to the public GitHub repository with a stable identifier
            and indexed in <span className="font-mono">reports/index.json</span> for programmatic access.
          </p>
        </div>
      )}
    </div>
  );
}

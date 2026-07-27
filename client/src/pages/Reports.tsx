import { useEffect, useState } from "react";
import { ExternalLink, FileText, Calendar, ChevronRight } from "lucide-react";
import { Link } from "wouter";

interface Report {
  id: string;           // e.g. "ATR-2026-Q3"
  title: string;
  quarter: string;      // e.g. "Q3 2026"
  publishedAt: string;  // ISO date string
  summary: string;
  fileUrl?: string;     // GitHub raw URL to the report markdown/PDF
  highlights?: string[];
}

interface ReportsIndex {
  reports: Report[];
  lastUpdated?: string;
}

export default function Reports() {
  const [data, setData] = useState<ReportsIndex | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/reports")
      .then((r) => r.json())
      .then((d: ReportsIndex) => setData(d))
      .catch(() => setData({ reports: [] }))
      .finally(() => setLoading(false));
  }, []);

  const reports = data?.reports ?? [];
  const nextReportDate = "October 1, 2026";
  const nextReportId = "ATR-2026-Q3";

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
        /* ── Pending state: no reports yet ──────────────────────────────── */
        <div className="space-y-6">
          <div className="p-6 rounded border border-dashed border-border/60 bg-card/30 text-center">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <FileText size={22} className="text-primary/60" />
            </div>
            <p className="text-sm font-semibold text-foreground mb-1">
              First report due {nextReportDate}
            </p>
            <p className="text-xs text-muted-foreground mb-3">
              Identifier: <span className="font-mono text-primary/80">{nextReportId}</span>
            </p>
            <p className="text-xs text-muted-foreground/70 max-w-sm mx-auto">
              The inaugural quarterly report will cover Q3 2026 system events, aggregate movement
              since site launch, and a baseline data-quality ledger for all 42 tracked trusts.
            </p>
          </div>

          {/* What to expect */}
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

          <p className="text-xs text-muted-foreground/50 text-center">
            Reports are committed to the public GitHub repository with a stable identifier
            and indexed in <span className="font-mono">reports/index.json</span> for programmatic access.
          </p>
        </div>
      ) : (
        /* ── Reports list ─────────────────────────────────────────────── */
        <div className="space-y-4">
          {reports
            .slice()
            .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))
            .map((report) => (
              <div
                key={report.id}
                className="p-5 rounded border border-border/50 bg-card/40 hover:border-border transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className="text-xs font-mono px-1.5 py-0.5 rounded bg-primary/10 text-primary/80 border border-primary/20">
                        {report.id}
                      </span>
                      <span className="text-xs text-muted-foreground/60 flex items-center gap-1">
                        <Calendar size={10} />
                        {new Date(report.publishedAt).toLocaleDateString("en-US", {
                          month: "long", day: "numeric", year: "numeric",
                        })}
                      </span>
                    </div>
                    <h3 className="text-sm font-semibold text-foreground leading-snug mb-1.5">
                      {report.title}
                    </h3>
                    {report.summary && (
                      <p className="text-xs text-muted-foreground leading-relaxed mb-2">
                        {report.summary}
                      </p>
                    )}
                    {report.highlights && report.highlights.length > 0 && (
                      <ul className="space-y-0.5 mb-2">
                        {report.highlights.map((h, i) => (
                          <li key={i} className="flex items-start gap-1.5 text-xs text-muted-foreground">
                            <ChevronRight size={12} className="text-primary/40 mt-0.5 shrink-0" />
                            {h}
                          </li>
                        ))}
                      </ul>
                    )}
                    {report.fileUrl && (
                      <a
                        href={report.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
                      >
                        Read full report <ExternalLink size={10} />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}

          {data?.lastUpdated && (
            <p className="text-xs text-muted-foreground/40 text-center pt-2">
              Index last updated: {new Date(data.lastUpdated).toLocaleDateString("en-US", {
                month: "long", day: "numeric", year: "numeric",
              })}
            </p>
          )}
        </div>
      )}
    </div>
  );
}


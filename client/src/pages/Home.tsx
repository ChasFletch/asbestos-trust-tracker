import { DebtClockBillboard } from "@/components/DebtClock";
import { trpc } from "@/lib/trpc";
import { AlertCircle, ArrowRight, BookOpen, Clock, Database, FileText, ShieldCheck } from "lucide-react";
import { Link } from "wouter";

export default function Home() {
  const { data: agg, isLoading } = trpc.aggregate.current.useQuery();
  const { data: news } = trpc.news.list.useQuery({ limit: 3 });
  const { data: figures } = trpc.trustFigures.summary.useQuery();
  const { data: allTrustFigures } = trpc.trustFigures.allTrusts.useQuery();

  const remaining = agg?.remainingLow ?? 17041946126;
  const remainingLow = agg?.remainingLow ?? 17041946126;
  const remainingHigh = agg?.remainingHigh ?? 22500000000;
  const paidOut = agg?.paidOut ?? 26629722253;

  const lastUpdated = figures?.asOf ?? "2026-07-27";
  const topTrusts = figures?.topTrusts ?? [];

  // Derive stats from trust-figures.json (primary source, all 42 trusts)
  // allTrustFigures returns { asOf, trusts[] }
  const tf = allTrustFigures?.trusts ?? [];
  const activeTrusts = tf.filter((t: { status: string }) => t.status === "active" || t.status === "active_deferral");
  const filedTrusts = tf.filter((t: { confidence: string }) => t.confidence === "filed");
  const recentDataTrusts = tf.filter((t: { assetsAsOf: string | null }) => {
    if (!t.assetsAsOf) return false;
    const year = parseInt(t.assetsAsOf.substring(0, 4));
    return year >= 2025;
  });

  return (
    <div>
      {/* ── Hero Clock ──────────────────────────────────────────────────────── */}
      <section
        className="relative overflow-hidden"
        style={{
          background: "oklch(0.975 0.006 80)",
          minHeight: "min(82vh, 640px)",
        }}
      >
        {/* Grid overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: "linear-gradient(oklch(0.52 0.18 45 / 0.05) 1px, transparent 1px), linear-gradient(90deg, oklch(0.52 0.18 45 / 0.05) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        <div className="container relative z-10 flex flex-col items-center justify-center py-16 gap-10">
          {/* Eyebrow */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/30 bg-primary/5">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-xs font-mono text-primary/80 uppercase tracking-widest">
              Live Data — Updated Weekly
            </span>
          </div>

          {/* Headline */}
          <div className="text-center space-y-2">
            <h1
              className="font-display font-bold uppercase text-foreground"
              style={{ fontSize: "clamp(1.4rem, 4vw, 2.2rem)", letterSpacing: "0.05em" }}
            >
              U.S. Asbestos Bankruptcy Trust System
            </h1>
            <p className="text-muted-foreground text-sm max-w-xl mx-auto">
              Primary-sourced data from filed court documents, trust annual reports, and quarterly filings.
              The only tracker that cites its sources.
            </p>
          </div>

          {/* Clocks */}
          <div className="w-full max-w-5xl">
            {isLoading ? (
              <div className="h-72 rounded-lg animate-pulse bg-muted" />
            ) : (
              <DebtClockBillboard
                remaining={remaining}
                payouts={paidOut}
                remainingLow={remainingLow}
                remainingHigh={remainingHigh}
                lastUpdated={lastUpdated}
                topTrusts={topTrusts}
              />
            )}
            <div className="flex flex-wrap items-center justify-between gap-3 px-2 py-3 text-xs font-mono text-muted-foreground/50 mt-1">
              <span>
                {tf.length > 0 ? `${activeTrusts.length} active trusts tracked` : "41 active trusts tracked"}
              </span>
              <Link href="/methodology" className="hover:text-primary transition-colors no-underline">
                How is this calculated? →
              </Link>
            </div>
          </div>

          {/* Alert strip */}
        </div>
      </section>

      {/* ── Stats bar ───────────────────────────────────────────────────────── */}
      <section className="border-y border-border bg-secondary/60">
        <div className="container py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { label: "Active Trusts Tracked", value: tf.length > 0 ? activeTrusts.length : 41, icon: Database },
              { label: "Court-Filed Sources", value: tf.length > 0 ? filedTrusts.length : 10, icon: ShieldCheck },
              { label: "Current-Year Data", value: tf.length > 0 ? recentDataTrusts.length : 10, icon: Clock },
              { label: "Total Trusts in Database", value: tf.length > 0 ? tf.length : 42, icon: BookOpen },
            ].map((stat) => (
              <div key={stat.label} className="flex flex-col gap-1">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <stat.icon size={14} />
                  <span className="text-xs uppercase tracking-wider">{stat.label}</span>
                </div>
                <div className="font-display font-bold text-2xl text-foreground">{stat.value}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Latest news strip ───────────────────────────────────────────────── */}
      {news && news.length > 0 && (
        <section className="container py-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display font-bold uppercase tracking-wider text-lg">Latest Updates</h2>
            <Link href="/news" className="text-sm text-primary hover:underline no-underline flex items-center gap-1">
              All updates <ArrowRight size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {news.map((item) => (
              <div key={item.id} className="p-4 rounded border border-border/50 bg-card hover:border-border transition-colors">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-mono text-muted-foreground/60 uppercase tracking-wider">
                    {item.category?.replace("_", " ")}
                  </span>
                  {item.publishedAt && (
                    <span className="text-xs text-muted-foreground/40">
                      · {new Date(item.publishedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </span>
                  )}
                </div>
                <p className="text-sm font-medium text-foreground leading-snug">{item.title}</p>
                {item.summary && (
                  <p className="text-xs text-muted-foreground mt-2 line-clamp-2">{item.summary}</p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── CTA strip ───────────────────────────────────────────────────────── */}
      <section className="border-t border-border bg-secondary/40">
        <div className="container py-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="font-display font-bold uppercase tracking-wider text-base mb-1">
              Explore the Full Trust Database
            </h3>
            <p className="text-sm text-muted-foreground">
              Sortable, filterable data on every active trust — payment percentages, net assets, source confidence, and full history.
            </p>
          </div>
          <Link
            href="/trusts"
            className="shrink-0 px-5 py-2.5 rounded bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity no-underline"
          >
            View Trust Data →
          </Link>
        </div>
      </section>
    </div>
  );
}

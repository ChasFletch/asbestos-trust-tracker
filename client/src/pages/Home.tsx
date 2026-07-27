import { DebtClockBillboard } from "@/components/DebtClock";
import { trpc } from "@/lib/trpc";
import { AlertCircle, ArrowRight, Clock, Database, FileText } from "lucide-react";
import { Link } from "wouter";

export default function Home() {
  const { data: agg, isLoading } = trpc.aggregate.current.useQuery();
  const { data: trusts } = trpc.trusts.list.useQuery();
  const { data: news } = trpc.news.list.useQuery({ limit: 3 });

  const remaining = agg?.remainingLow ?? 17041946126;
  const remainingLow = agg?.remainingLow ?? 17041946126;
  const remainingHigh = agg?.remainingHigh ?? 22500000000;
  const paidOut = agg?.paidOut ?? 24000000000;

  const activeTrusts = trusts?.filter((t) => t.status === "active") ?? [];
  const recentCuts = trusts?.filter((t) => t.direction === "down") ?? [];
  const recentIncreases = trusts?.filter((t) => t.direction === "up") ?? [];

  return (
    <div>
      {/* ── Hero Clock ──────────────────────────────────────────────────────── */}
      <section
        className="relative overflow-hidden"
        style={{
          background: "radial-gradient(ellipse 80% 60% at 50% 0%, oklch(0.15 0.04 45 / 0.3) 0%, transparent 70%), oklch(0.08 0.005 240)",
          minHeight: "min(90vh, 700px)",
        }}
      >
        {/* Grid overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: "linear-gradient(oklch(0.72 0.18 45 / 0.04) 1px, transparent 1px), linear-gradient(90deg, oklch(0.72 0.18 45 / 0.04) 1px, transparent 1px)",
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
              <div className="h-72 rounded-lg animate-pulse" style={{ background: "oklch(0.18 0.05 180)" }} />
            ) : (
              <DebtClockBillboard remaining={remaining} payouts={paidOut} remainingLow={remainingLow} remainingHigh={remainingHigh} />
            )}
            <div className="flex flex-wrap items-center justify-between gap-3 px-2 py-3 text-xs font-mono text-muted-foreground/50 mt-1">
              <span>
                {activeTrusts.length > 0 ? `${activeTrusts.length} active trusts tracked` : "20+ active trusts tracked"}
              </span>
              <Link href="/methodology" className="hover:text-primary transition-colors no-underline">
                How is this calculated? →
              </Link>
            </div>
          </div>

          {/* Alert strip */}
          {recentCuts.length > 0 && (
            <div className="w-full max-w-4xl flex items-start gap-3 px-4 py-3 rounded border border-destructive/30 bg-destructive/5 text-sm">
              <AlertCircle size={16} className="text-destructive mt-0.5 shrink-0" />
              <span className="text-muted-foreground">
                <span className="text-foreground font-medium">{recentCuts.length} trust{recentCuts.length > 1 ? "s" : ""}</span> recently reduced payment percentages, including{" "}
                <span className="text-foreground">{recentCuts.slice(0, 2).map((t) => t.shortName ?? t.name).join(" and ")}</span>.{" "}
                <Link href="/trusts?filter=down" className="text-primary hover:underline no-underline">View all →</Link>
              </span>
            </div>
          )}
        </div>
      </section>

      {/* ── Stats bar ───────────────────────────────────────────────────────── */}
      <section className="border-y border-border/50 bg-card/50">
        <div className="container py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { label: "Active Trusts Tracked", value: activeTrusts.length || "20+", icon: Database },
              { label: "Quarterly Filers", value: "1", icon: Clock },
              { label: "Primary-Sourced Records", value: trusts?.filter((t) => t.netAssetsSource === "a").length || "1", icon: FileText },
              { label: "Recent Payment Cuts", value: recentCuts.length || "2", icon: AlertCircle },
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
      <section className="border-t border-border/50 bg-card/30">
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

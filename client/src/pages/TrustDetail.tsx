import { useParams, Link } from "wouter";
import { trpc } from "@/lib/trpc";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import {
  ArrowLeft, ExternalLink, TrendingDown, TrendingUp, Minus, AlertTriangle,
  Calendar, DollarSign, FileText, Activity,
} from "lucide-react";

// ── Helpers ──────────────────────────────────────────────────────────────────
function fmt$(n: number | null | undefined) {
  if (!n) return "—";
  if (n >= 1e9) return `$${(n / 1e9).toFixed(2)}B`;
  if (n >= 1e6) return `$${(n / 1e6).toFixed(1)}M`;
  return `$${n.toLocaleString()}`;
}

function ConfidenceBadge({ confidence }: { confidence: string }) {
  const label = confidence === "filed" ? "a" : confidence === "secondary" ? "b" : "c";
  const cls =
    confidence === "filed"
      ? "bg-emerald-100 text-emerald-800 border-emerald-200"
      : confidence === "secondary"
      ? "bg-sky-100 text-sky-800 border-sky-200"
      : "bg-amber-100 text-amber-700 border-amber-200";
  const title =
    confidence === "filed"
      ? "(a) Filed — primary source document"
      : confidence === "secondary"
      ? "(b) Secondary — trust website or press release"
      : "(c) Estimate — modeled or inferred";
  return (
    <span
      title={title}
      className={`inline-flex items-center justify-center w-5 h-5 rounded-full text-[10px] font-bold border ${cls}`}
    >
      {label}
    </span>
  );
}

function DirectionIcon({ direction }: { direction: string | null }) {
  if (direction === "down") return <TrendingDown size={14} className="text-red-500" />;
  if (direction === "up") return <TrendingUp size={14} className="text-emerald-600" />;
  return <Minus size={14} className="text-muted-foreground" />;
}

function changeTypeLabel(type: string) {
  const map: Record<string, { label: string; cls: string }> = {
    percentage_cut: { label: "Payment % Cut", cls: "bg-red-100 text-red-700 border-red-200" },
    percentage_increase: { label: "Payment % Increase", cls: "bg-emerald-100 text-emerald-700 border-emerald-200" },
    reconsideration_notice: { label: "Reconsideration Notice", cls: "bg-amber-100 text-amber-700 border-amber-200" },
    closure: { label: "Trust Closed", cls: "bg-gray-200 text-gray-700 border-gray-300" },
    future_trust: { label: "Future Trust", cls: "bg-sky-100 text-sky-700 border-sky-200" },
    audit: { label: "Audit / Review", cls: "bg-violet-100 text-violet-700 border-violet-200" },
    amendment: { label: "TDP Amendment", cls: "bg-orange-100 text-orange-700 border-orange-200" },
  };
  const entry = map[type] ?? { label: type.replace(/_/g, " "), cls: "bg-muted text-muted-foreground border-border" };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider border ${entry.cls}`}>
      {entry.label}
    </span>
  );
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function TrustDetail() {
  const { slug } = useParams<{ slug: string }>();

  // Fetch from JSON (primary — all 42 trusts, financials)
  const { data: jsonTrust, isLoading: jsonLoading } = trpc.trustFigures.bySlug.useQuery(
    { slug: slug ?? "" },
    { enabled: !!slug }
  );

  // Fetch from DB (supplementary — metadata, payment history)
  const { data: dbTrust, isLoading: dbLoading } = trpc.trusts.bySlug.useQuery(
    { slug: slug ?? "" },
    { enabled: !!slug }
  );

  const isLoading = jsonLoading || dbLoading;

  // Merge: JSON is authoritative for financials, DB for metadata
  const trust = jsonTrust
    ? {
        name: jsonTrust.name,
        shortName: jsonTrust.shortName,
        netAssets: jsonTrust.netAssets,
        assetsAsOf: jsonTrust.assetsAsOf,
        assetsBasis: jsonTrust.assetsBasis,
        paymentPercentage: jsonTrust.paymentPercentage,
        status: jsonTrust.status,
        confidence: jsonTrust.confidence,
        note: jsonTrust.note,
        changes: jsonTrust.changes,
        company: dbTrust?.company ?? null,
        established: dbTrust?.established ?? null,
        administrator: dbTrust?.administrator ?? null,
        court: dbTrust?.court ?? null,
        docket: dbTrust?.docket ?? null,
        website: dbTrust?.website ?? null,
        cumulativePaid: dbTrust?.cumulativePaid ?? null,
        cumulativePaidAsOf: (dbTrust as any)?.cumulativePaidAsOf ?? null,
        cumulativePaidSource: (dbTrust as any)?.cumulativePaidSource ?? null,
        cumulativePaidSourceUrl: (dbTrust as any)?.cumulativePaidSourceUrl ?? null,
        cumulativeClaims: dbTrust?.cumulativeClaims ?? null,
        reportingFrequency: dbTrust?.reportingFrequency ?? null,
        direction: dbTrust?.direction ?? null,
        netAssetsCitation: dbTrust?.netAssetsCitation ?? null,
        paymentHistory: dbTrust?.paymentHistory ?? [],
      }
    : null;

  // Build chart data from payment history
  const chartData = (() => {
    if (!trust) return [];
    const history = [...(trust.paymentHistory ?? [])];
    if (trust.paymentPercentage !== null && trust.assetsAsOf) {
      const lastDate = history[history.length - 1]?.effective;
      if (!lastDate || lastDate < trust.assetsAsOf) {
        history.push({ effective: trust.assetsAsOf, pct: trust.paymentPercentage, notes: "Current" } as any);
      }
    }
    return history.map((h: any) => ({ date: h.effective, pct: h.pct, label: h.notes ?? "" }));
  })();

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="h-8 w-48 bg-muted animate-pulse rounded mb-6" />
        <div className="grid grid-cols-4 gap-4 mb-8">
          {[1, 2, 3, 4].map(i => <div key={i} className="h-24 bg-muted animate-pulse rounded" />)}
        </div>
        <div className="h-64 bg-muted animate-pulse rounded" />
      </div>
    );
  }

  if (!trust) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <AlertTriangle size={40} className="mx-auto mb-4 text-amber-500" />
        <h1 className="text-xl font-semibold mb-2">Trust not found</h1>
        <p className="text-muted-foreground mb-6">
          No trust matching <code className="bg-muted px-1 rounded">{slug}</code> was found.
        </p>
        <Link href="/trusts" className="text-sm text-primary hover:underline">
          Back to Trust Data
        </Link>
      </div>
    );
  }

  const statusCls =
    trust.status === "active"
      ? "bg-emerald-100 text-emerald-800 border-emerald-200"
      : trust.status === "closed"
      ? "bg-gray-200 text-gray-700 border-gray-300"
      : "bg-amber-100 text-amber-700 border-amber-200";

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
        <Link href="/trusts" className="hover:text-foreground transition-colors flex items-center gap-1">
          <ArrowLeft size={14} />
          Trust Data
        </Link>
        <span>/</span>
        <span className="text-foreground font-medium">{trust.shortName}</span>
      </div>

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-start gap-3 flex-wrap mb-2">
          <h1 className="font-display font-bold text-2xl leading-tight text-foreground">
            {trust.name}
          </h1>
          <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold uppercase tracking-wider border mt-1 ${statusCls}`}>
            {trust.status}
          </span>
          {trust.direction && <span className="mt-1.5"><DirectionIcon direction={trust.direction} /></span>}
        </div>
        {trust.company && <p className="text-muted-foreground text-sm">{trust.company}</p>}
        {trust.website && (
          <a href={trust.website} target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs text-primary hover:underline mt-1">
            {trust.website.replace(/^https?:\/\//, "")}
            <ExternalLink size={10} />
          </a>
        )}
      </div>

      {/* Key metrics grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <div className="bg-card border border-border/50 rounded-lg p-4">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
            <DollarSign size={12} />Net Assets
            {trust.confidence && <span className="ml-auto"><ConfidenceBadge confidence={trust.confidence} /></span>}
          </div>
          <div className="text-xl font-mono font-bold text-foreground">{fmt$(trust.netAssets)}</div>
          {trust.assetsAsOf && <div className="text-xs text-muted-foreground/60 mt-0.5">as of {trust.assetsAsOf}</div>}
          {trust.assetsBasis && <div className="text-xs text-muted-foreground/50 mt-0.5 italic">{trust.assetsBasis}</div>}
        </div>

        <div className="bg-card border border-border/50 rounded-lg p-4">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
            <Activity size={12} />Payment %
          </div>
          <div className="text-xl font-mono font-bold text-foreground">
            {trust.paymentPercentage !== null ? `${trust.paymentPercentage}%` : "MSV / N/A"}
          </div>
          {trust.paymentPercentage !== null && (
            <div className="text-xs text-muted-foreground/60 mt-0.5">of scheduled value</div>
          )}
        </div>

        <div className="bg-card border border-border/50 rounded-lg p-4">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
            <Calendar size={12} />Established
          </div>
          <div className="text-xl font-mono font-bold text-foreground">{trust.established ?? "—"}</div>
          {trust.reportingFrequency && trust.reportingFrequency !== "unknown" && (
            <div className="text-xs text-muted-foreground/60 mt-0.5 capitalize">{trust.reportingFrequency} reporting</div>
          )}
        </div>

        <div className="bg-card border border-border/50 rounded-lg p-4">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
            <FileText size={12} />Cumulative Paid
            {(trust as any).cumulativePaidSourceUrl && (
              <a
                href={(trust as any).cumulativePaidSourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-auto inline-flex items-center gap-0.5 text-primary hover:underline text-[10px] font-medium"
                title="View source document"
              >
                source <ExternalLink size={9} />
              </a>
            )}
          </div>
          <div className="text-xl font-mono font-bold text-foreground">{fmt$(trust.cumulativePaid)}</div>
          {(trust as any).cumulativePaidAsOf && (
            <div className="text-xs text-muted-foreground/60 mt-0.5">as of {(trust as any).cumulativePaidAsOf}</div>
          )}
          {trust.cumulativeClaims && (
            <div className="text-xs text-muted-foreground/60 mt-0.5">{trust.cumulativeClaims.toLocaleString()} claims</div>
          )}
        </div>
      </div>

      {/* Payment % History Chart */}
      {chartData.length > 1 && (
        <div className="bg-card border border-border/50 rounded-lg p-6 mb-6">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">
            Payment Percentage History
          </h2>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={chartData} margin={{ top: 4, right: 16, left: 0, bottom: 4 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} tickLine={false} />
              <YAxis
                tickFormatter={(v) => `${v}%`}
                tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                tickLine={false} axisLine={false} domain={[0, "auto"]}
              />
              <Tooltip
                formatter={(v: number) => [`${v}%`, "Payment %"]}
                contentStyle={{
                  background: "hsl(var(--card))", border: "1px solid hsl(var(--border))",
                  borderRadius: "6px", fontSize: "12px",
                }}
              />
              <Line type="stepAfter" dataKey="pct" stroke="hsl(var(--primary))"
                strokeWidth={2} dot={{ r: 4, fill: "hsl(var(--primary))" }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Two-column: metadata + changes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-card border border-border/50 rounded-lg p-5">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">Trust Details</h2>
          <dl className="space-y-3 text-sm">
            {trust.administrator && (
              <div className="flex justify-between gap-2">
                <dt className="text-muted-foreground shrink-0">Administrator</dt>
                <dd className="text-foreground text-right">{trust.administrator}</dd>
              </div>
            )}
            {trust.court && (
              <div className="flex justify-between gap-2">
                <dt className="text-muted-foreground shrink-0">Court</dt>
                <dd className="text-foreground text-right font-mono text-xs">{trust.court}</dd>
              </div>
            )}
            {trust.docket && (
              <div className="flex justify-between gap-2">
                <dt className="text-muted-foreground shrink-0">Docket</dt>
                <dd className="text-foreground text-right font-mono text-xs">{trust.docket}</dd>
              </div>
            )}
            {trust.netAssetsCitation && (
              <div>
                <dt className="text-muted-foreground mb-1">Asset Source</dt>
                <dd className="text-foreground text-xs leading-relaxed">{trust.netAssetsCitation}</dd>
              </div>
            )}
            {trust.note && (
              <div>
                <dt className="text-muted-foreground mb-1">Notes</dt>
                <dd className="text-foreground text-xs leading-relaxed">{trust.note}</dd>
              </div>
            )}
          </dl>
        </div>

        {trust.changes && trust.changes.length > 0 && (
          <div className="bg-card border border-border/50 rounded-lg p-5">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">Recent Events</h2>
            <div className="space-y-4">
              {[...trust.changes].sort((a, b) => b.date.localeCompare(a.date)).map((evt, i) => (
                <div key={i} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className="w-2 h-2 rounded-full bg-primary mt-1.5 shrink-0" />
                    {i < trust.changes!.length - 1 && <div className="w-px flex-1 bg-border/50 mt-1" />}
                  </div>
                  <div className="pb-3 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="text-xs text-muted-foreground font-mono">{evt.date}</span>
                      {changeTypeLabel(evt.type)}
                    </div>
                    <p className="text-xs text-foreground leading-relaxed">{evt.detail}</p>
                    {evt.source && <p className="text-xs text-muted-foreground/60 mt-0.5 italic">{evt.source}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer nav */}
      <div className="flex items-center justify-between pt-4 border-t border-border/30">
        <Link href="/trusts" className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors">
          <ArrowLeft size={14} />Back to all trusts
        </Link>
        <Link href="/methodology" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
          Methodology
        </Link>
      </div>
    </div>
  );
}

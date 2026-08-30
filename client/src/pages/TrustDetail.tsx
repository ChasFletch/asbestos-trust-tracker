import { useParams, Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { useState, useMemo } from "react";
import { SourceDocModal } from "@/components/SourceDocModal";
import { ReviewerCredentialsModal } from "@/components/ReviewerCredentialsModal";
import { primarySourceDocumentsBySlug } from "@/data/primarySourceDocuments";
import { NEWS_BRIEFS_BY_SLUG } from "@/data/newsBriefs";
import {
  Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink,
  BreadcrumbPage, BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import {
  ExternalLink, TrendingDown, TrendingUp, Minus, AlertTriangle,
  Calendar, DollarSign, FileText, Activity,
  Home, Database, ArrowLeft, Info, Newspaper,
} from "lucide-react";

// ── Helpers ──────────────────────────────────────────────────────────────────
function fmt$(n: number | null | undefined) {
  if (!n) return "—";
  if (n >= 1e9) return `$${(n / 1e9).toFixed(2)}B`;
  if (n >= 1e6) return `$${(n / 1e6).toFixed(1)}M`;
  return `$${n.toLocaleString()}`;
}

function slugify(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function historicalSourceAge(asOf: string | null | undefined, referenceDate: string | null | undefined) {
  if (!asOf || !referenceDate) return null;
  const source = new Date(`${asOf}T00:00:00Z`);
  const reference = new Date(`${referenceDate}T00:00:00Z`);
  if (Number.isNaN(source.getTime()) || Number.isNaN(reference.getTime()) || source > reference) return null;

  let months = (reference.getUTCFullYear() - source.getUTCFullYear()) * 12 + reference.getUTCMonth() - source.getUTCMonth();
  if (reference.getUTCDate() < source.getUTCDate()) months -= 1;
  if (months < 18) return null;

  const years = Math.floor(months / 12);
  const remainingMonths = months % 12;
  const age = years > 0
    ? `${years} year${years === 1 ? "" : "s"}${remainingMonths ? `, ${remainingMonths} month${remainingMonths === 1 ? "" : "s"}` : ""}`
    : `${remainingMonths} months`;
  return `Historical source — ${age} old; payments may have continued after this report.`;
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

// ── Related News ─────────────────────────────────────────────────────────────
function RelatedNews({ trustName, slug }: { trustName: string; slug: string }) {
  const { data: news, isLoading } = trpc.news.byTrust.useQuery(
    { trustId: slug, trustName, limit: 5 },
    { enabled: !!slug && !!trustName }
  );
  const detailedBrief = slug === "manville-personal-injury-settlement-trust"
    ? NEWS_BRIEFS_BY_SLUG["manville-q2-2026-financial-statements"]
    : undefined;

  if (isLoading || (!detailedBrief && (!news || news.length === 0))) return null;

  return (
    <div className="bg-card border border-border/50 rounded-lg p-5 mb-6">
      <div className="flex items-center gap-2 mb-3">
        <Newspaper size={14} className="text-muted-foreground" />
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Related News
        </h2>
      </div>
      <div className="space-y-3">
        {detailedBrief && (
          <div className="flex items-start gap-3 group rounded-md border border-primary/15 bg-primary/[0.035] p-3">
            <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
            <div className="flex-1 min-w-0">
              <Link href={`/news/${detailedBrief.slug}`} className="block text-sm font-medium text-foreground group-hover:text-primary transition-colors leading-snug hover:underline">
                {detailedBrief.title}
              </Link>
              <p className="text-xs text-muted-foreground leading-relaxed mt-1">{detailedBrief.summary}</p>
              <div className="flex items-center gap-2 mt-1.5">
                <span className="text-xs text-muted-foreground/60">
                  {new Date(`${detailedBrief.date}T12:00:00Z`).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" })}
                </span>
                <span className="text-[10px] uppercase tracking-wider text-primary/70 font-medium">Filed quarterly report</span>
              </div>
            </div>
          </div>
        )}
        {(news ?? []).map((item: any) => (
          <div key={item.id} className="flex items-start gap-3 group">
            <div className="w-1.5 h-1.5 rounded-full bg-primary/40 mt-2 shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="text-sm text-foreground group-hover:text-primary transition-colors leading-snug">
                {item.url ? (
                  <a href={item.url} target="_blank" rel="noopener noreferrer" className="hover:underline">
                    {item.title}
                  </a>
                ) : (
                  item.title
                )}
              </div>
              <div className="flex items-center gap-2 mt-0.5">
                {item.publishedAt && (
                  <span className="text-xs text-muted-foreground/60">
                    {new Date(item.publishedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" })}
                  </span>
                )}
                {item.category && (
                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground/50 font-medium">
                    {item.category.replace(/_/g, " ")}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function TrustDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [sourceModal, setSourceModal] = useState<{ url: string; title: string; citation: string | null } | null>(null);

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
        dataAsOf: (jsonTrust as any)?.dataAsOf ?? null,
        paymentPercentage: jsonTrust.paymentPercentage,
        status: jsonTrust.status,
        confidence: jsonTrust.confidence,
        note: jsonTrust.note,
        changes: jsonTrust.changes,
        company: (jsonTrust as any)?.company ?? dbTrust?.company ?? null,
        established: (jsonTrust as any)?.established ?? dbTrust?.established ?? null,
        administrator: (jsonTrust as any)?.administrator ?? dbTrust?.administrator ?? null,
        court: (jsonTrust as any)?.court ?? dbTrust?.court ?? null,
        docket: (jsonTrust as any)?.docket ?? dbTrust?.docket ?? null,
        website: dbTrust?.website ?? (jsonTrust as any)?.website ?? null,
        scheduledValues: (jsonTrust as any)?.scheduledValues ?? null,
        cumulativePaid: (jsonTrust as any)?.cumulativePaid ?? dbTrust?.cumulativePaid ?? null,
        cumulativePaidAsOf: (jsonTrust as any)?.cumulativePaidAsOf ?? (dbTrust as any)?.cumulativePaidAsOf ?? null,
        cumulativePaidSource: (jsonTrust as any)?.cumulativePaidSource ?? (dbTrust as any)?.cumulativePaidSource ?? null,
        cumulativePaidCalculation: (jsonTrust as any)?.cumulativePaidCalculation ?? null,
        cumulativePaidSourceUrl: (jsonTrust as any)?.cumulativePaidSourceUrl ?? (dbTrust as any)?.cumulativePaidSourceUrl ?? null,
        cumulativePaidSourceUrlType: (jsonTrust as any)?.cumulativePaidSourceUrlType ?? null,
        netAssetsConfidence: (jsonTrust as any)?.netAssetsConfidence ?? null,
        paymentPctConfidence: (jsonTrust as any)?.paymentPctConfidence ?? null,
        assetsBasisUrl: (jsonTrust as any)?.assetsBasisUrl ?? null,
        cumulativeClaims: dbTrust?.cumulativeClaims ?? null,
        reportingFrequency: (jsonTrust as any)?.reportingFrequency ?? dbTrust?.reportingFrequency ?? null,
        direction: (jsonTrust as any)?.direction ?? dbTrust?.direction ?? null,
        paymentPercentageSource: (jsonTrust as any)?.paymentPercentageSource ?? null,
        paymentPercentageSourceUrl: (jsonTrust as any)?.paymentPercentageSourceUrl ?? null,
        paymentPctEffective: (jsonTrust as any)?.paymentPctEffective ?? null,
        rateSource: (jsonTrust as any)?.rateSource ?? null,
        tdpCaveat: (jsonTrust as any)?.tdpCaveat ?? null,
        netAssetsCitation: jsonTrust.assetsBasis ?? dbTrust?.netAssetsCitation ?? null,
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
  const primarySourceDocuments = primarySourceDocumentsBySlug[slugify(trust.name)] ?? [];
  const cumulativePaidSourceAge = historicalSourceAge(trust.cumulativePaidAsOf, trust.dataAsOf);

  return (
    <>
    <div className="max-w-4xl mx-auto px-4 py-10">
      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="mb-6">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/"><Home size={14} className="inline -mt-0.5" /> Home</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/trusts"><Database size={14} className="inline -mt-0.5" /> Trust Data</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{trust.shortName}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </nav>

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
        {/* Reviewed by badge — opens credentials modal */}
        <ReviewerCredentialsModal variant="trust" />
      </div>

      {/* PACER Document Unavailability Indicator */}
      {trust.note && /PACER-only|CM\/ECF.*fail|blocked/i.test(trust.note) && (
        <div className="mb-6 flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50/60 p-4">
          <Info size={16} className="text-amber-600 shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="font-medium text-amber-800 mb-1">Court Document Temporarily Unavailable</p>
            <p className="text-amber-700/80 text-xs leading-relaxed">
              The most recent annual report for this trust is filed with the court but cannot currently be retrieved
              from PACER (Public Access to Court Electronic Records) due to a CM/ECF system error. Some figures shown
              may rely on older filings or secondary sources until the document becomes accessible. We retry periodically.
            </p>
            {trust.cumulativePaidSource && /blocked|CM\/ECF/i.test(trust.cumulativePaidSource) && (
              <p className="text-amber-700/60 text-[11px] mt-2 italic">
                Source note: {trust.cumulativePaidSource.length > 180
                  ? trust.cumulativePaidSource.slice(0, 177) + "…"
                  : trust.cumulativePaidSource}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Key metrics grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <div className="bg-card border border-border/50 rounded-lg p-4">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
            <DollarSign size={12} />Net Assets
            {(trust as any).netAssetsConfidence
              ? <span className="ml-auto"><ConfidenceBadge confidence={(trust as any).netAssetsConfidence} /></span>
              : trust.confidence && <span className="ml-auto"><ConfidenceBadge confidence={trust.confidence} /></span>
            }
          </div>
          <div className="text-xl font-mono font-bold text-foreground">
            {(trust as any).assetsAvailability === "unpublished" ? "Not published" : fmt$(trust.netAssets)}
          </div>
          {trust.assetsAsOf && <div className="text-xs text-muted-foreground/60 mt-0.5">as of {trust.assetsAsOf}</div>}
          {(trust as any).assetsAvailability === "unpublished" && (
            <div className="text-xs text-muted-foreground/60 mt-0.5">balance not publicly reported</div>
          )}
          {trust.assetsBasis && (
            (trust as any).assetsBasisUrl ? (
              <button
                onClick={() => setSourceModal({ url: (trust as any).assetsBasisUrl, title: `${trust.name} — Source Document`, citation: trust.assetsBasis })}
                className="text-xs text-amber-600/70 hover:text-amber-600 mt-0.5 italic text-left underline-offset-2 hover:underline transition-colors block"
              >
                {trust.assetsBasis} ↗
              </button>
            ) : (
              <div className="text-xs text-muted-foreground/50 mt-0.5 italic">{trust.assetsBasis}</div>
            )
          )}
        </div>

        <div className="bg-card border border-border/50 rounded-lg p-4">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
            <Activity size={12} />Payment %
            {(trust as any).paymentPctConfidence && (
              <span className="ml-auto"><ConfidenceBadge confidence={(trust as any).paymentPctConfidence} /></span>
            )}
          </div>
          <div className="text-xl font-mono font-bold text-foreground">
            {trust.paymentPercentage !== null ? `${trust.paymentPercentage}%` : "MSV / N/A"}
          </div>
          {trust.paymentPercentage !== null && (
            <div className="text-xs text-muted-foreground/60 mt-0.5">of scheduled value</div>
          )}
          {(trust as any).paymentPctEffective && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground/60 mt-0.5">
              <Calendar size={10} className="shrink-0" />
              <span>effective {new Date((trust as any).paymentPctEffective + "T00:00:00Z").toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" })}</span>
            </div>
          )}
          {(trust as any).dataAsOf && (
            <div className="text-[10px] text-muted-foreground/40 mt-1">
              Last verified: {new Date((trust as any).dataAsOf + "T00:00:00Z").toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" })}
            </div>
          )}
          {(trust as any).paymentPercentageSource && (
            <div className="text-xs text-muted-foreground/50 mt-1.5 leading-relaxed border-t border-border/30 pt-1.5">
              {(trust as any).paymentPercentageSourceUrl ? (
                <a href={(trust as any).paymentPercentageSourceUrl} target="_blank" rel="noopener noreferrer" className="underline decoration-dotted hover:text-foreground transition-colors">
                  {(trust as any).paymentPercentageSource.length > 90 ? (trust as any).paymentPercentageSource.slice(0, 87) + "…" : (trust as any).paymentPercentageSource} ↗
                </a>
              ) : (
                <span className="italic">{(trust as any).paymentPercentageSource}</span>
              )}
            </div>
          )}
          {(trust as any).rateSource && !(trust as any).paymentPercentageSource && (
            <div className="text-xs text-amber-700/70 mt-1.5 italic border-t border-border/30 pt-1.5">{(trust as any).rateSource}</div>
          )}
        </div>

        {Array.isArray((trust as any).subAccounts) && (trust as any).subAccounts.length > 0 && (
          <div className="bg-card border border-border/50 rounded-lg p-4 col-span-2 sm:col-span-4">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-2">
              <Activity size={12} />Sub-Account Payment Percentages
              <span className="ml-auto text-[10px] italic text-muted-foreground/60">separate asset pools — never combined or averaged</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {(trust as any).subAccounts.map((sa: any) => (
                <div key={sa.name} className="border border-border/30 rounded p-2.5">
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="text-xs font-medium text-foreground">{sa.name}</span>
                    <span className="text-sm font-mono font-bold text-foreground">
                      {sa.value !== null && sa.value !== undefined ? `${sa.value}%` : "not set"}
                    </span>
                  </div>
                  {sa.effective && (
                    <div className="text-[11px] text-muted-foreground/60 mt-0.5">effective {sa.effective}</div>
                  )}
                  {sa.note && (
                    <div className="text-[11px] text-muted-foreground/50 mt-1 italic leading-relaxed">{sa.note}</div>
                  )}
                  {sa.url && (
                    <a href={sa.url} target="_blank" rel="noopener noreferrer" className="text-[11px] text-amber-600/70 hover:text-amber-600 underline decoration-dotted mt-1 inline-block transition-colors">
                      source notice ↗
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

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
              (trust as any).cumulativePaidSourceUrlType === "courtlistener-search" ? (
                <a
                  href={(trust as any).cumulativePaidSourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-auto inline-flex items-center gap-0.5 text-amber-600 hover:underline text-[10px] font-medium"
                  title="CourtListener docket search — opens search results page, not a direct document link"
                >
                  search docket <ExternalLink size={9} />
                </a>
              ) : (
                <button
                  onClick={() => setSourceModal({ url: (trust as any).cumulativePaidSourceUrl, title: trust.name + " — Source Document", citation: (trust as any).cumulativePaidSource ?? null })}
                  className="ml-auto inline-flex items-center gap-0.5 text-primary hover:underline text-[10px] font-medium cursor-pointer"
                  title="Preview source document"
                >
                  source <ExternalLink size={9} />
                </button>
              )
            )}
          </div>
          <div className="text-xl font-mono font-bold text-foreground">{fmt$(trust.cumulativePaid)}</div>
          {(trust as any).cumulativePaidAsOf && (
            <div className="text-xs text-muted-foreground/60 mt-0.5">as of {(trust as any).cumulativePaidAsOf}</div>
          )}
          {cumulativePaidSourceAge && (
            <div className="text-[10px] leading-relaxed text-amber-700/80 mt-1.5 border-t border-amber-200/60 pt-1.5">
              {cumulativePaidSourceAge}
            </div>
          )}
          {trust.cumulativeClaims && (
            <div className="text-xs text-muted-foreground/60 mt-0.5">{trust.cumulativeClaims.toLocaleString()} claims</div>
          )}
        </div>
        {(trust as any).cumulativePaidCalculation && (
          <div className="col-span-2 sm:col-span-4 -mt-1 rounded-lg border border-amber-200/70 bg-amber-50/50 px-4 py-3 text-xs leading-relaxed text-amber-950/80">
            <span className="font-semibold text-amber-900">How this figure was calculated:</span>{" "}
            {(trust as any).cumulativePaidCalculation}
          </div>
        )}
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

      {/* Primary Source Documents */}
      {primarySourceDocuments.length > 0 && (
        <section className="bg-card border border-border/50 rounded-lg p-5 mb-6" aria-labelledby="primary-source-documents">
          <div className="flex items-start justify-between gap-4 mb-4 flex-wrap">
            <div>
              <div className="flex items-center gap-2">
                <FileText size={15} className="text-primary" />
                <h2 id="primary-source-documents" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  Primary Source Documents
                </h2>
              </div>
              <p className="text-xs text-muted-foreground/70 mt-1 leading-relaxed">
                Verified trust notices, annual reports, and trust distribution procedures used in this record. Select a document to preview it on this page.
              </p>
            </div>
            <span className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-emerald-700">
              Primary sources
            </span>
          </div>
          <div className="divide-y divide-border/40 border border-border/40 rounded-md overflow-hidden">
            {primarySourceDocuments.map((document) => (
              <button
                key={document.url}
                onClick={() => setSourceModal({
                  url: document.url,
                  title: `${trust.name} — ${document.title}`,
                  citation: document.citation,
                })}
                className="w-full text-left px-3.5 py-3 flex items-center gap-3 hover:bg-muted/45 transition-colors group"
              >
                <FileText size={15} className="text-primary/70 shrink-0" />
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                    {document.title}
                  </span>
                  <span className="block text-[11px] text-muted-foreground mt-0.5">
                    {document.documentType}{document.dateLabel ? ` · ${document.dateLabel}` : ""}
                  </span>
                </span>
                <span className="inline-flex items-center gap-1 text-[11px] font-medium text-primary shrink-0">
                  Preview <ExternalLink size={11} />
                </span>
              </button>
            ))}
          </div>
        </section>
      )}

      {/* Scheduled Values Table — shown only for trusts with TDP data */}
      {(trust as any).scheduledValues && (() => {
        const sv = (trust as any).scheduledValues;
        const pct = trust.paymentPercentage;
        return (
          <div className="bg-card border border-border/50 rounded-lg p-5 mb-6">
            <div className="flex items-start justify-between gap-4 mb-3 flex-wrap">
              <div>
                <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  Scheduled Values &amp; Payouts
                </h2>
                <p className="text-xs text-muted-foreground/70 mt-0.5">
                  TDP §5.3(c) at current {pct}% payment percentage
                </p>
              </div>
              <span className="text-xs text-muted-foreground/50 italic">{sv.source}</span>
            </div>
            <div className="mb-3 px-3 py-2 bg-amber-500/10 border border-amber-500/20 rounded text-xs text-amber-700 dark:text-amber-400">
              <strong>Note:</strong> {sv.rateNote}
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-border/50">
                    <th className="text-left py-2 pr-3 text-muted-foreground font-medium">Lvl</th>
                    <th className="text-left py-2 pr-3 text-muted-foreground font-medium">Disease</th>
                    <th className="text-right py-2 pr-3 text-muted-foreground font-medium">ER Scheduled</th>
                    <th className="text-right py-2 pr-3 text-muted-foreground font-medium">At {pct}%</th>
                    <th className="text-right py-2 pr-3 text-muted-foreground font-medium">Max Value</th>
                    <th className="text-right py-2 text-muted-foreground font-medium">Max at {pct}%</th>
                  </tr>
                </thead>
                <tbody>
                  {sv.levels.map((row: any) => (
                    <tr key={row.level} className="border-b border-border/30 hover:bg-muted/30 transition-colors">
                      <td className="py-2 pr-3 font-mono text-muted-foreground">{row.level}</td>
                      <td className="py-2 pr-3 text-foreground">
                        {row.disease}
                        {row.note && <span className="ml-1 text-amber-600/70 cursor-help" title={row.note}>*</span>}
                      </td>
                      <td className="py-2 pr-3 text-right font-mono">
                        {row.scheduledValue != null
                          ? `$${row.scheduledValue.toLocaleString()}`
                          : <span className="text-muted-foreground/40 italic">IR only</span>}
                      </td>
                      <td className="py-2 pr-3 text-right font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
                        {row.atCurrentPct != null
                          ? `$${row.atCurrentPct.toLocaleString()}`
                          : <span className="text-muted-foreground/40">—</span>}
                      </td>
                      <td className="py-2 pr-3 text-right font-mono text-muted-foreground">
                        {row.maxValue != null ? `$${row.maxValue.toLocaleString()}` : <span className="text-muted-foreground/40">—</span>}
                      </td>
                      <td className="py-2 text-right font-mono text-muted-foreground">
                        {row.maxAtCurrentPct != null ? `$${row.maxAtCurrentPct.toLocaleString()}` : <span className="text-muted-foreground/40">—</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {sv.tdpCaveat && (
              <p className="mt-3 text-xs text-muted-foreground/50 italic border-t border-border/30 pt-2">
                ⚠ {sv.tdpCaveat}
              </p>
            )}
          </div>
        );
      })()}
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
                <dd className="text-foreground text-xs leading-relaxed">
                  {(trust as any).assetsBasisUrl ? (
                    <button
                      onClick={() => setSourceModal({ url: (trust as any).assetsBasisUrl, title: `${trust.name} — Source Document`, citation: trust.netAssetsCitation })}
                      className="text-amber-600/80 hover:text-amber-600 italic underline-offset-2 hover:underline transition-colors text-left"
                    >
                      {trust.netAssetsCitation} ↗
                    </button>
                  ) : trust.netAssetsCitation}
                </dd>
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
      {/* Related News */}
      <RelatedNews trustName={trust.name} slug={slug ?? ""} />

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
  {sourceModal && (
    <SourceDocModal
      url={sourceModal.url}
      title={sourceModal.title}
      citation={sourceModal.citation}
      onClose={() => setSourceModal(null)}
    />
  )}
  </>
  );
}

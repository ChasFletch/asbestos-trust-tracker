import { trpc } from "@/lib/trpc";
import { useState, useMemo } from "react";
import { ChevronDown, ChevronUp, ChevronsUpDown, TrendingDown, TrendingUp, Minus, ExternalLink, ChevronRight, Download, ArrowUpRight, FileText } from "lucide-react";
import { Link } from "wouter";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Info } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, Cell, ResponsiveContainer } from "recharts";
import { SourceDocModal } from "@/components/SourceDocModal";

type SortKey = "name" | "paymentPercentage" | "netAssets" | "status" | "confidence" | "established";
type SortDir = "asc" | "desc";

// Unified trust shape merging JSON + DB data
interface TrustRow {
  id: string; // derived from name
  name: string;
  shortName: string;
  netAssets: number | null;
  assetsAsOf: string | null;
  assetsBasis: string | null;
  paymentPercentage: number | null;
  status: string;
  paymentPercentageFB?: number | null;
  confidence: string; // "filed" | "secondary" | "estimate"
  note: string | null;
  // DB-only extras (may be null for JSON-only trusts)
  administrator?: string | null;
  court?: string | null;
  docket?: string | null;
  website?: string | null;
  direction?: string | null;
  paymentHistory?: Array<{ pct: number; effective: string; notes?: string }>;
  cumulativePaid?: number | null;
  cumulativePaidAsOf?: string | null;
  cumulativePaidSource?: string | null;
  cumulativePaidSourceUrl?: string | null;
  established?: number | null;
}

function slugify(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function ConfidenceBadge({ confidence }: { confidence: string }) {
  const label = confidence === "filed" ? "a" : confidence === "secondary" ? "b" : "c";
  return (
    <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-xs font-mono badge-source-${label}`}>
      ({label})
    </span>
  );
}

function StatusBadge({ status }: { status: string }) {
  if (status === "closed") return (
    <span className="text-xs px-1.5 py-0.5 rounded bg-red-100 text-red-700 border border-red-200 font-medium">closed</span>
  );
  if (status === "active_deferral") return (
    <span className="text-xs px-1.5 py-0.5 rounded bg-amber-100 text-amber-700 border border-amber-200 font-medium">deferral</span>
  );
  return (
    <span className="text-xs px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 font-medium">active</span>
  );
}

function DirectionIcon({ direction }: { direction?: string | null }) {
  if (direction === "up") return <TrendingUp size={14} className="text-[oklch(0.72_0.18_150)]" />;
  if (direction === "down") return <TrendingDown size={14} className="text-destructive" />;
  return <Minus size={14} className="text-muted-foreground/50" />;
}

function formatAssets(n: number | null): string {
  if (n === null || n === undefined) return "—";
  if (n === 0) return "$0";
  if (n >= 1e9) return `$${(n / 1e9).toFixed(3)}B`;
  if (n >= 1e6) return `$${(n / 1e6).toFixed(0)}M`;
  return `$${n.toLocaleString()}`;
}

function SortHeader({
  label, sortKey, current, dir, onSort, tooltip,
}: { label: string; sortKey: SortKey; current: SortKey; dir: SortDir; onSort: (k: SortKey) => void; tooltip?: string }) {
  const active = current === sortKey;
  return (
    <div className="flex items-center gap-1">
      <button
        onClick={() => onSort(sortKey)}
        className="flex items-center gap-1 text-xs uppercase tracking-wider font-semibold text-muted-foreground hover:text-foreground transition-colors"
      >
        {label}
        {active ? (dir === "asc" ? <ChevronUp size={12} /> : <ChevronDown size={12} />) : <ChevronsUpDown size={12} className="opacity-40" />}
      </button>
      {tooltip && (
        <Tooltip>
          <TooltipTrigger asChild>
            <button className="text-muted-foreground/40 hover:text-muted-foreground transition-colors" onClick={e => e.stopPropagation()}>
              <Info size={11} />
            </button>
          </TooltipTrigger>
          <TooltipContent side="bottom" className="max-w-xs text-xs leading-relaxed">
            {tooltip}
          </TooltipContent>
        </Tooltip>
      )}
    </div>
  );
}

export default function Trusts() {
  // Primary source: JSON (42 trusts)
  const { data: jsonData, isLoading: jsonLoading } = trpc.trustFigures.allTrusts.useQuery();
  // Secondary: DB trusts for extra fields (administrator, court, payment history)
  const { data: dbTrusts } = trpc.trusts.list.useQuery();

  const [sortKey, setSortKey] = useState<SortKey>("netAssets");
  const [sourceModal, setSourceModal] = useState<{ url: string; title: string; citation: string | null } | null>(null);
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [filterStatus, setFilterStatus] = useState("active");
  const [filterConf, setFilterConf] = useState("all");
  const [filterPctMin, setFilterPctMin] = useState("");
  const [filterPctMax, setFilterPctMax] = useState("");
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  // Build a lookup map from DB trusts by slug
  const dbMap = useMemo(() => {
    const map = new Map<string, (typeof dbTrusts extends (infer T)[] | undefined ? T : never)>();
    if (!dbTrusts) return map;
    for (const t of dbTrusts) {
      map.set(t.id, t);
      map.set(slugify(t.name), t);
      if (t.shortName) map.set(slugify(t.shortName), t);
    }
    return map;
  }, [dbTrusts]);

  // Merge JSON trusts with DB extras
  const merged: TrustRow[] = useMemo(() => {
    if (!jsonData?.trusts) return [];
    return jsonData.trusts.map((jt: NonNullable<typeof jsonData>["trusts"][number]) => {
      const slug = slugify(jt.name);
      const db = dbMap.get(slug) ?? dbMap.get(jt.name.toLowerCase());
      return {
        id: slug,
        name: jt.name,
        shortName: jt.shortName,
        netAssets: jt.netAssets,
        assetsAsOf: jt.assetsAsOf,
        assetsBasis: jt.assetsBasis,
        paymentPercentage: jt.paymentPercentage,
        status: jt.status,
        paymentPercentageFB: (jt as any).paymentPercentageFB ?? null,
        confidence: jt.confidence,
        note: jt.note,
        administrator: db?.administrator ?? null,
        court: db?.court ?? null,
        docket: db?.docket ?? null,
        website: db?.website ?? null,
        direction: db?.direction ?? null,
        paymentHistory: (db as any)?.paymentHistory ?? [],
        cumulativePaid: (jt as any).cumulativePaid ?? null,
        cumulativePaidAsOf: (jt as any).cumulativePaidAsOf ?? null,
        cumulativePaidSource: (jt as any).cumulativePaidSource ?? null,
        cumulativePaidSourceUrl: (jt as any).cumulativePaidSourceUrl ?? null,
        established: (jt as any).established ?? null,
      };
    });
  }, [jsonData, dbMap]);

  const isLoading = jsonLoading;

  const filtered = useMemo(() => {
    return merged.filter((t) => {
      if (filterStatus !== "all") {
        if (filterStatus === "active" && t.status !== "active" && t.status !== "active_deferral") return false;
        if (filterStatus === "closed" && t.status !== "closed") return false;
      }
      if (filterConf !== "all" && t.confidence !== filterConf) return false;
      if (filterPctMin && t.paymentPercentage !== null && t.paymentPercentage < parseFloat(filterPctMin)) return false;
      if (filterPctMax && t.paymentPercentage !== null && t.paymentPercentage > parseFloat(filterPctMax)) return false;
      return true;
    });
  }, [merged, filterStatus, filterConf, filterPctMin, filterPctMax]);

  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      let av: any, bv: any;
      if (sortKey === "name") { av = a.name; bv = b.name; }
      else if (sortKey === "paymentPercentage") { av = a.paymentPercentage ?? -1; bv = b.paymentPercentage ?? -1; }
      else if (sortKey === "netAssets") { av = a.netAssets ?? -1; bv = b.netAssets ?? -1; }
      else if (sortKey === "status") { av = a.status; bv = b.status; }
      else if (sortKey === "confidence") { av = a.confidence; bv = b.confidence; }
      else if (sortKey === "established") { av = a.established ?? 9999; bv = b.established ?? 9999; }
      if (av < bv) return sortDir === "asc" ? -1 : 1;
      if (av > bv) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
  }, [filtered, sortKey, sortDir]);

  function handleSort(key: SortKey) {
    if (key === sortKey) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortKey(key); setSortDir(key === "name" ? "asc" : "desc"); }
  }

  function toggleExpand(id: string) {
    setExpanded(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  const activeTrusts = merged.filter(t => t.status !== "closed");
  const filedCount = merged.filter(t => t.confidence === "filed").length;
  const totalAssets = merged.reduce((s, t) => s + (t.netAssets ?? 0), 0);

  return (
    <>
    <div className="container py-10">
      {/* Header */}
      <div className="mb-6 flex flex-col md:flex-row md:items-end gap-4">
        <div className="flex-1">
          <h1 className="font-display font-bold uppercase tracking-wider text-2xl mb-2">
            Asbestos Trust Fund Database
          </h1>
          <p className="text-sm text-muted-foreground max-w-2xl">
            All {merged.length} documented U.S. asbestos bankruptcy trusts. Payment percentages, net assets, and source confidence ratings.{" "}
            Source classifications: <span className="badge-source-a px-1 rounded text-xs font-mono">(a)</span> filed court document ·{" "}
            <span className="badge-source-b px-1 rounded text-xs font-mono">(b)</span> secondary citing primary ·{" "}
            <span className="badge-source-c px-1 rounded text-xs font-mono">(c)</span> estimate.
          </p>
        </div>
        <a
          href="/trusts.csv"
          download
          className="inline-flex items-center gap-2 text-xs px-3 py-2 rounded border border-border/60 bg-card/60 text-muted-foreground hover:text-foreground hover:bg-card transition-colors self-start md:self-auto"
        >
          <Download size={13} />
          Download CSV
        </a>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {[
          { label: "Active Trusts", value: activeTrusts.length.toString() },
          { label: "Filed-Source Records", value: filedCount.toString() },
          { label: "Documented Assets", value: totalAssets >= 1e9 ? `$${(totalAssets / 1e9).toFixed(2)}B` : `$${(totalAssets / 1e6).toFixed(0)}M` },
        ].map(({ label, value }) => (
          <div key={label} className="rounded border border-border/40 bg-card/40 px-4 py-3 text-center">
            <div className="text-lg font-mono font-bold text-foreground">{value}</div>
            <div className="text-xs text-muted-foreground mt-0.5">{label}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-5 p-4 rounded border border-border/50 bg-card/50">
        <div className="flex items-center gap-2">
          <label className="text-xs text-muted-foreground uppercase tracking-wider">Status</label>
          <select
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
            className="text-xs bg-secondary border border-border rounded px-2 py-1 text-foreground"
          >
            <option value="all">All</option>
            <option value="active">Active</option>
            <option value="closed">Closed</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-xs text-muted-foreground uppercase tracking-wider">Source</label>
          <select
            value={filterConf}
            onChange={e => setFilterConf(e.target.value)}
            className="text-xs bg-secondary border border-border rounded px-2 py-1 text-foreground"
          >
            <option value="all">All</option>
            <option value="filed">(a) Filed</option>
            <option value="secondary">(b) Secondary</option>
            <option value="estimate">(c) Estimate</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-xs text-muted-foreground uppercase tracking-wider">Payment % Range</label>
          <input
            type="number" placeholder="Min" value={filterPctMin}
            onChange={e => setFilterPctMin(e.target.value)}
            className="w-16 text-xs bg-secondary border border-border rounded px-2 py-1 text-foreground"
          />
          <span className="text-muted-foreground text-xs">–</span>
          <input
            type="number" placeholder="Max" value={filterPctMax}
            onChange={e => setFilterPctMax(e.target.value)}
            className="w-16 text-xs bg-secondary border border-border rounded px-2 py-1 text-foreground"
          />
        </div>
        <div className="ml-auto text-xs text-muted-foreground self-center">
          {sorted.length} of {merged.length} trusts
          {jsonData?.asOf && (
            <span className="ml-2 text-muted-foreground/50">· data as of {jsonData.asOf}</span>
          )}
        </div>
      </div>

      {/* Table */}
      {/* Formation timeline chart */}
      {!isLoading && merged.length > 0 && (() => {
        const yearCounts: Record<number, number> = {};
        merged.forEach(t => { if (t.established) yearCounts[t.established] = (yearCounts[t.established] || 0) + 1; });
        const minYear = Math.min(...Object.keys(yearCounts).map(Number));
        const maxYear = Math.max(...Object.keys(yearCounts).map(Number));
        const chartData = [];
        for (let y = minYear; y <= maxYear; y++) {
          chartData.push({ year: y, count: yearCounts[y] || 0 });
        }
        const peak = Math.max(...chartData.map(d => d.count));
        return (
          <div className="mb-5 rounded border border-border/50 bg-card/40 px-4 pt-4 pb-2">
            <div className="text-xs uppercase tracking-wider font-semibold text-muted-foreground mb-3">
              Trust Formation by Year
              <span className="ml-2 font-normal normal-case text-muted-foreground/50">
                — {merged.length} trusts, {minYear}–{maxYear}
              </span>
            </div>
            <ResponsiveContainer width="100%" height={80}>
              <BarChart data={chartData} margin={{ top: 0, right: 0, bottom: 0, left: 0 }} barCategoryGap="20%">
                <XAxis
                  dataKey="year"
                  tick={{ fontSize: 10, fill: "oklch(0.55 0 0)" }}
                  tickLine={false}
                  axisLine={false}
                  interval={3}
                />
                <YAxis hide domain={[0, peak + 1]} />
                <RechartsTooltip
                  cursor={{ fill: "oklch(0.92 0 0 / 0.3)" }}
                  content={({ active, payload }) => {
                    if (!active || !payload?.length) return null;
                    const { year, count } = payload[0].payload;
                    if (!count) return null;
                    const names = merged.filter(t => t.established === year).map(t => t.shortName).join(", ");
                    return (
                      <div className="rounded border border-border/60 bg-card px-3 py-2 text-xs shadow-md max-w-[260px]">
                        <div className="font-semibold text-foreground mb-1">{year} — {count} trust{count > 1 ? "s" : ""}</div>
                        <div className="text-muted-foreground leading-relaxed">{names}</div>
                      </div>
                    );
                  }}
                />
                <Bar dataKey="count" radius={[2, 2, 0, 0]}>
                  {chartData.map((entry) => (
                    <Cell
                      key={entry.year}
                      fill={entry.count === peak
                        ? "oklch(0.55 0.15 25)"
                        : entry.count > 0
                          ? "oklch(0.65 0.08 25)"
                          : "transparent"}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        );
      })()}
      {isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="h-12 rounded bg-card/50 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="rounded border border-border/50 overflow-hidden overflow-x-auto">
          {/* Table header */}
          <div className="grid grid-cols-[2.5fr_1fr_1.2fr_0.7fr_1fr_0.5fr] gap-4 px-4 py-3 bg-card/80 border-b border-border/50 text-xs min-w-[660px]">
            <SortHeader label="Trust Name" sortKey="name" current={sortKey} dir={sortDir} onSort={handleSort} />
            <SortHeader label="Payment %" sortKey="paymentPercentage" current={sortKey} dir={sortDir} onSort={handleSort} tooltip="The fraction of an approved claim's scheduled value that the trust actually pays. A 10% payment percentage means a claimant with a $100,000 scheduled value receives $10,000. Percentages are reduced when a trust's assets are insufficient to pay claims in full, and may be raised or lowered over time." />
            <SortHeader label="Net Assets" sortKey="netAssets" current={sortKey} dir={sortDir} onSort={handleSort} tooltip="The trust's total assets minus its liabilities, as reported in the most recent available annual report or quarterly filing. This is the remaining pool of money available to pay future claims. As-of dates vary — see the date shown under each figure." />
            <SortHeader label="Est." sortKey="established" current={sortKey} dir={sortDir} onSort={handleSort} tooltip="Year the trust was established (i.e., when the bankruptcy plan of reorganization was confirmed and the trust became operational)." />
            <SortHeader label="Status" sortKey="status" current={sortKey} dir={sortDir} onSort={handleSort} tooltip="Active: the trust is accepting and paying claims. Deferral: payments are temporarily suspended (e.g. Celotex, pending litigation). Closed: the trust has been depleted and is no longer paying claims (e.g. Rapid-American)." />
            <SortHeader label="Source" sortKey="confidence" current={sortKey} dir={sortDir} onSort={handleSort} tooltip="Source confidence classification. (a) Filed court document — drawn directly from a U.S. bankruptcy court filing. (b) Secondary source citing primary — a trust website or report that cites a filed document. (c) Estimate or inference — derived from available data. See the Methodology page for full details." />
          </div>

          {/* Rows */}
          {sorted.map((trust) => {
            const isOpen = expanded.has(trust.id);
            const ph = trust.paymentHistory ?? [];
            return (
              <div key={trust.id} className="border-b border-border/30 last:border-0">
                {/* Main row */}
                <div
                  className="grid grid-cols-[2.5fr_1fr_1.2fr_0.7fr_1fr_0.5fr] gap-4 px-4 py-3 hover:bg-card/60 transition-colors cursor-pointer items-center min-w-[660px]"
                  onClick={() => toggleExpand(trust.id)}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <ChevronRight
                      size={14}
                      className={`shrink-0 text-muted-foreground/50 transition-transform duration-150 ${isOpen ? "rotate-90" : ""}`}
                    />
                    <div className="min-w-0">
                      <div className="text-sm font-medium text-foreground truncate flex items-center gap-1">
                        <Link
                          href={`/trusts/${trust.id}`}
                          onClick={(e) => e.stopPropagation()}
                          className="hover:text-primary hover:underline transition-colors truncate"
                        >
                          {trust.shortName}
                        </Link>
                        <Link
                          href={`/trusts/${trust.id}`}
                          onClick={(e) => e.stopPropagation()}
                          className="text-muted-foreground/30 hover:text-primary transition-colors shrink-0"
                          title="View trust details"
                        >
                          <ArrowUpRight size={11} />
                        </Link>
                      </div>
                      <div className="text-xs text-muted-foreground/50 truncate">{trust.name !== trust.shortName ? trust.name : ""}</div>
                    </div>
                  </div>
                  <div className="text-sm font-mono">
                    {trust.paymentPercentage !== null ? (
                      trust.paymentPercentageFB != null ? (
                        <span className="text-foreground">
                          {trust.paymentPercentage}%
                          <span className="text-muted-foreground/60 text-xs"> / {trust.paymentPercentageFB}%</span>
                        </span>
                      ) : (
                        <span className="text-foreground">{trust.paymentPercentage}%</span>
                      )
                    ) : (
                      <span className="text-muted-foreground/40 text-xs">MSV/N/A</span>
                    )}
                  </div>
                  <div className="text-sm font-mono">
                    <span className={trust.netAssets ? "text-foreground" : "text-muted-foreground/40"}>
                      {formatAssets(trust.netAssets)}
                    </span>
                    {trust.assetsAsOf && (
                      <div className="text-xs text-muted-foreground/40">{trust.assetsAsOf}</div>
                    )}
                  </div>
                  <div className="text-sm font-mono text-foreground">
                    {(trust as any).established ?? <span className="text-muted-foreground/40 text-xs">—</span>}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <StatusBadge status={trust.status} />
                    {trust.status === "active" && <DirectionIcon direction={trust.direction} />}
                  </div>
                  <div>
                    <ConfidenceBadge confidence={trust.confidence} />
                  </div>
                </div>

                {/* Expanded panel */}
                {isOpen && (
                  <div className="px-10 py-4 bg-card/30 border-t border-border/20 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Details */}
                      <div className="space-y-2 text-xs">
                        <div className="font-semibold text-foreground/70 uppercase tracking-wider mb-2">Trust Details</div>
                        {trust.assetsBasis && <div><span className="text-muted-foreground">Assets basis: </span><span className="italic">{trust.assetsBasis}</span></div>}
                        {trust.court && <div><span className="text-muted-foreground">Court: </span><span className="font-mono">{trust.court} {trust.docket}</span></div>}
                        {trust.administrator && <div><span className="text-muted-foreground">Administrator: </span>{trust.administrator}</div>}
                        {trust.website && (
                          <div>
                            <span className="text-muted-foreground">Website: </span>
                            <a href={trust.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline inline-flex items-center gap-1">
                              {trust.website.replace("https://", "")} <ExternalLink size={10} />
                            </a>
                          </div>
                        )}
                        {trust.note && <div className="mt-2 text-muted-foreground/70 leading-relaxed">{trust.note}</div>}
                        {trust.paymentPercentageFB != null && (
                          <div className="mt-2 p-2 rounded bg-amber-50/50 border border-amber-200/40 text-xs space-y-1">
                            <div className="font-semibold text-amber-800/80 uppercase tracking-wider text-[10px]">Dual Sub-Account Payment Percentages</div>
                            <div className="flex gap-4">
                              <div><span className="text-muted-foreground">OC Sub-Account: </span><span className="font-mono font-bold">{trust.paymentPercentage}%</span></div>
                              <div><span className="text-muted-foreground">FB Sub-Account: </span><span className="font-mono font-bold">{trust.paymentPercentageFB}%</span></div>
                            </div>
                            <div className="text-muted-foreground/60 italic">Owens Corning and Fibreboard claimants are paid from separate sub-accounts at different rates. Both effective 2026-06-30.</div>
                          </div>
                        )}
                      </div>

                      {/* Cumulative paid source citation */}
                      {trust.cumulativePaid != null && (
                        <div className="md:col-span-2 pt-2 border-t border-border/20">
                          <div className="font-semibold text-foreground/70 uppercase tracking-wider text-xs mb-2 flex items-center gap-1.5">
                            <FileText size={11} />
                            Cumulative Payouts — Source Document
                          </div>
                          <div className="text-xs space-y-1.5">
                            <div className="flex items-baseline gap-2 flex-wrap">
                              <span className="font-mono font-bold text-foreground">
                                ${trust.cumulativePaid.toLocaleString()}
                              </span>
                              <span className="text-muted-foreground/60">
                                paid since inception (as of {trust.cumulativePaidAsOf})
                              </span>
                            </div>
                            {trust.cumulativePaidSource && (
                              <div className="text-muted-foreground/60 leading-relaxed">
                                <span className="italic">{trust.cumulativePaidSource.split(" - ")[0]}</span>
                                {trust.cumulativePaidSourceUrl && (
                                  <button
                                    onClick={(e) => { e.stopPropagation(); setSourceModal({ url: trust.cumulativePaidSourceUrl!, title: trust.shortName + " — Source Document", citation: trust.cumulativePaidSource ?? null }); }}
                                    className="ml-2 inline-flex items-center gap-1 text-primary hover:underline font-medium not-italic cursor-pointer"
                                  >
                                    View source <ExternalLink size={10} />
                                  </button>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Payment history */}
                      <div>
                        <div className="font-semibold text-foreground/70 uppercase tracking-wider text-xs mb-2">Payment % History</div>
                        {ph.length > 0 ? (
                          <div className="space-y-1">
                            {ph.map((h: any, i: number) => (
                              <div key={i} className="flex items-center gap-3 text-xs">
                                <span className="font-mono text-muted-foreground/60 w-24 shrink-0">{h.effective}</span>
                                <span className="font-mono font-bold text-foreground">{h.pct}%</span>
                                {h.notes && <span className="text-muted-foreground/50">{h.notes}</span>}
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-xs text-muted-foreground/40">No history on record.</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {sorted.length === 0 && !isLoading && (
            <div className="py-12 text-center text-sm text-muted-foreground/50">
              No trusts match the current filters.
            </div>
          )}
        </div>
      )}

      {/* Footer */}
      <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-muted-foreground/60">
        <span>
          Source classifications explained on the{" "}
          <Link href="/methodology" className="text-primary hover:underline no-underline">methodology page</Link>.
          Data updated weekly from trust websites and court filings.
        </span>
      {jsonData?.asOf && (
        <span className="shrink-0">Data as of {jsonData.asOf}</span>
      )}
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

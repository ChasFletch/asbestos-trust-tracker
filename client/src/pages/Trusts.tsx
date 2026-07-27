import { trpc } from "@/lib/trpc";
import { useState, useMemo } from "react";
import { ChevronDown, ChevronUp, ChevronsUpDown, TrendingDown, TrendingUp, Minus, ExternalLink, ChevronRight } from "lucide-react";
import { Link } from "wouter";

type SortKey = "name" | "paymentPct" | "netAssets" | "direction" | "administrator";
type SortDir = "asc" | "desc";

function SourceBadge({ source }: { source: string | null }) {
  if (!source) return null;
  return (
    <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-xs font-mono badge-source-${source}`}>
      ({source})
    </span>
  );
}

function DirectionIcon({ direction }: { direction: string | null }) {
  if (direction === "up") return <TrendingUp size={14} className="text-[oklch(0.72_0.18_150)]" />;
  if (direction === "down") return <TrendingDown size={14} className="text-destructive" />;
  return <Minus size={14} className="text-muted-foreground/50" />;
}

function formatAssets(n: number | null): string {
  if (n === null) return "—";
  if (n >= 1e9) return `$${(n / 1e9).toFixed(2)}B`;
  if (n >= 1e6) return `$${(n / 1e6).toFixed(0)}M`;
  return `$${n.toLocaleString()}`;
}

function SortHeader({
  label, sortKey, current, dir, onSort,
}: { label: string; sortKey: SortKey; current: SortKey; dir: SortDir; onSort: (k: SortKey) => void }) {
  const active = current === sortKey;
  return (
    <button
      onClick={() => onSort(sortKey)}
      className="flex items-center gap-1 text-xs uppercase tracking-wider font-semibold text-muted-foreground hover:text-foreground transition-colors"
    >
      {label}
      {active ? (dir === "asc" ? <ChevronUp size={12} /> : <ChevronDown size={12} />) : <ChevronsUpDown size={12} className="opacity-40" />}
    </button>
  );
}

export default function Trusts() {
  const { data: trusts, isLoading } = trpc.trusts.list.useQuery();
  const [sortKey, setSortKey] = useState<SortKey>("name");
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [filterAdmin, setFilterAdmin] = useState("all");
  const [filterDir, setFilterDir] = useState("all");
  const [filterPctMin, setFilterPctMin] = useState("");
  const [filterPctMax, setFilterPctMax] = useState("");
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  const administrators = useMemo(() => {
    if (!trusts) return [];
    return Array.from(new Set(trusts.map((t) => t.administrator).filter(Boolean))).sort();
  }, [trusts]);

  const filtered = useMemo(() => {
    if (!trusts) return [];
    return trusts.filter((t) => {
      if (filterAdmin !== "all" && t.administrator !== filterAdmin) return false;
      if (filterDir !== "all" && t.direction !== filterDir) return false;
      if (filterPctMin && t.paymentPct !== null && t.paymentPct < parseFloat(filterPctMin)) return false;
      if (filterPctMax && t.paymentPct !== null && t.paymentPct > parseFloat(filterPctMax)) return false;
      return true;
    });
  }, [trusts, filterAdmin, filterDir, filterPctMin, filterPctMax]);

  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      let av: any, bv: any;
      if (sortKey === "name") { av = a.name; bv = b.name; }
      else if (sortKey === "paymentPct") { av = a.paymentPct ?? -1; bv = b.paymentPct ?? -1; }
      else if (sortKey === "netAssets") { av = a.netAssets ?? -1; bv = b.netAssets ?? -1; }
      else if (sortKey === "direction") { av = a.direction ?? ""; bv = b.direction ?? ""; }
      else if (sortKey === "administrator") { av = a.administrator ?? ""; bv = b.administrator ?? ""; }
      if (av < bv) return sortDir === "asc" ? -1 : 1;
      if (av > bv) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
  }, [filtered, sortKey, sortDir]);

  function handleSort(key: SortKey) {
    if (key === sortKey) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortKey(key); setSortDir("asc"); }
  }

  function toggleExpand(id: string) {
    setExpanded(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  return (
    <div className="container py-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-display font-bold uppercase tracking-wider text-2xl mb-2">
          Asbestos Trust Fund Database
        </h1>
        <p className="text-sm text-muted-foreground max-w-2xl">
          All active U.S. asbestos bankruptcy trusts. Payment percentages, net assets, source confidence ratings, and full payment history. Source classifications: <span className="badge-source-a px-1 rounded text-xs font-mono">(a)</span> filed court document · <span className="badge-source-b px-1 rounded text-xs font-mono">(b)</span> secondary citing primary · <span className="badge-source-c px-1 rounded text-xs font-mono">(c)</span> estimate.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6 p-4 rounded border border-border/50 bg-card/50">
        <div className="flex items-center gap-2">
          <label className="text-xs text-muted-foreground uppercase tracking-wider">Administrator</label>
          <select
            value={filterAdmin}
            onChange={e => setFilterAdmin(e.target.value)}
            className="text-xs bg-secondary border border-border rounded px-2 py-1 text-foreground"
          >
            <option value="all">All</option>
            {administrators.map(a => <option key={a} value={a!}>{a}</option>)}
          </select>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-xs text-muted-foreground uppercase tracking-wider">Direction</label>
          <select
            value={filterDir}
            onChange={e => setFilterDir(e.target.value)}
            className="text-xs bg-secondary border border-border rounded px-2 py-1 text-foreground"
          >
            <option value="all">All</option>
            <option value="up">↑ Increasing</option>
            <option value="down">↓ Decreasing</option>
            <option value="stable">— Stable</option>
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
          {sorted.length} of {trusts?.length ?? 0} trusts
        </div>
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-12 rounded bg-card/50 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="rounded border border-border/50 overflow-hidden overflow-x-auto">
          {/* Table header */}
          <div className="grid grid-cols-[2fr_1fr_1fr_1fr_1.5fr_0.5fr] gap-4 px-4 py-3 bg-card/80 border-b border-border/50 text-xs min-w-[640px]">
            <SortHeader label="Trust Name" sortKey="name" current={sortKey} dir={sortDir} onSort={handleSort} />
            <SortHeader label="Payment %" sortKey="paymentPct" current={sortKey} dir={sortDir} onSort={handleSort} />
            <SortHeader label="Net Assets" sortKey="netAssets" current={sortKey} dir={sortDir} onSort={handleSort} />
            <SortHeader label="Direction" sortKey="direction" current={sortKey} dir={sortDir} onSort={handleSort} />
            <SortHeader label="Administrator" sortKey="administrator" current={sortKey} dir={sortDir} onSort={handleSort} />
            <span className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">Source</span>
          </div>

          {/* Rows */}
          {sorted.map((trust) => {
            const isOpen = expanded.has(trust.id);
            const ph = (trust as any).paymentHistory ?? [];
            return (
              <div key={trust.id} className="border-b border-border/30 last:border-0">
                {/* Main row */}
                <div
                  className="grid grid-cols-[2fr_1fr_1fr_1fr_1.5fr_0.5fr] gap-4 px-4 py-3 hover:bg-card/60 transition-colors cursor-pointer items-center min-w-[640px]"
                  onClick={() => toggleExpand(trust.id)}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <ChevronRight
                      size={14}
                      className={`shrink-0 text-muted-foreground/50 transition-transform ${isOpen ? "rotate-90" : ""}`}
                    />
                    <div className="min-w-0">
                      <div className="text-sm font-medium text-foreground truncate">{trust.shortName ?? trust.name}</div>
                      <div className="text-xs text-muted-foreground/60 truncate">{trust.company}</div>
                    </div>
                    {trust.isStale && (
                      <span className="shrink-0 text-xs px-1.5 py-0.5 rounded bg-amber-100 text-amber-700 border border-amber-300">stale</span>
                    )}
                  </div>
                  <div className="text-sm font-mono">
                    {trust.paymentPct !== null ? (
                      <span className="text-foreground">{trust.paymentPct}%</span>
                    ) : (
                      <span className="text-muted-foreground/40">—</span>
                    )}
                  </div>
                  <div className="text-sm font-mono">
                    <span className={trust.netAssets ? "text-foreground" : "text-muted-foreground/40"}>
                      {formatAssets(trust.netAssets)}
                    </span>
                    {trust.netAssetsAsOf && (
                      <div className="text-xs text-muted-foreground/40">{trust.netAssetsAsOf}</div>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <DirectionIcon direction={trust.direction} />
                    <span className="text-xs text-muted-foreground capitalize">{trust.direction}</span>
                  </div>
                  <div className="text-xs text-muted-foreground truncate">{trust.administrator}</div>
                  <div>
                    <SourceBadge source={trust.netAssetsSource} />
                  </div>
                </div>

                {/* Expanded panel */}
                {isOpen && (
                  <div className="px-10 py-4 bg-card/30 border-t border-border/20 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Details */}
                      <div className="space-y-2 text-xs">
                        <div className="font-semibold text-foreground/70 uppercase tracking-wider mb-2">Trust Details</div>
                        {trust.court && <div><span className="text-muted-foreground">Court: </span><span className="font-mono">{trust.court} {trust.docket}</span></div>}
                        {trust.website && (
                          <div>
                            <span className="text-muted-foreground">Website: </span>
                            <a href={trust.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline inline-flex items-center gap-1">
                              {trust.website.replace("https://", "")} <ExternalLink size={10} />
                            </a>
                          </div>
                        )}
                        {trust.reportingFrequency && <div><span className="text-muted-foreground">Reporting: </span>{trust.reportingFrequency}</div>}
                        {trust.netAssetsCitation && (
                          <div><span className="text-muted-foreground">Source: </span><span className="italic">{trust.netAssetsCitation}</span></div>
                        )}
                        {trust.notes && <div className="mt-2 text-muted-foreground/70 leading-relaxed">{trust.notes}</div>}
                      </div>

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
        </div>
      )}

      {/* Methodology link */}
      <div className="mt-6 text-xs text-muted-foreground/60 text-center">
        Source classifications explained on the{" "}
        <Link href="/methodology" className="text-primary hover:underline no-underline">methodology page</Link>.
        Data updated weekly from trust websites and court filings.
      </div>
    </div>
  );
}

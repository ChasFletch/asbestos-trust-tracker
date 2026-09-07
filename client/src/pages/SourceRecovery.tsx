import { useMemo, useState } from "react";
import { Link } from "wouter";
import { ArrowRight, BadgeAlert, BookOpenCheck, CheckCircle2, Clock3, ExternalLink, FileSearch, Landmark, ShieldCheck } from "lucide-react";
import { trpc } from "@/lib/trpc";

type RecoveryFilter = "all" | "monitored" | "access_attention" | "registered";
type RecoveryStatus = Exclude<RecoveryFilter, "all">;

const filterOptions: Array<{ value: RecoveryFilter; label: string }> = [
  { value: "all", label: "All priorities" },
  { value: "monitored", label: "Source reachable" },
  { value: "access_attention", label: "Access attention" },
  { value: "registered", label: "Registered / awaiting check" },
];

const statusMeta = {
  monitored: {
    label: "Source reachable",
    description: "A registered public source has completed a successful reachability check. This does not mean the underlying document has been recovered or that a trust figure changed.",
    className: "border-emerald-500/30 bg-emerald-500/10 text-emerald-800",
    icon: CheckCircle2,
  },
  access_attention: {
    label: "Access attention",
    description: "The registered public source needs a documented retry or lawful fallback. An access result is not evidence that the trust has not changed.",
    className: "border-amber-500/35 bg-amber-500/10 text-amber-900",
    icon: BadgeAlert,
  },
  registered: {
    label: "Registered / awaiting check",
    description: "A reviewed public source is registered but has not yet completed a post-registration reachability check.",
    className: "border-sky-500/30 bg-sky-500/10 text-sky-800",
    icon: Clock3,
  },
} as const;

function formatDate(value: Date | string | null) {
  if (!value) return "Not yet checked after registration";
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" }).format(new Date(value));
}

export default function SourceRecovery() {
  const [filter, setFilter] = useState<RecoveryFilter>("all");
  const { data, isLoading } = trpc.operations.recoveryDashboard.useQuery();
  const items = useMemo(
    () => (data?.items ?? []).filter((item) => filter === "all" || item.status === filter),
    [data?.items, filter]
  );

  if (isLoading || !data) {
    return <div className="container max-w-6xl py-12 text-sm text-muted-foreground">Loading the public historical-source recovery record…</div>;
  }

  return (
    <div className="container max-w-6xl py-10 md:py-14">
      <header className="mb-9 border-b border-border/60 pb-8">
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-[0.18em] text-primary/80 mb-3">
          <FileSearch size={14} aria-hidden="true" />
          Public research progress
        </div>
        <div className="grid gap-6 lg:grid-cols-[1fr_17rem] lg:items-end">
          <div>
            <h1 className="font-display text-3xl md:text-4xl font-bold uppercase tracking-wide text-foreground">Historical Source Recovery</h1>
            <p className="mt-4 max-w-3xl text-sm md:text-base leading-relaxed text-muted-foreground">
              This public worklist tracks the recovery of historical asbestos trust documents that could confirm, update, or qualify existing historical figures. It shows research progress—not new trust facts. Figures remain unchanged until a controlling source and the documented editorial and technical checks are complete.
            </p>
          </div>
          <div className="rounded border border-primary/25 bg-primary/5 p-4 text-sm text-muted-foreground">
            <div className="font-mono text-[0.68rem] uppercase tracking-widest text-primary/80">Current pilot</div>
            <p className="mt-1 font-semibold text-foreground">Ends {formatDate(data.pilotEndsOn)}</p>
            <p className="mt-1 text-xs leading-relaxed">Five ranked historical items are prepared for the monthly no-charge research cycle, capped at {data.monthlyResearchCapMinutes} minutes.</p>
          </div>
        </div>
      </header>

      <section aria-label="Recovery dashboard principles" className="mb-10 grid gap-3 md:grid-cols-3">
        <div className="rounded border border-border/50 bg-card/30 p-4">
          <ShieldCheck size={17} className="mb-3 text-primary" aria-hidden="true" />
          <h2 className="text-sm font-semibold text-foreground">Evidence stays bounded</h2>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">A research target never converts an historical floor, a qualified secondary component, or an access constraint into a current figure.</p>
        </div>
        <div className="rounded border border-border/50 bg-card/30 p-4">
          <Landmark size={17} className="mb-3 text-primary" aria-hidden="true" />
          <h2 className="text-sm font-semibold text-foreground">Public, no-charge routes first</h2>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">Official trust, administrator, case-agent, court, government, archive, and public docket routes are prioritized. This worklist does not authorize paid-record purchases.</p>
        </div>
        <div className="rounded border border-border/50 bg-card/30 p-4">
          <BookOpenCheck size={17} className="mb-3 text-primary" aria-hidden="true" />
          <h2 className="text-sm font-semibold text-foreground">Access is not substance</h2>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">A reachable page is not a recovered report, and an unavailable page is not proof of no change. Both states remain visible in the research record.</p>
        </div>
      </section>

      <section aria-labelledby="recovery-summary" className="mb-8 rounded-lg border border-border/60 bg-card/40 p-5 md:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 id="recovery-summary" className="font-display text-xl font-bold uppercase tracking-wide text-foreground">Recovery status</h2>
            <p className="mt-1 text-sm text-muted-foreground">{data.summary.total} ranked historical source targets. The dashboard updates from the reviewed public registry; it does not publish unreviewed findings.</p>
          </div>
          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <div className="rounded border border-emerald-500/25 bg-emerald-500/5 px-3 py-2"><strong className="block text-base text-emerald-800">{data.summary.monitored}</strong><span className="text-muted-foreground">reachable</span></div>
            <div className="rounded border border-amber-500/25 bg-amber-500/5 px-3 py-2"><strong className="block text-base text-amber-900">{data.summary.accessAttention}</strong><span className="text-muted-foreground">attention</span></div>
            <div className="rounded border border-sky-500/25 bg-sky-500/5 px-3 py-2"><strong className="block text-base text-sky-800">{data.summary.registered}</strong><span className="text-muted-foreground">awaiting</span></div>
          </div>
        </div>
      </section>

      <section aria-labelledby="priority-worklist-heading">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 id="priority-worklist-heading" className="font-display text-xl font-bold uppercase tracking-wide text-foreground">Per-item recovery worklist</h2>
            <p className="mt-1 text-sm text-muted-foreground">Showing {items.length} of {data.summary.total} ranked targets.</p>
          </div>
          <div className="flex flex-wrap gap-2" role="group" aria-label="Filter source recovery items">
            {filterOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setFilter(option.value)}
                aria-pressed={filter === option.value}
                className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${filter === option.value ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground"}`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <ol className="space-y-5">
          {items.map((item) => {
            const meta = statusMeta[(item.status as RecoveryStatus) in statusMeta ? item.status as RecoveryStatus : "registered"];
            const StatusIcon = meta.icon;
            return (
              <li key={item.trustSlug}>
                <article className="overflow-hidden rounded-lg border border-border/60 bg-card/40 shadow-sm">
                  <div className="border-b border-border/45 bg-background/45 px-5 py-4 md:px-6">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div className="min-w-0">
                        <div className="font-mono text-[0.68rem] uppercase tracking-widest text-primary/80">Priority {item.rank} · {item.expectedMinutes}-minute research cap</div>
                        <h3 className="mt-1 text-lg font-semibold leading-snug text-foreground">{item.trustName}</h3>
                      </div>
                      <span className={`inline-flex w-fit shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${meta.className}`}><StatusIcon size={13} aria-hidden="true" />{meta.label}</span>
                    </div>
                  </div>

                  <div className="grid gap-5 p-5 md:grid-cols-[minmax(0,1.25fr)_minmax(15rem,0.75fr)] md:p-6">
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-[0.68rem] font-mono uppercase tracking-widest text-muted-foreground">Recovery objective</h4>
                        <p className="mt-1.5 text-sm leading-relaxed text-foreground">{item.focus}</p>
                      </div>
                      <div className="grid gap-3 sm:grid-cols-2">
                        <div className="rounded border border-border/45 bg-background/40 p-3">
                          <h4 className="text-[0.68rem] font-mono uppercase tracking-widest text-muted-foreground">Evidence boundary</h4>
                          <p className="mt-1.5 text-xs leading-relaxed text-foreground">{item.historicalCutoff}</p>
                        </div>
                        <div className="rounded border border-border/45 bg-background/40 p-3">
                          <h4 className="text-[0.68rem] font-mono uppercase tracking-widest text-muted-foreground">Why it matters</h4>
                          <p className="mt-1.5 text-xs leading-relaxed text-foreground">{item.publicValue}</p>
                        </div>
                      </div>
                      <div>
                        <h4 className="text-[0.68rem] font-mono uppercase tracking-widest text-muted-foreground">Approved no-charge path</h4>
                        <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">{item.noChargeResearchPath}</p>
                      </div>
                    </div>

                    <aside className="rounded border border-border/50 bg-background/40 p-4" aria-label={`Monitoring details for ${item.trustName}`}>
                      <h4 className="text-sm font-semibold text-foreground">Monitored source</h4>
                      <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{meta.description}</p>
                      <dl className="mt-4 space-y-3 text-xs">
                        <div><dt className="font-mono uppercase tracking-wider text-[0.62rem] text-muted-foreground">Cadence</dt><dd className="mt-0.5 capitalize text-foreground">{item.checkCadence ?? "Pending registry check"}</dd></div>
                        <div><dt className="font-mono uppercase tracking-wider text-[0.62rem] text-muted-foreground">Last check</dt><dd className="mt-0.5 text-foreground">{formatDate(item.lastCheckedAt)}</dd></div>
                        <div><dt className="font-mono uppercase tracking-wider text-[0.62rem] text-muted-foreground">Last successful access</dt><dd className="mt-0.5 text-foreground">{formatDate(item.lastSuccessfulCheckAt)}</dd></div>
                        {item.lastStatusCode !== null && <div><dt className="font-mono uppercase tracking-wider text-[0.62rem] text-muted-foreground">Latest response</dt><dd className="mt-0.5 text-foreground">HTTP {item.lastStatusCode}</dd></div>}
                      </dl>
                      {item.monitoredSourceUrl && (
                        <a href={item.monitoredSourceUrl} target="_blank" rel="noopener noreferrer" className="mt-5 inline-flex items-center gap-1.5 text-xs font-medium text-primary underline underline-offset-2 hover:no-underline">
                          Open monitored public source <ExternalLink size={13} aria-hidden="true" />
                        </a>
                      )}
                      <Link href={`/trusts/${item.trustSlug}`} className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-primary no-underline hover:underline">Open trust record <ArrowRight size={13} aria-hidden="true" /></Link>
                    </aside>
                  </div>
                </article>
              </li>
            );
          })}
        </ol>
      </section>

      <section className="mt-10 rounded border border-primary/25 bg-primary/5 p-5 md:p-6" aria-labelledby="recovery-disclosure-heading">
        <h2 id="recovery-disclosure-heading" className="font-display text-lg font-bold uppercase tracking-wide text-foreground">How to read this page</h2>
        <p className="mt-2 max-w-4xl text-sm leading-relaxed text-muted-foreground">The recovery list makes unresolved historical evidence visible. It does not imply that a document exists, that a payment amount is current, or that an unavailable source establishes no change. When a controlling report is recovered, it is reviewed against the public methodology, historical-floor labels, and source hierarchy before a tracker or article update is considered.</p>
        <div className="mt-4 flex flex-wrap gap-3 text-sm">
          <Link href="/methodology" className="inline-flex items-center gap-1.5 font-medium text-primary no-underline hover:underline">Read the methodology <ArrowRight size={15} aria-hidden="true" /></Link>
          <Link href="/provenance" className="inline-flex items-center gap-1.5 font-medium text-primary no-underline hover:underline">Open figure history <ArrowRight size={15} aria-hidden="true" /></Link>
          <Link href="/corrections" className="inline-flex items-center gap-1.5 font-medium text-primary no-underline hover:underline">Report a correction <ArrowRight size={15} aria-hidden="true" /></Link>
        </div>
      </section>
    </div>
  );
}

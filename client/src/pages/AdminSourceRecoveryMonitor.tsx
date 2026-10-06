import { useAuth } from "@/_core/hooks/useAuth";
import { startLogin } from "@/const";
import { trpc } from "@/lib/trpc";
import { Link } from "wouter";
import { AlertTriangle, CheckCircle2, Clock3, Database, ExternalLink, FileSearch, LockKeyhole, ShieldCheck } from "lucide-react";

function formatDate(value: Date | string | null | undefined) {
  if (!value) return "Not recorded";
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(value));
}

export default function AdminSourceRecoveryMonitor() {
  const { user, loading } = useAuth();
  const isAdmin = user?.role === "admin";
  const monitor = trpc.admin.sourceRecoveryMonitor.useQuery(undefined, {
    enabled: isAdmin,
    retry: false,
  });

  if (loading) {
    return <div className="container max-w-6xl py-12 text-sm text-muted-foreground">Checking access…</div>;
  }

  if (!user) {
    return (
      <div className="container max-w-xl py-16">
        <section className="rounded-lg border border-border bg-card p-7 text-center shadow-sm">
          <LockKeyhole className="mx-auto text-primary" size={28} aria-hidden="true" />
          <h1 className="mt-4 font-display text-2xl font-bold text-foreground">Research desk monitor</h1>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            This operational view is available only to authorized AsbestosTrusts.org research-desk users.
          </p>
          <button type="button" onClick={startLogin} className="mt-6 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-transform active:scale-[0.97]">
            Sign in
          </button>
        </section>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="container max-w-xl py-16">
        <section className="rounded-lg border border-amber-300 bg-amber-50 p-7 text-center">
          <LockKeyhole className="mx-auto text-amber-700" size={28} aria-hidden="true" />
          <h1 className="mt-4 font-display text-2xl font-bold text-amber-950">Admin access required</h1>
          <p className="mt-3 text-sm leading-relaxed text-amber-900/80">Your account is signed in but does not have permission to view operational source records.</p>
        </section>
      </div>
    );
  }

  if (monitor.isLoading || !monitor.data) {
    return <div className="container max-w-6xl py-12 text-sm text-muted-foreground">Loading source recovery monitor…</div>;
  }

  const { data } = monitor;
  const pilotCompleted = data.pilot?.status === "completed";

  return (
    <div className="container max-w-6xl py-10 md:py-14">
      <header className="mb-8 border-b border-border/60 pb-7">
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-[0.18em] text-primary/80">
          <ShieldCheck size={14} aria-hidden="true" />
          Internal operations
        </div>
        <div className="mt-3 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="font-display text-3xl font-bold uppercase tracking-wide text-foreground">Source recovery monitor</h1>
            <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted-foreground">
              Access health and document-recovery status for the completed living-tracker pilot. This dashboard is operational evidence only; it neither establishes a public trust fact nor authorizes a new monitoring cycle, research run, or release.
            </p>
          </div>
          <div className={`rounded border px-4 py-3 text-sm ${pilotCompleted ? "border-slate-300 bg-slate-50 text-slate-800" : "border-emerald-300 bg-emerald-50 text-emerald-900"}`}>
            <div className="font-mono text-[0.65rem] uppercase tracking-widest">Pilot state</div>
            <p className="mt-1 font-semibold">{pilotCompleted ? "Completed — monitoring paused" : data.pilot?.status ?? "Not recorded"}</p>
            {data.pilot && <p className="mt-1 text-xs opacity-80">{data.pilot.startDate} to {data.pilot.endDate} · {data.pilot.timezone}</p>}
          </div>
        </div>
      </header>

      <section aria-label="Source registry summary" className="mb-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border border-border/60 bg-card p-4">
          <Database size={16} className="text-primary" aria-hidden="true" />
          <div className="mt-3 text-2xl font-mono font-bold text-foreground">{data.registry.totalActive}</div>
          <div className="text-xs text-muted-foreground">active registered sources</div>
        </div>
        <div className="rounded-lg border border-emerald-300/60 bg-emerald-50/50 p-4">
          <CheckCircle2 size={16} className="text-emerald-700" aria-hidden="true" />
          <div className="mt-3 text-2xl font-mono font-bold text-emerald-900">{data.registry.reachableActive}</div>
          <div className="text-xs text-emerald-900/70">last active sources reachable</div>
        </div>
        <div className="rounded-lg border border-amber-300/60 bg-amber-50/50 p-4">
          <AlertTriangle size={16} className="text-amber-700" aria-hidden="true" />
          <div className="mt-3 text-2xl font-mono font-bold text-amber-900">{data.registry.accessNeedsAction}</div>
          <div className="text-xs text-amber-900/70">active sources needing recovery</div>
        </div>
        <div className="rounded-lg border border-slate-300 bg-slate-50 p-4">
          <Clock3 size={16} className="text-slate-700" aria-hidden="true" />
          <div className="mt-3 text-2xl font-mono font-bold text-slate-900">{data.registry.retiredFailures}</div>
          <div className="text-xs text-slate-700/70">retired source failures retained for audit</div>
        </div>
      </section>

      <section className="mb-8 rounded-lg border border-border/60 bg-card/40 p-5 md:p-6" aria-labelledby="recovery-backlog-heading">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 id="recovery-backlog-heading" className="font-display text-xl font-bold uppercase tracking-wide text-foreground">Historical document recovery</h2>
            <p className="mt-1 text-sm text-muted-foreground">Every target below remains an evidence-recovery task. “Reachable” refers to the monitored source path, not the unavailable historical report.</p>
          </div>
          <Link href="/source-recovery" className="text-sm font-medium text-primary hover:underline">Open public recovery record →</Link>
        </div>

        <div className="mt-5 overflow-x-auto rounded-md border border-border/50">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="bg-muted/45 text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-medium">Priority</th>
                <th className="px-4 py-3 font-medium">Trust / recovery boundary</th>
                <th className="px-4 py-3 font-medium">Source access</th>
                <th className="px-4 py-3 font-medium">Document status</th>
                <th className="px-4 py-3 font-medium">Last successful check</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/45">
              {data.recoveryBacklog.map((item) => (
                <tr key={item.trustSlug} className="align-top">
                  <td className="px-4 py-4 font-mono text-xs text-primary">{item.rank}</td>
                  <td className="px-4 py-4">
                    <div className="font-medium text-foreground">{item.trustName}</div>
                    <p className="mt-1 max-w-md text-xs leading-relaxed text-muted-foreground">{item.historicalCutoff}</p>
                    <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground/75">{item.focus}</p>
                    {item.monitoredSourceUrl && <a href={item.monitoredSourceUrl} target="_blank" rel="noopener noreferrer" className="mt-2 inline-flex items-center gap-1 text-xs text-primary hover:underline">Controlling source <ExternalLink size={11} aria-hidden="true" /></a>}
                  </td>
                  <td className="px-4 py-4">
                    <span className={`inline-flex rounded-full border px-2 py-0.5 text-xs font-semibold ${item.sourceReachable ? "border-emerald-300 bg-emerald-50 text-emerald-800" : "border-amber-300 bg-amber-50 text-amber-900"}`}>
                      {item.sourceReachable ? "reachable" : "recovery needed"}
                    </span>
                    <p className="mt-2 text-xs text-muted-foreground">{item.checkCadence ?? "no active cadence"}</p>
                  </td>
                  <td className="px-4 py-4">
                    <span className="inline-flex rounded-full border border-slate-300 bg-slate-50 px-2 py-0.5 text-xs font-semibold text-slate-800">{item.documentRecoveryStatus}</span>
                    <p className="mt-2 max-w-xs text-xs leading-relaxed text-muted-foreground">No tracker value changes until a controlling document is recovered and cleared through the documented release checks.</p>
                  </td>
                  <td className="px-4 py-4 text-xs text-muted-foreground">
                    {formatDate(item.lastSuccessfulCheckAt)}
                    <div className="mt-1 text-[11px] text-muted-foreground/70">{item.sourceAccessAge}</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="rounded-lg border border-slate-300 bg-slate-50/70 p-5 md:p-6" aria-labelledby="retired-failures-heading">
        <div className="flex items-start gap-3">
          <FileSearch className="mt-0.5 text-slate-700" size={18} aria-hidden="true" />
          <div>
            <h2 id="retired-failures-heading" className="font-display text-lg font-bold uppercase tracking-wide text-slate-950">Retired source-failure record</h2>
            <p className="mt-1 max-w-3xl text-sm leading-relaxed text-slate-700">These records are not active monitoring failures. They are superseded URLs retained to explain historical access problems and prevent the audit trail from being mistaken for current source health.</p>
          </div>
        </div>
        {data.retiredFailures.length > 0 && (
          <details className="mt-4 rounded border border-slate-300 bg-white/70 p-3">
            <summary className="cursor-pointer text-sm font-medium text-slate-900">View {data.retiredFailures.length} retired failure records</summary>
            <ul className="mt-3 divide-y divide-slate-200 text-xs">
              {data.retiredFailures.map((item) => (
                <li key={item.id} className="py-3 first:pt-0">
                  <div className="font-medium text-slate-900">{item.trustName ?? item.trustSlug ?? "Unassigned source"}</div>
                  <div className="mt-1 text-slate-700">{item.retrievalNotes ?? item.lastError ?? "Superseded monitoring route."}</div>
                </li>
              ))}
            </ul>
          </details>
        )}
      </section>
    </div>
  );
}

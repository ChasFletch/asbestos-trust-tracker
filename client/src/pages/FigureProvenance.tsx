import { useMemo, useState } from "react";
import { Link } from "wouter";
import { ArrowRight, BookOpenCheck, CheckCircle2, FileText, Landmark, Scale, ShieldCheck } from "lucide-react";
import {
  figureProvenance,
  provenanceChangelogUrl,
  provenanceCommitUrl,
  type EvidenceClass,
  type FigureProvenanceCategory,
} from "@/data/figureProvenance";

type TimelineFilter = "all" | FigureProvenanceCategory;

const filters: Array<{ value: TimelineFilter; label: string }> = [
  { value: "all", label: "All revisions" },
  { value: "assets", label: "Asset floor" },
  { value: "payouts", label: "Payouts" },
  { value: "methodology", label: "Methodology" },
];

const evidenceMeta: Record<EvidenceClass, { label: string; className: string }> = {
  a: { label: "(a) Filed document", className: "border-emerald-500/30 bg-emerald-500/10 text-emerald-700" },
  b: { label: "(b) Secondary citing primary", className: "border-amber-500/30 bg-amber-500/10 text-amber-800" },
  c: { label: "(c) Estimate / inference", className: "border-rose-500/30 bg-rose-500/10 text-rose-700" },
  audit: { label: "Method / audit record", className: "border-sky-500/30 bg-sky-500/10 text-sky-700" },
};

const categoryMeta: Record<FigureProvenanceCategory, { label: string; icon: typeof Landmark; className: string }> = {
  assets: { label: "Asset floor", icon: Landmark, className: "border-primary/30 bg-primary/10 text-primary" },
  payouts: { label: "Cumulative payouts", icon: Scale, className: "border-amber-500/30 bg-amber-500/10 text-amber-800" },
  methodology: { label: "Methodology", icon: BookOpenCheck, className: "border-sky-500/30 bg-sky-500/10 text-sky-700" },
};

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" }).format(
    new Date(`${date}T00:00:00Z`)
  );
}

export default function FigureProvenance() {
  const [filter, setFilter] = useState<TimelineFilter>("all");
  const entries = useMemo(
    () => figureProvenance.filter((entry) => filter === "all" || entry.category === filter),
    [filter]
  );

  return (
    <div className="container py-10 md:py-14 max-w-5xl">
      <header className="mb-9 border-b border-border/60 pb-8">
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-[0.18em] text-primary/80 mb-3">
          <FileText size={14} aria-hidden="true" />
          Public figure history
        </div>
        <div className="grid gap-6 lg:grid-cols-[1fr_18rem] lg:items-end">
          <div>
            <h1 className="font-display text-3xl md:text-4xl font-bold uppercase tracking-wide text-foreground">
              Figure Provenance Timeline
            </h1>
            <p className="mt-4 max-w-3xl text-sm md:text-base leading-relaxed text-muted-foreground">
              Every headline revision has a dated explanation, an evidence label, and a link to the underlying record. This is a change history—not a claim that older figures remain current. Historical source dates and unresolved gaps stay visible.
            </p>
          </div>
          <a
            href={provenanceChangelogUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center justify-between gap-3 rounded border border-border bg-card px-4 py-3 text-sm font-medium text-foreground no-underline transition-colors hover:border-primary/40 hover:bg-primary/5"
          >
            <span>Open canonical changelog</span>
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
          </a>
        </div>
      </header>

      <section aria-labelledby="timeline-principles" className="grid gap-3 md:grid-cols-3 mb-10">
        <div className="rounded border border-border/50 bg-card/30 p-4">
          <ShieldCheck size={17} className="text-primary mb-3" aria-hidden="true" />
          <h2 id="timeline-principles" className="text-sm font-semibold text-foreground">Evidence stays qualified</h2>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">Every link is marked as filed, secondary-citing-filed, estimate, or an audit record. A higher number never overrides a weaker source.</p>
        </div>
        <div className="rounded border border-border/50 bg-card/30 p-4">
          <Landmark size={17} className="text-primary mb-3" aria-hidden="true" />
          <h2 className="text-sm font-semibold text-foreground">Floors are not totals</h2>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">A dated filed amount may be a minimum through its stated as-of year. The timeline does not silently recast historical floors as current payouts.</p>
        </div>
        <div className="rounded border border-border/50 bg-card/30 p-4">
          <CheckCircle2 size={17} className="text-primary mb-3" aria-hidden="true" />
          <h2 className="text-sm font-semibold text-foreground">Corrections remain visible</h2>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">Reclassifications and decreases are published alongside additions, so readers can see how source quality changed the dataset.</p>
        </div>
      </section>

      <section aria-labelledby="timeline-heading">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between mb-6">
          <div>
            <h2 id="timeline-heading" className="font-display text-xl font-bold uppercase tracking-wide text-foreground">Revision timeline</h2>
            <p className="mt-1 text-sm text-muted-foreground">Showing {entries.length} documented figure revisions, newest first.</p>
          </div>
          <div className="flex flex-wrap gap-2" role="group" aria-label="Filter figure revisions">
            {filters.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setFilter(option.value)}
                aria-pressed={filter === option.value}
                className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                  filter === option.value
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <ol className="relative space-y-7 border-l border-border/70 ml-2 md:ml-5 pl-6 md:pl-10">
          {entries.map((entry) => {
            const category = categoryMeta[entry.category];
            const CategoryIcon = category.icon;
            return (
              <li key={entry.id} className="relative">
                <div className="absolute -left-[2.15rem] md:-left-[3.1rem] top-5 flex h-7 w-7 items-center justify-center rounded-full border border-border bg-background text-primary shadow-sm">
                  <CategoryIcon size={14} aria-hidden="true" />
                </div>
                <article className="rounded-lg border border-border/60 bg-card/40 p-5 md:p-6 shadow-sm">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <time dateTime={entry.date} className="font-mono text-xs uppercase tracking-widest text-primary/80">{formatDate(entry.date)}</time>
                      <h3 className="mt-2 text-lg font-semibold leading-snug text-foreground">{entry.headline}</h3>
                    </div>
                    <span className={`inline-flex w-fit items-center rounded-full border px-2.5 py-1 text-xs font-medium ${category.className}`}>{category.label}</span>
                  </div>

                  <dl className="mt-5 grid gap-3 rounded border border-border/45 bg-background/50 p-4 sm:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] sm:items-center">
                    <div>
                      <dt className="text-[0.68rem] font-mono uppercase tracking-widest text-muted-foreground">Previously</dt>
                      <dd className="mt-1 font-mono text-sm text-muted-foreground line-through decoration-muted-foreground/40">{entry.priorValue}</dd>
                    </div>
                    <ArrowRight size={18} className="hidden text-primary sm:block" aria-hidden="true" />
                    <div className="sm:text-right">
                      <dt className="text-[0.68rem] font-mono uppercase tracking-widest text-muted-foreground">Published revision</dt>
                      <dd className="mt-1 font-mono text-sm font-bold text-foreground">{entry.currentValue}</dd>
                    </div>
                  </dl>

                  <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{entry.explanation}</p>

                  <div className="mt-5 border-t border-border/45 pt-4">
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                      <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground">Source trail for {entry.figure}</h4>
                      <a
                        href={provenanceCommitUrl(entry.commit)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-mono text-xs text-primary underline underline-offset-2"
                      >
                        Commit {entry.commit}
                      </a>
                    </div>
                    <ul className="space-y-2">
                      {entry.sources.map((source) => {
                        const evidence = evidenceMeta[source.evidenceClass];
                        const internal = source.url.startsWith("/");
                        const body = <><span className="font-medium">{source.label}</span><span className="text-muted-foreground"> — {source.detail}</span></>;
                        return (
                          <li key={`${entry.id}-${source.label}`} className="flex flex-col gap-1.5 rounded border border-border/40 bg-background/30 px-3 py-2.5 text-xs leading-relaxed sm:flex-row sm:items-start sm:justify-between sm:gap-4">
                            {internal ? (
                              <Link href={source.url} className="text-foreground underline decoration-primary/40 underline-offset-2 hover:decoration-primary">{body}</Link>
                            ) : (
                              <a href={source.url} target="_blank" rel="noopener noreferrer" className="text-foreground underline decoration-primary/40 underline-offset-2 hover:decoration-primary">{body}</a>
                            )}
                            <span className={`w-fit shrink-0 rounded border px-2 py-0.5 text-[0.65rem] font-semibold uppercase tracking-wide ${evidence.className}`}>{evidence.label}</span>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </article>
              </li>
            );
          })}
        </ol>
      </section>

      <section className="mt-10 rounded border border-primary/25 bg-primary/5 p-5 md:p-6" aria-labelledby="next-record-heading">
        <h2 id="next-record-heading" className="font-display text-lg font-bold uppercase tracking-wide text-foreground">What changes next</h2>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted-foreground">Tier 2 records graduate to Tier 1 when the underlying filing is retrieved. When a source is unavailable, restricted, or only historical, that limitation remains part of the public record rather than being filled with an unqualified estimate.</p>
        <div className="mt-4 flex flex-wrap gap-3 text-sm">
          <Link href="/methodology" className="inline-flex items-center gap-1.5 font-medium text-primary no-underline hover:underline">Read the methodology <ArrowRight size={15} aria-hidden="true" /></Link>
          <Link href="/corrections" className="inline-flex items-center gap-1.5 font-medium text-primary no-underline hover:underline">Report a correction <ArrowRight size={15} aria-hidden="true" /></Link>
        </div>
      </section>
    </div>
  );
}

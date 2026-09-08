import { useMemo, useState } from "react";
import { Link } from "wouter";
import { ArrowRight, CalendarDays, ExternalLink, FileCheck2, History, Landmark, Scale } from "lucide-react";
import { OFFICIAL_PAYMENT_NOTICES, type OfficialPaymentNotice } from "@/data/paymentNoticeHistory";

type Filter = "all" | OfficialPaymentNotice["noticeKind"];

const filters: Array<{ value: Filter; label: string }> = [
  { value: "all", label: "All documented records" },
  { value: "payment_change", label: "Rate changes" },
  { value: "current_rate_statement", label: "Current statements" },
  { value: "reconsideration", label: "Reconsiderations" },
];

const kindMeta = {
  payment_change: { label: "Payment percentage change", className: "border-emerald-500/35 bg-emerald-500/10 text-emerald-800" },
  current_rate_statement: { label: "Current rate statement", className: "border-sky-500/35 bg-sky-500/10 text-sky-800" },
  reconsideration: { label: "Reconsideration notice", className: "border-amber-500/35 bg-amber-500/10 text-amber-900" },
} as const;

function formatDate(value?: string) {
  if (!value) return "Not stated in this source";
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" }).format(new Date(`${value}T00:00:00Z`));
}

function eventDate(item: OfficialPaymentNotice) {
  return item.publishedDate ?? item.effectiveDate ?? "0000-00-00";
}

export default function PaymentNoticeHistory() {
  const [filter, setFilter] = useState<Filter>("all");
  const items = useMemo(
    () => OFFICIAL_PAYMENT_NOTICES.filter((item) => filter === "all" || item.noticeKind === filter),
    [filter]
  );

  return (
    <div className="container max-w-6xl py-10 md:py-14">
      <header className="mb-9 border-b border-border/60 pb-8">
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-[0.18em] text-primary/80 mb-3">
          <History size={14} aria-hidden="true" />
          Source-linked rate record
        </div>
        <div className="grid gap-6 lg:grid-cols-[1fr_17rem] lg:items-end">
          <div>
            <h1 className="font-display text-3xl md:text-4xl font-bold uppercase tracking-wide text-foreground">Official Payment-Notice History</h1>
            <p className="mt-4 max-w-3xl text-sm md:text-base leading-relaxed text-muted-foreground">A dated public record of reviewed official notices and current-rate statements supporting selected asbestos trust payment percentages. It is not a complete rate history for every trust. A missing entry means no qualifying linked source has yet been added—not that a payment percentage stayed the same.</p>
          </div>
          <div className="rounded border border-primary/25 bg-primary/5 p-4 text-sm text-muted-foreground">
            <div className="font-mono text-[0.68rem] uppercase tracking-widest text-primary/80">Evidence standard</div>
            <p className="mt-1 font-semibold text-foreground">Official trust or administrator source</p>
            <p className="mt-1 text-xs leading-relaxed">Every entry links to the reviewed notice or current statement that supports its displayed scope.</p>
          </div>
        </div>
      </header>

      <section aria-label="History interpretation" className="mb-10 grid gap-3 md:grid-cols-3">
        <div className="rounded border border-border/50 bg-card/30 p-4"><FileCheck2 size={17} className="mb-3 text-primary" aria-hidden="true" /><h2 className="text-sm font-semibold text-foreground">Notice, not inference</h2><p className="mt-1 text-xs leading-relaxed text-muted-foreground">Displayed rates trace to a linked official source. Secondary summaries are not used as a substitute.</p></div>
        <div className="rounded border border-border/50 bg-card/30 p-4"><Scale size={17} className="mb-3 text-primary" aria-hidden="true" /><h2 className="text-sm font-semibold text-foreground">Scope matters</h2><p className="mt-1 text-xs leading-relaxed text-muted-foreground">Sub-accounts, review tracks, and value bases remain identified. One rate is never generalized across a separate pool.</p></div>
        <div className="rounded border border-border/50 bg-card/30 p-4"><Landmark size={17} className="mb-3 text-primary" aria-hidden="true" /><h2 className="text-sm font-semibold text-foreground">No implied completeness</h2><p className="mt-1 text-xs leading-relaxed text-muted-foreground">The tracker keeps researching historical notices. Absence from this list is a documentation gap, not a finding of no change.</p></div>
      </section>

      <section aria-labelledby="notice-history-heading">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div><h2 id="notice-history-heading" className="font-display text-xl font-bold uppercase tracking-wide text-foreground">Dated notices and statements</h2><p className="mt-1 text-sm text-muted-foreground">Showing {items.length} reviewed records, ordered by notice or stated effective date.</p></div>
          <div className="flex flex-wrap gap-2" role="group" aria-label="Filter official payment notices">
            {filters.map((option) => <button key={option.value} type="button" onClick={() => setFilter(option.value)} aria-pressed={filter === option.value} className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${filter === option.value ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground"}`}>{option.label}</button>)}
          </div>
        </div>

        <ol className="space-y-5">
          {items.sort((a, b) => eventDate(b).localeCompare(eventDate(a))).map((item) => {
            const meta = kindMeta[item.noticeKind];
            return <li key={item.id}>
              <article className="overflow-hidden rounded-lg border border-border/60 bg-card/40 shadow-sm">
                <div className="border-b border-border/45 bg-background/45 px-5 py-4 md:px-6"><div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between"><div className="min-w-0"><div className="font-mono text-[0.68rem] uppercase tracking-widest text-primary/80">{item.scope}</div><h3 className="mt-1 text-lg font-semibold leading-snug text-foreground">{item.trustName}</h3></div><span className={`inline-flex w-fit shrink-0 rounded-full border px-2.5 py-1 text-xs font-semibold ${meta.className}`}>{meta.label}</span></div></div>
                <div className="grid gap-5 p-5 md:grid-cols-[minmax(0,1.25fr)_minmax(15rem,0.75fr)] md:p-6"><div><p className="text-sm leading-relaxed text-foreground">{item.summary}</p><dl className="mt-5 grid gap-3 sm:grid-cols-3 text-xs"><div className="rounded border border-border/45 bg-background/40 p-3"><dt className="font-mono uppercase tracking-wider text-[0.62rem] text-muted-foreground">Prior rate</dt><dd className="mt-1 text-base font-semibold text-foreground">{item.priorPercentage === undefined ? "Not stated" : `${item.priorPercentage}%`}</dd></div><div className="rounded border border-primary/25 bg-primary/5 p-3"><dt className="font-mono uppercase tracking-wider text-[0.62rem] text-primary/80">Source-supported rate</dt><dd className="mt-1 text-base font-semibold text-foreground">{item.currentPercentage}%</dd></div><div className="rounded border border-border/45 bg-background/40 p-3"><dt className="font-mono uppercase tracking-wider text-[0.62rem] text-muted-foreground">Effective date</dt><dd className="mt-1 text-sm font-semibold text-foreground">{formatDate(item.effectiveDate)}</dd></div></dl></div><aside className="rounded border border-border/50 bg-background/40 p-4"><h4 className="flex items-center gap-2 text-sm font-semibold text-foreground"><CalendarDays size={15} className="text-primary" aria-hidden="true" />Source record</h4><dl className="mt-4 space-y-3 text-xs"><div><dt className="font-mono uppercase tracking-wider text-[0.62rem] text-muted-foreground">Published / observed</dt><dd className="mt-0.5 text-foreground">{formatDate(item.publishedDate)}</dd></div><div><dt className="font-mono uppercase tracking-wider text-[0.62rem] text-muted-foreground">Source</dt><dd className="mt-0.5 leading-relaxed text-foreground">{item.sourceLabel}</dd></div></dl><a href={item.sourceUrl} target="_blank" rel="noopener noreferrer" className="mt-5 inline-flex items-center gap-1.5 text-xs font-medium text-primary underline underline-offset-2 hover:no-underline">Open official source <ExternalLink size={13} aria-hidden="true" /></a><Link href={`/trusts/${item.trustSlug}`} className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-primary no-underline hover:underline">Open trust record <ArrowRight size={13} aria-hidden="true" /></Link></aside></div>
              </article>
            </li>;
          })}
        </ol>
      </section>

      <section className="mt-10 rounded border border-primary/25 bg-primary/5 p-5 md:p-6" aria-labelledby="notice-disclosure-heading"><h2 id="notice-disclosure-heading" className="font-display text-lg font-bold uppercase tracking-wide text-foreground">Reading this history</h2><p className="mt-2 max-w-4xl text-sm leading-relaxed text-muted-foreground">A payment percentage is not itself a claim-value promise. Each trust’s governing procedures, review track, disease level, applicable payment percentage, and claim-specific requirements control any actual payment. This page is a public source record, not legal or medical advice.</p><div className="mt-4 flex flex-wrap gap-3 text-sm"><Link href="/trusts" className="inline-flex items-center gap-1.5 font-medium text-primary no-underline hover:underline">Browse trust data <ArrowRight size={15} aria-hidden="true" /></Link><Link href="/source-recovery" className="inline-flex items-center gap-1.5 font-medium text-primary no-underline hover:underline">View source recovery <ArrowRight size={15} aria-hidden="true" /></Link><Link href="/methodology" className="inline-flex items-center gap-1.5 font-medium text-primary no-underline hover:underline">Read methodology <ArrowRight size={15} aria-hidden="true" /></Link></div></section>
    </div>
  );
}

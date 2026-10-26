import { Link } from "wouter";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ArrowLeft, Calendar, FileCheck2, FileText, Landmark, ShieldAlert } from "lucide-react";
import type { ResearchRecord } from "@/data/researchRecords";
import { useDocumentTitle } from "@/components/Head";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${value}T00:00:00Z`));
}

function removeFrontMatter(markdown: string) {
  return markdown.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n/, "");
}

export default function ResearchRecordDetail({ record }: { record: ResearchRecord }) {
  useDocumentTitle(record.title);
  const recordTypeLabel = record.recordKind === "bankruptcy-estate" ? "Bankruptcy estate record" : "Proposed trust record";

  return (
    <article className="container max-w-4xl py-8" data-research-record={record.slug}>
      <nav aria-label="Breadcrumb" className="mb-6">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem><BreadcrumbLink asChild><Link href="/">Home</Link></BreadcrumbLink></BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem><BreadcrumbLink asChild><Link href="/trusts">Trust Data</Link></BreadcrumbLink></BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem><BreadcrumbPage>{record.title}</BreadcrumbPage></BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </nav>

      <header className="mb-8 rounded-xl border border-primary/25 bg-primary/[0.045] p-5 sm:p-6">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded border border-primary/25 bg-background px-2 py-1 font-mono text-[0.68rem] font-semibold uppercase tracking-wider text-primary">{recordTypeLabel}</span>
          <span className="rounded border border-amber-300/70 bg-amber-50 px-2 py-1 text-xs font-semibold text-amber-950">{record.statusLabel}</span>
        </div>
        <div className="mt-4 flex items-start gap-3">
          <Landmark size={20} className="mt-0.5 shrink-0 text-primary" aria-hidden="true" />
          <div>
            <h2 className="font-display text-xl font-bold leading-tight text-foreground">Research record status</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              This is not an operating trust record. It is excluded from operating-trust counts, payment-percentage summaries, net-asset totals, and cumulative-payment totals.
            </p>
          </div>
        </div>
        <dl className="mt-5 grid gap-3 border-t border-primary/15 pt-4 text-sm sm:grid-cols-3">
          <div><dt className="font-mono text-[0.65rem] font-semibold uppercase tracking-wider text-muted-foreground">Status as of</dt><dd className="mt-1 flex items-center gap-1.5 text-foreground"><Calendar size={13} aria-hidden="true" />{formatDate(record.statusAsOf)}</dd></div>
          <div><dt className="font-mono text-[0.65rem] font-semibold uppercase tracking-wider text-muted-foreground">Published</dt><dd className="mt-1 text-foreground">{formatDate(record.publishedAt)}</dd></div>
          <div><dt className="font-mono text-[0.65rem] font-semibold uppercase tracking-wider text-muted-foreground">Source cut-off</dt><dd className="mt-1 text-foreground">{formatDate(record.sourceCutoffAt)}</dd></div>
        </dl>
      </header>

      <div className="mb-8 rounded-lg border border-border/60 bg-card/40 p-4 text-sm leading-relaxed text-muted-foreground">
        <div className="flex items-start gap-2.5">
          <FileCheck2 size={17} className="mt-0.5 shrink-0 text-primary" aria-hidden="true" />
          <p>
            The exact reviewed source record is rendered below. Its companion claim-to-source register and status note are published unchanged in the source package so readers can inspect the cited document map and review-era status boundaries.
          </p>
        </div>
      </div>

      <div className="prose prose-sm max-w-none prose-headings:font-display prose-headings:font-bold prose-h1:text-3xl prose-h1:leading-tight prose-h2:mt-9 prose-h2:border-b prose-h2:border-border/30 prose-h2:pb-2 prose-p:leading-relaxed prose-strong:text-foreground prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-blockquote:border-l-primary/40 prose-blockquote:text-muted-foreground prose-table:text-sm prose-th:bg-muted/30 prose-th:font-semibold prose-li:text-foreground/90">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{removeFrontMatter(record.markdown)}</ReactMarkdown>
      </div>

      <section className="mt-10 rounded-xl border border-border bg-muted/25 p-5 sm:p-6" aria-labelledby="source-package-heading">
        <div className="flex items-start gap-3">
          <FileText size={19} className="mt-0.5 shrink-0 text-primary" aria-hidden="true" />
          <div>
            <h2 id="source-package-heading" className="font-serif text-xl font-semibold text-foreground">Published source package</h2>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">Each file below is the exact reviewed Markdown artifact retained for this publication. SHA-256 is provided for reproducible verification.</p>
          </div>
        </div>
        <ul className="mt-5 divide-y divide-border/60 rounded-lg border border-border/60 bg-background/40">
          {record.sourceFiles.map((source) => (
            <li key={source.href} className="px-4 py-3">
              <a href={source.href} className="text-sm font-medium text-primary hover:underline">{source.label}</a>
              <div className="mt-1 break-all font-mono text-[0.68rem] text-muted-foreground">SHA-256: {source.sha256}</div>
            </li>
          ))}
        </ul>
      </section>

      <aside className="mt-8 rounded-xl border border-border bg-card p-5" aria-labelledby="record-disclosure-heading">
        <div className="flex items-start gap-3">
          <ShieldAlert size={19} className="mt-0.5 shrink-0 text-primary" aria-hidden="true" />
          <div>
            <h2 id="record-disclosure-heading" className="font-serif text-xl font-semibold text-foreground">Research and review disclosure</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">Research was prepared by Manus. No attorney is credited as reviewing this specific record. AsbestosTrusts.org is funded by Danziger &amp; De Llano, LLP. This publication is general research, not legal advice, and does not evaluate an individual claim or legal right.</p>
          </div>
        </div>
      </aside>

      <footer className="mt-10 border-t border-border/40 pt-6">
        <Link href="/trusts" className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"><ArrowLeft size={14} aria-hidden="true" /> Back to Trust Data</Link>
      </footer>
    </article>
  );
}

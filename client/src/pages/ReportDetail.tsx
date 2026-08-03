import { useEffect, useState } from "react";
import { useParams, Link } from "wouter";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ArrowLeft, ExternalLink, Calendar, FileText, Home, BookOpen, ShieldCheck } from "lucide-react";
import {
  Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink,
  BreadcrumbPage, BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

interface ReportMeta {
  id: string;
  title: string;
  date?: string;
  asOf?: string;
  path?: string;
}

// Strip YAML frontmatter (--- ... ---) from the top of the markdown
function stripFrontmatter(md: string): string {
  if (!md.startsWith("---")) return md;
  const end = md.indexOf("\n---", 3);
  if (end === -1) return md;
  return md.slice(end + 4).trimStart();
}

// Parse frontmatter fields we care about
function parseFrontmatter(md: string): Record<string, string> {
  const result: Record<string, string> = {};
  if (!md.startsWith("---")) return result;
  const end = md.indexOf("\n---", 3);
  if (end === -1) return result;
  const block = md.slice(4, end);
  for (const line of block.split("\n")) {
    const colon = line.indexOf(":");
    if (colon === -1) continue;
    const key = line.slice(0, colon).trim();
    const val = line.slice(colon + 1).trim().replace(/^["']|["']$/g, "");
    result[key] = val;
  }
  return result;
}

const GITHUB_RAW_BASE = "https://raw.githubusercontent.com/ChasFletch/asbestos-trust-tracker/main";

export default function ReportDetail() {
  const { id } = useParams<{ id: string }>();
  const [meta, setMeta] = useState<ReportMeta | null>(null);
  const [markdown, setMarkdown] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setNotFound(false);

    // Fetch metadata and markdown in parallel
    Promise.all([
      fetch(`/api/reports/${id}`).then((r) => (r.ok ? r.json() : null)),
      fetch(`/api/reports/${id}/markdown`).then((r) => (r.ok ? r.text() : null)),
    ])
      .then(([metaData, mdText]) => {
        if (!metaData && !mdText) { setNotFound(true); return; }
        // Merge frontmatter into meta
        const fm = mdText ? parseFrontmatter(mdText) : {};
        setMeta({
          id: id,
          title: metaData?.title ?? fm["title"] ?? id,
          date: metaData?.date ?? fm["published"],
          asOf: metaData?.asOf ?? fm["as_of"],
          path: metaData?.path,
        });
        setMarkdown(mdText ? stripFrontmatter(mdText) : null);
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [id]);

  const githubUrl = meta?.path ? `${GITHUB_RAW_BASE}/${meta.path}` : null;

  if (loading) {
    return (
      <div className="container py-10 max-w-3xl">
        <div className="h-6 w-32 bg-muted/40 rounded animate-pulse mb-8" />
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className={`h-4 bg-muted/30 rounded animate-pulse`} style={{ width: `${85 - i * 5}%` }} />
          ))}
        </div>
      </div>
    );
  }

  if (notFound || !markdown) {
    return (
      <div className="container py-10 max-w-3xl text-center">
        <FileText size={40} className="text-muted-foreground/30 mx-auto mb-4" />
        <h1 className="font-display font-bold text-xl mb-2">Report not found</h1>
        <p className="text-sm text-muted-foreground mb-6">
          The report <span className="font-mono text-primary/80">{id}</span> could not be loaded.
        </p>
        <Link href="/reports" className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline">
          <ArrowLeft size={14} /> Back to Reports
        </Link>
      </div>
    );
  }

  return (
    <div className="container py-8 max-w-3xl">
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
                <Link href="/reports"><BookOpen size={14} className="inline -mt-0.5" /> Reports</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{meta?.title ?? id}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </nav>

      {/* Header */}
      <div className="mb-8 pb-6 border-b border-border/40">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className="text-xs font-mono px-1.5 py-0.5 rounded bg-primary/10 text-primary/80 border border-primary/20">
            {id}
          </span>
          {meta?.date && (
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Calendar size={10} />
              {new Date(meta.date + "T12:00:00Z").toLocaleDateString("en-US", {
                month: "long", day: "numeric", year: "numeric",
              })}
            </span>
          )}
          {meta?.asOf && (
            <span className="text-xs text-muted-foreground/60">
              Data as of {new Date(meta.asOf + "T12:00:00Z").toLocaleDateString("en-US", {
                month: "short", day: "numeric", year: "numeric",
              })}
            </span>
          )}
        </div>
        <h1 className="font-display font-bold text-2xl leading-tight text-foreground mb-3">
          {meta?.title}
        </h1>
        {githubUrl && (
          <a
            href={githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            View raw on GitHub <ExternalLink size={10} />
          </a>
        )}
        {/* Reviewed by badge */}
        <div className="mt-3 flex items-center gap-1.5 text-xs text-emerald-700 dark:text-emerald-400">
          <ShieldCheck size={14} className="shrink-0" />
          <span>Reviewed by Paul Danziger and Rod De Llano · Danziger &amp; De Llano, LLP</span>
        </div>
      </div>

      {/* Markdown body */}
      <div className="prose prose-sm max-w-none
        prose-headings:font-display prose-headings:font-bold prose-headings:tracking-tight
        prose-h1:text-xl prose-h2:text-lg prose-h2:border-b prose-h2:border-border/30 prose-h2:pb-1 prose-h2:mt-8
        prose-h3:text-base prose-h3:mt-6
        prose-p:text-foreground/90 prose-p:leading-relaxed
        prose-strong:text-foreground prose-strong:font-semibold
        prose-a:text-primary prose-a:no-underline hover:prose-a:underline
        prose-code:text-primary/80 prose-code:bg-primary/8 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:text-xs
        prose-blockquote:border-l-primary/40 prose-blockquote:text-muted-foreground
        prose-table:text-sm prose-th:bg-muted/30 prose-th:font-semibold
        prose-li:text-foreground/90
        prose-hr:border-border/30">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {markdown}
        </ReactMarkdown>
      </div>

      {/* Footer nav */}
      <div className="mt-10 pt-6 border-t border-border/30 flex items-center justify-between">
        <Link href="/reports" className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline">
          <ArrowLeft size={14} /> All Reports
        </Link>
        {githubUrl && (
          <a
            href={githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
          >
            View on GitHub <ExternalLink size={10} />
          </a>
        )}
      </div>
    </div>
  );
}

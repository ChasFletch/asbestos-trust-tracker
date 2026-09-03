import { Link, useParams } from "wouter";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ArrowLeft, Calendar, ExternalLink, FileText, Home, Newspaper } from "lucide-react";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { NEWS_BRIEFS_BY_SLUG } from "@/data/newsBriefs";
import { useDocumentTitle } from "@/components/Head";
import { ArticleAuthorshipReviewBox } from "@/components/ArticleAuthorshipReviewBox";
import { DESIGNATED_LEGAL_REVIEWERS, RESEARCH_DESK } from "@/data/researchDeskPeople";

export default function NewsDetail() {
  const { slug } = useParams<{ slug: string }>();
  const brief = slug ? NEWS_BRIEFS_BY_SLUG[slug] : undefined;
  useDocumentTitle(brief ? `${brief.title} · AsbestosTrusts.org` : "News brief not found · AsbestosTrusts.org");

  if (!brief) {
    return <div className="container py-12 max-w-3xl text-center"><FileText size={40} className="text-muted-foreground/30 mx-auto mb-4" /><h1 className="font-display font-bold text-xl mb-2">News brief not found</h1><p className="text-sm text-muted-foreground mb-6">This source-linked update is unavailable.</p><Link href="/news" className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline"><ArrowLeft size={14} /> Back to News</Link></div>;
  }

  const categoryLabel = brief.category === "annual_report" ? "Filed quarterly report" : brief.category.replace(/_/g, " ");

  return <article className="container py-8 max-w-3xl">
    <nav aria-label="Breadcrumb" className="mb-6"><Breadcrumb><BreadcrumbList><BreadcrumbItem><BreadcrumbLink asChild><Link href="/"><Home size={14} className="inline -mt-0.5" /> Home</Link></BreadcrumbLink></BreadcrumbItem><BreadcrumbSeparator /><BreadcrumbItem><BreadcrumbLink asChild><Link href="/news"><Newspaper size={14} className="inline -mt-0.5" /> News</Link></BreadcrumbLink></BreadcrumbItem><BreadcrumbSeparator /><BreadcrumbItem><BreadcrumbPage>{brief.title}</BreadcrumbPage></BreadcrumbItem></BreadcrumbList></Breadcrumb></nav>
    <header className="mb-8 pb-6 border-b border-border/40">
      <div className="flex flex-wrap items-center gap-2 mb-3"><span className="text-xs font-mono px-1.5 py-0.5 rounded bg-primary/10 text-primary/80 border border-primary/20 capitalize">{categoryLabel}</span><span className="text-xs text-muted-foreground flex items-center gap-1"><Calendar size={10} />{new Date(`${brief.date}T12:00:00Z`).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric", timeZone: "UTC" })}</span></div>
      <h1 className="font-display font-bold text-2xl leading-tight text-foreground mb-3">{brief.title}</h1>
      <p className="text-sm text-muted-foreground leading-relaxed">{brief.summary}</p>
      <a href={brief.sourceUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-xs text-primary hover:underline mt-4"><ExternalLink size={12} /> View primary source: {brief.sourceLabel}</a>
    </header>
    <div className="prose prose-sm max-w-none prose-headings:font-display prose-headings:font-bold prose-h2:text-lg prose-h2:border-b prose-h2:border-border/30 prose-h2:pb-1 prose-h2:mt-8 prose-p:text-foreground/90 prose-p:leading-relaxed prose-strong:text-foreground prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-blockquote:border-l-primary/40 prose-blockquote:text-muted-foreground prose-table:text-sm prose-th:bg-muted/30 prose-th:font-semibold prose-li:text-foreground/90"><ReactMarkdown remarkPlugins={[remarkGfm]}>{brief.markdown}</ReactMarkdown></div>
    <ArticleAuthorshipReviewBox author={RESEARCH_DESK} legalReviewers={DESIGNATED_LEGAL_REVIEWERS.map((person) => ({ person }))} publishedAt={brief.date} materiallyUpdatedAt={brief.date} sourceCutoffAt={brief.sourceCutoffAt ?? brief.date} />
    <footer className="mt-10 pt-6 border-t border-border/30"><Link href="/news" className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline"><ArrowLeft size={14} /> All News & Updates</Link></footer>
  </article>;
}

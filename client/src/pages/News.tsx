import { trpc } from "@/lib/trpc";
import { useState, useEffect } from "react";
import { ExternalLink } from "lucide-react";

interface NewsDraft {
  filename: string;
  date: string;
  title: string;
  summary: string;
  category: string;
  url?: string;
}

const CATEGORIES = [
  { value: "all", label: "All Updates" },
  { value: "payment_change", label: "Payment Changes" },
  { value: "annual_report", label: "Annual Reports" },
  { value: "court_filing", label: "Court Filings" },
  { value: "trust_news", label: "Trust News" },
  { value: "system_update", label: "System Updates" },
];

export default function News() {
  const [category, setCategory] = useState("all");
  const { data: news, isLoading: dbLoading } = trpc.news.list.useQuery({
    limit: 50,
    category: category === "all" ? undefined : category as "payment_change" | "annual_report" | "court_filing" | "trust_news" | "system_update",
  });

  const [drafts, setDrafts] = useState<NewsDraft[]>([]);
  const [draftsLoading, setDraftsLoading] = useState(true);

  useEffect(() => {
    fetch("/api/news-drafts")
      .then((r) => r.json())
      .then((d) => setDrafts(d.drafts ?? []))
      .catch(() => setDrafts([]))
      .finally(() => setDraftsLoading(false));
  }, []);

  // Merge: drafts first (newest), then DB items — both filtered by category
  const filteredDrafts = drafts.filter(
    (d) => category === "all" || d.category === category
  );
  const draftItems = filteredDrafts.map((d) => ({
    id: `draft-${d.filename}`,
    title: d.title,
    summary: d.summary,
    category: d.category,
    publishedAt: new Date(d.date).getTime(),
    url: d.url ?? null,
    trustId: null,
    isDraft: true as const,
  }));
  const dbItems = (news ?? []).map((n) => ({ ...n, isDraft: false as const }));
  const allItems = [...draftItems, ...dbItems];

  const isLoading = dbLoading || draftsLoading;

  return (
    <div className="container py-10 max-w-3xl">
      <div className="mb-8">
        <div className="text-xs font-mono text-primary/70 uppercase tracking-widest mb-2">News &amp; Updates</div>
        <h1 className="font-display font-bold uppercase tracking-wider text-2xl mb-2">
          Trust System Updates
        </h1>
        <p className="text-sm text-muted-foreground">
          Payment percentage changes, annual report filings, court activity, and system updates. Curated from primary sources only — no law firm marketing content.
        </p>
      </div>

      {/* Category filter */}
      <div className="flex flex-wrap gap-2 mb-8">
        {CATEGORIES.map((c) => (
          <button
            key={c.value}
            onClick={() => setCategory(c.value)}
            className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${
              category === c.value
                ? "bg-primary text-primary-foreground"
                : "bg-card border border-border/50 text-muted-foreground hover:text-foreground hover:border-border"
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* News list */}
      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-24 rounded bg-card/50 animate-pulse" />
          ))}
        </div>
      ) : allItems.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground/50">
          <p>No updates found for this category.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {allItems.map((item) => (
            <div
              key={item.id}
              className="p-4 rounded border border-border/50 bg-card/40 hover:border-border transition-colors"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1.5">
                    <span className="text-xs font-mono text-muted-foreground/60 uppercase tracking-wider">
                      {item.category?.replace(/_/g, " ")}
                    </span>
                   {item.publishedAt && (
                     <span className="text-xs text-muted-foreground/40">
                       {new Date(item.publishedAt).toLocaleDateString("en-US", {
                          month: "long", day: "numeric", year: "numeric", timeZone: "UTC",
                        })}
                     </span>
                    )}
                    {item.isDraft && (
                      <span className="text-xs px-1.5 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200">
                        Weekly Update
                      </span>
                    )}
                    {!item.isDraft && item.trustId && (
                      <span className="text-xs px-1.5 py-0.5 rounded bg-primary/10 text-primary/80 border border-primary/20">
                        Trust Record
                      </span>
                    )}
                  </div>
                  <h3 className="text-sm font-semibold text-foreground leading-snug mb-1">{item.title}</h3>
                  {item.summary && (
                    <p className="text-xs text-muted-foreground leading-relaxed">{item.summary}</p>
                  )}
                  {item.url && (
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-primary hover:underline mt-2"
                    >
                      Source <ExternalLink size={10} />
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-8 text-xs text-muted-foreground/50 text-center">
        News feed curated from trust websites, court filings, and public notices only.
        No law firm marketing content. No links to other law firms.
      </div>
    </div>
  );
}

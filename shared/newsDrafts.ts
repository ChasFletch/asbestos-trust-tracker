export interface NewsDraft {
  filename: string;
  date: string;
  title: string;
  summary: string;
  category: string;
  url?: string;
}

export const NEWS_DRAFTS_QUERY_KEY = ["public-news-drafts"] as const;

export async function loadNewsDrafts(): Promise<NewsDraft[]> {
  const response = await fetch("/api/news-drafts");
  if (!response.ok) throw new Error(`News draft fetch failed: ${response.status}`);
  const data: unknown = await response.json();
  if (!data || typeof data !== "object" || !Array.isArray((data as { drafts?: unknown }).drafts)) {
    throw new Error("Invalid News draft response");
  }
  const drafts = (data as { drafts: unknown[] }).drafts;
  if (drafts.some((draft) => {
    if (!draft || typeof draft !== "object") return true;
    const d = draft as Record<string, unknown>;
    return [d.filename, d.date, d.title, d.summary, d.category].some((field) => typeof field !== "string")
      || (d.url !== undefined && typeof d.url !== "string");
  })) throw new Error("Invalid News draft response");
  return drafts as NewsDraft[];
}

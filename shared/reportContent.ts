import type { QueryClient } from "@tanstack/react-query";

export interface ReportMeta {
  id: string;
  title: string;
  date?: string;
  asOf?: string;
  path?: string;
}

/** Metadata returned by /api/reports/:id before markdown frontmatter is merged. */
export type ReportMetadataResponse = Partial<ReportMeta>;

/**
 * The exact React Query payload for a report detail route. `markdown` is the
 * existing rendered body (with only the leading YAML frontmatter removed).
 */
export interface ReportContent {
  meta: ReportMeta;
  markdown: string | null;
}

/** Loader shape supplied to SSR prefetch code. Return null when the report is absent. */
export type ReportContentLoader = (id: string) => Promise<ReportContent | null>;

/** Injectable fetch shape so the API loader remains easy to exercise and reuse. */
export type ReportContentFetcher = (
  input: string,
  init?: RequestInit,
) => Promise<Pick<Response, "ok" | "json" | "text">>;

export const REPORT_CONTENT_QUERY_KEY = "report-content";
export type ReportContentQueryKey = readonly [typeof REPORT_CONTENT_QUERY_KEY, string];

/** The stable key shared by client useQuery and SSR QueryClient seeding. */
export function reportContentQueryKey(id: string): ReportContentQueryKey {
  return [REPORT_CONTENT_QUERY_KEY, id];
}

// Strip YAML frontmatter (--- ... ---) from the top of the markdown.
// This intentionally preserves the report page's existing delimiter and trim behavior.
export function stripReportFrontmatter(markdown: string): string {
  if (!markdown.startsWith("---")) return markdown;
  const end = markdown.indexOf("\n---", 3);
  if (end === -1) return markdown;
  return markdown.slice(end + 4).trimStart();
}

// Parse the frontmatter fields used by the report detail metadata merge.
export function parseReportFrontmatter(markdown: string): Record<string, string> {
  const result: Record<string, string> = {};
  if (!markdown.startsWith("---")) return result;
  const end = markdown.indexOf("\n---", 3);
  if (end === -1) return result;
  const block = markdown.slice(4, end);
  for (const line of block.split("\n")) {
    const colon = line.indexOf(":");
    if (colon === -1) continue;
    const key = line.slice(0, colon).trim();
    const value = line.slice(colon + 1).trim().replace(/^["']|["']$/g, "");
    result[key] = value;
  }
  return result;
}

/**
 * Reproduce the report page's established API/frontmatter precedence:
 * API metadata wins; YAML fills any missing title, publication date, and as-of date.
 */
export function createReportContent(
  id: string,
  metadata: ReportMetadataResponse | null | undefined,
  markdown: string | null | undefined,
): ReportContent | null {
  const markdownText = markdown || null;
  if (!metadata && !markdownText) return null;

  const frontmatter = markdownText ? parseReportFrontmatter(markdownText) : {};
  return {
    meta: {
      id,
      title: metadata?.title ?? frontmatter.title ?? id,
      date: metadata?.date ?? frontmatter.published,
      asOf: metadata?.asOf ?? frontmatter.as_of,
      path: metadata?.path,
    },
    markdown: markdownText ? stripReportFrontmatter(markdownText) : null,
  };
}

function asReportMetadata(value: unknown): ReportMetadataResponse | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  return value as ReportMetadataResponse;
}

/**
 * Client-side loader for the existing public report endpoints. Both requests
 * intentionally run in parallel, matching the report page's prior behavior.
 */
export async function loadReportContent(
  id: string,
  fetcher: ReportContentFetcher = globalThis.fetch,
): Promise<ReportContent | null> {
  try {
    const [metadataResponse, markdownResponse] = await Promise.all([
      fetcher(`/api/reports/${id}`),
      fetcher(`/api/reports/${id}/markdown`),
    ]);
    const [metadata, markdown] = await Promise.all([
      metadataResponse.ok ? metadataResponse.json() : null,
      markdownResponse.ok ? markdownResponse.text() : null,
    ]);

    return createReportContent(id, asReportMetadata(metadata), markdown);
  } catch {
    return null;
  }
}

/** Seed exactly the payload that ReportDetail's useQuery reads during hydration. */
export function seedReportContent(
  queryClient: Pick<QueryClient, "setQueryData">,
  id: string,
  content: ReportContent,
): void {
  queryClient.setQueryData(reportContentQueryKey(id), content);
}

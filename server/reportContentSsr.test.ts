import { QueryClient, dehydrate } from "@tanstack/react-query";
import { describe, expect, it } from "vitest";
import {
  createReportContent,
  loadReportContent,
  parseReportFrontmatter,
  REPORT_CONTENT_QUERY_KEY,
  reportContentQueryKey,
  seedReportContent,
  stripReportFrontmatter,
} from "../shared/reportContent";

describe("report content SSR contract", () => {
  it("uses one stable key for ReportDetail and hydrated SSR data", () => {
    const id = "ATR-2026-Q3";
    const content = createReportContent(
      id,
      {
        id,
        title: "State of the Asbestos Trust System — Q3 2026",
        date: "2026-07-28",
        asOf: "2026-07-28",
        path: "reports/2026-Q3-state-of-the-asbestos-trust-system.md",
      },
      "# State of the Asbestos Trust System — Q3 2026\n",
    );

    expect(reportContentQueryKey(id)).toEqual([REPORT_CONTENT_QUERY_KEY, id]);
    expect(content).not.toBeNull();

    const queryClient = new QueryClient();
    seedReportContent(queryClient, id, content!);

    expect(queryClient.getQueryData(reportContentQueryKey(id))).toEqual(content);
    const dehydrated = dehydrate(queryClient);
    expect(dehydrated.queries).toHaveLength(1);
    expect(dehydrated.queries[0]?.queryKey).toEqual(reportContentQueryKey(id));
    expect(dehydrated.queries[0]?.state.data).toEqual(content);
  });

  it("preserves the existing frontmatter parser, API precedence, and markdown body bytes", () => {
    const rawMarkdown = [
      "---",
      'title: "Frontmatter title"',
      "published: 2026-07-28",
      "as_of: 2026-07-27",
      "---",
      "",
      "# Original report heading",
      "",
      "A paragraph with [the original link](https://example.test/source).",
      "",
    ].join("\n");

    expect(parseReportFrontmatter(rawMarkdown)).toMatchObject({
      title: "Frontmatter title",
      published: "2026-07-28",
      as_of: "2026-07-27",
    });
    expect(stripReportFrontmatter(rawMarkdown)).toBe(
      "# Original report heading\n\nA paragraph with [the original link](https://example.test/source).\n",
    );

    expect(createReportContent("ATR-2026-Q3", null, rawMarkdown)).toEqual({
      meta: {
        id: "ATR-2026-Q3",
        title: "Frontmatter title",
        date: "2026-07-28",
        asOf: "2026-07-27",
        path: undefined,
      },
      markdown: "# Original report heading\n\nA paragraph with [the original link](https://example.test/source).\n",
    });

    expect(createReportContent("ATR-2026-Q3", {
      title: "API title",
      date: "2026-07-29",
      asOf: "2026-07-28",
      path: "reports/original.md",
    }, rawMarkdown)?.meta).toEqual({
      id: "ATR-2026-Q3",
      title: "API title",
      date: "2026-07-29",
      asOf: "2026-07-28",
      path: "reports/original.md",
    });
  });

  it("loads the existing metadata and markdown endpoints as one query payload", async () => {
    const calls: string[] = [];
    const content = await loadReportContent("ATR-2026-Q3", async (input) => {
      calls.push(input);
      if (input.endsWith("/markdown")) {
        return {
          ok: true,
          json: async () => null,
          text: async () => "# Report body\n",
        };
      }
      return {
        ok: true,
        json: async () => ({
          id: "ATR-2026-Q3",
          title: "State of the Asbestos Trust System — Q3 2026",
          date: "2026-07-28",
          asOf: "2026-07-28",
          path: "reports/2026-Q3-state-of-the-asbestos-trust-system.md",
        }),
        text: async () => "",
      };
    });

    expect(calls).toEqual([
      "/api/reports/ATR-2026-Q3",
      "/api/reports/ATR-2026-Q3/markdown",
    ]);
    expect(content).toEqual({
      meta: {
        id: "ATR-2026-Q3",
        title: "State of the Asbestos Trust System — Q3 2026",
        date: "2026-07-28",
        asOf: "2026-07-28",
        path: "reports/2026-Q3-state-of-the-asbestos-trust-system.md",
      },
      markdown: "# Report body\n",
    });
  });
});

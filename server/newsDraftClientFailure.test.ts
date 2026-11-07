import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

const state = vi.hoisted(() => ({
  drafts: { data: [] as any[], isLoading: false, isError: false },
  dbError: false,
}));

vi.mock("@tanstack/react-query", () => ({ useQuery: () => state.drafts }));
vi.mock("@/lib/trpc", () => ({
  trpc: { news: { list: { useQuery: () => ({
    data: [{ id: 1, title: "Database-only card", category: "trust_news", summary: "", publishedAt: null, url: null, trustId: null }],
    isLoading: false,
    isError: state.dbError,
  }) } } },
}));
vi.mock("@/components/LegalTermTooltip", () => ({ LegalTermText: ({ children }: any) => children }));
vi.mock("@/data/newsBriefs", () => ({ NEWS_BRIEFS_BY_CARD_TITLE: {}, NEWS_BRIEFS_BY_SLUG: {} }));
vi.mock("wouter", () => ({ Link: ({ children, href }: any) => React.createElement("a", { href }, children) }));
vi.mock("lucide-react", () => ({ ExternalLink: () => null }));

import News from "../client/src/pages/News";

beforeEach(() => {
  // The project's test transform uses classic JSX, unlike the production React plugin.
  vi.stubGlobal("React", React);
  state.drafts = { data: [], isLoading: false, isError: false };
  state.dbError = false;
});

describe("News client-side completeness", () => {
  it("displays the normal feed when the draft query succeeds", () => {
    const html = renderToStaticMarkup(React.createElement(News));
    expect(html).toContain("Database-only card");
    expect(html).not.toContain("News updates are temporarily unavailable");
  });

  it("shows an accessible error rather than a database-only partial feed on a draft failure", () => {
    state.drafts.isError = true;
    const html = renderToStaticMarkup(React.createElement(News));
    expect(html).toContain('role="alert"');
    expect(html).toContain("News updates are temporarily unavailable. Please try again.");
    expect(html).not.toContain("Database-only card");
    expect(html).not.toContain("No updates found for this category.");
  });

  it("also withholds cached cards when a background draft refresh has failed", () => {
    state.drafts = {
      isLoading: false,
      isError: true,
      data: [{ filename: "2026-11-02-first.md", date: "2026-11-02", title: "Cached card", summary: "", category: "trust_news" }],
    };
    const html = renderToStaticMarkup(React.createElement(News));
    expect(html).toContain('role="alert"');
    expect(html).not.toContain("Cached card");
    expect(html).not.toContain("Database-only card");
  });

  it("does not display a draft-only feed when the database query fails", () => {
    state.dbError = true;
    state.drafts.data = [{ filename: "2026-11-02-first.md", date: "2026-11-02", title: "Draft-only card", summary: "", category: "trust_news" }];
    const html = renderToStaticMarkup(React.createElement(News));
    expect(html).toContain('role="alert"');
    expect(html).not.toContain("Draft-only card");
    expect(html).not.toContain("Database-only card");
  });
});

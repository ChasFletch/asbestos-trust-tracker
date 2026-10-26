import imerysRecordMarkdown from "./research-records/imerys-proposed-trust-record.md?raw";
import imerysSourcesMarkdown from "./research-records/imerys-sources.md?raw";
import imerysStatusMarkdown from "./research-records/imerys-status-note.md?raw";
import whittakerRecordMarkdown from "./research-records/whittaker-estate-record.md?raw";
import whittakerSourcesMarkdown from "./research-records/whittaker-sources.md?raw";
import whittakerStatusMarkdown from "./research-records/whittaker-status-note.md?raw";

export type ResearchRecordSourceFile = {
  label: string;
  href: string;
  sha256: string;
};

export type ResearchRecord = {
  slug: string;
  title: string;
  recordKind: "bankruptcy-estate" | "proposed-trust";
  statusLabel: string;
  statusAsOf: string;
  publishedAt: string;
  sourceCutoffAt: string;
  seoDescription: string;
  keywords: string;
  markdown: string;
  sourceFiles: readonly ResearchRecordSourceFile[];
};

const WCD_SOURCE_FILES = [
  {
    label: "Published record (Markdown)",
    href: "/research-records/whittaker-estate-record.md",
    sha256: "6384e92f7a62e4e78ee1940a15dd684c642ffa1b35f001126ecfe255d63f1f6f",
  },
  {
    label: "Claim-to-source register (Markdown)",
    href: "/research-records/whittaker-sources.md",
    sha256: "7f36e163fff4c857e0d5e32065c21a8f3e3ab4440d217862ba98947f41266788",
  },
  {
    label: "Status note (Markdown)",
    href: "/research-records/whittaker-status-note.md",
    sha256: "853a52aef8e2fe588a71e8b1f3c713b68510d5e0266aa22fe7b8af5725a03746",
  },
] as const;

const IMERYS_SOURCE_FILES = [
  {
    label: "Published record (Markdown)",
    href: "/research-records/imerys-proposed-trust-record.md",
    sha256: "e1f5bfac46de0c0691cdb33f6800aa23cefc7c30b2fdc1fbe5adfc80a129f4d6",
  },
  {
    label: "Claim-to-source register (Markdown)",
    href: "/research-records/imerys-sources.md",
    sha256: "fb90df3a8a269e72f8c7114c73f5eee406f2139626223e711ee916c6aa189c07",
  },
  {
    label: "Status note (Markdown)",
    href: "/research-records/imerys-status-note.md",
    sha256: "032c1fe8206cddf8282188728a58782c43b2d8cc285a75709aa451f671117d50",
  },
] as const;

export const RESEARCH_RECORDS: readonly ResearchRecord[] = [
  {
    slug: "whittaker-clark-daniels-bankruptcy-estate",
    title: "Whittaker, Clark & Daniels, Inc. — bankruptcy estate",
    recordKind: "bankruptcy-estate",
    statusLabel: "Bankruptcy estate — no operating trust",
    statusAsOf: "2026-10-26",
    publishedAt: "2026-10-26",
    sourceCutoffAt: "2026-10-26",
    seoDescription: "A source-linked record of the Whittaker, Clark & Daniels Chapter 11 estate. The reviewed record does not establish an operating asbestos trust, payment percentage, trust assets, or claims portal.",
    keywords: "Whittaker Clark Daniels bankruptcy, WCD asbestos talc bankruptcy, Brenntag estate settlement, proposed asbestos trust, Chapter 11 estate",
    markdown: whittakerRecordMarkdown,
    sourceFiles: WCD_SOURCE_FILES,
  },
  {
    slug: "imerys-talc-america-proposed-trust",
    title: "Imerys Talc America bankruptcy and proposed Talc Personal Injury Trust",
    recordKind: "proposed-trust",
    statusLabel: "Proposed trust / plan pending",
    statusAsOf: "2026-10-26",
    publishedAt: "2026-10-26",
    sourceCutoffAt: "2026-10-26",
    seoDescription: "A source-linked record of the Imerys Talc America bankruptcy and proposed Ivory America / Cyprus Personal Injury Trust. The reviewed materials do not establish an operating trust, payment percentage, current trust balance, or claims process.",
    keywords: "Imerys Talc America bankruptcy, Ivory America Cyprus Personal Injury Trust, proposed asbestos trust, Imerys Chapter 11, talc trust plan",
    markdown: imerysRecordMarkdown,
    sourceFiles: IMERYS_SOURCE_FILES,
  },
] as const;

export const RESEARCH_RECORDS_BY_SLUG: Readonly<Record<string, ResearchRecord>> = Object.fromEntries(
  RESEARCH_RECORDS.map((record) => [record.slug, record]),
);

export function getResearchRecordBySlug(slug: string | undefined): ResearchRecord | undefined {
  return slug ? RESEARCH_RECORDS_BY_SLUG[slug] : undefined;
}

export const RESEARCH_RECORD_SOURCE_TEXT = {
  "whittaker-clark-daniels-bankruptcy-estate": {
    record: whittakerRecordMarkdown,
    sources: whittakerSourcesMarkdown,
    status: whittakerStatusMarkdown,
  },
  "imerys-talc-america-proposed-trust": {
    record: imerysRecordMarkdown,
    sources: imerysSourcesMarkdown,
    status: imerysStatusMarkdown,
  },
} as const;

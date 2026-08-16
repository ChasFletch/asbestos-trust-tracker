import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { figureProvenance } from "../client/src/data/figureProvenance";

const root = process.cwd();
const pageSource = readFileSync(resolve(root, "client/src/pages/FigureProvenance.tsx"), "utf8");
const prefetchSource = readFileSync(resolve(root, "client/src/ssr/prefetch.ts"), "utf8");
const sitemap = readFileSync(resolve(root, "client/public/sitemap.xml"), "utf8");

describe("Public figure provenance timeline", () => {
  it("keeps a dated, source-linked record for every timeline event", () => {
    expect(figureProvenance.length).toBeGreaterThanOrEqual(8);
    expect(figureProvenance.every((entry) => /^2026-\d{2}-\d{2}$/.test(entry.date))).toBe(true);
    expect(figureProvenance.every((entry) => entry.sources.length > 0)).toBe(true);
    expect(figureProvenance.every((entry) => entry.sources.every((source) => Boolean(source.url && source.evidenceClass)))).toBe(true);
  });

  it("renders explicit source labels, evidence classes, and category filters", () => {
    expect(pageSource).toContain("Source trail for");
    expect(pageSource).toContain("evidenceMeta");
    expect(pageSource).toContain("Filter figure revisions");
    expect(pageSource).toContain("Historical source dates and unresolved gaps stay visible");
  });

  it("is indexable with a dedicated SSR route and sitemap entry", () => {
    expect(prefetchSource).toContain('clean === "/provenance"');
    expect(prefetchSource).toContain("Figure Provenance Timeline");
    expect(sitemap).toContain("https://asbestostrusts.org/provenance");
  });
});

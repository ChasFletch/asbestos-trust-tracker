import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { RESEARCH_RECORDS, RESEARCH_RECORD_SOURCE_TEXT, getResearchRecordBySlug } from "../client/src/data/researchRecords";

const root = process.cwd();
const expectedHashes = {
  "whittaker-estate-record.md": "6384e92f7a62e4e78ee1940a15dd684c642ffa1b35f001126ecfe255d63f1f6f",
  "whittaker-sources.md": "7f36e163fff4c857e0d5e32065c21a8f3e3ab4440d217862ba98947f41266788",
  "whittaker-status-note.md": "853a52aef8e2fe588a71e8b1f3c713b68510d5e0266aa22fe7b8af5725a03746",
  "imerys-proposed-trust-record.md": "e1f5bfac46de0c0691cdb33f6800aa23cefc7c30b2fdc1fbe5adfc80a129f4d6",
  "imerys-sources.md": "fb90df3a8a269e72f8c7114c73f5eee406f2139626223e711ee916c6aa189c07",
  "imerys-status-note.md": "032c1fe8206cddf8282188728a58782c43b2d8cc285a75709aa451f671117d50",
} as const;

function sha256(path: string) {
  return createHash("sha256").update(readFileSync(path)).digest("hex");
}

describe("approved Tier 2 non-operating research records", () => {
  it("retains all six CLEO-approved source files exactly in bundled and public source-package paths", () => {
    for (const [name, hash] of Object.entries(expectedHashes)) {
      const bundled = resolve(root, "client/src/data/research-records", name);
      const publicCopy = resolve(root, "client/public/research-records", name);
      expect(sha256(bundled)).toBe(hash);
      expect(sha256(publicCopy)).toBe(hash);
      expect(readFileSync(publicCopy)).toEqual(readFileSync(bundled));
    }
  });

  it("routes both records as non-operating research only and exposes their reviewed source packages", () => {
    expect(RESEARCH_RECORDS.map((record) => record.slug)).toEqual([
      "whittaker-clark-daniels-bankruptcy-estate",
      "imerys-talc-america-proposed-trust",
    ]);
    for (const record of RESEARCH_RECORDS) {
      expect(record.sourceFiles).toHaveLength(3);
      expect(record.seoDescription).toContain("operating");
      for (const source of record.sourceFiles) {
        expect(source.href).toMatch(/^\/research-records\/.+\.md$/);
        expect(source.sha256).toHaveLength(64);
      }
    }
    expect(getResearchRecordBySlug("whittaker-clark-daniels-bankruptcy-estate")?.recordKind).toBe("bankruptcy-estate");
    expect(getResearchRecordBySlug("imerys-talc-america-proposed-trust")?.recordKind).toBe("proposed-trust");
    expect(getResearchRecordBySlug("no-such-record")).toBeUndefined();
    expect(RESEARCH_RECORD_SOURCE_TEXT["whittaker-clark-daniels-bankruptcy-estate"].record).toContain("not an operating asbestos-trust record");
    expect(RESEARCH_RECORD_SOURCE_TEXT["imerys-talc-america-proposed-trust"].record).toContain("no confirmed plan or operating Section 524(g) trust");
    expect(RESEARCH_RECORD_SOURCE_TEXT["whittaker-clark-daniels-bankruptcy-estate"].record).toContain("$535 million Estate Claims Settlement");
    expect(RESEARCH_RECORD_SOURCE_TEXT["imerys-talc-america-proposed-trust"].record).toContain("Ivory America / Cyprus Personal Injury Trust");
  });

  it("keeps the special records out of the operating-trust dataset and makes both canonical routes SSR-addressable", () => {
    const figures = readFileSync(resolve(root, "client/src/data/trust-figures.json"), "utf8");
    const route = readFileSync(resolve(root, "client/src/pages/TrustRecordRoute.tsx"), "utf8");
    const renderer = readFileSync(resolve(root, "client/src/pages/ResearchRecordDetail.tsx"), "utf8");
    const prefetch = readFileSync(resolve(root, "client/src/ssr/prefetch.ts"), "utf8");
    const trustsIndex = readFileSync(resolve(root, "client/src/pages/Trusts.tsx"), "utf8");
    const sitemap = readFileSync(resolve(root, "client/public/sitemap.xml"), "utf8");

    expect(figures).not.toContain('"slug": "whittaker-clark-daniels-bankruptcy-estate"');
    expect(figures).not.toContain('"slug": "imerys-talc-america-proposed-trust"');
    expect(route).toContain("getResearchRecordBySlug(slug)");
    expect(renderer).toContain("This is not an operating trust record.");
    expect(renderer).toContain("No attorney is credited as reviewing this specific record.");
    expect(renderer).toContain("Published source package");
    expect(prefetch).toContain("getResearchRecordBySlug(slug)");
    expect(trustsIndex).toContain("data-non-operating-research-records");
    expect(trustsIndex).toContain("excluded from the table above, the trust counts, payment-percentage summaries, net-asset totals, and cumulative-payment totals");
    expect(sitemap).toContain("https://asbestostrusts.org/trusts/whittaker-clark-daniels-bankruptcy-estate");
    expect(sitemap).toContain("https://asbestostrusts.org/trusts/imerys-talc-america-proposed-trust");
  });
});

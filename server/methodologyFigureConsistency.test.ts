import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import trustFigures from "../client/src/data/trust-figures.json";

const projectRoot = resolve(import.meta.dirname, "..");
const readProjectFile = (relativePath: string) => readFileSync(resolve(projectRoot, relativePath), "utf8");

describe("methodology figure consistency", () => {
  const methodology = readProjectFile("client/src/pages/Methodology.tsx");
  const prefetch = readProjectFile("client/src/ssr/prefetch.ts");
  const llms = readProjectFile("client/public/llms.txt");

  it("publishes the current documented floor and active tracker denominator across reader and crawler content", () => {
    for (const source of [methodology, prefetch, llms]) {
      expect(source).toContain("$16,033,489,279");
      expect(source).toContain("43");
      expect(source).toContain("54 active");
    }

    expect(methodology).toContain("As of September 3, 2026, the documented asset floor is");
    expect(methodology).not.toContain("As of August 29, 2026, the documented asset floor is");
    expect(prefetch).not.toContain("$16,018,528,449");
    expect(llms).not.toContain("$16,018,528,449");
  });

  it("preserves the approximately-60 figure as historical total-established context rather than an active-trust denominator", () => {
    expect(methodology).toContain("historical estimate of trusts established");
    expect(prefetch).toContain("trusts historically established");
    expect(llms).toContain("trusts historically established");
  });

  it("uses distinct canonical fields for active tracker records and the historical total-established estimate", () => {
    expect(trustFigures.aggregate.activeTrustsTracked).toBe(54);
    expect(trustFigures.aggregate.trustsHistoricallyEstablishedEstimated).toBe(60);
    expect((trustFigures.aggregate as Record<string, unknown>).activeTrustsEstimated).toBeUndefined();
    expect(trustFigures.trusts.filter((trust) => trust.status === "active" || trust.status === "active_deferral")).toHaveLength(54);
  });
});

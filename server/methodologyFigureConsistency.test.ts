import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

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
});

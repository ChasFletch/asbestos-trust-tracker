import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const projectRoot = resolve(import.meta.dirname, "..");
const readProjectFile = (relativePath: string) => readFileSync(resolve(projectRoot, relativePath), "utf8");

describe("About-page external tools disclosure", () => {
  it("qualifies the ClimbX promotional-exchange link and explains the relationship", () => {
    const aboutPage = readProjectFile("client/src/pages/About.tsx");

    expect(aboutPage).toContain('href="https://climbx.so/"');
    expect(aboutPage).toContain('rel="sponsored noopener noreferrer"');
    expect(aboutPage).toContain("External Tool Disclosure");
    expect(aboutPage).toContain("disclosed promotional exchange");
    expect(aboutPage).toContain("does not endorse its services");
    expect(aboutPage).toContain("opens in a new tab");
  });

  it("qualifies the Linkos Bio promotional-exchange link and explains the relationship", () => {
    const aboutPage = readProjectFile("client/src/pages/About.tsx");

    expect(aboutPage).toContain('href="https://linkos.bio/?utm_source=asbestostrusts.org&utm_medium=referral&utm_campaign=link_exchange"');
    expect(aboutPage).toContain('rel="sponsored noopener noreferrer"');
    expect(aboutPage).toContain("Linkos Bio");
    expect(aboutPage).toContain("disclosed promotional exchange");
    expect(aboutPage).toContain("opens in a new tab");
    expect(aboutPage).toContain("does not endorse its services");
  });

  it("keeps the promotional-link markup out of trust and report detail content", () => {
    expect(readProjectFile("client/src/pages/TrustDetail.tsx").toLowerCase()).not.toContain("climbx.so");
    expect(readProjectFile("client/src/pages/ReportDetail.tsx").toLowerCase()).not.toContain("climbx.so");
    expect(readProjectFile("client/src/pages/TrustDetail.tsx").toLowerCase()).not.toContain("linkos.bio");
    expect(readProjectFile("client/src/pages/ReportDetail.tsx").toLowerCase()).not.toContain("linkos.bio");
  });
});

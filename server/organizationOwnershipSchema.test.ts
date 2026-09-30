import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const projectRoot = resolve(import.meta.dirname, "..");
const readProjectFile = (relativePath: string) => readFileSync(resolve(projectRoot, relativePath), "utf8");

function organizationGraph() {
  const html = readProjectFile("client/index.html");
  const match = html.match(/<script type="application\/ld\+json">\s*([\s\S]*?)\s*<\/script>/);
  if (!match) throw new Error("Organization JSON-LD script was not found in client/index.html");
  return JSON.parse(match[1]) as { "@graph": Array<Record<string, unknown>> };
}

const byId = (graph: { "@graph": Array<Record<string, unknown>> }, id: string) => {
  const entry = graph["@graph"].find((item) => item["@id"] === id);
  if (!entry) throw new Error(`Schema entry not found: ${id}`);
  return entry;
};

describe("organization ownership schema", () => {
  it("identifies Danziger & De Llano, LLP as the publisher, parent organization, and funder", () => {
    const graph = organizationGraph();
    const firmId = "https://dandell.com";
    const website = byId(graph, "https://asbestostrusts.org/#website");
    const siteOrganization = byId(graph, "https://asbestostrusts.org/#org");
    const dataset = byId(graph, "https://asbestostrusts.org/#dataset");
    const firm = byId(graph, firmId);

    expect(website.publisher).toEqual({ "@id": firmId });
    expect(website.sponsor).toEqual({ "@id": firmId });
    expect(siteOrganization.parentOrganization).toEqual({ "@id": firmId });
    expect(siteOrganization.funder).toEqual({ "@id": firmId });
    expect(dataset.funder).toEqual({ "@id": firmId });
    expect(firm["@type"]).toBe("LegalService");
    expect(firm.name).toBe("Danziger & De Llano, LLP");
    expect(firm.url).toBe("https://dandell.com");
  });

  it("keeps dandell.com out of the AsbestosTrusts.org sameAs list", () => {
    const graph = organizationGraph();
    const siteOrganization = byId(graph, "https://asbestostrusts.org/#org");
    expect(siteOrganization.sameAs).toEqual([
      "https://asbestosatlas.org",
      "https://wikimesothelioma.com",
    ]);
    expect(siteOrganization.sameAs).not.toContain("https://dandell.com");
  });

  it("retains only the approved firm destination in the visible footer", () => {
    const footer = readProjectFile("client/src/components/SiteFooter.tsx");
    expect((footer.match(/https:\/\/dandell\.com/g) ?? []).length).toBe(2);
    expect(footer).not.toContain("https://danziger.com");
  });
});

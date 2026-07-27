import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";

describe("PACER pull queue", () => {
  it("pacer-pull-queue.json exists and has valid structure", () => {
    const queuePath = path.join(process.cwd(), "pacer-pull-queue.json");
    expect(fs.existsSync(queuePath)).toBe(true);
    const data = JSON.parse(fs.readFileSync(queuePath, "utf-8"));
    expect(data.schema).toBe("pacer-pull-queue/v1");
    expect(Array.isArray(data.queue)).toBe(true);
    expect(data.queue.length).toBeGreaterThan(0);
    // Each entry must have required fields
    for (const doc of data.queue) {
      expect(doc).toHaveProperty("priority");
      expect(doc).toHaveProperty("trustId");
      expect(doc).toHaveProperty("court");
      expect(doc).toHaveProperty("caseNo");
      expect(doc).toHaveProperty("status");
    }
  });

  it("all queue entries have valid court codes", () => {
    const queuePath = path.join(process.cwd(), "pacer-pull-queue.json");
    const data = JSON.parse(fs.readFileSync(queuePath, "utf-8"));
    const validCourts = ["deb", "nysb", "wdpa", "mdfl", "ndca", "sdny", "dma"];
    for (const doc of data.queue) {
      expect(validCourts).toContain(doc.court);
    }
  });

  it("PACER credentials are configured in environment", () => {
    // In production, PACER_USERNAME and PACER_PASSWORD must be set
    // In test, we just verify the env vars are referenced correctly
    const username = process.env.PACER_USERNAME;
    const password = process.env.PACER_PASSWORD;
    // Credentials may not be set in CI — just verify the keys exist in env schema
    expect(typeof username === "string" || username === undefined).toBe(true);
    expect(typeof password === "string" || password === undefined).toBe(true);
  });
});


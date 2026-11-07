import { afterEach, describe, expect, it, vi } from "vitest";
import { loadNewsDrafts } from "../shared/newsDrafts";

afterEach(() => vi.unstubAllGlobals());

describe("News draft API response completeness", () => {
  it.each([{}, { drafts: null }, { drafts: {} }, { drafts: [null] }, { drafts: [{ filename: "missing-fields.md" }] }])(
    "rejects a malformed successful response %# instead of returning an empty or partial feed",
    async (body) => {
      vi.stubGlobal("fetch", vi.fn(async () => Response.json(body)));
      await expect(loadNewsDrafts()).rejects.toThrow("Invalid News draft response");
    },
  );

  it("accepts an explicitly successful empty array", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => Response.json({ drafts: [] })));
    await expect(loadNewsDrafts()).resolves.toEqual([]);
  });

  it("accepts a valid complete card", async () => {
    const card = { filename: "2026-11-02-first.md", date: "2026-11-02", title: "First", summary: "First card.", category: "system_update" };
    vi.stubGlobal("fetch", vi.fn(async () => Response.json({ drafts: [card] })));
    await expect(loadNewsDrafts()).resolves.toEqual([card]);
  });
});

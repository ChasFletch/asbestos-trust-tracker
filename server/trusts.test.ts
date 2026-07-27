import { describe, expect, it, vi, beforeEach } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

// Mock the DB module so tests don't need a real database
vi.mock("./db", () => ({
  getDb: vi.fn().mockResolvedValue(null),
  getAllTrusts: vi.fn().mockResolvedValue([
    {
      id: "manville",
      name: "Manville Personal Injury Settlement Trust",
      parentCompany: "Johns-Manville Corporation",
      administrator: "Manville Trust",
      court: "S.D.N.Y.",
      docketNumber: "82-11656",
      paymentPct: 5.1,
      paymentPctEffective: "2021-02-01",
      netAssets: 539264338,
      netAssetsAsOf: "2026-03-31",
      netAssetsSource: "a",
      netAssetsCitation: "S.D.N.Y. Doc 4479, filed April 27, 2026",
      direction: "stable",
      reportingFrequency: "quarterly",
      isStale: false,
      notes: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]),
  getTrustById: vi.fn().mockResolvedValue(null),
  getPaymentHistoryForTrust: vi.fn().mockResolvedValue([]),
  getAllPaymentHistory: vi.fn().mockResolvedValue([]),
  getCurrentAggregate: vi.fn().mockResolvedValue(null),
  getVisibleNews: vi.fn().mockResolvedValue([]),
  upsertUser: vi.fn(),
  getUserByOpenId: vi.fn().mockResolvedValue(null),
  updateTrust: vi.fn().mockResolvedValue(undefined),
  upsertTrustFromPipeline: vi.fn().mockResolvedValue(undefined),
  addPaymentHistoryEntry: vi.fn().mockResolvedValue(undefined),
  updateAggregate: vi.fn().mockResolvedValue(undefined),
  addNewsItem: vi.fn().mockResolvedValue(undefined),
  markTrustStale: vi.fn().mockResolvedValue(undefined),
}));

function makePublicCtx(): TrpcContext {
  return {
    user: null,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: { clearCookie: vi.fn() } as unknown as TrpcContext["res"],
  };
}

function makeAdminCtx(): TrpcContext {
  return {
    user: {
      id: 1,
      openId: "admin-user",
      email: "admin@example.com",
      name: "Admin",
      loginMethod: "manus",
      role: "admin",
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    },
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: { clearCookie: vi.fn() } as unknown as TrpcContext["res"],
  };
}

describe("trusts.list", () => {
  it("returns trust list for public users", async () => {
    const caller = appRouter.createCaller(makePublicCtx());
    const result = await caller.trusts.list();
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThan(0);
    expect(result[0]).toHaveProperty("id");
    expect(result[0]).toHaveProperty("paymentPct");
  });
});

describe("news.list", () => {
  it("returns news items for public users", async () => {
    const caller = appRouter.createCaller(makePublicCtx());
    const result = await caller.news.list();
    expect(Array.isArray(result)).toBe(true);
  });
});

describe("admin.updateTrust", () => {
  it("rejects non-admin users with FORBIDDEN", async () => {
    const caller = appRouter.createCaller(makePublicCtx());
    await expect(
      caller.admin.updateTrust({ id: "manville", paymentPct: 6.0 })
    ).rejects.toMatchObject({ code: "UNAUTHORIZED" });
  });
});

import { bigint, boolean, float, int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

// ── Users (auth) ──────────────────────────────────────────────────────────────
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});
export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// ── Trust Funds ───────────────────────────────────────────────────────────────
export const trusts = mysqlTable("trusts", {
  id: varchar("id", { length: 64 }).primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  shortName: varchar("shortName", { length: 100 }),
  company: varchar("company", { length: 255 }),
  established: int("established"),
  administrator: varchar("administrator", { length: 100 }),
  court: varchar("court", { length: 100 }),
  docket: varchar("docket", { length: 100 }),
  website: varchar("website", { length: 255 }),
  paymentPct: float("paymentPct"),
  paymentPctEffective: varchar("paymentPctEffective", { length: 20 }),
  netAssets: bigint("netAssets", { mode: "number" }),
  netAssetsAsOf: varchar("netAssetsAsOf", { length: 20 }),
  netAssetsSource: mysqlEnum("netAssetsSource", ["a", "b", "c"]),
  netAssetsCitation: text("netAssetsCitation"),
  cumulativePaid: bigint("cumulativePaid", { mode: "number" }),
  cumulativeClaims: int("cumulativeClaims"),
  reportingFrequency: mysqlEnum("reportingFrequency", ["quarterly", "annual", "unknown"]).default("annual"),
  status: mysqlEnum("status", ["active", "inactive", "closed"]).default("active"),
  direction: mysqlEnum("direction", ["up", "down", "stable"]).default("stable"),
  notes: text("notes"),
  isStale: boolean("isStale").default(false),
  lastChecked: timestamp("lastChecked"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});
export type Trust = typeof trusts.$inferSelect;
export type InsertTrust = typeof trusts.$inferInsert;

// ── Payment Percentage History ────────────────────────────────────────────────
export const paymentHistory = mysqlTable("payment_history", {
  id: int("id").autoincrement().primaryKey(),
  trustId: varchar("trustId", { length: 64 }).notNull(),
  pct: float("pct").notNull(),
  effective: varchar("effective", { length: 20 }).notNull(),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});
export type PaymentHistory = typeof paymentHistory.$inferSelect;
export type InsertPaymentHistory = typeof paymentHistory.$inferInsert;

// ── Aggregate Snapshots ───────────────────────────────────────────────────────
export const aggregateSnapshots = mysqlTable("aggregate_snapshots", {
  id: int("id").autoincrement().primaryKey(),
  remainingLow: bigint("remainingLow", { mode: "number" }).notNull(),
  remainingHigh: bigint("remainingHigh", { mode: "number" }).notNull(),
  remainingLabel: varchar("remainingLabel", { length: 50 }).notNull(),
  paidOut: bigint("paidOut", { mode: "number" }).notNull(),
  paidOutLabel: varchar("paidOutLabel", { length: 50 }).notNull(),
  totalActiveTrusts: int("totalActiveTrusts").notNull(),
  methodology: text("methodology"),
  asOfNote: text("asOfNote"),
  isCurrent: boolean("isCurrent").default(false).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});
export type AggregateSnapshot = typeof aggregateSnapshots.$inferSelect;
export type InsertAggregateSnapshot = typeof aggregateSnapshots.$inferInsert;

// ── News Items ────────────────────────────────────────────────────────────────
export const newsItems = mysqlTable("news_items", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 500 }).notNull(),
  summary: text("summary"),
  url: varchar("url", { length: 1000 }),
  source: varchar("source", { length: 255 }),
  publishedAt: timestamp("publishedAt"),
  trustId: varchar("trustId", { length: 64 }),
  category: mysqlEnum("category", ["payment_change", "annual_report", "court_filing", "research", "general"]).default("general"),
  isVisible: boolean("isVisible").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});
export type NewsItem = typeof newsItems.$inferSelect;
export type InsertNewsItem = typeof newsItems.$inferInsert;

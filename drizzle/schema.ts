import { bigint, boolean, float, int, index, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

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

// ── Living Tracker Operations Pilot ──────────────────────────────────────────
// These records are intentionally internal. They create a durable audit trail
// for source checks and release decisions without exposing candidate findings as
// public facts before the documented editorial and technical gates have passed.
export const operationsPilots = mysqlTable("operations_pilots", {
  id: varchar("id", { length: 64 }).primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  status: mysqlEnum("status", ["active", "completed", "paused"]).default("active").notNull(),
  startDate: varchar("startDate", { length: 10 }).notNull(),
  endDate: varchar("endDate", { length: 10 }).notNull(),
  timezone: varchar("timezone", { length: 64 }).notNull(),
  scope: text("scope").notNull(),
  publicationAuthority: text("publicationAuthority").notNull(),
  researchOwner: varchar("researchOwner", { length: 255 }).notNull(),
  researchBackupOwner: varchar("researchBackupOwner", { length: 255 }).notNull(),
  editorialOwner: varchar("editorialOwner", { length: 255 }).notNull(),
  editorialBackupOwner: varchar("editorialBackupOwner", { length: 255 }).notNull(),
  releaseOwner: varchar("releaseOwner", { length: 255 }).notNull(),
  releaseBackupOwner: varchar("releaseBackupOwner", { length: 255 }).notNull(),
  articleReviewPolicy: text("articleReviewPolicy").notNull(),
  researchLimits: text("researchLimits").notNull(),
  usageLimits: text("usageLimits").notNull(),
  digestDestination: varchar("digestDestination", { length: 64 }).notNull(),
  noChargePacer: boolean("noChargePacer").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});
export type OperationsPilot = typeof operationsPilots.$inferSelect;
export type InsertOperationsPilot = typeof operationsPilots.$inferInsert;

export const sourceRegistry = mysqlTable("source_registry", {
  id: varchar("id", { length: 128 }).primaryKey(),
  pilotId: varchar("pilotId", { length: 64 }).notNull(),
  trustSlug: varchar("trustSlug", { length: 255 }),
  trustName: varchar("trustName", { length: 255 }),
  sourceUrl: varchar("sourceUrl", { length: 2048 }).notNull(),
  sourceClass: mysqlEnum("sourceClass", ["official_trust", "administrator", "case_agent", "court", "government", "primary_document"]).notNull(),
  factClasses: text("factClasses").notNull(),
  checkCadence: mysqlEnum("checkCadence", ["daily", "weekly"]).default("weekly").notNull(),
  priority: int("priority").default(2).notNull(),
  retrievalNotes: text("retrievalNotes"),
  isActive: boolean("isActive").default(true).notNull(),
  lastSuccessfulCheckAt: timestamp("lastSuccessfulCheckAt"),
  lastCheckedAt: timestamp("lastCheckedAt"),
  nextCheckAt: timestamp("nextCheckAt"),
  lastStatusCode: int("lastStatusCode"),
  contentHash: varchar("contentHash", { length: 64 }),
  failureCount: int("failureCount").default(0).notNull(),
  lastError: text("lastError"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => [
  index("source_registry_pilot_next_idx").on(table.pilotId, table.nextCheckAt),
  index("source_registry_pilot_trust_idx").on(table.pilotId, table.trustSlug),
]);
export type SourceRegistryRecord = typeof sourceRegistry.$inferSelect;
export type InsertSourceRegistryRecord = typeof sourceRegistry.$inferInsert;

export const operationsCandidates = mysqlTable("operations_candidates", {
  id: varchar("id", { length: 64 }).primaryKey(),
  pilotId: varchar("pilotId", { length: 64 }).notNull(),
  sourceRegistryId: varchar("sourceRegistryId", { length: 128 }),
  trustSlug: varchar("trustSlug", { length: 255 }),
  sourceUrl: varchar("sourceUrl", { length: 2048 }).notNull(),
  changeType: mysqlEnum("changeType", ["source_changed", "source_inaccessible", "payment_notice", "financial_report", "claims_procedure", "trust_status", "court_development", "article_lead", "controlled_test"]).notNull(),
  severity: mysqlEnum("severity", ["routine", "material", "urgent"]).default("routine").notNull(),
  status: mysqlEnum("status", ["detected", "under_review", "verified", "released", "rejected", "blocked"]).default("detected").notNull(),
  detectedAt: timestamp("detectedAt").defaultNow().notNull(),
  observedAt: timestamp("observedAt"),
  evidence: text("evidence").notNull(),
  assignedOwner: varchar("assignedOwner", { length: 255 }).notNull(),
  nextAction: text("nextAction").notNull(),
  disposition: text("disposition"),
  reviewedAt: timestamp("reviewedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => [
  index("operations_candidates_pilot_status_idx").on(table.pilotId, table.status),
  index("operations_candidates_source_idx").on(table.sourceRegistryId, table.detectedAt),
]);
export type OperationsCandidate = typeof operationsCandidates.$inferSelect;
export type InsertOperationsCandidate = typeof operationsCandidates.$inferInsert;

export const operationsReleases = mysqlTable("operations_releases", {
  id: varchar("id", { length: 64 }).primaryKey(),
  pilotId: varchar("pilotId", { length: 64 }).notNull(),
  candidateId: varchar("candidateId", { length: 64 }),
  releaseType: mysqlEnum("releaseType", ["tracker_update", "news_brief", "analysis", "correction", "no_publication"]).notNull(),
  status: mysqlEnum("status", ["prepared", "published", "blocked", "rolled_back"]).notNull(),
  sourceCutoffAt: timestamp("sourceCutoffAt"),
  evidenceSummary: text("evidenceSummary").notNull(),
  articleSpecificReviewJson: text("articleSpecificReviewJson"),
  technicalVerification: text("technicalVerification").notNull(),
  publishedVersion: varchar("publishedVersion", { length: 128 }),
  publishedAt: timestamp("publishedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => [
  index("operations_releases_pilot_status_idx").on(table.pilotId, table.status),
  index("operations_releases_candidate_idx").on(table.candidateId),
]);
export type OperationsRelease = typeof operationsReleases.$inferSelect;
export type InsertOperationsRelease = typeof operationsReleases.$inferInsert;

export const operationsRuns = mysqlTable("operations_runs", {
  id: varchar("id", { length: 64 }).primaryKey(),
  pilotId: varchar("pilotId", { length: 64 }).notNull(),
  runType: mysqlEnum("runType", ["daily_detection", "weekly_coverage", "weekly_digest", "monthly_research_prep", "quarterly_audit_prep", "controlled_test"]).notNull(),
  scheduledFor: timestamp("scheduledFor"),
  startedAt: timestamp("startedAt").defaultNow().notNull(),
  completedAt: timestamp("completedAt"),
  status: mysqlEnum("status", ["running", "success", "partial", "failed", "skipped"]).default("running").notNull(),
  sourceCount: int("sourceCount").default(0).notNull(),
  checkedCount: int("checkedCount").default(0).notNull(),
  changedCount: int("changedCount").default(0).notNull(),
  failedCount: int("failedCount").default(0).notNull(),
  candidateCount: int("candidateCount").default(0).notNull(),
  resultSummary: text("resultSummary").notNull(),
  resultJson: text("resultJson").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, (table) => [
  index("operations_runs_pilot_type_started_idx").on(table.pilotId, table.runType, table.startedAt),
]);
export type OperationsRun = typeof operationsRuns.$inferSelect;
export type InsertOperationsRun = typeof operationsRuns.$inferInsert;

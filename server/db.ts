import { and, desc, eq, or, like } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { aggregateSnapshots, InsertUser, newsItems, paymentHistory, trusts, users } from "../drizzle/schema";
import { ENV } from "./_core/env";

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) throw new Error("User openId is required for upsert");
  const db = await getDb();
  if (!db) return;
  try {
    const values: InsertUser = { openId: user.openId };
    const updateSet: Record<string, unknown> = {};
    const textFields = ["name", "email", "loginMethod"] as const;
    for (const field of textFields) {
      const value = user[field];
      if (value === undefined) continue;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    }
    if (user.lastSignedIn !== undefined) { values.lastSignedIn = user.lastSignedIn; updateSet.lastSignedIn = user.lastSignedIn; }
    if (user.role !== undefined) { values.role = user.role; updateSet.role = user.role; }
    else if (user.openId === ENV.ownerOpenId) { values.role = "admin"; updateSet.role = "admin"; }
    if (!values.lastSignedIn) values.lastSignedIn = new Date();
    if (Object.keys(updateSet).length === 0) updateSet.lastSignedIn = new Date();
    await db.insert(users).values(values).onDuplicateKeyUpdate({ set: updateSet });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

// ── Trust queries ─────────────────────────────────────────────────────────────

export async function getAllTrusts() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(trusts).orderBy(trusts.name);
}

export async function getTrustById(id: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(trusts).where(eq(trusts.id, id)).limit(1);
  return result[0] ?? undefined;
}

// Slugify helper (mirrors client-side slugify in Trusts.tsx)
function slugify(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

// Find a trust by its DB id OR by slugified name (for URL routing)
export async function getTrustBySlug(slug: string) {
  const db = await getDb();
  if (!db) return undefined;
  // First try direct ID match
  const byId = await db.select().from(trusts).where(eq(trusts.id, slug)).limit(1);
  if (byId[0]) return byId[0];
  // Fall back to scanning all trusts and matching by slugified name
  const all = await db.select().from(trusts);
  return all.find(t => slugify(t.name) === slug || (t.shortName && slugify(t.shortName) === slug));
}

export async function getPaymentHistoryForTrust(trustId: string) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(paymentHistory).where(eq(paymentHistory.trustId, trustId)).orderBy(paymentHistory.effective);
}

export async function getAllPaymentHistory() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(paymentHistory).orderBy(paymentHistory.trustId, paymentHistory.effective);
}

// ── Aggregate queries ─────────────────────────────────────────────────────────

export async function getCurrentAggregate() {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(aggregateSnapshots).where(eq(aggregateSnapshots.isCurrent, true)).limit(1);
  return result[0];
}

// ── News queries ──────────────────────────────────────────────────────────────

export const BW_HOMEPAGE_NEWS_ID = 1;
export const BW_OBSOLETE_RECENCY_SUMMARY = "The B&W Asbestos Settlement Trust issued a payment percentage change notice reducing its rate from 4.7% to 4.3%, effective June 30, 2026. This is the most recent payment percentage change in the entire asbestos trust system.";
export const BW_CORRECTED_SUMMARY = "The B&W Asbestos Settlement Trust issued a payment percentage change notice reducing its rate from 4.7% to 4.3%, effective June 30, 2026.";
export const APG_ARCHIVE_NEWS_ID = 5;
export const APG_OBSOLETE_TITLE = "APG Asbestos Trust Raises Payment Percentage to 6.0% — Effective June 2026";
export const APG_OBSOLETE_SUMMARY = "The APG Asbestos Trust increased its payment percentage from 5.3% to 6.0%, effective June 2026, making it one of the very few active trusts to increase its payment percentage in 2025–2026.";
export const APG_CORRECTED_TITLE = "APG Asbestos Trust Raises Payment Percentage to 6.0% — Effective April 13, 2026";
export const APG_CORRECTED_SUMMARY = "The APG Asbestos Trust increased its payment percentage from 5.3% to 6.0%, effective April 13, 2026.";
export const APG_CORRECTED_SOURCE = "APG Asbestos Trust Notice of Payment Percentage Increase (April 13, 2026)";
export const NARCO_ARCHIVE_NEWS_ID = 4;
export const NARCO_OBSOLETE_TITLE = "Honeywell Contributes $1.325 Billion to NARCO Trust — Correcting Widespread Stale Data";
export const NARCO_OBSOLETE_SUMMARY = "In January 2023, Honeywell International contributed $1.325 billion to the NARCO Asbestos Trust. Most trust directories still show the pre-2023 balance of $280.7 million — a figure that is now more than three years out of date.";
export const NARCO_CORRECTED_TITLE = "Honeywell Pays $1.327 Billion to NARCO Trust at January 2023 Buyout Closing";
export const NARCO_CORRECTED_SUMMARY = "On January 30, 2023, Honeywell paid $1,327,153,783 to the NARCO Asbestos Trust in connection with the closing of the amended buyout agreement. The Trust's FY2022 financial statements separately reported $280,710,185 in net claimants' equity as of December 31, 2022; that historical balance is not a current balance.";
export const NARCO_CORRECTED_SOURCE = "NARCO Asbestos Trust, Notice of Closing on NARCO Asbestos Trust Amended Buyout Agreement (January 30, 2023)";

export function shouldCorrectBAndWHomepageSummary(item: { id: number; summary: string | null }) {
  return item.id === BW_HOMEPAGE_NEWS_ID && item.summary === BW_OBSOLETE_RECENCY_SUMMARY;
}

export function shouldCorrectApgArchiveRecord(item: { id: number; title: string; summary: string | null }) {
  return item.id === APG_ARCHIVE_NEWS_ID
    && item.title === APG_OBSOLETE_TITLE
    && item.summary === APG_OBSOLETE_SUMMARY;
}

export function shouldCorrectNarcoArchiveRecord(item: { id: number; title: string; summary: string | null }) {
  return item.id === NARCO_ARCHIVE_NEWS_ID
    && item.title === NARCO_OBSOLETE_TITLE
    && item.summary === NARCO_OBSOLETE_SUMMARY;
}

async function correctBAndWHomepageSummary(db: NonNullable<Awaited<ReturnType<typeof getDb>>>) {
  // This exact-match migration repairs the legacy production seed without
  // touching any other news row or overwriting a later editorial update.
  await db.update(newsItems)
    .set({ summary: BW_CORRECTED_SUMMARY })
    .where(and(
      eq(newsItems.id, BW_HOMEPAGE_NEWS_ID),
      eq(newsItems.summary, BW_OBSOLETE_RECENCY_SUMMARY),
    ));
}

async function correctApgAndNarcoArchiveRecords(db: NonNullable<Awaited<ReturnType<typeof getDb>>>) {
  // Each correction is limited to its documented legacy row and exact legacy
  // wording so a subsequent editorial revision is never overwritten.
  await db.update(newsItems)
    .set({
      title: APG_CORRECTED_TITLE,
      summary: APG_CORRECTED_SUMMARY,
      source: APG_CORRECTED_SOURCE,
      publishedAt: new Date("2026-04-13T12:00:00.000Z"),
    })
    .where(and(
      eq(newsItems.id, APG_ARCHIVE_NEWS_ID),
      eq(newsItems.title, APG_OBSOLETE_TITLE),
      eq(newsItems.summary, APG_OBSOLETE_SUMMARY),
    ));

  await db.update(newsItems)
    .set({
      title: NARCO_CORRECTED_TITLE,
      summary: NARCO_CORRECTED_SUMMARY,
      source: NARCO_CORRECTED_SOURCE,
      publishedAt: new Date("2023-01-30T12:00:00.000Z"),
    })
    .where(and(
      eq(newsItems.id, NARCO_ARCHIVE_NEWS_ID),
      eq(newsItems.title, NARCO_OBSOLETE_TITLE),
      eq(newsItems.summary, NARCO_OBSOLETE_SUMMARY),
    ));
}

export async function getVisibleNews(limit = 20, category?: string) {
  const db = await getDb();
  if (!db) return [];
  await correctBAndWHomepageSummary(db);
  await correctApgAndNarcoArchiveRecords(db);
  const conditions = [eq(newsItems.isVisible, true)];
  if (category) conditions.push(eq(newsItems.category, category as any));
  return db.select().from(newsItems)
    .where(conditions.length === 1 ? conditions[0] : and(...conditions))
    .orderBy(desc(newsItems.publishedAt))
    .limit(limit);
}

export async function getNewsByTrust(trustId: string, trustName: string, limit = 5) {
  const db = await getDb();
  if (!db) return [];
  // Match by trustId or by trust name appearing in the title/summary
  const nameWords = trustName.replace(/\(.*?\)/g, "").trim().split(/\s+/).filter(w => w.length > 3);
  const conditions = [
    eq(newsItems.isVisible, true),
    or(
      eq(newsItems.trustId, trustId),
      ...nameWords.slice(0, 3).map(w => like(newsItems.title, `%${w}%`))
    )!,
  ];
  return db.select().from(newsItems)
    .where(and(...conditions))
    .orderBy(desc(newsItems.publishedAt))
    .limit(limit);
}

// ── Admin mutations ───────────────────────────────────────────────────────────

export async function updateTrust(id: string, data: Partial<typeof trusts.$inferInsert>) {
  const db = await getDb();
  if (!db) throw new Error("DB not available");
  await db.update(trusts).set(data).where(eq(trusts.id, id));
}

export async function upsertTrustFromPipeline(data: typeof trusts.$inferInsert) {
  const db = await getDb();
  if (!db) throw new Error("DB not available");
  await db.insert(trusts).values(data).onDuplicateKeyUpdate({ set: data });
}

export async function addPaymentHistoryEntry(entry: typeof paymentHistory.$inferInsert) {
  const db = await getDb();
  if (!db) throw new Error("DB not available");
  await db.insert(paymentHistory).values(entry);
}

export async function updateAggregate(data: typeof aggregateSnapshots.$inferInsert) {
  const db = await getDb();
  if (!db) throw new Error("DB not available");
  // Unset current
  await db.update(aggregateSnapshots).set({ isCurrent: false }).where(eq(aggregateSnapshots.isCurrent, true));
  await db.insert(aggregateSnapshots).values({ ...data, isCurrent: true });
}

export async function addNewsItem(item: typeof newsItems.$inferInsert) {
  const db = await getDb();
  if (!db) throw new Error("DB not available");
  await db.insert(newsItems).values(item);
}

export async function markTrustStale(id: string, isStale: boolean) {
  const db = await getDb();
  if (!db) throw new Error("DB not available");
  await db.update(trusts).set({ isStale, lastChecked: new Date() }).where(eq(trusts.id, id));
}

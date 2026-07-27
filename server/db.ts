import { and, desc, eq } from "drizzle-orm";
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
  return result[0];
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

export async function getVisibleNews(limit = 20, category?: string) {
  const db = await getDb();
  if (!db) return [];
  const conditions = [eq(newsItems.isVisible, true)];
  if (category) conditions.push(eq(newsItems.category, category as any));
  return db.select().from(newsItems)
    .where(conditions.length === 1 ? conditions[0] : and(...conditions))
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

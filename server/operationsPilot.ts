import { createHash } from "node:crypto";
import type { Request, Response } from "express";
import { asc, eq } from "drizzle-orm";
import { nanoid } from "nanoid";
import { fetchTrustFigures } from "./dataRoutes";
import { getDb } from "./db";
import { notifyOwner } from "./_core/notification";
import { sdk } from "./_core/sdk";
import { operationsCandidates, operationsPilots, operationsRuns, sourceRegistry } from "../drizzle/schema";

export const LIVING_TRACKER_PILOT_ID = "asbestostrusts-living-tracker-2026-09";
export const LIVING_TRACKER_PILOT = {
  id: LIVING_TRACKER_PILOT_ID,
  name: "AsbestosTrusts 30-day hybrid living-tracker pilot",
  startDate: "2026-09-06",
  endDate: "2026-10-05",
  timezone: "America/Chicago",
  scope: "AsbestosTrusts.org research-desk work only: U.S. asbestos bankruptcy trusts, trust formation, claims procedures, annual financial results, significant court developments, and public explainers. Excludes ads, other websites, individualized legal advice, and new firm positions.",
  publicationAuthority: "Routine source-verified tracker updates and news publication may proceed after documented editorial and technical checks. Unreviewed automatic publication is prohibited.",
  researchOwner: "Manus Research Desk",
  researchBackupOwner: "RON — independent verifier",
  editorialOwner: "Manus Research Desk",
  editorialBackupOwner: "RON — independent verifier",
  releaseOwner: "Manus project release operator",
  releaseBackupOwner: "RON — independent verifier",
  articleReviewPolicy: "Paul Danziger or Rod De Llano may be credited only when an article-specific review actually occurred and the release record contains the reviewer, review scope, and review date. Designation or standing affiliation is not article-specific review evidence.",
  researchLimits: "Daily detection: at most 25 sources and 12 minutes. Weekday candidate triage: at most 3 material candidates and 25 minutes. One material rate/status candidate: 30 minutes, extendable once to 60 minutes only when a controlling source is identified but requires reconciliation. Monthly research: the 5 highest-priority gaps plus 1 analysis topic, 3 hours total. Quarterly preparation: 8 hours total against a declared source cutoff. Stop at each cap, record the blocker and owner, and do not repeatedly escalate routine work to Charles.",
  usageLimits: "No PACER purchases, no paid records, no paid external data/API use, and no expansion beyond the registered source list without a recorded source-registry decision. Research sessions use the stated time and source caps; no separate paid allowance is authorized.",
  digestDestination: "existing_project_queue",
  noChargePacer: true,
} as const;

export type PilotRunType = "daily_detection" | "weekly_coverage" | "weekly_digest" | "monthly_research_prep" | "quarterly_audit_prep" | "controlled_test";

type TrackerTrust = {
  name?: unknown;
  slug?: unknown;
  website?: unknown;
  paymentPercentageSourceUrl?: unknown;
  paymentPctSourceUrl?: unknown;
  paymentPctNoticeUrl?: unknown;
  paymentPctNoticePublishedAt?: unknown;
  netAssetsSourceUrl?: unknown;
};

type TrackerPayload = { trusts?: unknown[] };

function slugify(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function valueString(value: unknown) {
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

function sourceClassForUrl(url: string): "official_trust" | "administrator" | "case_agent" | "court" | "government" | "primary_document" {
  if (/claimsres|verus|eclaim|trustservices/i.test(url)) return "administrator";
  if (/veritaglobal|omniagent|kroll|stretto/i.test(url)) return "case_agent";
  if (/courtlistener|uscourts|ecf|pacer/i.test(url)) return "court";
  if (/\.gov\//i.test(url)) return "government";
  if (/\.pdf(?:$|[?#])/i.test(url)) return "primary_document";
  return "official_trust";
}

function bestSourceUrl(trust: TrackerTrust) {
  const candidates = [
    trust.paymentPercentageSourceUrl,
    trust.paymentPctSourceUrl,
    trust.paymentPctNoticeUrl,
    trust.website,
    trust.netAssetsSourceUrl,
  ];
  return candidates.map(valueString).find((value) => value?.startsWith("http"));
}

export function registrySeedFromTracker(data: unknown) {
  const trustList = (data as TrackerPayload).trusts;
  const trusts: unknown[] = Array.isArray(trustList) ? trustList : [];
  const registered = new Map<string, {
    id: string;
    trustSlug: string;
    trustName: string;
    sourceUrl: string;
    sourceClass: ReturnType<typeof sourceClassForUrl>;
    checkCadence: "daily" | "weekly";
    priority: number;
  }>();
  const sourceGaps: Array<{ trustSlug: string; trustName: string }> = [];

  for (const value of trusts) {
    const trust = value as TrackerTrust;
    const trustName = valueString(trust.name);
    if (!trustName) continue;
    const trustSlug = valueString(trust.slug) ?? slugify(trustName);
    const sourceUrl = bestSourceUrl(trust);
    if (!sourceUrl) {
      sourceGaps.push({ trustSlug, trustName });
      continue;
    }
    const isManville = trustSlug === "manville-personal-injury-settlement-trust";
    registered.set(`${trustSlug}:${sourceUrl}`, {
      id: `source-${trustSlug}-${createHash("sha256").update(sourceUrl).digest("hex").slice(0, 12)}`,
      trustSlug,
      trustName,
      sourceUrl,
      sourceClass: sourceClassForUrl(sourceUrl),
      checkCadence: isManville ? "daily" : "weekly",
      priority: isManville ? 1 : 2,
    });
  }

  // Manville's official announcement feed is a distinct source from the
  // individual notice and remains a daily high-priority check.
  const manvilleFeed = "https://www.claimsres.com/category/manville/feed/";
  registered.set("manville-official-feed", {
    id: "source-manville-official-announcement-feed",
    trustSlug: "manville-personal-injury-settlement-trust",
    trustName: "Manville Personal Injury Settlement Trust",
    sourceUrl: manvilleFeed,
    sourceClass: "administrator",
    checkCadence: "daily",
    priority: 1,
  });

  return { registered: Array.from(registered.values()), sourceGaps };
}

export function pilotIsActive(now = new Date()) {
  const date = new Intl.DateTimeFormat("en-CA", { timeZone: LIVING_TRACKER_PILOT.timezone }).format(now);
  return date >= LIVING_TRACKER_PILOT.startDate && date <= LIVING_TRACKER_PILOT.endDate;
}

function safeJson(value: unknown) {
  return JSON.stringify(value, null, 2);
}

async function ensurePilotAndRegistry() {
  const db = await getDb();
  if (!db) throw new Error("DB not available");
  const now = new Date();
  await db.insert(operationsPilots).values(LIVING_TRACKER_PILOT).onDuplicateKeyUpdate({
    set: {
      endDate: LIVING_TRACKER_PILOT.endDate,
      articleReviewPolicy: LIVING_TRACKER_PILOT.articleReviewPolicy,
      researchLimits: LIVING_TRACKER_PILOT.researchLimits,
      usageLimits: LIVING_TRACKER_PILOT.usageLimits,
      updatedAt: now,
    },
  });

  const sourceData = await fetchTrustFigures();
  const seed = registrySeedFromTracker(sourceData);
  for (const record of seed.registered) {
    await db.insert(sourceRegistry).values({
      ...record,
      pilotId: LIVING_TRACKER_PILOT_ID,
      factClasses: "payment_percentage,claims_procedure,trust_status,financial_reporting,court_development",
      retrievalNotes: "Use only lawful public access methods. Record access limitations rather than inferring no change.",
      nextCheckAt: now,
    }).onDuplicateKeyUpdate({
      set: {
        sourceUrl: record.sourceUrl,
        sourceClass: record.sourceClass,
        checkCadence: record.checkCadence,
        priority: record.priority,
        isActive: true,
      },
    });
  }
  for (const gap of seed.sourceGaps) {
    const candidateId = `source-gap-${gap.trustSlug}`;
    await db.insert(operationsCandidates).values({
      id: candidateId,
      pilotId: LIVING_TRACKER_PILOT_ID,
      trustSlug: gap.trustSlug,
      sourceUrl: `https://asbestostrusts.org/trusts/${gap.trustSlug}`,
      changeType: "source_inaccessible",
      severity: "routine",
      status: "blocked",
      evidence: `No registered public primary source URL was available when the pilot registry was seeded for ${gap.trustName}. This is a source-coverage gap, not a statement that no change occurred.`,
      assignedOwner: LIVING_TRACKER_PILOT.researchOwner,
      nextAction: "Identify and register an official trust, administrator, case-agent, court, government, or primary-document source.",
      disposition: "Initial source-registry gap recorded.",
      reviewedAt: now,
    }).onDuplicateKeyUpdate({ set: { updatedAt: now } });
  }
  return { db, seed };
}

async function createRun(runType: PilotRunType, sourceCount: number, scheduledFor?: Date) {
  const { db } = await ensurePilotAndRegistry();
  const id = `run-${runType}-${nanoid(14)}`;
  await db.insert(operationsRuns).values({
    id,
    pilotId: LIVING_TRACKER_PILOT_ID,
    runType,
    scheduledFor,
    sourceCount,
    resultSummary: "Run started.",
    resultJson: "{}",
  });
  return { db, id };
}

async function recordSkippedRun(runType: PilotRunType, reason: string, scheduledFor?: Date) {
  const { db } = await ensurePilotAndRegistry();
  const id = `run-${runType}-${nanoid(14)}`;
  await db.insert(operationsRuns).values({
    id,
    pilotId: LIVING_TRACKER_PILOT_ID,
    runType,
    scheduledFor,
    completedAt: new Date(),
    status: "skipped",
    resultSummary: reason,
    resultJson: safeJson({ pilot: LIVING_TRACKER_PILOT, reason }),
  });
  return { status: "skipped" as const, runId: id, reason };
}

async function completeRun(params: {
  db: NonNullable<Awaited<ReturnType<typeof getDb>>>;
  id: string;
  status: "success" | "partial" | "failed" | "skipped";
  checkedCount: number;
  changedCount: number;
  failedCount: number;
  candidateCount: number;
  resultSummary: string;
  result: unknown;
}) {
  await params.db.update(operationsRuns).set({
    status: params.status,
    completedAt: new Date(),
    checkedCount: params.checkedCount,
    changedCount: params.changedCount,
    failedCount: params.failedCount,
    candidateCount: params.candidateCount,
    resultSummary: params.resultSummary,
    resultJson: safeJson(params.result),
  }).where(eq(operationsRuns.id, params.id));
}

function sevenDaysFrom(now: Date) {
  return new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
}

function nextCheckForCadence(cadence: "daily" | "weekly", now: Date) {
  return cadence === "daily"
    ? new Date(now.getTime() + 24 * 60 * 60 * 1000)
    : sevenDaysFrom(now);
}

function fingerprint(text: string) {
  return createHash("sha256").update(text.slice(0, 1_000_000)).digest("hex");
}

function chicagoCalendar(now = new Date()) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: LIVING_TRACKER_PILOT.timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    weekday: "short",
  }).formatToParts(now);
  const get = (type: Intl.DateTimeFormatPartTypes) => parts.find((part) => part.type === type)?.value ?? "";
  return { month: Number(get("month")), day: Number(get("day")), weekday: get("weekday") };
}

function isFirstFullBusinessWeek(now = new Date()) {
  const { day, weekday } = chicagoCalendar(now);
  return day <= 7 && ["Mon", "Tue", "Wed", "Thu", "Fri"].includes(weekday);
}

function isQuarterlyAuditWindow(now = new Date()) {
  const { month, day, weekday } = chicagoCalendar(now);
  return [1, 4, 7, 10].includes(month) && day <= 10 && ["Mon", "Tue", "Wed", "Thu", "Fri"].includes(weekday);
}

export async function runDailySourceDetection(options: {
  force?: boolean;
  scheduledFor?: Date;
  limit?: number;
  runType?: "daily_detection" | "weekly_coverage";
  scanAllSources?: boolean;
} = {}) {
  const { db, seed } = await ensurePilotAndRegistry();
  const now = new Date();
  const active = pilotIsActive(now);
  const runType = options.runType ?? "daily_detection";
  const sourceLimit = options.limit ?? 25;
  const allSources = await db.select().from(sourceRegistry)
    .where(eq(sourceRegistry.pilotId, LIVING_TRACKER_PILOT_ID))
    .orderBy(asc(sourceRegistry.priority), asc(sourceRegistry.nextCheckAt));
  const due = allSources
    .filter((source) => source.isActive && (options.scanAllSources || !source.nextCheckAt || source.nextCheckAt <= now))
    .slice(0, sourceLimit);
  const runId = `run-${runType}-${nanoid(14)}`;
  await db.insert(operationsRuns).values({
    id: runId,
    pilotId: LIVING_TRACKER_PILOT_ID,
    runType,
    scheduledFor: options.scheduledFor,
    sourceCount: due.length,
    resultSummary: "Run started.",
    resultJson: "{}",
  });

  if (!active && !options.force) {
    await completeRun({ db, id: runId, status: "skipped", checkedCount: 0, changedCount: 0, failedCount: 0, candidateCount: 0, resultSummary: "Pilot is outside its approved dates; no source requests made.", result: { pilot: LIVING_TRACKER_PILOT, registeredSources: seed.registered.length } });
    return { status: "skipped" as const, runId, checkedCount: 0, changedCount: 0, failedCount: 0, candidateCount: 0 };
  }

  const outcomes: Array<{ sourceId: string; ok: boolean; changed: boolean; failure: boolean }> = [];
  // The weekly coverage run can review the full registry. Batching avoids a
  // burst of simultaneous network connections while remaining within the
  // two-minute scheduled-handler window.
  for (let index = 0; index < due.length; index += 10) {
    const batch = await Promise.all(due.slice(index, index + 10).map(async (source) => {
    try {
      const response = await fetch(source.sourceUrl, {
        headers: {
          "User-Agent": "AsbestosTrusts-Source-Monitor/1.0 (+https://asbestostrusts.org/methodology)",
          "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,application/pdf;q=0.8,*/*;q=0.7",
          "Cache-Control": "no-cache",
        },
        signal: AbortSignal.timeout(8_000),
      });
      const body = await response.text();
      const contentHash = response.ok ? fingerprint(body) : undefined;
      const changed = response.ok && Boolean(source.contentHash && contentHash && source.contentHash !== contentHash);
      await db.update(sourceRegistry).set({
        lastCheckedAt: now,
        lastSuccessfulCheckAt: response.ok ? now : source.lastSuccessfulCheckAt,
        nextCheckAt: nextCheckForCadence(source.checkCadence, now),
        lastStatusCode: response.status,
        contentHash: contentHash ?? source.contentHash,
        failureCount: response.ok ? 0 : source.failureCount + 1,
        lastError: response.ok ? null : `HTTP ${response.status}`,
      }).where(eq(sourceRegistry.id, source.id));
      if (changed) {
        await db.insert(operationsCandidates).values({
          id: `candidate-${nanoid(16)}`,
          pilotId: LIVING_TRACKER_PILOT_ID,
          sourceRegistryId: source.id,
          trustSlug: source.trustSlug,
          sourceUrl: source.sourceUrl,
          changeType: "source_changed",
          severity: source.priority === 1 ? "material" : "routine",
          status: "detected",
          observedAt: now,
          evidence: `A content fingerprint changed on a registered ${source.sourceClass} source. This is a detection signal only; it does not establish any public fact or authorize publication. Previous and current fingerprints are retained in the source record.`,
          assignedOwner: LIVING_TRACKER_PILOT.researchOwner,
          nextAction: "Review the controlling source, record the exact publication/effective/reporting dates and source meaning, then disposition the candidate.",
        });
      }
      if (!response.ok && source.failureCount === 0) {
        await db.insert(operationsCandidates).values({
          id: `candidate-${nanoid(16)}`,
          pilotId: LIVING_TRACKER_PILOT_ID,
          sourceRegistryId: source.id,
          trustSlug: source.trustSlug,
          sourceUrl: source.sourceUrl,
          changeType: "source_inaccessible",
          severity: "routine",
          status: "detected",
          observedAt: now,
          evidence: `Registered source returned HTTP ${response.status}. This records an access/availability outcome and does not support a no-change conclusion.`,
          assignedOwner: LIVING_TRACKER_PILOT.researchOwner,
          nextAction: "Retry within the defined coverage window using any documented lawful retrieval requirements; record a blocker if it remains inaccessible.",
        });
      }
      return { sourceId: source.id, ok: response.ok, changed, failure: !response.ok };
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown source-monitor failure";
      await db.update(sourceRegistry).set({ lastCheckedAt: now, nextCheckAt: nextCheckForCadence(source.checkCadence, now), failureCount: source.failureCount + 1, lastError: message }).where(eq(sourceRegistry.id, source.id));
      if (source.failureCount === 0) {
        await db.insert(operationsCandidates).values({
          id: `candidate-${nanoid(16)}`,
          pilotId: LIVING_TRACKER_PILOT_ID,
          sourceRegistryId: source.id,
          trustSlug: source.trustSlug,
          sourceUrl: source.sourceUrl,
          changeType: "source_inaccessible",
          severity: "routine",
          status: "detected",
          observedAt: now,
          evidence: `Registered source check failed: ${message}. This is an access/availability finding, not a no-change conclusion.`,
          assignedOwner: LIVING_TRACKER_PILOT.researchOwner,
          nextAction: "Retry within the defined coverage window and record any source-specific retrieval constraint.",
        });
      }
      return { sourceId: source.id, ok: false, changed: false, failure: true };
    }
    }));
    outcomes.push(...batch);
  }
  const checkedCount = outcomes.length;
  const changedCount = outcomes.filter((outcome) => outcome.changed).length;
  const failedCount = outcomes.filter((outcome) => outcome.failure).length;
  const candidateCount = outcomes.filter((outcome) => outcome.changed || outcome.failure).length;
  const status = failedCount ? "partial" : "success";
  await completeRun({
    db, id: runId, status, checkedCount, changedCount, failedCount, candidateCount,
    resultSummary: `${runType === "daily_detection" ? "Daily source detection" : "Weekly source coverage"} checked ${checkedCount} sources; ${changedCount} changed and ${failedCount} were inaccessible or failed.`,
    result: { pilotActive: active, registeredSourceCount: seed.registered.length, outcomes },
  });
  return { status, runId, checkedCount, changedCount, failedCount, candidateCount };
}

export async function runWeeklyCoverage(scheduledFor?: Date) {
  if (!pilotIsActive()) {
    return recordSkippedRun("weekly_coverage", "Pilot is outside its approved dates; no source requests made.", scheduledFor);
  }
  const result = await runDailySourceDetection({ scheduledFor, limit: 75, runType: "weekly_coverage", scanAllSources: true });
  await notifyOwner({
    title: "AsbestosTrusts — Weekly Source Coverage",
    content: `Registered-source coverage completed: ${result.checkedCount} checked; ${result.changedCount} content-change candidate(s); ${result.failedCount} inaccessible or failed source(s). All outcomes and follow-up candidates are recorded in the existing project queue; no public fact was changed automatically.`,
  });
  return result;
}

export async function runWeeklyDigest(scheduledFor?: Date) {
  if (!pilotIsActive()) {
    return recordSkippedRun("weekly_digest", "Pilot is outside its approved dates; no digest was prepared.", scheduledFor);
  }
  const { db } = await ensurePilotAndRegistry();
  const now = new Date();
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const candidates = await db.select().from(operationsCandidates).where(eq(operationsCandidates.pilotId, LIVING_TRACKER_PILOT_ID));
  const releases = await db.select().from(operationsRuns).where(eq(operationsRuns.pilotId, LIVING_TRACKER_PILOT_ID));
  const recentCandidates = candidates.filter((candidate) => candidate.detectedAt >= weekAgo);
  const unresolved = candidates.filter((candidate) => ["detected", "under_review", "blocked"].includes(candidate.status));
  const { id } = await createRun("weekly_digest", 0, scheduledFor);
  const result = { recentCandidates: recentCandidates.length, unresolved: unresolved.length, runRecordsThisWeek: releases.filter((run) => run.startedAt >= weekAgo).length, articleTarget: 3, articlePolicy: "Quality-dependent: explain shortfalls in the digest; do not publish filler." };
  await completeRun({ db, id, status: "success", checkedCount: 0, changedCount: 0, failedCount: 0, candidateCount: recentCandidates.length, resultSummary: `Weekly digest prepared with ${recentCandidates.length} candidate(s) and ${unresolved.length} unresolved item(s).`, result });
  await notifyOwner({ title: "AsbestosTrusts — Weekly Research Desk Digest", content: `Project queue summary: ${recentCandidates.length} candidate(s) detected this week; ${unresolved.length} unresolved. Publishing target is 3 substantive articles (2 timely briefs and 1 analysis/explainer); quality shortfalls must be recorded rather than filled.` });
  return result;
}

export async function runResearchPreparation(runType: "monthly_research_prep" | "quarterly_audit_prep", scheduledFor?: Date) {
  if (!pilotIsActive()) {
    return recordSkippedRun(runType, "Pilot is outside its approved dates; no research preparation was performed.", scheduledFor);
  }
  if (runType === "monthly_research_prep" && !isFirstFullBusinessWeek()) {
    return recordSkippedRun(runType, "Outside the first full Central-time business week; no monthly research preparation was performed.", scheduledFor);
  }
  if (runType === "quarterly_audit_prep" && !isQuarterlyAuditWindow()) {
    return recordSkippedRun(runType, "Outside the first ten Central-time business days of a quarter; no quarterly audit preparation was performed.", scheduledFor);
  }
  const { db } = await ensurePilotAndRegistry();
  const candidates = await db.select().from(operationsCandidates).where(eq(operationsCandidates.pilotId, LIVING_TRACKER_PILOT_ID));
  const priority = candidates.filter((candidate) => ["detected", "under_review", "blocked"].includes(candidate.status)).slice(0, 5);
  const { id } = await createRun(runType, 0, scheduledFor);
  const result = { priorityCandidateIds: priority.map((candidate) => candidate.id), count: priority.length, noAutomaticPublication: true };
  await completeRun({ db, id, status: "success", checkedCount: 0, changedCount: 0, failedCount: 0, candidateCount: priority.length, resultSummary: `${runType === "monthly_research_prep" ? "Monthly research" : "Quarterly audit"} preparation recorded ${priority.length} priority candidate(s).`, result });
  await notifyOwner({ title: `AsbestosTrusts — ${runType === "monthly_research_prep" ? "Monthly Research" : "Quarterly Audit"} Preparation`, content: `${priority.length} priority candidate(s) are in the existing project queue. This preparation record authorizes no public change by itself.` });
  return result;
}

export async function runControlledDetectionTest(scheduledFor?: Date) {
  const { db } = await ensurePilotAndRegistry();
  const manville = (await db.select().from(sourceRegistry).where(eq(sourceRegistry.id, "source-manville-official-announcement-feed")).limit(1))[0];
  if (!manville) throw new Error("Controlled test source is not registered");
  const now = new Date();
  const { id } = await createRun("controlled_test", 1, scheduledFor);
  const candidateId = `controlled-test-${nanoid(16)}`;
  await db.insert(operationsCandidates).values({
    id: candidateId,
    pilotId: LIVING_TRACKER_PILOT_ID,
    sourceRegistryId: manville.id,
    trustSlug: manville.trustSlug,
    sourceUrl: manville.sourceUrl,
    changeType: "controlled_test",
    severity: "routine",
    status: "verified",
    observedAt: now,
    evidence: "Controlled detection test. The candidate is synthetic audit evidence only; it asserts no external source change and authorizes no public update.",
    assignedOwner: LIVING_TRACKER_PILOT.researchOwner,
    nextAction: "Confirm the candidate and run record were stored; mark the test disposition without changing public tracker data.",
    disposition: "Controlled detection test created successfully; no publication permitted.",
    reviewedAt: now,
  });
  await completeRun({ db, id, status: "success", checkedCount: 1, changedCount: 1, failedCount: 0, candidateCount: 1, resultSummary: "Controlled detection test created a durable synthetic candidate with no public publication path.", result: { candidateId, sourceRegistryId: manville.id, noPublication: true } });
  return { runId: id, candidateId };
}

async function requireCron(req: Request, res: Response) {
  const user = await sdk.authenticateRequest(req);
  if (!user.isCron) {
    res.status(403).json({ error: "cron-only endpoint" });
    return false;
  }
  return true;
}

export async function dailyDetectionHandler(req: Request, res: Response) {
  try {
    if (!await requireCron(req, res)) return;
    res.json(await runDailySourceDetection({ scheduledFor: new Date() }));
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : "daily detection failed", timestamp: new Date().toISOString() });
  }
}

export async function weeklyCoverageHandler(req: Request, res: Response) {
  try {
    if (!await requireCron(req, res)) return;
    res.json(await runWeeklyCoverage(new Date()));
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : "weekly coverage failed", timestamp: new Date().toISOString() });
  }
}

export async function weeklyDigestHandler(req: Request, res: Response) {
  try {
    if (!await requireCron(req, res)) return;
    res.json(await runWeeklyDigest(new Date()));
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : "weekly digest failed", timestamp: new Date().toISOString() });
  }
}

export async function monthlyResearchPreparationHandler(req: Request, res: Response) {
  try {
    if (!await requireCron(req, res)) return;
    res.json(await runResearchPreparation("monthly_research_prep", new Date()));
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : "monthly research preparation failed", timestamp: new Date().toISOString() });
  }
}

export async function quarterlyAuditPreparationHandler(req: Request, res: Response) {
  try {
    if (!await requireCron(req, res)) return;
    res.json(await runResearchPreparation("quarterly_audit_prep", new Date()));
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : "quarterly audit preparation failed", timestamp: new Date().toISOString() });
  }
}

export async function controlledDetectionHandler(req: Request, res: Response) {
  try {
    if (!await requireCron(req, res)) return;
    res.json(await runControlledDetectionTest(new Date()));
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : "controlled detection test failed", timestamp: new Date().toISOString() });
  }
}

/**
 * The future research agent may only write candidate findings to the internal
 * queue. It cannot publish articles or change tracker data through this route.
 */
export async function researchIntakeHandler(req: Request, res: Response) {
  try {
    if (!await requireCron(req, res)) return;
    const body = req.body as { sourceUrl?: unknown; trustSlug?: unknown; changeType?: unknown; evidence?: unknown; nextAction?: unknown; severity?: unknown };
    const sourceUrl = valueString(body.sourceUrl);
    const evidence = valueString(body.evidence);
    const nextAction = valueString(body.nextAction);
    if (!sourceUrl || !evidence || !nextAction) return res.status(400).json({ error: "sourceUrl, evidence, and nextAction are required" });
    const changeType = ["payment_notice", "financial_report", "claims_procedure", "trust_status", "court_development", "article_lead"].includes(String(body.changeType)) ? String(body.changeType) as "payment_notice" | "financial_report" | "claims_procedure" | "trust_status" | "court_development" | "article_lead" : "article_lead";
    const severity = ["routine", "material", "urgent"].includes(String(body.severity)) ? String(body.severity) as "routine" | "material" | "urgent" : "routine";
    const { db } = await ensurePilotAndRegistry();
    const candidateId = `candidate-${nanoid(16)}`;
    await db.insert(operationsCandidates).values({
      id: candidateId,
      pilotId: LIVING_TRACKER_PILOT_ID,
      trustSlug: valueString(body.trustSlug),
      sourceUrl,
      changeType,
      severity,
      evidence: `${evidence}\n\nResearch-intake note: this record is an internal candidate. It does not authorize automatic publication or a tracker-data change.`,
      assignedOwner: LIVING_TRACKER_PILOT.researchOwner,
      nextAction,
    });
    res.status(201).json({ ok: true, candidateId, publicationAuthorized: false });
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : "research intake failed", timestamp: new Date().toISOString() });
  }
}

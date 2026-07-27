import type { Express } from "express";
import fs from "fs/promises";
import path from "path";

const PACER_AUTH_URL = "https://pacer.login.uscourts.gov/services/cso-auth";
const PACER_TOKEN_TTL = 60 * 60 * 1000; // 1 hour

interface PacerTokenCache {
  token: string;
  ts: number;
}

let tokenCache: PacerTokenCache | null = null;

async function getPacerToken(): Promise<string | null> {
  if (tokenCache && Date.now() - tokenCache.ts < PACER_TOKEN_TTL) {
    return tokenCache.token;
  }
  const username = process.env.PACER_USERNAME;
  const password = process.env.PACER_PASSWORD;
  if (!username || !password) return null;

  try {
    const resp = await fetch(PACER_AUTH_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ loginId: username, password, redactFlag: "1" }),
      signal: AbortSignal.timeout(15000),
    });
    const xml = await resp.text();
    const tokenMatch = xml.match(/<nextGenCSO>(.*?)<\/nextGenCSO>/);
    const loginResult = xml.match(/<loginResult>(\d+)<\/loginResult>/);
    if (!tokenMatch || loginResult?.[1] !== "0") {
      console.error("[PACER] Auth failed:", xml.slice(0, 200));
      return null;
    }
    tokenCache = { token: tokenMatch[1], ts: Date.now() };
    return tokenCache.token;
  } catch (e) {
    console.error("[PACER] Auth error:", e);
    return null;
  }
}

interface PullRequest {
  court: string;      // e.g. "deb"
  caseNo: string;     // e.g. "01-01139"
  docNo: string;      // e.g. "33347"
  trustId?: string;
}

interface PullResult {
  success: boolean;
  source: "pacer" | "recap" | "none";
  pdfUrl?: string;
  pageCount?: number;
  estimatedCost?: string;
  error?: string;
}

// Check CourtListener RECAP first (free)
async function checkRECAP(court: string, caseNo: string, docNo: string): Promise<string | null> {
  try {
    const resp = await fetch(
      `https://www.courtlistener.com/api/rest/v3/recap-documents/?docket_entry__docket__court=${court}&docket_entry__entry_number=${docNo}&page_size=3`,
      {
        headers: { "User-Agent": "AsbestosTrusts.org/1.0 (research@asbestostrusts.org)" },
        signal: AbortSignal.timeout(10000),
      }
    );
    if (!resp.ok) return null;
    const data = await resp.json() as { count: number; results: Array<{ filepath_local?: string; absolute_url?: string }> };
    if (data.count > 0 && data.results[0]?.filepath_local) {
      return `https://storage.courtlistener.com/${data.results[0].filepath_local}`;
    }
    return null;
  } catch {
    return null;
  }
}

// Fetch document from PACER CM/ECF using NextGen token
async function fetchFromPACER(court: string, caseNo: string, docNo: string): Promise<PullResult> {
  const token = await getPacerToken();
  if (!token) {
    return { success: false, source: "none", error: "PACER credentials not configured or auth failed" };
  }

  try {
    // Step 1: Get docket to find internal doc ID
    const dktUrl = `https://ecf.${court}.uscourts.gov/cgi-bin/DktRpt.pl`;
    const dktResp = await fetch(dktUrl, {
      method: "POST",
      headers: {
        "Cookie": `PacerToken=${token}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        case_no: caseNo,
        doc_num_start: docNo,
        doc_num_end: docNo,
        action: "1",
        type: "1",
        Submit: "Run Report",
      }).toString(),
      signal: AbortSignal.timeout(20000),
    });

    const html = await dktResp.text();
    // Extract doc1 link from docket HTML
    const docMatch = html.match(/href="(\/doc1\/\d+)"/);
    if (!docMatch) {
      return { success: false, source: "none", error: "Document link not found in docket. Account may need NextGen upgrade." };
    }

    const docPath = docMatch[1];
    const docUrl = `https://ecf.${court}.uscourts.gov${docPath}`;

    // Step 2: Fetch the document PDF
    const docResp = await fetch(docUrl, {
      headers: { "Cookie": `PacerToken=${token}` },
      signal: AbortSignal.timeout(30000),
    });

    if (!docResp.ok) {
      return { success: false, source: "none", error: `Document fetch failed: HTTP ${docResp.status}` };
    }

    const contentType = docResp.headers.get("content-type") ?? "";
    if (!contentType.includes("pdf")) {
      // May be a fee confirmation page
      const body = await docResp.text();
      if (body.includes("View Document")) {
        return { success: false, source: "none", error: "Fee confirmation page received — manual confirmation required" };
      }
      return { success: false, source: "none", error: `Unexpected content type: ${contentType}` };
    }

    // Estimate cost: PACER charges $0.10/page, max $3.00
    const contentLength = parseInt(docResp.headers.get("content-length") ?? "0");
    const estimatedPages = Math.ceil(contentLength / 50000); // rough estimate
    const estimatedCost = `$${Math.min(estimatedPages * 0.10, 3.00).toFixed(2)}`;

    return {
      success: true,
      source: "pacer",
      pdfUrl: docUrl,
      pageCount: estimatedPages,
      estimatedCost,
    };
  } catch (e) {
    return { success: false, source: "none", error: String(e) };
  }
}

export function registerPacerRoutes(app: Express) {
  // POST /api/pacer/pull — pull a single document
  app.post("/api/pacer/pull", async (req, res) => {
    const { court, caseNo, docNo, trustId } = req.body as PullRequest;
    if (!court || !caseNo || !docNo) {
      res.status(400).json({ error: "court, caseNo, and docNo are required" });
      return;
    }

    // 1. Check RECAP first (free)
    const recapUrl = await checkRECAP(court, caseNo, docNo);
    if (recapUrl) {
      console.log(`[PACER] RECAP hit for ${court}/${caseNo}/${docNo}: ${recapUrl}`);
      res.json({ success: true, source: "recap", pdfUrl: recapUrl, estimatedCost: "$0.00", trustId });
      return;
    }

    // 2. Fall back to PACER
    const result = await fetchFromPACER(court, caseNo, docNo);
    console.log(`[PACER] Pull result for ${court}/${caseNo}/${docNo}:`, result);
    res.json({ ...result, trustId });
  });

  // POST /api/pacer/pull-queue — pull all pending documents from the queue file
  app.post("/api/pacer/pull-queue", async (_req, res) => {
    try {
      const queuePath = path.join(process.cwd(), "pacer-pull-queue.json");
      const queueData = JSON.parse(await fs.readFile(queuePath, "utf-8"));
      const pending = queueData.queue.filter((d: { status: string }) => d.status === "pending");

      const results = [];
      for (const doc of pending) {
        if (!doc.docNo) {
          results.push({ trustId: doc.trustId, status: "skipped", reason: "No doc number — needs manual lookup" });
          continue;
        }
        const recapUrl = await checkRECAP(doc.court, doc.caseNo, doc.docNo);
        if (recapUrl) {
          results.push({ trustId: doc.trustId, status: "recap", pdfUrl: recapUrl, cost: "$0.00" });
          continue;
        }
        const result = await fetchFromPACER(doc.court, doc.caseNo, doc.docNo);
        results.push({ trustId: doc.trustId, ...result });
        // Small delay to be polite to PACER servers
        await new Promise(r => setTimeout(r, 2000));
      }

      res.json({ processed: results.length, results });
    } catch (e) {
      res.status(500).json({ error: String(e) });
    }
  });

  // GET /api/pacer/status — check PACER auth status
  app.get("/api/pacer/status", async (_req, res) => {
    const token = await getPacerToken();
    res.json({
      configured: !!(process.env.PACER_USERNAME && process.env.PACER_PASSWORD),
      authenticated: !!token,
      tokenCached: !!tokenCache,
    });
  });
}

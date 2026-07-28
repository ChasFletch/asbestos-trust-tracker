#!/usr/bin/env node
/**
 * PACER pull script — DII early-years annual reports (Exhibit B tables).
 *
 * Credentials: create `.env.pacer` in the workspace root (same dir as this
 * script's parent) with exactly two lines:
 *   PACER_USERNAME=your_username
 *   PACER_PASSWORD=your_password
 * The file is gitignored-adjacent by name; do not commit it. The script only
 * reads it at runtime — credentials never appear in logs or output.
 *
 * What it does:
 *  1. Authenticates via NextGen CSO (pacer.login.uscourts.gov/services/cso-auth)
 *  2. For each target: fetches the doc1 page; if a document-selection menu,
 *     picks the "Exhibit B" part; if a fee-confirmation page, parses and
 *     submits the accept form; saves the resulting PDF to trust-reports/pacer/
 *  3. Logs billable pages + cost from each PACER receipt to a ledger JSON.
 */

import fs from "fs";
import path from "path";
import crypto from "crypto";
import { fileURLToPath } from "url";

// --- TOTP (RFC 6238, SHA-1, 30s window, 6 digits) — no dependencies ---
function base32Decode(s) {
  const alpha = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
  const clean = s.toUpperCase().replace(/[^A-Z2-7]/g, "");
  const bits = [...clean].map((c) => alpha.indexOf(c).toString(2).padStart(5, "0")).join("");
  const bytes = [];
  for (let i = 0; i + 8 <= bits.length; i += 8) bytes.push(parseInt(bits.slice(i, i + 8), 2));
  return Buffer.from(bytes);
}

function totp(secret, windowOffset = 0) {
  const key = base32Decode(secret);
  const counter = Math.floor(Date.now() / 30000) + windowOffset;
  const msg = Buffer.alloc(8);
  msg.writeBigUInt64BE(BigInt(counter));
  const h = crypto.createHmac("sha1", key).update(msg).digest();
  const off = h[h.length - 1] & 0x0f;
  const code = ((h.readUInt32BE(off) & 0x7fffffff) % 1_000_000).toString().padStart(6, "0");
  return code;
}

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(HERE, "..");
const OUT_DIR = path.join(ROOT, "trust-reports", "pacer");
const ENV_PATHS = [path.join(ROOT, ".env.pacer"), path.join(ROOT, "env.pacer"), path.join(ROOT, "env.pacer.md")];
const LEDGER_PATH = path.join(OUT_DIR, "pacer-ledger.json");
const SESSION_PATH = path.join(ROOT, "pacer-session.txt"); // harvested browser ECF cookies

const AUTH_URL = "https://pacer.login.uscourts.gov/services/cso-auth";
const ECF = "https://ecf.pawb.uscourts.gov";

// DII Industries Asbestos PI Trust, Bankr. W.D. Pa. 03-35592-CMB.
// doc1 IDs mapped from the live docket history 2026-07-28.
// exhibitB: null → fetch selection menu and locate the Exhibit B part.
const TARGETS = [
  { year: 2013, label: "Second Amended FY2013 AR (Doc 2913)", exhibitB: "/doc1/156120035283" },
  { year: 2012, label: "FY2012 AR (Doc 2855)", menu: "/doc1/156017584356" },
  { year: 2011, label: "FY2011 AR (Doc 2836)", menu: "/doc1/156015939007" },
  { year: 2010, label: "FY2010 AR (Doc 2812)", menu: "/doc1/156014204353", exhibitBGuess: "/doc1/156114204355" },
  { year: 2009, label: "FY2009 AR (Doc 2764)", menu: "/doc1/156012333978", exhibitBGuess: "/doc1/156112333980" },
  { year: 2008, label: "FY2008 AR (Doc 2754)", menu: "/doc1/156010495398", exhibitBGuess: "/doc1/156110495400" },
  { year: 2007, label: "FY2007 notice (Doc 2697)", menu: "/doc1/15608517509" },
  { year: 2006, label: "FY2006 AR (Doc 2686)", menu: "/doc1/15603619713" },
  { year: 2005, label: "FY2005 notice (Doc 2601)", menu: "/doc1/15607068756" },
];

function loadEnv() {
  const envPath = ENV_PATHS.find((p) => fs.existsSync(p));
  if (!envPath) {
    console.error(`Missing env file. Create env.pacer in the workspace root with PACER_USERNAME=... and PACER_PASSWORD=... lines.`);
    process.exit(2);
  }
  const txt = fs.readFileSync(envPath, "utf8");
  const env = {};
  for (const line of txt.split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z_]+)\s*=\s*(.+?)\s*$/);
    if (m) env[m[1]] = m[2];
  }
  if (!env.PACER_USERNAME || !env.PACER_PASSWORD) {
    console.error(".env.pacer must contain PACER_USERNAME and PACER_PASSWORD");
    process.exit(2);
  }
  return env;
}

async function getToken({ PACER_USERNAME, PACER_PASSWORD }, otp) {
  const body = { loginId: PACER_USERNAME, password: PACER_PASSWORD, redactFlag: "1" };
  if (otp) body.otpCode = otp;
  const resp = await fetch(AUTH_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(15000),
  });
  const xml = await resp.text();
  const token = xml.match(/<nextGenCSO>(.*?)<\/nextGenCSO>/)?.[1];
  const result = xml.match(/<loginResult>(\d+)<\/loginResult>/)?.[1];
  if (!token || result !== "0") {
    const msg = xml.match(/<message>(.*?)<\/message>/)?.[1] ?? xml.slice(0, 200);
    throw new Error(`CSO auth failed: ${msg}`);
  }
  return token;
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// Cookie jar: ECF rotates NextGenCSO / TS* cookies on every response, so a
// static header goes stale after one request. Merge every Set-Cookie.
function makeJar(initialHeader) {
  const map = new Map();
  for (const pair of initialHeader.split(";")) {
    const i = pair.indexOf("=");
    if (i > 0) map.set(pair.slice(0, i).trim(), pair.slice(i + 1).trim());
  }
  return {
    header() { return [...map].map(([k, v]) => `${k}=${v}`).join("; "); },
    absorb(resp) {
      const setCookies = resp.headers.getSetCookie?.() ?? [];
      for (const sc of setCookies) {
        const first = sc.split(";")[0];
        const i = first.indexOf("=");
        if (i > 0) map.set(first.slice(0, i).trim(), first.slice(i + 1).trim());
      }
    },
  };
}

async function ecfGet(jar, urlPath) {
  const resp = await fetch(ECF + urlPath, {
    headers: { Cookie: jar.header() },
    redirect: "follow",
    signal: AbortSignal.timeout(30000),
  });
  jar.absorb(resp);
  const ct = resp.headers.get("content-type") ?? "";
  if (ct.includes("pdf")) {
    return { kind: "pdf", buf: Buffer.from(await resp.arrayBuffer()) };
  }
  return { kind: "html", html: await resp.text(), finalUrl: resp.url };
}

function parseReceipt(html) {
  const text = html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ");
  const pages = text.match(/Billable Pages:\s*([\d,]+)/i)?.[1];
  const cost = text.match(/Cost:\s*([\d.]+)/i)?.[1];
  const desc = text.match(/Description:\s*(.*?)\s*(?:Case Number|Billable)/i)?.[1]?.trim();
  return { billablePages: pages ?? null, cost: cost ?? null, description: desc ?? null };
}

// Find the Exhibit B part link on a document-selection menu page.
// Links may be absolute (https://ecf.pawb.../doc1/NNN) or relative (/doc1/NNN);
// descriptions live in following table cells.
function findPart(html, labelRe) {
  const linkRe = /<a[^>]*href="(?:https:\/\/ecf\.pawb\.uscourts\.gov)?(\/doc1\/\d+)"[^>]*>(\d+)<\/a>/gi;
  const links = [];
  let m;
  while ((m = linkRe.exec(html))) links.push({ path: m[1], num: m[2], start: m.index, end: m.index + m[0].length });
  for (let i = 0; i < links.length; i++) {
    const windowEnd = i + 1 < links.length ? links[i + 1].start : Math.min(html.length, links[i].end + 500);
    const desc = html.slice(links[i].end, windowEnd).replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
    if (labelRe.test(desc)) return links[i].path;
  }
  return null;
}

function findExhibitB(html) {
  return findPart(html, /exhibit\s*b/i);
}

function findMainDocument(html) {
  return findPart(html, /main\s*document/i);
}

// Submit fee acceptance by replaying the page's own goDLS(...) JS call:
// goDLS(url, caseid, de_seq_num, got_receipt, pdf_header, pdf_toggle_possible,
//       magic_num, claim_id, claim_num, claim_doc_seq) — POSTs the non-empty
// args as hidden form fields to url.
async function acceptFee(jar, html, pageUrlPath) {
  const dls = html.match(/goDLS\(\s*'([^']*)'((?:\s*,\s*'[^']*'){9})\s*\)/);
  let action, body;
  if (dls) {
    action = dls[1];
    const args = dls[2].replace(/^\s*,/, "").split(/\s*,\s*/).map((s) => s.replace(/^'|'$/g, ""));
    const names = ["caseid", "de_seq_num", "got_receipt", "pdf_header", "pdf_toggle_possible", "magic_num", "claim_id", "claim_num", "claim_doc_seq"];
    const params = new URLSearchParams();
    names.forEach((n, idx) => { if (args[idx]) params.set(n, args[idx]); });
    body = params.toString();
  } else {
    // Fallback: plain form reconstruction (older pages).
    action = html.match(/<form[^>]*action="([^"]*)"/i)?.[1] ?? pageUrlPath;
    const inputs = {};
    const re = /<input[^>]*>/gi;
    let m;
    while ((m = re.exec(html))) {
      const tag = m[0];
      const name = tag.match(/name="([^"]*)"/i)?.[1];
      const value = tag.match(/value="([^"]*)"/i)?.[1] ?? "";
      const type = tag.match(/type="([^"]*)"/i)?.[1] ?? "text";
      if (name && (type === "hidden" || /accept|view|submit/i.test(value))) inputs[name] = value;
    }
    body = new URLSearchParams(inputs).toString();
  }
  const resp = await fetch(action.startsWith("http") ? action : ECF + action, {
    method: "POST",
    headers: {
      Cookie: jar.header(),
      "Content-Type": "application/x-www-form-urlencoded",
      Referer: ECF + pageUrlPath,
    },
    body,
    redirect: "follow",
    signal: AbortSignal.timeout(30000),
  });
  jar.absorb(resp);
  const ct = resp.headers.get("content-type") ?? "";
  if (!ct.includes("pdf")) {
    const body = await resp.text();
    fs.writeFileSync(path.join(OUT_DIR, "debug-fee-accept.html"), body);
    throw new Error(`Fee accept did not yield PDF (got ${ct}); body saved to debug-fee-accept.html`);
  }
  return Buffer.from(await resp.arrayBuffer());
}

async function pullOne(jar, target, ledger) {
  const fn = `dii-${target.year}-exhibit-b.pdf`;
  const entry = { year: target.year, label: target.label, status: "pending" };
  ledger.push(entry);
  if (fs.existsSync(path.join(OUT_DIR, fn))) {
    entry.status = "already_downloaded";
    entry.file = fn;
    return;
  }
  let docPath = target.exhibitB ?? target.exhibitBGuess ?? null;
  let page = null;

  // Step 1: resolve the Exhibit B part via the selection menu when needed.
  if (!docPath) {
    const menu = await ecfGet(jar, target.menu);
    if (menu.kind !== "html") throw new Error("expected selection menu, got PDF");
    if (/View Document/i.test(menu.html)) {
      // Single-document entry: doc1 goes straight to the fee receipt.
      page = menu;
      docPath = target.menu;
      entry.note = "single-document entry; pulled whole document";
    } else {
      docPath = findExhibitB(menu.html);
      if (!docPath) {
        // No separate Exhibit B — the table is inside the main document; pull it whole.
        const main = findMainDocument(menu.html);
        if (!main) {
          entry.status = "no_exhibit_b_found";
          entry.menuSnippet = menu.html.replace(/\s+/g, " ").slice(0, 300);
          return;
        }
        docPath = main;
        entry.note = "no separate Exhibit B part; pulled main document";
      }
      entry.resolvedDocPath = docPath;
      await sleep(1500);
    }
  }

  // Step 2: fetch the document page (unless the menu GET already returned it).
  if (!page) page = await ecfGet(jar, docPath);
  let pdfBuf;
  if (page.kind === "pdf") {
    pdfBuf = page.buf;
    entry.feeAccepted = false;
  } else {
    entry.receipt = parseReceipt(page.html);
    if (!/View Document/i.test(page.html)) {
      entry.status = "unexpected_html";
      entry.htmlSnippet = page.html.replace(/\s+/g, " ").slice(0, 300);
      return;
    }
    await sleep(1500);
    pdfBuf = await acceptFee(jar, page.html, docPath);
    entry.feeAccepted = true;
  }

  fs.writeFileSync(path.join(OUT_DIR, fn), pdfBuf);
  entry.status = "downloaded";
  entry.file = fn;
  entry.bytes = pdfBuf.length;
  await sleep(2000); // politeness delay
}

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });

  // Preferred auth: harvested browser ECF session cookies (no CSO call at all).
  // Fallback: CSO token auth (proven not to work for doc1, kept for completeness).
  let authHeader;
  if (fs.existsSync(SESSION_PATH)) {
    authHeader = fs.readFileSync(SESSION_PATH, "utf8").trim();
    console.log(`Using harvested browser session (${authHeader.length} chars of cookies).`);
    const ageMin = (Date.now() - fs.statSync(SESSION_PATH).mtimeMs) / 60000;
    console.log(`Session cookie age: ${ageMin.toFixed(1)} min`);
  } else {
    const creds = loadEnv();
    console.log("No pacer-session.txt; authenticating with PACER CSO...");
    const otpArg = (process.argv.find((a) => a.startsWith("--otp=")) ?? "").slice(6)
      || process.env.PACER_OTP
      || (creds.PACER_TOTP_SECRET ? totp(creds.PACER_TOTP_SECRET) : "");
    if (!otpArg) {
      console.error("MFA account: pass --otp=NNNNNN, or add PACER_TOTP_SECRET=... to env.pacer.md.");
      process.exit(2);
    }
    const token = await getToken(creds, otpArg);
    authHeader = `PacerToken=${token}`;
    console.log("Authenticated via CSO.");
  }
  const jar = makeJar(authHeader);
  const only = (process.argv.find((a) => a.startsWith("--only=")) ?? "").slice(7);
  const targets = only ? TARGETS.filter((t) => String(t.year) === only) : TARGETS;
  if (!targets.length) { console.error("No target matches --only=" + only); process.exit(2); }
  console.log("Pulling", targets.length, "documents...");

  const ledger = [];
  for (const t of targets) {
    try {
      await pullOne(jar, t, ledger);
      const last = ledger[ledger.length - 1];
      console.log(`${t.year}: ${last.status}${last.receipt?.cost ? ` ($${last.receipt.cost}, ${last.receipt.billablePages}p)` : ""}${last.note ? " — " + last.note : ""}`);
    } catch (e) {
      ledger.push({ year: t.year, label: t.label, status: "error", error: String(e).slice(0, 300) });
      console.error(`${t.year}: ERROR ${String(e).slice(0, 200)}`);
      await sleep(3000); // back off after errors; do not hammer
    }
  }
  fs.writeFileSync(LEDGER_PATH, JSON.stringify({ ranAt: new Date().toISOString(), entries: ledger }, null, 2));
  const total = ledger.reduce((s, e) => s + (e.receipt?.cost ? parseFloat(e.receipt.cost) : 0), 0);
  console.log(`Done. Ledger: ${LEDGER_PATH}. Total fees this run: $${total.toFixed(2)}`);
}

main().catch((e) => {
  console.error("Fatal:", e.message);
  process.exit(1);
});

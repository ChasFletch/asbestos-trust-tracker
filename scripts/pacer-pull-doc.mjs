#!/usr/bin/env node
/**
 * Generic PACER single-docket-entry puller.
 * Usage: node scripts/pacer-pull-doc.mjs --court=deb --case=01-01139 --doc=33347 --prefix=wrg-fy2025-ar
 *
 * Flow: query case number -> select case -> docket report filtered to the doc
 * number -> pull main + substantive attachments (skips certificate of service)
 * via goDLS replay (+ show_temp.pl hop where used) -> PDFs to trust-reports/pacer/.
 *
 * Auth: pacer-session-<court>.txt must exist (harvest browser cookies first).
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(HERE, "..");
const OUT_DIR = path.join(ROOT, "trust-reports", "pacer");

const args = Object.fromEntries(process.argv.slice(2).map(a => a.replace(/^--/, "").split("=")));
const { court, case: caseNo, prefix } = args;
let { doc: docNo } = args;
const dateFrom = args.from ?? "";
const dateTo = args.to ?? "";
if (!court || !caseNo || !prefix || (!docNo && (!dateFrom || !dateTo))) {
  console.error("usage: --court=deb --case=01-01139 --prefix=name [--doc=33347 | --from=04/01/2026 --to=05/15/2026]");
  process.exit(2);
}
const ECF = `https://ecf.${court}.uscourts.gov`;
const jar = new Map();
const sessionFile = path.join(ROOT, `pacer-session-${court}.txt`);
for (const p of fs.readFileSync(sessionFile, "utf8").trim().split(";")) {
  const i = p.indexOf("=");
  if (i > 0) jar.set(p.slice(0, i).trim(), p.slice(i + 1).trim());
}
const hdr = () => [...jar].map(([k, v]) => `${k}=${v}`).join("; ");
const absorb = (r) => {
  for (const sc of (r.headers.getSetCookie?.() ?? [])) {
    const f = sc.split(";")[0];
    const i = f.indexOf("=");
    if (i > 0) jar.set(f.slice(0, i).trim(), f.slice(i + 1).trim());
  }
};
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const get = async (urlPath) => {
  const r = await fetch(ECF + urlPath, { headers: { Cookie: hdr() } });
  absorb(r);
  return r;
};
const post = async (urlPath, params, referer) => {
  const r = await fetch(urlPath.startsWith("http") ? urlPath : ECF + urlPath, {
    method: "POST",
    headers: { Cookie: hdr(), "Content-Type": "application/x-www-form-urlencoded", ...(referer ? { Referer: ECF + referer } : {}) },
    body: params.toString(),
  });
  absorb(r);
  return r;
};
const strip = (h) => h.replace(/<script[\s\S]*?<\/script>/gi, " ").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ");

async function acceptAndDownload(html, refPath) {
  const dls = html.match(/goDLS\(\s*'([^']*)'((?:\s*,\s*'[^']*'){9})\s*\)/);
  if (!dls) throw new Error("no goDLS: " + strip(html).slice(0, 120));
  const dlsArgs = dls[2].replace(/^\s*,/, "").split(/\s*,\s*/).map((s) => s.replace(/^'|'$/g, ""));
  const names = ["caseid", "de_seq_num", "got_receipt", "pdf_header", "pdf_toggle_possible", "magic_num", "claim_id", "claim_num", "claim_doc_seq"];
  const params = new URLSearchParams();
  names.forEach((n, i) => { if (dlsArgs[i]) params.set(n, dlsArgs[i]); });
  await sleep(1200);
  const p = await post(dls[1], params, refPath);
  const pct = p.headers.get("content-type") ?? "";
  if (pct.includes("pdf")) return Buffer.from(await p.arrayBuffer());
  const body = await p.text();
  const tmp = body.match(/href=["']?(\/cgi-bin\/show_temp\.pl\?[^"' >]+)["']?/i)?.[1];
  if (!tmp) throw new Error("no show_temp link: " + strip(body).slice(0, 120));
  await sleep(1000);
  const f = await get(tmp);
  if (!(f.headers.get("content-type") ?? "").includes("pdf")) throw new Error("show_temp not pdf");
  return Buffer.from(await f.arrayBuffer());
}

async function pullDoc(docPath, fn) {
  let g = await get(docPath);
  let ct = g.headers.get("content-type") ?? "";
  if (ct.includes("pdf")) {
    const buf = Buffer.from(await g.arrayBuffer());
    fs.writeFileSync(path.join(OUT_DIR, fn), buf);
    return { cost: null, pages: null, bytes: buf.length };
  }
  let html = await g.text();
  if (/Document Selection Menu/i.test(html)) {
    const main = html.match(/href=["']?(?:https:\/\/ecf\.[a-z]+\.uscourts\.gov)?(\/doc1\/\d+)["']?[^>]*>1<\/a>/i)?.[1];
    if (!main) throw new Error("selection menu without main doc");
    await sleep(1000);
    g = await get(main);
    html = await g.text();
  }
  const text = strip(html);
  const pages = text.match(/Billable Pages:\s*([\d,]+)/)?.[1] ?? null;
  const cost = text.match(/Cost:\s*([\d.]+)/)?.[1] ?? null;
  if (!/View Document/i.test(html)) throw new Error("unexpected page: " + text.slice(0, 120));
  const buf = await acceptAndDownload(html, docPath);
  fs.writeFileSync(path.join(OUT_DIR, fn), buf);
  return { cost, pages, bytes: buf.length };
}

// Resolve a docket-entry root link to its constituent parts.
// Returns [{ path, num, desc }] — one entry for a single-document filing,
// or every part of a document-selection menu.
async function resolveParts(rootPath) {
  const g = await get(rootPath);
  if ((g.headers.get("content-type") ?? "").includes("pdf")) return [{ path: rootPath, num: "1", desc: "" }];
  const html = await g.text();
  if (!/Document Selection Menu/i.test(html)) return [{ path: rootPath, num: "1", desc: "" }];
  const links = [...html.matchAll(/href=["']?(?:https:\/\/ecf\.[a-z]+\.uscourts\.gov)?(\/doc1\/\d+)["']?[^>]*>(\d+)<\/a>/gi)]
    .map((m) => ({ path: m[1], num: m[2], start: m.index, end: m.index + m[0].length }))
    .filter((v, i, a) => a.findIndex((x) => x.path === v.path) === i);
  return links.map((l, i) => {
    const windowEnd = i + 1 < links.length ? links[i + 1].start : Math.min(html.length, l.end + 500);
    const desc = html.slice(l.end, windowEnd).replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
    return { path: l.path, num: l.num, desc };
  });
}

// Pull one already-resolved part (no further menu traversal).
async function pullPart(partPath, fn) {
  const g = await get(partPath);
  const ct = g.headers.get("content-type") ?? "";
  if (ct.includes("pdf")) {
    const buf = Buffer.from(await g.arrayBuffer());
    fs.writeFileSync(path.join(OUT_DIR, fn), buf);
    return { cost: null, pages: null, bytes: buf.length };
  }
  const html = await g.text();
  const text = strip(html);
  const pages = text.match(/Billable Pages:\s*([\d,]+)/)?.[1] ?? null;
  const cost = text.match(/Cost:\s*([\d.]+)/)?.[1] ?? null;
  if (!/View Document/i.test(html)) throw new Error("unexpected page: " + text.slice(0, 120));
  const buf = await acceptAndDownload(html, partPath);
  fs.writeFileSync(path.join(OUT_DIR, fn), buf);
  return { cost, pages, bytes: buf.length };
}

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  // 1. query case number
  const qf = await (await get("/cgi-bin/iquery.pl")).text();
  const qAction = qf.match(/<form[^>]*action="?([^" >]*)"?/i)?.[1]?.replace(/^\.\.\/cgi-bin\//, "/cgi-bin/");
  if (!qAction) { fs.writeFileSync("debug-iquery.html", qf); throw new Error("no iquery form found; wrote debug-iquery.html. Page: " + strip(qf).slice(0, 200)); }
  const caseNumQuery = caseNo.replace(/-0+(?=\d)/, "-"); // 01-01139 -> 01-1139
  let r = await post(qAction, new URLSearchParams({ case_num: caseNumQuery, button1: "Query" }), "/cgi-bin/iquery.pl");
  let html = await r.text();
  // 2. multi-case select if needed
  let caseId = null;
  const cb = html.match(/name="CaseNum_(\d+)"/);
  if (cb) {
    const boxes = [...html.matchAll(/<input type="checkbox" name="CaseNum_(\d+)"[^>]*>([^<]*)/g)];
    const pick = boxes.find((b) => /-bk-/i.test(b[2])) ?? boxes[0];
    caseId = pick[1];
    console.log("case select:", pick[2].trim(), "id", caseId);
    const selAction = html.match(/<FORM[^>]*action="?([^" >]*)"?/i)?.[1];
    r = await post(selAction, new URLSearchParams({ [`CaseNum_${caseId}`]: "on", button1: "Query" }));
    html = await r.text();
  } else {
    caseId = html.match(/DktRpt\.pl\?(\d+)/)?.[1];
  }
  if (!caseId) throw new Error("case not found: " + strip(html).slice(0, 200));

  // 3. docket report, filtered either by doc number or by filed-date range
  const df = await (await get(`/cgi-bin/DktRpt.pl?${caseId}`)).text();
  const dAction = df.match(/<FORM[^>]*action="?([^" >]*)"?/i)?.[1]?.replace(/^\.\.\/cgi-bin\//, "/cgi-bin/");
  const caseNumLabel = strip(df).match(/Case number\s*(\S+)/i)?.[1] ?? caseNo;
  r = await post(dAction, new URLSearchParams({
    all_case_ids: caseId, case_num: caseNumLabel,
    date_type: "filed",
    date_from: docNo ? "" : dateFrom, date_to: docNo ? "" : dateTo,
    documents_numbered_from_: docNo ?? "", documents_numbered_to_: docNo ?? "",
    button1: "Run Report",
  }), `/cgi-bin/DktRpt.pl?${caseId}`);
  let docket = await r.text();
  let docketText = strip(docket);
  let dCost = docketText.match(/Billable Pages:\s*([\d,]+)\s*Cost:\s*([\d.]+)/);
  console.log(`docket report: ${dCost ? `$${dCost[2]} (${dCost[1]}p)` : "?"}`);

  // 3b. date-range mode: locate the latest "annual report" entry
  if (!docNo) {
    const entries = [...docket.matchAll(/<TR><TD[^>]*>(\d{2}\/\d{2}\/\d{4})<\/TD><TD[^>]*>[\s\S]*?<\/TD><TD[^>]*>(?:<a[^>]*>)?(\d+)(?:<\/a>)?<\/nobr><\/TD><TD[^>]*>([\s\S]*?)<\/TD><\/TR>/gi)]
      .map((m) => ({ date: m[1], num: m[2], html: m[3], text: strip(m[3]) }))
      .filter((e) => /annual report/i.test(e.text) && !/^\s*certificate of service/i.test(e.text));
    if (process.env.DEBUG_ROWS) {
      const allRows = [...docket.matchAll(/<TR><TD[^>]*>(\d{2}\/\d{2}\/\d{4})<\/TD><TD[^>]*>[\s\S]*?<\/TD><TD[^>]*>(?:<a[^>]*>)?(\d+)(?:<\/a>)?<\/nobr><\/TD><TD[^>]*>([\s\S]*?)<\/TD><\/TR>/gi)]
        .map((m) => `${m[1]} #${m[2]} ${strip(m[3]).slice(0, 160)}`);
      console.log("DEBUG all rows:\n" + allRows.join("\n"));
      console.log("DEBUG matched entries:", entries.map((e) => e.num).join(", "));
    }
    if (!entries.length) {
      fs.writeFileSync("debug-docket.html", docket);
      const allRows = [...docket.matchAll(/<TR><TD[^>]*>(\d{2}\/\d{2}\/\d{4})<\/TD><TD[^>]*>[\s\S]*?<\/TD><TD[^>]*>(\d+)<\/nobr><\/TD><TD[^>]*>([\s\S]*?)<\/TD><\/TR>/gi)]
        .map((m) => `${m[1]} #${m[2]} ${strip(m[3]).slice(0, 120)}`);
      console.log("DEBUG rows in range:\n" + allRows.join("\n"));
      throw new Error("no annual-report entry in date range. Docket text: " + docketText.slice(0, 300));
    }
    const latest = entries[entries.length - 1];
    docNo = latest.num;
    console.log(`located entry ${docNo} (${latest.date}): ${latest.text.slice(0, 150)}`);
    // narrow the segment to that entry's row
    const rowIdx = docket.indexOf(latest.html);
    docket = docket.slice(Math.max(0, rowIdx - 200), rowIdx + latest.html.length + 200);
  }

  // 4. find the entry's root doc1 link (the docket entry number anchor), then
  // resolve it to all parts (single doc or selection-menu parts).
  const entryIdx = docket.indexOf(`>${docNo}<`) >= 0 ? docket.indexOf(`>${docNo}<`) : docket.search(new RegExp(`\\b${docNo}\\b`));
  const seg = docket.slice(Math.max(0, entryIdx - 500), entryIdx + 6000);
  const rootLink = docket.match(new RegExp(`<a[^>]*href=["']?([^"' >]*doc1[^"' >]*)["']?[^>]*>\\s*${docNo}\\s*</a>`, "i"))?.[1]
    ?? seg.match(/<a[^>]*href=["']?([^"' >]*doc1[^"' >]*)["']?/i)?.[1];
  if (!rootLink) throw new Error("no doc1 link for entry " + docNo);
  const rootPath = rootLink.replace(/^https:\/\/ecf\.[a-z]+\.uscourts\.gov/i, "");
  console.log("rootPath:", rootPath);
  if (process.env.DUMP_LINKS) {
    const all = [...seg.matchAll(/<a[^>]*href=["']?([^"' >]*doc1[^"' >]*)["']?[^>]*>([\s\S]*?)<\/a>/gi)]
      .map((m) => `${m[1]} :: ${strip(m[2]).slice(0, 60)}`);
    console.log("DUMP_LINKS:\n" + all.join("\n"));
  }
  const desc = strip(seg).slice(0, 400);
  console.log("entry:", desc);
  await sleep(1500);
  const parts = await resolveParts(rootPath);
  console.log("parts:", parts.map((p) => `${p.num}:${p.desc.slice(0, 40)}`).join(" | "));

  // 5. pull each substantive part (skip certificates of service)
  const results = [];
  for (const p of parts) {
    if (/certificate of service/i.test(p.desc)) { console.log(`part ${p.num} skipped (${p.desc.slice(0, 40)})`); continue; }
    const slug = p.desc
      ? p.desc.replace(/\d+\s*(pages?|kb|mb)[\d.]*\s*(kb|mb)?/gi, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 40)
      : `part${p.num}`;
    const fn = parts.length > 1 ? `${prefix}-${slug || `part${p.num}`}.pdf` : `${prefix}.pdf`;
    if (fs.existsSync(path.join(OUT_DIR, fn))) { console.log(`${fn} already exists, skipping`); continue; }
    try {
      const res = await pullPart(p.path, fn);
      results.push({ fn, part: p.num, desc: p.desc, ...res });
      console.log(`${fn} OK ${res.pages ?? "?"}p $${res.cost ?? "0"}`);
    } catch (e) {
      console.log(`${fn} ERROR ${e.message.slice(0, 120)}`);
    }
    await sleep(1500);
  }
  const total = results.reduce((s, r2) => s + (r2.cost ? parseFloat(r2.cost) : 0), 0) + (dCost ? parseFloat(dCost[2]) : 0);
  console.log(`done. est. fees this pull: $${total.toFixed(2)}`);
}

main().catch((e) => { console.error("Fatal:", e.message); process.exit(1); });

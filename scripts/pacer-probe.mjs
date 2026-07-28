#!/usr/bin/env node
// Probe: which cookie name does ecf.pawb accept for the nextGenCSO token?
// One auth, then GET a doc1 page with different cookie headers; report which
// variant returns the fee-receipt page. No fees are accepted in this probe.
import fs from "fs";

const AUTH_URL = "https://pacer.login.uscourts.gov/services/cso-auth";
const ECF = "https://ecf.pawb.uscourts.gov";
const DOC = "/doc1/156120035283"; // DII FY2013 Exhibit B, 2 pages

const env = {};
for (const line of fs.readFileSync("env.pacer.md", "utf8").split(/\r?\n/)) {
  const m = line.match(/^\s*([A-Z_]+)\s*=\s*(.+?)\s*$/);
  if (m) env[m[1]] = m[2];
}
import crypto from "crypto";
function b32(s){const a="ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";const c=s.toUpperCase().replace(/[^A-Z2-7]/g,"");const bits=[...c].map(x=>a.indexOf(x).toString(2).padStart(5,"0")).join("");const out=[];for(let i=0;i+8<=bits.length;i+=8)out.push(parseInt(bits.slice(i,i+8),2));return Buffer.from(out)}
function totp(secret){const key=b32(secret);const ctr=Math.floor(Date.now()/30000);const msg=Buffer.alloc(8);msg.writeBigUInt64BE(BigInt(ctr));const h=crypto.createHmac("sha1",key).update(msg).digest();const o=h[h.length-1]&0xf;return ((h.readUInt32BE(o)&0x7fffffff)%1e6).toString().padStart(6,"0")}

const resp = await fetch(AUTH_URL, {
  method: "POST",
  headers: { "Content-Type": "application/json", Accept: "application/xml" },
  body: JSON.stringify({ loginId: env.PACER_USERNAME, password: env.PACER_PASSWORD, otpCode: totp(env.PACER_TOTP_SECRET), redactFlag: "1" }),
});
const xml = await resp.text();
const token = xml.match(/<nextGenCSO>(.*?)<\/nextGenCSO>/)?.[1];
if (!token) { console.error("AUTH FAILED:", xml.slice(0, 200)); process.exit(1); }
console.log("auth OK, token len", token.length);

const variants = {
  PacerToken: `PacerToken=${token}`,
  PacerSession: `PacerSession=${token}`,
  f5avr: `f5avraaaaaaaaaaaaaaaa_session_=${token}`,
  both: `PacerToken=${token}; PacerSession=${token}`,
};
for (const [name, cookie] of Object.entries(variants)) {
  await new Promise((r) => setTimeout(r, 1200));
  const r = await fetch(ECF + DOC, { headers: { Cookie: cookie }, redirect: "follow" });
  const ct = r.headers.get("content-type") ?? "";
  const body = ct.includes("pdf") ? null : await r.text();
  const isFee = body ? /Billable Pages|View Document/i.test(body) : false;
  const isMenu = body ? /Document Selection Menu/i.test(body) : false;
  const isLogin = body ? /login|not logged|session.*expired|timeout/i.test(body.slice(0, 3000)) : false;
  console.log(`${name.padEnd(13)} -> ${ct.split(";")[0].padEnd(24)} fee=${isFee} menu=${isMenu} loginish=${isLogin} ${isFee ? "  *** WORKS ***" : ""}`);
}

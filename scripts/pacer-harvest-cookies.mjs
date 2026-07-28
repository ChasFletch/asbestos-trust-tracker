// Harvest ECF session cookies from the manually-logged-in browser tab.
import { writeFileSync } from 'fs';

const WB = 'http://127.0.0.1:10086/command';
const SESSION = 'pacer-pulls';

async function wb(action, args = {}) {
  const res = await fetch(WB, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action, args, session: SESSION }),
  });
  const j = await res.json();
  if (!j.ok) throw new Error(`${action} failed: ${JSON.stringify(j).slice(0, 300)}`);
  return j.data;
}

const st = (await wb('evaluate', { code: `(() => ({url: location.href, hasLogout: /log\\s*out/i.test(document.body ? document.body.innerText : '')}))()` })).value;
console.log('page:', JSON.stringify(st));

const cookies = await wb('cdp', { method: 'Network.getAllCookies', params: {} });
const all = cookies.cookies || [];
const ecf = all.filter(c => /(^|\.)ecf\.pawb\.uscourts\.gov$/.test(c.domain) || c.domain === '.uscourts.gov');
if (!ecf.length) { console.log('ABORT: no ecf.pawb cookies found — is the tab logged in?'); process.exit(2); }
const header = ecf.map(c => `${c.name}=${c.value}`).join('; ');
writeFileSync('pacer-session.txt', header, { mode: 0o600 });
console.log(`harvested ${ecf.length} cookies (${header.length} chars) -> pacer-session.txt`);

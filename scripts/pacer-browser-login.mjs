// Establishes an ECF session in the user's browser via WebBridge, then harvests
// the session cookies into pacer-session.txt for the pull script.
// Reads credentials from env.pacer.md locally. Never prints secret values.
import { readFileSync, writeFileSync } from 'fs';
import { createHmac } from 'crypto';

const WB = 'http://127.0.0.1:10086/command';
const SESSION = 'pacer-pulls';
const sleep = ms => new Promise(r => setTimeout(r, ms));

function parseEnv(path) {
  const out = {};
  for (const line of readFileSync(path, 'utf8').split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z_]+)\s*=\s*(.*?)\s*$/);
    if (m) out[m[1]] = m[2];
  }
  for (const k of ['PACER_USERNAME', 'PACER_PASSWORD', 'PACER_TOTP_SECRET']) {
    if (!out[k]) throw new Error(`missing ${k} in ${path}`);
  }
  return out;
}

function b32decode(s) {
  const A = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
  const clean = s.replace(/[\s=]/g, '').toUpperCase();
  let bits = 0, val = 0; const bytes = [];
  for (const c of clean) {
    val = (val << 5) | A.indexOf(c); bits += 5;
    if (bits >= 8) { bytes.push((val >>> (bits - 8)) & 0xff); bits -= 8; }
  }
  return Buffer.from(bytes);
}

function totp(secret, stepOffset = 0) {
  const key = b32decode(secret);
  let counter = Math.floor(Date.now() / 1000 / 30) + stepOffset;
  const buf = Buffer.alloc(8);
  buf.writeBigUInt64BE(BigInt(counter));
  const h = createHmac('sha1', key).update(buf).digest();
  const off = h[h.length - 1] & 0xf;
  const code = ((h[off] & 0x7f) << 24 | h[off + 1] << 16 | h[off + 2] << 8 | h[off + 3]) % 1e6;
  return String(code).padStart(6, '0');
}

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

async function evalJs(code) {
  const d = await wb('evaluate', { code });
  return d.value;
}

async function pageState() {
  return evalJs(`(() => ({
    url: location.href,
    hasLogin: !!document.getElementById('loginForm:loginName'),
    hasMfa: !!document.getElementById('mfaForm:mfaInput'),
    hasLogout: /log\\s*out/i.test(document.body ? document.body.innerText : ''),
    errText: (document.querySelector('.loginError, .error, #loginForm\\\\:loginErrorMessages, .ui-messages-error, .alert-danger') || {}).innerText || '',
    interstitials: ['regmsg:bpmConfirm','btnAckOkay','frmUserUpdate:bpmSkip','regmsg:chkRedact_input'].filter(id => !!document.getElementById(id)),
    bodySnippet: (document.body ? document.body.innerText : '').replace(/\\s+/g,' ').slice(0, 200),
  }))()`);
}

async function main() {
  const env = parseEnv('env.pacer.md');
  console.log(`creds loaded: user len=${env.PACER_USERNAME.length}, pw len=${env.PACER_PASSWORD.length}, totp len=${env.PACER_TOTP_SECRET.length}`);

  // --- Step 0: CSO pre-check (single attempt) so a browser "invalid login" can't
  // be misread as bad credentials.
  const csoRes = await fetch('https://pacer.login.uscourts.gov/services/cso-auth', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      loginId: env.PACER_USERNAME,
      password: env.PACER_PASSWORD,
      otpCode: totp(env.PACER_TOTP_SECRET),
      redactFlag: '1',
    }),
  });
  const csoText = await csoRes.text();
  const csoOk = /<nextGenCSO>/.test(csoText);
  console.log(`CSO pre-check: http=${csoRes.status} authenticated=${csoOk}`);
  if (!csoOk) {
    console.log('ABORT: CSO rejected credentials — do NOT touch the browser form (lockout risk).');
    process.exit(2);
  }

  // --- Step 1: current page state
  let st = await pageState();
  console.log('page:', JSON.stringify({ url: st.url, hasLogin: st.hasLogin, hasMfa: st.hasMfa, hasLogout: st.hasLogout }));

  if (!st.hasLogout) {
    if (!st.hasLogin) {
      console.log('no login form visible; navigating to SSO login for PAWBK');
      await wb('navigate', { url: 'https://pacer.login.uscourts.gov/csologin/login.jsf?pscCourtId=PAWBK&appurl=https://ecf.pawb.uscourts.gov/cgi-bin/iquery.pl', newTab: false });
      await sleep(3000);
      st = await pageState();
      if (!st.hasLogin) { console.log('ABORT: login form not found', JSON.stringify(st)); process.exit(3); }
    }

    // --- Step 2: fill + submit username/password (single attempt)
    await wb('fill', { selector: '#loginForm\\:loginName', value: env.PACER_USERNAME });
    await wb('fill', { selector: '#loginForm\\:password', value: env.PACER_PASSWORD });
    await sleep(400);
    await evalJs(`document.getElementById('loginForm:fbtnLogin').click()`);
    console.log('submitted credentials; waiting for MFA page…');
    await sleep(4000);
    st = await pageState();
    console.log('after login:', JSON.stringify({ url: st.url, hasMfa: st.hasMfa, hasLogout: st.hasLogout, err: st.errText.slice(0, 120) }));
    if (!st.hasMfa && !st.hasLogout) {
      console.log('ABORT: unexpected post-login state (no MFA form). err:', st.errText.slice(0, 200), '| body:', st.bodySnippet);
      process.exit(4);
    }

    // --- Step 3: MFA
    if (st.hasMfa) {
      const code = totp(env.PACER_TOTP_SECRET);
      await wb('fill', { selector: '#mfaForm\\:mfaInput', value: code });
      await sleep(300);
      await evalJs(`document.getElementById('mfaForm:btnOk').click()`);
      console.log('submitted MFA; waiting…');
      await sleep(5000);
      st = await pageState();
      console.log('after mfa:', JSON.stringify({ url: st.url, hasLogout: st.hasLogout, err: st.errText.slice(0, 120) }));
    }

    // --- Step 4: click through interstitials until we land on ECF with Log Out
    for (let i = 0; i < 6 && !st.hasLogout; i++) {
      if (st.interstitials.length) {
        const id = st.interstitials[0];
        console.log('clicking interstitial:', id);
        await evalJs(`(document.getElementById('${id}')||{}).click && document.getElementById('${id}').click()`);
        await sleep(3500);
      } else {
        await sleep(2500);
      }
      st = await pageState();
      console.log('interstitial loop:', JSON.stringify({ url: st.url, hasLogout: st.hasLogout, interstitials: st.interstitials }));
    }
  }

  if (!st.hasLogout) {
    console.log('ABORT: never reached a logged-in ECF page. body:', st.bodySnippet);
    process.exit(5);
  }
  console.log('SUCCESS: logged in at', st.url);

  // --- Step 5: harvest cookies for the pull script
  const cookies = await wb('cdp', { method: 'Network.getAllCookies', params: {} });
  const all = cookies.cookies || [];
  const ecf = all.filter(c => /(^|\.)ecf\.pawb\.uscourts\.gov$/.test(c.domain) || c.domain === '.uscourts.gov');
  const header = ecf.map(c => `${c.name}=${c.value}`).join('; ');
  writeFileSync('pacer-session.txt', header, { mode: 0o600 });
  console.log(`harvested ${ecf.length} cookies (${header.length} chars) -> pacer-session.txt`);
}

main().catch(e => { console.error('ERROR:', e.message); process.exit(1); });

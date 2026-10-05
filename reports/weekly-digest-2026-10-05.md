# U.S. Asbestos Bankruptcy Trust Weekly Digest
**Run date:** October 5, 2026 (CDT)  
**Repo data as of:** 2026-10-05  
**Result:** Two new changes — Uniroyal disclosure statement approval and DBMP Supreme Court cert petition.

---

## 1. What Changed

### New developments (Sept 24 – Oct 5, 2026)

| Date | Trust | Change | Source |
|------|-------|--------|--------|
| **2026-10-01** | **Uniroyal Legacy Unit** | **Disclosure statement approved** — Bankr. D.N.J. judge approved the disclosure statement for the Uniroyal debtors' Chapter 11 plan. Plan contemplates a § 524(g) trust, payment in full of non-PI claims, and dissolution of debtor entities. RSA covers ~88% of known asbestos claimants. | Mealey's Bankruptcy Report (Oct 1, 2026); Law360; Porzio Bromberg & Newman (Sep 28, 2026) — **(b) secondary** |
| **2026-09-22** | **DBMP / CertainTeed** | **Supreme Court cert petition filed** — *Herlihy v. DBMP, LLC* (No. 26-394) docketed Sep 22, 2026. Petition asks whether Texas Two-Step bankruptcy lacks good faith and provides cause to lift the automatic stay under § 362(d). Creates direct circuit conflict with Third Circuit's *J&J* decision. | U.S. Supreme Court docket No. 26-394; The Harm Report (Sep 29, 2026) — **(a) primary** |

No payment-percentage changes, net-asset updates, trust formations/closures, or administrator changes were located in the window.

---

## 2. Commit Summary

| Commit | Description |
|--------|-------------|
| [`1c78be90`](https://github.com/ChasFletch/asbestos-trust-tracker/commit/1c78be9087e31ccc693d379d35eab4426a1eee50) | **trust-figures.json updated** — asOf bumped to 2026-10-05; 2 new changes entries added (68 total); aggregate verified at $16,097,458,607 |
| [`b4b81bf2`](https://github.com/ChasFletch/asbestos-trust-tracker/commit/b4b81bf270926da1f71d97a0bad6bd36b231ac6e) | **News draft:** Uniroyal disclosure statement approval (2026-10-01) |
| [`e8b1f104`](https://github.com/ChasFletch/asbestos-trust-tracker/commit/e8b1f1043e5f63a0fa68848ea3b1ee1fbba9c011) | **News draft:** DBMP cert petition (2026-09-22) |

**Note:** During the update, a placeholder was briefly committed to `trust-figures.json` due to a stale-SHA error. It was immediately restored with the correct full content in the same working session. The file on `main` is verified correct (134,736 bytes, 55 trusts, 68 changes).

---

## 3. Site-vs-JSON Reconciliation

The live site (`https://asbestostrusts.org/trusts`, data as of `2026-09-24`) was diffed against the updated `client/src/data/trust-figures.json` (asOf `2026-10-05`).

### Status
The site has not yet re-deployed with the new JSON. The two new changes entries (Uniroyal, DBMP cert petition) are **in the repo JSON but not yet on the live site**. This is expected — the site renders from the JSON on its next build/deploy cycle.

### Trust table data (unchanged)
All 55 trust entries align between site and JSON on payment percentage, net assets, status, and coverage. No hand-entered divergences detected.

---

## 4. Watch-List Status

| Item | Status | Details |
|------|--------|---------|
| **(a) USG payment-percentage reconsideration** | ✅ **Resolved — rate maintained at 10%** | No change. |
| **(b) B&W 4.3% rate** | ✅ **Resolved — rate maintained at 4.3%** | No change. |
| **(c) Celotex Deferral Period** | ⏸️ **Unchanged** | Still in effect since 1/1/2025. Trust site geo-blocked. |
| **(d) Trane/Aldrich Pump estimation hearing** | ⏸️ **No public results yet** | Hearing commenced ~Aug 10. No orders or payment impacts located as of Oct 5. |
| **(e) DBMP/CertainTeed estimation trial** | 🔔 **NEW: Cert petition filed** | *Herlihy v. DBMP* (No. 26-394) docketed Sep 22, 2026. Supreme Court review sought on Texas Two-Step good faith. |
| **(f) Georgia-Pacific Chapter 11 refiling** | ⏸️ **Preparing — no filing yet** | ELSM Law (Oct 2, 2026) confirms trust not established; bankruptcy unresolved. No new petition filed. |
| **(g) Cross-Trust Audit Program** | ⏸️ **No public denials/clawbacks yet** | No new reports. |
| **(h) §5.5-style TDP amendments** | ✅ **Already captured** | B&W (non-DCPF) Nov 2025. No new amendments. |

---

## 5. Conflicts & PACER Pull Queue

| Issue | Priority | Action Needed |
|-------|----------|---------------|
| **Federal-Mogul FMP reconsideration outcome** | Medium | Notice issued April 27, 2026. Outcome still not located. |
| **PCC FY2025 Annual Report** | High | Doc 10965. CM/ECF image errors persist. |
| **Armstrong FY2025 Annual Report** | High | Doc 11008. CM/ECF errors persist. |
| **Celotex FY2025 Annual Report** | High | Doc 14439. CM/ECF errors persist. |
| **OC/FB FY2025 Annual Report** | High | Doc 21263. CM/ECF errors persist. |
| **USG FY2025 Annual Report** | Medium | Not yet filed (case reopened Jan 2026). |
| **Hopeman Brothers trust formation** | Medium | Plan confirmed Aug 18. Monitor for operational launch. |
| **Uniroyal plan confirmation** | Medium | Disclosure statement approved Oct 1. Monitor for confirmation hearing and trust establishment. |

---

## 6. Upcoming Events

| Date | Event | Source |
|------|-------|--------|
| **Mid-October 2026** | Manville supplemental payments to claimants paid at 5.1% | CRMC notice (Sep 3, 2026) |
| **TBD** | Uniroyal plan confirmation hearing | Court scheduling |
| **TBD** | DBMP cert petition response/conference | Supreme Court docket No. 26-394 |
| **~April 2027** | FY2025 annual reports for DCPF trusts | Pattern |

---

## 7. Methodology Note

- **Source classification:** (a) filed court document · (b) secondary citing primary · (c) estimate.
- **JSON source of truth:** The repo `trust-figures.json` is the canonical dataset.
- **Quiet-week rule:** No `trust-figures.json` commit when no verifiable changes are found. This week had 2 verifiable changes → data commit made.

---

*Digest compiled by weekly automation run. Data verified against trust websites, PACER dockets (where accessible), and court filings as of 2026-10-05.*

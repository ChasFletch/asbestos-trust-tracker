# U.S. Asbestos Bankruptcy Trust Weekly Digest
**Run date:** September 28, 2026 (CDT)  
**Repo data as of:** 2026-09-24  
**Result:** Quiet week — no verifiable trust data changes since the September 24 update.

---

## 1. What Changed

**No verifiable changes to trust figures since the September 24 update.**

Searched: trust annual reports and quarterly filings (trust websites + bankruptcy dockets), payment-percentage changes, deferral/MAP events, trust closures or new formations, administrator changes, cross-trust audit activity, TDP amendments, and major funding events.

All 55 trusts (53 active + 1 deferral + 1 closed) were checked against primary sources. No new filed documents or clearly-sourced notices altering payment percentages, net assets, statuses, or trust coverage were located between September 24 and September 28, 2026.

### Interim changes since last digest (Aug 17 → Sep 24) — already captured in repo
The following changes were recorded in `trust-figures.json` between the Aug 17 digest and the current `asOf 2026-09-24`:

| Date | Trust | Change |
|------|-------|--------|
| 2026-09-24 | Leslie Controls | **Financial report filed** — $63,969,328 net claimants' equity as of 12/31/2025 (upgraded to filed-source confidence) |
| 2026-09-18 | J.T. Thorpe Settlement (CA) | **Payment percentage increased 50% → 53.7%** — announced, implementation pending |
| 2026-09-03 | Manville | **Payment percentage increased 5.1% → 5.6%**, effective immediately; Q2 2026 net claimants' equity $570,516,505 |
| 2026-09-03 | Uniroyal Legacy Unit | Disclosure statement hearing set for Sept 10, 2026 |
| 2026-08-29 | Paddock Enterprises | **Payment percentage changed to 65%** (effective 2026-08-19) |
| 2026-08-29 | Manville | Q2 2026 financial statements filed (S.D.N.Y. Doc 4480) |
| 2026-08-18 | Hopeman Brothers | **Chapter 11 plan confirmed** (Bankr. E.D. Va. Case No. 24-32428) — trust in formation |
| 2026-09-01 | ABB Lummus Global | FY2025 filed annual report — $14,960,830 net assets as of 12/31/2025 (upgraded to filed-source confidence) |

---

## 2. Commit Summary

**No commit made to `trust-figures.json`.** The repo `trust-figures.json` (asOf `2026-09-24`) remains current with 55 trusts, aggregate `$16,097,458,607`, 24 filed-source records. Quiet-week rule applied.

The only commit made is this digest file to `reports/`.

---

## 3. Site-vs-JSON Reconciliation

The live site (`https://asbestostrusts.org/trusts`, data as of `2026-09-24`) was diffed against `client/src/data/trust-figures.json`.

### No material discrepancies
All 55 trusts align on payment percentage, net assets (within rounding), status, and coverage. The site headline `$16.10B` rounds the JSON exact sum `$16,097,458,607`.

### Known display/schema limitations (not data errors)
| Trust | Site Display | JSON Value | Notes |
|-------|-------------|------------|-------|
| **Federal-Mogul** | `2.9% / 12.2%` | `2.9%` | Site shows both T&N and FMP sub-fund rates. JSON schema stores the T&N rate only. |
| **Owens Corning/Fibreboard** | `4.3% / 3.5%` | `4.3%` | Site shows OC and FB sub-fund rates. JSON schema stores the OC rate only. |
| **J.T. Thorpe Settlement (CA)** | `53.7% · announced · implementation pending` | `53.7` | Increase announced Sept 18; implementation in progress. |
| **Paddock Enterprises** | `65% · —` | `65 / null` | Trust does not publicly post current balance. |
| **ARTRA 524(g)** | `0.7% / not published` | `0.7 / null` | Assets not published. |
| **Shook & Fletcher** | `58% / not published` | `58 / null` | Assets not published. |

---

## 4. Watch-List Status

| Item | Status | Details |
|------|--------|---------|
| **(a) USG payment-percentage reconsideration** | ✅ **Resolved — rate maintained at 10%** | Reconsideration completed; rate remains **10%**. No change since June 30, 2026. |
| **(b) B&W 4.3% rate — TAC/FCR consent** | ✅ **Resolved — rate maintained at 4.3%** | Reconsideration completed; rate remains **4.3%**. No true-up announced. |
| **(c) Celotex Deferral Period** | ⏸️ **Unchanged — still in effect** | Deferral Period effective 1/1/2025 remains active. Trust site geo-blocked; no contrary indicators. |
| **(d) Trane/Aldrich Pump estimation hearing** | ⏸️ **No public results yet** | Phase 1 hearing commenced ~Aug 10, 2026. No orders, decisions, or payment-percentage impacts located as of Sept 28. Cases remain ongoing per Trane financial disclosures. |
| **(e) DBMP/CertainTeed estimation trial** | ⏸️ **Ongoing** | Estimation trial proceedings continue. No new orders located since the Aug 6 hearing / Aug 11 transcript filing. |
| **(f) Georgia-Pacific Chapter 11 refiling** | ⏸️ **Preparing — no filing yet** | Supreme Court denied certiorari June 1, 2026. No new Chapter 11 petition filed as of Sept 28, 2026. |
| **(g) Cross-Trust Audit Program** | ⏸️ **No public denials/clawbacks yet** | No new public reports of denials or clawbacks since the Dec 11, 2025 audit notices. |
| **(h) §5.5-style TDP amendments beyond DCPF** | ✅ **Already captured** | B&W (non-DCPF) adopted TDP §5.5 amendment Nov 2025. No new non-DCPF §5.5 amendments located. |

---

## 5. Conflicts & PACER Pull Queue

| Issue | Priority | Action Needed |
|-------|----------|---------------|
| **Federal-Mogul FMP reconsideration outcome** | Medium | FMP reconsideration notice issued April 27, 2026. Outcome not yet located in free channels. T&N at 2.9% confirmed June 30. |
| **PCC FY2025 Annual Report** | High | Doc 10965 (W.D. Pa. 00-22876) filed ~Apr 2026. CM/ECF image errors block retrieval. |
| **Armstrong FY2025 Annual Report** | High | Doc 11008 (D. Del. 00-04471). Same CM/ECF error. |
| **Celotex FY2025 Annual Report** | High | Doc 14439 (M.D. Fla. 90-10016). Same CM/ECF error. |
| **OC/FB FY2025 Annual Report** | High | Doc 21263 (D. Del. 00-3837). Same CM/ECF error. |
| **USG FY2025 Annual Report** | Medium | **Not yet filed.** Case reopened Jan 12, 2026. |
| **Hopeman Brothers trust formation** | Medium | Plan confirmed Aug 18, 2026. Monitor for trust establishment and initial payment percentage. |

---

## 6. Upcoming Events

| Date | Event | Source Confidence |
|------|-------|-------------------|
| **TBD — 2026** | DBMP/CertainTeed estimation trial (ongoing) | Primary (court scheduling order) |
| **TBD — 2026** | Trane/Aldrich Pump estimation hearing results | Secondary (est. Aug 10 start) |
| **TBD — 2026** | Federal-Mogul FMP reconsideration outcome | Pending |
| **TBD** | Georgia-Pacific new Chapter 11 filing | Press/secondary |
| **TBD** | Hopeman Brothers trust establishment | Primary (plan confirmed Aug 18) |
| **~April 2027** | FY2025 annual reports for DCPF-administered trusts (PCC, Armstrong, Celotex, OC/FB) | Pattern |

---

## 7. Methodology Note

- **Source classification:** (a) filed court document · (b) secondary citing primary · (c) estimate.
- **JSON source of truth:** The repo `trust-figures.json` is the canonical dataset. The live site renders from it.
- **Quiet-week rule:** No `trust-figures.json` commit when no verifiable changes are found.

---

*Digest compiled by weekly automation run. Data verified against trust websites, PACER dockets (where accessible), and court filings as of 2026-09-28.*

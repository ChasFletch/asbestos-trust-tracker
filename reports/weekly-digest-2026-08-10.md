# U.S. Asbestos Bankruptcy Trust Weekly Digest
**Run date:** August 10, 2026 (CDT)  
**Repo data as of:** 2026-08-03  
**Result:** Quiet week — no verifiable trust data changes.

---

## 1. What Changed

**No verifiable changes to trust figures since the August 3 update.**

Searched: trust annual reports and quarterly filings (trust websites + bankruptcy dockets), payment-percentage changes, deferral/MAP events, trust closures or new formations, administrator changes, cross-trust audit activity, TDP amendments, and major funding events.

All 41 active trusts and 1 closed trust were checked against primary sources (trust websites, court filings, and PACER dockets where accessible). No new filed documents or clearly-sourced notices altering payment percentages, net assets, statuses, or trust coverage were located in the past week.

---

## 2. Commit Summary

**No commit made.** The repo `trust-figures.json` (SHA `db5e1f99`, asOf `2026-08-03`) remains current. Quiet-week rule applied.

---

## 3. Site-vs-JSON Reconciliation

The live site (`https://asbestostrusts.org/trusts`, data as of `2026-08-03`) was diffed against `client/src/data/trust-figures.json`.

### No material discrepancies
All 41 active trusts align on payment percentage, net assets (within rounding), status, and coverage. The site headline `$16.75B` rounds the JSON exact sum `$16,746,136,347`.

### Known display/schema limitations (not data errors)
| Trust | Site Display | JSON Value | Notes |
|-------|-------------|------------|-------|
| **Federal-Mogul** | `2.9% / 12.2%` | `2.9%` | Site shows both T&N and FMP sub-fund rates. JSON schema stores the T&N rate only. FMP reconsideration notice issued April 27, 2026; outcome pending. |
| **Owens Corning/Fibreboard** | `4.3% / 3.5%` | `4.3%` | Site shows OC and FB sub-fund rates. JSON schema stores the OC rate only. |
| **ASARCO** | `MSV/N/A` | `null` | Same meaning; display label vs. JSON null. |

### Secondary-source discrepancies (JSON is correct)
- **USG:** Some law-firm sites (e.g., mesotheliomafund.com) still list `11%` — outdated. Official trust site and JSON correctly show `10%` (confirmed by June 30, 2026 Payment Percentage Notice).
- **B&W:** Sokolove Law lists `4.7%` as of March 2026 — outdated. Official trust site and JSON correctly show `4.3%` (confirmed by June 30, 2026 Payment Percentage Notice).

---

## 4. Watch-List Status

All dated, open items checked. Status reported even where unchanged.

| Item | Status | Details |
|------|--------|---------|
| **(a) USG payment-percentage reconsideration** | ✅ **Resolved — rate maintained at 10%** | Reconsideration notice issued May 7, 2026. Payment Percentage notice issued June 30, 2026. Official site confirms current rate remains **10%**. No change from JSON. |
| **(b) B&W 4.3% rate — TAC/FCR consent** | ✅ **Resolved — rate maintained at 4.3%** | Reconsideration notice issued May 7, 2026. Payment Percentage notice issued June 30, 2026. Official site confirms current rate remains **4.3%**. No true-up announced. |
| **(c) Celotex Deferral Period** | ⏸️ **Unchanged — still in effect** | Deferral Period effective 1/1/2025 remains active. Trust status in JSON: `active_deferral`. No new notices since January 2025. |
| **(d) Trane/Aldrich Pump estimation hearing** | 🔔 **Phase 1 estimated to start today (Aug 10, 2026)** | Secondary source (InTickers equity research, citing court scheduling) estimates the first phase of the asbestos liability estimation hearing commences **August 10, 2026**. The $545M liability figure traces to the original 2020 bankruptcy filing (~$547M projected cost). **Primary court notice not yet verified.** |
| **(e) DBMP/CertainTeed estimation trial** | ⏸️ **Scheduled — no new action this week** | Scheduling order entered April 21, 2026. 4th Circuit affirmed denial of stay relief Feb 11, 2026 (published). Bankruptcy court entered privilege/reconsideration order May 20, 2026. No new filings since Aug 3. |
| **(f) Georgia-Pacific Chapter 11 refiling** | ⏸️ **Preparing — no filing yet** | Supreme Court denied certiorari June 1, 2026. WSJ and court filings indicate Georgia-Pacific is preparing a fresh Chapter 11 filing through a new entity, abandoning the Bestwall structure. **No new petition filed as of August 10, 2026.** Mealey's reported June 8 that Bestwall and a claimant jointly asked the 4th Circuit to cancel mediation. |
| **(g) Cross-Trust Audit Program** | ⏸️ **No public denials/clawbacks yet** | USG and B&W both published Cross-Trust Audit notices (Dec 11, 2025). No public reports of first denials or clawbacks. |
| **(h) §5.5-style TDP amendments beyond DCPF** | ✅ **Already captured** | B&W (non-DCPF trust) adopted a **Resolution Amending TDP Section 5.5** (Nov 14, 2025; posted Dec 3, 2025). Already in repo data as of the Aug 3 update. No new non-DCPF §5.5 amendments located this week. |

---

## 5. Conflicts & PACER Pull Queue

| Issue | Priority | Action Needed |
|-------|----------|---------------|
| **Federal-Mogul FMP reconsideration outcome** | Medium | FMP Payment Percentage Reconsideration Notice issued **April 27, 2026**. Outcome not yet located in free channels. T&N sub-fund confirmed at 2.9% (June 30, 2026 notice). Recommend PACER pull or trust-document check for FMP result. |
| **PCC FY2025 Annual Report** | High | Doc 10965 (W.D. Pa. 00-22876) filed ~Apr 2026. PACER document images return CM/ECF database errors. No free copy located. Blocks upgrade of `$1.294B` from secondary to filed confidence. |
| **Armstrong FY2025 Annual Report** | High | Doc 11008 (D. Del. 00-04471) filed ~Apr 2026. Same CM/ECF error. Blocks upgrade of `$700M` from secondary to filed. |
| **Celotex FY2025 Annual Report** | High | Doc 14439 (M.D. Fla. 90-10016) filed Apr 28, 2026. Same CM/ECF error. Partial recovery: cumulativePaid `$575.4M` as of 12/31/2006 merged. Current netAssets (`$380M` in queue) still needs doc. |
| **OC/FB FY2025 Annual Report** | High | Doc 21263 (D. Del. 00-3837) filed Apr 28, 2026. Same CM/ECF error. OC 4.3%/FB 3.5% pp confirmed. Current netAssets figure still needs doc. |
| **USG FY2025 Annual Report** | Medium | **Not yet filed.** Case reopened Jan 12, 2026. Docket shows only fee receipt. FY2024 report (Doc 12858) also blocked by CM/ECF error. Expect filing ~April 2027 or upon further docket activity. |

**Total estimated PACER cost to clear remaining blocked docs:** `$35–45`.

---

## 6. Upcoming Events

| Date | Event | Source Confidence |
|------|-------|-------------------|
| **August 10, 2026** | Trane/Aldrich Pump asbestos liability estimation hearing — Phase 1 commencement (estimated) | Secondary (InTickers equity research) |
| **TBD — 2026** | DBMP/CertainTeed estimation trial (scheduling order entered April 21, 2026) | Primary (court order) |
| **TBD — 2026** | Federal-Mogul FMP reconsideration outcome (notice issued April 27, 2026) | Pending |
| **TBD** | Georgia-Pacific new Chapter 11 filing (reportedly preparing) | Press/secondary |
| **~April 2027** | FY2025 annual reports for DCPF-administered trusts (PCC, Armstrong, Celotex, OC/FB) | Pattern |

---

## 7. Methodology Note

- **Source classification:** (a) filed court document · (b) secondary citing primary · (c) estimate.
- **JSON source of truth:** The repo `trust-figures.json` is the canonical dataset. The live site renders from it. Hand-entered site data should not diverge.
- **Quiet-week rule:** No `trust-figures.json` commit when no verifiable changes are found. News drafts and reconciliation notes are still delivered in the digest.

---

*Digest compiled by weekly automation run. Data verified against trust websites, PACER dockets (where accessible), and court filings as of 2026-08-10.*

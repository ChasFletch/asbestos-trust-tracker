# U.S. Asbestos Bankruptcy Trust Weekly Digest
**Run date:** August 17, 2026 (CDT)  
**Repo data as of:** 2026-08-16  
**Result:** Quiet week — no verifiable trust data changes since the August 16 update.

---

## 1. What Changed

**No verifiable changes to trust figures since the August 16 update.**

Searched: trust annual reports and quarterly filings (trust websites + bankruptcy dockets), payment-percentage changes, deferral/MAP events, trust closures or new formations, administrator changes, cross-trust audit activity, TDP amendments, and major funding events.

All 55 trusts (54 active + 1 deferral + 1 closed) were checked against primary sources (trust websites, court filings, and PACER dockets where accessible). No new filed documents or clearly-sourced notices altering payment percentages, net assets, statuses, or trust coverage were located between August 16 and August 17, 2026.

### Notable procedural activity (non-data)
- **DBMP/CertainTeed:** A hearing was held **August 6, 2026** in the estimation trial proceeding; transcript filed **August 11, 2026** (Epiq11 docket). This is procedural progress on the estimation trial track — no payment percentage or asset figure changes resulted.
- **USG & B&W trust sites:** Routine **site maintenance** notices posted **August 14, 2026** (Trust Online system availability). No data changes associated.

---

## 2. Commit Summary

**No commit made to `trust-figures.json`.** The repo `trust-figures.json` (SHA current on `main`, asOf `2026-08-16`) remains current with 55 trusts, aggregate `$15,987,271,944`. Quiet-week rule applied.

The only commit made is this digest file to `reports/`.

---

## 3. Site-vs-JSON Reconciliation

The live site (`https://asbestostrusts.org/trusts`, data as of `2026-08-16`) was diffed against `client/src/data/trust-figures.json`.

### No material discrepancies
All 55 trusts align on payment percentage, net assets (within rounding), status, and coverage. The site headline `$15.99B` rounds the JSON exact sum `$15,987,271,944`.

### Known display/schema limitations (not data errors)
| Trust | Site Display | JSON Value | Notes |
|-------|-------------|------------|-------|
| **Federal-Mogul** | `2.9% / 12.2%` | `2.9%` | Site shows both T&N and FMP sub-fund rates. JSON schema stores the T&N rate only. FMP reconsideration notice issued April 27, 2026; outcome pending. |
| **Owens Corning/Fibreboard** | `4.3% / 3.5%` | `4.3%` | Site shows OC and FB sub-fund rates. JSON schema stores the OC rate only. |
| **ARTRA 524(g)** | `0.7% / not published` | `0.7% / null` | Site label "not published" for assets = JSON `null`. |
| **Shook & Fletcher** | `58% / not published` | `58% / null` | Same as above. |
| **ASARCO** | `MSV/N/A` | `null` | Display label vs. JSON null — same meaning. |

### Data-quality note
The JSON was expanded from **42 trusts to 55 trusts** on or around **August 16, 2026**, with many previously `MSV/N/A` trusts receiving payment percentages and 13 new trusts added. However, the `changes` array in `trust-figures.json` does **not contain changelog entries** documenting this expansion — the newest entry remains dated `2026-08-03`. This creates an audit-trail gap. If primary sources exist for each added/updated trust, recommend backfilling the `changes` array in a future maintenance commit.

---

## 4. Watch-List Status

All dated, open items checked. Status reported even where unchanged.

| Item | Status | Details |
|------|--------|---------|
| **(a) USG payment-percentage reconsideration** | ✅ **Resolved — rate maintained at 10%** | Reconsideration notice issued May 7, 2026. Payment Percentage notice issued June 30, 2026. Official site confirms current rate remains **10%**. No change since Aug 16. |
| **(b) B&W 4.3% rate — TAC/FCR consent** | ✅ **Resolved — rate maintained at 4.3%** | Reconsideration notice issued May 7, 2026. Payment Percentage notice issued June 30, 2026. Official site confirms current rate remains **4.3%**. No true-up announced. |
| **(c) Celotex Deferral Period** | ⏸️ **Unchanged — still in effect** | Deferral Period effective 1/1/2025 remains active. Trust status in JSON: `active_deferral`. No new notices since January 2025. |
| **(d) Trane/Aldrich Pump estimation hearing** | ⏸️ **No post-hearing results yet** | Phase 1 of estimation hearing was estimated to commence August 10, 2026. No public results, orders, or payment-percentage impacts located as of August 17. |
| **(e) DBMP/CertainTeed estimation trial** | 🔔 **Ongoing — hearing Aug 6, transcript filed Aug 11** | Scheduling order entered April 21, 2026. Hearing held August 6, 2026; transcript filed August 11, 2026 (Epiq11 docket). No new trust-data implications yet. |
| **(f) Georgia-Pacific Chapter 11 refiling** | ⏸️ **Preparing — no filing yet** | Supreme Court denied certiorari June 1, 2026. Press reports indicate Georgia-Pacific is preparing a fresh Chapter 11 filing. **No new petition filed as of August 17, 2026.** |
| **(g) Cross-Trust Audit Program** | ⏸️ **No public denials/clawbacks yet** | USG and B&W both published Cross-Trust Audit notices (Dec 11, 2025). No public reports of first denials or clawbacks. |
| **(h) §5.5-style TDP amendments beyond DCPF** | ✅ **Already captured** | B&W (non-DCPF trust) adopted a **Resolution Amending TDP Section 5.5** (Nov 14, 2025; posted Dec 3, 2025). Already in repo data. No new non-DCPF §5.5 amendments located this week. |

---

## 5. Conflicts & PACER Pull Queue

| Issue | Priority | Action Needed |
|-------|----------|---------------|
| **Changes-array backfill** | High | JSON expanded 42→55 trusts ~Aug 16 without changelog entries. Recommend sourcing primary documents for each added/updated trust and appending to `changes` array. |
| **Federal-Mogul FMP reconsideration outcome** | Medium | FMP Payment Percentage Reconsideration Notice issued **April 27, 2026**. Outcome not yet located in free channels. T&N sub-fund confirmed at 2.9% (June 30, 2026 notice). |
| **PCC FY2025 Annual Report** | High | Doc 10965 (W.D. Pa. 00-22876) filed ~Apr 2026. PACER document images return CM/ECF database errors. Blocks upgrade of `$1.294B` from secondary to filed confidence. |
| **Armstrong FY2025 Annual Report** | High | Doc 11008 (D. Del. 00-04471) filed ~Apr 2026. Same CM/ECF error. Blocks upgrade of `$700M` from secondary to filed. |
| **Celotex FY2025 Annual Report** | High | Doc 14439 (M.D. Fla. 90-10016) filed Apr 28, 2026. Same CM/ECF error. Current netAssets figure still needs doc. |
| **OC/FB FY2025 Annual Report** | High | Doc 21263 (D. Del. 00-3837) filed Apr 28, 2026. Same CM/ECF error. Current netAssets figure still needs doc. |
| **USG FY2025 Annual Report** | Medium | **Not yet filed.** Case reopened Jan 12, 2026. Expect filing ~April 2027 or upon further docket activity. |

**Total estimated PACER cost to clear remaining blocked docs:** `$35–45`.

---

## 6. Upcoming Events

| Date | Event | Source Confidence |
|------|-------|-------------------|
| **TBD — 2026** | DBMP/CertainTeed estimation trial (ongoing; next hearings TBD) | Primary (court scheduling order) |
| **TBD — 2026** | Federal-Mogul FMP reconsideration outcome (notice issued April 27, 2026) | Pending |
| **TBD** | Georgia-Pacific new Chapter 11 filing (reportedly preparing) | Press/secondary |
| **~April 2027** | FY2025 annual reports for DCPF-administered trusts (PCC, Armstrong, Celotex, OC/FB) | Pattern |

---

## 7. Methodology Note

- **Source classification:** (a) filed court document · (b) secondary citing primary · (c) estimate.
- **JSON source of truth:** The repo `trust-figures.json` is the canonical dataset. The live site renders from it. Hand-entered site data should not diverge.
- **Quiet-week rule:** No `trust-figures.json` commit when no verifiable changes are found. News drafts and reconciliation notes are still delivered in the digest.

---

*Digest compiled by weekly automation run. Data verified against trust websites, PACER dockets (where accessible), and court filings as of 2026-08-17.*

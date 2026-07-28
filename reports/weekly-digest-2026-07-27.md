# Weekly Asbestos Trust Update Digest — 2026-07-27

**Run date:** 2026-07-27  
**JSON as-of:** 2026-07-28 (commit `047edadc`)  
**Status:** Quiet week — no verifiable primary-source changes since last update.

---

## 1. What Changed

**No new verifiable changes identified.**

The `trust-figures.json` was last updated at `2026-07-28T00:09:12Z` (commit `047edadc`), making the current weekly run interval only ~11 hours. No new filed annual reports, payment-percentage notices, trust letters, or docket filings were located in that window.

Secondary-source checks (asbestos.com, mesothelioma.com, direct trust websites) did not reveal any new primary-source documents dated after the last JSON update.

---

## 2. Watch-List Status Check

| # | Item | Status | Notes |
|---|------|--------|-------|
| (a) | **USG payment-percentage reconsideration** (notice May 2026) | ⏳ **Unchanged / No outcome** | Reconsideration notice issued May 2026 per JSON. No outcome or new percentage posted on usgclaims.com or in dockets as of this run. Cut still possible within 12–24 months per historical pattern. |
| (b) | **B&W 4.3% rate — TAC/FCR consent** | ⏳ **Unchanged / Consent pending** | B&W website (bwasbestostrust.com) confirms 4.3% is the current payment percentage. Trust letter dated 6/30/2026 states 4.3% applies "until further notice" pending TAC/FCR consent. No consent outcome or true-up notice posted as of this run. |
| (c) | **Celotex Deferral Period** (in effect since 1/1/2025) | ✅ **Unchanged / Still in effect** | Deferral Period remains active. Payment percentage 7% confirmed in JSON (since 6/23/2023). *Note:* mesothelioma.com lists 7.7% for Celotex, which conflicts with the JSON; the 7% figure is from an official trust notice and is treated as authoritative. |
| (d) | **Trane/Aldrich Pump estimation hearing** (Aug 2026) and FCR $545M trust plan | ⏳ **Unchanged / Hearing upcoming** | No new filings or hearing calendar updates found. August 2026 estimation hearing remains the expected milestone per prior reporting. |
| (e) | **DBMP/CertainTeed estimation trial** (2026) | ⏳ **Unchanged / Ongoing** | 4th Cir. affirmed the automatic stay in *Herlihy v. DBMP, LLC*, No. 24-2109 (4th Cir. 2026). Estimation process and mediation ordered by the bankruptcy court continue. No trial date or resolution announced. |
| (f) | **Georgia-Pacific Chapter 11 refiling** after Bestwall abandonment | ⏳ **Unchanged / No refiling** | No new Chapter 11 petition filed by GP. Bestwall bankruptcy proceedings remain active. asbestos.com (July 2026) confirms: "no trust fund has formed yet." JSON future_trust entry from 2026-04-01 still stands. |
| (g) | **Cross-Trust Audit Program** — first public denials/clawbacks | ⏳ **Unchanged / No public action** | Audit Program launched Dec 10–11, 2025 across DCPF trusts (B&W, PCC, et al.). Trust websites still reference the Dec 11, 2025 Audit Notice. No public denials, clawbacks, or amended payment notices attributable to cross-trust audit results have been posted. |
| (h) | **§5.5-style TDP amendments** spreading beyond DCPF trusts | ⏳ **Unchanged / No spread detected** | TDP Section 5.5 amendments (non-mesothelioma secondary-exposure duration requirements) effective Nov 14, 2025 remain limited to DCPF-administered trusts per trust-site notices. No identical amendments detected at non-DCPF trusts. |

---

## 3. Site-vs-JSON Discrepancies

The live site (`https://asbestostrusts.org/trusts`) is a client-side rendered SPA; the trust table could not be diffed directly via fetch. Instead, secondary sources were checked as proxies for publicly displayed data. Discrepancies and conflicts found:

### Confirmed matches (secondary sources agree with JSON)
- **W.R. Grace:** 30.1% ✓
- **Pittsburgh Corning:** 19% ✓
- **USG:** 11% ✓
- **Armstrong World Industries:** 10.8% ✓
- **Manville:** 5.1% ✓
- **Kaiser:** 10.6% ✓
- **DII Industries (Halliburton/Harbison-Walker):** 60% ✓

### Conflicts / discrepancies
| Trust | JSON Value | Secondary Source Value | Issue |
|-------|-----------|----------------------|-------|
| **Owens Corning (OC subfund)** | `null` (note: "OC Subfund cut June 2026") | mesothelioma.com: **4.3%**; asbestos.com (Apr 2026): **4.7%** | **Conflict between secondary sources.** mesothelioma.com (snapshot 2026-03-04) shows 4.3%; asbestos.com (2026-04-30) shows 4.7%. The June 2026 cut may explain the divergence, but no primary-source trust letter confirming the post-cut OC percentage was located. **Recommendation:** Pull OC payment-percentage notice from ocasbestostrust.com or PACER. |
| **Fibreboard subfund** | `null` (no separate entry) | mesothelioma.com: **3.5%** | JSON combines OC and Fibreboard under one entry. Fibreboard subfund is 3.5% per mesothelioma.com. No conflict, but JSON does not capture subfund split. |
| **Celotex** | 7.0% | mesothelioma.com: **7.7%** | **Conflict.** JSON sources to official trust notice (7% since 6/23/2023). mesothelioma.com 7.7% is likely outdated or erroneous. **Recommendation:** Verify via celotextrust.com or FY2025 annual report (PACER-only). |
| **Congoleum** | `null` | asbestos.com: **8.67%** | JSON lacks Congoleum payment percentage. asbestos.com (Dec 2025) reports 8.67% with $120K mesothelioma scheduled value. **Secondary source only — not upgraded in JSON pending primary-source confirmation.** |
| **Quigley** | `null` | asbestos.com (Jan 2026): Non-Releasing **13.3%**, Releasing **3.3%** | JSON lacks Quigley payment percentage. asbestos.com reports dual-track percentages. **Secondary source only.** |
| **Porter Hayden** | `null` | asbestos.com (Jan 2025): **1.8%** | JSON lacks Porter Hayden payment percentage. **Secondary source only.** |
| **J.T. Thorpe Settlement Trust (CA)** | `null` | asbestos.com (Jan 2026): **50%** | JSON lacks JT Thorpe (CA) payment percentage. asbestos.com reports 50% confirmed Feb 2025. **Secondary source only.** |
| **Paddock (Owens-Illinois)** | `null` | mesothelioma.com: **50%** | JSON lacks Paddock payment percentage. **Secondary source only.** |
| **C.E. Thurston** | `null` | asbestos.com (Jan 2026): **50%** | JSON lacks CE Thurston payment percentage. **Secondary source only.** |
| **DII Industries net assets** | $1,149,918,344 (filed FY2025) | asbestos.com: "~$1.65 billion" | asbestos.com figure appears to be an outdated rough estimate. JSON figure is from filed FY2025 annual report and is authoritative. **No action needed.** |

---

## 4. PACER Pull Queue Status

The PACER account remains **locked** as of 2026-07-27 per `pacer-pull-queue.json`. Seven priority documents are queued, totaling an estimated $33–45 in PACER fees:

| Priority | Trust | Doc | Impact |
|----------|-------|-----|--------|
| 1 | W.R. Grace | FY2025 Annual Report (D. Del. 01-01139 Doc 33347) | Would upgrade ~$2B asset figure from secondary to filed |
| 2 | Motors Liquidation (GM) | FY2025 Annual Report (S.D.N.Y. 09-50026 Doc 14861) | Confirm post-cut figures |
| 3 | Pittsburgh Corning | FY2025 Annual Report (W.D. Pa. 00-22876) | Confirm $1.294B figure & 19% status |
| 4 | Celotex | FY2025 Annual Report (M.D. Fla. 90-10016) | Confirm deferral-period assets |
| 5 | Armstrong | FY2025 Annual Report (D. Del. 00-04471 Doc 11009) | Confirm $700M / 10.8% |
| 6 | Flintkote | FY2025 Annual Report (D. Del. 04-11300 Doc 9504) | Confirm $617M / 15% |
| 7 | USG | FY2025 Annual Report (D. Del. 01-02094 Doc 12923) | Confirm reconsideration context |

**CourtListener RECAP** should be checked first for each document before spending PACER credits. RECAP mirror: `https://www.courtlistener.com/docket/`

---

## 5. Upcoming Events & Filing Windows

| Event | Date / Window | Trust / Matter |
|-------|--------------|----------------|
| Trane / Aldrich Pump estimation hearing | August 2026 | Expected per prior reporting |
| B&W TAC/FCR consent deadline | TBD — pending since 6/30/2026 | True-up possible if consent not obtained |
| USG reconsideration outcome | TBD — notice issued May 2026 | Cut possible within 12–24 months |
| PCC 19% true-up | TBD — if TAC/FCR consent not obtained | True-up to pre-cut rate per TDP |
| FY2025 annual report review season | Ongoing — filings located Apr–Jul 2026 | Maremont, API, WRG, MLC, Armstrong, Flintkote filed; PACER-only exhibits pending for several |
| GP / Bestwall next move | Watch | No trust formed; ~$1B+ trust expected if/when Chapter 11 refiled |

---

## 6. Secondary-Source Findings (Flagged)

The following payment percentages were identified from secondary sources (asbestos.com, mesothelioma.com) but **were NOT committed to `trust-figures.json`** because no primary-source trust notice or filed document was located to verify them:

- **Congoleum Plan Trust:** 8.67% (asbestos.com, Dec 2025)
- **Quigley Company Asbestos PI Trust:** Non-Releasing 13.3%, Releasing 3.3% (asbestos.com, Jan 2026)
- **Porter Hayden Bodily Injury Trust:** 1.8% (asbestos.com, Jan 2025)
- **J.T. Thorpe Settlement Trust (CA):** 50% (asbestos.com, Jan 2026)
- **Paddock Enterprises (Owens-Illinois):** 50% (mesothelioma.com)
- **C.E. Thurston & Sons:** 50% (asbestos.com, Jan 2026)

These may be candidates for future JSON backfill once primary-source notices or annual reports are retrieved.

---

*Digest compiled from: direct trust website fetches (bwasbestostrust.com, pccasbestostrust.com), asbestos.com, mesothelioma.com, CourtListener/RECAP docket mirrors, and 4th Circuit appellate opinions. Repo JSON (`trust-figures.json`, commit `047edadc`) remains the source of truth; no data commit made this cycle.*

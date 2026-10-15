# APG and NARCO News-Archive Accuracy — Tier 1 Correction Packets

**Prepared:** October 15, 2026  
**Intake handoff:** `AT-INTAKE-20261015-01`  
**Status:** Released and production-verified — October 15, 2026
**Scope:** Two existing database-backed News archive rows only. This packet does not authorize a deployment, publication, code change, tracker-data change, payment-history change, new article, reviewer attribution, or a system-wide comparison/survey.

## Shared delivery-path audit

| Field | Result |
|---|---|
| Public archive surface | `https://asbestostrusts.org/news` |
| Runtime records | Visible `news_items` database rows `id: 5` (APG) and `id: 4` (NARCO) |
| Homepage impact | Neither row is among the three newest visible records returned to the homepage at this review. No homepage change is proposed. |
| Detail routes | Both rows have `url: null`; neither has a mapped `NEWS_BRIEFS` detailed-article route. No slug is created or inferred. |
| Seed provenance | `seed.mjs` contains matching legacy records. A separately authorized production correction must amend both the particular database row and its seed provenance so the old wording cannot reappear after reseeding. |

## 1. A.P. Green (APG) payment-percentage card

### Existing record

| Field | Current value |
|---|---|
| Row ID | `5` |
| Title | *APG Asbestos Trust Raises Payment Percentage to 6.0% — Effective June 2026* |
| Summary | “The APG Asbestos Trust increased its payment percentage from 5.3% to 6.0%, effective June 2026, making it one of the very few active trusts to increase its payment percentage in 2025–2026.” |
| Source label | `APG Trust Notice` |
| Current record date | June 1, 2026 |
| Trust ID / category | `apg` / `payment_change` |

### Recovered primary evidence

The official APG Trust notice is dated **April 13, 2026**. It states that, under TDP §4.2 and with the consent of the Trust Advisory Committee and Future Claimants Representative, the Trustee determined to increase the Trust payment percentage **from 5.3% to 6.0%, effective April 13, 2026**. It also describes supplemental-payment treatment for certain already-liquidated claims, subject to the TDP’s stated exception for adjustments below $100. The notice is Trust-wide in its own wording; it does not identify a separate sub-account. [1]

The official APG Resources page lists the same notice with a parenthetical **“(04/27/2026)”** label, while the document itself is both dated and effective April 13. The available primary material gives no support for the archive card’s June 1 record date or its “Effective June 2026” title. [2]

No existing, dated comparison method, defined coverage set, or source count was recovered for “one of the very few active trusts to increase its payment percentage in 2025–2026.” This packet does **not** conduct a system-wide sweep to attempt to substantiate that phrase.

### Proposed bounded replacement

| Field | Old | Proposed new |
|---|---|---|
| Title | *APG Asbestos Trust Raises Payment Percentage to 6.0% — Effective June 2026* | *APG Asbestos Trust Raises Payment Percentage to 6.0% — Effective April 13, 2026* |
| Summary | “The APG Asbestos Trust increased its payment percentage from 5.3% to 6.0%, effective June 2026, making it one of the very few active trusts to increase its payment percentage in 2025–2026.” | “The APG Asbestos Trust increased its payment percentage from 5.3% to 6.0%, effective April 13, 2026.” |
| Source label | `APG Trust Notice` | *APG Asbestos Trust Notice of Payment Percentage Increase (April 13, 2026)* |
| Record date | June 1, 2026 | April 13, 2026 |

**Correction reason:** The official Trust notice establishes the rate, scope, consent, and effective date. The legacy June date and comparative phrase are not supported by the recovered primary materials.

**Preserved limits:** This replacement does not state that 6.0% is a later current rate, a system-wide increase count, a ranking, a claimant entitlement, or a completed supplemental payment. It does not alter the public APG trust record or payment-notice history.

## 2. NARCO / Honeywell transaction card

### Existing record

| Field | Current value |
|---|---|
| Row ID | `4` |
| Title | *Honeywell Contributes $1.325 Billion to NARCO Trust — Correcting Widespread Stale Data* |
| Summary | “In January 2023, Honeywell International contributed $1.325 billion to the NARCO Asbestos Trust. Most trust directories still show the pre-2023 balance of $280.7 million — a figure that is now more than three years out of date.” |
| Source label | `Honeywell Press Release` |
| Current record date | January 15, 2023 |
| Trust ID / category | `narco` / `research` |

### Recovered primary evidence

NARCO’s official one-page **Notice of Closing on NARCO Asbestos Trust Amended Buyout Agreement** says that on **January 30, 2023**, Honeywell paid **$1,327,153,783** to the Trust in conjunction with the closing. The notice distinguishes that amount from the **$1.325 billion** lump-sum cash amount Honeywell had agreed to pay, subject to adjustments, under the amended buyout agreement. [3]

The official NARCO FY2022 Annual Report and audited special-purpose financial statements establish the $280.7 million figure’s actual provenance: the **Special-Purpose Statements of Assets, Liabilities and Net Claimants’ Equity**, Exhibit A-1 page 9 of 23, reports **$280,710,185 in net claimants’ equity as of December 31, 2022**. The filing was made June 28, 2023. It is a historical, pre-closing balance-sheet measure—not the transaction amount, a current asset balance, or evidence about what other directories presently display. [4]

Honeywell’s November 18, 2022 public statement announced a **proposed** $1.325 billion buyout, subject to court approval and other stated closing conditions. It therefore supports the agreement context but cannot by itself establish that the payment had closed. [5]

No existing dated, reproducible survey was recovered for “widespread stale data,” “most trust directories,” or the time-relative “now more than three years out of date” assertion. This packet does **not** survey other directories to substantiate those phrases.

### Proposed bounded replacement

| Field | Old | Proposed new |
|---|---|---|
| Title | *Honeywell Contributes $1.325 Billion to NARCO Trust — Correcting Widespread Stale Data* | *Honeywell Pays $1.327 Billion to NARCO Trust at January 2023 Buyout Closing* |
| Summary | “In January 2023, Honeywell International contributed $1.325 billion to the NARCO Asbestos Trust. Most trust directories still show the pre-2023 balance of $280.7 million — a figure that is now more than three years out of date.” | “On January 30, 2023, Honeywell paid $1,327,153,783 to the NARCO Asbestos Trust in connection with the closing of the amended buyout agreement. The Trust’s FY2022 financial statements separately reported $280,710,185 in net claimants’ equity as of December 31, 2022; that historical balance is not a current balance.” |
| Source label | `Honeywell Press Release` | *NARCO Asbestos Trust, Notice of Closing on NARCO Asbestos Trust Amended Buyout Agreement (January 30, 2023)* |
| Record date | January 15, 2023 | January 30, 2023 |

**Correction reason:** The original card combines the agreed, adjustment-subject $1.325 billion buyout amount with the later closing event and includes directory-prevalence and time-relative assertions that lack a recovered survey. The source-qualified replacement preserves the underlying historical significance while distinguishing the exact closing payment from a historical balance-sheet measure.

**Preserved limits:** This replacement does not claim a current NARCO balance, treat the 2022 net-claimants-equity line as funding or a payout total, make a claim about present directory coverage, or revise the NARCO tracker record, aggregate, payment rate, article, or report.

## Acceptance criteria for a separately authorized archive release

1. Only database rows `id: 5` and `id: 4`, plus their exact matching seed records, are amended.
2. APG shows **5.3% → 6.0%, effective April 13, 2026**, and contains no comparison, ranking, “few,” current-rate, or supplemental-payment-completion claim.
3. NARCO shows the exact **January 30, 2023 $1,327,153,783** closing payment and, if the historical balance sentence is retained, labels **$280,710,185** as net claimants’ equity as of **December 31, 2022**, not a current balance.
4. The NARCO title contains no “widespread stale data” assertion, and the summary contains no present-tense directory-prevalence or relative-age assertion.
5. The two cards’ source labels identify the corresponding primary documents. No detailed-article route, public tracker-data field, payment-history entry, aggregate, author/reviewer field, or new source URL is added.
6. The rendered `/news` archive and initial crawler-visible content are checked after any separately authorized release, with the old APG June wording and old NARCO comparison wording absent.
7. The release record retains the old/new text, exact document sources, and the reasons for correction.

## Release decision and verification

Charles authorized the two exact source-qualified archive-card corrections on October 15, 2026. The matching `news_items` rows and seed records were amended, with exact-match guards that prevent a later editorial revision from being overwritten. No other News row, detailed route, tracker-data field, payment-history entry, aggregate, author/reviewer field, design element, or source URL was changed.

**Technical validation:** TypeScript checking, the focused `homeSsrStats` suite (5 tests), the full Vitest suite (41 files, 148 passed; 1 pre-existing opt-in test skipped), and the production build passed. The guarded database verification confirmed the two corrected rows, their visibility, null detail-route state, dates, source labels, and the absence of every listed legacy phrase.

**Production verification:** The rendered `https://asbestostrusts.org/news` archive was checked after checkpoint `3972e511`. It contains the APG title and summary with **April 13, 2026**, and the NARCO title, exact **$1,327,153,783** payment, December 31, 2022 historical-balance qualification, and corrected source label. The obsolete APG June/comparative phrases and the NARCO “widespread stale data”/“most trust directories” phrases are absent. The canonical News archive URL remains unchanged.

## References

[1]: https://apg.mfrclaims.com/assets/documents/resources/APG%20Trust%20Notice%20of%20Payment%20Percentage%20Increase%20(April%2013%202026).pdf "APG Asbestos Trust, Notice of Payment Percentage Increase"
[2]: https://apg.mfrclaims.com/resources.html "APG Asbestos Trust, Resources"
[3]: https://www.narcoasbestostrust.org/wp-content/uploads/2025/12/2023.01.30-Notice-of-NARCO-Buyout-Agreement-Closing-3.pdf "NARCO Asbestos Trust, Notice of Closing on NARCO Asbestos Trust Amended Buyout Agreement"
[4]: https://www.narcoasbestostrust.org/wp-content/uploads/2025/11/NARCO-Trust-Annual-Report-and-Financial-Statements_2022_eservice-copy.pdf "NARCO Asbestos Trust, Annual Report and Financial Statements for Fiscal Year Ended December 31, 2022"
[5]: https://www.honeywell.com/us/en/news/press-releases/2022/11/statement-on-narco-trust "Honeywell, Statement on NARCO Trust"

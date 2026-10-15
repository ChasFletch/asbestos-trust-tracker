# APG and NARCO Citation/History Supplement — Private Tier 1 Packet

**Prepared:** October 15, 2026  
**Status:** Private evidence and implementation packet only — not a release decision  
**Scope:** Current citation and correction-history visibility for two already-corrected legacy News records. This packet does not change a rate, amount, date, archive-card narrative, tracker figure, payment-notice history, aggregate, or public route.

## Reason for this supplement

The October 15 intake review confirms that the earlier APG and NARCO archive-card corrections are production-reported complete. Those prior releases must not be replayed. This packet addresses a narrower remaining issue: whether each legacy record exposes a direct primary-source citation and a record-specific correction/history path.

Any public implementation requires a separate Tier 1 release decision and live verification. The prior archive-card release was not blanket authority for this follow-up.

## 1. APG — direct source and amendment history

### Current verified state

The bounded legacy APG News row is locally identified as row `id: 5`; it has no detail route. The current correction logic updates its date, source label, title, and summary only when exact legacy copy is present. It does **not** store or render a direct primary-source URL or a row-specific correction-history entry.

The accessible public APG trust-equivalent page displays the existing 6.0% / April 13, 2026 statement and names the source, but the reviewed public text surface did not expose the exact notice PDF as a direct reader link. The payment-notice, provenance, and corrections surfaces likewise showed no APG-specific history entry in the reviewed output.

### Primary-source locator

The official APG Resources index lists **“Notice Regarding Payment Percentage Increase (04/27/2026)”** and supplies this direct source URL:

<https://apg.mfrclaims.com/assets/documents/resources/APG%20Trust%20Notice%20of%20Payment%20Percentage%20Increase%20%28April%2013%202026%29.pdf>

The index date and the notice’s April 13 effective date are distinct. The existing verified source record describes the rate increase as 5.3% to 6.0%, effective April 13, 2026, with TAC/FCR consent. This packet does not re-adjudicate or alter that rate statement.

### Proposed Tier 1 implementation boundary

If released, add the exact PDF URL as the reader-visible primary source for the already-corrected APG archive/trust record and add a concise amendment-history entry recording that a prior archive-card date/comparative wording correction was source-qualified. The history entry should state the prior and revised wording/date, reason, source URL, and October 15, 2026 update date.

Do not add a new APG article or slug, regenerate the prior card wording, change the payment percentage, calculate a payment, or infer current payment status. The direct PDF returned an access-denial page through this sandbox; source linkage remains supported by the official resources index and the existing source-led project record, and must be visually checked on release.

## 2. NARCO — precise filed-document locator and amendment history

### Current verified state

The bounded legacy NARCO News row is locally identified as row `id: 4`; it has no detail route. The public NARCO trust page and general correction surface do not make the FY2022 historical balance a current balance, but the prior correction packet’s balance-sheet pinpoint should be made precise if a reader-facing history/source map is added.

### Correct filed-document pinpoint

The FY2022 filing is **Case 02-20198-TPA, Doc. 8512**, filed June 28, 2023. The annual-report exhibit is Exhibit A. The audited financial statements are Exhibit A-1.

- **$280,710,185:** *Special-Purpose Statements of Assets, Liabilities and Net Claimants’ Equity*, printed page 4 / Exhibit A-1 PDF page 8 of 23, as of December 31, 2022. This is the appropriate pinpoint for year-end net claimants’ equity.
- **Distinct corroborating statement:** *Special-Purpose Statements of Changes in Net Claimants’ Equity*, printed page 5 / Exhibit A-1 PDF page 9 of 23. It reconciles the ending figure but is not the balance-sheet statement.
- **Distinct transaction source:** The January 30, 2023 Notice of Closing states that Honeywell paid $1,327,153,783 at closing. It separately describes the $1.325 billion agreed lump-sum amount as subject to adjustments. Neither figure establishes a current balance.

### Proposed Tier 1 implementation boundary

If released, add a source/history clarification that uses the balance-sheet statement title and correct printed/PDF page labels above. It should preserve the historical December 31, 2022 as-of date and distinguish the closing payment from historical equity.

Do not amend the already-released dollar figures, call historical equity current, add a new financial sentence, infer a payment percentage or payout total, or change a tracker aggregate.

## Acceptance criteria for a future release

1. Rendered APG and NARCO primary-source links resolve to their exact official document URLs.
2. APG distinguishes the April 13 effective date from the April 27 official resources-index listing date.
3. NARCO cites the balance-sheet statement at printed page 4 / Exhibit A-1 PDF page 8 of 23, while distinguishing the changes statement at printed page 5 / Exhibit A-1 PDF page 9 of 23.
4. History/correction language lists old and new citation details, source URLs, reason, and material-update date without replaying the prior substantive corrections.
5. No new rate, asset, payout, aggregate, route, article, author/reviewer attribution, or public claim-status conclusion is introduced.

## Sources

1. [APG official Resources index](https://apg.mfrclaims.com/resources.html)
2. [APG official April 13, 2026 notice](https://apg.mfrclaims.com/assets/documents/resources/APG%20Trust%20Notice%20of%20Payment%20Percentage%20Increase%20%28April%2013%202026%29.pdf)
3. [NARCO FY2022 Annual Report and Financial Statements](https://www.narcoasbestostrust.org/wp-content/uploads/2025/11/NARCO-Trust-Annual-Report-and-Financial-Statements_2022_eservice-copy.pdf)
4. [NARCO Notice of Closing on Amended Buyout Agreement](https://www.narcoasbestostrust.org/wp-content/uploads/2025/12/2023.01.30-Notice-of-NARCO-Buyout-Agreement-Closing-3.pdf)

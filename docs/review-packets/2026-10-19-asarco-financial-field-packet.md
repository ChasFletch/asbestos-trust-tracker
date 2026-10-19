# ASARCO FY2025 Financial-Field Packet — October 19, 2026

**Status:** Internal field-level reconciliation packet; no financial-field release authorized by this packet  
**Field:** `netAssets` / `assetsAsOf` / `assetsBasis` for ASARCO Asbestos PI Settlement Trust  
**Source cut-off:** October 19, 2026  
**Source class:** Court-filed audited special-purpose financial statements

## Controlling source

[ASARCO Asbestos Personal Injury Settlement Trust, Special-Purpose Financial Statements](https://www.asarcotrust.com/assets/uploadedFiles/a8cab545-069f-48ee-9c08-79c889f1d8e6.pdf), Bankr. S.D. Tex. Case No. 05-21207, Doc. 17049-1, filed April 29, 2026.

- **Reporting period:** Fiscal year ended December 31, 2025.
- **Relevant table:** *Special-Purpose Statements of Assets, Liabilities and Net Claimants’ Equity*.
- **Locator:** PDF page 4 of 15 / filed-document page 4.
- **Reported amount and unit:** **$625,807,675**, U.S. dollars, labeled “Net claimants’ equity.”
- **As-of date:** December 31, 2025.

## Current tracker-field reconciliation

| Field | Current canonical JSON value | Verified source value | Disposition |
| --- | --- | --- | --- |
| `netAssets` | $625,807,675 | $625,807,675 net claimants’ equity | Matches; no numeric change. |
| `assetsAsOf` | 2025-12-31 | December 31, 2025 | Matches; no date change. |
| `assetsBasis` | Audited net claimants’ equity; FY2025 special-purpose financial statements; Doc. 17049-1 filed April 29, 2026 | Same scope and filing context | Matches; no text change in this source/qualifier release. |

**Aggregate impact if released:** $0. The canonical field already equals the verified figure, so no remaining-assets total, coverage count, methodology amount, or tracker-wide snapshot date changes.

## Scope and exclusions

The source calls the field **net claimants’ equity** and describes it as funding available for current and future asbestos personal-injury claims for which no fixed liability has yet been established. It is a December 31, 2025 special-purpose financial-statement figure, not a current cash balance or a current total of claimant payments.

The same filing’s Note 6 reports that, during FY2025, the Trust settled 17,124 claims totaling **$73,971,225**, including $5,010,526 settled but unpaid at year end, and paid 13,905 claims totaling **$72,062,628**. Those are annual-period claims-activity amounts. They are not cumulative payments and must not be incorporated into a cumulative-paid field, current total, or aggregate without a separately supported methodology decision.

## Recommended disposition

No public numeric update is necessary. Preserve the existing financial fields. If a later financial release is requested, it may cite this packet to confirm the already-present values; it must retain the December 31, 2025 as-of date, net-claimants-equity label, special-purpose accounting context, and the annual-versus-cumulative exclusions.

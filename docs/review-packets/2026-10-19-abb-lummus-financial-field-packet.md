# ABB Lummus FY2025 Financial-Field Packet — October 19, 2026

**Status:** Internal field-level reconciliation packet; no financial-field release authorized by this packet  
**Field:** `netAssets` / `assetsAsOf` / `assetsBasis` for ABB Lummus Global Inc. 524(g) Asbestos PI Trust  
**Source cut-off:** October 19, 2026  
**Source class:** Court-filed annual report and audited special-purpose financial statements

## Controlling source

[ABB Lummus Global Inc. 524(g) Asbestos PI Trust FY2025 annual report and financial statements](https://www.abblummustrust.org/assets/uploadedFiles/04e9a249-cf90-4bfd-a2cb-21a0016473ad.pdf), Bankr. D. Del. Case No. 06-10401 (MFW), Doc. 529, filed April 28, 2026.

- **Reporting period:** January 1–December 31, 2025.
- **Relevant table:** *Special-Purpose Statements of Assets, Liabilities and Net Assets Available for the Payment of Claims* (Exhibit A).
- **Locator:** court PDF page 14 of 29 (Exhibit A); field line “Net Assets Available For The Payment of Claims.”
- **Reported amount and unit:** **$14,960,830**, U.S. dollars.
- **As-of date:** December 31, 2025.

## Current tracker-field reconciliation

| Field | Current canonical JSON value | Verified source value | Disposition |
| --- | --- | --- | --- |
| `netAssets` | $14,960,830 | $14,960,830 | Matches; no numeric change. |
| `assetsAsOf` | 2025-12-31 | December 31, 2025 | Matches; no date change. |
| `assetsBasis` | Net assets available for payment of claims; audited special-purpose statements; FY2025 annual report; Doc. 529 filed April 28, 2026 | Same scope and filing context | Matches; no text change in this source/qualifier release. |

**Aggregate impact if released:** $0. The canonical field already equals the verified figure, so no remaining-assets total, coverage count, methodology amount, or snapshot date changes.

## Scope and exclusions

This is a balance-sheet-like special-purpose measure of **net assets available for the payment of claims** as of December 31, 2025. It is not a current cash balance, a scheduled claim value, or a trust-wide payment total.

The report also presents annual claims-payment and expense figures. Those figures are explicitly excluded from this packet: $443,947 paid in 2025 net of refunds, $492,774 claims expense, and $53,800 claims payable are annual-period or accrued amounts. They must not be relabeled as cumulative payments or a current total.

## Recommended disposition

No public numeric update is necessary. Preserve the existing financial fields. If a later financial release is requested, it may cite this packet to confirm the already-present values; it must retain the December 31, 2025 as-of date and the special-purpose/accounting scope.

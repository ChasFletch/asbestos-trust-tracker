# Pre-Pilot Official Source-Enrichment Extraction Brief — October 2, 2026

## Conclusion

Five pre-pilot official sources were extracted for a future **source-enrichment** release. Four yielded bounded historical procedure or valuation facts. The W.R. Grace linked-PDF access block has since been resolved with four supplied copies that match the exact filenames directly linked by the official notice page; their MD5 and SHA-256 values are retained in the companion dataset. None of these sources changes a current payment percentage, assets figure, cumulative-payment figure, or current claim-processing status. None should be presented as timely news.

The companion machine-readable candidate dataset retains the field-level values, effective dates, locators, and caveats. No canonical public tracker file was changed in this pass.

## Extracted records

### NARCO deemed-withdrawn policy

The NARCO Trustees’ May 27, 2026 notice says that enforcement of the TDP Section 5.3 Deemed Withdrawn Policy resumed June 1, 2026. It covers Intake or Review Deficient claims and claims on a Definite Statute of Limitations hold. In each case, the notice uses a six-month formula tied to the relevant Trust Online notification date or June 1, 2026, whichever is later. If the required action is not timely taken, the claim is Deemed Withdrawn. A later refiling preserves statute-of-limitations status, but receives FIFO placement based on the new filing date. The form does not supply each claim’s notification date, so no individual deadline can be calculated. [1]

### Maremont scheduled-value adjustment

Maremont’s official notice states a one-percent annual scheduled-value adjustment under TDP Section 5.3(a)(3), effective January 1, 2026. Its page-one table lists five scheduled values: $12,972 for Mesothelioma 2 (Level V), $119,543 for Mesothelioma (Level IV), $27,233 for Lung Cancer (Level III), $5,790 for Other Cancer (Level II), and $27,233 for Severe Asbestosis (Level I). The notice says these values apply to Trust offers from the notice date and do not trigger supplemental payments under TDP Section 4.3. They are valuation inputs, not actual payments or a payment percentage. The January 9 notice date is taken from the official PDF filename because a separate printed date was not independently located. [2]

### Pittsburgh Corning secondary-exposure amendment

The Pittsburgh Corning resolution states that it became effective November 14, 2025 and amended TDP Section 5.5. It generally routes secondary-exposure claims to Individual Review, while allowing a Disease Level VIII Mesothelioma claim to seek either Expedited Review or Individual Review. The amendment includes disease, exposure-equivalency, timing, causation, and duration/intensity requirements. It preserves other TDP liquidation and payment rights, requirements, and limitations. The resolution is a historical procedural source; it does not state a current payment percentage, payment amount, or current claim outcome. [3]

### W.R. Grace historical procedure documents recovered

The official W.R. Grace notice pages identify a December 3, 2025 ADR notice with fully executed and amended ADR materials, plus a linked resolution concerning TDP Section 5.5 and secondary exposure claims. Direct retrieval from the research environment continues to return **HTTP 403** from `Sucuri/Cloudproxy`, with `x-sucuri-block: GEO02`; this is a request-origin access rule, not a missing-document finding.

On October 2, four readable copies were supplied that match the official linked filenames, including the two-page Section 5.5 resolution, the resolution with the 37-page ADR exhibit, the 30-page amended ADR procedures, and the 30-page comparison copy. The copies were hashed and are recorded in the companion dataset. The Section 5.5 resolution says it was effective November 14, 2025; it generally routes secondary-exposure claims to Individual Review, except that a Disease Level VIII Mesothelioma claimant may seek either Expedited Review or Individual Review. It sets disease, direct-exposure-equivalency, timing, causation, and additional non-Level-VIII duration/intensity conditions, while preserving the rest of the TDP’s payment and liquidation provisions. [5]

The ADR resolution adopts a procedure amendment concerning ADR requests where statute of limitations is at issue: the Trust has 30 days to send its supporting material, the claimant then has 30 days from receipt to respond, and an ADR packet follows after the response or its deadline. The attached ADR Procedures are marked amended October 30, 2025. These are historical procedural facts only; they are not individual guidance and do not establish a current claim outcome, payment rate, asset value, or payout. [4]

### UGL scheduled, average, and maximum-value adjustment

UGL’s official notice states an annual 1.75-percent proportional adjustment to scheduled, average, and maximum values for compensable disease levels, effective January 1, 2026. It provides an eight-level valuation table, including the following Level VIII values: $259,614 scheduled, $292,067 average, and $519,231 maximum. The full table is retained in the machine-readable staging dataset. The notice applies the values to Trust offers from the notice date and says the adjustment does not trigger supplemental payments under TDP Section 4.3. It is not a payment-percentage notice and does not report actual paid amounts. [6]

## Recommended staging boundary

The next source-enrichment release can add **historical procedure** and **historical scheduled-value** records only. Each public record should display its official source, document date or effective date, page or table locator, and the distinction between a scheduled, average, or maximum value and an actual payment. The W.R. Grace entry is now source-verified for its limited historical procedure scope, but still requires editorial review and release approval before any public use.

A future release should not add a claimant-facing deadline calculator, eligibility conclusion, present processing-status claim, current rate, asset figure, or payout total from any of these materials.

## References

[1]: https://www.narcoasbestostrust.org/wp-content/uploads/2026/05/Deemed-Withdrawn-Notice_SBEP.pdf "NARCO Asbestos Personal Injury Settlement Trust, Notice of Deemed Withdrawn Policy"
[2]: https://maremont.mfrclaims.com/assets/documents/resources/Notice%20of%20Inflation%20Adjustments%20to%20SV%20under%20Maremont%20TDP%20updated%201-9-2026.pdf "Maremont Trust, Notice of Inflation Adjustments to Scheduled Values under the TDP"
[3]: https://www.pccasbestostrust.com/wp-content/uploads/2025/12/PCC-Resolution-re-Amendment-of-TDP-5.5-Secondary-Exposure-Claims-Fully-Executed-12-2025-4920-7296-0894.1.pdf "Pittsburgh Corning Corporation Asbestos PI Trust, Resolution Amending TDP Section 5.5"
[4]: https://www.wrgraceasbestostrust.com/please-see-the-notices-below-from-the-wrg-asbestos-pi-trust/ "W.R. Grace Asbestos PI Trust, Notice re: ADR Procedures"
[5]: https://www.wrgraceasbestostrust.com/resolution-amending-tdp-section-5-5-november-14-2025/ "W.R. Grace Asbestos PI Trust, Resolution Amending TDP Section 5.5"
[6]: https://www.ugltrust.com/documents/Notice-of-Inflation-Adjustments-to-SV-AV-and-MV-under-UGL-TDP-1-1-2026.pdf "UGL Asbestos Personal Injury Trust, Notice of Inflation Adjustments to Scheduled, Average, and Maximum Values"

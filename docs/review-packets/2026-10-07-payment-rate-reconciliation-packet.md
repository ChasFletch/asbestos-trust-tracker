# Payment-Rate Reconciliation Packet — October 7, 2026

**Status:** Decision recorded — approved: full bounded release (12 records), 2026-10-08  
**Scope:** Public tracker payment-percentage fields only  
**Prepared by:** Manus AI  
**Public action in this packet:** None at preparation; see the decision record below for the approved release

## Decision requested

The manual official-source sweep reviewed all 55 tracker records and found source-supported corrections or reclassifications that should **not** be applied as one automatic batch. This packet separates fully supported numerical changes from records that require a more conservative public presentation. It asks for a specific decision on whether to release a bounded tracker-update batch after final record-by-record implementation and validation.

No public tracker data, news item, source code, or deployment has changed as part of this packet. It preserves the post-pilot monitoring authorization: a verified source finding is not a publication decision.

## Decision record

| Field | Value |
|---|---|
| Decision | **Approved — full bounded release** of all twelve records in this packet: the six release-safe numerical corrections as plain numbers, and the six qualified-presentation records using exactly the handling in the table below. |
| Approver | C.V.F. |
| Decision date | 2026-10-08, 6:40 PM CT (“Release all twelve, with caveats on six.”) |
| Not released | The NGC Bodily Injury Trust conflict (no change; 45% remains pending recheck), the qualification-only follow-up list, and any article. No attorney reviewer is credited. |
| Implementation | Canonical dataset (`client/src/data/trust-figures.json`, 12 `changes` entries dated 2026-10-08), official payment-notice history, trust detail, trust list, CSV/API projections, crawler-visible trust-detail metadata, Corrections page, and `docs/figure-provenance-changelog.md`. Regression test: `server/paymentRateReconciliationRelease.test.ts`. |

## Release-safe numerical corrections

The following records have a later or missing official figure whose published scope and effective date are clear. Each should retain its source URL, effective date, and stated exceptions in the public record.

| Trust | Current public record | Official-source result | Proposed tracker treatment if approved |
|---|---|---|---|
| API, Inc. Asbestos Settlement Trust | 22% | 44% for approved claims on or after September 1, 2026; Enhanced Claims have distinct treatment. [1] | Replace 22% with 44%, add the September 1 effective date, and preserve the Enhanced Claims qualification. |
| Raytech (Raymark) Trust | Unreported | 1.35% pro-rata percentage, effective November 14, 2024. [2] | Add 1.35% with the effective date and official administrator notice. |
| Keene Creditors Trust | Unreported | 1.05%, effective October 24, 2024. [3] | Add 1.05% with the effective date and official administrator notice. |
| Burns and Roe Personal Injury Settlement Trust | Unreported | 36.87%, effective March 13, 2024, with TAC and Future Claimants’ Representative consent. [4] | Add 36.87% with the effective date and preserve the Trust’s ordinary cash-discount exception in the detailed scope. |
| Brauer 524(g) Asbestos Trust | Unreported | 9.5%, effective April 1, 2023, after Trustee, TAC, and Futures Representative consent. [5] | Add 9.5% with the effective date and resolution source. |
| T H Agriculture & Nutrition Trust | 15% | 16.3% for claims in the FIFO Payment Queue, effective September 1, 2026; prior 15% payments receive supplemental treatment. [6] | Replace 15% with 16.3%, label the FIFO Payment Queue scope, and retain the prior-payment qualification. |

## Corrections that require qualified presentation

These records have an official source, but a plain number alone would misstate the record. A release should use the qualification shown below or leave the existing public value unchanged until a clearer source is available.

| Trust | Verified official condition | Required public handling if approved |
|---|---|---|
| Quigley Company Asbestos PI Trust | The Trust has separate current percentages: 13.3% for Non-Releasing claimants and 3.3% for Releasing claimants, effective October 30, 2025. [7] | Replace the single percentage with a two-rate presentation. Do not retain 13.3% as a universal trust-wide rate. |
| Kaiser Asbestos PI Trust | The Trustees directed claims to be paid at 10.6% beginning February 5, 2025 while a proposed reduction remained subject to TAC and FCR consent. [8] | Retain 10.6% only as an **interim, consent-pending** applied rate with the February 5, 2025 date. Do not describe it as final or fully adopted. |
| Duro Dyne Asbestos Personal Injury Trust | The current rate applied to paid claims is 20%; 40% is only proposed. [9] | Add 20% as current, label 40% as proposed, and do not publish 40% as the operating rate. |
| A & I Corporation Asbestos Bodily Injury Trust | The 8.46% figure was the final prorated distribution on July 8, 2020 after the Trust reported its funds were exhausted. [10] | Keep the current-rate field unreported. A historical final-distribution note may be added only if it is visibly distinct from an operating payment rate. |
| Eagle-Picher Industries PI Settlement Trust | The accessible official administrator page does not publish a current percentage. [11] | Replace the unsupported current 35% with **not publicly reported** unless a later official rate notice is recovered. Historical 33% material is not current-rate proof. |
| A-Best Products Asbestos Trust | The 2020 official document announced the Trustee’s intended action to reduce 21% to 18% on or about September 1, 2020, but is not a post-effective implementation confirmation. [12] | Replace 18% with **not publicly reported** unless a later official implementation notice is recovered. |

## Official-source conflict requiring no change now

The NGC Bodily Injury Trust has a dated January 19, 2023 official notice increasing its Payment Sum Percentage from 40% to 45%. [13] The original sweep also identified an undated official-site statement showing 40%. The dated notice is the stronger record currently available, but no public change is proposed until the live Trust site is rechecked and the conflict is documented in a durable source note. The current 45% tracker value may remain in place pending that resolution.

## Records that remain publicly unreported

The sweep confirms that current numeric rates remain publicly unreported for G-I Holdings, Eagle-Picher, J.T. Thorpe Company Successor Trust (Texas), Porter Hayden, A-Best, Rapid-American, and C.E. Thurston. This status does not imply that a trust is inactive or pays zero. It means the reviewed official materials do not establish a current number that can be published responsibly.

## Scope and implementation controls

A public correction must carry its material qualification beside the rate. This is especially important where a percentage is only proposed, applied during a consent process, tied to one sub-account or claimant group, limited to a payment queue, exempted for cash-discount claims, or a historical final distribution. The current audit also identified qualification-only follow-up work for Western, Thorpe Insulation, Maremont, W.R. Grace, USG, Owens Corning/Fibreboard, Combustion Engineering, Babcock & Wilcox, Congoleum, MLC, ACandS, Christy Refractories, and UGL. Those qualification-only items are not included in this release request.

## Verification required before any release

If a release is authorized, implementation should update the canonical dataset, the payment-notice history, the trust detail, the trust list, the CSV and API projections, crawler-visible metadata, and any related methodology or correction disclosure. Each changed record must be tested against its source scope. The release must then pass the full test suite, TypeScript check, production build, raw server-rendered HTML verification, CSV/API checks, responsive review, and a live production verification.

No attorney reviewer is credited in this packet. No article release is proposed.

## References

[1]: https://apiincasbestossettlementtrust.com/notices-from-the-trustee/ "API Inc. Asbestos Settlement Trust — Notices from the Trustee"
[2]: https://www.cpf-inc.com/api/files/media/Raytech%20Trust%20Notice%20of%20Payment%20Percentage%20Increase%2011_2024%20%284%29.pdf "Raytech Corporation Asbestos Personal Injury Settlement Trust — Notice of Pro-Rata Percentage Increase"
[3]: https://www.cpf-inc.com/api/files/media/Keene_Trust_Notice_of_Payment_Percentage_Increase_2024%20%284%29.pdf "Keene Creditors Trust — Notice of Payment Percentage Increase"
[4]: https://www.burnsandroetrust.com/assets/uploadedFiles/ca37d73b-c3d2-4897-9201-607bce86df54.pdf "Burns and Roe Asbestos Personal Injury Settlement Trust — Payment Percentage Adjustment"
[5]: https://www.brauertrust.com/assets/uploadedFiles/a661c741-38a2-4760-bc79-6876c8b169fd.pdf "Brauer 524(g) Asbestos Trust — Resolution of the Trustee, Trust Advisory Committee, and Futures Representative"
[6]: https://www.thanasbestostrust.com/assets/uploadedFiles/ff70ae1e-c348-4494-81d4-790125ea7b4d.pdf "T H Agriculture & Nutrition Asbestos Personal Injury Trust — Notice Regarding Payment Percentage"
[7]: https://www.quigleytrust.com/assets/uploadedFiles/86ced2a8-b934-4657-a9d2-63311a567492.pdf "Quigley Asbestos PI Trust — Notice"
[8]: https://www.kaiserasbestostrust.com/assets/uploadedFiles/a9fa8368-7c64-4c40-9312-d95c42ff8c06.pdf "Kaiser Aluminum & Chemical Corporation Asbestos Personal Injury Trust — Notice of Request for Consent to Decrease Payment Percentage"
[9]: https://durodyne.mfrclaims.com/assets/documents/resources/DuroDyne_Notice%20Regarding%20Payment%20Percentage%20%287-10-2026%29.pdf "Duro Dyne Asbestos Personal Injury Trust — Notice Regarding Payment Percentage"
[10]: https://www.aisettlement.com/assets/documents/resources/AI-Notice-re-final-payments.pdf "A&I Corporation Asbestos Bodily Injury Trust — Notice Regarding Final Payments"
[11]: https://www.cpf-inc.com/trusts/epi-trust/ "Claims Processing Facility — EPI Trust"
[12]: https://www.abestasbestostrust.com/assets/documents/resources/Notice-of-Trustee-Action-to-Reduce-Payment-Percentage-2020.pdf "A-Best Asbestos Settlement Trust — Notice of Trustee Action to Adjust Payment Percentage"
[13]: https://www.ngcbitrust.org/assets/documents/Notices/NGCBIT_Pmt_Percentage_Increase_45.pdf "NGC Bodily Injury Trust — PSP Increase to 45% and ALV Inflation Adjustment"

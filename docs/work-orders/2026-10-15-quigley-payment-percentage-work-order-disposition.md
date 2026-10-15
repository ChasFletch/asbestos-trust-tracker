# Tier 1 Work Order Disposition — Quigley Payment-Percentage Record

| Field | Disposition |
| --- | --- |
| Work-order ID | `T1-20261015-quigley-payment-percentages` |
| Requested work | Process the supplied Quigley routine payment-percentage update through the Tier 1 template. |
| Task class | Tier 1 — routine primary-source-backed tracker update. |
| Source cutoff | 2026-10-15 20:57 UTC. |
| Publication authority | No new publication or deployment required or requested. The substantive two-rate release was separately approved and completed on 2026-10-08. |
| Result | **No-op / duplicate implementation confirmed.** No public data, content, code, or deployment change is warranted by this work order. |

## Scope

| Surface | Verified canonical identifier or URL |
| --- | --- |
| Trust detail | `https://asbestostrusts.org/trusts/quigley-company-asbestos-pi-trust` |
| Tracker slug | `quigley-company-asbestos-pi-trust` |
| Official source host | `https://www.quigleytrust.com/` |
| Controlling notice | `https://www.quigleytrust.com/assets/uploadedFiles/86ced2a8-b934-4657-a9d2-63311a567492.pdf` |
| Related public history | `paymentNoticeHistory.ts`: `quigley-non-releasing-2025-10-30` and `quigley-releasing-2025-10-30` |
| Related public correction record | Corrections entry dated 2026-10-08 |

## Mandatory preflight gates

### Gate A — Existing implementation and duplicate-work check

The live canonical detail route’s server-rendered HTML shows a dual-rate presentation: **13.3% for Non-Releasing** and **3.3% for Releasing** claimants, both effective October 30, 2025. It visibly states that these are separate rates and not a trust-wide figure.

The canonical tracker record already contains the two distinct numeric fields, claimant-category labels, dual-rate presentation flag, effective date, official notice date, scope note, two `subAccounts` records, and the direct official notice URL. The structured notice history separately retains both old/new pairs: 14.5%→13.3% (Non-Releasing) and 3.6%→3.3% (Releasing).

The October 7 payment-rate reconciliation packet records a specific approved October 8 release for Quigley’s qualified two-rate presentation. The internal candidate queue has no open Quigley payment-notice candidate; its only Quigley candidate is a resolved legacy-host access record.

**Gate A result:** Already implemented and already released. Do not create a duplicate correction, re-release, or revise the two values.

### Gate B — Official-source currentness check

The active registry identifies `https://www.quigleytrust.com/` as the reviewed official Trust host; it supersedes the non-resolving legacy hostname.

The official Notices page lists three payment-percentage items. The underlying documents establish this sequence:

| Notice date | Official notice outcome |
| --- | --- |
| 2025-08-11 | Trustees began the required reconsideration process; no new percentage was set. |
| 2025-10-06 | Trustees proposed 13.3% for Non-Releasing and 3.3% for Releasing claimants, initially subject to TAC and Future Demand Holders’ Representative consent and specified transition terms. |
| 2025-11-10 | Effective October 30, 2025, Trustees decreased the rates from 14.5% to 13.3% (Non-Releasing) and from 3.6% to 3.3% (Releasing), with stated TAC and Future Demand Holders’ Representative consent. |

The November 10 notice is the controlling implementation record. The official Notices and Resources repositories reviewed at the source cutoff did not identify a later-dated payment-percentage notice, resolution, or superseding rate document.

> No later official material was located in the reviewed Quigley Notices and Resources repositories as of 2026-10-15 20:57 UTC.

This is a bounded repository finding, not a permanent claim that no later source can exist.

### Gate C — Canonical-route and data-shape check

The canonical public slug and source-registry identity both resolve to `quigley-company-asbestos-pi-trust`. The data model correctly preserves separate claimant-category rates rather than collapsing them into one trust-wide percentage:

| Claimant scope | Prior rate | Current rate | Effective date | Implementation qualification |
| --- | ---: | ---: | --- | --- |
| Non-Releasing Asbestos PI Claimants | 14.5% | 13.3% | 2025-10-30 | Adopted with stated TAC and Future Demand Holders’ Representative consent. |
| Releasing Asbestos PI Claimants | 3.6% | 3.3% | 2025-10-30 | Adopted with stated TAC and Future Demand Holders’ Representative consent. |

The completed release propagates the qualified presentation through the trust detail, trust list, CSV/API projection, payment-notice history, corrections record, server-rendered metadata, and focused payment-rate release regression test.

**Gate C result:** The data shape and public presentation are correct for the source-supported scope.

## Authoritative source record

| Field | Record |
| --- | --- |
| Trust and limited scope | Quigley Asbestos PI Trust; separate Non-Releasing and Releasing Asbestos PI Claimant categories. |
| Source type | Official Trust notice. |
| Source title | `QUIGLEY ASBESTOS PI TRUST — NOTICE`. |
| Issuing party | Trustees of the Quigley Asbestos PI Trust. |
| Document date | 2025-11-10. |
| Effective date | 2025-10-30. |
| Direct official URL | https://www.quigleytrust.com/assets/uploadedFiles/86ced2a8-b934-4657-a9d2-63311a567492.pdf |
| Pinpoint | Notice body, first substantive paragraph. |
| Source-supported terms | Non-Releasing: 14.5%→13.3%; Releasing: 3.6%→3.3%; action taken with Trust Advisory Committee and Future Demand Holders’ Representative consent. |

## Disposition and limitation

No tracker-field, notice-history, correction-history, article, source-code, or deployment action is needed for the two rates. The existing live release is consistent with the controlling notice and with the official repository review.

A separate source-link housekeeping issue remains outside this completed rate disposition: the tracker’s `website` display field still contains the superseded legacy hostname, while the source registry and payment-percentage citation use the verified `https://www.quigleytrust.com/` host. That link discrepancy does **not** change the rate result and is not altered by this work order. If requested, handle it in a separate narrow source-link correction with its own live-link verification.

## Completion record

- No public action taken.
- No review attribution created.
- No accomplishments-ledger entry required because this is a duplicate/no-op verification.
- The current payment-rate monitoring authorization remains unchanged.

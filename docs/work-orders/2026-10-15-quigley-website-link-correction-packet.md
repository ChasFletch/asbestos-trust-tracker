# Tier 1 Work Order — Quigley Official Website Link Correction

> **Status:** Prepared for a separately authorized narrow production release. No public field, code, source registry, rate, or article has been changed by this packet.

| Field | Record |
| --- | --- |
| Work-order ID | `T1-20261015-quigley-website-link` |
| Requested change type | Official source-profile link correction only |
| Trust / canonical slug | Quigley Company Asbestos PI Trust / `quigley-company-asbestos-pi-trust` |
| Affected public route | `https://asbestostrusts.org/trusts/quigley-company-asbestos-pi-trust` |
| Source cutoff | 2026-10-15 20:57 UTC |
| Publication authority | **Not granted by this packet.** A bounded implementation/release decision is still required. |

## Requested narrow change

| Field | Current stored/display value | Proposed value |
| --- | --- | --- |
| `website` | `https://www.quigleyasbestostrust.com` | `https://www.quigleytrust.com/` |
| Visible link label | `www.quigleyasbestostrust.com` | `www.quigleytrust.com` |

**Reason:** Align the Trust profile’s general website link with the verified official Trust host already used in the active source registry and in the direct official payment-percentage notice URL.

## Source and scope record

| Field | Evidence |
| --- | --- |
| Verified official host | `https://www.quigleytrust.com/` |
| Registry treatment | The active source-registry override explicitly replaces the legacy `quigleyasbestostrust.com` host with the verified official Trust site and public Resources library, reviewed 2026-09-15. |
| Existing direct primary citation | `https://www.quigleytrust.com/assets/uploadedFiles/86ced2a8-b934-4657-a9d2-63311a567492.pdf` — Quigley Trust notice dated 2025-11-10. |
| Legacy-host status | The older profile link is superseded for this site’s sourcing purposes. This packet does **not** claim that the legacy endpoint is dead, malicious, or otherwise inaccessible because that endpoint was not re-tested for this work order. |
| Rate boundary | The completed 13.3% Non-Releasing / 3.3% Releasing rate presentation, both effective 2025-10-30, is unchanged and out of scope. |

## Gate A — existing implementation and duplicate-work check

- The live canonical profile currently displays `www.quigleyasbestostrust.com` in its general website link.
- The completed October 8 payment-rate release already correctly cites the official `quigleytrust.com` notice for the two separate claimant-category rates. It does not repair the unrelated general-profile website field.
- No prior completed release was found for this specific website-field correction.

**Result:** This is a distinct source-link correction, not a duplicate payment-rate release.

## Gate B — official-source and currentness check

The official Quigley site, its Notices/Resources repository, and the controlling November 10, 2025 notice all use the `quigleytrust.com` host. The current source registry already identifies that host as the verified official replacement.

> No later official material was needed to establish this source-link correction; the work order changes only the profile’s official-host link, not a time-sensitive rate or financial value.

## Gate C — authoritative storage and affected-surface check

The currently rendered profile link is controlled by the managed database record, not only by the JSON fallback:

| Layer | Current record | Behavior | Required coordinated action if release is authorized |
| --- | --- | --- | --- |
| `trusts` managed-database table | Row ID `quigley`; `website = https://www.quigleyasbestostrust.com` | **Primary runtime override.** `TrustDetail` and the shared trust merge map use `dbTrust.website` before JSON. | Update the one row’s `website` field to `https://www.quigleytrust.com/` using a narrowly scoped, exact-old-value update. |
| `client/src/data/trust-figures.json` | Quigley `website = https://www.quigleyasbestostrust.com` | JSON fallback and canonical public data response retain the same outdated host. | Update the one matching Quigley `website` field to the new official host to prevent future fallback/reseed drift. |
| `server/sourceRegistryOverrides.ts` | `quigley-company-asbestos-pi-trust` already points to `https://www.quigleytrust.com/` | Monitoring/source-registration record is already correct. | **No change.** |

Affected public projections:

1. The canonical Quigley profile’s `Website` anchor, including SSR/crawler HTML.
2. The Quigley expanded row in `/trusts`, whose merged trust data prefers the database value.
3. Trust-detail/list tRPC data that merges the database website field ahead of JSON.
4. The JSON-first `/api/trust-figures` response, after its Quigley JSON fallback value is aligned.

`/trusts.csv` does not currently export the general `website` field, so it is not directly changed by this correction. The payment notice history, payment source URL, payment figures, data classification, rate status, correction history, structured data, and source-registry override are also out of scope.

## Bounded implementation plan — only after explicit release authority

1. Reconfirm the exact managed-database row by ID `quigley` and exact current old URL.
2. Perform a guarded one-row database update only when `id = quigley` **and** `website` exactly equals `https://www.quigleyasbestostrust.com`.
3. Change the single Quigley `website` fallback in `client/src/data/trust-figures.json` to `https://www.quigleytrust.com/`.
4. Add a focused regression check covering the Quigley profile and merged trust data’s official-host link, without widening the task to a registry sweep.
5. Run TypeScript checking, the focused test, and production build; save a checkpoint.
6. Publish only under the separate exact release authorization.
7. Verify the canonical production profile’s SSR HTML and rendered `Website` anchor use the new href/label; verify the official host opens. Verify the direct rate notice, dual-rate presentation, dates, and source citation remain unchanged.

## Acceptance criteria

- Exact profile link old/new values and reason are retained in the correction/release record.
- The canonical profile’s server-rendered link has `href="https://www.quigleytrust.com/"` and visible label `www.quigleytrust.com`.
- The list/detail merged data does not fall back to the legacy link.
- No rate, claimant-category label, effective date, payment notice, asset, status, attribution, source-registry entry, or design element changes.
- No new public URL, article, reviewer credit, or monitoring-expansion action occurs.

## Current disposition

**Prepared; held for a specific narrow production-release decision.**

# Review-Package Manifest Identity Correction

**Status:** Internal delivery-metadata correction only. It does not alter a primary source, recovered rate mapping, conflict determination, public data, source status, code, or deployment.

**Correction date:** 2026-10-17  
**Correction version:** 1.2
**Applies to:** The private 30-record payment-rate source-recovery package transmitted after the 2026-10-17 reconciliation.

## What changed

| Field | Originally reported | Corrected record | Reason |
|---|---|---|---|
| Artifact name | `review-package-manifest.json` | `review-package-manifest.json` | The artifact name is unchanged. |
| Reported SHA-256 | `517ad27b99ecb27bf171a09eb7d6c1f97c0ff4a5db75d8544774fa7f4af5b361` | `d70fc10568bf09ae329345627bf7b5f7200f93c8cc7728a54a51194d29476d1b` | Intake QA recovered and read the actual manifest bytes. |
| Recovered size | Not reported | 3,273 bytes | Intake QA recorded the actual retrieved byte count. |
| Content status | Not independently identified in the earlier handoff | Readable manifest; its listed constituent hashes and byte counts matched the three recovered package artifacts and five original supplied inputs | This supports a metadata-identifier mismatch, not an assertion that the manifest or its constituent records were corrupted. |

## Preservation and boundary

The originally reported SHA-256 is preserved above as an historical delivery record. The recovered manifest bytes are not silently overwritten or reconstructed in this project workspace: their original copy was recovered in the intake task’s authorized session-reference environment, while this workspace did not retain that exact file. This correction therefore records the actual identity and reason for the mismatch rather than creating a substitute file and presenting it as original.

The following recovered artifacts remain the controlling internal materials for the rate-source package:

- `source-url-recovery-reconciliation.md` — SHA-256 `2de62142886417a256eec099c9e1d9c5cfca627c9678592ed2d87af06d32742d`
- `official-primary-conflict-review-11.json` — SHA-256 `f053b1e43290b537eef37d8a52f24df5a0d020797934279dffc842d7d9ca0cd4`
- `recovery-manifest.json` — SHA-256 `c644c766a5cf6e0feb293da66de82ac494041a0505343871a10353928c3c62d0`

No release-readiness certification follows from this metadata correction. Existing source, scope, current-status, NGC, and Tier 1 release gates remain unchanged.

## Correction history

- **2026-10-17 v1.1:** Recorded the originally reported and intake-recovered manifest identities, without replacing or reconstructing the original manifest.
- **2026-10-17 v1.2:** Corrected a private transcription omission in the intake-recovered SHA-256: the final `b` was missing from the v1.1 table cell. The complete 64-character hash is now recorded above. No manifest byte, rate-source row, conflict result, source-status field, or public artifact changed.

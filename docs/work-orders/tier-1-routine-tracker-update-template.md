# AsbestosTrusts.org — Tier 1 Routine Work Order Template

> **Use for:** A narrow, primary-source-backed tracker or source-citation correction that does not add interpretive analysis, a guide, a research release, or a new public content type.
>
> **Do not use for:** A substantive article, facility/site record, map, methodology/data release, disputed legal interpretation, or any change that adds a new trust/scheme category. Reclassify those as **Tier 2** and route them through **ANCHOR → CLEO → Charles**.

## 1. Work-order identity

| Field | Required entry |
| --- | --- |
| Work-order ID | `[YYYYMMDD-short-topic]` |
| Requested by / approval reference | `[Name, task, or dated approval]` |
| Task class | `Tier 1 — routine primary-source-backed tracker/data update` |
| Change type | `[Payment percentage / annual-report field / source link / correction]` |
| Publication authority | `[Explicit production authorization, if any; otherwise “No deployment or publication authorized”]` |

## 2. Scope

**Affected canonical public URL(s)**

- `[Canonical AsbestosTrusts.org route, verified from the current production index or route map]`
- `[Canonical data identifier / trust slug]`
- `[Any directly affected comparison, notice-history, CSV, or correction-log surface]`

**Requested change**

`[Describe the smallest factual change. Name every trust, claimant category, sub-account, fund, or other scope qualifier exactly as the authoritative source does.]`

**Out of scope**

- Individual claim-value calculations, filing guidance, eligibility determinations, or outcome predictions.
- Statements about a source remaining current unless the currentness gate below is completed.
- Financial-condition commentary, claimant-outcome interpretation, or unrelated record changes.
- A new public article, report, page type, tracker category, or schema type.

## 3. Mandatory preflight gates

All three gates must be completed and recorded **before** any data or public-copy edit.

### Gate A — Existing implementation and duplicate-work check

1. Check the live canonical route and the relevant tracker/data record.
2. Check the active correction/review queue and recent release history for the same trust, source, document period, and field.
3. If the requested values and qualifiers are already live, or a release is already active, **stop**. Record a no-op/duplicate disposition rather than making a second edit or release.
4. If a prior correction exists but differs from the new request, identify the exact conflict and route it for source reconciliation.

### Gate B — Official-source currentness check

1. Review the official trust, administrator, case-agent, court, or government document repository—not a search snippet or secondary source.
2. Look specifically for a later-dated notice, report, resolution, or superseding document for the same field and scope.
3. Record the newest controlling source found, its publication date, its effective/as-of date, and whether any later official document was located.
4. If no later official material is found, state only: **“No later official material was located in the reviewed repository as of `[date/time and source cutoff]`.”** Do not convert this into an unsupported permanent-currentness claim.

### Gate C — Canonical-route and data-shape check

1. Verify the canonical public URL from the current production trust index or route map; do not use a guessed slug or a placeholder.
2. Confirm that the record model can represent the source’s actual scope. For example, claimant categories, sub-accounts, funds, separate trusts, interim rates, and historical figures must not be collapsed into one generic field.
3. Identify every public surface the field populates, including detail page, trust list, CSV/API export, notice history, correction history, comparison table, metadata, and structured data where applicable.

## 4. Authoritative source record

| Field | Required entry |
| --- | --- |
| Trust / sub-account / claimant category | `[Exact official name and limited scope]` |
| Source type | `[Official notice / trustee annual report / filed court document / government record]` |
| Source title | `[Exact document title]` |
| Issuing party | `[Exact issuing entity]` |
| Document or filing date | `[YYYY-MM-DD]` |
| Effective / as-of / interim date | `[YYYY-MM-DD or “Not stated”]` |
| Document identifier | `[Docket number, notice identifier, or “None published”]` |
| Source URL | `[Direct official URL]` |
| Pinpoint | `[Page, table, section, or “Notice body; no page number”]` |
| Currentness outcome | `[Later official source found / no later official material located / unresolved conflict]` |

## 5. Data-change record

| Scope | Field | Unit | Existing value verified live | Proposed value | Effective/as-of date | Source qualifier |
| --- | --- | --- | ---: | ---: | --- | --- |
| `[Exact claimant category, fund, or sub-account]` | `[Field]` | `[Unit]` | `[Old displayed value or “Not publicly reported”]` | `[New value]` | `[Date]` | `[Current / interim / historical / proposed / separate rate]` |
| `[Second scope, if source requires it]` | `[Field]` | `[Unit]` | `[Old displayed value]` | `[New value]` | `[Date]` | `[Qualifier]` |

**Reason for change**

`[State only what the controlling source says. Distinguish publication date from effective date, and distinguish a historical or sub-account value from a trust-wide current figure.]`

## 6. Required public-facing wording

Use concise, source-led, non-advisory wording. Adapt this pattern only to the source-supported scope:

> **[Trust name]:** The trust’s `[source type]` dated `[document date]` states that, effective/as of `[date]`, `[exact value and scope]`. `[State any necessary qualifier, such as “This is not a trust-wide rate,” “subject to stated consent,” or “historical figure.”]` [Source: `[exact source title]`]

**Required constraints**

- Do not call a figure “current” unless Gate B supports that wording.
- Do not convert a claimant-category, fund, or sub-account rate into a trust-wide rate.
- Do not present a payment percentage as a person’s likely payment, recovery, or case value.
- Do not present annual payments, historical funding, scheduled values, or partial series as a current total.
- Retain visible uncertainty if the official source conflicts with another official page or notice.

## 7. Acceptance criteria

The task is complete only when all applicable items are satisfied:

1. The public record displays the value at the source’s actual scope.
2. The canonical route and data identifier are correct.
3. Dates distinguish notice/publication, effective, interim, and as-of dates where applicable.
4. The citation links directly to the controlling official document.
5. No public surface implies a trust-wide figure where the source supports only a category, fund, or sub-account.
6. The live record and all relevant derivative surfaces agree.
7. The correction/release history preserves the old value, new value, source URL, source date, effective/as-of date, reason, implementation date, and validation outcome.
8. Desktop, mobile, SSR/crawler HTML, and source-link behavior are validated for changed public surfaces.
9. Any source conflict, accessibility blocker, or unresolved currentness issue is recorded instead of inferred away.

## 8. Rollout and verification requirements

1. Complete Gates A–C and retain the results in the existing project queue or correction packet.
2. Validate the proposed data shape locally or in the authorized target environment.
3. Run the focused regression test(s), TypeScript check, and production build for any source-code change.
4. Create a checkpoint before production publication.
5. Publish only under the work order’s **explicit production authorization**. A source-backed work order is not, by itself, deployment authority.
6. After an authorized release, verify the canonical public URL, SSR HTML, affected exports, and official source URL.
7. For a substantive validated site/data improvement, append the required entry to `manus-vault-bridge/Manus/accomplishments.md` and commit it. Do not log no-ops, routine checks, or minor housekeeping.

## 9. Completion return

Return:

- Work-order ID and affected canonical URLs/record identifiers.
- Source details and currentness-check outcome.
- Before/after values for every claimant category, fund, or sub-account.
- Validation evidence, including changed surfaces and unresolved limitations.
- Release/checkpoint status and production verification, if publication was separately authorized.
- Any correction-history or accomplishments-ledger entry created.

## 10. Reclassification rule

Stop and reclassify the work as **Tier 2** if it expands into a substantive article, explanatory guide, facility/site record, map, data release, methodology change, legal interpretation, new public record type, or a material source conflict requiring editorial judgment. Tier 2 work remains draft-only until **ANCHOR → CLEO → Charles** is complete.

# AsbestosTrusts.org — Tier 2 Substantive Record or Article Work Order Template

> **Use for:** A substantive article, guide, facility or site record, map, data release, methodology update, interpretive court-development item, new public record type, or a source conflict that needs editorial judgment.
>
> **Release rule:** Tier 2 work is **draft-only** until the documented pipeline is complete: **Manus draft → ANCHOR edit → CLEO final QA → Charles publication decision**. A completed draft, code change, technical check, or source packet is never public-release authority by itself.

## 1. Work-order identity and project context

| Field | Required entry |
| --- | --- |
| Work-order ID | `[YYYYMMDD-short-topic]` |
| Requested by / authorization reference | `[Name, task, or dated approval]` |
| Item type | `[Article / guide / record / map / research release / methodology / correction]` |
| Proposed public title | `[Working title; not a publication claim]` |
| Proposed canonical URL | `[New or existing URL; mark “not assigned” if unknown]` |
| Project context files | `[Editorial standards, relevant methodology, current tracker record, prior packets, latest accomplishment log]` |
| Intended reader purpose | `[Reference value, source access, explanation, historical context]` |
| Publication authority | `Draft preparation only unless Charles has separately approved the exact final release.` |
| Source cutoff | `[UTC date/time]` |

## 2. Scope and non-goals

**Requested outcome**

`[Describe the reader-facing deliverable and its source-supported contribution.]`

**In scope**

- `[Bounded facts, documents, trusts, sites, case events, or date range.]`
- `[Required companion surface, such as trust record, methodology, downloadable source note, or correction history.]`

**Out of scope**

- Individual eligibility, claim-value, recovery, filing-strategy, medical, or legal advice.
- Claims of attorney, expert, or editor review without a dated item-specific record.
- A rate, asset, payout, or other tracker-data change not supported by a separately documented controlling source.
- Publication, deployment, press outreach, email, Slack, PACER spending, or a new site-wide position unless expressly approved.

## 3. Mandatory preflight gates

All gates are required before a Tier 2 item enters ANCHOR review.

### Gate A — Existing-work and duplicate check

1. Check the live site, current draft inventory, review-packet queue, active task intake, and recent release/correction history.
2. Identify an existing article, record, route, or packet that overlaps the requested topic.
3. If a complete equivalent is already live, report it and stop. If a related item exists, define the smallest non-duplicative contribution.
4. Record whether the work replaces, corrects, supplements, or newly covers the existing item.

### Gate B — Evidence and source hierarchy check

1. Build a source ledger before drafting claims.
2. Prefer official trust notices, filed annual reports, court orders/docket materials, government sources, and official case-agent material.
3. Label secondary reporting as context only. Do not use marketing copy or search snippets as fact evidence.
4. For every material numerical statement, retain the trust/sub-account, field, unit, source URL or identifier, document page/table, source date, and effective/as-of date.
5. Identify any unavailable, conflicting, undated, stale, or inaccessible primary material beside the affected claim. Unknown is not zero.

### Gate C — Scope, classification, and data-shape check

1. Distinguish trust-wide figures from claimant-category, sub-account, fund, scheduled-value, annual-payment, historical-funding, or partial-series figures.
2. Separate a source’s publication date from effective, filing, reporting-period, and as-of dates.
3. State whether a court-development item is procedural history, a filed position, a court ruling, or a final order. Do not call a filing an outcome.
4. Do not convert a proposed, interim, consent-pending, or historical fact into an unqualified current fact.
5. If a public tracker change is needed, prepare a separate bounded correction packet rather than silently changing the underlying data through an article or record draft.

### Gate D — Editorial and legal-review boundary check

1. Identify every interpretive claim, legal characterization, conclusion, or recommendation.
2. Keep legal interpretation neutral and source-led; no individualized advice, case-value estimate, outcome promise, or law-firm position.
3. Assign a reviewer only if a real reviewer, scope, and review date have been documented. Do not prefill a Paul Danziger or Rod De Llano review label.
4. If the item cannot be safely drafted without legal interpretation, prepare the factual source packet and flag the exact review question rather than improvising a conclusion.

### Gate E — Public representation and discoverability check

1. Confirm the canonical URL, internal links, title, description, structured-data type, byline, reviewer scope, funding disclosure, and correction path reflect documented reality.
2. Ensure a reader can reach controlling sources from the item where a public link exists.
3. Do not portray a source-recovery status, monitoring signal, or open question as a verified public fact.

## 4. Evidence ledger

| Claim ID | Proposed statement | Fact classification | Source type and URL/identifier | Pinpoint | Source date | Effective/as-of date | Scope and caveat | Draft status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `C-01` | `[Claim]` | `[Fact / procedural history / attributed position / analysis]` | `[Source]` | `[Page/table/section]` | `[Date]` | `[Date or N/A]` | `[Scope]` | `[Supported / qualify / omit]` |
| `C-02` | `[Claim]` | `[Classification]` | `[Source]` | `[Pinpoint]` | `[Date]` | `[Date]` | `[Scope]` | `[Status]` |

**Evidence decision rule:** Any material claim without a stable source, a clear scope, and a usable citation is omitted or explicitly presented as unknown—not elevated because it would make the story more complete.

## 5. Draft specification

| Element | Required decision |
| --- | --- |
| Lead | `[What the item adds beyond a headline, with no unsupported conclusion]` |
| Reader benefit | `[What a researcher can verify or understand from it]` |
| Primary documents | `[List direct official links or identifiers]` |
| Context sources | `[Clearly labeled secondary context, if used]` |
| Required distinctions | `[Rates vs. values; filing vs. order; historical vs. current; sub-account vs. trust-wide]` |
| Disclosures | `[Sponsorship/funding, authorship, review scope, or source-access limitation]` |
| Related internal links | `[Existing trust, report, methodology, correction, or source-document routes]` |
| Corrections/version history | `[Exact location and initial version/date]` |

## 6. Required draft structure

Use the structure that best fits the item, but include the following where applicable:

1. **Source-led title and dated lede.** State what happened and identify the controlling document or official source.
2. **What the record establishes.** Present the verified facts with exact scope and dates.
3. **Primary-document access.** Link or identify the documents a reader can inspect.
4. **What changed / did not change.** Compare to the prior documented state without inference.
5. **What remains unknown.** Keep material uncertainty beside the fact it limits.
6. **Methodology, disclosure, correction, or version note.** Include only the disclosures that are true and applicable.

## 7. Attribution, review, and sponsorship record

| Role | Name | Scope | Review date | Evidence/location | Status |
| --- | --- | --- | --- | --- | --- |
| Draft author | `Manus AI` or `[actual author]` | `[Drafting scope]` | `[Date]` | `[Record]` | `[Complete]` |
| Editor | `[ANCHOR, if actually completed]` | `[Edit scope]` | `[Date]` | `[Record]` | `[Pending / complete]` |
| Final QA | `[CLEO, if actually completed]` | `[QA scope]` | `[Date]` | `[Record]` | `[Pending / complete]` |
| Legal reviewer | `[Only if actual reviewer, scope, and date exist]` | `[Actual review scope]` | `[Date]` | `[Record]` | `[Pending / complete]` |
| Publication decision | `Charles` | `[Final decision]` | `[Date]` | `[Record]` | `[Pending / approved / declined]` |

**Rule:** Do not name or credit an attorney or other named specialist merely because they are a project reviewer. The visible byline, reviewer box, schema, and disclosure must match this table.

## 8. ANCHOR → CLEO → Charles pipeline packet

### ANCHOR edit request

- Draft file/location: `[Path or artifact]`
- Evidence ledger/location: `[Path or artifact]`
- Requested editorial review: `[Clarity, scope, claims, source links, reader value]`
- Known limitations requiring preservation: `[List]`
- ANCHOR outcome: `[Pending / returned with edits / approved for QA]`

### CLEO final QA request

- ANCHOR-approved draft/version: `[Path or artifact]`
- Requested QA: `[Source-to-claim match, dates, scope, links, disclosures, structured data, public wording]`
- Open issues: `[List or “None identified”]`
- CLEO outcome: `[Pending / approved with edits / rejected]`

### Charles publication decision

- Exact proposed public payload: `[Title, canonical URL, revised source facts, disclosures, release components]`
- Technical-validation requirement: `[SSR, mobile, links, structured data, regression tests, build]`
- Decision: `[Pending / approved / declined]`

## 9. Acceptance criteria

A Tier 2 item may be declared **review-ready**, not published, when:

1. All material claims have a complete evidence-ledger entry or have been removed.
2. Sources, dates, units, scope, and limitations are accurate and internally consistent.
3. Primary sources are accessible directly or their access limitation is candidly stated.
4. The draft does not provide individualized advice or outcome/value promises.
5. Authorship, sponsorship, reviewer scope, and structured-data intentions match documented reality.
6. ANCHOR and CLEO packet locations are complete and no unverified review approval is claimed.
7. The exact Charles-release decision remains visibly pending.

A Tier 2 item may be declared **release-ready** only after the review table records completed ANCHOR and CLEO stages and Charles approves the exact payload. Then, and only then, complete technical validation, checkpoint, authorized publication, public verification, correction/version entry, and the required accomplishments-ledger entry.

## 10. Completion return

Return:

- Work-order ID, item type, and draft status.
- Canonical proposed URL and directly affected existing URLs.
- Source cutoff and evidence-ledger status.
- The key documented facts, material limitations, and items deliberately omitted.
- ANCHOR, CLEO, and Charles status—without claiming a review that has not occurred.
- Technical validation and release status, if separately authorized.
- The exact next owner/action needed to move the item forward.

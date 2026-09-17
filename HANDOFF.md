# HANDOFF — for Manus (deploy live) — 2026-08-16

**From:** Kimi (accuracy pass, merged with your B&W + ARTRA work)
**Commits to deploy:** `81154ec` (accuracy pass) + `b2fe7c7` (changelog hash stamp), both on `main`, pushed.
**State at handoff:** `npx tsc --noEmit` clean · 15/15 vitest · `npm run build` clean (three-artifact build incl. SSR).

## What changed that you should verify after deploy

1. **Headline figures (now consistent everywhere — JSON, SSR, FAQ, llms.txt, fallbacks):**
   - Remaining-assets floor **$15,987,271,944** (42 records with located figures; high $21,742,138,783)
   - Cumulative payouts **$30,020,097,653** (12 filed $17,110,328,204 · 7 secondary $9,409,769,449 · ~$3.5B residual) — your B&W promotion is preserved and propagated
   - Dataset: **55 records** (54 active incl. 1 deferral, 1 closed), 42 with located figures
2. **New trusts:** Hercules Chemical ($4,018,899; 2.0% eff. 2022-10-17) and United Gilsonite/UGL ($16,044,821; 3.35% eff. 2024-04-11) — both (b) tier, Verus-administered, from research corpus followup_dim08. Your ARTRA record (0.70% filed notice, balance unpublished) was kept as-is — it supersedes my corpus-based 0.5–0.6% row, which I dropped.
3. **New Methodology section: "Per-Claimant Statistics: A Measured Void"** (+ matching FAQ JSON-LD entry + llms.txt section). Sourced from a completed sourcing audit: RAND TR-872 p. xvii (statistic cannot be computed), Garlock 504 B.R. 71, 96 ¶¶101–102 (22 trusts / ~$600K), Ableman Mealey's 30:19 (18 filed — verified verbatim against the authors' reprint PDF), ILR Philadelphia 2024 (~13 qualified). All caveats included; nothing is presented as a neutral measurement.
4. **Stale display fallbacks fixed:** Home.tsx, server/routers.ts, DebtClock tooltip, sitemap.xml (now 55 trust URLs — your Aug-12/13 additions were never in it), FAQ JSON-LD.
5. **Changelog backfilled:** your 2026-08-13 B&W promotion and the 2026-08-12 re-tier had no `docs/figure-provenance-changelog.md` lines; both are now recorded.

## Notes / judgment calls

- The **Corrections page** has three new 2026-08-16 entries covering the sync, the two added trusts, and the per-claimant section.
- The pre-existing `pacer.test.ts` court-code failure (`flmb` missing from the allowlist) is fixed; list now covers every court we actually pull from (incl. `ncwb` — see below).
- **PACER session note:** `pacer-session-ncwb.txt` (harvested 2026-08-16) works; `scripts/pacer-pull-ncwb.mjs` pulls W.D.N.C. docs directly. Used it for Garlock 10-31607 Docs 4355/4382/4608 ($3.90 fees).
- **Garlock questionnaire lead resolved as far as remotely possible:** the 850-claimant Supplemental Settlement Payment data was released **on physical hard drives to the Clerk** (Docs 4382/4608) and posted at `portal.ncwb.uscourts.gov/garlock/` — dead, and never Wayback-captured. Not on PACER. Only routes left: W.D.N.C. Clerk records request, Bates White/Roux, or Legal Newsline. Full trail in the vault audit (`trust-claim-statistics-sourcing-audit.md`, lead #2).

## Suggested post-deploy checks

- `/methodology` — new per-claimant section renders; revision log shows 2026-08-16 row
- `/` — both counters and the four stat tiles (54 active / 22 filed / 18 current-year / 42 with figures)
- `/trusts/hercules-chemical-co-asbestos-settlement-trust` and `/trusts/united-gilsonite-ugl-asbestos-pi-trust` resolve (they're in the sitemap now)
- View-source on `/methodology` — FAQ JSON-LD carries the new figures and the new per-claimant Q&A

— Kimi, 2026-08-16

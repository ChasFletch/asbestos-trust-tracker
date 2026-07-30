# Debt Clock Design Changelog

Design decisions for the trust fund clock billboard (`client/src/components/DebtClock.tsx`),
newest first. Records *what* changed and the exact values, so any element can be
tuned or reverted without archaeology.

## 2026-07-30 — Responsive backdrop variant

- `client/public/debtclock-bg-mobile.jpg` — 828×929 center-weighted portrait
  crop of the main plate (~317 KB vs ~547 KB). Full height retained because
  narrow faces are tall and `background-size: cover` crops by height there.
- `DebtClockBillboard` selects `BILL_BG_MOBILE` when `vw < 900`
  (mobile + tablet), `BILL_BG` otherwise.

## 2026-07-30 — Engraved backdrop relight + motion (commit `7ec74ba`)

**Backdrop artwork**
- Source: AI-generated plate ("National Industrial Reserve" banknote-style
  engraving: center medallion portrait, shipyard left, machine hall right,
  guilloche border). Working files live outside the repo in the project
  workspace (`debtclock-bg-v2.png` = raw 2048×1152 generation).
- Shipped asset: `client/public/debtclock-bg.jpg` — 1792×929, JPEG q80, ~547 KB;
  bottom 90px cropped to remove generator watermark.
- Replaces: `client/src/components/debtclock-bg.ts` (768×402 data-URI, deleted).
- Referenced in code as `const BILL_BG = "/debtclock-bg.jpg"`.
- Rendered with `inset: -4%` + `backgroundPosition: "center 62%"` to leave
  headroom for the Ken Burns drift and seat the portrait behind the panel.

**Digit sizes** (`DebtClockBillboard`)
- primarySize: mobile 24 / tablet 44 / desktop 68 (was 19/33/50)
- secondarySize: mobile 20 / tablet 30 / desktop 42 (was 17/23/30)

**Scrims** (stacked above backdrop, below content)
1. Glaze: `linear-gradient(180deg, rgba(6,34,29,.44) 0%, rgba(7,38,32,.20) 30%, rgba(5,28,24,.28) 62%, rgba(4,22,18,.55) 84%, rgba(3,18,15,.72) 100%)`
2. Center scrim: `radial-gradient(ellipse 72% 62% at 50% 42%, rgba(4,20,17,.26), transparent 68%)`
3. Text-zone shadow pools (readability without a global fade):
   - title: `ellipse 62% 17% at 50% 15%, rgba(3,16,13,.52)`
   - primary labels: `ellipse 56% 22% at 50% 53%, rgba(3,16,13,.42)`
   - secondary labels: `ellipse 34% 16% at 73% 79%, rgba(3,16,13,.40)`
4. Text shadows strengthened on title, label, sublabel (tight 1–2px dark edge
   + existing soft halo).

**Light layers**
- Primary spill: `ellipse 48% 26% at 50% 33%, rgba(255,178,72,.13) → transparent`,
  `mix-blend-mode: screen`, breathes 0.6↔1.0 over 11s (`dcSpill`).
- Secondary spill: `ellipse 32% 20% at 74% 74%, rgba(255,178,72,.10)`, same
  animation, delay −5.5s.
- Frame rim: `inset 0 0 46px rgba(255,160,60,.07)` box-shadow on the face.

**Motion timings** (all CSS, all disabled under `prefers-reduced-motion`)
| Element | Keyframe | Duration | Behavior |
|---|---|---|---|
| Backdrop plate | `dcKb` | 130s alternate | scale 1.02→1.08, translate (−0.7%,−0.9%) |
| Amber spills | `dcSpill` | 11s | opacity 0.6↔1.0 |
| Glass sheen band | `dcSweep` | 58s | sweep across, ~42% duty, skewX −14° |
| Dust motes (6) | `dcMote` | 38–56s each, staggered | drift up 90px, fade in/out |
| Smoke wisps (2) | `dcSmoke` | 52s / 66s, delay −31s | rise 64px, scale 1.4, fade |
| Digit flicker | JS (`flickerIdx` in `LedPanel`) | every 2.6–7.8s | one random digit dims to 0.25 for 90–250ms |

**Accessibility**
- All decorative layers `pointer-events: none`; backdrop `aria-hidden`.
- Digit flicker skipped entirely when `prefers-reduced-motion: reduce`.

## Pre-2026-07-30 — Original design

Billboard frame + screws, seven-segment LED renderer, count-up animation,
engraved banknote data-URI backdrop, teal glaze scrims. See git history before
`7ec74ba`.

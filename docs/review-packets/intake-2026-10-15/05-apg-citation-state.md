# APG citation state — private intake review (2026-10-15)

## Finding

The present public `/news` archive does not expose an APG item in the readable public feed response; it returns the archive shell and category description but no rendered update entries. The local implementation identifies the bounded legacy APG archive record as **row/id 5** (`APG_ARCHIVE_NEWS_ID = 5`). Its correction routine changes the title, summary, source label, and publication date when the exact obsolete wording is present, but the corrected source value is only the text label **“APG Asbestos Trust Notice of Payment Percentage Increase (April 13, 2026)”**. No exact direct source URL is stored or displayed by that row-level correction path, and the row does not carry a correction/history notation. This is a citation-state finding only; no row or database was changed.

The public APG-equivalent trust page currently shows **6%**, effective **April 13, 2026**, and notes that the rate was raised from **5.3% to 6.0%**. It displays the source title “APG Asbestos Trust Notice of Payment Percentage Increase (April 13, 2026)” but, in the public text surface reviewed, does not expose that title as an exact direct PDF link or show an APG-specific correction/history entry. The public official-rate-notices history currently lists 18 records, but APG is not among those rendered records. The general provenance and corrections pages document site-wide history/correction mechanisms, yet neither page contains an APG-specific entry in the reviewed public output.

The official APG Resources index does provide the exact direct source link. It lists **“Notice Regarding Payment Percentage Increase (04/27/2026)”** and links to the APG-hosted document:

<https://apg.mfrclaims.com/assets/documents/resources/APG%20Trust%20Notice%20of%20Payment%20Percentage%20Increase%20%28April%2013%202026%29.pdf>

The official resources listing therefore confirms the April 27, 2026 index/listing date while the linked document title identifies the notice as concerning April 13, 2026. The official APG homepage states that the initial Payment Percentage is **6.0%**. The retained project source record/manual verification describes the notice as an increase from **5.3% to 6.0% effective April 13, 2026, with TAC/FCR consent**. This note preserves that exact rate/date/consent statement and does not infer any broader current-payment status or compare trusts.

## Uncertainty and access note

The APG document URL returned an HTML **“Connection denied by Geolocation”** response when fetched directly from this sandbox, so the PDF itself was not independently text-extracted here. The official APG Resources page was successfully read and supplied the direct link and listing metadata; the official homepage and the project’s existing source-led verification record corroborate the 6.0% rate and April 13 effective date. The public `/news` response may be client-rendered beyond the text extraction surface, so the absence of a rendered APG item there should be read as an observed public-surface limitation, not proof that no underlying record exists.

## Sources reviewed

1. [Official APG Resources index](https://apg.mfrclaims.com/resources.html) — lists the April 27, 2026 payment-percentage notice and exposes the exact APG-hosted direct document URL.
2. [Official APG homepage](https://apg.mfrclaims.com/) — states that the initial Payment Percentage is 6.0%.
3. [APG trust-equivalent public page](https://asbestostrusts.org/trusts/a-p-green-apg-asbestos-trust) — shows 6%, effective April 13, 2026; notes the increase from 5.3% to 6.0%; source title shown without a direct link in the reviewed text surface.
4. [Public news archive](https://asbestostrusts.org/news) — archive shell/category description; no APG item rendered in the reviewed response.
5. [Official payment-notice history](https://asbestostrusts.org/payment-notices) — 18 rendered records; no APG entry in the reviewed response.
6. [Public figure provenance](https://asbestostrusts.org/provenance) and [correction policy/history](https://asbestostrusts.org/corrections) — general history/correction surfaces; no APG-specific entry in the reviewed output.
7. Local implementation references, read-only: `/home/ubuntu/asbestos-trust-tracker/server/db.ts` (APG row/id 5 constants and correction routine) and `/home/ubuntu/asbestos-trust-tracker/docs/payment-rate-verification-2026-10-07/manual-official-payment-rate-sweep.md` (source-led APG verification record).

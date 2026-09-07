# Manville Notice and Monitoring Audit — September 6, 2026

## Primary-Source Findings

The official Manville Trust announcement dated April 29, 2021 links to a Claims Resolution Management Corporation (CRMC) notice posted February 18, 2021. That notice states that the trustees approved an **immediate** increase in the pro rata payment percentage from **4.3% to 5.1%**. It further states that eClaims changes were implemented on **Wednesday, February 17, 2021**, including 5.1% for future offers and reissuance of outstanding offers at 5.1%.

The official CRMC announcement titled **“Manville: Increase in the pro rata payment percentage,”** posted **September 3, 2026**, states that the trustees approved an **immediate** increase from **5.1% to 5.6%**. It states that eClaims changes were implemented on **Wednesday, September 2, 2026**, setting future offers to 5.6% and reissuing outstanding offers at 5.6%. The notice also says eligible retroactive supplemental-payment adjustments are planned for mid-October.

Accordingly, the current tracker record of 5.1% effective February 1, 2021 is stale. The primary source supports a current 5.6% payment percentage, with September 2, 2026 as the system-implementation date and September 3, 2026 as the official notice-posting date.

## Production and Monitoring Findings

The published tracker now serves the 5.6% rate, the September 2 effective implementation date, the September 3 notice-posting date, and the direct CRMC source URL in raw server-rendered trust-detail HTML and in the `trusts.csv` export. The public trust-data API and CSV export now return `Cache-Control: no-store`.

The earlier monitoring configuration was a weekly **staleness and crawler-visibility** check. It compared existing record dates and tested crawler-visible homepage, embed, and CSV output; it did not inspect the official CRMC Manville announcement feed. Its registered schedule belongs to the earlier project task, so the current task-local schedule query returned no record, and the available production-log window contained no recorded monitor execution. Accordingly, a specific last successful run cannot be independently established from this session.

The repair extends the existing scheduled handler rather than creating a second system. On each weekly run, it now reads the official CRMC Manville feed, compares the newest payment-increase notice publication date with the reviewed date stored in the canonical tracker record, and sends an owner alert requesting source review if the source is newer. It does not automatically change trust data. A separate runtime defect also explained the delayed display after a GitHub data update: a service instance could retain the raw source cache. The loader now cache-busts the GitHub source request, limits its resilience cache to one minute, and prevents browser and edge caching of the public data responses.

## Sources

- [Manville Trust, “Manville Pro Rata” (April 29, 2021)](https://mantrust.claimsres.com/2021/04/29/manville-pro-rata-2/)
- [CRMC, “Manville: MV Trust Pro Rata Increase” (February 18, 2021)](https://www.claimsres.com/2021/02/18/manville-mv-trust-pro-rata-increase/)
- [CRMC, “Manville: Increase in the pro rata payment percentage” (September 3, 2026)](https://www.claimsres.com/2026/09/03/manville-increase-in-the-pro-rata-payment-percentage/)

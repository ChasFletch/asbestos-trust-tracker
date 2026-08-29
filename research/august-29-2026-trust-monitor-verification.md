# August 29, 2026 Trust-Monitor Verification Record

## Scope

This record verifies two user-supplied primary PDFs received on August 29, 2026: an Owens-Illinois Asbestos Personal Injury Trust payment-percentage notice and the Manville Personal Injury Settlement Trust Q2 2026 financial statements. Both source files are retained in the site’s primary-source library and linked from the relevant trust records.

## Verified updates

| Trust | Verified finding | Source location | Data action |
|---|---|---|---|
| Owens-Illinois Asbestos Personal Injury Trust / Paddock | Payment percentage increased from **50% to 65%**, effective **August 19, 2026**. The notice also provides for supplemental payments under TDP §4.3 for claimants paid at a lower rate. | Trust notice, page 1 | Corrected the prior erroneous structured 100% value to 65%, recorded the effective date, source, filed confidence, upward direction, change-log entry, and source-library PDF. |
| Manville Personal Injury Settlement Trust | Net claimants’ equity was **$570,516,505** as of **June 30, 2026**. Exhibit III reports **$5,343,613,806** in Total Trust Liquidated Claims on **1,041,171** claims. | Doc 4480, filed July 27, 2026; equity on page 6, liquidated-claims total in Exhibit III | Updated the asset component and cumulative-series component, source links, change log, and bottom-up payout aggregation. The series is explicitly labeled as liquidated value, not a pure cash-paid total. |

## Reconciled aggregate effect

Manville’s asset component rose by **$31,256,505**, from $539,260,000 to $570,516,505. The documented remaining-assets floor therefore moves from **$15,987,271,944** to **$16,018,528,449**. Its cumulative liquidated-claims component rose by **$13,891,553**, moving the tracker’s bottom-up payout series from **$30,020,097,653** to **$30,033,989,206**; the filed/source-linked tier moves from **$17,110,328,204** to **$17,124,219,757**.

## Publication judgment

The trust-issued O-I notice supports a published payment-percentage news item. The supplied Manville filing supports the data and source-library update. The weekly digest’s additional litigation developments were not separately published in this update because the associated primary docket materials were not among the supplied source files; this preserves the project rule that site legal-news assertions require direct, reliable source support.

## Monitoring follow-up

The supplied monitoring report identifies a legitimate coverage issue: the O-I payment-percentage notice was discoverable through an official news feed rather than a document directory. The `trust_monitor.py` implementation was not present in this web project after a repository-wide search, so its news-feed discovery pass cannot be modified here. The next monitor run should add official news/feed pages to each trust’s crawled URLs and maintain a separate “not checked” status for unavailable or unknown sites rather than treating either condition as no change.

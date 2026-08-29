export type NewsBrief = {
  slug: string;
  title: string;
  date: string;
  category: string;
  summary: string;
  sourceUrl: string;
  sourceLabel: string;
  markdown: string;
};

export const NEWS_BRIEFS: NewsBrief[] = [
  {
    slug: "manville-q2-2026-financial-statements",
    title: "Manville Trust Q2 2026: Net Claimants’ Equity Rises to $570.5M; Liquidated Claims Reach 1.04M",
    date: "2026-08-29",
    category: "annual_report",
    summary: "The Manville Personal Injury Settlement Trust’s Q2 2026 court filing reports $570.5 million in net claimants’ equity and 1,041,171 cumulative liquidated claims through June 30, 2026.",
    sourceUrl: "/manus-storage/Manville-Q2-2026-Financial-Statements-Doc4480_0eacb16f.pdf",
    sourceLabel: "Manville Q2 2026 Financial Statements and Report (S.D.N.Y. Doc. 4480)",
    markdown: `The Manville Personal Injury Settlement Trust’s second-quarter 2026 financial statements report **$570,516,505 in net claimants’ equity as of June 30, 2026**, following $539,264,338 at March 31. The report was filed in the Johns-Manville bankruptcy on July 27, 2026 as **S.D.N.Y. Case No. 82 B 11656 (KYP), Doc. 4480**.[1]

## What the Q2 filing reports

The filing’s special-purpose statement of net claimants’ equity lists **$635,822,702 in total assets** and **$65,306,197 in total liabilities**, resulting in the $570.5 million quarter-end equity figure.[1] Cash equivalents and investments totaled $632,971,774, including $44.5 million restricted and $588,471,774 unrestricted.[1]

For the three months ended June 30, the Trust reported $47,659,071 in net investment income and $13,891,553 in claims settled for personal-injury claims. Its cash-flow statement separately reports **$13,711,468 in claim payments made during the quarter**. Those are distinct accounting measures and should not be treated as interchangeable.[1]

| Filed Q2 2026 measure | Reported amount | What it represents |
|---|---:|---|
| Total assets | $635,822,702 | Balance-sheet assets at June 30, 2026 |
| Total liabilities | $65,306,197 | Reported liabilities at June 30, 2026 |
| Net claimants’ equity | $570,516,505 | Assets less reported liabilities at quarter end |
| Claim payments made (Q2) | $13,711,468 | Cash-flow payments during April–June 2026 |
| Claims settled (Q2) | $13,891,553 | Quarter’s statement-of-equity claim-settlement deduction |

## Claim volume through June 30

Exhibit III reports **1,041,171 cumulative Trust claims liquidated** through June 30, 2026. That figure is a claim-volume measure; it does not state a cumulative dollar amount paid by the Trust.[1]

The tracker now uses the 1,041,171 total on the Manville trust record and replaces the prior Q1 count of 1,036,966. The difference is **4,205 liquidated claims** between the two quarterly reporting dates. This comparison uses the Trust’s cumulative liquidated-claim totals, not a newly created claim count.[1]

## How this affects the tracker’s cumulative-payout series

The public tracker’s bottom-up payout series is not a balance-sheet line item. It combines the best retrievable inception-to-date or cumulative payment information from individual trusts and applies specifically labeled methods where a later filing updates a component.

For Manville, the prior documented component was updated by the **$13,891,553** “claims settled for personal injury claims” amount reported for Q2 in the statement of changes in net claimants’ equity. The tracker therefore now presents **$30,033,989,206** as the bottom-up cumulative-payout series, up from $30,020,097,653. This is a transparent series update, not a claim that the Q2 filing itself reports an inception-to-date cash-paid total.[1]

> **Important distinction:** $570.5 million is a June 30, 2026 quarter-end net-equity figure. The $30.03 billion tracker figure is a cross-trust, historical bottom-up payout series. Neither number should be substituted for the other.

## Source and review notes

This brief relies on the filed quarterly report and its exhibits. The report requires the Trustees to submit quarterly financial statements and supplemental information, including the number of Trust claims liquidated and the average amount per Trust claim paid or payable.[1] The source PDF is retained in the site’s primary-source library and may be opened directly below.

[1]: /manus-storage/Manville-Q2-2026-Financial-Statements-Doc4480_0eacb16f.pdf "Manville Personal Injury Settlement Trust, Financial Statements and Report for the Period Ending June 30, 2026, S.D.N.Y. Doc. 4480, filed July 27, 2026"
`,
  },
];

export const NEWS_BRIEFS_BY_SLUG = Object.fromEntries(
  NEWS_BRIEFS.map((brief) => [brief.slug, brief])
) as Record<string, NewsBrief>;

import { useEffect } from "react";
import { Link } from "wouter";

export default function Methodology() {
  useEffect(() => {
    const existing = document.getElementById("faq-schema");
    if (existing) return;
    const script = document.createElement("script");
    script.id = "faq-schema";
    script.type = "application/ld+json";
    script.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        { "@type": "Question", "name": "How much money is left in asbestos trust funds?", "acceptedAnswer": { "@type": "Answer", "text": "As of July 2026, the documented remaining assets floor of the U.S. asbestos bankruptcy trust system is $16,746,136,347, based on filed figures from 42 trusts. This is a floor, not a ceiling — trusts with no retrievable filed figure are excluded. Source: AsbestosTrusts.org." } },
        { "@type": "Question", "name": "Is the $30 billion asbestos trust fund figure accurate?", "acceptedAnswer": { "@type": "Answer", "text": "The '$30 billion available in asbestos trust funds' figure that circulates on law firm sites refers to total capitalization since 1988, not remaining assets. Remaining assets as of 2026 are approximately $16.7B (documented floor). Separately, our bottom-up estimate of cumulative payouts since 1988 is $29,981,797,653 — which is also approximately $30B. This is a coincidence of scale: the two figures measure completely different things." } },
        { "@type": "Question", "name": "How many asbestos trust funds exist in the United States?", "acceptedAnswer": { "@type": "Answer", "text": "AsbestosTrusts.org documents 42 U.S. asbestos bankruptcy trusts established under §524(g) of the Bankruptcy Code. As of June 2025, 41 are active and 1 (Rapid-American) has been depleted and closed." } },
        { "@type": "Question", "name": "What is a payment percentage in an asbestos trust?", "acceptedAnswer": { "@type": "Answer", "text": "A payment percentage is the fraction of the scheduled value of an approved asbestos claim that the trust actually pays. Payment percentages range from 4.3% (Babcock & Wilcox) to 100% (NARCO) as of 2026." } },
        { "@type": "Question", "name": "How much has been paid out from asbestos trust funds?", "acceptedAnswer": { "@type": "Answer", "text": "The bottom-up estimate for cumulative payouts since 1988 is $29,981,797,653 — built from 14 filed annual reports ($19,810,476,508), 5 secondary-citing-filed components ($6,671,321,145), and a labeled residual allowance of ~$3.5B for ~25 trusts with no public figures. The old $24B round figure was a top-down placeholder anchored on 2011 GAO data; the bottom-up rebuild produces ~$30B. Source: AsbestosTrusts.org." } },
        { "@type": "Question", "name": "Which asbestos trust fund has the most money?", "acceptedAnswer": { "@type": "Answer", "text": "As of 2026, the W.R. Grace Asbestos PI Trust has the largest documented net assets at approximately $1.995 billion. The NARCO Asbestos Trust has $1.260 billion (filed, December 2025), and Pittsburgh Corning has $1.294 billion." } },
        { "@type": "Question", "name": "What is the source classification system used by AsbestosTrusts.org?", "acceptedAnswer": { "@type": "Answer", "text": "AsbestosTrusts.org uses three tiers: (a) Filed Court Document — drawn directly from a U.S. bankruptcy court filing; (b) Secondary Source Citing Primary — a secondary source that explicitly cites a primary filing; (c) Estimate or Inference — derived from available data or actuarial projections." } }
      ]
    });
    document.head.appendChild(script);
    return () => { script.remove(); };
  }, []);

  return (
    <div className="container py-12 max-w-3xl">
      <div className="mb-8">
        <div className="text-xs font-mono text-primary/70 uppercase tracking-widest mb-2">Research Methodology</div>
        <h1 className="font-display font-bold uppercase tracking-wider text-2xl mb-3">
          How We Calculate the Aggregate
        </h1>
        <p className="text-muted-foreground text-sm leading-relaxed">
          AsbestosTrusts.org is the only publicly available tracker that derives its aggregate figures from primary court filings rather than repeating secondary estimates. This page explains exactly how the numbers are calculated, what is known with certainty, what is estimated, and what remains structurally unknowable from public sources.
        </p>
      </div>

      <div className="space-y-10 text-sm leading-relaxed">

        {/* Source Classification */}
        <section>
          <h2 className="font-display font-bold uppercase tracking-wider text-base mb-4 text-foreground">
            Source Classification System
          </h2>
          <p className="text-muted-foreground mb-4">
            Every financial figure in our database is tagged with one of three source confidence classifications. This system was developed to distinguish primary evidence from secondary reporting and estimation — a distinction that no other public tracker makes.
          </p>
          <div className="space-y-4">
            {[
              {
                code: "a",
                label: "Filed Court Document",
                color: "oklch(0.72 0.18 150)",
                desc: "The figure is drawn directly from a document filed with a U.S. bankruptcy court — an annual report, quarterly financial statement, or payment percentage change notice. These are the highest-confidence figures. The docket citation is included in the trust record.",
                example: "Manville Trust Q1 2026 quarterly filing (S.D.N.Y. Doc 4479, filed April 27, 2026): Net Claimants' Equity $539,264,338.",
              },
              {
                code: "b",
                label: "Secondary Source Citing Primary",
                color: "oklch(0.72 0.18 45)",
                desc: "The figure appears in a secondary source (trust website, administrator press release, or published research report) that explicitly cites a primary court filing or audited financial statement. Medium confidence — the primary document exists but was not directly retrieved.",
                example: "W.R. Grace trust website reporting $1.84B in total assets, citing the FY2024 annual report filed with Bankr. D. Del.",
              },
              {
                code: "c",
                label: "Estimate or Inference",
                color: "oklch(0.65 0.18 20)",
                desc: "The figure is an estimate derived from the most recent available data, actuarial projections, or inference from partial information. These figures are clearly labeled and should not be cited as primary evidence.",
                example: "Babcock & Wilcox net assets estimated from prior-year filing adjusted for reported claim volume.",
              },
            ].map((s) => (
              <div key={s.code} className="flex gap-4 p-4 rounded border border-border/50 bg-card/40">
                <div
                  className="shrink-0 w-8 h-8 rounded flex items-center justify-center font-mono font-bold text-sm"
                  style={{ background: `${s.color}20`, color: s.color, border: `1px solid ${s.color}40` }}
                >
                  ({s.code})
                </div>
                <div>
                  <div className="font-semibold text-foreground mb-1">{s.label}</div>
                  <p className="text-muted-foreground mb-2">{s.desc}</p>
                  <p className="text-xs text-muted-foreground/60 italic">Example: {s.example}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Aggregate Calculation */}
        <section>
          <h2 className="font-display font-bold uppercase tracking-wider text-base mb-4 text-foreground">
            Aggregate Remaining Assets: How the Number Is Calculated
          </h2>
          <p className="text-muted-foreground mb-3">
            The aggregate "Estimated Remaining Assets" figure displayed on the homepage is a <strong className="text-foreground">point-in-time sum</strong> of the net asset figures for all active trusts in our database, subject to the following methodology rules:
          </p>
          <ol className="list-decimal list-inside space-y-2 text-muted-foreground pl-2">
            <li>For each trust, we use the most recently available net asset figure, regardless of its as-of date.</li>
            <li>Figures classified (a) are used as reported. Figures classified (b) are used as reported with a ±5% uncertainty band. Figures classified (c) are excluded from the point estimate and contribute only to the reported range.</li>
            <li>The displayed figure is the midpoint of the low and high range estimates. The range is shown below the clock.</li>
            <li>The aggregate is <strong className="text-foreground">not inflation-adjusted</strong> and does not account for future claim liabilities or actuarial projections.</li>
            <li>Trusts with no available net asset figure are excluded from the aggregate but are listed in the database with their known payment percentage data.</li>
          </ol>
          <div className="mt-4 p-3 rounded border border-primary/20 bg-primary/5 text-xs text-muted-foreground">
            <strong className="text-foreground">Current aggregate as-of note:</strong> The figures in our database have mixed as-of dates ranging from 2021 to 2026. The Manville Trust figure is current as of March 31, 2026 (Q1 2026 quarterly filing). Most other figures are from FY2023 or FY2024 annual reports. The aggregate is therefore a <em>floor estimate</em> — actual current balances may differ.
          </div>
        </section>

        {/* The $30B Problem */}
        <section>
          <h2 className="font-display font-bold uppercase tracking-wider text-base mb-4 text-foreground">
            The "$30 Billion" Citation Problem
          </h2>
          <p className="text-muted-foreground mb-3">
            The "$30 billion available in asbestos trust funds" figure that appears across law firm websites, Wikipedia, and news articles traces to a single source: the U.S. Government Accountability Office report <em>Asbestos Injury Compensation: The Role and Administration of Asbestos Trusts</em> (GAO-11-819, September 2011). That report found that 60 trusts had been established with approximately $37 billion in <strong className="text-foreground">total capitalization</strong> since 1988 — not $30 billion, and not a current balance.
          </p>
          <p className="text-muted-foreground mb-3">
            The GAO report also found that $17.5 billion had already been paid out on 3.3 million claims through 2010. The "$30 billion" figure appears to have entered circulation as a rough subtraction that was then cited, recited, and eventually detached from its source entirely.
          </p>
          <p className="text-muted-foreground mb-3">
            There is an additional layer of confusion: our bottom-up estimate of <em>cumulative payouts</em> since 1988 is $29,981,797,653 — which is also approximately $30 billion. This is a coincidence of scale. The two figures measure completely different things: total capitalization (what went in) versus total claims paid (what went out). Neither is the current remaining balance.
          </p>
          <p className="text-muted-foreground">
            Our documented floor for remaining assets — based on filed figures for all trusts with retrievable annual reports — is <strong className="text-foreground">$16,746,136,347</strong>. This is a floor, not a ceiling: trusts with no public filing are excluded from this sum. This figure is updated as new annual reports are filed each spring.
          </p>
        </section>

        {/* Known Gaps */}
        <section>
          <h2 className="font-display font-bold uppercase tracking-wider text-base mb-4 text-foreground">
            Known Data Gaps
          </h2>
          <p className="text-muted-foreground mb-3">
            The following gaps exist in our current dataset. We document them explicitly rather than papering over them with estimates.
          </p>
          <div className="space-y-2">
            {[
              { gap: "PACER-only documents", detail: "W.R. Grace (FY2025) and DII Industries (FY2025) have been pulled and documented. Pittsburgh Corning is blocked (court-side access issue, cause undetermined). Celotex documents are restricted ('You do not have access to the restricted document'). Babcock & Wilcox (FY2024) is queued for the next PACER session." },
              { gap: "Smaller trusts", detail: "Approximately 40 trusts with smaller asset bases have no publicly available financial data. These trusts collectively represent an estimated 5–10% of total system assets." },
              { gap: "Delticus / Bendix", detail: "The Delticus trust (Honeywell / Bendix) is administered by Third Point / Delticus and does not publish public financial statements. Its $1.6B figure is from a 2021 secondary source." },
              { gap: "Pre-1995 Manville data", detail: "Manville Trust payment percentage history prior to 1995 (the 100% era, 1988–1994) is not documented in current public filings." },
            ].map((g) => (
              <div key={g.gap} className="p-3 rounded border border-border/40 bg-card/30">
                <div className="font-medium text-foreground text-xs mb-1">{g.gap}</div>
                <p className="text-xs text-muted-foreground">{g.detail}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Cumulative Payouts Methodology */}
        <section>
          <h2 className="font-display font-bold uppercase tracking-wider text-base mb-4 text-foreground">
            Cumulative Payouts Methodology
          </h2>
          <p className="text-muted-foreground mb-3">
            The cumulative payouts clock displays <strong className="text-foreground">$29,981,797,653</strong> — a bottom-up estimate of total claims paid by all U.S. asbestos bankruptcy trusts since 1988. This figure replaced a round $24 billion placeholder in July 2026. The methodology is documented in full at <code className="text-xs bg-muted px-1 py-0.5 rounded">docs/methodology-cumulative-payouts.md</code> in the project repository.
          </p>

          <h3 className="font-semibold text-foreground text-sm mb-3 mt-5">Why the Number Changed from $24B to ~$30B</h3>
          <p className="text-muted-foreground mb-3">
            The $24B was a top-down placeholder anchored on 2011 GAO data. Three independent anchors all pointed higher:
          </p>
          <ul className="list-disc list-inside space-y-1 text-muted-foreground pl-2 mb-4 text-xs">
            <li>GAO-11-819's "$17.5 billion paid" was frozen at December 31, 2010 — it says nothing about the last 15+ years of payments.</li>
            <li>Bates White / Mealey's tables document $14.0 billion paid in 2006–2011 <em>alone</em> — six years.</li>
            <li>The research corpus's own assessment: cumulative payments by 2026 are "plausibly $30B+" (RAND documented ~$3.3B of trust outlays in 2008 alone).</li>
          </ul>

          <h3 className="font-semibold text-foreground text-sm mb-3">Three-Tier Build</h3>
          <div className="space-y-3 mb-4">
            {[
              {
                tier: "Tier 1 — Filed figures",
                amount: "$19,810,476,508",
                count: "14 trusts",
                confidence: "a",
                color: "oklch(0.72 0.18 150)",
                detail: "Inception-to-date claims payments read directly from filed annual reports or court documents. As-of dates range 2006–2026. The four historical figures (Owens Corning/Fibreboard 2009, Armstrong 2014, USG 2008, Celotex 2006) are floors — those trusts kept paying after their last publicly retrievable report.",
              },
              {
                tier: "Tier 2 — Secondary citing filed",
                amount: "$6,671,321,145",
                count: "5 components",
                confidence: "b",
                color: "oklch(0.72 0.18 45)",
                detail: "Used only where no filed figure is in hand. Each comes from a secondary compilation that cites the trust's own filed annual report. Components: Pittsburgh Corning $3,071,420,000 (2022); Babcock & Wilcox $1,940,000,000 floor (2024); Celotex post-2006 growth $783,146,017 (2021); OC/FB post-2009 growth $534,090,000 (2022); G-I Holdings (GAF) $342,665,128 (2022). Every Tier 2 figure graduates to Tier 1 when its PACER pull lands.",
              },
              {
                tier: "Tier 3 — Estimated residual",
                amount: "~$3,500,000,000",
                count: "~25 trusts",
                confidence: "c",
                color: "oklch(0.65 0.18 20)",
                detail: "~25 active trusts publish no inception-to-date payment figure anywhere publicly accessible (ACandS, A.P. Green, ASARCO, Bondex, Combustion Engineering, Eagle-Picher, Federal-Mogul/T&N, Fuller-Austin, Garlock GST, Kaiser, Paddock, Quigley, Rapid-American, Yarway, and others). The allowance is derived from system payout run-rates (~$1.5–2B/yr documented by Bates White and RAND) net of itemized components. Range: $2.5–5B.",
              },
            ].map((t) => (
              <div key={t.tier} className="flex gap-3 p-3 rounded border border-border/40 bg-card/30">
                <div
                  className="shrink-0 w-7 h-7 rounded flex items-center justify-center font-mono font-bold text-xs"
                  style={{ background: `${t.color}20`, color: t.color, border: `1px solid ${t.color}40` }}
                >
                  ({t.confidence})
                </div>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-baseline gap-2 mb-1">
                    <span className="font-semibold text-foreground text-xs">{t.tier}</span>
                    <span className="font-mono text-foreground text-xs">{t.amount}</span>
                    <span className="text-muted-foreground/60 text-xs">({t.count})</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{t.detail}</p>
                </div>
              </div>
            ))}
          </div>

          <h3 className="font-semibold text-foreground text-sm mb-2">Honest Caveats</h3>
          <ol className="list-decimal list-inside space-y-1 text-muted-foreground pl-2 mb-4 text-xs">
            <li><strong className="text-foreground">Floor-leaning estimate.</strong> Several Tier 1/2 as-of dates are stale; payments after those dates are only partly captured. Babcock &amp; Wilcox is a stated floor.</li>
            <li><strong className="text-foreground">The residual is an allowance, not a measurement.</strong> We publish the range ($2.5–5B), not false precision.</li>
            <li><strong className="text-foreground">Tier 2 figures graduate to Tier 1</strong> as PACER pulls land — see the queue in the project repository.</li>
            <li><strong className="text-foreground">No class-c marketing-site figures.</strong> Nothing from mesothelioma.com, asbestosclaims.law, or similar sites is used anywhere in this build.</li>
          </ol>

          <h3 className="font-semibold text-foreground text-sm mb-2">Revision Log</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="border-b border-border/40">
                  <th className="text-left py-2 pr-4 text-muted-foreground font-medium">Date</th>
                  <th className="text-left py-2 pr-4 text-muted-foreground font-medium">Figure</th>
                  <th className="text-left py-2 text-muted-foreground font-medium">Change</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border/20">
                  <td className="py-2 pr-4 text-muted-foreground">pre-2026-07-29</td>
                  <td className="py-2 pr-4 font-mono text-muted-foreground">$24,000,000,000</td>
                  <td className="py-2 text-muted-foreground">Round placeholder point estimate (top-down, GAO-anchored)</td>
                </tr>
                <tr>
                  <td className="py-2 pr-4 text-muted-foreground">2026-07-29</td>
                  <td className="py-2 pr-4 font-mono text-foreground">$29,981,797,653</td>
                  <td className="py-2 text-muted-foreground">Bottom-up build (commit <code className="bg-muted px-1 rounded">2b2ecf1</code>): 14 filed + 5 secondary-citing-filed + labeled residual</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Update Schedule */}
        <section>
          <h2 className="font-display font-bold uppercase tracking-wider text-base mb-4 text-foreground">
            Update Schedule
          </h2>
          <p className="text-muted-foreground mb-3">
            The database is updated on the following schedule:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            {[
              { freq: "Weekly", what: "Payment percentage change notices from all trust websites. Manville Trust quarterly financial data (when available)." },
              { freq: "April–June (Annual)", what: "Annual report figures for all DCPF-administered trusts (Armstrong, B&W, Celotex, Federal Mogul, Flintkote, NARCO, OC/Fibreboard, PCC, USG, W.R. Grace) and Verus LLC trusts." },
              { freq: "On detection", what: "Any court filing, press release, or trust website update detected by our automated monitoring pipeline." },
            ].map((u) => (
              <div key={u.freq} className="p-3 rounded border border-border/40 bg-card/30">
                <div className="font-semibold text-primary text-xs mb-1 uppercase tracking-wider">{u.freq}</div>
                <p className="text-muted-foreground">{u.what}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Footer nav */}
        <div className="pt-4 border-t border-border/40 flex gap-6 text-xs text-muted-foreground">
          <Link href="/trusts" className="text-primary hover:underline no-underline">← Trust Database</Link>
          <Link href="/about" className="text-primary hover:underline no-underline">About This Project →</Link>
        </div>
      </div>
    </div>
  );
}

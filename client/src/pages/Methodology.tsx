import { Link } from "wouter";

export default function Methodology() {
  return (
    <div className="container py-12 max-w-3xl">
      <div className="mb-8">
        <div className="text-xs font-mono text-primary/70 uppercase tracking-widest mb-2">Research Methodology</div>
        <h1 className="font-display font-bold uppercase tracking-wider text-2xl mb-3">
          How We Calculate the Aggregate
        </h1>
        <p className="text-muted-foreground text-sm leading-relaxed">
          TrustFundClock.org is the only publicly available tracker that derives its aggregate figures from primary court filings rather than repeating secondary estimates. This page explains exactly how the numbers are calculated, what is known with certainty, what is estimated, and what remains structurally unknowable from public sources.
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
          <p className="text-muted-foreground">
            Our best current estimate of remaining assets — based on primary and secondary sources for all major trusts — is <strong className="text-foreground">$17–20 billion</strong>, with the midpoint around $18.6 billion. This figure will be updated as new annual reports are filed each spring.
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
              { gap: "PACER-only documents", detail: "Annual reports for W.R. Grace (FY2025), Pittsburgh Corning (FY2024), Celotex (FY2024), and Babcock & Wilcox (FY2024) are filed with bankruptcy courts but not yet available in the free RECAP archive. These figures are currently classified (b) or (c) pending direct retrieval." },
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

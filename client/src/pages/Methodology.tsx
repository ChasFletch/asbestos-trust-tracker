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
            <li>The displayed figure is the <strong className="text-foreground">documented floor</strong>: the exact sum of the latest located asset figure for each included trust. The broader range shown below the clock is a separately labeled estimate, not a midpoint calculation.</li>
            <li>The aggregate is <strong className="text-foreground">not inflation-adjusted</strong> and does not account for future claim liabilities or actuarial projections.</li>
            <li>Trusts with no available net asset figure are excluded from the aggregate but are listed in the database with their known payment percentage data.</li>
          </ol>
          <div className="mt-4 p-3 rounded border border-primary/20 bg-primary/5 text-xs text-muted-foreground">
            <strong className="text-foreground">Current aggregate as-of note:</strong> As of August 29, 2026, the documented asset floor is <strong className="text-foreground">$16,018,528,449</strong> across 42 records with a located asset figure. The underlying dates are mixed, largely spanning 2021–2026. Trusts whose balance is not publicly reported are retained in the database but excluded from the sum, so this is a <em>documented floor</em>, not a current census or an actuarial projection.
          </div>
        </section>

        {/* Historical Benchmark and $30B Problem */}
        <section>
          <h2 className="font-display font-bold uppercase tracking-wider text-base mb-4 text-foreground">
            Historical Benchmarks and the "$30 Billion" Claim
          </h2>
          <p className="text-muted-foreground mb-3">
            No primary source reviewed by this project states that <strong className="text-foreground">$30 billion is currently available</strong> in asbestos trusts. The phrase blends historical figures that measure different things and carry different as-of dates. The <a className="text-primary underline underline-offset-2" href="https://www.gao.gov/products/gao-11-819" target="_blank" rel="noopener noreferrer">Government Accountability Office (GAO-11-819)</a> reported in 2011 that 60 trusts had been established with approximately $37 billion in total assets and that available payment data showed about $17.5 billion paid through 2010. Those are historical system-wide observations, not a 2026 balance.
          </p>
          <p className="text-muted-foreground mb-3">
            The closest documented origin is a <a className="text-primary underline underline-offset-2" href="https://docs.house.gov/meetings/JU/JU05/20130313/100449/HHRG-113-JU05-Wstate-ScarcellaM-20130313.pdf" target="_blank" rel="noopener noreferrer">2013 House Judiciary witness statement</a> that cites the 2012 Bates White / Mealey&apos;s overview. It described more than $18 billion in confirmed trust assets plus $11–12 billion in <em>proposed</em> trust assets pending confirmation. Combining those measures produces roughly $30 billion, but it is a 2012–2013 snapshot that included projected funding for unconfirmed reorganizations—not money currently available to claimants.
          </p>
          <div className="mb-3 rounded border border-border/40 bg-card/30 p-3 text-xs text-muted-foreground">
            <div className="mb-1 font-semibold text-foreground">What the documented propagation record shows</div>
            <p>
              A 2011 House hearing recorded a witness&apos;s attribution of “north of $30 billion available” to RAND. The 2013 Bates White statement describes the more specific $18B-confirmed-plus-$11–12B-pending construction. A <a className="text-primary underline underline-offset-2" href="http://cardozolawreview.com/wp-content/uploads/2019/07/6.Brickman.40.5.5.pdf" target="_blank" rel="noopener noreferrer">2019 Brickman article</a> then cited the 2013 Mealey&apos;s overview while restating more than $30B in remaining assets. Modern marketing pages commonly strip the dates and underlying measure. These are conflicting historical assertions, not evidence of a current audited balance.
            </p>
          </div>
          <p className="text-muted-foreground mb-3">
            A later <a className="text-primary underline underline-offset-2" href="https://www.mesothelioma-lawyerblog.com/wp-content/uploads/sites/199/2017/05/Bates-White-Artile_Reorganized-Mess.pdf" target="_blank" rel="noopener noreferrer">Bates White / Mealey&apos;s commentary</a> reported roughly $18.6 billion in confirmed trust assets at year-end 2013, plus $160 million in deferred funding, while noting that several 2014 confirmations were expected to add funding. The <a className="text-primary underline underline-offset-2" href="https://instituteforlegalreform.com/wp-content/uploads/2020/10/Dubious_Distribution_Asbestos_Paper_Web.pdf" target="_blank" rel="noopener noreferrer">U.S. Chamber Institute for Legal Reform&apos;s 2018 report</a>, an advocacy publication, described nearly $25 billion in assets and more than $2 billion in deferred funding at year-end 2016. These are useful dated benchmarks, but neither is a current balance nor a substitute for a trust-by-trust filed-source review.
          </p>
          <p className="text-muted-foreground mb-3">
            The tracker therefore does not treat "$30 billion available" as a sourceable fact. It is best understood as a stale marketing shorthand that has lost the underlying measure and date. It also must not be confused with this site&apos;s separate bottom-up estimate of <em>cumulative payouts</em> since 1988: $30,033,989,206 measures payments made or liquidated under the source series, not assets remaining.
          </p>
          <p className="text-muted-foreground">
            Our documented floor for remaining assets is <strong className="text-foreground">$16,018,528,449</strong>. It is a current-project calculation from the individually cited figures displayed in this database. It is a floor, not a ceiling: no-balance records and unavailable or sealed filings are excluded, and the underlying reports have mixed as-of dates.
          </p>
        </section>

        {/* Per-Claimant Statistics */}
        <section>
          <h2 className="font-display font-bold uppercase tracking-wider text-base mb-4 text-foreground">
            Per-Claimant Statistics: A Measured Void
          </h2>
          <p className="text-muted-foreground mb-3">
            Two questions dominate claimant-side search traffic — how many trusts does a typical claimant file with, and how much does a claimant recover in total — and <strong className="text-foreground">no public dataset can answer either</strong>. Trusts see only their own claimants; no federal body collects cross-trust per-claimant filings. RAND states the limitation directly: "It is not possible to use trust-level data to determine the number of trusts providing payments to the same individual or the amount the trusts together pay to an individual claimant." (RAND TR-872, 2010, p. xvii)
          </p>
          <p className="text-muted-foreground mb-3">
            The only measured figures in existence come from adversarial proceedings, and each measures something slightly different:
          </p>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground pl-2 mb-3 text-xs">
            <li><strong className="text-foreground">22 trusts alleged; about $600,000 in trust recoveries</strong> — the Garlock estimation ruling's "typical claimant," based on 2010-era data presented by the debtor's own expert and adopted in a contested proceeding (<em>In re Garlock Sealing Technologies</em>, 504 B.R. 71, 96 (Bankr. W.D.N.C. 2014), Findings of Fact ¶¶101–102). Payment percentages at many trusts have since been reduced, so these figures likely overstate today's recoveries.</li>
            <li><strong className="text-foreground">18 trust claim forms actually filed</strong> — a study of 1,844 Crane Co. mesothelioma cases (2007–2011) matched to Garlock discovery data (Ableman, Kelso &amp; Scarcella, 30:19 Mealey's Litig. Rep.: Asbestos 1, Nov. 4, 2015; verified against the authors' reprint). The closest measurement to "claims filed," from a two-defendant subset.</li>
            <li><strong className="text-foreground">~13 trusts qualified for</strong> — a 2024 study of Philadelphia mesothelioma dockets (U.S. Chamber ILR, March 2024). A different quantity (eligibility, not filings), no dollar figure, and defense-side sponsorship.</li>
          </ul>
          <p className="text-muted-foreground mb-3">
            Every measured figure is defense- or debtor-side in origin; no neutral or plaintiffs'-side measurement exists. The marketing figures that circulate instead — a "$41,000 average payout" (a RAND per-claim median at one trust, misdescribed) and "$300,000–$400,000 total recoveries" (no identifiable source) — should not be cited. There is also no referee: the U.S. Trustee Program's director testified in 2017 that for post-confirmation asbestos trusts "there is no independent policeman. There is no watchdog for that." (CHRG-115hhrg27890) GAO-11-819 found that where trusts did audit claims, "none indicated that these audits had identified cases of fraud."
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
              { gap: "PACER-only or unavailable documents", detail: "W.R. Grace, DII Industries, and Babcock & Wilcox filings have been pulled and documented. Pittsburgh Corning's relevant filings currently return a court-side 'document not available' response. Celotex FY2025 annual-report documents return an account-access restriction." },
              { gap: "Unpublished or unretrieved balances", detail: "Some active trusts publish a current payment percentage but no retrievable current balance. These records remain visible and are labeled 'not published' rather than silently treated as zero. They are excluded from the documented-assets floor." },
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

        {/* Oversight and audit context */}
        <section>
          <h2 className="font-display font-bold uppercase tracking-wider text-base mb-4 text-foreground">
            Oversight and Audit Context
          </h2>
          <p className="text-muted-foreground mb-3">
            <a className="text-primary underline underline-offset-2" href="https://www.gao.gov/products/gao-11-819" target="_blank" rel="noopener noreferrer">GAO&apos;s 2011 review</a> found that the 44 trust agreements it examined required annual financial reports to the bankruptcy court, while each trust retained discretion over what additional claim and payment information it released publicly. That is why this tracker distinguishes a filed report, a trust-posted notice, a secondary compilation, and a gap rather than treating each as interchangeable.
          </p>
          <p className="text-muted-foreground">
            GAO&apos;s discussion of audit practices is deliberately limited: officials at 2 of the 11 trusts interviewed described random or targeted claim samples, and one described an external audit that sent a sample of X-rays to an independent doctor. Officials who discussed audits did not report that those audits had identified fraud. Those findings describe a small interview sample; they are not a system-wide fraud rate or a basis to infer that every trust uses the same process.
          </p>
          <p className="text-muted-foreground mt-3">
            In a <a className="text-primary underline underline-offset-2" href="https://www.govinfo.gov/content/pkg/CHRG-115hhrg27890/html/CHRG-115hhrg27890.htm" target="_blank" rel="noopener noreferrer">2017 House Judiciary hearing record</a>, then-U.S. Trustee Program Director Clifford J. White III said that, for post-confirmation asbestos trusts, “there is no independent policeman. There is no watchdog.” We present that as his oversight observation in its hearing context—not as a quantified finding about any particular trust or claim.
          </p>
        </section>

        {/* Cumulative Payouts Methodology */}
        <section>
          <h2 className="font-display font-bold uppercase tracking-wider text-base mb-4 text-foreground">
            Cumulative Payouts Methodology
          </h2>
          <p className="text-muted-foreground mb-3">
            The cumulative payouts clock displays <strong className="text-foreground">$30,033,989,206</strong> — a bottom-up estimate of total claims paid or liquidated by all U.S. asbestos bankruptcy trusts since 1988 under the source series’ disclosed conventions. This figure replaced a round $24 billion placeholder in July 2026. The methodology is documented in full at <code className="text-xs bg-muted px-1 py-0.5 rounded">docs/methodology-cumulative-payouts.md</code> in the project repository.
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
                amount: "$17,124,219,757",
                count: "12 trusts",
                confidence: "a",
                color: "oklch(0.72 0.18 150)",
                detail: "Inception-to-date claims payments read directly from filed annual reports or court documents. As-of dates range 2006–2026. Babcock & Wilcox joined this tier on 2026-08-13: its FY2023 filed Annual Report and Account supports an approximately $1.9783B combined cumulative-payment figure. The historical Celotex 2006 figure remains a floor because that trust kept paying after its last publicly retrievable report. Owens Corning/Fibreboard, Armstrong, and USG remain in Tier 2 pending direct retrieval of their cited reports.",
              },
              {
                tier: "Tier 2 — Secondary citing filed",
                amount: "$9,409,769,449",
                count: "7 components",
                confidence: "b",
                color: "oklch(0.72 0.18 45)",
                detail: "Used only where no filed figure is in hand. Each comes from a secondary compilation that cites the trust's own filed annual report, or was re-tiered here by the 2026-08-12 provenance audit. Components: Owens Corning/Fibreboard $2,465,910,000 (2009, re-tiered); Armstrong $1,600,408,304 (2014, re-tiered); USG $612,130,000 (2008, re-tiered); Pittsburgh Corning $3,071,420,000 (2022); Celotex post-2006 growth $783,146,017 (2021); OC/FB post-2009 growth $534,090,000 (2022); and G-I Holdings (GAF) $342,665,128 (2022). Every Tier 2 figure graduates to Tier 1 when a direct filing is retrieved.",
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

          <div className="mt-6 mb-4 rounded border border-primary/25 bg-primary/5 p-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="font-semibold text-foreground text-sm">Follow every figure change</h3>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">The public figure-provenance timeline shows the prior and revised figure, the reason for each revision, the source class, and direct record links.</p>
              </div>
              <Link href="/provenance" className="inline-flex shrink-0 items-center justify-center rounded border border-primary/35 bg-background px-3 py-2 text-xs font-semibold text-primary no-underline transition-colors hover:bg-primary hover:text-primary-foreground">Open figure history →</Link>
            </div>
          </div>
          <h3 className="font-semibold text-foreground text-sm mb-2">Recent Revision Log</h3>
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
                <tr>
                  <td className="py-2 pr-4 text-muted-foreground">2026-08-13</td>
                  <td className="py-2 pr-4 font-mono text-foreground">$30,020,097,653</td>
                  <td className="py-2 text-muted-foreground">Babcock &amp; Wilcox FY2023 filed Annual Report and Account (E.D. La. 00-10992 Doc 7876-1) promoted approximately $1.9783B from Tier 2 to Tier 1, replacing the prior $1.94B secondary floor.</td>
                </tr>
                <tr>
                  <td className="py-2 pr-4 text-muted-foreground">2026-08-16</td>
                  <td className="py-2 pr-4 font-mono text-foreground">(floor)</td>
                  <td className="py-2 text-muted-foreground">Remaining-assets floor $15,967,208,224 → $15,987,271,944: Hercules Chemical and United Gilsonite (UGL) added from verified research-corpus records (dataset now 55 records, 42 with located figures). Per-claimant statistics section added (RAND TR-872 p. xvii; Garlock; Ableman).</td>
                </tr>
                <tr>
                  <td className="py-2 pr-4 text-muted-foreground">2026-08-29</td>
                  <td className="py-2 pr-4 font-mono text-foreground">$16,018,528,449 / $30,033,989,206</td>
                  <td className="py-2 text-muted-foreground">Manville Q2 2026 filing (S.D.N.Y. Doc 4480) updated net claimants&apos; equity and the series&apos; liquidated-claims component; Owens-Illinois&apos; filed August 19 notice corrected its payment percentage from the erroneous structured 100% value to 65%.</td>
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
              { freq: "On detection", what: "Any court filing, trust notice, or other source update identified through the tracker’s research and verification process." },
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

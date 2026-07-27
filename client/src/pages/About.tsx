import { Link } from "wouter";

export default function About() {
  return (
    <div className="container py-12 max-w-3xl">
      <div className="mb-8">
        <div className="text-xs font-mono text-primary/70 uppercase tracking-widest mb-2">About This Project</div>
        <h1 className="font-display font-bold uppercase tracking-wider text-2xl mb-3">
          Why TrustFundClock.org Exists
        </h1>
      </div>

      <div className="space-y-8 text-sm leading-relaxed text-muted-foreground">
        <p>
          For more than a decade, the "$30 billion in asbestos trust funds" figure has been repeated across law firm websites, Wikipedia, news articles, and legal scholarship — almost always without a primary source citation, and almost always wrong. The figure traces to a 2011 GAO report on total trust capitalization since 1988, not a current balance. It has been cited, recited, and eventually detached from its origin entirely.
        </p>
        <p>
          TrustFundClock.org was built to replace that folklore with a primary-sourced, regularly updated, methodologically transparent public record. Every figure in our database is classified by source confidence — filed court document, secondary source citing primary, or estimate — and the methodology for our aggregate calculation is published in full.
        </p>
        <p>
          The site is designed to be citable. Our data is structured with Dataset schema markup, available as a downloadable CSV, and updated weekly from trust websites and court filings. We publish a quarterly "State of the Asbestos Trust System" report summarizing material changes across all active trusts.
        </p>

        <div className="p-5 rounded border border-primary/20 bg-primary/5">
          <div className="font-display font-bold uppercase tracking-wider text-sm text-foreground mb-3">
            Research Support
          </div>
          <p className="mb-3">
            This project is an independent public research publication. Research and development is supported by{" "}
            <a
              href="https://danzigerlaw.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Danziger &amp; De Llano
            </a>
            , a mesothelioma law firm based in Houston, Texas. Danziger &amp; De Llano does not control editorial decisions, data classifications, or methodology. The site does not constitute legal advice and does not solicit clients.
          </p>
          <p className="text-xs text-muted-foreground/60">
            Related resources: <a href="https://asbestosatlas.org" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">AsbestosAtlas.org</a> · <a href="https://wikimesothelioma.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">WikiMesothelioma.com</a>
          </p>
        </div>

        <div>
          <h2 className="font-display font-bold uppercase tracking-wider text-sm text-foreground mb-3">What We Track</h2>
          <ul className="space-y-2 list-disc list-inside">
            <li>Net asset balances for all active U.S. asbestos bankruptcy trusts</li>
            <li>Current payment percentages and full payment percentage history</li>
            <li>Reporting schedules and filing frequencies for each trust</li>
            <li>Administrator changes, trust amendments, and court activity</li>
            <li>Cumulative payout totals and claim counts since 1988</li>
          </ul>
        </div>

        <div>
          <h2 className="font-display font-bold uppercase tracking-wider text-sm text-foreground mb-3">What We Don't Do</h2>
          <ul className="space-y-2 list-disc list-inside">
            <li>We do not provide legal advice or help individuals file claims.</li>
            <li>We do not rank, recommend, or evaluate law firms.</li>
            <li>We do not publish advertising or sponsored content.</li>
            <li>We do not link to or name other law firms in our news feed or content.</li>
          </ul>
        </div>

        <div>
          <h2 className="font-display font-bold uppercase tracking-wider text-sm text-foreground mb-3">Schema &amp; Citation</h2>
          <p className="mb-2">
            This site is structured for citability by AI systems, academic researchers, and journalists. We publish full Dataset schema markup (Schema.org/Dataset) on our data pages, maintain a downloadable CSV of all trust data, and issue quarterly reports with DOI-style stable identifiers.
          </p>
          <p>
            If you cite this site, please reference: <span className="font-mono text-xs bg-card px-2 py-0.5 rounded border border-border">TrustFundClock.org, "U.S. Asbestos Trust Fund Tracker," [date accessed].</span>
          </p>
        </div>

        <div className="pt-4 border-t border-border/40 flex gap-6 text-xs">
          <Link href="/methodology" className="text-primary hover:underline no-underline">← Methodology</Link>
          <Link href="/trusts" className="text-primary hover:underline no-underline">Trust Database →</Link>
        </div>
      </div>
    </div>
  );
}

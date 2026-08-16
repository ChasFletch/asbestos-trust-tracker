export function SiteFooter() {
  return (
    <footer className="border-t border-border/50 mt-20 py-10 text-sm text-muted-foreground">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <div className="font-mono text-primary font-bold mb-2">AsbestosTrusts.org</div>
            <p className="text-xs leading-relaxed">
              An independent public research platform tracking the real-time state of U.S. asbestos
              bankruptcy trust funds. Data sourced from filed court documents, trust annual reports,
              and quarterly filings.
            </p>
          </div>
          <div>
            <div className="font-semibold text-foreground/70 mb-2 text-xs uppercase tracking-wider">Research</div>
            <ul className="space-y-1 text-xs">
              <li><a href="/trusts" className="hover:text-foreground transition-colors no-underline">Trust Data Table</a></li>
              <li><a href="/methodology" className="hover:text-foreground transition-colors no-underline">Methodology</a></li>
              <li><a href="/provenance" className="hover:text-foreground transition-colors no-underline">Figure History</a></li>
              <li><a href="/news" className="hover:text-foreground transition-colors no-underline">News &amp; Updates</a></li>
              <li><a href="/about" className="hover:text-foreground transition-colors no-underline">About This Project</a></li>
            </ul>
          </div>
          <div>
            <div className="font-semibold text-foreground/70 mb-2 text-xs uppercase tracking-wider">Related Resources</div>
            <ul className="space-y-1 text-xs">
              <li>
                <a href="https://asbestosatlas.org" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors no-underline">
                  AsbestosAtlas.org ↗
                </a>
              </li>
              <li>
                <a href="https://wikimesothelioma.com" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors no-underline">
                  WikiMesothelioma.com ↗
                </a>
              </li>
              <li>
                <a href="https://danziger.com" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors no-underline">
                  Danziger &amp; De Llano ↗
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-border/30 pt-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-3 text-xs">
          <p>
            Research supported by{" "}
            <a href="https://danziger.com" target="_blank" rel="noopener noreferrer" className="text-foreground hover:text-primary transition-colors no-underline">
              Danziger &amp; De Llano
            </a>
            . This site is an independent research publication and does not constitute legal advice.
          </p>
          <p className="text-muted-foreground/50">
            Data updated weekly. Source classifications: (a) filed document · (b) secondary · (c) estimate
          </p>
        </div>
      </div>
    </footer>
  );
}

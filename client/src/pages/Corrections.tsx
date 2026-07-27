import { useState } from "react";
import { Link } from "wouter";

export default function Corrections() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    trust: "",
    field: "",
    currentValue: "",
    correctValue: "",
    source: "",
    contact: "",
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // For now, open a pre-filled mailto — will be replaced with a tRPC endpoint
    const body = [
      `Trust: ${form.trust}`,
      `Field: ${form.field}`,
      `Current value on site: ${form.currentValue}`,
      `Correct value: ${form.correctValue}`,
      `Source/citation: ${form.source}`,
      `Contact: ${form.contact}`,
    ].join("\n");
    window.open(`mailto:corrections@asbestostrusts.org?subject=Data+Correction+—+${encodeURIComponent(form.trust)}&body=${encodeURIComponent(body)}`);
    setSubmitted(true);
  }

  return (
    <div className="container py-12 max-w-2xl">
      {/* Header */}
      <div className="mb-8">
        <div className="text-xs font-mono text-primary/70 uppercase tracking-widest mb-2">Data Integrity</div>
        <h1 className="font-display font-bold uppercase tracking-wider text-2xl mb-3">
          Correction Policy
        </h1>
        <p className="text-muted-foreground text-sm leading-relaxed">
          AsbestosTrusts.org is committed to publishing only verifiable, source-cited data. When errors are identified — whether by users, researchers, or our own reconciliation process — we correct them promptly and document the change.
        </p>
      </div>

      <div className="space-y-8 text-sm leading-relaxed">
        {/* Policy */}
        <section className="space-y-4">
          <h2 className="font-display font-bold uppercase tracking-wider text-base text-foreground">Our Correction Process</h2>
          <div className="space-y-3 text-muted-foreground">
            <p>
              <strong className="text-foreground">1. Submission.</strong> Anyone may submit a correction using the form below. We require a primary source citation — a filed court document, trust annual report, or official trust notice. Corrections without a verifiable source will not be applied.
            </p>
            <p>
              <strong className="text-foreground">2. Review.</strong> Submitted corrections are reviewed against the cited source within 7 days. If the source confirms the error, the database is updated immediately.
            </p>
            <p>
              <strong className="text-foreground">3. Documentation.</strong> Every correction is logged in the <code className="text-xs bg-muted px-1 py-0.5 rounded">changes</code> array of our{" "}
              <a href="/api/trust-figures" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">trust-figures.json</a>{" "}
              data file with the date, field changed, old value, new value, and source citation. This creates a permanent, machine-readable audit trail.
            </p>
            <p>
              <strong className="text-foreground">4. Transparency.</strong> Significant corrections (those affecting aggregate figures by more than 1%) are also noted in the{" "}
              <Link href="/news" className="text-primary hover:underline no-underline">News feed</Link>.
            </p>
          </div>
        </section>

        {/* What we correct */}
        <section>
          <h2 className="font-display font-bold uppercase tracking-wider text-base text-foreground mb-3">What We Correct</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              ["Payment percentages", "Current and historical % figures for any trust"],
              ["Net asset balances", "Filed or secondary-sourced balance figures"],
              ["Trust status", "Active, deferral, or closed status changes"],
              ["Source citations", "Incorrect or missing docket numbers or report dates"],
              ["Administrator info", "Trust administrator name or contact changes"],
              ["Aggregate figures", "Changes to the documented floor or range"],
            ].map(([title, desc]) => (
              <div key={title} className="p-3 rounded border border-border/40 bg-card/40">
                <div className="font-semibold text-foreground text-xs mb-1">{title}</div>
                <div className="text-xs text-muted-foreground">{desc}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Form */}
        <section>
          <h2 className="font-display font-bold uppercase tracking-wider text-base text-foreground mb-3">Submit a Correction</h2>
          {submitted ? (
            <div className="p-6 rounded border border-[oklch(0.72_0.18_150)]/30 bg-[oklch(0.72_0.18_150)]/5 text-center">
              <div className="font-semibold text-foreground mb-1">Thank you — your submission has been received.</div>
              <p className="text-sm text-muted-foreground">We will review your correction and respond within 7 days. If the source confirms the error, the database will be updated and the change logged.</p>
              <button
                onClick={() => setSubmitted(false)}
                className="mt-4 text-xs text-primary hover:underline"
              >
                Submit another correction
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-foreground/70 uppercase tracking-wider mb-1">Trust Name *</label>
                  <input
                    required name="trust" value={form.trust} onChange={handleChange}
                    placeholder="e.g. W.R. Grace Asbestos PI Trust"
                    className="w-full text-sm bg-secondary border border-border rounded px-3 py-2 text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-1 focus:ring-primary/40"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-foreground/70 uppercase tracking-wider mb-1">Field Being Corrected *</label>
                  <select
                    required name="field" value={form.field} onChange={handleChange}
                    className="w-full text-sm bg-secondary border border-border rounded px-3 py-2 text-foreground focus:outline-none focus:ring-1 focus:ring-primary/40"
                  >
                    <option value="">Select field…</option>
                    <option value="paymentPercentage">Payment percentage</option>
                    <option value="netAssets">Net asset balance</option>
                    <option value="status">Trust status</option>
                    <option value="sourceCitation">Source citation</option>
                    <option value="administrator">Administrator</option>
                    <option value="aggregate">Aggregate figure</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-foreground/70 uppercase tracking-wider mb-1">Current Value on Site</label>
                  <input
                    name="currentValue" value={form.currentValue} onChange={handleChange}
                    placeholder="What the site currently shows"
                    className="w-full text-sm bg-secondary border border-border rounded px-3 py-2 text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-1 focus:ring-primary/40"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-foreground/70 uppercase tracking-wider mb-1">Correct Value *</label>
                  <input
                    required name="correctValue" value={form.correctValue} onChange={handleChange}
                    placeholder="What it should be"
                    className="w-full text-sm bg-secondary border border-border rounded px-3 py-2 text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-1 focus:ring-primary/40"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-foreground/70 uppercase tracking-wider mb-1">Source / Citation *</label>
                <textarea
                  required name="source" value={form.source} onChange={handleChange}
                  placeholder="Filed document, trust website URL, docket number, or report citation. Corrections without a verifiable source cannot be applied."
                  rows={3}
                  className="w-full text-sm bg-secondary border border-border rounded px-3 py-2 text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-1 focus:ring-primary/40 resize-none"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-foreground/70 uppercase tracking-wider mb-1">Your Name / Organization (optional)</label>
                <input
                  name="contact" value={form.contact} onChange={handleChange}
                  placeholder="For follow-up if needed"
                  className="w-full text-sm bg-secondary border border-border rounded px-3 py-2 text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-1 focus:ring-primary/40"
                />
              </div>
              <button
                type="submit"
                className="px-5 py-2.5 rounded bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity active:scale-[0.97]"
              >
                Submit Correction
              </button>
            </form>
          )}
        </section>

        {/* Recent corrections */}
        <section className="border-t border-border/30 pt-6">
          <h2 className="font-display font-bold uppercase tracking-wider text-base text-foreground mb-3">Recent Corrections</h2>
          <div className="space-y-3 text-xs text-muted-foreground">
            {[
              { date: "2026-07-27", trust: "Kaiser Aluminum & Chemical Asbestos PI Trust", change: "Payment percentage corrected from 100% to 10.6% (cut Feb 2025 from 18.1%). Net assets corrected from $200M to $308.8M (2022 annual report).", source: "Kaiser Asbestos PI Trust 2022 Annual Report" },
              { date: "2026-07-27", trust: "Quigley Company Asbestos PI Trust", change: "Net assets corrected from $100M to $597.8M (2022 annual report). Payment percentage removed (not publicly documented).", source: "Quigley Company Asbestos PI Trust 2022 Annual Report" },
              { date: "2026-07-27", trust: "ASARCO LLC Asbestos Claims Settlement Trust", change: "Net assets corrected from $280M to $735.9M (2022 annual report). Previous $280M figure was incorrectly transplanted from NARCO pre-buyout data.", source: "ASARCO Asbestos PI Settlement Trust 2022 Annual Report" },
              { date: "2026-07-27", trust: "Garlock Sealing Technologies Asbestos PI Trust", change: "Payment percentage removed. Garlock uses a Matrix Settlement Value (MSV) structure — individual payment percentages are not published.", source: "Garlock Sealing Technologies Settlement Trust Distribution Procedures" },
            ].map((c, i) => (
              <div key={i} className="p-3 rounded border border-border/30 bg-card/30">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono text-muted-foreground/50">{c.date}</span>
                  <span className="font-semibold text-foreground/80">{c.trust}</span>
                </div>
                <p className="mb-1">{c.change}</p>
                <p className="text-muted-foreground/50 italic">Source: {c.source}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

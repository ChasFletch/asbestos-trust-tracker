import { useState } from "react";
import { Code2, Check, Copy, Globe, Scale, Heart, Newspaper, Share2, Tag } from "lucide-react";
import { EmbedCodeModal } from "@/components/EmbedCodeModal";

const SHARE_URL = "https://asbestostrusts.org/embed";
const SHARE_TITLE = "Free Embeddable Asbestos Trust Fund Clock — live data from filed court documents";
const SHARE_TEXT = "Add a live U.S. Asbestos Trust Fund Clock to your website — free, one line of code, data sourced from filed court documents. No API key needed.";

const EMBED_BASE = "https://asbestostrusts.org/embed/clock";

function getEmbedCode(variant: string, ref?: string) {
  const params: string[] = [];
  if (variant !== "full") params.push(`variant=${variant}`);
  if (ref) params.push(`ref=${encodeURIComponent(ref)}`);
  const query = params.length > 0 ? `?${params.join("&")}` : "";
  const src = `${EMBED_BASE}${query}`;
  const maxW = variant === "compact" ? "520px" : "960px";
  const height = variant === "compact" ? "680" : "620";
  return `<iframe src="${src}" width="100%" height="${height}" frameborder="0" style="border:none;border-radius:8px;max-width:${maxW};" title="U.S. Asbestos Trust Fund Clock — AsbestosTrusts.org" loading="lazy"></iframe>`;
}

function CopyButton({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = code;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button
      onClick={handleCopy}
      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity"
    >
      {copied ? <><Check size={14} /> Copied!</> : <><Copy size={14} /> Copy Embed Code</>}
    </button>
  );
}

// Mockup frames showing the widget in context
function MockupFrame({ title, icon: Icon, type, children }: {
  title: string;
  icon: React.ElementType;
  type: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
      <div className="flex items-center gap-2 px-4 py-2.5 bg-muted/50 border-b border-border">
        <Icon size={14} className="text-muted-foreground" />
        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{type}</span>
        <span className="text-xs text-muted-foreground/60 ml-auto">{title}</span>
      </div>
      <div className="p-4">
        {children}
      </div>
    </div>
  );
}

export default function EmbedLanding() {
  const [showModal, setShowModal] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState<"full" | "compact">("full");
  const [refTag, setRefTag] = useState("");

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="py-16 md:py-24" style={{ background: "oklch(0.975 0.006 80)" }}>
        <div className="container max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold uppercase tracking-wider mb-6">
            <Code2 size={12} /> Free Embeddable Widget
          </div>
          <h1 className="font-display text-3xl md:text-5xl font-bold text-foreground leading-tight mb-4">
            Add the Asbestos Trust Fund Clock to Your Website
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed mb-8">
            A live, animated display of U.S. asbestos bankruptcy trust fund data — sourced from filed court documents and updated weekly. Free to embed, no API key required.
          </p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <button
              onClick={() => setShowModal(true)}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity"
            >
              <Code2 size={16} /> Get Embed Code
            </button>
            <a href="#examples" className="inline-flex items-center gap-1 px-5 py-3 rounded-lg border border-border text-foreground font-medium hover:bg-muted/50 transition-colors">
              See Examples ↓
            </a>
          </div>
        </div>
      </section>

      {/* Live Preview */}
      <section className="py-12 bg-background">
        <div className="container max-w-5xl">
          <h2 className="font-display text-xl font-bold text-foreground text-center mb-2">Live Preview</h2>
          <p className="text-sm text-muted-foreground text-center mb-8">This is exactly what appears on your website — live data, real-time animation.</p>
          <div className="rounded-xl border border-border overflow-hidden shadow-lg">
            <iframe
              src="/embed/clock"
              width="100%"
              height="620"
              style={{ border: "none" }}
              title="Live preview of the Asbestos Trust Fund Clock widget"
            />
          </div>
        </div>
      </section>

      {/* Examples */}
      <section id="examples" className="py-16 bg-muted/30">
        <div className="container max-w-5xl">
          <h2 className="font-display text-2xl font-bold text-foreground text-center mb-3">
            How It Looks on Different Websites
          </h2>
          <p className="text-sm text-muted-foreground text-center mb-10 max-w-xl mx-auto">
            The widget adapts to any layout. Here's how it appears in common use cases.
          </p>

          <div className="space-y-8">
            {/* Law Firm Website */}
            <MockupFrame title="mesothelioma-attorneys.example.com" icon={Scale} type="Law Firm Website">
              <div className="grid md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <div className="bg-muted/30 rounded-lg p-4 mb-3">
                    <div className="h-3 w-3/4 bg-muted rounded mb-2" />
                    <div className="h-2 w-full bg-muted/60 rounded mb-1.5" />
                    <div className="h-2 w-5/6 bg-muted/60 rounded mb-1.5" />
                    <div className="h-2 w-2/3 bg-muted/60 rounded" />
                  </div>
                  <div className="rounded-lg border border-border overflow-hidden">
                    <iframe
                      src="/embed/clock"
                      width="100%"
                      height="380"
                      style={{ border: "none", transform: "scale(0.6)", transformOrigin: "top left", width: "167%", height: "167%" }}
                      title="Law firm example"
                    />
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="bg-muted/30 rounded-lg p-3">
                    <div className="h-2.5 w-1/2 bg-muted rounded mb-2" />
                    <div className="h-2 w-full bg-muted/50 rounded mb-1" />
                    <div className="h-2 w-4/5 bg-muted/50 rounded" />
                  </div>
                  <div className="bg-muted/30 rounded-lg p-3">
                    <div className="h-2.5 w-2/3 bg-muted rounded mb-2" />
                    <div className="h-2 w-full bg-muted/50 rounded mb-1" />
                    <div className="h-2 w-3/4 bg-muted/50 rounded" />
                  </div>
                  <div className="bg-muted/30 rounded-lg p-3">
                    <div className="h-2.5 w-1/2 bg-muted rounded mb-2" />
                    <div className="h-8 w-full bg-primary/20 rounded" />
                  </div>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-3 italic">
                Full-width variant embedded in a practice area page — gives visitors immediate context on trust fund scale.
              </p>
            </MockupFrame>

            {/* News / Blog */}
            <MockupFrame title="asbestos-news-daily.example.com" icon={Newspaper} type="News / Blog">
              <div className="max-w-2xl mx-auto">
                <div className="bg-muted/30 rounded-lg p-4 mb-4">
                  <div className="h-4 w-2/3 bg-muted rounded mb-3" />
                  <div className="h-2 w-full bg-muted/50 rounded mb-1.5" />
                  <div className="h-2 w-full bg-muted/50 rounded mb-1.5" />
                  <div className="h-2 w-4/5 bg-muted/50 rounded mb-4" />
                  <div className="h-2 w-full bg-muted/50 rounded mb-1.5" />
                  <div className="h-2 w-5/6 bg-muted/50 rounded" />
                </div>
                <div className="rounded-lg border border-border overflow-hidden">
                  <iframe
                    src="/embed/clock"
                    width="100%"
                    height="340"
                    style={{ border: "none", transform: "scale(0.55)", transformOrigin: "top left", width: "182%", height: "182%" }}
                    title="Blog example"
                  />
                </div>
                <div className="bg-muted/30 rounded-lg p-4 mt-4">
                  <div className="h-2 w-full bg-muted/50 rounded mb-1.5" />
                  <div className="h-2 w-full bg-muted/50 rounded mb-1.5" />
                  <div className="h-2 w-3/4 bg-muted/50 rounded" />
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-3 italic">
                Embedded mid-article in a news post about asbestos litigation — provides real-time data context for readers.
              </p>
            </MockupFrame>

            {/* Health / Advocacy */}
            <MockupFrame title="mesothelioma-support.example.org" icon={Heart} type="Health / Advocacy Site">
              <div className="grid md:grid-cols-5 gap-4">
                <div className="md:col-span-3 space-y-3">
                  <div className="bg-muted/30 rounded-lg p-4">
                    <div className="h-3 w-1/2 bg-muted rounded mb-2" />
                    <div className="h-2 w-full bg-muted/50 rounded mb-1.5" />
                    <div className="h-2 w-full bg-muted/50 rounded mb-1.5" />
                    <div className="h-2 w-4/5 bg-muted/50 rounded" />
                  </div>
                  <div className="bg-muted/30 rounded-lg p-4">
                    <div className="h-3 w-2/3 bg-muted rounded mb-2" />
                    <div className="h-2 w-full bg-muted/50 rounded mb-1.5" />
                    <div className="h-2 w-5/6 bg-muted/50 rounded" />
                  </div>
                </div>
                <div className="md:col-span-2">
                  <div className="rounded-lg border border-border overflow-hidden">
                    <iframe
                      src="/embed/clock?variant=compact"
                      width="100%"
                      height="400"
                      style={{ border: "none", transform: "scale(0.52)", transformOrigin: "top left", width: "192%", height: "192%" }}
                      title="Sidebar example"
                    />
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-2 text-center italic">Compact variant in sidebar</p>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-3 italic">
                Compact variant in a sidebar — perfect for advocacy sites that want to show trust fund data without dominating the page.
              </p>
            </MockupFrame>

            {/* General / Resource */}
            <MockupFrame title="workers-comp-resources.example.com" icon={Globe} type="Resource Directory">
              <div className="rounded-lg border border-border overflow-hidden">
                <iframe
                  src="/embed/clock"
                  width="100%"
                  height="320"
                  style={{ border: "none", transform: "scale(0.52)", transformOrigin: "top left", width: "192%", height: "192%" }}
                  title="Resource site example"
                />
              </div>
              <p className="text-xs text-muted-foreground mt-3 italic">
                Full-width as a standalone section — ideal for resource directories and informational pages about asbestos compensation.
              </p>
            </MockupFrame>
          </div>
        </div>
      </section>

      {/* Embed Code Section */}
      <section className="py-16 bg-background">
        <div className="container max-w-3xl">
          <h2 className="font-display text-2xl font-bold text-foreground text-center mb-3">
            Get the Embed Code
          </h2>
          <p className="text-sm text-muted-foreground text-center mb-8">
            Choose your preferred size and copy the code. No signup or API key required.
          </p>

          {/* Variant tabs */}
          <div className="flex justify-center gap-3 mb-6">
            <button
              onClick={() => setSelectedVariant("full")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                selectedVariant === "full"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              Full Width
            </button>
            <button
              onClick={() => setSelectedVariant("compact")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                selectedVariant === "compact"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              Compact
            </button>
          </div>

          {/* Tracking tag */}
          <div className="mb-6 max-w-sm mx-auto">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5 flex items-center justify-center gap-1">
              <Tag size={10} /> Your domain <span className="font-normal text-muted-foreground/60">(optional tracking)</span>
            </label>
            <input
              type="text"
              value={refTag}
              onChange={e => setRefTag(e.target.value.replace(/[^a-zA-Z0-9._-]/g, ""))}
              placeholder="e.g. your-domain.com"
              className="w-full px-3 py-2 rounded-md border border-border bg-background text-sm text-foreground text-center placeholder:text-muted-foreground/40 focus:outline-none focus:ring-1 focus:ring-primary/30"
            />
          </div>

          {/* Code block */}
          <div className="bg-muted/50 border border-border rounded-xl p-5">
            <pre className="text-xs font-mono text-foreground/80 whitespace-pre-wrap break-all leading-relaxed mb-4">
              {getEmbedCode(selectedVariant, refTag.trim() || undefined)}
            </pre>
            <div className="flex items-center justify-between">
              <CopyButton code={getEmbedCode(selectedVariant, refTag.trim() || undefined)} />
              <span className="text-xs text-muted-foreground/60">
                {selectedVariant === "full" ? "Max width: 960px · Height: 620px" : "Max width: 520px · Height: 680px"}
              </span>
            </div>
          </div>

          {/* Features list */}
          <div className="grid sm:grid-cols-3 gap-4 mt-10">
            <div className="text-center p-4">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                <Globe size={18} className="text-primary" />
              </div>
              <h3 className="text-sm font-semibold text-foreground mb-1">Live Data</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Pulls real-time figures from AsbestosTrusts.org. Updated weekly from filed court documents.
              </p>
            </div>
            <div className="text-center p-4">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                <Code2 size={18} className="text-primary" />
              </div>
              <h3 className="text-sm font-semibold text-foreground mb-1">One Line of Code</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Just paste the iframe snippet. No JavaScript, no API keys, no dependencies.
              </p>
            </div>
            <div className="text-center p-4">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                <Scale size={18} className="text-primary" />
              </div>
              <h3 className="text-sm font-semibold text-foreground mb-1">Credible Source</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Every figure traces to a filed document. Research by Danziger & De Llano, LLP.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-12 bg-muted/30 border-t border-border">
        <div className="container max-w-2xl">
          <h2 className="font-display text-xl font-bold text-foreground text-center mb-8">
            Frequently Asked Questions
          </h2>
          <div className="space-y-5">
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-1">Is it really free?</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Yes. The widget is completely free to use on any website. We only ask that you keep the "Powered by AsbestosTrusts.org" attribution visible.
              </p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-1">How often does the data update?</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                The underlying data is refreshed weekly from filed court documents, trust annual reports, and payment percentage notices. The widget always shows the latest available figures.
              </p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-1">Will it slow down my website?</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                No. The iframe loads asynchronously with <code>loading="lazy"</code>, so it only loads when the user scrolls to it. It has no impact on your page's initial load time.
              </p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-1">Can I customize the appearance?</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                We offer two variants: Full Width (both counters, range strip, and tooltips) and Compact (narrower, ideal for sidebars). The widget's visual style is fixed to maintain data integrity and brand consistency.
              </p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-1">Can I track which sites embed it?</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Yes. Add a <code>?ref=yoursite</code> parameter to the embed URL for referral tracking. Example: <code>src="https://asbestostrusts.org/embed/clock?ref=mysite"</code>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 bg-background border-t border-border">
        <div className="container max-w-2xl text-center">
          <h2 className="font-display text-xl font-bold text-foreground mb-3">
            Ready to add the clock to your site?
          </h2>
          <p className="text-sm text-muted-foreground mb-6">
            One line of code. Live data. Instant credibility.
          </p>
          <button
            onClick={() => setShowModal(true)}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity"
          >
            <Code2 size={16} /> Get Embed Code
          </button>

          {/* Social sharing */}
          <div className="mt-10 pt-8 border-t border-border/50">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Share2 size={14} className="text-muted-foreground" />
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Share this widget
              </span>
            </div>
            <div className="flex items-center justify-center gap-3">
              <a
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(SHARE_URL)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-border bg-background hover:bg-muted/50 transition-colors text-sm font-medium text-foreground"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-[#0A66C2]">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
                Share on LinkedIn
              </a>
              <a
                href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(SHARE_URL)}&text=${encodeURIComponent(SHARE_TEXT)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-border bg-background hover:bg-muted/50 transition-colors text-sm font-medium text-foreground"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
                Share on X
              </a>
            </div>
          </div>
        </div>
      </section>

      <EmbedCodeModal open={showModal} onOpenChange={setShowModal} />
    </div>
  );
}

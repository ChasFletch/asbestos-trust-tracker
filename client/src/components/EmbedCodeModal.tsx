import { useState } from "react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import { Check, Copy, Code2 } from "lucide-react";

const EMBED_BASE = "https://asbestostrusts.org/embed/clock";

const VARIANTS = [
  {
    id: "full",
    label: "Full Width",
    description: "Both counters, range strip, and methodology tooltips",
    width: "100%",
    height: "620",
  },
  {
    id: "compact",
    label: "Compact",
    description: "Narrower layout, ideal for sidebars and smaller spaces",
    width: "100%",
    height: "680",
  },
] as const;

function getEmbedCode(variant: string, height: string) {
  const src = variant === "full" ? EMBED_BASE : `${EMBED_BASE}?variant=${variant}`;
  return `<iframe src="${src}" width="100%" height="${height}" frameborder="0" style="border:none;border-radius:8px;max-width:${variant === "compact" ? "520px" : "960px"};" title="U.S. Asbestos Trust Fund Clock — AsbestosTrusts.org" loading="lazy"></iframe>`;
}

export function EmbedCodeModal({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const [selectedVariant, setSelectedVariant] = useState<"full" | "compact">("full");
  const [copied, setCopied] = useState(false);

  const variant = VARIANTS.find(v => v.id === selectedVariant)!;
  const code = getEmbedCode(variant.id, variant.height);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const textarea = document.createElement("textarea");
      textarea.value = code;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Code2 size={18} className="text-primary" />
            Embed the Asbestos Trust Fund Clock
          </DialogTitle>
          <DialogDescription>
            Add the live trust fund clock to your website. Data updates automatically from AsbestosTrusts.org.
          </DialogDescription>
        </DialogHeader>

        {/* Variant selector */}
        <div className="mt-4">
          <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 block">
            Choose a size
          </label>
          <div className="grid grid-cols-2 gap-3">
            {VARIANTS.map(v => (
              <button
                key={v.id}
                onClick={() => setSelectedVariant(v.id as "full" | "compact")}
                className={`p-3 rounded-lg border text-left transition-all ${
                  selectedVariant === v.id
                    ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                    : "border-border hover:border-primary/40"
                }`}
              >
                <div className="text-sm font-semibold text-foreground">{v.label}</div>
                <div className="text-xs text-muted-foreground mt-0.5">{v.description}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Live preview */}
        <div className="mt-4">
          <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 block">
            Preview
          </label>
          <div className="rounded-lg border border-border overflow-hidden bg-muted/30" style={{ height: "200px" }}>
            <iframe
              src={`/embed/clock${selectedVariant === "compact" ? "?variant=compact" : ""}`}
              width="100%"
              height="100%"
              style={{ border: "none", transform: "scale(0.35)", transformOrigin: "top left", width: "286%", height: "286%" }}
              title="Preview"
            />
          </div>
        </div>

        {/* Code box */}
        <div className="mt-4">
          <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 block">
            Embed code
          </label>
          <div className="relative">
            <pre className="bg-muted/50 border border-border rounded-lg p-3 pr-12 text-xs font-mono text-foreground/80 whitespace-pre-wrap break-all leading-relaxed overflow-x-auto">
              {code}
            </pre>
            <button
              onClick={handleCopy}
              className="absolute top-2 right-2 p-2 rounded-md bg-background border border-border hover:bg-muted transition-colors"
              title="Copy to clipboard"
            >
              {copied ? (
                <Check size={14} className="text-emerald-600" />
              ) : (
                <Copy size={14} className="text-muted-foreground" />
              )}
            </button>
          </div>
          {copied && (
            <p className="text-xs text-emerald-600 mt-1.5 font-medium">Copied to clipboard!</p>
          )}
        </div>

        {/* Instructions */}
        <div className="mt-4 p-3 bg-muted/30 rounded-lg border border-border/50">
          <h4 className="text-xs font-semibold text-foreground mb-1.5">How to use</h4>
          <ol className="text-xs text-muted-foreground space-y-1 list-decimal list-inside leading-relaxed">
            <li>Copy the embed code above</li>
            <li>Paste it into your website's HTML where you want the clock to appear</li>
            <li>The clock pulls live data automatically — no API key needed</li>
          </ol>
        </div>

        {/* Attribution note */}
        <p className="text-[11px] text-muted-foreground/60 mt-3 leading-relaxed">
          The widget includes a "Powered by AsbestosTrusts.org" attribution link. By embedding this widget you agree to keep the attribution visible. Data sourced from filed court documents and updated weekly.
        </p>
      </DialogContent>
    </Dialog>
  );
}

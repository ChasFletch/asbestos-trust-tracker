import { useState, useEffect } from "react";
import { X, ExternalLink, FileText, AlertCircle } from "lucide-react";

interface SourceDocModalProps {
  url: string;
  title: string;
  citation?: string | null;
  onClose: () => void;
}

function isPdfUrl(url: string) {
  return url.includes("/manus-storage/") || url.toLowerCase().endsWith(".pdf");
}

export function SourceDocModal({ url, title, citation, onClose }: SourceDocModalProps) {
  const [iframeBlocked, setIframeBlocked] = useState(false);
  const embeddable = isPdfUrl(url);

  // Close on Escape key
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  // Prevent body scroll while modal is open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div
        className="relative z-10 flex flex-col w-full max-w-5xl rounded-lg border border-border/60 bg-card shadow-2xl"
        style={{ height: "min(85vh, 900px)" }}
      >
        {/* Header */}
        <div className="flex items-start gap-3 px-4 py-3 border-b border-border/50 shrink-0">
          <FileText size={16} className="text-muted-foreground mt-0.5 shrink-0" />
          <div className="flex-1 min-w-0">
            <div className="text-sm font-semibold text-foreground truncate">{title}</div>
            {citation && (
              <div className="text-xs text-muted-foreground mt-0.5 line-clamp-2 leading-relaxed">
                {citation}
              </div>
            )}
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors px-2 py-1 rounded border border-border/50 hover:bg-secondary"
            >
              Open in new tab <ExternalLink size={11} />
            </a>
            <button
              onClick={onClose}
              className="p-1.5 rounded hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Close"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-h-0">
          {embeddable && !iframeBlocked ? (
            <iframe
              src={url}
              className="w-full h-full rounded-b-lg"
              title={title}
              onError={() => setIframeBlocked(true)}
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-center px-8">
              <AlertCircle size={36} className="text-muted-foreground/40" />
              <div>
                <div className="text-sm font-medium text-foreground mb-1">
                  {embeddable ? "Unable to embed document" : "External document"}
                </div>
                <div className="text-xs text-muted-foreground max-w-sm leading-relaxed">
                  {embeddable
                    ? "The document could not be displayed inline. Use the button above to open it directly."
                    : "This source is hosted on an external site that cannot be embedded. Use the button above to open it in a new tab."}
                </div>
              </div>
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm px-4 py-2 rounded bg-primary text-primary-foreground hover:opacity-90 transition-opacity font-medium"
              >
                Open source document <ExternalLink size={14} />
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

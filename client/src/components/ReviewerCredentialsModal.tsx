import { useState } from "react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription,
} from "@/components/ui/dialog";
import { ShieldCheck, ExternalLink } from "lucide-react";
import { DESIGNATED_LEGAL_REVIEWERS } from "@/data/researchDeskPeople";

interface ReviewerCredentialsModalProps {
  /** Render the trigger inline (the clickable badge) */
  variant?: "trust" | "report";
}

export function ReviewerCredentialsModal({ variant = "trust" }: ReviewerCredentialsModalProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          type="button"
          className={`mt-3 flex items-center gap-2 text-xs cursor-pointer hover:opacity-80 transition-opacity ${
            variant === "report"
              ? "text-emerald-700 dark:text-emerald-400"
              : "text-muted-foreground"
          }`}
          aria-label="View legal review team credentials"
        >
          <ShieldCheck size={14} className={variant === "trust" ? "text-emerald-600 shrink-0" : "shrink-0"} />
          <span className={variant === "trust" ? "" : ""}>
            Legal review team: {" "}
            <span className="font-medium text-foreground">Paul Danziger</span>
            {" "}and{" "}
            <span className="font-medium text-foreground">Rod De Llano</span>
            {" "}&middot; Danziger &amp; De Llano, LLP
          </span>
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg">
            <ShieldCheck size={20} className="text-emerald-600" />
            Legal Review Team
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Paul Danziger and Rod de Llano are the designated legal reviewers for Research Desk content that requires legal-context review. A team designation does not mean each person reviewed every page.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {DESIGNATED_LEGAL_REVIEWERS.map((reviewer) => (
            <div key={reviewer.id} className="border border-border/50 rounded-lg p-4">
              <div className="flex items-start justify-between gap-4 mb-3">
                <div>
                  <h3 className="font-semibold text-base text-foreground">{reviewer.name}</h3>
                  <p className="text-xs text-muted-foreground">{reviewer.role} · {reviewer.organization}</p>
                </div>
                {reviewer.profileUrl ? (
                  <a href={reviewer.profileUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline flex items-center gap-1 whitespace-nowrap">
                    Profile <ExternalLink size={10} />
                  </a>
                ) : null}
              </div>
              <p className="text-sm text-foreground/80 mb-3">{reviewer.bio}</p>
              <div className="flex flex-wrap gap-1.5">
                {reviewer.credentials.map((credential) => (
                  <span key={credential} className="text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground">{credential}</span>
                ))}
              </div>
              <p className="mt-3 text-xs leading-5 text-muted-foreground">
                Designated to provide legal-research review when an article requires legal-context review. This designation does not state that the attorney reviewed this specific page.
              </p>
              {reviewer.wikidataUrl ? (
                <a href={reviewer.wikidataUrl} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex items-center gap-1 text-[11px] text-primary hover:underline">
                  Wikidata identity <ExternalLink size={10} />
                </a>
              ) : null}
            </div>
          ))}

          {/* Firm info */}
          <div className="text-center pt-2 border-t border-border/30">
            <a
              href="https://dandell.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-primary hover:underline"
            >
              Danziger &amp; De Llano, LLP
            </a>
            <p className="text-xs text-muted-foreground mt-1">
              Houston, Texas · Research Desk legal-review team
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

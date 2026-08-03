import { useState } from "react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription,
} from "@/components/ui/dialog";
import { ShieldCheck, ExternalLink, GraduationCap, Scale, Award } from "lucide-react";

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
          aria-label="View reviewer credentials"
        >
          <ShieldCheck size={14} className={variant === "trust" ? "text-emerald-600 shrink-0" : "shrink-0"} />
          <span className={variant === "trust" ? "" : ""}>
            Reviewed by{" "}
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
            Reviewer Credentials
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            All content on this site is reviewed by the founding partners of Danziger &amp; De Llano, LLP.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Paul Danziger */}
          <div className="border border-border/50 rounded-lg p-4">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-semibold text-base text-foreground">Paul Danziger</h3>
                <p className="text-xs text-muted-foreground">Founding Partner</p>
              </div>
              <a
                href="https://dandell.com/lawyers/paul-danziger/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-primary hover:underline flex items-center gap-1"
              >
                Profile <ExternalLink size={10} />
              </a>
            </div>
            <p className="text-sm text-foreground/80 mb-3">
              Over 30 years of experience in mesothelioma and asbestos litigation.
              Has recovered over $2 billion for asbestos exposure victims.
            </p>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <GraduationCap size={12} className="text-primary/60" />
                <span>Texas Tech University</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Scale size={12} className="text-primary/60" />
                <span>Texas State Bar — Licensed Attorney</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Award size={12} className="text-primary/60" />
                <span>Specializations: Mesothelioma litigation, asbestos trust fund claims, bankruptcy proceedings, veterans exposure</span>
              </div>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              <a href="https://www.linkedin.com/in/paul-danziger" target="_blank" rel="noopener noreferrer"
                className="text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground hover:text-foreground transition-colors">
                LinkedIn
              </a>
              <a href="https://www.avvo.com/attorneys/77002-tx-paul-danziger-49019.html" target="_blank" rel="noopener noreferrer"
                className="text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground hover:text-foreground transition-colors">
                Avvo
              </a>
              <a href="https://mesotheliomaattorney.com/our-attorneys/paul-danziger/" target="_blank" rel="noopener noreferrer"
                className="text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground hover:text-foreground transition-colors">
                MesotheliomaAttorney.com
              </a>
            </div>
          </div>

          {/* Rod De Llano */}
          <div className="border border-border/50 rounded-lg p-4">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-semibold text-base text-foreground">Rod De Llano</h3>
                <p className="text-xs text-muted-foreground">Founding Partner</p>
              </div>
              <a
                href="https://dandell.com/lawyers/rod-de-llano/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-primary hover:underline flex items-center gap-1"
              >
                Profile <ExternalLink size={10} />
              </a>
            </div>
            <p className="text-sm text-foreground/80 mb-3">
              Princeton University graduate with over 25 years of experience representing
              mesothelioma and asbestos exposure victims nationwide.
            </p>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <GraduationCap size={12} className="text-primary/60" />
                <span>Princeton University</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <GraduationCap size={12} className="text-primary/60" />
                <span>University of Texas School of Law</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Scale size={12} className="text-primary/60" />
                <span>Texas State Bar — Licensed Attorney</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Award size={12} className="text-primary/60" />
                <span>Specializations: Mesothelioma litigation, asbestos trust fund claims, toxic tort litigation</span>
              </div>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              <a href="https://mesotheliomaattorney.com/attorneys/rod-de-llano/" target="_blank" rel="noopener noreferrer"
                className="text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground hover:text-foreground transition-colors">
                MesotheliomaAttorney.com
              </a>
            </div>
          </div>

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
              Houston, Texas · Representing asbestos exposure victims nationwide since 1999
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

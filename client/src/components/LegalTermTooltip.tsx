import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

// Legal glossary — terms commonly found in asbestos trust news
const LEGAL_GLOSSARY: Record<string, string> = {
  "524(g)": "Section 524(g) of the Bankruptcy Code allows asbestos debtors to create a trust that channels all current and future asbestos claims, issuing a channeling injunction that protects the reorganized company from further lawsuits.",
  "524(g) trust": "A trust established under Section 524(g) of the Bankruptcy Code to manage and pay asbestos personal injury claims after a company's bankruptcy reorganization.",
  "524(g) filing": "A Chapter 11 bankruptcy filing that invokes Section 524(g) of the Bankruptcy Code to establish a trust for resolving asbestos (or similar mass tort) claims through a channeling injunction.",
  "chapter 11": "A form of bankruptcy that allows a company to reorganize its debts while continuing operations. Asbestos companies use Chapter 11 to establish trusts that pay victims over time.",
  "channeling injunction": "A court order that directs all current and future asbestos claims to a trust, preventing claimants from suing the reorganized company directly.",
  "tdp": "Trust Distribution Procedures — the legal document governing how an asbestos trust evaluates, processes, and pays claims. It sets scheduled values, disease categories, and payment percentages.",
  "payment percentage": "The fraction of a claim's scheduled value that a trust actually pays. Trusts adjust this percentage periodically based on remaining assets and projected future claims.",
  "scheduled value": "The base dollar amount assigned to a claim by the trust's TDP, based on disease category. The actual payout is this value multiplied by the current payment percentage.",
  "expedited review": "A streamlined claims process where claimants accept a fixed scheduled value in exchange for faster processing. No individual negotiation of claim value.",
  "individual review": "A claims process where the trust evaluates each claim individually, potentially resulting in higher payouts than expedited review but taking longer.",
  "texas two-step": "A pre-bankruptcy corporate restructuring under Texas law that allows a company to divide into two entities — one holding mass tort liabilities that then files for Chapter 11, shielding the profitable parent from lawsuits.",
  "prepackaged plan": "A bankruptcy reorganization plan negotiated and voted on by creditors before the Chapter 11 filing, allowing for faster court approval and emergence from bankruptcy.",
  "future claimants' representative": "A court-appointed person who represents the interests of people who have not yet filed claims (or been diagnosed) but may do so in the future against an asbestos trust.",
  "tac": "Trust Advisory Committee — a group of claimant representatives who advise the trustee on trust operations, payment percentages, and policy decisions.",
  "fcr": "Future Claimants' Representative — the court-appointed advocate for people who may file claims against the trust in the future.",
  "recap": "RECAP (Re-open Access to Court Electronic Records) — a free public archive of federal court documents, maintained by the Free Law Project as an alternative to PACER.",
  "pacer": "Public Access to Court Electronic Records — the U.S. federal judiciary's online system for accessing court documents. Charges $0.10 per page.",
  "deferral period": "A period during which a trust temporarily suspends or reduces claim payments, typically due to uncertainty about future liabilities or pending litigation.",
  "net assets": "The total value of a trust's remaining assets (investments, cash, receivables) minus liabilities. Indicates how much money is available to pay future claims.",
  "cumulative paid": "The total dollar amount a trust has paid to claimants since its inception.",
};

// Build a regex that matches any glossary term (case-insensitive, longest match first)
const sortedTerms = Object.keys(LEGAL_GLOSSARY).sort((a, b) => b.length - a.length);
const termRegex = new RegExp(`\\b(${sortedTerms.map(t => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})\\b`, "gi");

/**
 * Renders text with legal terms automatically highlighted with hover tooltips.
 * Non-matching text is rendered as-is.
 */
export function LegalTermText({ text }: { text: string }) {
  if (!text) return null;

  const parts: Array<{ type: "text" | "term"; content: string; definition?: string }> = [];
  let lastIndex = 0;

  // Reset regex state
  termRegex.lastIndex = 0;

  let match: RegExpExecArray | null;
  while ((match = termRegex.exec(text)) !== null) {
    // Add text before the match
    if (match.index > lastIndex) {
      parts.push({ type: "text", content: text.slice(lastIndex, match.index) });
    }
    // Find the definition (case-insensitive lookup)
    const matchedTerm = match[0];
    const key = Object.keys(LEGAL_GLOSSARY).find(k => k.toLowerCase() === matchedTerm.toLowerCase());
    parts.push({
      type: "term",
      content: matchedTerm,
      definition: key ? LEGAL_GLOSSARY[key] : undefined,
    });
    lastIndex = match.index + match[0].length;
  }

  // Add remaining text
  if (lastIndex < text.length) {
    parts.push({ type: "text", content: text.slice(lastIndex) });
  }

  // If no terms found, just return the text
  if (parts.length === 0 || (parts.length === 1 && parts[0].type === "text")) {
    return <>{text}</>;
  }

  return (
    <TooltipProvider delayDuration={300}>
      {parts.map((part, i) => {
        if (part.type === "text") return <span key={i}>{part.content}</span>;
        return (
          <Tooltip key={i}>
            <TooltipTrigger asChild>
              <span className="underline decoration-dotted decoration-primary/40 cursor-help hover:decoration-primary transition-colors">
                {part.content}
              </span>
            </TooltipTrigger>
            <TooltipContent side="top" className="max-w-xs text-xs leading-relaxed">
              <p>{part.definition}</p>
            </TooltipContent>
          </Tooltip>
        );
      })}
    </TooltipProvider>
  );
}

export { LEGAL_GLOSSARY };

import { useEffect, useRef, useState, useCallback } from "react";

// Backdrop lives in ./debtclock-bg.ts as a data-URI export (no asset files needed).
import { BILL_BG } from "./debtclock-bg";

// ---------------------------------------------------------------------------
// Seven-segment LED digit renderer
// ---------------------------------------------------------------------------
const SEGMENTS: Record<string, boolean[]> = {
  "0": [true,  true,  true,  true,  true,  true,  false],
  "1": [false, true,  true,  false, false, false, false],
  "2": [true,  true,  false, true,  true,  false, true ],
  "3": [true,  true,  true,  true,  false, false, true ],
  "4": [false, true,  true,  false, false, true,  true ],
  "5": [true,  false, true,  true,  false, true,  true ],
  "6": [true,  false, true,  true,  true,  true,  true ],
  "7": [true,  true,  true,  false, false, false, false],
  "8": [true,  true,  true,  true,  true,  true,  true ],
  "9": [true,  true,  true,  true,  false, true,  true ],
};

const SEG_ON  = "oklch(0.85 0.19 70)";
const SEG_OFF = "oklch(0.19 0.03 65)";
const LED_GLOW =
  "drop-shadow(0 0 5px rgba(255,178,72,0.65)) drop-shadow(0 0 16px rgba(255,150,40,0.30))";

function SevenSegDigit({ char, size = 38 }: { char: string; size?: number }) {
  const segs = SEGMENTS[char];
  if (!segs) {
    const w = char === "," ? size * 0.26 : char === "$" ? size * 0.52 : size * 0.26;
    return (
      <span style={{
        display: "inline-flex",
        alignItems: char === "," ? "flex-end" : "center",
        justifyContent: "center",
        width: `${w}px`, height: `${size * 1.1}px`,
        color: SEG_ON,
        fontFamily: "'Courier New', monospace",
        fontSize: `${size * 0.8}px`,
        fontWeight: 900,
        lineHeight: 1,
        paddingBottom: char === "," ? "3px" : "0",
        flexShrink: 0,
        filter: LED_GLOW,
      }}>
        {char}
      </span>
    );
  }
  const W = size * 0.6, H = size * 1.1, T = size * 0.09, G = size * 0.05;
  const [a, b, c, d, e, f, g] = segs;
  const horiz = (y0: number) =>
    `M${G + T / 2},${y0} L${W - G - T / 2},${y0} L${W - G},${y0 + T / 2} ` +
    `L${W - G - T / 2},${y0 + T} L${G + T / 2},${y0 + T} L${G},${y0 + T / 2} Z`;
  const vert = (x0: number, y0: number) =>
    `M${x0 + T / 2},${y0 + G} L${x0 + T},${y0 + G + T / 2} L${x0 + T},${y0 + H / 2 - G - T / 2} ` +
    `L${x0 + T / 2},${y0 + H / 2 - G} L${x0},${y0 + H / 2 - G - T / 2} L${x0},${y0 + G + T / 2} Z`;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H}
      style={{ display: "inline-block", verticalAlign: "middle", flexShrink: 0, filter: LED_GLOW }}
      aria-hidden="true">
      <path d={horiz(0)}             fill={a ? SEG_ON : SEG_OFF} />
      <path d={vert(W - T, 0)}       fill={b ? SEG_ON : SEG_OFF} />
      <path d={vert(W - T, H / 2)}   fill={c ? SEG_ON : SEG_OFF} />
      <path d={horiz(H - T)}         fill={d ? SEG_ON : SEG_OFF} />
      <path d={vert(0, H / 2)}       fill={e ? SEG_ON : SEG_OFF} />
      <path d={vert(0, 0)}           fill={f ? SEG_ON : SEG_OFF} />
      <path d={horiz(H / 2 - T / 2)} fill={g ? SEG_ON : SEG_OFF} />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Subtle physical detail: mounting screw head
// ---------------------------------------------------------------------------
function Screw({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" aria-hidden="true"
      style={{ display: "block", filter: "drop-shadow(0 1px 1px rgba(0,0,0,0.7))" }}>
      <circle cx="10" cy="10" r="9" fill="#2a2f33" stroke="#101315" strokeWidth="1.5" />
      <circle cx="10" cy="10" r="7.5" fill="none" stroke="#3d444a" strokeWidth="1" />
      <line x1="4.5" y1="10" x2="15.5" y2="10" stroke="#0b0d0f" strokeWidth="2.2" />
      <line x1="5" y1="9.2" x2="15" y2="9.2" stroke="#565f66" strokeWidth="0.8" />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Responsive hook (SSR-safe)
// ---------------------------------------------------------------------------
function useViewportWidth() {
  const [w, setW] = useState(1024);
  useEffect(() => {
    const update = () => setW(window.innerWidth);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);
  return w;
}

// ---------------------------------------------------------------------------
// LedPanel — recessed bezel, amber digits, engraved serif label
// ---------------------------------------------------------------------------
function LedPanel({ value, label, sublabel, tooltip, digitSize = 38, compact = false }: {
  value: number; label: string; sublabel?: string; tooltip?: React.ReactNode; digitSize?: number; compact?: boolean;
}) {
  const [showTooltip, setShowTooltip] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = useCallback((e: MouseEvent) => {
    if (tooltipRef.current && !tooltipRef.current.contains(e.target as Node)) {
      setShowTooltip(false);
    }
  }, []);

  useEffect(() => {
    if (showTooltip) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showTooltip, handleClickOutside]);

  const [displayed, setDisplayed] = useState(0);
  const prevRef = useRef(0);

  useEffect(() => {
    const start = prevRef.current;
    const end = value;
    if (start === end) return;
    const duration = 1400;
    const startTime = performance.now();
    const tick = (now: number) => {
      const t = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplayed(Math.round(start + (end - start) * eased));
      if (t < 1) requestAnimationFrame(tick);
      else prevRef.current = end;
    };
    requestAnimationFrame(tick);
  }, [value]);

  const formatted = "$" + Math.round(displayed).toLocaleString("en-US");
  const chars = formatted.split("");

  return (
    <div style={{
      display: "flex", flexDirection: "column",
      alignItems: compact ? "flex-end" : "center",
      gap: compact ? "0.5rem" : "0.75rem",
      width: "100%",
    }}>
      <div
        style={{
          position: "relative",
          background: "linear-gradient(180deg, #0a0a0a 0%, #030303 60%, #000 100%)",
          border: compact ? "5px solid #23262a" : "7px solid #1f2225",
          borderRadius: "5px",
          boxShadow:
            "inset 0 5px 18px rgba(0,0,0,0.95), inset 0 -1px 3px rgba(255,255,255,0.05), " +
            "0 1px 0 rgba(255,255,255,0.10), 0 10px 34px rgba(0,0,0,0.8)",
          padding: compact ? "11px 14px 9px" : "18px 22px 14px",
          display: "flex",
          alignItems: "center",
          gap: "2px",
          flexWrap: "nowrap",
          justifyContent: "center",
          overflow: "hidden",
          maxWidth: "100%",
        }}
        aria-label={`${label}: ${formatted}`}
      >
        {/* glass sheen across the panel face */}
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          background:
            "linear-gradient(115deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.015) 28%, transparent 45%)",
        }} />
        {chars.map((ch, i) => (
          <SevenSegDigit key={i} char={ch} size={digitSize} />
        ))}
      </div>
      <div style={{
        fontFamily: "'Playfair Display', 'Times New Roman', Georgia, serif",
        color: "#f4f1e8", fontWeight: 800,
        fontSize: compact
          ? "clamp(0.8rem, 1.9vw, 1.3rem)"
          : "clamp(0.95rem, 2.5vw, 1.85rem)",
        textTransform: "uppercase", letterSpacing: "0.07em",
        textAlign: compact ? "right" : "center",
        textShadow: "0 2px 5px rgba(0,0,0,0.85), 0 0 22px rgba(0,0,0,0.5)",
        lineHeight: 1.2,
      }}>
        {label}
      </div>
      {sublabel && (
        <div style={{
          fontFamily: "'Playfair Display', 'Times New Roman', Georgia, serif",
          color: "rgba(240,236,224,0.66)",
          fontSize: compact ? "clamp(0.58rem, 1vw, 0.75rem)" : "clamp(0.68rem, 1.25vw, 0.9rem)",
          fontStyle: "italic",
          textAlign: compact ? "right" : "center",
          textShadow: "0 1px 3px rgba(0,0,0,0.6)", marginTop: "-0.3rem",
        }}>
          {sublabel}
        </div>
      )}
      {tooltip && (
        <div ref={tooltipRef} style={{ position: "relative", display: "inline-block", alignSelf: compact ? "flex-end" : "center" }}>
          <button
            onClick={() => setShowTooltip(v => !v)}
            aria-label="Show calculation methodology"
            style={{
              display: "inline-flex", alignItems: "center", gap: "0.3rem",
              background: "rgba(255,178,72,0.12)", border: "1px solid rgba(255,178,72,0.30)",
              borderRadius: "3px", padding: "2px 8px",
              color: "rgba(240,236,224,0.70)", cursor: "pointer",
              fontFamily: "'Playfair Display', 'Times New Roman', Georgia, serif",
              fontSize: "0.65rem", fontStyle: "italic", letterSpacing: "0.04em",
              transition: "background 160ms ease-out, border-color 160ms ease-out",
              marginTop: "-0.1rem",
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,178,72,0.22)"; (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,178,72,0.55)"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,178,72,0.12)"; (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,178,72,0.30)"; }}
          >
            <svg width="10" height="10" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M8 7v5M8 5v1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            How calculated
          </button>
          {showTooltip && (
            <div style={{
              position: "absolute", bottom: "calc(100% + 8px)",
              right: compact ? "0" : "50%",
              transform: compact ? "none" : "translateX(50%)",
              width: "min(340px, 90vw)",
              background: "oklch(0.13 0.02 200 / 0.97)",
              border: "1px solid rgba(255,178,72,0.25)",
              borderRadius: "6px",
              padding: "1rem 1.1rem",
              boxShadow: "0 8px 32px rgba(0,0,0,0.7)",
              zIndex: 50,
              backdropFilter: "blur(6px)",
            }}>
              {tooltip}
              <div style={{
                position: "absolute", bottom: "-6px",
                right: compact ? "16px" : "50%",
                width: "10px", height: "10px",
                background: "oklch(0.13 0.02 200 / 0.97)",
                borderRight: "1px solid rgba(255,178,72,0.25)",
                borderBottom: "1px solid rgba(255,178,72,0.25)",
                transform: compact ? "rotate(45deg)" : "translateX(50%) rotate(45deg)",
              }} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Billboard
// ---------------------------------------------------------------------------
interface DebtClockBillboardProps {
  remaining: number;
  payouts: number;
  remainingLow?: number;
  remainingHigh?: number;
  lastUpdated?: string | null;
  topTrusts?: Array<{ name: string; netAssets: number; assetsAsOf: string | null; confidence: string }>;
  paidOutDocumented?: number;
  paidOutEstimatedRemainder?: number;
  trustsWithCumulativePaidFiled?: number;
}

export function DebtClockBillboard({ remaining, payouts, remainingLow, remainingHigh, lastUpdated, topTrusts, paidOutDocumented = 6327731757, paidOutEstimatedRemainder = 17672268243, trustsWithCumulativePaidFiled = 3 }: DebtClockBillboardProps) {
  const vw = useViewportWidth();
  const isMobile = vw < 640;
  const isTablet = vw >= 640 && vw < 900;
  const primarySize = isMobile ? 19 : isTablet ? 33 : 50;
  const secondarySize = isMobile ? 17 : isTablet ? 23 : 30;

  // Format lastUpdated for display
  const formattedDate = lastUpdated
    ? (() => {
        try {
          const d = new Date(lastUpdated + "T00:00:00Z");
          return d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric", timeZone: "UTC" });
        } catch { return lastUpdated; }
      })()
    : null;

  // Shared "Last Updated" strip style
  const lastUpdatedStyle: React.CSSProperties = {
    fontFamily: "'Playfair Display', 'Times New Roman', Georgia, serif",
    color: "rgba(240,236,224,0.42)",
    fontSize: "0.62rem",
    fontStyle: "italic",
    letterSpacing: "0.04em",
    textAlign: "center",
    marginTop: "0.15rem",
  };

  // Remaining assets tooltip content
  const remainingTooltip = topTrusts && topTrusts.length > 0 ? (
    <div style={{ fontFamily: "'Playfair Display', 'Times New Roman', Georgia, serif", color: "rgba(240,236,224,0.9)", fontSize: "0.78rem", lineHeight: 1.55 }}>
      <div style={{ fontWeight: 700, fontSize: "0.82rem", marginBottom: "0.6rem", color: "#f4d07a", letterSpacing: "0.04em", textTransform: "uppercase" }}>
        Top Contributing Trusts
      </div>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.7rem" }}>
        <tbody>
          {topTrusts.map((t, i) => (
            <tr key={i} style={{ borderBottom: "1px solid rgba(255,178,72,0.10)" }}>
              <td style={{ padding: "4px 6px 4px 0", color: "rgba(240,236,224,0.85)", fontWeight: 600, maxWidth: "140px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {t.name}
              </td>
              <td style={{ padding: "4px 4px", fontFamily: "'Courier New', monospace", color: SEG_ON, whiteSpace: "nowrap", fontSize: "0.67rem", textAlign: "right" }}>
                ${(t.netAssets / 1e9).toFixed(3)}B
              </td>
              <td style={{ padding: "4px 0 4px 6px" }}>
                <span style={{
                  fontSize: "0.58rem", padding: "1px 5px", borderRadius: "2px", fontWeight: 700, letterSpacing: "0.04em",
                  background: t.confidence === "filed" ? "rgba(34,197,94,0.15)" : t.confidence === "secondary" ? "rgba(96,165,250,0.15)" : "rgba(251,191,36,0.15)",
                  color: t.confidence === "filed" ? "#86efac" : t.confidence === "secondary" ? "#93c5fd" : "#fcd34d",
                  border: `1px solid ${t.confidence === "filed" ? "rgba(34,197,94,0.3)" : t.confidence === "secondary" ? "rgba(96,165,250,0.3)" : "rgba(251,191,36,0.3)"}`,
                }}>{t.confidence === "filed" ? "a" : t.confidence === "secondary" ? "b" : "c"}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div style={{ marginTop: "0.65rem", fontSize: "0.65rem", color: "rgba(240,236,224,0.45)", fontStyle: "italic", lineHeight: 1.4 }}>
        Documented floor: $17.04B across 42 trusts. Full system estimate $17.0B–$22.5B includes modeled figures for trusts without filed balances.
      </div>
      <a href="/methodology" style={{ display: "block", marginTop: "0.6rem", fontSize: "0.68rem", color: "rgba(255,178,72,0.8)", textDecoration: "none", borderTop: "1px solid rgba(255,178,72,0.15)", paddingTop: "0.5rem", letterSpacing: "0.03em" }}
        onMouseEnter={e => (e.currentTarget.style.color = SEG_ON)}
        onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,178,72,0.8)")}
      >
        Read full methodology →
      </a>
    </div>
  ) : undefined;

  const frameEdge = "linear-gradient(145deg, #3a4147 0%, #14181b 22%, #05070a 50%, #23292e 78%, #454e55 100%)";

  return (
    <div style={{
      position: "relative",
      borderRadius: "10px",
      padding: isMobile ? "9px" : "13px",
      background: frameEdge,
      boxShadow:
        "0 26px 80px rgba(0,0,0,0.9), 0 8px 24px rgba(0,0,0,0.7), " +
        "inset 0 1px 1px rgba(255,255,255,0.28), inset 0 -1px 2px rgba(0,0,0,0.8)",
    }}>
      {/* face: engraved asbestos banknote */}
      <div style={{
        position: "relative",
        borderRadius: "5px",
        overflow: "hidden",
        border: "2px solid #04110e",
        background: "#0a2b25",
        padding: isMobile
          ? "1.6rem 1rem 1.5rem"
          : "clamp(2.1rem, 4.5vw, 3.4rem) clamp(1.6rem, 4vw, 3rem) clamp(1.6rem, 3.5vw, 2.6rem)",
        boxShadow: "inset 0 0 70px rgba(0,0,0,0.6)",
      }}>
        {/* the bill */}
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: `url("${BILL_BG}")`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: 0.92,
          pointerEvents: "none",
        }} />
        {/* teal glaze + center-readable scrim */}
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          background:
            "linear-gradient(180deg, rgba(6,34,29,0.55) 0%, rgba(7,38,32,0.30) 30%, rgba(5,28,24,0.42) 62%, rgba(3,18,15,0.68) 100%)",
        }} />
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          background:
            "radial-gradient(ellipse 72% 62% at 50% 42%, rgba(4,20,17,0.34) 0%, transparent 68%)",
        }} />
        {/* glass glare sweep */}
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          background:
            "linear-gradient(112deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0.025) 24%, transparent 42%)",
        }} />

        <div style={{ position: "relative", zIndex: 1 }}>
          {/* Title */}
          <div style={{
            textAlign: "center",
            marginBottom: isMobile ? "1.05rem" : "clamp(1.2rem, 2.4vw, 1.8rem)",
            fontFamily: "'Playfair Display', 'Times New Roman', Georgia, serif",
            color: "#f6f3ea", fontWeight: 900,
            fontSize: "clamp(1.15rem, 4vw, 2.75rem)",
            textTransform: "uppercase", letterSpacing: "0.05em",
            textShadow: "0 3px 10px rgba(0,0,0,0.9), 0 0 30px rgba(0,0,0,0.6)",
            lineHeight: 1.1,
          }}>
            U.S. Asbestos Trust Fund System:
          </div>

          {/* Primary counter */}
          <LedPanel
            value={remaining}
            label="Documented Remaining Assets"
            sublabel="Primary-sourced figures only — see methodology"
            tooltip={remainingTooltip}
            digitSize={primarySize}
          />
          {formattedDate && (
            <div style={{ ...lastUpdatedStyle, textAlign: "center", marginTop: "0.25rem" }}>
              Last updated: {formattedDate}
            </div>
          )}

          {/* Range strip — full system estimate */}
          {remainingLow != null && remainingHigh != null && (
            <div style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.6rem",
              marginTop: isMobile ? "0.6rem" : "clamp(0.5rem, 1.2vw, 0.9rem)",
              padding: isMobile ? "0.45rem 0.75rem" : "0.5rem 1.1rem",
              borderRadius: "4px",
              background: "rgba(0,0,0,0.45)",
              border: "1px solid rgba(255,178,72,0.18)",
            }}>
              <span style={{
                fontFamily: "'Playfair Display', 'Times New Roman', Georgia, serif",
                color: "rgba(240,236,224,0.55)",
                fontSize: isMobile ? "0.65rem" : "clamp(0.62rem, 1.1vw, 0.82rem)",
                fontStyle: "italic",
                letterSpacing: "0.04em",
              }}>
                Full system estimate (incl. modeled):
              </span>
              <span style={{
                fontFamily: "'Courier New', monospace",
                color: SEG_ON,
                fontSize: isMobile ? "0.7rem" : "clamp(0.68rem, 1.2vw, 0.88rem)",
                fontWeight: 700,
                filter: "drop-shadow(0 0 4px rgba(255,178,72,0.4))",
                letterSpacing: "0.02em",
              }}>
                ${(remainingLow / 1e9).toFixed(1)}B – ${(remainingHigh / 1e9).toFixed(1)}B
              </span>
            </div>
          )}

          {/* Secondary counter — lower right */}
          <div style={{
            display: "flex",
            justifyContent: isMobile ? "center" : "flex-end",
            marginTop: isMobile ? "1.2rem" : "clamp(1.15rem, 2.3vw, 1.75rem)",
          }}>
            <div style={{ width: isMobile ? "100%" : "min(45%, 470px)" }}>
              <LedPanel
               value={payouts}
               label="Cumulative Payouts Since 1988"
               sublabel="Derived estimate — see methodology"
              tooltip={
                <div style={{ fontFamily: "'Playfair Display', 'Times New Roman', Georgia, serif", color: "rgba(240,236,224,0.9)", fontSize: "0.78rem", lineHeight: 1.55 }}>
                  <div style={{ fontWeight: 700, fontSize: "0.82rem", marginBottom: "0.6rem", color: "#f4d07a", letterSpacing: "0.04em", textTransform: "uppercase" }}>
                    How ~$24B Is Calculated
                  </div>
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.72rem" }}>
                    <tbody>
                      {[
                      [`$${paidOutDocumented.toLocaleString()}`, `${trustsWithCumulativePaidFiled} trusts — filed reports`, "Manville, Western, NARCO, Thorpe Ins., Plant, J.T. Thorpe, API", "filed"],
                        // note: trust list updated in footnote below
                        [`+ $${paidOutEstimatedRemainder.toLocaleString()}`, `${42 - trustsWithCumulativePaidFiled} trusts — estimated`, "GAO-11-819 floor + secondary sources", "est"],
                      ].map(([amt, name, note, conf]) => (
                        <tr key={name} style={{ borderBottom: "1px solid rgba(255,178,72,0.10)" }}>
                          <td style={{ padding: "4px 6px 4px 0", fontFamily: "'Courier New', monospace", color: SEG_ON, whiteSpace: "nowrap", fontSize: "0.68rem" }}>{amt}</td>
                          <td style={{ padding: "4px 4px", fontWeight: 600, color: "rgba(240,236,224,0.85)" }}>{name}</td>
                          <td style={{ padding: "4px 0 4px 4px", color: "rgba(240,236,224,0.50)", fontSize: "0.65rem" }}>{note}</td>
                          <td style={{ padding: "4px 0 4px 6px" }}>
                            <span style={{
                              fontSize: "0.58rem", padding: "1px 5px", borderRadius: "2px", fontWeight: 700, letterSpacing: "0.04em",
                              background: conf === "filed" ? "rgba(34,197,94,0.15)" : conf === "secondary" ? "rgba(96,165,250,0.15)" : "rgba(251,191,36,0.15)",
                              color: conf === "filed" ? "#86efac" : conf === "secondary" ? "#93c5fd" : "#fcd34d",
                              border: `1px solid ${conf === "filed" ? "rgba(34,197,94,0.3)" : conf === "secondary" ? "rgba(96,165,250,0.3)" : "rgba(251,191,36,0.3)"}`,
                            }}>{conf === "filed" ? "a" : conf === "secondary" ? "b" : "c"}</span>
                          </td>
                        </tr>
                      ))}
                      <tr style={{ borderTop: "1px solid rgba(255,178,72,0.30)" }}>
                        <td colSpan={4} style={{ padding: "6px 0 2px", fontFamily: "'Courier New', monospace", color: SEG_ON, fontSize: "0.72rem", fontWeight: 700 }}>
                          = ${(paidOutDocumented + paidOutEstimatedRemainder).toLocaleString()} &nbsp;<span style={{ color: "rgba(240,236,224,0.45)", fontFamily: "serif", fontWeight: 400, fontSize: "0.65rem" }}>est. total</span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  <div style={{ marginTop: "0.65rem", fontSize: "0.65rem", color: "rgba(240,236,224,0.45)", fontStyle: "italic", lineHeight: 1.4 }}>
                  ${paidOutDocumented.toLocaleString()} is documented from {trustsWithCumulativePaidFiled} filed annual reports (Manville, Western, NARCO, Thorpe Insulation, Plant, J.T. Thorpe CA, API). The remaining ~${(paidOutEstimatedRemainder / 1e9).toFixed(1)}B is anchored to the GAO-11-819 floor ($17.5B, Sept 2011) plus secondary sources. As PACER pulls complete, the documented share will grow. Source classifications follow the (a)/(b)/(c) system on the Methodology page.
                    {/* documented trusts (b0c3acc): Manville, Western, NARCO, Thorpe Insulation, Plant, J.T. Thorpe CA, API */}
                  </div>
                   <a href="/methodology" style={{ display: "block", marginTop: "0.6rem", fontSize: "0.68rem", color: "rgba(255,178,72,0.8)", textDecoration: "none", borderTop: "1px solid rgba(255,178,72,0.15)", paddingTop: "0.5rem", letterSpacing: "0.03em" }}
                     onMouseEnter={e => (e.currentTarget.style.color = SEG_ON)}
                     onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,178,72,0.8)")}
                   >
                     Read full methodology →
                   </a>
                 </div>
               }
               digitSize={secondarySize}
               compact={!isMobile}
            />
            {formattedDate && (
              <div style={{ ...lastUpdatedStyle, textAlign: "right", marginTop: "0.25rem" }}>
                Last updated: {formattedDate}
              </div>
            )}
            </div>
          </div>

          {/* Branding */}
          <div style={{
            textAlign: "center",
            marginTop: isMobile ? "1.3rem" : "clamp(1.4rem, 2.8vw, 2.1rem)",
            fontFamily: "'Playfair Display', 'Times New Roman', Georgia, serif",
            color: "rgba(246,243,234,0.94)",
            fontSize: "clamp(0.85rem, 2.2vw, 1.5rem)",
            fontWeight: 800, letterSpacing: "0.17em",
            textTransform: "uppercase",
            textShadow: "0 2px 7px rgba(0,0,0,0.85)",
          }}>
            The Asbestos Trust Fund Clock
          </div>
        </div>
      </div>

      {/* frame screws */}
      <div style={{ position: "absolute", top: isMobile ? 3 : 4, left: isMobile ? 3 : 4 }}><Screw size={isMobile ? 11 : 15} /></div>
      <div style={{ position: "absolute", top: isMobile ? 3 : 4, right: isMobile ? 3 : 4 }}><Screw size={isMobile ? 11 : 15} /></div>
      <div style={{ position: "absolute", bottom: isMobile ? 3 : 4, left: isMobile ? 3 : 4 }}><Screw size={isMobile ? 11 : 15} /></div>
      <div style={{ position: "absolute", bottom: isMobile ? 3 : 4, right: isMobile ? 3 : 4 }}><Screw size={isMobile ? 11 : 15} /></div>
    </div>
  );
}

export { LedPanel as DebtClock };

import { useEffect, useRef, useState, useCallback } from "react";

// Backdrop is a high-res engraved plate served as a static asset.
const BILL_BG = "/debtclock-bg.jpg";

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

function SevenSegDigit({ char, size = 38, dim = false }: { char: string; size?: number; dim?: boolean }) {
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
        opacity: dim ? 0.25 : 1,
        transition: "opacity 70ms",
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
      style={{ display: "inline-block", verticalAlign: "middle", flexShrink: 0, filter: LED_GLOW, opacity: dim ? 0.25 : 1, transition: "opacity 70ms" }}
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
function LedPanel({ value, label, sublabel, tooltip, panelTooltip, digitSize = 38, compact = false }: {
  value: number; label: string; sublabel?: string; tooltip?: React.ReactNode; panelTooltip?: React.ReactNode; digitSize?: number; compact?: boolean;
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

  // Aging-LED-board effect: a random digit briefly dips, every few seconds
  const [flickerIdx, setFlickerIdx] = useState(-1);
  const [hovered, setHovered] = useState(false);
  const [showPanelTooltip, setShowPanelTooltip] = useState(false);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let t1: number, t2: number, live = true;
    const loop = () => {
      t1 = window.setTimeout(() => {
        if (!live) return;
        setFlickerIdx(1 + Math.floor(Math.random() * (chars.length - 1)));
        t2 = window.setTimeout(() => { if (live) setFlickerIdx(-1); }, 90 + Math.random() * 160);
        loop();
      }, 2600 + Math.random() * 5200);
    };
    loop();
    return () => { live = false; clearTimeout(t1); clearTimeout(t2); };
  }, [chars.length]);

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
          boxShadow: hovered
            ? undefined  // handled by dc-glow-pulse CSS animation
            : "inset 0 5px 18px rgba(0,0,0,0.95), inset 0 -1px 3px rgba(255,255,255,0.05), " +
              "0 1px 0 rgba(255,255,255,0.10), 0 10px 34px rgba(0,0,0,0.8)",
          padding: compact ? "11px 14px 9px" : "18px 22px 14px",
          display: "flex",
          alignItems: "center",
          gap: "2px",
          flexWrap: "nowrap",
          justifyContent: "center",
          overflow: "hidden",
          maxWidth: "100%",
          cursor: "default",
          transform: hovered ? "translateY(-2px)" : "translateY(0)",
          transition: "box-shadow 200ms ease-out, transform 200ms ease-out",
        }}
        className={hovered ? "dc-glow-pulse" : undefined}
        aria-label={`${label}: ${formatted}`}
        onMouseEnter={() => { setHovered(true); if (panelTooltip) setShowPanelTooltip(true); }}
        onMouseLeave={() => { setHovered(false); setShowPanelTooltip(false); }}
      >
        {showPanelTooltip && panelTooltip && (
          <div className="dc-panel-tooltip">{panelTooltip}</div>
        )}
        {/* glass sheen across the panel face */}
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          background:
            "linear-gradient(115deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.015) 28%, transparent 45%)",
        }} />
        {chars.map((ch, i) => (
          <SevenSegDigit key={i} char={ch} size={digitSize} dim={i === flickerIdx} />
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
        textShadow: "0 1px 2px rgba(0,0,0,0.95), 0 2px 6px rgba(0,0,0,0.85), 0 0 22px rgba(0,0,0,0.55)",
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
          textShadow: "0 1px 2px rgba(0,0,0,0.9), 0 2px 8px rgba(0,0,0,0.6)", marginTop: "-0.3rem",
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
              position: "fixed",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: "min(400px, 92vw)",
              maxHeight: "85vh",
              overflowY: "auto",
              background: "oklch(0.13 0.02 200 / 0.97)",
              border: "1px solid rgba(255,178,72,0.25)",
              borderRadius: "8px",
              padding: "1rem 1.1rem",
              boxShadow: "0 16px 48px rgba(0,0,0,0.85)",
              zIndex: 9999,
              backdropFilter: "blur(6px)",
            }}>
              {tooltip}

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
  documentedTrusts?: Array<{ name: string; cumulativePaid: number; cumulativePaidAsOf: string | null }>;
  paidOutBottomUpFiled?: number;
  paidOutBottomUpSecondary?: number;
  paidOutBottomUpResidual?: number;
}

export function DebtClockBillboard({ remaining, payouts, remainingLow, remainingHigh, lastUpdated, topTrusts, paidOutDocumented = 19810476508, paidOutEstimatedRemainder = 4189523492, trustsWithCumulativePaidFiled = 14, documentedTrusts = [], paidOutBottomUpFiled = 19810476508, paidOutBottomUpSecondary = 6671321145, paidOutBottomUpResidual = 3500000000 }: DebtClockBillboardProps) {
  const vw = useViewportWidth();
  const isMobile = vw < 640;
  const isTablet = vw >= 640 && vw < 900;
  const primarySize = isMobile ? 24 : isTablet ? 44 : 68;
  const secondarySize = isMobile ? 20 : isTablet ? 30 : 42;

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
        Documented floor: $16.75B (13 filed-asset trusts). Full system estimate $16.7B–$22.5B includes modeled figures for trusts without filed balances.
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
      {/* face: engraved industrial plate */}
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
        <style>{`
          @keyframes dcKb    { 0% { transform: scale(1.02) translate(0,0); } 100% { transform: scale(1.08) translate(-0.7%,-0.9%); } }
          @keyframes dcSpill { 0%,100% { opacity: .6; } 50% { opacity: 1; } }
          @keyframes dcSweep { 0% { transform: translateX(-160%) skewX(-14deg); } 42%,100% { transform: translateX(430%) skewX(-14deg); } }
          @keyframes dcMote  { 0% { transform: translate(0,0); opacity: 0; } 15% { opacity: .55; } 80% { opacity: .3; } 100% { transform: translate(26px,-90px); opacity: 0; } }
          @keyframes dcSmoke { 0% { transform: translate(0,0) scale(1); opacity: 0; } 20% { opacity: .8; } 100% { transform: translate(30px,-64px) scale(1.4); opacity: 0; } }
          .dc-kb    { animation: dcKb 130s ease-in-out infinite alternate; }
          .dc-spill { animation: dcSpill 11s ease-in-out infinite; }
          .dc-sweep { animation: dcSweep 58s ease-in-out infinite; }
          .dc-mote  { animation: dcMote linear infinite; }
          .dc-smoke { animation: dcSmoke linear infinite; }
          @keyframes dcGlowPulse {
            0%,100% { box-shadow: inset 0 5px 18px rgba(0,0,0,0.95), inset 0 -1px 3px rgba(255,255,255,0.05), 0 1px 0 rgba(255,255,255,0.14), 0 14px 44px rgba(0,0,0,0.9), 0 0 22px rgba(255,178,72,0.14), 0 0 48px rgba(255,178,72,0.06); }
            50%      { box-shadow: inset 0 5px 18px rgba(0,0,0,0.95), inset 0 -1px 3px rgba(255,255,255,0.05), 0 1px 0 rgba(255,255,255,0.14), 0 14px 44px rgba(0,0,0,0.9), 0 0 36px rgba(255,178,72,0.30), 0 0 80px rgba(255,178,72,0.14); }
          }
          .dc-glow-pulse { animation: dcGlowPulse 2s ease-in-out infinite; }
          .dc-panel-tooltip {
            position: absolute; bottom: calc(100% + 10px); left: 50%; transform: translateX(-50%);
            background: oklch(0.13 0.02 200 / 0.97); border: 1px solid rgba(255,178,72,0.25);
            border-radius: 6px; padding: 10px 14px; width: max-content; max-width: min(340px, 90vw);
            color: rgba(240,236,224,0.88); font-family: Georgia, serif; font-size: 0.72rem;
            line-height: 1.55; text-align: left; pointer-events: none; z-index: 100;
            box-shadow: 0 8px 28px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,178,72,0.10);
            animation: dcTooltipIn 160ms cubic-bezier(0.23,1,0.32,1) both;
          }
          .dc-panel-tooltip::after {
            content: ""; position: absolute; top: 100%; left: 50%; transform: translateX(-50%);
            border: 6px solid transparent; border-top-color: rgba(255,178,72,0.25);
          }
          @keyframes dcTooltipIn { from { opacity: 0; transform: translateX(-50%) translateY(4px); } to { opacity: 1; transform: translateX(-50%) translateY(0); } }
          @media (prefers-reduced-motion: reduce) {
            .dc-kb,.dc-spill,.dc-sweep,.dc-mote,.dc-smoke,.dc-glow-pulse { animation: none !important; }
          }
        `}</style>

        {/* the engraved plate — drifting almost imperceptibly */}
        <div className="dc-kb" style={{
          position: "absolute", inset: "-4%",
          backgroundImage: `url("${BILL_BG}")`,
          backgroundSize: "cover",
          backgroundPosition: "center 62%",
          opacity: 0.96,
          pointerEvents: "none",
        }} />
        {/* teal glaze + center-readable scrim */}
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          background:
            "linear-gradient(180deg, rgba(6,34,29,0.44) 0%, rgba(7,38,32,0.20) 30%, rgba(5,28,24,0.28) 62%, rgba(4,22,18,0.55) 84%, rgba(3,18,15,0.72) 100%)",
        }} />
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          background:
            "radial-gradient(ellipse 72% 62% at 50% 42%, rgba(4,20,17,0.26) 0%, transparent 68%)",
        }} />
        {/* shadow pooled behind the text zones, artwork left visible elsewhere */}
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          background:
            "radial-gradient(ellipse 62% 17% at 50% 15%, rgba(3,16,13,0.52) 0%, transparent 72%)",
        }} />
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          background:
            "radial-gradient(ellipse 56% 22% at 50% 53%, rgba(3,16,13,0.42) 0%, transparent 70%)",
        }} />
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          background:
            "radial-gradient(ellipse 34% 16% at 73% 79%, rgba(3,16,13,0.40) 0%, transparent 72%)",
        }} />
        {/* amber light spilling from the digit panels onto the engraving */}
        <div className="dc-spill" style={{
          position: "absolute", inset: 0, pointerEvents: "none", mixBlendMode: "screen",
          background:
            "radial-gradient(ellipse 48% 26% at 50% 33%, rgba(255,178,72,0.13) 0%, rgba(255,150,40,0.05) 45%, transparent 70%)",
        }} />
        <div className="dc-spill" style={{
          position: "absolute", inset: 0, pointerEvents: "none", mixBlendMode: "screen", animationDelay: "-5.5s",
          background:
            "radial-gradient(ellipse 32% 20% at 74% 74%, rgba(255,178,72,0.10) 0%, transparent 68%)",
        }} />
        {/* faint amber rim on the inner frame edge */}
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          boxShadow: "inset 0 0 46px rgba(255,160,60,0.07)",
        }} />
        {/* glass glare (static) + slow moving sheen sweep */}
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          background:
            "linear-gradient(112deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0.025) 24%, transparent 42%)",
        }} />
        <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
          <div className="dc-sweep" style={{
            position: "absolute", top: "-10%", bottom: "-10%", left: 0, width: "34%",
            background:
              "linear-gradient(100deg, transparent 0%, rgba(255,255,255,0.05) 42%, rgba(255,255,255,0.09) 50%, rgba(255,255,255,0.05) 58%, transparent 100%)",
          }} />
        </div>
        {/* dust motes drifting through the panel light */}
        {[[31, 44, 38, 0], [44, 60, 47, -13], [55, 40, 52, -29], [63, 66, 41, -7], [70, 50, 56, -35], [48, 72, 44, -21]].map(([l, t, d, del], i) => (
          <div key={i} className="dc-mote" style={{
            position: "absolute", left: `${l}%`, top: `${t}%`, width: 3, height: 3,
            borderRadius: "50%", background: "rgba(255,222,164,0.55)", filter: "blur(0.6px)",
            animationDuration: `${d}s`, animationDelay: `${del}s`, pointerEvents: "none",
          }} />
        ))}
        {/* smoke drifting off the stacks in the engraving (left third) */}
        {[[16, 24, 52, 0], [23, 20, 66, -31]].map(([l, t, d, del], i) => (
          <div key={i} className="dc-smoke" style={{
            position: "absolute", left: `${l}%`, top: `${t}%`, width: 96, height: 42,
            borderRadius: "50%", background: "rgba(160,205,185,0.10)", filter: "blur(14px)",
            animationDuration: `${d}s`, animationDelay: `${del}s`, pointerEvents: "none",
          }} />
        ))}

        <div style={{ position: "relative", zIndex: 1 }}>
          {/* Title */}
          <div style={{
            textAlign: "center",
            marginBottom: isMobile ? "1.05rem" : "clamp(1.2rem, 2.4vw, 1.8rem)",
            fontFamily: "'Playfair Display', 'Times New Roman', Georgia, serif",
            color: "#f6f3ea", fontWeight: 900,
            fontSize: "clamp(1.15rem, 4vw, 2.75rem)",
            textTransform: "uppercase", letterSpacing: "0.05em",
            textShadow: "0 2px 4px rgba(0,0,0,0.95), 0 3px 12px rgba(0,0,0,0.9), 0 0 34px rgba(0,0,0,0.65)",
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
            panelTooltip={
              <><strong style={{display:"block",color:"#f4d07a",marginBottom:"0.35rem",fontSize:"0.75rem",letterSpacing:"0.05em",textTransform:"uppercase"}}>Documented Remaining Assets</strong>
              The sum of net assets reported in the most recent annual report or financial statement filed by each of the 42 active U.S. asbestos bankruptcy trusts. Figures are drawn directly from primary court documents — not modeled or estimated. The as-of dates vary by trust; see the Trust Data page for per-trust detail. This is a documented floor, not a complete system total: trusts that have not yet filed public financials are excluded.</>
            }
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
               panelTooltip={
                 <><strong style={{display:"block",color:"#f4d07a",marginBottom:"0.35rem",fontSize:"0.75rem",letterSpacing:"0.05em",textTransform:"uppercase"}}>Cumulative Payouts Since 1988</strong>
                 The total amount paid to asbestos victims by all U.S. §524(g) trusts from inception through the most recent filed reports. Built bottom-up from three tiers: <em>Tier 1</em> — $19.81B filed directly in court documents (14 trusts); <em>Tier 2</em> — $6.67B from secondary sources citing filed figures (5 trusts); <em>Tier 3</em> — ~$3.5B estimated residual for the remaining ~25 trusts with no public cumulative figure. The old "$24B" figure was a 2011-era top-down estimate; this figure reflects a 2025–2026 bottom-up rebuild.</>
               }
              tooltip={
               <div style={{ fontFamily: "'Playfair Display', 'Times New Roman', Georgia, serif", color: "rgba(240,236,224,0.9)", fontSize: "0.78rem", lineHeight: 1.55 }}>
                 <div style={{ fontWeight: 700, fontSize: "0.82rem", marginBottom: "0.6rem", color: "#f4d07a", letterSpacing: "0.04em", textTransform: "uppercase" }}>
                   How $24B Is Calculated
                 </div>
                 <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.72rem" }}>
                  <tbody>
                      {/* ── Group 1: Current-era filed figures (2025–2026) ── */}
                      {(() => {
                        const shortName = (n: string) => n
                          .replace("Personal Injury Settlement Trust", "PI Trust")
                          .replace("Asbestos Settlement Trust", "Settlement Trust")
                          .replace("Asbestos PI Trust", "PI Trust")
                          .replace(" (Halliburton/Harbison-Walker)", "")
                          .replace("Motors Liquidation Co. (GM) ", "Motors Liquidation (GM) ");

                        const CURRENT_CUTOFF = 2020;
                        const currentTrusts = documentedTrusts.filter(t => {
                          const yr = t.cumulativePaidAsOf ? parseInt(t.cumulativePaidAsOf.substring(0, 4)) : 0;
                          return yr >= CURRENT_CUTOFF;
                        });
                        const historicalTrusts = documentedTrusts.filter(t => {
                          const yr = t.cumulativePaidAsOf ? parseInt(t.cumulativePaidAsOf.substring(0, 4)) : 0;
                          return yr > 0 && yr < CURRENT_CUTOFF;
                        });
                        const currentSubtotal = currentTrusts.reduce((s, t) => s + t.cumulativePaid, 0);
                        const historicalSubtotal = historicalTrusts.reduce((s, t) => s + t.cumulativePaid, 0);

                        const rowStyle: React.CSSProperties = { borderBottom: "1px solid rgba(255,178,72,0.07)" };
                        const amtStyle: React.CSSProperties = { padding: "3px 6px 3px 8px", fontFamily: "'Courier New', monospace", color: SEG_ON, whiteSpace: "nowrap", fontSize: "0.66rem" };
                        const nameStyle: React.CSSProperties = { padding: "3px 4px", color: "rgba(240,236,224,0.75)", fontSize: "0.65rem", lineHeight: 1.3 };
                        const dateStyle: React.CSSProperties = { padding: "3px 0 3px 4px", color: "rgba(240,236,224,0.35)", fontSize: "0.58rem", whiteSpace: "nowrap", textAlign: "right" };
                        const sectionHeaderStyle: React.CSSProperties = { padding: "6px 0 3px", fontSize: "0.58rem", color: "rgba(240,236,224,0.40)", fontStyle: "italic", letterSpacing: "0.05em", textTransform: "uppercase" };
                        const subtotalStyle: React.CSSProperties = { padding: "3px 6px 3px 0", fontFamily: "'Courier New', monospace", color: SEG_ON, fontSize: "0.66rem", fontWeight: 700 };
                        const subtotalLabelStyle: React.CSSProperties = { padding: "3px 0", color: "rgba(240,236,224,0.40)", fontSize: "0.60rem", fontStyle: "italic" };

                        return (<>
                          {/* Section 1 header */}
                          <tr>
                            <td colSpan={3} style={sectionHeaderStyle}>Filed figures — 2025–2026 ({currentTrusts.length} trusts)</td>
                            <td style={{ ...sectionHeaderStyle, textAlign: "right" }}>
                              <span style={{ fontSize: "0.58rem", padding: "1px 5px", borderRadius: "2px", fontWeight: 700, letterSpacing: "0.04em", background: "rgba(34,197,94,0.15)", color: "#86efac", border: "1px solid rgba(34,197,94,0.3)" }}>a</span>
                            </td>
                          </tr>
                          {currentTrusts.map(t => (
                            <tr key={t.name} style={rowStyle}>
                              <td style={amtStyle}>${t.cumulativePaid.toLocaleString()}</td>
                              <td colSpan={2} style={nameStyle}>{shortName(t.name)}</td>
                              <td style={dateStyle}>{t.cumulativePaidAsOf ? t.cumulativePaidAsOf.substring(0, 7) : ""}</td>
                            </tr>
                          ))}
                          {/* Section 1 subtotal */}
                          <tr style={{ borderTop: "1px solid rgba(255,178,72,0.18)", borderBottom: "1px solid rgba(255,178,72,0.08)" }}>
                            <td style={subtotalStyle}>${currentSubtotal.toLocaleString()}</td>
                            <td colSpan={3} style={subtotalLabelStyle}>subtotal — {currentTrusts.length} current-era trusts</td>
                          </tr>

                          {/* Section 2 header */}
                          {historicalTrusts.length > 0 && (<>
                            <tr>
                              <td colSpan={4} style={{ ...sectionHeaderStyle, paddingTop: "8px", color: "rgba(251,191,36,0.55)" }}>
                                Filed figures — historical floors, 2006–2014 ({historicalTrusts.length} trusts) — actual payouts to date are higher
                              </td>
                            </tr>
                            {historicalTrusts.map(t => (
                              <tr key={t.name} style={rowStyle}>
                                <td style={{ ...amtStyle, color: "rgba(255,178,72,0.55)" }}>${t.cumulativePaid.toLocaleString()}</td>
                                <td colSpan={2} style={{ ...nameStyle, color: "rgba(240,236,224,0.50)" }}>
                                  {shortName(t.name)}
                                  <span style={{ marginLeft: "4px", fontSize: "0.58rem", color: "rgba(240,236,224,0.30)" }}>
                                    (as of {t.cumulativePaidAsOf ? t.cumulativePaidAsOf.substring(0, 4) : ""})
                                  </span>
                                </td>
                                <td style={{ ...dateStyle, color: "rgba(240,236,224,0.25)" }}>hist.</td>
                              </tr>
                            ))}
                            {/* Section 2 subtotal */}
                            <tr style={{ borderTop: "1px solid rgba(255,178,72,0.12)", borderBottom: "1px solid rgba(255,178,72,0.08)" }}>
                              <td style={{ ...subtotalStyle, color: "rgba(255,178,72,0.55)" }}>${historicalSubtotal.toLocaleString()}</td>
                              <td colSpan={3} style={{ ...subtotalLabelStyle, color: "rgba(240,236,224,0.30)" }}>subtotal — {historicalTrusts.length} historical trusts (floors)</td>
                            </tr>
                          </>)}

                          {/* Combined documented total */}
                          <tr style={{ borderTop: "1px solid rgba(255,178,72,0.25)", borderBottom: "1px solid rgba(255,178,72,0.10)" }}>
                            <td style={{ ...subtotalStyle, fontSize: "0.68rem" }}>${paidOutDocumented.toLocaleString()}</td>
                            <td colSpan={3} style={{ ...subtotalLabelStyle, fontSize: "0.62rem" }}>documented total — {trustsWithCumulativePaidFiled} filed trusts</td>
                          </tr>

                          {/* Tier 2: Secondary-citing-filed */}
                          <tr>
                            <td colSpan={4} style={{ ...sectionHeaderStyle, paddingTop: "8px", color: "rgba(251,191,36,0.55)" }}>
                              Secondary-citing-filed — 5 trusts (PCC, B&W, Celotex growth, OC/FB growth, G-I Holdings)
                            </td>
                          </tr>
                          <tr style={{ borderBottom: "1px solid rgba(255,178,72,0.10)" }}>
                            <td style={{ padding: "3px 6px 3px 0", fontFamily: "'Courier New', monospace", color: "rgba(255,178,72,0.6)", whiteSpace: "nowrap", fontSize: "0.66rem" }}>
                              + ${paidOutBottomUpSecondary.toLocaleString()}
                            </td>
                            <td colSpan={2} style={{ padding: "3px 4px", color: "rgba(240,236,224,0.50)", fontSize: "0.65rem" }}>
                              Secondary sources citing filed documents
                            </td>
                            <td style={{ padding: "3px 0 3px 4px", textAlign: "right" }}>
                              <span style={{ fontSize: "0.58rem", padding: "1px 5px", borderRadius: "2px", fontWeight: 700, letterSpacing: "0.04em", background: "rgba(251,191,36,0.15)", color: "#fcd34d", border: "1px solid rgba(251,191,36,0.3)" }}>b</span>
                            </td>
                          </tr>

                          {/* Tier 3: Estimated residual */}
                          <tr>
                            <td colSpan={4} style={{ ...sectionHeaderStyle, paddingTop: "8px" }}>
                              Estimated residual — ~25 trusts with no public cumulative figure
                            </td>
                          </tr>
                          <tr style={{ borderBottom: "1px solid rgba(255,178,72,0.10)" }}>
                            <td style={{ padding: "3px 6px 3px 0", fontFamily: "'Courier New', monospace", color: "rgba(255,178,72,0.45)", whiteSpace: "nowrap", fontSize: "0.66rem" }}>
                              + ~${paidOutBottomUpResidual.toLocaleString()}
                            </td>
                            <td colSpan={2} style={{ padding: "3px 4px", color: "rgba(240,236,224,0.40)", fontSize: "0.65rem" }}>
                              ACandS, ASARCO, Bondex, CE, Eagle-Picher, Quigley, T&N, Garlock, Paddock, Rapid-American, and others
                            </td>
                            <td style={{ padding: "3px 0 3px 4px", textAlign: "right" }}>
                              <span style={{ fontSize: "0.58rem", padding: "1px 5px", borderRadius: "2px", fontWeight: 700, letterSpacing: "0.04em", background: "rgba(156,163,175,0.15)", color: "#d1d5db", border: "1px solid rgba(156,163,175,0.3)" }}>c</span>
                            </td>
                          </tr>

                          {/* Grand total */}
                          <tr style={{ borderTop: "1px solid rgba(255,178,72,0.30)" }}>
                            <td colSpan={4} style={{ padding: "6px 0 2px", fontFamily: "'Courier New', monospace", color: SEG_ON, fontSize: "0.72rem", fontWeight: 700 }}>
                              = ${(paidOutBottomUpFiled + paidOutBottomUpSecondary + paidOutBottomUpResidual).toLocaleString()} &nbsp;<span style={{ color: "rgba(240,236,224,0.45)", fontFamily: "serif", fontWeight: 400, fontSize: "0.65rem" }}>bottom-up est.</span>
                            </td>
                          </tr>
                        </>);
                      })()}
                   </tbody>
                 </table>
                 <div style={{ marginTop: "0.65rem", fontSize: "0.65rem", color: "rgba(240,236,224,0.45)", fontStyle: "italic", lineHeight: 1.4 }}>
                  Bottom-up estimate: ${paidOutBottomUpFiled.toLocaleString()} filed (14 trusts) + ${paidOutBottomUpSecondary.toLocaleString()} secondary-citing-filed (5 trusts) + ~${(paidOutBottomUpResidual / 1e9).toFixed(1)}B estimated residual (~25 trusts). The old $24B round figure was a top-down estimate anchored on 2011 data; this bottom-up rebuild produces ${((paidOutBottomUpFiled + paidOutBottomUpSecondary + paidOutBottomUpResidual) / 1e9).toFixed(1)}B. Source classifications follow the (a)/(b)/(c) system on the Methodology page.
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

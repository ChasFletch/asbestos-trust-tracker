import { useEffect, useRef, useState } from "react";

// Seven-segment LED digit renderer
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

const SEG_ON  = "oklch(0.82 0.18 65)";
const SEG_OFF = "oklch(0.16 0.04 65)";

function SevenSegDigit({ char, size = 38 }: { char: string; size?: number }) {
  const segs = SEGMENTS[char];
  if (!segs) {
    const w = char === "," ? size * 0.28 : char === "$" ? size * 0.55 : size * 0.28;
    return (
      <span style={{
        display: "inline-flex", alignItems: char === "," ? "flex-end" : "center",
        justifyContent: "center",
        width: `${w}px`, height: `${size * 1.1}px`,
        color: SEG_ON,
        fontFamily: "monospace",
        fontSize: `${size * 0.85}px`,
        fontWeight: 900,
        lineHeight: 1,
        paddingBottom: char === "," ? "3px" : "0",
        flexShrink: 0,
      }}>
        {char}
      </span>
    );
  }
  const W = size * 0.6, H = size * 1.1, T = size * 0.09, G = size * 0.04;
  const [a, b, c, d, e, f, g] = segs;
  const horiz = (y: number) =>
    `M${T+G},${y} L${W/2},${y-T/2} L${W-T-G},${y} L${W-T-G+T/2},${y+T/2} L${W/2},${y+T/2} L${T+G-T/2},${y+T/2} Z`;
  const vertL = (y1: number, y2: number) =>
    `M${0},${y1+T+G} L${T},${y1+G} L${T},${y2-G} L${0},${y2-G+T} L${T/2},${y2} L${T/2},${y1+T} Z`;
  const vertR = (y1: number, y2: number) =>
    `M${W},${y1+T+G} L${W-T},${y1+G} L${W-T},${y2-G} L${W},${y2-G+T} L${W-T/2},${y2} L${W-T/2},${y1+T} Z`;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H}
      style={{ display: "inline-block", verticalAlign: "middle", flexShrink: 0 }}
      aria-hidden="true">
      <path d={horiz(0)}      fill={a ? SEG_ON : SEG_OFF} />
      <path d={vertR(0, H/2)} fill={b ? SEG_ON : SEG_OFF} />
      <path d={vertR(H/2, H)} fill={c ? SEG_ON : SEG_OFF} />
      <path d={horiz(H)}      fill={d ? SEG_ON : SEG_OFF} />
      <path d={vertL(H/2, H)} fill={e ? SEG_ON : SEG_OFF} />
      <path d={vertL(0, H/2)} fill={f ? SEG_ON : SEG_OFF} />
      <path d={horiz(H/2)}    fill={g ? SEG_ON : SEG_OFF} />
    </svg>
  );
}

function LedPanel({ value, label, sublabel, digitSize = 38 }: {
  value: number; label: string; sublabel?: string; digitSize?: number;
}) {
  const [displayed, setDisplayed] = useState(value);
  const prevRef = useRef(value);

  useEffect(() => {
    if (value === prevRef.current) return;
    const start = prevRef.current;
    const end = value;
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
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.9rem" }}>
      <div
        style={{
          background: "#080808",
          border: "7px solid #1e1e1e",
          borderRadius: "7px",
          boxShadow: "inset 0 3px 12px rgba(0,0,0,0.9), 0 6px 28px rgba(0,0,0,0.7)",
          padding: "18px 18px 14px",
          display: "flex",
          alignItems: "center",
          gap: "2px",
          flexWrap: "nowrap",
          justifyContent: "center",
          width: "100%",
          overflow: "hidden",
        }}
        aria-label={`${label}: ${formatted}`}
      >
        {chars.map((ch, i) => (
          <SevenSegDigit key={i} char={ch} size={digitSize} />
        ))}
      </div>
      <div style={{
        fontFamily: "'Playfair Display', 'Times New Roman', Georgia, serif",
        color: "white", fontWeight: 700,
        fontSize: "clamp(0.75rem, 1.6vw, 1.15rem)",
        textTransform: "uppercase", letterSpacing: "0.05em",
        textAlign: "center", textShadow: "0 1px 4px rgba(0,0,0,0.6)", lineHeight: 1.3,
      }}>
        {label}
      </div>
      {sublabel && (
        <div style={{
          fontFamily: "'Playfair Display', 'Times New Roman', Georgia, serif",
          color: "rgba(255,255,255,0.65)",
          fontSize: "clamp(0.65rem, 1vw, 0.82rem)",
          fontStyle: "italic", textAlign: "center",
          textShadow: "0 1px 3px rgba(0,0,0,0.5)", marginTop: "-0.3rem",
        }}>
          {sublabel}
        </div>
      )}
    </div>
  );
}

interface DebtClockBillboardProps {
  remaining: number;
  payouts: number;
}

export function DebtClockBillboard({ remaining, payouts }: DebtClockBillboardProps) {
  return (
    <div style={{
      position: "relative",
      background: "linear-gradient(135deg, #1d7070 0%, #0f5252 35%, #0a3e3e 65%, #1d7070 100%)",
      borderRadius: "10px",
      overflow: "hidden",
      padding: "clamp(2rem, 5vw, 3.5rem) clamp(1.5rem, 4vw, 3rem) clamp(1.5rem, 4vw, 2.5rem)",
      boxShadow: "0 10px 50px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,255,255,0.12)",
      border: "4px solid #2e9090",
    }}>
      {/* Currency watermark */}
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='260' height='140' viewBox='0 0 260 140'%3E%3Cellipse cx='130' cy='70' rx='90' ry='55' fill='none' stroke='rgba(255,255,255,0.07)' stroke-width='2.5'/%3E%3Cellipse cx='130' cy='70' rx='60' ry='36' fill='none' stroke='rgba(255,255,255,0.04)' stroke-width='1.5'/%3E%3C/svg%3E")`,
        backgroundSize: "260px 140px",
        pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 80px, rgba(255,255,255,0.012) 80px, rgba(255,255,255,0.012) 81px)`,
        pointerEvents: "none",
      }} />

      <div style={{ position: "relative", zIndex: 1 }}>
        {/* Title */}
        <div style={{ textAlign: "center", marginBottom: "clamp(1.25rem, 3vw, 2rem)" }}>
          <div style={{
            fontFamily: "'Playfair Display', 'Times New Roman', Georgia, serif",
            color: "white", fontWeight: 900,
            fontSize: "clamp(1.1rem, 3.5vw, 2.4rem)",
            textTransform: "uppercase", letterSpacing: "0.05em",
            textShadow: "0 2px 10px rgba(0,0,0,0.7)", lineHeight: 1.15,
          }}>
            U.S. Asbestos Trust Fund System:
          </div>
        </div>

        {/* Two LED panels — digit size scales with viewport */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "clamp(0.75rem, 2.5vw, 2rem)",
          alignItems: "start",
        }}>
          <LedPanel
            value={remaining}
            label="Estimated Remaining Assets"
            sublabel="Range: $17.2B–$20B"
            digitSize={Math.round(window.innerWidth < 640 ? 22 : window.innerWidth < 900 ? 30 : 42)}
          />
          <LedPanel
            value={payouts}
            label="Cumulative Payouts Since 1988"
            sublabel="Across all active trusts"
            digitSize={Math.round(window.innerWidth < 640 ? 22 : window.innerWidth < 900 ? 30 : 42)}
          />
        </div>

        {/* Bottom branding */}
        <div style={{
          textAlign: "center",
          marginTop: "clamp(1.25rem, 3vw, 2rem)",
          fontFamily: "'Playfair Display', 'Times New Roman', Georgia, serif",
          color: "rgba(255,255,255,0.88)",
          fontSize: "clamp(0.85rem, 2vw, 1.25rem)",
          fontWeight: 700, letterSpacing: "0.14em",
          textTransform: "uppercase", textShadow: "0 1px 6px rgba(0,0,0,0.6)",
        }}>
          The Asbestos Trust Fund Clock
        </div>
      </div>
    </div>
  );
}

export { LedPanel as DebtClock };

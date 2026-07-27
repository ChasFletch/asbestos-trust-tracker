import { useEffect, useRef, useState } from "react";

interface DebtClockProps {
  value: number;
  label: string;
  prefix?: string;
  suffix?: string;
  description?: string;
}

function formatNumber(n: number): string {
  return Math.round(n).toLocaleString("en-US");
}

function DigitFlip({ char, prev }: { char: string; prev: string }) {
  const [animating, setAnimating] = useState(false);
  const prevRef = useRef(prev);

  useEffect(() => {
    if (char !== prevRef.current) {
      setAnimating(true);
      prevRef.current = char;
      const t = setTimeout(() => setAnimating(false), 380);
      return () => clearTimeout(t);
    }
  }, [char]);

  const isSep = char === "," || char === "." || char === "$" || char === "+" || char === "–" || char === "B" || char === " ";

  return (
    <span className={`digit-cell${isSep ? " separator" : ""}`}>
      <span className={`digit-flip${animating ? " animating" : ""}`}>{char}</span>
    </span>
  );
}

export function DebtClock({ value, label, prefix = "$", suffix = "", description }: DebtClockProps) {
  const [displayed, setDisplayed] = useState(value);
  const [prevStr, setPrevStr] = useState(prefix + formatNumber(value) + suffix);
  const prevRef = useRef(value);

  useEffect(() => {
    if (value === prevRef.current) return;
    // Animate count up/down over 1.2s
    const start = prevRef.current;
    const end = value;
    const duration = 1200;
    const startTime = performance.now();
    const raf = (time: number) => {
      const elapsed = time - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(start + (end - start) * eased);
      setDisplayed(current);
      if (progress < 1) requestAnimationFrame(raf);
      else prevRef.current = end;
    };
    requestAnimationFrame(raf);
  }, [value]);

  const currentStr = prefix + formatNumber(displayed) + suffix;

  const chars = currentStr.split("");
  const prevChars = prevStr.split("");
  // Pad to same length
  while (prevChars.length < chars.length) prevChars.unshift(" ");
  while (prevChars.length > chars.length) prevChars.shift();

  useEffect(() => {
    setPrevStr(currentStr);
  }, [currentStr]);

  return (
    <div className="flex flex-col items-center gap-3">
      <div
        className="digit-flip-container"
        style={{ fontSize: "clamp(1.6rem, 4vw, 3.6rem)", letterSpacing: "-0.02em", flexWrap: "wrap", justifyContent: "center" }}
        aria-label={`${label}: ${currentStr}`}
      >
        {chars.map((ch, i) => (
          <DigitFlip key={i} char={ch} prev={prevChars[i] ?? ch} />
        ))}
      </div>
      <div
        className="font-display uppercase tracking-widest text-muted-foreground"
        style={{ fontSize: "clamp(0.65rem, 1.5vw, 0.85rem)", letterSpacing: "0.2em" }}
      >
        {label}
      </div>
      {description && (
        <div className="text-xs text-muted-foreground/60 text-center max-w-xs">{description}</div>
      )}
    </div>
  );
}

type ClockFigureSummaryProps = {
  remaining: number;
  payouts: number;
  lastUpdated: string;
  documentedAssetTrusts: number;
  estimatedActiveTrusts: number;
  assetDataRange: string;
  compact?: boolean;
};

const currency = (value: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value);

const formatAsOfDate = (value: string) =>
  new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${value}T00:00:00Z`));

/**
 * Plain-text companion to the visual counter. It keeps the scope, coverage,
 * source-date range, and snapshot date connected to the figure for readers,
 * assistive technologies, and crawlers.
 */
export function ClockFigureSummary({
  remaining,
  payouts,
  lastUpdated,
  documentedAssetTrusts,
  estimatedActiveTrusts,
  assetDataRange,
  compact = false,
}: ClockFigureSummaryProps) {
  const coverage = `Documented floor: ${currency(remaining)} across ${documentedAssetTrusts} of roughly ${estimatedActiveTrusts} active trusts.`;
  const dateScope = `Snapshot refreshed ${formatAsOfDate(lastUpdated)}; underlying asset figures span ${assetDataRange}.`;

  if (compact) {
    return (
      <section
        aria-label="Clock figure context"
        className="mt-2 rounded border border-primary/15 bg-background/85 px-3 py-2 text-left shadow-sm"
      >
        <p className="text-xs leading-5 text-muted-foreground">
          <strong className="font-semibold text-foreground">{coverage}</strong>{" "}
          {dateScope} This is a documented floor, not an estimate of total assets.
        </p>
      </section>
    );
  }

  return (
    <section
      aria-labelledby="clock-figure-summary-title"
      className="mt-3 rounded-md border border-primary/15 bg-background/80 px-4 py-3 text-left shadow-sm"
    >
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
        <div className="min-w-0">
          <h2 id="clock-figure-summary-title" className="font-mono text-[0.68rem] uppercase tracking-[0.14em] text-primary">
            Current source-backed summary
          </h2>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">
            <strong className="font-semibold text-foreground">{coverage}</strong>{" "}
            {dateScope} The reported asset amount is a documented floor, not a total for the entire U.S. trust system.
          </p>
        </div>
        <dl className="grid shrink-0 grid-cols-2 gap-x-5 gap-y-1 border-t border-border pt-2 text-sm sm:border-l sm:border-t-0 sm:pl-5 sm:pt-0">
          <div>
            <dt className="text-xs text-muted-foreground">Documented assets floor</dt>
            <dd className="font-display text-lg font-semibold tabular-nums text-foreground">{currency(remaining)}</dd>
          </div>
          <div>
            <dt className="text-xs text-muted-foreground">Bottom-up payouts</dt>
            <dd className="font-display text-lg font-semibold tabular-nums text-foreground">{currency(payouts)}</dd>
          </div>
        </dl>
      </div>
      <p className="mt-2 border-t border-border pt-2 text-xs leading-5 text-muted-foreground">
        Payouts combine filed figures, qualified secondary references, and a clearly labeled residual estimate; see <a href="/methodology" className="font-medium text-primary underline underline-offset-2">methodology</a> for sources and limitations.
      </p>
    </section>
  );
}

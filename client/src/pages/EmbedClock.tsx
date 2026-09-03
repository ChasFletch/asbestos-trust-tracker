import { trpc } from "@/lib/trpc";
import { DebtClockBillboard } from "@/components/DebtClock";
import { ClockFigureSummary } from "@/components/ClockFigureSummary";
import { useSearch } from "wouter";

/**
 * Standalone embeddable clock page.
 * Renders just the clock with a "Powered by" attribution bar.
 * Supports ?variant=compact|full (default: full)
 */
export default function EmbedClock() {
  const search = useSearch();
  const params = new URLSearchParams(search);
  const variant = params.get("variant") ?? "full";
  const ref = params.get("ref") ?? "";

  const { data: agg } = trpc.aggregate.current.useQuery();
  const { data: figures } = trpc.trustFigures.summary.useQuery();
  const { data: allTrustFigures } = trpc.trustFigures.allTrusts.useQuery();

  const remaining = agg?.remainingLow ?? 16033489279;
  const remainingLow = agg?.remainingLow ?? 16033489279;
  const remainingHigh = agg?.remainingHigh ?? 22500000000;
  const paidOut = (agg as any)?.paidOutBottomUp ?? agg?.paidOut ?? 30033989206;
  const paidOutDocumented = (agg as any)?.paidOutDocumented ?? 19810476508;
  const paidOutEstimatedRemainder = (agg as any)?.paidOutEstimatedRemainder ?? 4189523492;
  const trustsWithCumulativePaidFiled = (agg as any)?.trustsWithCumulativePaidFiled ?? 14;
  const paidOutBottomUpFiled = (agg as any)?.paidOutBottomUpFiled ?? 19810476508;
  const paidOutBottomUpSecondary = (agg as any)?.paidOutBottomUpSecondary ?? 6671321145;
  const paidOutBottomUpResidual = (agg as any)?.paidOutBottomUpResidual ?? 3500000000;
  const lastUpdated = figures?.asOf ?? "2026-09-01";
  const topTrusts = figures?.topTrusts ?? [];

  const tf = allTrustFigures?.trusts ?? [];
  const documentedTrusts = tf
    .filter((t: any) => t.cumulativePaid != null)
    .sort((a: any, b: any) => b.cumulativePaid - a.cumulativePaid)
    .map((t: any) => ({ name: t.name, cumulativePaid: t.cumulativePaid, cumulativePaidAsOf: t.cumulativePaidAsOf ?? null }));
  const documentedAssetTrusts = tf.filter((t: any) => t.netAssets != null && t.status !== "closed");
  const assetYears = documentedAssetTrusts
    .map((t: any) => Number(t.assetsAsOf?.slice(0, 4)))
    .filter((year: number) => Number.isInteger(year));
  const assetDataRange = assetYears.length > 0
    ? `FY${Math.min(...assetYears)}–${Math.max(...assetYears)}`
    : "FY2021–2025";
  const estimatedActiveTrusts = (agg as any)?.totalActiveTrusts ?? 60;

  const isCompact = variant === "compact";
  const siteUrl = `https://asbestostrusts.org${ref ? `?ref=${encodeURIComponent(ref)}` : ""}`;

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      background: isCompact ? "#f7f5f0" : "#f7f5f0",
      padding: isCompact ? "12px" : "20px",
      fontFamily: "'Playfair Display', 'Times New Roman', Georgia, serif",
    }}>
      {/* Clock */}
      <div style={{ width: "100%", maxWidth: isCompact ? "480px" : "900px" }}>
        <DebtClockBillboard
          remaining={remaining}
          payouts={paidOut}
          remainingLow={isCompact ? undefined : remainingLow}
          remainingHigh={isCompact ? undefined : remainingHigh}
          lastUpdated={lastUpdated}
          topTrusts={isCompact ? undefined : topTrusts}
          paidOutDocumented={paidOutDocumented}
          paidOutEstimatedRemainder={paidOutEstimatedRemainder}
          trustsWithCumulativePaidFiled={trustsWithCumulativePaidFiled}
          documentedTrusts={isCompact ? [] : documentedTrusts}
          paidOutBottomUpFiled={paidOutBottomUpFiled}
          paidOutBottomUpSecondary={paidOutBottomUpSecondary}
          paidOutBottomUpResidual={paidOutBottomUpResidual}
        />
        <ClockFigureSummary
          remaining={remaining}
          payouts={paidOut}
          lastUpdated={lastUpdated}
          documentedAssetTrusts={documentedAssetTrusts.length || 43}
          estimatedActiveTrusts={estimatedActiveTrusts}
          assetDataRange={assetDataRange}
          compact
        />
      </div>

      {/* Attribution bar */}
      <div style={{
        marginTop: isCompact ? "10px" : "16px",
        padding: "8px 16px",
        background: "rgba(0,0,0,0.04)",
        borderRadius: "4px",
        border: "1px solid rgba(0,0,0,0.08)",
        display: "flex",
        alignItems: "center",
        gap: "8px",
        width: "100%",
        maxWidth: isCompact ? "480px" : "900px",
        justifyContent: "center",
      }}>
        <span style={{
          fontSize: "0.72rem",
          color: "#6b5c4c",
          letterSpacing: "0.02em",
        }}>
          Powered by
        </span>
        <a
          href={siteUrl}
          target="_blank"
          rel="noopener"
          style={{
            fontSize: "0.78rem",
            fontWeight: 700,
            color: "#8b4513",
            textDecoration: "none",
            letterSpacing: "0.03em",
          }}
        >
          AsbestosTrusts.org
        </a>
        <span style={{
          fontSize: "0.62rem",
          color: "#9b8b7b",
          fontStyle: "italic",
        }}>
          · Research by Danziger & De Llano, LLP
        </span>
      </div>
    </div>
  );
}

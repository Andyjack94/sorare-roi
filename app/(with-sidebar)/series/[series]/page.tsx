console.log("PAGE IS RUNNING ON:", typeof window === "undefined" ? "SERVER" : "CLIENT");

export const dynamic = "force-dynamic";

import { supabaseServer } from "@/lib/supabaseServer";
import { SERIES_LABELS, SERIES_RULES } from "@/lib/series-map";
import ProfitTable from "@/app/(with-sidebar)/charts/profit-table";

export default async function SeriesPage({
  params,
}: {
  params: Promise<{ series: string }>;
}) {
  const { series: slug } = await params;

  const rule =
    (SERIES_RULES as Record<string, (name: string) => boolean>)[slug];
  const label = SERIES_LABELS[slug];

  if (!rule || !label) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#0f172a",
          color: "white",
          padding: "3rem 1rem",
          textAlign: "center",
        }}
      >
        Unknown series: {slug}
      </div>
    );
  }

  // Fetch ALL rows
  const { data: transactions } = await supabaseServer
    .from("transactions")
    .select("*")
    .range(0, 50000);

  const normaliseComp = (value: any) =>
    (value ?? "")
      .toString()
      .normalize("NFKC")
      .replace(/\s+/g, " ")
      .trim()
      .toLowerCase();

  const matchCompetition = (row: any) => {
    const comp = normaliseComp(row.competition);
    if (!comp) return false;
    return rule(comp);
  };

  const seriesRows = (transactions ?? []).filter((row: any) =>
    matchCompetition(row)
  );

  // --- OVERALL PROFIT / LOSS ---
  const totalPurchaseValue = seriesRows
    .filter((r: any) => r.type === "purchase")
    .reduce((sum: number, r: any) => sum + (r.purchase_value ?? 0), 0);

  const totalSalesValue = seriesRows
    .filter((r: any) => r.type === "sale")
    .reduce((sum: number, r: any) => sum + (r.sale_value ?? 0), 0);

  const totalRewardValue = seriesRows
    .filter((r: any) => r.type === "reward")
    .reduce((sum: number, r: any) => sum + (r.sale_value ?? 0), 0);

  const overallPL = totalSalesValue + totalRewardValue - totalPurchaseValue;

  const roiPercent =
    totalPurchaseValue > 0
      ? (overallPL / totalPurchaseValue) * 100
      : 0;

  // --- Fetch view data ---
  const { data: profitData } = await supabaseServer
    .from("competition_gross_profit")
    .select("*");

  const { data: rewardsData } = await supabaseServer
    .from("competition_rewards")
    .select("*");

  const profitRows = (profitData ?? []).filter(matchCompetition);
  const rewardRows = (rewardsData ?? []).filter(matchCompetition);

  // --- LINE 2 STATS ---
  const purchaseRows = seriesRows.filter(
    (row: any) => row.type === "purchase" && (row.purchase_value ?? 0) > 0
  );

  const totalPurchases = purchaseRows.reduce(
    (sum: number, row: any) => sum + (row.purchase_value ?? 0),
    0
  );

  const totalRewards = rewardRows.reduce(
    (sum: number, row: any) => sum + (row.total_rewards ?? 0),
    0
  );

  // --- LINE 3 STATS ---
  const rewardsByCompetition: Record<string, number> = {};
  rewardRows.forEach((row: any) => {
    const name = row.competition ?? "Unknown";
    rewardsByCompetition[name] =
      (rewardsByCompetition[name] ?? 0) + (row.total_rewards ?? 0);
  });

  const topRewardCompetition = Object.entries(rewardsByCompetition).sort(
    (a, b) => b[1] - a[1]
  )[0];

  const profitByCompetition: Record<string, number> = {};
  profitRows.forEach((row: any) => {
    const name = row.competition ?? "Unknown";
    profitByCompetition[name] =
      (profitByCompetition[name] ?? 0) + (row.gross_profit ?? 0);
  });

  const bestPLCompetition = Object.entries(profitByCompetition).sort(
    (a, b) => b[1] - a[1]
  )[0];

  // --- Most expensive purchase + sale ---
  const mostExpensivePurchase = seriesRows
    .filter((r: any) => r.type === "purchase")
    .sort((a: any, b: any) => (b.purchase_value ?? 0) - (a.purchase_value ?? 0))[0];

  const mostExpensiveSale = seriesRows
    .filter((r: any) => r.type === "sale")
    .sort((a: any, b: any) => (b.sale_value ?? 0) - (a.sale_value ?? 0))[0];

  const getPLColor = (value: number) => {
    if (value > 0) return "#22c55e";
    if (value < 0) return "#ef4444";
    return "#94a3b8";
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0f172a",
        padding: "3rem 1rem",
        color: "white",
      }}
    >
      {/* Page Title */}
      <div
        style={{
          maxWidth: 900,
          margin: "0 auto 2.5rem auto",
          textAlign: "center",
        }}
      >
        <h1
          style={{
            fontSize: "2rem",
            fontWeight: 700,
            marginBottom: "0.5rem",
            color: "white",
          }}
        >
          {label} Overview
        </h1>

        <p
          style={{
            color: "#94a3b8",
            fontSize: "0.95rem",
            marginTop: "0.25rem",
          }}
        >
          Purchases, rewards, and performance for this series.
        </p>
      </div>

      {/* Content Grid */}
      <div
        style={{
          maxWidth: 900,
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          gap: "2rem",
        }}
      >
        {/* OVERALL P/L */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "1.5rem" }}>
          <StatCard
            label="Overall P/L"
            value={overallPL}
            sublabel={`${roiPercent.toFixed(2)}% ROI`}
            valueColor={getPLColor(overallPL)}
          />
        </div>

        {/* Purchases + Rewards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "1.5rem",
          }}
        >
          <StatCard label="Purchases" value={totalPurchases} />
          <StatCard label="Rewards" value={totalRewards} />
        </div>

        {/* Top competitions */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "1.5rem",
          }}
        >
          <StatCard
            label="Top Competition (Rewards)"
            value={topRewardCompetition?.[1] ?? 0}
            sublabel={topRewardCompetition?.[0] ?? "—"}
          />

          <StatCard
            label="Best P/L Competition"
            value={bestPLCompetition?.[1] ?? 0}
            sublabel={bestPLCompetition?.[0] ?? "—"}
          />
        </div>

        {/* Most expensive purchase + sale */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "1.5rem",
          }}
        >
          <StatCard
            label="Most Expensive Purchase"
            value={mostExpensivePurchase?.purchase_value ?? 0}
            sublabel={mostExpensivePurchase?.player_name ?? "—"}
          />

          <StatCard
            label="Most Expensive Sale"
            value={mostExpensiveSale?.sale_value ?? 0}
            sublabel={mostExpensiveSale?.player_name ?? "—"}
          />
        </div>

        {/* TABLE */}
        <div className="dark-table-container">
          <ProfitTable data={profitRows} />
        </div>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  sublabel,
  valueColor,
}: {
  label: string;
  value: number;
  sublabel?: string;
  valueColor?: string;
}) {
  return (
    <div
      style={{
        padding: "1.5rem",
        borderRadius: "12px",
        background: "#1e293b",
        border: "1px solid #334155",
        textAlign: "center",
      }}
    >
      <div
        style={{
          fontSize: "1rem",
          fontWeight: 600,
          marginBottom: "0.5rem",
          color: "#e2e8f0",
        }}
      >
        {label}
      </div>

      <div
        style={{
          fontSize: "1.8rem",
          fontWeight: 700,
          color: valueColor ?? "white",
        }}
      >
        £{value.toFixed(2)}
      </div>

      {sublabel && (
        <div
          style={{
            marginTop: "0.5rem",
            color: "#94a3b8",
            fontWeight: 600,
          }}
        >
          {sublabel}
        </div>
      )}
    </div>
  );
}

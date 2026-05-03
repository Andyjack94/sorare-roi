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
    return <div style={{ padding: "2rem", textAlign: "center" }}>Unknown series: {slug}</div>;
  }

  // ⭐ Fetch ALL rows using server client
  const { data: transactions } = await supabaseServer
    .from("transactions")
    .select("*")
    .range(0, 50000);

  console.log("TOTAL TRANSACTIONS RECEIVED:", transactions?.length);

  // Normalise competition
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

  // ⭐ Filter rows belonging to this series
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

  // ⭐ NEW: Most expensive purchase + sale
  const mostExpensivePurchase = seriesRows
    .filter((r: any) => r.type === "purchase")
    .sort((a: any, b: any) => (b.purchase_value ?? 0) - (a.purchase_value ?? 0))[0];

  const mostExpensiveSale = seriesRows
    .filter((r: any) => r.type === "sale")
    .sort((a: any, b: any) => (b.sale_value ?? 0) - (a.sale_value ?? 0))[0];

  // ⭐ Colour coding for P/L text only
  const getPLColor = (value: number) => {
    if (value > 0) return "#0f8a3f";   // green
    if (value < 0) return "#b32020";   // red
    return "#444444";                  // neutral grey
  };

  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <h1
        style={{
          fontSize: "2rem",
          fontWeight: 700,
          marginBottom: "2rem",
          color: "black",
          textAlign: "center",
        }}
      >
        {label} Overview
      </h1>

      {/* ⭐ TOP LINE: OVERALL P/L ONLY */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr",
          gap: "1.5rem",
          marginBottom: "2rem",
          textAlign: "center",
        }}
      >
        <StatCard
          label="Overall P/L"
          value={overallPL}
          sublabel={`${roiPercent.toFixed(2)}% ROI`}
          valueColor={getPLColor(overallPL)}
        />
      </div>

      {/* ⭐ SECOND LINE: Purchases + Rewards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "1.5rem",
          marginBottom: "2rem",
          textAlign: "center",
        }}
      >
        <StatCard label="Purchases" value={totalPurchases} />
        <StatCard label="Rewards" value={totalRewards} />
      </div>

      {/* ⭐ THIRD LINE: Top competition + Best P/L */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "1.5rem",
          marginBottom: "2rem",
          textAlign: "center",
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

      {/* ⭐ FOURTH LINE: Most expensive purchase + sale */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "1.5rem",
          marginBottom: "2rem",
          textAlign: "center",
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
      <ProfitTable data={profitRows} />
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
        borderRadius: "8px",
        background: "white",
        border: "1px solid #ddd",
        textAlign: "center",
      }}
    >
      <div style={{ fontSize: "1rem", fontWeight: 600, marginBottom: "0.5rem" }}>
        {label}
      </div>

      <div
        style={{
          fontSize: "1.8rem",
          fontWeight: 700,
          color: valueColor ?? "black",
        }}
      >
        £{value.toFixed(2)}
      </div>

      {sublabel && (
        <div
          style={{
            marginTop: "0.5rem",
            color: valueColor ?? "#555",
            fontWeight: 600,
          }}
        >
          {sublabel}
        </div>
      )}
    </div>
  );
}

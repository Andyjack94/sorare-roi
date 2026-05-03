import { supabaseServer } from "@/lib/supabaseServer";

export const dynamic = "force-dynamic";

type YearStats = {
  overall_pl: number | null;
  total_purchases: number | null;
  total_sales: number | null;
  total_rewards: number | null;
  total_cards_purchased: number | null;
  total_player_rewards: number | null;
  top_purchase_player: string | null;
  top_purchase_card: string | null;
  top_purchase_value: number | null;
  top_sale_player: string | null;
  top_sale_card: string | null;
  top_sale_value: number | null;
};

export default async function YearPage({
  params,
}: {
  params: Promise<{ year: string }>;
}) {
  // ⭐ Next.js 15/16: params is a Promise
  const { year: yearString } = await params;

  const year = parseInt(yearString, 10);

  if (Number.isNaN(year)) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        Invalid year in URL.
      </div>
    );
  }

  const { data, error } = (await supabaseServer.rpc(
    "year_breakdown_stats",
    { year_input: year }
  )) as { data: YearStats[] | null; error: any };

  if (error) {
    console.error("RPC ERROR:", error);
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        Error loading stats.
      </div>
    );
  }

  const stats = data?.[0];

  if (!stats) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        No data found for {year}.
      </div>
    );
  }

  const safe = (v: number | null | undefined) => Number(v ?? 0);

  const overallPL = safe(stats.overall_pl);
  const totalPurchases = safe(stats.total_purchases);
  const totalSales = safe(stats.total_sales);
  const totalRewards = safe(stats.total_rewards);
  const totalCardsPurchased = safe(stats.total_cards_purchased);
  const totalPlayerRewards = safe(stats.total_player_rewards);
  const topPurchaseValue = safe(stats.top_purchase_value);
  const topSaleValue = safe(stats.top_sale_value);

  const roiPercent =
    totalPurchases > 0 ? (overallPL / totalPurchases) * 100 : 0;

  const getPLColor = (value: number) => {
    if (value > 0) return "#0f8a3f";
    if (value < 0) return "#b32020";
    return "#444444";
  };

  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <h1
        style={{
          fontSize: "2rem",
          fontWeight: 700,
          marginBottom: "2rem",
          color: "black",
        }}
      >
        Year Breakdown — {year}
      </h1>

      {/* TOP LINE: OVERALL P/L */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr",
          gap: "1.5rem",
          marginBottom: "2rem",
        }}
      >
        <StatCard
          label="Overall P/L"
          value={overallPL}
          sublabel={`${roiPercent.toFixed(2)}% ROI`}
          valueColor={getPLColor(overallPL)}
        />
      </div>

      {/* SECOND LINE: Purchases / Sales / Rewards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gap: "1.5rem",
          marginBottom: "2rem",
        }}
      >
        <StatCard label="Total Purchases" value={totalPurchases} />
        <StatCard label="Total Sales" value={totalSales} />
        <StatCard label="Total Rewards" value={totalRewards} />
      </div>

      {/* THIRD LINE: Counts (PLAIN NUMBERS) */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "1.5rem",
          marginBottom: "2rem",
        }}
      >
        <StatCard
          label="Cards Purchased"
          value={totalCardsPurchased}
          plainNumber={true}
        />
        <StatCard
          label="Player Rewards"
          value={totalPlayerRewards}
          plainNumber={true}
        />
      </div>

      {/* FOURTH LINE: Most expensive purchase + sale */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "1.5rem",
          marginBottom: "2rem",
        }}
      >
        <StatCard
          label="Most Expensive Purchase"
          value={topPurchaseValue}
          sublabel={stats.top_purchase_player ?? "—"}
        />

        <StatCard
          label="Most Expensive Sale"
          value={topSaleValue}
          sublabel={stats.top_sale_player ?? "—"}
        />
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  sublabel,
  valueColor,
  plainNumber = false,
}: {
  label: string;
  value: number;
  sublabel?: string;
  valueColor?: string;
  plainNumber?: boolean;
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
        {plainNumber ? value : `£${value.toFixed(2)}`}
      </div>

      {!plainNumber && sublabel && (
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

import { supabaseServer } from "@/server/supabaseServer";

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

  // NEW FIELDS
  total_deposits: number | null;
  total_withdrawals: number | null;
};

export default async function YearPage({
  params,
}: {
  params: Promise<{ year: string }>;
}) {
  const { year: yearString } = await params;
  const year = parseInt(yearString, 10);

  if (Number.isNaN(year)) {
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
        Invalid year in URL.
      </div>
    );
  }

  const { data, error } = (await supabaseServer.rpc("year_breakdown_stats", {
    year_input: year,
  })) as { data: YearStats[] | null; error: any };

  if (error) {
    console.error("RPC ERROR:", error);
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
        Error loading stats.
      </div>
    );
  }

  const stats = data?.[0];

  if (!stats) {
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

  // NEW SAFE VALUES
  const totalDeposits = safe(stats.total_deposits);
  const totalWithdrawals = safe(stats.total_withdrawals);

  const roiPercent =
    totalPurchases > 0 ? (overallPL / totalPurchases) * 100 : 0;

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
          Year Breakdown — {year}
        </h1>

        <p
          style={{
            color: "#94a3b8",
            fontSize: "0.95rem",
            marginTop: "0.25rem",
          }}
        >
          Performance, purchases, sales, and rewards for the year.
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

        {/* Purchases / Sales / Rewards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: "1.5rem",
          }}
        >
          <StatCard label="Total Purchases" value={totalPurchases} />
          <StatCard label="Total Sales" value={totalSales} />
          <StatCard label="Total Rewards" value={totalRewards} />
        </div>

        {/* Counts */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "1.5rem",
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

        {/* Most Expensive Purchase / Sale */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "1.5rem",
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

        {/* Deposits / Withdrawals */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "1.5rem",
          }}
        >
          <StatCard label="Deposits" value={totalDeposits} />
          <StatCard label="Withdrawals" value={totalWithdrawals} />
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
        {plainNumber ? value : `£${value.toFixed(2)}`}
      </div>

      {!plainNumber && sublabel && (
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

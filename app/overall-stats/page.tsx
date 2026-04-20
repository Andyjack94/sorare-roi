// SERVER COMPONENT
import { supabase } from "@/lib/supabaseClient";

export default async function OverallStatsPage() {
  const { data, error } = await supabase
    .from("overall_stats")
    .select("*")
    .single();

  if (error) {
    console.error("Stats error:", error);
  }

  const {
    total_rewards = 0,
    total_purchases = 0,
    total_sales = 0,
    total_player_rewards = 0,
    current_gallery_value = 0,
    overall_profit = 0,
    total_current_cards = 0, // ⭐ NEW FIELD
  } = data || {};

  const cardStyle = {
    background: "white",
    padding: "1.5rem",
    borderRadius: "8px",
    boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
    color: "black",
  };

  const numberStyle = {
    fontSize: "2rem",
    fontWeight: 700,
    marginTop: "0.5rem",
    color: "black",
  };

  return (
    <div style={{ padding: "2rem", color: "black" }}>
      <h1 style={{ fontSize: "2rem", fontWeight: 700, marginBottom: "2rem" }}>
        Overall Stats
      </h1>

      {/* ⭐ TOP-LINE OVERALL PROFIT */}
      <div style={{ ...cardStyle, marginBottom: "2rem" }}>
        <div>Overall Profit / Loss</div>

        <div
          style={{
            ...numberStyle,
            color: overall_profit >= 0 ? "green" : "red",
            display: "flex",
            alignItems: "baseline",
            gap: "0.5rem",
          }}
        >
          £{overall_profit.toFixed(2)}

          {/* ⭐ ROI PERCENTAGE */}
          {total_purchases > 0 && (
            <span style={{ fontSize: "1.2rem", fontWeight: 600, color: "black" }}>
              ({((overall_profit / total_purchases) * 100).toFixed(2)}%)
            </span>
          )}
        </div>
      </div>

      {/* KPI CARDS */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "1.5rem",
        }}
      >
        <div style={cardStyle}>
          <div>Total Rewards</div>
          <div style={numberStyle}>£{total_rewards.toFixed(2)}</div>
        </div>

        <div style={cardStyle}>
          <div>Total Purchases</div>
          <div style={numberStyle}>£{total_purchases.toFixed(2)}</div>
        </div>

        <div style={cardStyle}>
          <div>Total Sales</div>
          <div style={numberStyle}>£{total_sales.toFixed(2)}</div>
        </div>

        <div style={cardStyle}>
          <div>Current Gallery Purchased Value</div>
          <div style={numberStyle}>£{current_gallery_value.toFixed(2)}</div>
        </div>
      </div>

      {/* ⭐ NEW ROW: CURRENT CARDS + PLAYER REWARDS */}
      <div
        style={{
          marginTop: "2rem",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "1.5rem",
        }}
      >
        <div style={cardStyle}>
          <div>Total Current Cards</div>
          <div style={numberStyle}>{total_current_cards}</div>
        </div>

        <div style={cardStyle}>
          <div>Total Player Rewards</div>
          <div style={numberStyle}>{total_player_rewards}</div>
        </div>
      </div>
    </div>
  );
}

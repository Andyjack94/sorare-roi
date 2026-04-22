// SERVER COMPONENT
export const dynamic = "force-dynamic";

import { supabase } from "@/lib/supabaseClient";
import type { CSSProperties } from "react";

export default async function OverallStatsPage() {
  const { data, error } = await supabase
    .from("overall_stats")
    .select("*")
    .single();

  if (error) {
    console.error("Stats error:", error);
  }

  // Safely coerce all values to numbers (safe-cast version)
  const total_rewards = Number((data as any)?.total_rewards ?? 0);
  const total_purchases = Number((data as any)?.total_purchases ?? 0);
  const total_sales = Number((data as any)?.total_sales ?? 0);
  const total_player_rewards = Number((data as any)?.total_player_rewards ?? 0);
  const current_gallery_value = Number((data as any)?.current_gallery_value ?? 0);
  const overall_profit = Number((data as any)?.overall_profit ?? 0);
  const total_current_cards = Number((data as any)?.total_current_cards ?? 0);
  const pl_on_card_purchases = Number((data as any)?.pl_on_card_purchases ?? 0);

  // Withdrawals P/L
  const pl_withdrawals = Number((data as any)?.withdrawal ?? 0);

  // Scarcity counts
  const total_limited = Number((data as any)?.total_limited ?? 0);
  const total_rare = Number((data as any)?.total_rare ?? 0);
  const total_super_rare = Number((data as any)?.total_super_rare ?? 0);
  const total_unique = Number((data as any)?.total_unique ?? 0);

  // Typed styles
  const cardStyle: CSSProperties = {
    background: "white",
    padding: "1.2rem",
    borderRadius: "8px",
    boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
    color: "black",
    textAlign: "center",
  };

  const titleStyle: CSSProperties = {
    minHeight: "2.2rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 500,
  };

  const numberStyle: CSSProperties = {
    fontSize: "1.8rem",
    fontWeight: 700,
    marginTop: "0.5rem",
    color: "black",
    textAlign: "center",
  };

  return (
    <div
      style={{
        padding: "2rem",
        color: "black",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <h1 style={{ fontSize: "2rem", fontWeight: 700, marginBottom: "2rem", textAlign: "center" }}>
        Overall Stats
      </h1>

      {/* ⭐ TOP-LINE OVERALL PROFIT + WITHDRAWALS */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "1.5rem",
          marginBottom: "2rem",
          width: "100%",
          maxWidth: "900px",
        }}
      >
        <div style={cardStyle}>
          <div style={titleStyle}>Overall Profit / Loss on Sorare</div>

          <div
            style={{
              ...numberStyle,
              color: overall_profit >= 0 ? "green" : "red",
              display: "flex",
              justifyContent: "center",
              alignItems: "baseline",
              gap: "0.5rem",
            }}
          >
            £{overall_profit.toFixed(2)}

            {total_purchases > 0 && (
              <span style={{ fontSize: "1.1rem", fontWeight: 600, color: "black" }}>
                ({((overall_profit / total_purchases) * 100).toFixed(2)}%)
              </span>
            )}
          </div>
        </div>

        <div style={cardStyle}>
          <div style={titleStyle}>Overall Profit / Loss Withdrawals</div>

          <div
            style={{
              ...numberStyle,
              color: pl_withdrawals < 0 ? "green" : "red",
            }}
          >
            £{pl_withdrawals.toFixed(2)}
          </div>
        </div>
      </div>

      {/* ⭐ KPI CARDS */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, minmax(150px, 1fr))",
          gap: "1rem",
          width: "100%",
          maxWidth: "900px",
        }}
      >
        <div style={cardStyle}>
          <div style={titleStyle}>Total Rewards</div>
          <div style={numberStyle}>£{total_rewards.toFixed(2)}</div>
        </div>

        <div style={cardStyle}>
          <div style={titleStyle}>Total Purchases</div>
          <div style={numberStyle}>£{total_purchases.toFixed(2)}</div>
        </div>

        <div style={cardStyle}>
          <div style={titleStyle}>Total Sales</div>
          <div style={numberStyle}>£{total_sales.toFixed(2)}</div>
        </div>

        <div style={cardStyle}>
          <div style={titleStyle}>Current Gallery Purchased Value</div>
          <div style={numberStyle}>£{current_gallery_value.toFixed(2)}</div>
        </div>
      </div>

      {/* ⭐ CURRENT CARDS + PLAYER REWARDS */}
      <div
        style={{
          marginTop: "2rem",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "1.5rem",
          width: "100%",
          maxWidth: "900px",
        }}
      >
        <div style={cardStyle}>
          <div style={titleStyle}>Total Current Cards</div>
          <div style={numberStyle}>{total_current_cards}</div>
        </div>

        <div style={cardStyle}>
          <div style={titleStyle}>Total Player Rewards</div>
          <div style={numberStyle}>{total_player_rewards}</div>
        </div>
      </div>

      {/* ⭐ TOTAL PLAYERS OWNED BY SCARCITY */}
      <div
        style={{
          marginTop: "2rem",
          background: "white",
          padding: "1.5rem",
          borderRadius: "8px",
          boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
          color: "black",
          width: "100%",
          maxWidth: "900px",
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontSize: "1.4rem",
            fontWeight: 700,
            marginBottom: "1.5rem",
            textAlign: "center",
          }}
        >
          Total Players Owned
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            textAlign: "center",
            gap: "1rem",
          }}
        >
          <div>
            <div style={{ color: "#FFD700", fontWeight: 600 }}>Limited</div>
            <div style={{ fontSize: "1.6rem", fontWeight: 700 }}>{total_limited}</div>
          </div>

          <div>
            <div style={{ color: "red", fontWeight: 600 }}>Rare</div>
            <div style={{ fontSize: "1.6rem", fontWeight: 700 }}>{total_rare}</div>
          </div>

          <div>
            <div style={{ color: "#00BFFF", fontWeight: 600 }}>Super Rare</div>
            <div style={{ fontSize: "1.6rem", fontWeight: 700 }}>{total_super_rare}</div>
          </div>

          <div>
            <div style={{ color: "#111", fontWeight: 600, fontFamily: "Georgia, serif" }}>
              Unique
            </div>
            <div style={{ fontSize: "1.6rem", fontWeight: 700 }}>{total_unique}</div>
          </div>
        </div>
      </div>

      {/* ⭐ FINAL ROW: P/L ON CARD PURCHASES */}
      <div
        style={{
          marginTop: "2rem",
          width: "100%",
          maxWidth: "900px",
        }}
      >
        <div style={cardStyle}>
          <div style={titleStyle}>P/L on Card Purchases</div>
          <div
            style={{
              ...numberStyle,
              color: pl_on_card_purchases >= 0 ? "green" : "red",
            }}
          >
            £{pl_on_card_purchases.toFixed(2)}
          </div>
        </div>
      </div>
    </div>
  );
}

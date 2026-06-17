import { supabase } from "@/lib/supabaseClient";
import type { CSSProperties } from "react";

export default async function SorareSetsOverview() {
  const client = supabase as any;

  const { data: entries } = await client.from("sorare_sets").select("*");

  const rewards = entries?.filter((e: any) => e.type === "Reward") || [];
  const purchases = entries?.filter((e: any) => e.type === "Purchase") || [];

  const totalRewardsValue = rewards.reduce((sum: number, r: any) => sum + r.value, 0);
  const cashWins = rewards.length;
  const moneySpent = purchases.reduce((sum: number, p: any) => sum + p.value, 0);

  const setsMap: Record<string, { rewards: number; purchases: number }> = {};
  entries?.forEach((e: any) => {
    if (!setsMap[e.set]) setsMap[e.set] = { rewards: 0, purchases: 0 };
    if (e.type === "Reward") setsMap[e.set].rewards += e.value;
    if (e.type === "Purchase") setsMap[e.set].purchases += e.value;
  });

  const sets = Object.entries(setsMap);

  // UPDATED HEADER STYLE (bigger, cleaner)
  const titleStyle: CSSProperties = {
    minHeight: "2.4rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 650,
    fontSize: "1.25rem",
    color: "white",
  };

  // SAME NUMBER STYLE
  const numberStyle: CSSProperties = {
    fontSize: "1.8rem",
    fontWeight: 700,
    marginTop: "0.5rem",
    textAlign: "center",
  };

  // SAME CARD STYLE
  const cardStyle: CSSProperties = {
    background: "#1e293b",
    border: "1px solid #334155",
    padding: "1.2rem",
    borderRadius: "12px",
    color: "white",
    textAlign: "center",
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0f172a",
        padding: "0.8rem 1rem", // 🔥 Reduced gap above toggle switches
        color: "white",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >

      {/* ⭐ REWARDS WON BANNER */}
      <div
        style={{
          ...cardStyle,
          width: "100%",
          maxWidth: "900px",
          marginBottom: "2rem",
        }}
      >
        <div style={titleStyle}>Rewards Won</div>

        <div
          style={{
            ...numberStyle,
            color: totalRewardsValue >= 0 ? "#22c55e" : "#ef4444",
          }}
        >
          £{totalRewardsValue.toFixed(2)}
        </div>
      </div>

      {/* ⭐ KPI CARDS */}
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
          <div style={titleStyle}>Cash Wins</div>
          <div style={numberStyle}>{cashWins}</div>
        </div>

        <div style={cardStyle}>
          <div style={titleStyle}>Money Spent</div>
          <div style={numberStyle}>£{moneySpent.toFixed(2)}</div>
        </div>
      </div>

      {/* ⭐ SET BREAKDOWN TABLE */}
      <div
        style={{
          ...cardStyle,
          width: "100%",
          maxWidth: "900px",
          padding: "1.5rem",
        }}
      >
        <h3
          style={{
            fontSize: "1.4rem",
            fontWeight: 700,
            marginBottom: "1rem",
            textAlign: "center",
          }}
        >
          Set Breakdown
        </h3>

        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            textAlign: "center", // 🔥 Centre table text
          }}
        >
          <thead>
            <tr style={{ borderBottom: "1px solid #334155" }}>
              <th style={{ padding: "0.5rem" }}>Set</th>
              <th style={{ padding: "0.5rem" }}>Rewards (£)</th>
              <th style={{ padding: "0.5rem" }}>Purchases (£)</th>
            </tr>
          </thead>

          <tbody>
            {sets.map(([setName, values]) => (
              <tr key={setName} style={{ borderBottom: "1px solid #334155" }}>
                <td style={{ padding: "0.5rem" }}>{setName}</td>
                <td style={{ padding: "0.5rem" }}>
                  £{values.rewards.toFixed(2)}
                </td>
                <td style={{ padding: "0.5rem" }}>
                  £{values.purchases.toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

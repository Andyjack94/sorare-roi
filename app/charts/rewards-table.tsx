"use client";

import React from "react";
import { RewardRow } from "@/types/types";

export default function RewardsTable({ data }: { data: RewardRow[] }) {
  const cell: React.CSSProperties = { padding: "0.5rem", textAlign: "center" };

  return (
    <div>
      <h2 style={{ marginBottom: "1rem", color: "black" }}>Rewards Table</h2>

      <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "center" }}>
        <thead>
          <tr style={{ background: "#f3f4f6" }}>
            <th style={cell}>Competition</th>
            <th style={cell}>Total Rewards (£)</th>
          </tr>
        </thead>

        <tbody>
          {data.map((row, i) => (
            <tr key={i} style={{ background: i % 2 === 0 ? "#fff" : "#fafafa" }}>
              <td style={cell}>{row.competition ?? "Unknown"}</td>
              <td style={{ ...cell, fontWeight: 600 } as React.CSSProperties}>
                £{Number(row.total_rewards ?? 0).toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

"use client";

import React from "react";
import { RewardRow } from "@/types/types";

export default function RewardsTable({ data }: { data: RewardRow[] }) {
  const cell: React.CSSProperties = { padding: "0.5rem", textAlign: "center" };

  return (
    <div>
      {/* Updated title */}
      <h2
        style={{
          marginBottom: "1rem",
          color: "white",
          textAlign: "center",
          fontSize: "1.4rem",
          fontWeight: 700,
        }}
      >
        Rewards Table
      </h2>

      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          textAlign: "center",
        }}
      >
        <thead>
          <tr style={{ background: "#273449" }}>
            <th style={{ ...cell, color: "white" }}>Competition</th>
            <th style={{ ...cell, color: "white" }}>Total Rewards (£)</th>
          </tr>
        </thead>

        <tbody>
          {data.map((row, i) => (
            <tr
              key={i}
              style={{
                background: i % 2 === 0 ? "#1a2433" : "#16202c",
                color: "white",
              }}
            >
              <td style={cell}>{row.competition ?? "Unknown"}</td>
              <td style={{ ...cell, fontWeight: 600 }}>
                £{Number(row.total_rewards ?? 0).toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

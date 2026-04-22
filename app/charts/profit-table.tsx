"use client";

import { ProfitTableRow } from "@/types/types";
import React from "react";

export default function ProfitTable({ data }: { data: ProfitTableRow[] }) {
  const extractYear = (competition: string | null) => {
    if (!competition) return null;

    const fourDigit = competition.match(/(20\d{2})$/);
    if (fourDigit) return Number(fourDigit[1]);

    const season = competition.match(/(\d{2})\/\d{2}$/);
    if (season) return Number("20" + season[1]);

    return null;
  };

  const rows = data.map((row) => ({
    ...row,
    year: extractYear(row.competition ?? null),
  }));

  const sorted = rows.sort((a, b) => {
    if (a.competition === "Non Card Entry") return 1;
    if (b.competition === "Non Card Entry") return -1;

    const yearA = a.year;
    const yearB = b.year;

    if (yearA !== null && yearB !== null) {
      if (yearA !== yearB) return yearB - yearA;
      return (a.competition ?? "").localeCompare(b.competition ?? "");
    }

    if (yearA !== null && yearB === null) return -1;
    if (yearA === null && yearB !== null) return 1;

    return (a.competition ?? "").localeCompare(b.competition ?? "");
  });

  const cell: React.CSSProperties = { padding: "0.5rem", textAlign: "center" };

  return (
    <div>
      <h2 style={{ marginBottom: "1rem", color: "black" }}>Gross Profit Table</h2>

      <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "center" }}>
        <thead>
          <tr style={{ background: "#f3f4f6" }}>
            <th style={cell}>Competition</th>
            <th style={cell}>Gross Profit (£)</th>
          </tr>
        </thead>

        <tbody>
          {sorted.map((row, i) => (
            <tr key={i} style={{ background: i % 2 === 0 ? "#fff" : "#fafafa" }}>
              <td style={cell}>{row.competition ?? "Unknown"}</td>
              <td style={{ ...cell, fontWeight: 600 } as React.CSSProperties}>
                £{Number(row.gross_profit ?? 0).toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

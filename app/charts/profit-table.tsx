"use client";

import { ProfitTableRow } from "@/types/types";

export default function ProfitTable({ data }: { data: ProfitTableRow[] }) {
  // Extract year from competition string
  const rows = data.map((row) => {
    const match = row.competition.match(/(\d{4})/);
    return {
      ...row,
      year: match ? Number(match[1]) : null,
    };
  });

  // Sort: newest year first, then alphabetical, then no-year at bottom
  const sorted = rows.sort((a, b) => {
    if (a.year && b.year) return b.year - a.year;
    if (a.year && !b.year) return -1;
    if (!a.year && b.year) return 1;
    return a.competition.localeCompare(b.competition);
  });

  return (
    <div>
      <h2 style={{ marginBottom: "1rem", color: "black" }}>Gross Profit Table</h2>

      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ background: "#f3f4f6" }}>
            <th style={{ padding: "0.5rem" }}>Competition</th>
            <th style={{ padding: "0.5rem" }}>Year</th>
            <th style={{ padding: "0.5rem" }}>Gross Profit (£)</th>
          </tr>
        </thead>

        <tbody>
          {sorted.map((row, i) => (
            <tr key={i} style={{ background: i % 2 === 0 ? "#fff" : "#fafafa" }}>
              <td style={{ padding: "0.5rem" }}>{row.competition}</td>
              <td style={{ padding: "0.5rem" }}>{row.year ?? ""}</td>
              <td style={{ padding: "0.5rem", fontWeight: 600 }}>
                £{Number(row.gross_profit).toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

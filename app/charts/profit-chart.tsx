"use client";

import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

export default function ProfitChart({ data }) {
  const labels = data.map((d) => d.competition);
  const values = data.map((d) => Number(d.gross_profit));

  return (
    <div
      style={{
        background: "white",
        padding: "1.5rem",
        borderRadius: "8px",
        boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
      }}
    >
      <h2 style={{ fontSize: "1.3rem", fontWeight: 600, marginBottom: "1rem" }}>
        Gross Profit Chart
      </h2>

      <Bar
        data={{
          labels,
          datasets: [
            {
              label: "Gross Profit (£)",
              data: values,
              backgroundColor: "rgba(75, 192, 192, 0.6)",
              borderColor: "rgba(75, 192, 192, 1)",
              borderWidth: 1,
            },
          ],
        }}
        options={{
          responsive: true,
          plugins: {
            legend: { display: false },
          },
          scales: {
            y: { beginAtZero: true },
          },
        }}
      />
    </div>
  );
}

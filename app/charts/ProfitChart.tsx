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
import { ProfitRow } from "@/types/types";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

export default function ProfitChart({ data }: { data: ProfitRow[] }) {
  const labels = data.map((d) => d.competition);
  const values = data.map((d) => Number(d.gross_profit));

  const chartData = {
    labels,
    datasets: [
      {
        label: "Gross Profit (£)",
        data: values,
        backgroundColor: "#3b82f6",
      },
    ],
  };

  return (
    <div>
      <h2 style={{ marginBottom: "1rem", color: "black" }}>Gross Profit by Competition</h2>
      <Bar data={chartData} />
    </div>
  );
}

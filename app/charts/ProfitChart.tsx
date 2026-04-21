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
  // Extract year from competition string
  const extractYear = (competition: string) => {
    if (!competition) return -1;

    // Match 4-digit year at end (e.g., 2026)
    const fourDigit = competition.match(/(20\d{2})$/);
    if (fourDigit) return Number(fourDigit[1]);

    // Match season format like 24/25 → treat as 2024
    const season = competition.match(/(\d{2})\/\d{2}$/);
    if (season) return Number("20" + season[1]);

    return -1; // No year found
  };

  // ⭐ SORTING LOGIC
  const sorted = [...data].sort((a, b) => {
    // Force "Non Card Entry" to bottom
    if (a.competition === "Non Card Entry") return 1;
    if (b.competition === "Non Card Entry") return -1;

    const yearA = extractYear(a.competition);
    const yearB = extractYear(b.competition);

    // If both have years → sort by year DESC
    if (yearA !== -1 && yearB !== -1) {
      if (yearA !== yearB) return yearB - yearA;
      return a.competition.localeCompare(b.competition);
    }

    // If only A has year → A comes first
    if (yearA !== -1 && yearB === -1) return -1;

    // If only B has year → B comes first
    if (yearA === -1 && yearB !== -1) return 1;

    // Neither has year → alphabetical
    return a.competition.localeCompare(b.competition);
  });

  const labels = sorted.map((d) => d.competition);
  const values = sorted.map((d) => Number(d.gross_profit));

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
      <h2 style={{ marginBottom: "1rem", color: "black" }}>
        Gross Profit by Competition
      </h2>
      <Bar data={chartData} />
    </div>
  );
}

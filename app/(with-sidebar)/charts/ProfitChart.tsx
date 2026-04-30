"use client";

import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  Title,
} from "chart.js";
import { ProfitRow } from "@/types/types";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend, Title);

export default function ProfitChart({ data }: { data: ProfitRow[] }) {
  const filtered = data.filter(
    (row) => row.competition && row.competition.trim() !== ""
  );

  const extractYear = (competition: string | null) => {
    if (!competition) return -1;

    const fourDigit = competition.match(/(20\d{2})$/);
    if (fourDigit) return Number(fourDigit[1]);

    const season = competition.match(/(\d{2})\/\d{2}$/);
    if (season) return Number("20" + season[1]);

    return -1;
  };

  const sorted = [...filtered].sort((a, b) => {
    const compA = a.competition ?? "";
    const compB = b.competition ?? "";

    if (compA === "Non Card Entry") return 1;
    if (compB === "Non Card Entry") return -1;

    const yearA = extractYear(compA);
    const yearB = extractYear(compB);

    if (yearA !== -1 && yearB !== -1) {
      if (yearA !== yearB) return yearB - yearA;
      return compA.localeCompare(compB);
    }

    if (yearA !== -1 && yearB === -1) return -1;
    if (yearA === -1 && yearB !== -1) return 1;

    return compA.localeCompare(compB);
  });

  const labels = sorted.map((d) => d.competition);
  const values = sorted.map((d) => Number(d.gross_profit ?? 0));

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

  const options = {
    responsive: true,
    plugins: {
      legend: {
        labels: {
          color: "white",
        },
      },
      tooltip: {
        titleColor: "white",
        bodyColor: "white",
        backgroundColor: "#1e293b",
        borderColor: "#334155",
        borderWidth: 1,
        callbacks: {
          label: function (context: any) {
            return "£" + context.raw;
          },
        },
      },
      title: {
        display: true,
        text: "Gross Profit by Competition",
        color: "white",
        font: {
          size: 18,
          weight: 700, // ⭐ FIXED (was "bold")
        },
        padding: {
          top: 10,
          bottom: 20,
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: "white",
        },
        grid: {
          color: "#334155",
        },
      },
      y: {
        ticks: {
          color: "white",
          callback: function (value: number | string) {
            return "£" + value;
          },
        },
        grid: {
          color: "#334155",
        },
      },
    },
  };

  return (
    <div>
      <Bar data={chartData} options={options} />
    </div>
  );
}

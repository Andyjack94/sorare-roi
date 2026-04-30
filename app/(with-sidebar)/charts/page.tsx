// SERVER COMPONENT — but forced dynamic so it runs at runtime, not build time
export const dynamic = "force-dynamic";

import { supabase } from "@/lib/supabaseClient";
import ProfitChart from "./ProfitChart";
import ProfitTable from "./profit-table";
import RewardsTable from "./rewards-table";

export default async function ChartsPage() {
  const { data: competitionProfit } = await supabase
    .from("competition_gross_profit")
    .select("*");

  const { data: rewardsData } = await supabase
    .from("competition_rewards")
    .select("*");

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0f172a",
        padding: "3rem 1rem",
        color: "white",
      }}
    >
      <style>
        {`
          /* ----------------------------- */
          /* TABLE OVERRIDES               */
          /* ----------------------------- */
          .dark-table-container {
            background: #1e293b !important;
            border: 1px solid #334155 !important;
            border-radius: 12px !important;
            padding: 1.5rem !important;
          }

          .dark-table-container table {
            width: 100%;
            border-collapse: collapse;
            color: white !important;
          }

          .dark-table-container th {
            background: #273449 !important;
            color: #e2e8f0 !important;
            border-bottom: 1px solid #334155 !important;
            padding: 0.6rem !important;
            font-weight: 600 !important;
          }

          .dark-table-container td {
            padding: 0.6rem !important;
            border-bottom: 1px solid #334155 !important;
            color: white !important;
          }

          .dark-table-container tr:nth-child(even) {
            background: #1a2433 !important;
          }

          .dark-table-container tr:nth-child(odd) {
            background: #16202c !important;
          }

          /* ----------------------------- */
          /* CHART OVERRIDES — FINAL FIX   */
          /* ----------------------------- */

          /* Chart container */
          .dark-chart-container {
            background: #1e293b !important;
            border: 1px solid #334155 !important;
            border-radius: 12px !important;
            padding: 1.5rem !important;
          }

          /* FORCE all SVG text to white */
          .dark-chart-container svg * {
            fill: white !important;
            color: white !important;
          }

          /* Grid lines */
          .dark-chart-container .recharts-cartesian-grid-horizontal line,
          .dark-chart-container .recharts-cartesian-grid-vertical line {
            stroke: #334155 !important;
          }

          /* Tooltip */
          .dark-chart-container .recharts-default-tooltip {
            background: #1e293b !important;
            border: 1px solid #334155 !important;
            color: white !important;
          }
        `}
      </style>

      {/* Page Title */}
      <div
        style={{
          maxWidth: 900,
          margin: "0 auto 2.5rem auto",
        }}
      >
        <h1
          style={{
            fontSize: "2rem",
            fontWeight: 700,
            marginBottom: "0.5rem",
            color: "white",
          }}
        >
          Competition Breakdown
        </h1>

        <p
          style={{
            color: "#94a3b8",
            fontSize: "0.95rem",
            marginTop: "0.25rem",
          }}
        >
          Explore profit, performance, and rewards across all competitions.
        </p>
      </div>

      {/* Content Grid */}
      <div
        style={{
          maxWidth: 900,
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          gap: "2rem",
        }}
      >
        {/* Profit Table */}
        <div className="dark-table-container">
          <ProfitTable data={competitionProfit ?? []} />
        </div>

        {/* Profit Chart */}
        <div className="dark-chart-container">
          <ProfitChart data={competitionProfit ?? []} />
        </div>

        {/* Rewards Table */}
        <div className="dark-table-container">
          <RewardsTable data={rewardsData ?? []} />
        </div>
      </div>
    </div>
  );
}

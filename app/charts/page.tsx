// SERVER COMPONENT
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
    <div style={{ padding: "2rem" }}>
      <h1 style={{ fontSize: "2rem", fontWeight: 700, marginBottom: "2rem", color: "black" }}>
        Competition Breakdown
      </h1>

      <div style={{ display: "grid", gap: "2rem" }}>
        <ProfitTable data={competitionProfit || []} />
        <ProfitChart data={competitionProfit || []} />
        <RewardsTable data={rewardsData || []} />
      </div>
    </div>
  );
}

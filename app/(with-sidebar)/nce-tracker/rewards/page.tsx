import { supabaseServer } from "@/server/supabaseServer";

export default async function RewardsPage() {
  const supabase = supabaseServer as any;

  // Rewards
  const { data: rewardsData, error: rewardsError } = await supabase
    .from("nce_inputs")
    .select("*");

  if (rewardsError || !rewardsData) {
    return (
      <div style={{ color: "white", textAlign: "center" }}>
        Error loading data
      </div>
    );
  }

  const rows = rewardsData as Array<{
    account?: string;
    date?: string;
    reward_value?: number | string;
  }>;

  const total = rows.reduce(
    (acc, r) => acc + Number(r.reward_value ?? 0),
    0
  );

  const y2025 = rows
    .filter((r) => typeof r.date === "string" && r.date.startsWith("2025"))
    .reduce((acc, r) => acc + Number(r.reward_value ?? 0), 0);

  const y2026 = rows
    .filter((r) => typeof r.date === "string" && r.date.startsWith("2026"))
    .reduce((acc, r) => acc + Number(r.reward_value ?? 0), 0);

  const loz = rows
    .filter((r) => r.account === "LozJones97")
    .reduce((acc, r) => acc + Number(r.reward_value ?? 0), 0);

  const andy = rows
    .filter((r) => r.account === "AndyisaGooden")
    .reduce((acc, r) => acc + Number(r.reward_value ?? 0), 0);

  // Withdrawals
  const { data: wdData } = await supabase
    .from("lozjones97_withdrawals")
    .select("value");

  const withdrawalsRows = Array.isArray(wdData) ? wdData : [];
  const withdrawalsTotal = withdrawalsRows.reduce(
    (acc, r) => acc + Number((r as any).value ?? 0),
    0
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
      {/* Row 1 */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr" }}>
        <StatCard label="Total Rewards" value={total} />
      </div>

      {/* Row 2 */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "1.5rem",
        }}
      >
        <StatCard label="2025 Rewards" value={y2025} />
        <StatCard label="2026 Rewards" value={y2026} />
      </div>

      {/* Row 3 */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "1.5rem",
        }}
      >
        <StatCard label="LozJones97 Rewards" value={loz} />
        <StatCard label="AndyisaGooden Rewards" value={andy} />
      </div>

      {/* Row 4 */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr",
          gap: "1.5rem",
        }}
      >
        <StatCard label="LozJones97 Withdrawals" value={withdrawalsTotal} />
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div
      style={{
        padding: "1.5rem",
        borderRadius: "12px",
        background: "#1e293b",
        border: "1px solid #334155",
        textAlign: "center",
      }}
    >
      <div
        style={{
          fontSize: "1rem",
          fontWeight: 600,
          marginBottom: "0.5rem",
          color: "#e2e8f0",
        }}
      >
        {label}
      </div>

      <div
        style={{
          fontSize: "1.8rem",
          fontWeight: 700,
          color: "white",
        }}
      >
        £{Number(value ?? 0).toFixed(2)}
      </div>
    </div>
  );
}

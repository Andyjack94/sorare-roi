import { supabaseServer } from "@/server/supabaseServer";
import type { Database } from "@/types/supabase";

type NCEInput = Database["public"]["Tables"]["nce_inputs"]["Row"];

export default async function RewardsPage() {
  const supabase = supabaseServer;

  const { data, error } = await supabase.from("nce_inputs").select("*");

  if (error || !data) {
    return (
      <div style={{ color: "white", textAlign: "center" }}>
        Error loading data
      </div>
    );
  }

  const rows: NCEInput[] = data;

  const total = rows.reduce(
    (a: number, b: NCEInput) => a + Number(b.reward_value),
    0
  );

  const y2025 = rows
    .filter((r) => r.date.startsWith("2025"))
    .reduce((a, b) => a + Number(b.reward_value), 0);

  const y2026 = rows
    .filter((r) => r.date.startsWith("2026"))
    .reduce((a, b) => a + Number(b.reward_value), 0);

  const loz = rows
    .filter((r) => r.account === "LozJones97")
    .reduce((a, b) => a + Number(b.reward_value), 0);

  const andy = rows
    .filter((r) => r.account === "AndyisaGooden")
    .reduce((a, b) => a + Number(b.reward_value), 0);

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
    </div>
  );
}

function StatCard({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
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
        £{value.toFixed(2)}
      </div>
    </div>
  );
}

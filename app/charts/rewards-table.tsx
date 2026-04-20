"use client";

export default function RewardsTable({ data }) {
  const extractYear = (competition) => {
    if (!competition) return -1;

    const fourDigit = competition.match(/(20\d{2})$/);
    if (fourDigit) return Number(fourDigit[1]);

    const season = competition.match(/(\d{2})\/\d{2}$/);
    if (season) return Number("20" + season[1]);

    return -1;
  };

  const sorted = [...data].sort((a, b) => {
    const yearA = extractYear(a.competition);
    const yearB = extractYear(b.competition);

    if (yearA !== -1 && yearB !== -1) {
      if (yearA !== yearB) return yearB - yearA;
      return a.competition.localeCompare(b.competition);
    }

    if (yearA !== -1 && yearB === -1) return -1;
    if (yearA === -1 && yearB !== -1) return 1;

    return a.competition.localeCompare(b.competition);
  });

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
        Rewards Breakdown
      </h2>

      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ borderBottom: "2px solid #eee" }}>
            <th style={{ textAlign: "left", padding: "0.5rem" }}>Competition</th>
            <th style={{ textAlign: "left", padding: "0.5rem" }}>Total Rewards (£)</th>
          </tr>
        </thead>

        <tbody>
          {sorted.map((row) => (
            <tr key={row.competition} style={{ borderBottom: "1px solid #eee" }}>
              <td style={{ padding: "0.5rem" }}>{row.competition}</td>
              <td style={{ padding: "0.5rem", fontWeight: 600 }}>
                £{Number(row.total_rewards).toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

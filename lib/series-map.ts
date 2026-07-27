// ⭐ Series labels shown in the UI
export const SERIES_LABELS: Record<string, string> = {
  "sorare-27": "Sorare 27",
  "sorare-26": "Sorare 26",
  "sorare-24-25": "Sorare 24/25",
  "cap-240": "Cap 240",
  "early-sorare": "Early Sorare",
};

// ⭐ Series rules — determines which competitions belong to each series
export const SERIES_RULES: Record<string, (name: string) => boolean> = {
  // Sorare 27 → ALL competitions containing "2027"
  // This automatically includes:
  // - Eredivisie 2027
  // - Liga Portugal 2027
  // - MLS 2027
  // - Premier League 2027
  // - Any future 2027 competitions
  "sorare-27": (name) => name.includes("2027"),

  // Sorare 26 → all 2026 leagues except MLB/NBA
  "sorare-26": (name) =>
    name.includes("2026") &&
    !name.includes("mlb") &&
    !name.includes("nba"),

  // Sorare 24/25 → all 24/25 competitions
  "sorare-24-25": (name) => name.includes("24/25"),

  // Cap 240 → exact matches only
  "cap-240": (name) =>
    name === "cap 240 limited" ||
    name === "cap 240 rare",

  // Early Sorare → pre‑2023 competitions
  "early-sorare": (name) => name.includes("pre-2023"),
};

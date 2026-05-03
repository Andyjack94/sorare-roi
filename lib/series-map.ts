export const SERIES_LABELS: Record<string, string> = {
  "sorare-27": "Sorare 27",
  "sorare-26": "Sorare 26",
  "sorare-24-25": "Sorare 24/25",
  "cap-240": "Cap 240",
  "early-sorare": "Early Sorare",
};

export const SERIES_RULES: Record<string, (name: string) => boolean> = {
  // Sorare 27 → only MLS 2027
  "sorare-27": (name) => name.includes("mls 2027"),

  // Sorare 26 → all 2026 leagues
  "sorare-26": (name) =>
    name.includes("2026") &&
    !name.includes("mlb") &&
    !name.includes("nba"),

  // Sorare 24/25 → all 24/25 competitions
  "sorare-24-25": (name) => name.includes("24/25"),

  // Cap 240 → exact matches
  "cap-240": (name) =>
    name === "cap 240 limited" || name === "cap 240 rare",

  // Early Sorare → pre‑2023 competitions
  "early-sorare": (name) => name.includes("pre-2023"),
};

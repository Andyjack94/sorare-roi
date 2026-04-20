// Shared types for charts, tables, and Supabase views

// Used by ProfitChart
export type ProfitRow = {
  competition: string;
  gross_profit: number | string;
};

// Used by ProfitTable
export type ProfitTableRow = {
  competition: string;
  gross_profit: number | string;
};

// Used by RewardsTable
export type RewardRow = {
  competition: string;
  total_rewards: number | string;
};

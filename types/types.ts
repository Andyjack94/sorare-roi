// Shared types for charts, tables, rewards, and transactions

export type ProfitRow = {
  competition: string
  gross_profit: number | string
}

export type ProfitTableRow = {
  competition: string
  gross_profit: number | string
}

export type RewardRow = {
  competition: string
  total_rewards: number | string
}

// Matches your Supabase "transactions" table
export type TransactionRow = {
  id: string
  date: string
  sale_date: string | null
  type: string
  card_id: string
  player_name: string
  scarcity: string
  competition: string
  purchase_value: number | null
  sale_value: number | null
  notes: string | null
}

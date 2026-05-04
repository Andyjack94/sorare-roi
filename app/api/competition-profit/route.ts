import { NextResponse } from "next/server";
import { supabaseServer } from "@/server/supabaseServer";

export async function GET() {
  const { data, error } = await supabaseServer
    .from("competition_profit")
    .select("competition, gross_profit")
    .order("competition");

  if (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

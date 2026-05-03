import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/supabase";

export const supabaseServer = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

console.log("SERVER CLIENT URL:", process.env.NEXT_PUBLIC_SUPABASE_URL);
console.log("SERVER CLIENT KEY LENGTH:", process.env.SUPABASE_SERVICE_ROLE_KEY?.length);

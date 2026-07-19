import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";
import * as path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

if (!supabaseUrl || !supabaseKey) {
  console.error("Supabase URL or Key is missing from .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
  console.log("Connecting to Supabase RPC exec_sql...");
  
  // Let's test a simple SELECT 1 query
  const { data, error } = await supabase.rpc('exec_sql', { sql_query: 'SELECT 1;' });

  if (error) {
    console.error("RPC exec_sql failed:", error);
  } else {
    console.log("RPC exec_sql succeeded! Response:", data);
  }
}

main().catch(console.error);

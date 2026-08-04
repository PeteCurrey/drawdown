import pg from "pg";
import * as dotenv from "dotenv";
import * as path from "path";
import * as fs from "fs";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
const projectRef = supabaseUrl.replace('https://', '').replace('.supabase.co', '');

if (!supabaseUrl || !serviceKey) {
  console.error("Supabase URL or Key is missing from .env.local");
  process.exit(1);
}

async function main() {
  console.log(`Connecting to pg pooler for project: ${projectRef}...`);
  const sqlPath = path.resolve(process.cwd(), "supabase/migrations/20260804_create_accelerator_applications.sql");
  const sql = fs.readFileSync(sqlPath, "utf-8");

  // URL-encode the password (the service role key) so that it is parsed correctly by the pg connection string parser!
  const connStr = `postgresql://postgres.${projectRef}:${encodeURIComponent(serviceKey)}@aws-0-eu-west-2.pooler.supabase.com:5432/postgres`;
  
  const client = new pg.Client({ 
    connectionString: connStr, 
    ssl: { rejectUnauthorized: false } 
  });

  try {
    await client.connect();
    console.log("Connected to database successfully. Running migration SQL...");
    await client.query(sql);
    console.log("Migration SQL ran successfully!");
  } catch (err: any) {
    console.error("Failed to run migration SQL via direct pg:", err.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

main().catch(console.error);

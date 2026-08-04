import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { config } from 'dotenv';
import pg from 'pg';

const __dirname = dirname(fileURLToPath(import.meta.url));
config({ path: join(__dirname, '../.env.local') });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const PROJECT_REF = SUPABASE_URL.replace('https://', '').replace('.supabase.co', '');

const sqlPath = join(__dirname, '../supabase/migrations/20260804_market_call_game.sql');
const sql = readFileSync(sqlPath, 'utf-8');

async function applyMigration() {
  const host = `db.${PROJECT_REF}.supabase.co`;
  const port = 6543;
  const user = `postgres.${PROJECT_REF}`;
  
  console.log(`Connecting directly to Supabase Postgres on ${host}:${port} as ${user}...`);
  
  const connStr = `postgresql://${user}:${encodeURIComponent(SERVICE_ROLE_KEY)}@${host}:${port}/postgres`;
  
  const client = new pg.Client({
    connectionString: connStr,
    ssl: { rejectUnauthorized: false }
  });
  
  try {
    await client.connect();
    console.log('Connected! Executing Market Call SQL migration...');
    await client.query(sql);
    console.log('✅ SQL migration executed successfully!');
  } catch (err) {
    console.error('❌ Direct PostgreSQL migration failed:', err.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

applyMigration().catch(console.error);

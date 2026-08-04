import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';

const __dirname = dirname(fileURLToPath(import.meta.url));
config({ path: join(__dirname, '../.env.local') });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const sqlPath = join(__dirname, '../supabase/migrations/20260804_market_call_game.sql');
const sql = readFileSync(sqlPath, 'utf-8');

async function applyMigration() {
  console.log(`Applying Market Call migration to ${SUPABASE_URL} via RPC exec_sql...`);
  
  const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);
  
  const { data, error } = await supabase.rpc('exec_sql', { sql_query: sql });
  
  if (error) {
    console.error('❌ RPC exec_sql failed:', error.message);
    console.error('Details:', error);
    process.exit(1);
  } else {
    console.log('✅ SQL migration executed successfully via RPC!');
    console.log('Response:', data);
  }
}

applyMigration().catch(console.error);

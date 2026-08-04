import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { config } from 'dotenv';
import pg from 'pg';
import dns from 'dns';

// Force DNS resolution to prefer IPv4 over IPv6
dns.setDefaultResultOrder('ipv4first');

const __dirname = dirname(fileURLToPath(import.meta.url));
config({ path: join(__dirname, '../.env.local') });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const PROJECT_REF = SUPABASE_URL.replace('https://', '').replace('.supabase.co', '');

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const sqlPath = join(__dirname, '../supabase/migrations/20260804_add_cohort_accelerator_model.sql');
const sql = readFileSync(sqlPath, 'utf-8');

async function applyMigration() {
  console.log(`Connecting directly to Supabase Postgres via IPv4 Pooler for project: ${PROJECT_REF}...`);
  
  const connStr = `postgresql://postgres.${PROJECT_REF}:${encodeURIComponent(SERVICE_ROLE_KEY)}@aws-0-eu-west-2.pooler.supabase.com:5432/postgres`;
  
  const client = new pg.Client({
    connectionString: connStr,
    ssl: { rejectUnauthorized: false }
  });
  
  try {
    await client.connect();
    console.log('Connected! Executing SQL migration...');
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

import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { config } from 'dotenv';
import pg from 'pg';

const __dirname = dirname(fileURLToPath(import.meta.url));
config({ path: join(__dirname, '../.env.local') });

const SUPABASE_DB_URL = process.env.SUPABASE_URL;

if (!SUPABASE_DB_URL) {
  console.error('Missing SUPABASE_URL in .env.local');
  process.exit(1);
}

const sqlPath = join(__dirname, '../supabase/migrations/20260804_methodology_claims.sql');
const sql = readFileSync(sqlPath, 'utf-8');

async function applyMigration() {
  console.log(`Connecting to Supabase database via SUPABASE_URL...`);
  
  const client = new pg.Client({
    connectionString: SUPABASE_DB_URL,
    ssl: { rejectUnauthorized: false }
  });
  
  try {
    await client.connect();
    console.log('Connected! Executing Methodology Claims SQL migration...');
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

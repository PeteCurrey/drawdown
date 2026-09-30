import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { config } from 'dotenv';
import pg from 'pg';

const __dirname = dirname(fileURLToPath(import.meta.url));
config({ path: join(__dirname, '../.env.local') });

const connStr = process.env.SUPABASE_URL;

if (!connStr || !connStr.startsWith('postgres')) {
  console.error('Missing or invalid postgres connection string in SUPABASE_URL');
  process.exit(1);
}

const sqlPath = join(__dirname, '../supabase/migrations/20260929_monitored_sources_and_lobby_items.sql');
const sql = readFileSync(sqlPath, 'utf-8');

async function applyMigration() {
  console.log('Connecting to Supabase Postgres directly via SUPABASE_URL...');
  
  const client = new pg.Client({
    connectionString: connStr,
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 10000
  });

  try {
    await client.connect();
    console.log('Connected successfully!');
    
    console.log('Applying migration 20260929_monitored_sources_and_lobby_items.sql...');
    await client.query(sql);
    console.log('Migration applied successfully!');

    // Verify monitored_sources rows
    const sourcesRes = await client.query(`
      SELECT id, platform, handle, ingest_mode, active, created_at 
      FROM public.monitored_sources 
      ORDER BY created_at ASC;
    `);
    console.log('\n--- Seeded monitored_sources ---');
    console.table(sourcesRes.rows);

    // Verify lobby_items table schema
    const lobbyItemsColumns = await client.query(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns 
      WHERE table_name = 'lobby_items';
    `);
    console.log('\n--- Columns on lobby_items ---');
    console.table(lobbyItemsColumns.rows);

  } catch (err) {
    console.error('Connection or query failed:', err.message);
    process.exit(1);
  } finally {
    await client.end().catch(() => {});
  }
}

applyMigration().catch(console.error);

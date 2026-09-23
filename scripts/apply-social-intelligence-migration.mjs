import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { config } from 'dotenv';
import pg from 'pg';

const __dirname = dirname(fileURLToPath(import.meta.url));
config({ path: join(__dirname, '../.env.local') });

// In .env.local, SUPABASE_URL is the postgres connection string: postgresql://postgres:...@db.fzzmcqqpfhvolugsiagg.supabase.co:5432/postgres
const connStr = process.env.SUPABASE_URL;

if (!connStr || !connStr.startsWith('postgres')) {
  console.error('Missing or invalid postgres connection string in SUPABASE_URL');
  process.exit(1);
}

const sqlPath = join(__dirname, '../supabase/migrations/20260923000000_social_intelligence_ingestion.sql');
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
    console.log('✅ Connected successfully!');
    
    console.log('Applying migration 20260923000000_social_intelligence_ingestion.sql...');
    await client.query(sql);
    console.log('✅ Migration applied successfully!');

    // Verify columns on news_sources
    const sourcesColumns = await client.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'news_sources' AND column_name IN ('platform', 'account_handle', 'source_category', 'monitoring_status');
    `);
    console.log('\nVerified columns on news_sources:');
    console.table(sourcesColumns.rows);

    // Verify columns on news_candidates
    const candidatesColumns = await client.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'news_candidates' AND column_name IN ('source_claim', 'verified_facts', 'drawdown_interpretation', 'platform_post_id', 'author_handle', 'investor_attention_score');
    `);
    console.log('\nVerified columns on news_candidates:');
    console.table(candidatesColumns.rows);

  } catch (err) {
    console.error('❌ Connection or query failed:', err.message);
    process.exit(1);
  } finally {
    await client.end().catch(() => {});
  }
}

applyMigration().catch(console.error);

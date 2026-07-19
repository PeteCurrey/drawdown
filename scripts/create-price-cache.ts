import { Client } from 'pg';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

async function run() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    console.error('DATABASE_URL is not set in .env.local');
    process.exit(1);
  }

  const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    console.log('Connected to DB');
    
    await client.query(`
      CREATE TABLE IF NOT EXISTS price_cache (
        symbol text PRIMARY KEY,
        price numeric,
        change_pct numeric,
        rsi numeric,
        ema50 numeric,
        ema200 numeric,
        momentum_signal text,
        source text,
        fetched_at timestamptz DEFAULT now()
      );
      
      ALTER TABLE price_cache ENABLE ROW LEVEL SECURITY;
      
      DROP POLICY IF EXISTS "Allow public read-only access to price_cache" ON price_cache;
      CREATE POLICY "Allow public read-only access to price_cache"
        ON price_cache FOR SELECT
        TO public
        USING (true);
    `);
    
    console.log('Successfully created price_cache table and RLS policies.');
  } catch (error) {
    console.error('Error executing query:', error);
  } finally {
    await client.end();
  }
}

run();

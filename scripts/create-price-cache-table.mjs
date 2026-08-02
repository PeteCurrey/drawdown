import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const dotenv = await import('dotenv');
dotenv.config({ path: join(__dirname, '..', '.env.local') });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const PROJECT_REF = SUPABASE_URL?.replace('https://', '')?.replace('.supabase.co', '');
const ACCESS_TOKEN = process.env.SUPABASE_ACCESS_TOKEN;

const sql = `
CREATE TABLE IF NOT EXISTS public.price_cache (
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

ALTER TABLE public.price_cache ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read-only access to price_cache" ON public.price_cache;
CREATE POLICY "Allow public read-only access to price_cache"
  ON public.price_cache FOR SELECT
  TO public
  USING (true);

DROP POLICY IF EXISTS "Allow service role write access to price_cache" ON public.price_cache;
CREATE POLICY "Allow service role write access to price_cache"
  ON public.price_cache FOR ALL
  TO service_role
  USING (true) WITH CHECK (true);
`;

async function createTable() {
  console.log(`Connecting to project ${PROJECT_REF}...`);

  // Strategy 1: Management API
  const token = ACCESS_TOKEN || SERVICE_KEY;
  try {
    const res = await fetch(`https://api.supabase.com/v1/projects/${PROJECT_REF}/database/query`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query: sql }),
    });

    if (res.ok) {
      console.log('✅ Table price_cache created via Supabase Management API');
      return true;
    } else {
      console.log(`Management API returned status ${res.status}: ${await res.text()}`);
    }
  } catch (e) {
    console.log('Management API error:', e.message);
  }

  // Strategy 2: Direct pg connection
  try {
    const pg = await import('pg');
    const connStr = process.env.DATABASE_URL || `postgresql://postgres.${PROJECT_REF}:${SERVICE_KEY}@aws-0-eu-west-2.pooler.supabase.com:5432/postgres`;
    const client = new pg.default.Client({ connectionString: connStr, ssl: { rejectUnauthorized: false } });
    await client.connect();
    await client.query(sql);
    await client.end();
    console.log('✅ Table price_cache created via direct PG connection');
    return true;
  } catch (e) {
    console.log('Direct PG error:', e.message);
  }

  return false;
}

createTable();

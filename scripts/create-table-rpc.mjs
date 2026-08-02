import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const dotenv = await import('dotenv');
dotenv.config({ path: join(__dirname, '..', '.env.local') });

const { createClient } = await import('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey);

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

async function run() {
  console.log('Running RPC to create price_cache table...');
  const { data, error } = await supabase.rpc('exec_sql', { sql_query: sql });
  if (error) {
    console.error('RPC Error:', error.message);
  } else {
    console.log('✅ RPC executed successfully. Data:', data);
  }
}

run();

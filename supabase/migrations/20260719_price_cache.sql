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

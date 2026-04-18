-- Phase 4: The Intelligence Layer — SQL Migration

-- Enums for Analysis Types
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'analysis_type') THEN
        CREATE TYPE analysis_type AS ENUM ('daily_brief', 'weekly_navigator', 'instrument_spotlight');
    END IF;
END $$;

-- Market Analysis Table
CREATE TABLE IF NOT EXISTS market_analysis (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type analysis_type NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  excerpt TEXT NOT NULL,
  content_html TEXT NOT NULL,
  instrument TEXT, -- nullable for spotlights
  audio_url TEXT, -- optional for future expansion
  published BOOLEAN DEFAULT false,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Market Data Cache Table (For rate-limiting and performance)
CREATE TABLE IF NOT EXISTS market_data_cache (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cache_key TEXT UNIQUE NOT NULL, -- e.g. "prices:GBPUSD", "calendar:today"
  data JSONB NOT NULL,
  fetched_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL
);

-- Indexing for search performance
CREATE INDEX IF NOT EXISTS idx_market_analysis_slug ON market_analysis(slug);
CREATE INDEX IF NOT EXISTS idx_market_data_cache_expires ON market_data_cache(expires_at);

-- RLS (Row Level Security)
ALTER TABLE market_analysis ENABLE ROW LEVEL SECURITY;
ALTER TABLE market_data_cache ENABLE ROW LEVEL SECURITY;

-- Public Read Policies
DROP POLICY IF EXISTS "Allow public read access to market_analysis" ON market_analysis;
CREATE POLICY "Allow public read access to market_analysis" 
  ON market_analysis FOR SELECT TO public 
  USING (published = true);

DROP POLICY IF EXISTS "Allow public read access to market_data_cache" ON market_data_cache;
CREATE POLICY "Allow public read access to market_data_cache" 
  ON market_data_cache FOR SELECT TO public 
  USING (true);

-- Service Role Policies (Admin/Cron access)
DROP POLICY IF EXISTS "Allow service role full access to market_analysis" ON market_analysis;
CREATE POLICY "Allow service role full access to market_analysis" 
  ON market_analysis FOR ALL TO service_role 
  USING (true);

DROP POLICY IF EXISTS "Allow service role full access to market_data_cache" ON market_data_cache;
CREATE POLICY "Allow service role full access to market_data_cache" 
  ON market_data_cache FOR ALL TO service_role 
  USING (true);

-- supabase/migrations/20260923000000_social_intelligence_ingestion.sql
-- Drawdown Phase 1: Social Intelligence Ingestion & Lobby Intelligence
-- Additive Schema extensions to news_sources and news_candidates

-- 1. Extend news_sources with social platform and monitoring fields
DO $$ BEGIN
    ALTER TABLE public.news_sources 
        ADD COLUMN IF NOT EXISTS platform TEXT NOT NULL DEFAULT 'rss' 
        CHECK (platform IN ('rss', 'x', 'linkedin', 'threads', 'bluesky', 'youtube', 'other'));
EXCEPTION WHEN duplicate_column THEN null; END $$;

DO $$ BEGIN
    ALTER TABLE public.news_sources 
        ADD COLUMN IF NOT EXISTS account_handle TEXT;
EXCEPTION WHEN duplicate_column THEN null; END $$;

DO $$ BEGIN
    ALTER TABLE public.news_sources 
        ADD COLUMN IF NOT EXISTS source_category TEXT NOT NULL DEFAULT 'market_commentary';
EXCEPTION WHEN duplicate_column THEN null; END $$;

DO $$ BEGIN
    ALTER TABLE public.news_sources 
        ADD COLUMN IF NOT EXISTS monitoring_status TEXT NOT NULL DEFAULT 'configured' 
        CHECK (monitoring_status IN ('configured', 'connected', 'scheduled', 'ingested', 'failed', 'unavailable'));
EXCEPTION WHEN duplicate_column THEN null; END $$;

DO $$ BEGIN
    ALTER TABLE public.news_sources 
        ADD COLUMN IF NOT EXISTS last_attempted_at TIMESTAMPTZ;
EXCEPTION WHEN duplicate_column THEN null; END $$;

DO $$ BEGIN
    ALTER TABLE public.news_sources 
        ADD COLUMN IF NOT EXISTS error_details TEXT;
EXCEPTION WHEN duplicate_column THEN null; END $$;

-- 2. Extend news_candidates with epistemic claim-vs-fact and social provenance fields
DO $$ BEGIN
    ALTER TABLE public.news_candidates 
        ADD COLUMN IF NOT EXISTS source_claim TEXT;
EXCEPTION WHEN duplicate_column THEN null; END $$;

DO $$ BEGIN
    ALTER TABLE public.news_candidates 
        ADD COLUMN IF NOT EXISTS verified_facts JSONB NOT NULL DEFAULT '[]'::jsonb;
EXCEPTION WHEN duplicate_column THEN null; END $$;

DO $$ BEGIN
    ALTER TABLE public.news_candidates 
        ADD COLUMN IF NOT EXISTS drawdown_interpretation TEXT;
EXCEPTION WHEN duplicate_column THEN null; END $$;

DO $$ BEGIN
    ALTER TABLE public.news_candidates 
        ADD COLUMN IF NOT EXISTS platform_post_id TEXT;
EXCEPTION WHEN duplicate_column THEN null; END $$;

DO $$ BEGIN
    ALTER TABLE public.news_candidates 
        ADD COLUMN IF NOT EXISTS author_handle TEXT;
EXCEPTION WHEN duplicate_column THEN null; END $$;

DO $$ BEGIN
    ALTER TABLE public.news_candidates 
        ADD COLUMN IF NOT EXISTS investor_attention_score NUMERIC(5, 2) DEFAULT 0.0;
EXCEPTION WHEN duplicate_column THEN null; END $$;

-- 3. Performance & Deduplication Indexes
CREATE INDEX IF NOT EXISTS idx_news_sources_platform ON public.news_sources (platform, active);
CREATE INDEX IF NOT EXISTS idx_news_candidates_platform_post ON public.news_candidates (platform_post_id);
CREATE INDEX IF NOT EXISTS idx_news_candidates_attention ON public.news_candidates (investor_attention_score DESC);

-- 4. RLS: Public read for approved news candidates
DO $$ BEGIN
    CREATE POLICY "Public read approved news candidates"
        ON public.news_candidates FOR SELECT
        USING (editorial_status IN ('approved', 'published'));
EXCEPTION WHEN duplicate_object THEN null; END $$;

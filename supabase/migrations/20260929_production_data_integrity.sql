-- supabase/migrations/20260929_production_data_integrity.sql
-- ==============================================================================
-- Migration: 20260929_production_data_integrity.sql
-- Description: Establishes data classification, test quarantine, hard retirement,
--              and cron run execution history.
-- ==============================================================================

-- 1. Create Data Classification Enum
DO $$ BEGIN
    CREATE TYPE data_classification_type AS ENUM (
        'PRODUCTION_VERIFIED',
        'TEST_DEMO',
        'SEEDED',
        'UNCLASSIFIED'
    );
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- 2. Enhance lobby_articles schema
ALTER TABLE public.lobby_articles
  ADD COLUMN IF NOT EXISTS data_classification data_classification_type DEFAULT 'UNCLASSIFIED',
  ADD COLUMN IF NOT EXISTS is_test BOOLEAN DEFAULT true, -- SAFE DEFAULT: quarantined until classified
  ADD COLUMN IF NOT EXISTS retire_at TIMESTAMPTZ;

-- 3. Classify known test and seed articles
UPDATE public.lobby_articles
SET 
  is_test = true,
  data_classification = 'TEST_DEMO'
WHERE 
  title ILIKE '%test%' 
  OR title ILIKE '%demo%' 
  OR title ILIKE '%dummy%' 
  OR title ILIKE '%placeholder%'
  OR slug ILIKE 'test-%'
  OR slug ILIKE 'demo-%';

-- 4. Classify known authoritative ingested articles
UPDATE public.lobby_articles
SET 
  is_test = false,
  data_classification = 'PRODUCTION_VERIFIED'
WHERE 
  data_classification = 'UNCLASSIFIED'
  AND status = 'PUBLISHED'
  AND confidence IN ('VERIFIED', 'KNOWN')
  AND primary_source_name IS NOT NULL
  AND NOT (title ILIKE '%test%' OR slug ILIKE '%test%');

-- 5. Mark existing ARCHIVED articles with hard retirement
UPDATE public.lobby_articles
SET retire_at = COALESCE(updated_at, now())
WHERE status = 'ARCHIVED' AND retire_at IS NULL;

-- 6. Add indices for high-performance freshness and eligibility gating
CREATE INDEX IF NOT EXISTS idx_lobby_articles_eligibility
  ON public.lobby_articles (section, status, is_test, published_at DESC)
  WHERE status = 'PUBLISHED' AND is_test = false;

CREATE INDEX IF NOT EXISTS idx_lobby_articles_coming_up_events
  ON public.lobby_articles (section, status, is_test, primary_source_date ASC)
  WHERE section = 'coming_up' AND status = 'PUBLISHED' AND is_test = false;

CREATE INDEX IF NOT EXISTS idx_lobby_articles_retire_at
  ON public.lobby_articles (retire_at)
  WHERE retire_at IS NOT NULL;

-- 7. Enhance signals schema
ALTER TABLE public.signals
  ADD COLUMN IF NOT EXISTS is_test BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS data_classification data_classification_type DEFAULT 'PRODUCTION_VERIFIED';

-- Quarantine any signals with seed fingerprints
UPDATE public.signals
SET 
  is_test = true,
  is_active = false,
  data_classification = 'SEEDED'
WHERE 
  catalyst_event->>'event' = 'High-Confluence Sessional Breakout'
  OR entry_price IN (3342.50, 65420.00, 1.2745, 157.80);

-- Deactivate any signals older than 48 hours that remained active
UPDATE public.signals
SET is_active = false
WHERE is_active = true AND created_at < NOW() - INTERVAL '48 hours';

-- 8. Create cron_job_runs table for background job observability
CREATE TABLE IF NOT EXISTS public.cron_job_runs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_name TEXT NOT NULL,
  endpoint TEXT NOT NULL,
  started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at TIMESTAMPTZ,
  status TEXT NOT NULL DEFAULT 'RUNNING' CHECK (status IN ('RUNNING', 'SUCCESS', 'FAILED', 'TIMEOUT')),
  duration_ms INTEGER,
  records_processed INTEGER DEFAULT 0,
  error_message TEXT,
  metadata JSONB DEFAULT '{}'::jsonb
);

CREATE INDEX IF NOT EXISTS idx_cron_job_runs_lookup
  ON public.cron_job_runs (job_name, started_at DESC);

-- RLS: Read by admins and service role; write by service role only
ALTER TABLE public.cron_job_runs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins and service_role can read cron_job_runs" ON public.cron_job_runs;
CREATE POLICY "Admins and service_role can read cron_job_runs"
  ON public.cron_job_runs FOR SELECT
  USING (
    (auth.jwt() ->> 'role' = 'service_role')
    OR (auth.uid() IS NOT NULL AND EXISTS (
      SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    ))
  );

DROP POLICY IF EXISTS "Service role can manage cron_job_runs" ON public.cron_job_runs;
CREATE POLICY "Service role can manage cron_job_runs"
  ON public.cron_job_runs FOR ALL
  USING (auth.jwt() ->> 'role' = 'service_role');

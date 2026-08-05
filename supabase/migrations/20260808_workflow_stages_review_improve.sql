-- ============================================================
-- MIGRATION: 20260808_workflow_stages_review_improve.sql
-- Additive: adds missing columns to tables already defined
-- in 20260808_create_workflow_tables.sql.
-- ============================================================

-- ============================================================
-- trade_reviews — add composite score and user_id FK guard
-- ============================================================
ALTER TABLE public.trade_reviews
  ADD COLUMN IF NOT EXISTS composite_process_score INTEGER;

-- Back-fill composite score for any existing rows
UPDATE public.trade_reviews
SET composite_process_score = (plan_adherence_score + risk_discipline_score + journal_completeness_score) / 3
WHERE composite_process_score IS NULL
  AND plan_adherence_score IS NOT NULL
  AND risk_discipline_score IS NOT NULL
  AND journal_completeness_score IS NOT NULL;

-- Add user_id to trade_reviews if not present (original schema may omit it)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'trade_reviews'
      AND column_name = 'user_id'
  ) THEN
    ALTER TABLE public.trade_reviews
      ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
  END IF;
END $$;

-- ============================================================
-- improvement_commitments — add category, closed_at, target_date
-- and expand status values to include open/in_progress/closed
-- ============================================================
ALTER TABLE public.improvement_commitments
  ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'process',
  ADD COLUMN IF NOT EXISTS target_date DATE,
  ADD COLUMN IF NOT EXISTS closed_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS origin_review_id UUID REFERENCES public.trade_reviews(id) ON DELETE SET NULL;

-- Drop existing status constraint and replace with expanded set
ALTER TABLE public.improvement_commitments
  DROP CONSTRAINT IF EXISTS improvement_commitments_status_check;

ALTER TABLE public.improvement_commitments
  ADD CONSTRAINT improvement_commitments_status_check
  CHECK (status IN ('open', 'in_progress', 'closed', 'active', 'completed', 'replaced', 'abandoned'));

-- Back-fill category
UPDATE public.improvement_commitments SET category = 'process' WHERE category IS NULL;

-- ============================================================
-- weekly_operating_reviews — add columns the component expects
-- ============================================================
ALTER TABLE public.weekly_operating_reviews
  ADD COLUMN IF NOT EXISTS week_start DATE,
  ADD COLUMN IF NOT EXISTS week_end DATE,
  ADD COLUMN IF NOT EXISTS process_consistency_score INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS net_result NUMERIC(12,2) DEFAULT 0,
  ADD COLUMN IF NOT EXISTS trade_count INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS rule_deviations_count INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS key_wins TEXT[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS key_learnings TEXT[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS plan_for_next_week TEXT,
  ADD COLUMN IF NOT EXISTS will_trade_next_week BOOLEAN DEFAULT TRUE,
  ADD COLUMN IF NOT EXISTS skip_reason TEXT;

-- Back-fill week_start from week_commencing where set
UPDATE public.weekly_operating_reviews
SET week_start = week_commencing, week_end = week_commencing + 6
WHERE week_start IS NULL AND week_commencing IS NOT NULL;

-- Migration: Weekly Market Call Game Schema
-- Created: 2026-08-04

-- 1. Weekly Rounds Table
CREATE TABLE IF NOT EXISTS public.market_call_weeks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    week_number INT UNIQUE NOT NULL, -- Format: YYYYWW (e.g. 202632)
    start_date TIMESTAMPTZ NOT NULL,
    lock_date TIMESTAMPTZ NOT NULL,   -- Deadline to submit predictions (e.g. Tuesday midnight)
    end_date TIMESTAMPTZ NOT NULL,     -- Friday close / Sunday close
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'locked', 'resolved')),
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Questions Table
CREATE TABLE IF NOT EXISTS public.market_call_questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    week_id UUID REFERENCES public.market_call_weeks(id) ON DELETE CASCADE NOT NULL,
    symbol TEXT NOT NULL, -- e.g. 'GBP/USD'
    reference_price DECIMAL NOT NULL,
    actual_close_price DECIMAL,
    outcome TEXT DEFAULT 'pending' CHECK (outcome IN ('higher', 'lower', 'flat', 'pending')),
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(week_id, symbol)
);

-- 3. Predictions Table
CREATE TABLE IF NOT EXISTS public.market_call_predictions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    question_id UUID REFERENCES public.market_call_questions(id) ON DELETE CASCADE NOT NULL,
    call TEXT NOT NULL CHECK (call IN ('higher', 'lower')),
    submitted_at TIMESTAMPTZ DEFAULT now(),
    is_correct BOOLEAN,
    points_awarded INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(user_id, question_id)
);

-- 4. Enable Row Level Security (RLS)
ALTER TABLE public.market_call_weeks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.market_call_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.market_call_predictions ENABLE ROW LEVEL SECURITY;

-- 5. Define Security Policies
-- Everyone can read weeks and questions
DROP POLICY IF EXISTS "Public read for market_call_weeks" ON public.market_call_weeks;
CREATE POLICY "Public read for market_call_weeks" ON public.market_call_weeks FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read for market_call_questions" ON public.market_call_questions;
CREATE POLICY "Public read for market_call_questions" ON public.market_call_questions FOR SELECT USING (true);

-- Predictions: owners can view their own predictions
DROP POLICY IF EXISTS "Users can view their own predictions" ON public.market_call_predictions;
CREATE POLICY "Users can view their own predictions" ON public.market_call_predictions 
    FOR SELECT USING (auth.uid() = user_id);

-- Predictions: owners can insert their own predictions, only if the week is active and lock_date hasn't passed
DROP POLICY IF EXISTS "Users can insert their own predictions" ON public.market_call_predictions;
CREATE POLICY "Users can insert their own predictions" ON public.market_call_predictions 
    FOR INSERT WITH CHECK (
        auth.uid() = user_id 
        AND EXISTS (
            SELECT 1 FROM public.market_call_questions q
            JOIN public.market_call_weeks w ON q.week_id = w.id
            WHERE q.id = question_id 
              AND w.status = 'active' 
              AND now() < w.lock_date
        )
    );

-- Note: No UPDATE or DELETE policies are created to enforce that predictions are immutable after submission.

-- 6. RPC Function: get_market_call_leaderboard
-- Returns leaderboard standings safely by bypassing profiles RLS and selecting non-sensitive fields
CREATE OR REPLACE FUNCTION public.get_market_call_leaderboard(p_week_id UUID DEFAULT NULL)
RETURNS TABLE (
    user_id UUID,
    display_name TEXT,
    avatar_url TEXT,
    subscription_tier TEXT,
    total_points BIGINT,
    total_predictions BIGINT,
    correct_predictions BIGINT,
    accuracy_pct NUMERIC
) 
LANGUAGE plpgsql
SECURITY DEFINER -- Runs as DB owner to bypass profiles RLS safely
SET search_path = public
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        p.id,
        COALESCE(p.display_name, 'Anonymous Trader'),
        p.avatar_url,
        p.subscription_tier::TEXT,
        COALESCE(SUM(pr.points_awarded), 0)::BIGINT as total_points,
        COUNT(pr.id)::BIGINT as total_predictions,
        COALESCE(SUM(CASE WHEN pr.is_correct = true THEN 1 ELSE 0 END), 0)::BIGINT as correct_predictions,
        CASE 
            WHEN COUNT(pr.id) > 0 THEN ROUND((COALESCE(SUM(CASE WHEN pr.is_correct = true THEN 1 ELSE 0 END), 0)::DECIMAL / COUNT(pr.id)::DECIMAL) * 100, 1)
            ELSE 0::NUMERIC
        END as accuracy_pct
    FROM public.profiles p
    JOIN public.market_call_predictions pr ON p.id = pr.user_id
    JOIN public.market_call_questions q ON pr.question_id = q.id
    WHERE (p_week_id IS NULL OR q.week_id = p_week_id)
      AND pr.points_awarded IS NOT NULL
    GROUP BY p.id, p.display_name, p.avatar_url, p.subscription_tier
    ORDER BY total_points DESC, accuracy_pct DESC, p.id ASC;
END;
$$;

-- 7. RPC Function: get_market_call_aggregates
-- Returns community choices aggregates for a given week only after the lock_date has passed
CREATE OR REPLACE FUNCTION public.get_market_call_aggregates(p_week_id UUID)
RETURNS TABLE (
    question_id UUID,
    symbol TEXT,
    total_calls BIGINT,
    higher_calls BIGINT,
    lower_calls BIGINT,
    higher_pct NUMERIC,
    lower_pct NUMERIC
) 
LANGUAGE plpgsql
SECURITY DEFINER -- Runs as DB owner to aggregate other users' predictions safely
SET search_path = public
AS $$
BEGIN
    -- Protection check: Ensure the week is locked or resolved before returning aggregates to avoid trade signaling
    IF EXISTS (
        SELECT 1 FROM public.market_call_weeks 
        WHERE id = p_week_id AND status = 'active' AND now() < lock_date
    ) THEN
        RAISE EXCEPTION 'Aggregates are hidden until the prediction lock deadline passes.';
    END IF;

    RETURN QUERY
    SELECT 
        q.id,
        q.symbol,
        COUNT(pr.id)::BIGINT as total_calls,
        COALESCE(SUM(CASE WHEN pr.call = 'higher' THEN 1 ELSE 0 END), 0)::BIGINT as higher_calls,
        COALESCE(SUM(CASE WHEN pr.call = 'lower' THEN 1 ELSE 0 END), 0)::BIGINT as lower_calls,
        CASE 
            WHEN COUNT(pr.id) > 0 THEN ROUND((COALESCE(SUM(CASE WHEN pr.call = 'higher' THEN 1 ELSE 0 END), 0)::DECIMAL / COUNT(pr.id)::DECIMAL) * 100, 1)
            ELSE 0::NUMERIC
        END as higher_pct,
        CASE 
            WHEN COUNT(pr.id) > 0 THEN ROUND((COALESCE(SUM(CASE WHEN pr.call = 'lower' THEN 1 ELSE 0 END), 0)::DECIMAL / COUNT(pr.id)::DECIMAL) * 100, 1)
            ELSE 0::NUMERIC
        END as lower_pct
    FROM public.market_call_questions q
    LEFT JOIN public.market_call_predictions pr ON q.id = pr.question_id
    WHERE q.week_id = p_week_id
    GROUP BY q.id, q.symbol;
END;
$$;

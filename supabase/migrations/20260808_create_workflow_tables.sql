-- supabase/migrations/20260808_create_workflow_tables.sql
-- Migration to support the Drawdown Operating System (Drawdown OS) workflow

-- 1. Trading Accounts
CREATE TABLE IF NOT EXISTS public.trading_accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    account_type TEXT CHECK (account_type IN ('demo', 'personal', 'prop_evaluation', 'funded_prop')) NOT NULL,
    broker_name TEXT,
    platform_name TEXT,
    currency TEXT NOT NULL DEFAULT 'GBP',
    starting_balance DECIMAL(15,2),
    current_equity DECIMAL(15,2),
    equity_source TEXT CHECK (equity_source IN ('manual', 'csv', 'approved_integration')) NOT NULL DEFAULT 'manual',
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- 2. Risk Policies
CREATE TABLE IF NOT EXISTS public.risk_policies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    account_id UUID REFERENCES public.trading_accounts(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    version INTEGER NOT NULL DEFAULT 1,
    effective_from TIMESTAMPTZ DEFAULT now() NOT NULL,
    max_risk_per_trade_percent DECIMAL(5,2),
    max_risk_per_trade_amount DECIMAL(15,2),
    max_daily_loss_percent DECIMAL(5,2),
    max_weekly_loss_percent DECIMAL(5,2),
    max_total_drawdown_percent DECIMAL(5,2),
    max_open_risk_percent DECIMAL(5,2),
    max_trades_per_session INTEGER,
    minimum_reward_risk DECIMAL(5,2),
    user_confirmed_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- 3. Session Preparations
CREATE TABLE IF NOT EXISTS public.session_preparations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    account_id UUID REFERENCES public.trading_accounts(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    session_date DATE NOT NULL DEFAULT CURRENT_DATE,
    session_type TEXT,
    readiness_answers JSONB NOT NULL DEFAULT '[]'::jsonb,
    market_events JSONB NOT NULL DEFAULT '[]'::jsonb,
    open_exposure_snapshot JSONB DEFAULT '{}'::jsonb,
    risk_snapshot JSONB DEFAULT '{}'::jsonb,
    outcome TEXT CHECK (outcome IN ('ready', 'caution', 'stand_down')) NOT NULL,
    override_reason TEXT,
    completed_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- 4. Trade Plans
CREATE TABLE IF NOT EXISTS public.trade_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    account_id UUID REFERENCES public.trading_accounts(id) ON DELETE CASCADE NOT NULL,
    preparation_id UUID REFERENCES public.session_preparations(id) ON DELETE SET NULL,
    instrument TEXT NOT NULL,
    asset_class TEXT NOT NULL,
    direction TEXT CHECK (direction IN ('long', 'short', 'scenario_only')),
    setup_id TEXT,
    entry_zone JSONB, -- Price range { "min": decimal, "max": decimal }
    invalidation_level DECIMAL(12,5),
    stop_loss DECIMAL(12,5),
    target_logic TEXT,
    proposed_size DECIMAL(10,4),
    planned_risk_amount DECIMAL(15,2),
    planned_risk_percent DECIMAL(5,2),
    planned_reward_risk DECIMAL(5,2),
    timeframe TEXT,
    reasoning TEXT NOT NULL,
    contradictory_evidence TEXT,
    checklist_results JSONB NOT NULL DEFAULT '[]'::jsonb,
    screenshot_references TEXT[] DEFAULT '{}'::text[],
    expires_at TIMESTAMPTZ,
    status TEXT CHECK (status IN ('draft', 'ready', 'expired', 'cancelled', 'executed_elsewhere', 'not_taken')) NOT NULL DEFAULT 'draft',
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    ready_at TIMESTAMPTZ
);

-- 5. Trade Plan Snapshots (Immutable copy once plan is marked ready)
CREATE TABLE IF NOT EXISTS public.trade_plan_snapshots (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    trade_plan_id UUID REFERENCES public.trade_plans(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    snapshot_data JSONB NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- 6. Trade Records
CREATE TABLE IF NOT EXISTS public.trade_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    trade_plan_id UUID REFERENCES public.trade_plans(id) ON DELETE SET NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    account_id UUID REFERENCES public.trading_accounts(id) ON DELETE CASCADE NOT NULL,
    entry_executions JSONB NOT NULL DEFAULT '[]'::jsonb,
    exit_executions JSONB NOT NULL DEFAULT '[]'::jsonb,
    opened_at TIMESTAMPTZ,
    closed_at TIMESTAMPTZ,
    fees DECIMAL(10,2) DEFAULT 0,
    financing DECIMAL(10,2) DEFAULT 0,
    result_amount DECIMAL(15,2),
    result_r DECIMAL(5,2),
    screenshots TEXT[] DEFAULT '{}'::text[],
    source TEXT CHECK (source IN ('manual', 'csv', 'approved_integration')) NOT NULL DEFAULT 'manual',
    recorded_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- 7. Trade Reviews
CREATE TABLE IF NOT EXISTS public.trade_reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    trade_record_id UUID REFERENCES public.trade_records(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    plan_adherence_score INTEGER CHECK (plan_adherence_score BETWEEN 0 AND 100),
    risk_discipline_score INTEGER CHECK (risk_discipline_score BETWEEN 0 AND 100),
    journal_completeness_score INTEGER CHECK (journal_completeness_score BETWEEN 0 AND 100),
    deviations TEXT[] DEFAULT '{}'::text[],
    strengths TEXT[] DEFAULT '{}'::text[],
    user_reflection TEXT,
    ai_review JSONB,
    completed_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- 8. Improvement Commitments
CREATE TABLE IF NOT EXISTS public.improvement_commitments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    account_id UUID REFERENCES public.trading_accounts(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    measurable_rule TEXT NOT NULL,
    start_date DATE NOT NULL DEFAULT CURRENT_DATE,
    end_date DATE,
    source_review_ids UUID[] DEFAULT '{}'::uuid[],
    status TEXT CHECK (status IN ('active', 'completed', 'replaced', 'abandoned')) NOT NULL DEFAULT 'active',
    outcome TEXT,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- 9. Weekly Operating Reviews
CREATE TABLE IF NOT EXISTS public.weekly_operating_reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    account_id UUID REFERENCES public.trading_accounts(id) ON DELETE CASCADE,
    week_commencing DATE NOT NULL,
    process_metrics JSONB NOT NULL,
    financial_metrics JSONB,
    previous_commitment_result TEXT,
    next_commitment_id UUID REFERENCES public.improvement_commitments(id) ON DELETE SET NULL,
    user_signed_off_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Enable Row Level Security (RLS) on all new tables
ALTER TABLE public.trading_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.risk_policies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.session_preparations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trade_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trade_plan_snapshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trade_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trade_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.improvement_commitments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.weekly_operating_reviews ENABLE ROW LEVEL SECURITY;

-- Setup RLS Policies (all enforce auth.uid() = user_id)
CREATE POLICY "Users can manage their own trading accounts"
    ON public.trading_accounts FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own risk policies"
    ON public.risk_policies FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own session preparations"
    ON public.session_preparations FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own trade plans"
    ON public.trade_plans FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own plan snapshots"
    ON public.trade_plan_snapshots FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own trade records"
    ON public.trade_records FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own trade reviews"
    ON public.trade_reviews FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own commitments"
    ON public.improvement_commitments FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own weekly reviews"
    ON public.weekly_operating_reviews FOR ALL USING (auth.uid() = user_id);

-- Set updated_at trigger on trading_accounts
CREATE OR REPLACE TRIGGER set_trading_accounts_updated_at
    BEFORE UPDATE ON public.trading_accounts
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

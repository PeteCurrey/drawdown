-- 1. Create trades table
CREATE TABLE IF NOT EXISTS public.trades (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    
    -- Trade details
    instrument TEXT NOT NULL,
    direction TEXT CHECK (direction IN ('long', 'short')) NOT NULL,
    entry_price DECIMAL(12,5) NOT NULL,
    exit_price DECIMAL(12,5),
    stop_loss DECIMAL(12,5) NOT NULL,
    take_profit DECIMAL(12,5),
    position_size DECIMAL(10,4) NOT NULL,
    
    -- Session info
    entry_time TIMESTAMPTZ NOT NULL,
    exit_time TIMESTAMPTZ,
    session TEXT CHECK (session IN ('london', 'new_york', 'asian', 'overlap', 'other')),
    
    -- Risk/reward
    risk_amount DECIMAL(10,2) NOT NULL,
    risk_percentage DECIMAL(5,2) NOT NULL,
    account_balance_at_entry DECIMAL(12,2) NOT NULL,
    pnl DECIMAL(10,2),
    pnl_percentage DECIMAL(6,3),
    rrr_planned DECIMAL(5,2),
    rrr_achieved DECIMAL(5,2),
    
    -- Psychology
    emotional_state_entry TEXT CHECK (emotional_state_entry IN ('calm', 'confident', 'anxious', 'fearful', 'excited', 'frustrated', 'neutral')) NOT NULL,
    emotional_state_exit TEXT CHECK (emotional_state_exit IN ('calm', 'satisfied', 'disappointed', 'relieved', 'angry', 'neutral')),
    followed_plan BOOLEAN NOT NULL,
    
    -- Analysis
    setup_type TEXT,
    timeframe_analysis TEXT,
    entry_reason TEXT NOT NULL,
    exit_reason TEXT,
    notes TEXT,
    mistakes TEXT,
    
    -- Status
    status TEXT CHECK (status IN ('open', 'closed', 'cancelled')) DEFAULT 'open',
    tags TEXT[]
);

-- 2. Create journal_ai_analysis table
CREATE TABLE IF NOT EXISTS public.journal_ai_analysis (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now(),
    analysis_type TEXT NOT NULL,
    trade_ids UUID[] NOT NULL,
    analysis_content TEXT NOT NULL,
    patterns_detected JSONB,
    recommendations JSONB
);

-- 3. Enable RLS
ALTER TABLE public.trades ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.journal_ai_analysis ENABLE ROW LEVEL SECURITY;

-- 4. Create RLS Policies
CREATE POLICY "Users can manage their own trades" 
    ON public.trades 
    FOR ALL 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own journal analyses" 
    ON public.journal_ai_analysis 
    FOR ALL 
    USING (auth.uid() = user_id);

-- 5. Updated_at Trigger for trades
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER set_trades_updated_at
    BEFORE UPDATE ON public.trades
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

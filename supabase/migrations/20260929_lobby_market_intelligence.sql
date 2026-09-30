-- ============================================================================
-- Migration: Lobby Daily Market Intelligence Architecture
-- Tables:
--   1. cot_observations (CFTC Commitment of Traders)
--   2. crypto_derivatives_snapshots (Binance/CoinGlass OI & Funding)
--   3. options_market_snapshots (Cboe Put/Call & VIX)
--   4. economic_calendar_events (Canonical Economic Events)
--   5. daily_market_briefs (Daily Synthesis & Macro Regime)
-- ============================================================================

-- 1. CFTC Commitment of Traders (COT) Observations
CREATE TABLE IF NOT EXISTS public.cot_observations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    market_name TEXT NOT NULL,
    cftc_contract_market_code TEXT NOT NULL,
    as_of_date DATE NOT NULL,
    commercial_long BIGINT NOT NULL,
    commercial_short BIGINT NOT NULL,
    non_commercial_long BIGINT NOT NULL,
    non_commercial_short BIGINT NOT NULL,
    net_non_commercial BIGINT GENERATED ALWAYS AS (non_commercial_long - non_commercial_short) STORED,
    open_interest BIGINT NOT NULL,
    source TEXT NOT NULL DEFAULT 'CFTC Socrata API',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (cftc_contract_market_code, as_of_date)
);

CREATE INDEX IF NOT EXISTS idx_cot_market_date 
    ON public.cot_observations(cftc_contract_market_code, as_of_date DESC);

ALTER TABLE public.cot_observations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read access for cot_observations"
    ON public.cot_observations FOR SELECT
    USING (true);

-- 2. Crypto Derivatives Snapshots
CREATE TABLE IF NOT EXISTS public.crypto_derivatives_snapshots (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    symbol TEXT NOT NULL,
    open_interest_usd NUMERIC NOT NULL,
    funding_rate NUMERIC NOT NULL,
    predicted_funding_rate NUMERIC,
    long_short_ratio NUMERIC,
    snapshot_time TIMESTAMPTZ NOT NULL,
    source TEXT NOT NULL DEFAULT 'Binance Public Futures API',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (symbol, snapshot_time)
);

CREATE INDEX IF NOT EXISTS idx_crypto_deriv_symbol_time 
    ON public.crypto_derivatives_snapshots(symbol, snapshot_time DESC);

ALTER TABLE public.crypto_derivatives_snapshots ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read access for crypto_derivatives_snapshots"
    ON public.crypto_derivatives_snapshots FOR SELECT
    USING (true);

-- 3. Options Market Snapshots
CREATE TABLE IF NOT EXISTS public.options_market_snapshots (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    trade_date DATE NOT NULL UNIQUE,
    total_put_call_ratio NUMERIC(6,3) NOT NULL,
    equity_put_call_ratio NUMERIC(6,3) NOT NULL,
    index_put_call_ratio NUMERIC(6,3) NOT NULL,
    vix_close NUMERIC(6,2),
    vix_change_pct NUMERIC(6,2),
    source TEXT NOT NULL DEFAULT 'Cboe Market Data',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.options_market_snapshots ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read access for options_market_snapshots"
    ON public.options_market_snapshots FOR SELECT
    USING (true);

-- 4. Economic Calendar Events
CREATE TABLE IF NOT EXISTS public.economic_calendar_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_time TIMESTAMPTZ NOT NULL,
    currency VARCHAR(10) NOT NULL,
    event_name TEXT NOT NULL,
    impact VARCHAR(20) NOT NULL CHECK (impact IN ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL')),
    actual TEXT,
    forecast TEXT,
    previous TEXT,
    source TEXT NOT NULL DEFAULT 'Canonical Economic Provider',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (event_time, currency, event_name)
);

CREATE INDEX IF NOT EXISTS idx_econ_calendar_time 
    ON public.economic_calendar_events(event_time);

ALTER TABLE public.economic_calendar_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read access for economic_calendar_events"
    ON public.economic_calendar_events FOR SELECT
    USING (true);

-- 5. Daily Market Briefs (The Wire / Lobby Market in One Minute)
CREATE TABLE IF NOT EXISTS public.daily_market_briefs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    brief_date DATE NOT NULL UNIQUE,
    headline TEXT NOT NULL,
    one_minute_summary TEXT NOT NULL,
    macro_regime TEXT NOT NULL CHECK (macro_regime IN ('Risk-On', 'Risk-Off', 'Cautious / Mixed', 'Consolidation')),
    key_drivers JSONB NOT NULL DEFAULT '[]'::jsonb,
    top_opportunities JSONB NOT NULL DEFAULT '[]'::jsonb,
    risk_catalysts JSONB NOT NULL DEFAULT '[]'::jsonb,
    qa_passed BOOLEAN NOT NULL DEFAULT false,
    fca_disclaimer TEXT NOT NULL DEFAULT 'Trading leveraged financial instruments involves substantial risk of loss. Past performance is no guarantee of future results.',
    published_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_daily_market_briefs_date 
    ON public.daily_market_briefs(brief_date DESC);

ALTER TABLE public.daily_market_briefs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read access for daily_market_briefs"
    ON public.daily_market_briefs FOR SELECT
    USING (published_at IS NOT NULL AND qa_passed = true);

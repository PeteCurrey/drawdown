-- ═══════════════════════════════════════════════════════════════
-- DRAWDOWN AI TRADE JOURNAL — trade_entries + weekly_reviews
-- Run in Supabase SQL editor
-- ═══════════════════════════════════════════════════════════════

-- ─── 1. trade_entries ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.trade_entries (
  id                     UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id                UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at             TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at             TIMESTAMPTZ DEFAULT now() NOT NULL,

  -- TRADE CORE
  symbol                 TEXT NOT NULL,
  instrument_type        TEXT CHECK (instrument_type IN ('forex_major','forex_minor','index','commodity','crypto')) NOT NULL,
  direction              TEXT CHECK (direction IN ('BUY','SELL')) NOT NULL,
  status                 TEXT CHECK (status IN ('OPEN','CLOSED','CANCELLED')) DEFAULT 'OPEN' NOT NULL,

  -- EXECUTION
  entry_price            DECIMAL(18,5) NOT NULL,
  exit_price             DECIMAL(18,5),
  stop_loss              DECIMAL(18,5) NOT NULL,
  take_profit            DECIMAL(18,5),
  position_size_lots     DECIMAL(10,4) NOT NULL,

  -- CALCULATED (stored on save)
  risk_amount            DECIMAL(10,2),
  risk_percent           DECIMAL(6,3),
  rr_planned             DECIMAL(6,2),
  rr_achieved            DECIMAL(6,2),
  pnl_amount             DECIMAL(10,2),
  pnl_percent            DECIMAL(8,3),
  pips_gained            DECIMAL(10,2),

  -- TIMING
  entry_time             TIMESTAMPTZ NOT NULL,
  exit_time              TIMESTAMPTZ,
  session                TEXT CHECK (session IN ('LONDON','NEW_YORK','ASIAN','OVERLAP','PRE_MARKET')),
  trading_day            DATE NOT NULL,
  duration_minutes       INTEGER,

  -- CONTEXT (pre-populated from scanner if available)
  atr_at_entry           DECIMAL(10,5),
  spread_at_entry        DECIMAL(10,5),
  vix_at_entry           DECIMAL(8,2),
  dxy_at_entry           DECIMAL(8,3),
  setup_score_at_entry   INTEGER CHECK (setup_score_at_entry BETWEEN 0 AND 100),
  scanner_bias_at_entry  TEXT CHECK (scanner_bias_at_entry IN ('BULLISH','BEARISH','NEUTRAL')),

  -- TRADER TAGS
  setup_type             TEXT,
  confluences            TEXT[],
  mistakes               TEXT[],
  emotions_before        TEXT CHECK (emotions_before IN ('CONFIDENT','NERVOUS','NEUTRAL','FOMO','REVENGE','BORED')),
  emotions_during        TEXT CHECK (emotions_during IN ('CALM','ANXIOUS','GREEDY','DISCIPLINED','PANICKED')),
  market_conditions      TEXT CHECK (market_conditions IN ('TRENDING','RANGING','VOLATILE','QUIET')),

  -- NOTES
  pre_trade_notes        TEXT,
  post_trade_notes       TEXT,
  rules_followed         BOOLEAN,
  checklist_completed    BOOLEAN,

  -- SCREENSHOTS
  chart_screenshot_url   TEXT,

  -- AI FIELDS (populated async after save)
  ai_verdict             TEXT,                -- JSON-stringified ParsedAiVerdict
  ai_verdict_generated_at TIMESTAMPTZ,
  ai_tags_auto           TEXT[],

  -- PROP FIRM
  prop_firm              TEXT,
  prop_account_id        TEXT,
  prop_phase             TEXT CHECK (prop_phase IN ('CHALLENGE','FUNDED','SCALING'))
);

ALTER TABLE public.trade_entries ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users manage own trade entries" ON public.trade_entries;
CREATE POLICY "Users manage own trade entries"
  ON public.trade_entries FOR ALL
  USING  (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_te_user_id     ON public.trade_entries (user_id);
CREATE INDEX IF NOT EXISTS idx_te_trading_day ON public.trade_entries (user_id, trading_day DESC);
CREATE INDEX IF NOT EXISTS idx_te_entry_time  ON public.trade_entries (user_id, entry_time DESC);
CREATE INDEX IF NOT EXISTS idx_te_status      ON public.trade_entries (user_id, status);
CREATE INDEX IF NOT EXISTS idx_te_symbol      ON public.trade_entries (user_id, symbol);

CREATE OR REPLACE FUNCTION public.te_set_updated_at()
RETURNS TRIGGER AS $$ BEGIN NEW.updated_at = now(); RETURN NEW; END; $$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS te_updated_at ON public.trade_entries;
CREATE TRIGGER te_updated_at
  BEFORE UPDATE ON public.trade_entries
  FOR EACH ROW EXECUTE FUNCTION public.te_set_updated_at();

-- ─── 2. weekly_reviews ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.weekly_reviews (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  week         TEXT NOT NULL,          -- ISO e.g. "2026-W24"
  week_start   DATE NOT NULL,
  week_end     DATE NOT NULL,
  content      TEXT NOT NULL,          -- JSON-stringified WeeklyReviewData
  generated_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  trade_count  INTEGER,
  pnl_amount   DECIMAL(10,2),
  UNIQUE (user_id, week)
);

ALTER TABLE public.weekly_reviews ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users manage own weekly reviews" ON public.weekly_reviews;
CREATE POLICY "Users manage own weekly reviews"
  ON public.weekly_reviews FOR ALL
  USING  (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_wr_user ON public.weekly_reviews (user_id, week DESC);

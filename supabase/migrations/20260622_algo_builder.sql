-- ─── Algo Strategy Builder database objects ──────────────────────────────────

-- Generation log (rate limiting + audit trail)
CREATE TABLE IF NOT EXISTS algo_generation_log (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at  TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  language    TEXT NOT NULL CHECK (language IN ('pine_script', 'python')),
  instrument  TEXT,
  timeframe   TEXT,
  description TEXT  -- first 200 chars, no PII
);

CREATE INDEX IF NOT EXISTS idx_algo_gen_log_user_ts
  ON algo_generation_log (user_id, created_at DESC);

ALTER TABLE algo_generation_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own generation log"
  ON algo_generation_log FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users insert own generation log"
  ON algo_generation_log FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Saved strategies library
CREATE TABLE IF NOT EXISTS algo_strategies (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name         TEXT NOT NULL,
  description  TEXT,
  language     TEXT NOT NULL CHECK (language IN ('pine_script', 'python')),
  code         TEXT NOT NULL,
  instrument   TEXT,
  timeframe    TEXT,
  version      INTEGER NOT NULL DEFAULT 1,
  is_favourite BOOLEAN NOT NULL DEFAULT FALSE,
  created_at   TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at   TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_algo_strategies_user
  ON algo_strategies (user_id, created_at DESC);

ALTER TABLE algo_strategies ENABLE ROW LEVEL SECURITY;

-- Single policy covers all operations (select/insert/update/delete)
CREATE POLICY "Users manage own strategies"
  ON algo_strategies FOR ALL
  USING  (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Auto-update updated_at on row change
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER algo_strategies_updated_at
  BEFORE UPDATE ON algo_strategies
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ── supabase/migrations/20260806_floor_capacity.sql ──

CREATE TABLE IF NOT EXISTS floor_capacity_config (
  id             UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  max_active     INTEGER     NOT NULL DEFAULT 20,
  current_active INTEGER     NOT NULL DEFAULT 0,
  waitlist_open  BOOLEAN     DEFAULT true,
  updated_at     TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS floor_waitlist (
  id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  email        TEXT        NOT NULL,
  name         TEXT,
  current_tier TEXT,
  reason       TEXT,
  status       TEXT        DEFAULT 'pending', -- 'pending' | 'offered' | 'expired' | 'enrolled'
  created_at   TIMESTAMPTZ DEFAULT now()
);

-- RLS
ALTER TABLE floor_capacity_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE floor_waitlist ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read capacity" ON floor_capacity_config FOR SELECT TO public USING (true);
CREATE POLICY "Users can insert waitlist" ON floor_waitlist FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Users can view own waitlist" ON floor_waitlist FOR SELECT TO authenticated USING (auth.jwt()->>'email' = email);

-- Insert Default Config
INSERT INTO floor_capacity_config (max_active, current_active, waitlist_open)
VALUES (20, 0, true);

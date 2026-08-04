-- ── supabase/migrations/20260806_product_credits.sql ──

CREATE TABLE IF NOT EXISTS product_credits (
  id                     UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id                UUID        REFERENCES auth.users(id) ON DELETE CASCADE,
  source_product_id      TEXT        NOT NULL, -- e.g., 'prop-survival-kit'
  amount_pence           INTEGER     NOT NULL, -- credit amount
  applied_to_product_id  TEXT,                 -- e.g., 'edge' (if applied/used)
  applied_at             TIMESTAMPTZ,
  expires_at             TIMESTAMPTZ NOT NULL,
  created_at             TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, source_product_id)
);

-- RLS
ALTER TABLE product_credits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own credits" ON product_credits FOR SELECT TO authenticated USING (auth.uid() = user_id);

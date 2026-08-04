-- ── supabase/migrations/20260806_digital_purchases.sql ──

CREATE TABLE IF NOT EXISTS digital_purchases (
  id                     UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id                UUID        REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id             TEXT        NOT NULL, -- matches commercial catalogue product ID, e.g. 'prop-survival-kit'
  stripe_session_id      TEXT,
  purchased_at           TIMESTAMPTZ DEFAULT now(),
  permanent_entitlement  BOOLEAN     DEFAULT true,
  download_url_token     TEXT        UNIQUE,
  revoked                BOOLEAN     DEFAULT false,
  UNIQUE(user_id, product_id)
);

-- RLS
ALTER TABLE digital_purchases ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own purchases" ON digital_purchases FOR SELECT TO authenticated USING (auth.uid() = user_id);

-- Backfill from existing course_purchases for ebooks
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'course_purchases') THEN
    INSERT INTO digital_purchases (user_id, product_id, stripe_session_id, purchased_at, permanent_entitlement)
    SELECT 
      cp.user_id,
      c.slug as product_id,
      cp.stripe_session_id,
      cp.purchased_at,
      true
    FROM course_purchases cp
    JOIN courses c ON cp.course_id = c.id
    WHERE c.product_type = 'ebook'
    ON CONFLICT (user_id, product_id) DO NOTHING;
  END IF;
END $$;

-- ── supabase/migrations/20260806_subscription_audit_log.sql ──

CREATE TABLE IF NOT EXISTS subscription_migration_log (
  id             UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id        UUID        REFERENCES auth.users(id) ON DELETE CASCADE,
  action         TEXT        NOT NULL, -- 'upgrade' | 'downgrade' | 'price_migration' | 'cancel'
  old_tier       TEXT,
  new_tier       TEXT,
  old_price_id   TEXT,
  new_price_id   TEXT,
  admin_id       UUID        REFERENCES auth.users(id) ON DELETE SET NULL,
  notes          TEXT,
  executed_at    TIMESTAMPTZ DEFAULT now()
);

-- RLS
ALTER TABLE subscription_migration_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can read migration logs" ON subscription_migration_log FOR SELECT TO authenticated USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  )
);

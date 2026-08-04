-- ── supabase/migrations/20260806_commercial_catalogue.sql ──

CREATE TABLE IF NOT EXISTS commercial_products (
  id                       TEXT        PRIMARY KEY,
  slug                     TEXT        NOT NULL UNIQUE,
  name                     TEXT        NOT NULL,
  short_name               TEXT        NOT NULL,
  description              TEXT        NOT NULL,
  product_type             TEXT        NOT NULL, -- 'free_membership' | 'recurring_membership' | 'standalone_download' | 'standalone_course' | 'cohort_programme' | 'legacy_subscription'
  status                   TEXT        NOT NULL, -- 'active' | 'beta' | 'in_development' | 'planned' | 'sold_out' | 'waitlist' | 'legacy_grandfathered' | 'retired'
  available_for_purchase   BOOLEAN     DEFAULT true,
  currency                 TEXT        DEFAULT 'GBP',
  stripe_product_id        TEXT,
  display_order            INTEGER     NOT NULL DEFAULT 0,
  application_required     BOOLEAN     DEFAULT false,
  capacity                 INTEGER,
  admin_note               TEXT,
  created_at               TIMESTAMPTZ DEFAULT now(),
  updated_at               TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS product_prices (
  id                TEXT        PRIMARY KEY,
  product_id        TEXT        REFERENCES commercial_products(id) ON DELETE CASCADE,
  amount_pence      INTEGER     NOT NULL,
  interval          TEXT        NOT NULL, -- 'none' | 'month' | 'year' | 'one_time' | 'instalment'
  stripe_price_id   TEXT,
  active            BOOLEAN     DEFAULT true,
  tax_behaviour     TEXT        DEFAULT 'inclusive', -- 'inclusive' | 'exclusive' | 'unspecified'
  valid_from        TIMESTAMPTZ,
  valid_until       TIMESTAMPTZ,
  created_at        TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS product_entitlements (
  id                UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id        TEXT        REFERENCES commercial_products(id) ON DELETE CASCADE,
  entitlement_key   TEXT        NOT NULL, -- e.g. 'phase_1_curriculum', 'investment_centre'
  entitlement_name  TEXT        NOT NULL,
  access_type       TEXT        NOT NULL, -- 'active_subscription' | 'permanent' | 'time_limited'
  expires_after_days INTEGER,
  created_at        TIMESTAMPTZ DEFAULT now(),
  UNIQUE(product_id, entitlement_key)
);

-- Enable RLS
ALTER TABLE commercial_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_prices ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_entitlements ENABLE ROW LEVEL SECURITY;

-- Policies (Publicly readable, writeable only by service-role/admins)
CREATE POLICY "Public read products" ON commercial_products FOR SELECT TO public USING (true);
CREATE POLICY "Public read prices" ON product_prices FOR SELECT TO public USING (true);
CREATE POLICY "Public read entitlements" ON product_entitlements FOR SELECT TO public USING (true);

-- Seed Initial Products
INSERT INTO commercial_products (id, slug, name, short_name, description, product_type, status, available_for_purchase, display_order, admin_note)
VALUES
  ('free', 'free', 'Drawdown Free', 'Free', 'Phase 1 curriculum, basic risk calculators and manual trade journal.', 'free_membership', 'active', true, 1, 'Permanently free. No card required.'),
  ('foundation', 'foundation', 'Drawdown Foundation', 'Foundation', 'Foundation curriculum (Phases 1-4), Market Intelligence Hub, and core analysis tools.', 'recurring_membership', 'active', true, 2, 'Annual plan gets permanent download of Prop Survival Kit and How to Trade.'),
  ('edge', 'edge', 'Drawdown Edge', 'Edge', 'Advanced curriculum (Phases 5-10), Investment Centre access, and AI journal review.', 'recurring_membership', 'active', true, 3, 'Annual plan gets permanent download of all playbooks.'),
  ('floor', 'floor', 'The Floor', 'Floor', 'Complete released platform, 1-on-1s with Pete, and priority support.', 'recurring_membership', 'active', true, 4, 'Capped at 20 active members.'),
  ('accelerator', 'institutional-accelerator', 'Institutional Accelerator', 'Accelerator', 'Intensive 6-week cohort programme with 1-on-1 portfolio consultation.', 'cohort_programme', 'active', true, 5, 'Includes 12 months of Edge membership.'),
  ('signal-centre', 'signal-centre', 'Signal Centre', 'Signal Centre', 'Legacy signal and market intelligence subscription.', 'legacy_subscription', 'legacy_grandfathered', false, 6, 'Retired standalone tier. Existing members grandfathered.');

-- Seed Initial Prices
INSERT INTO product_prices (id, product_id, amount_pence, interval, stripe_price_id, active)
VALUES
  ('free_price', 'free', 0, 'none', NULL, true),
  ('foundation_monthly', 'foundation', 4900, 'month', 'price_GB_foundation_monthly', true),
  ('foundation_annual', 'foundation', 49000, 'year', 'price_GB_foundation_annual', true),
  ('edge_monthly_v2', 'edge', 9900, 'month', 'price_GB_edge_monthly', true),
  ('edge_annual_v2', 'edge', 99000, 'year', 'price_GB_edge_annual', true),
  ('floor_monthly', 'floor', 29900, 'month', 'price_GB_floor_monthly', true),
  ('accelerator_tuition', 'accelerator', 150000, 'one_time', 'price_accelerator_tuition', true),
  ('accelerator_instalments', 'accelerator', 55000, 'instalment', 'price_accelerator_instalments', true),
  ('signal_centre_legacy', 'signal-centre', 3900, 'month', 'price_signal_centre_monthly', true);

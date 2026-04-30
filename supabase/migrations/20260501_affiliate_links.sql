-- ============================================================
-- Affiliate Link Manager
-- Migration: 20260501_affiliate_links
-- ============================================================

CREATE TABLE IF NOT EXISTS affiliate_links (
  id               uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  slug             text        UNIQUE NOT NULL,
  display_name     text        NOT NULL,
  type             text        NOT NULL CHECK (type IN ('broker', 'prop_firm', 'tool', 'other')),
  destination_url  text        NOT NULL,
  commission_type  text,
  commission_detail text,
  is_active        boolean     DEFAULT true,
  notes            text,
  created_at       timestamptz DEFAULT now(),
  updated_at       timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS affiliate_clicks (
  id           uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  affiliate_id uuid        NOT NULL REFERENCES affiliate_links(id) ON DELETE CASCADE,
  user_id      uuid,
  source_url   text,
  region       text,
  ip_hash      text,
  clicked_at   timestamptz DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_affiliate_clicks_affiliate_id ON affiliate_clicks(affiliate_id);
CREATE INDEX IF NOT EXISTS idx_affiliate_clicks_clicked_at  ON affiliate_clicks(clicked_at);
CREATE INDEX IF NOT EXISTS idx_affiliate_links_slug         ON affiliate_links(slug);

-- RLS
ALTER TABLE affiliate_links  ENABLE ROW LEVEL SECURITY;
ALTER TABLE affiliate_clicks ENABLE ROW LEVEL SECURITY;

-- affiliate_links: anon can read active rows (needed by redirect route)
-- authenticated admin can do everything
CREATE POLICY "Public can read active affiliate links"
  ON affiliate_links FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admins can manage affiliate links"
  ON affiliate_links FOR ALL
  USING (auth.role() = 'authenticated');

-- affiliate_clicks: only admins can read; inserts happen server-side
CREATE POLICY "Admins can read affiliate clicks"
  ON affiliate_clicks FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Server can insert affiliate clicks"
  ON affiliate_clicks FOR INSERT
  WITH CHECK (true);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_affiliate_links_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_affiliate_links_updated_at
  BEFORE UPDATE ON affiliate_links
  FOR EACH ROW EXECUTE FUNCTION update_affiliate_links_updated_at();

-- ============================================================
-- SEED DATA
-- ============================================================

INSERT INTO affiliate_links (slug, display_name, type, destination_url, commission_type, commission_detail) VALUES
  ('ftmo',           'FTMO Challenge',        'prop_firm', 'https://ftmo.com',                          'Revenue Share', '15% per challenge'),
  ('the5ers',        'The 5%ers',             'prop_firm', 'https://the5ers.com',                       'Revenue Share', '10% per purchase'),
  ('fundednext',     'FundedNext',            'prop_firm', 'https://fundednext.com',                    'Revenue Share', '15% per challenge'),
  ('ig-markets',     'IG Markets UK',         'broker',    'https://ig.com',                            'CPA',           'CPA via Impact.com'),
  ('pepperstone',    'Pepperstone',           'broker',    'https://pepperstone.com',                   'CPA',           'CPA'),
  ('ic-markets',     'IC Markets',            'broker',    'https://icmarkets.com',                     'IB',            'IB Revenue Share'),
  ('cmc-markets',    'CMC Markets',           'broker',    'https://cmcmarkets.com',                    'CPA',           'CPA'),
  ('etoro',          'eToro',                 'broker',    'https://etoro.com',                         'CPA',           'CPA'),
  ('xtb',            'XTB',                   'broker',    'https://xtb.com',                           'CPA',           'CPA'),
  ('trading-212',    'Trading 212',           'broker',    'https://trading212.com',                    'Referral',      'Referral'),
  ('tastyfx',        'tastyfx (US)',          'broker',    'https://tastyfx.com',                       'CPA',           'CPA'),
  ('oanda',          'OANDA',                 'broker',    'https://oanda.com',                         'CPA',           'CPA'),
  ('forex-com',      'FOREX.com',             'broker',    'https://forex.com',                         'CPA',           'CPA'),
  ('tradingview',    'TradingView Pro',       'tool',      'https://tradingview.com/?aff_id=165855',    'Recurring',     '30% lifetime recurring'),
  ('eightcap',       'Eightcap (AU)',         'broker',    'https://eightcap.com',                      'CPA',           'CPA + Revenue Share'),
  ('fusion-markets', 'Fusion Markets (AU)',   'broker',    'https://fusionmarkets.com',                 'IB',            'IB'),
  ('fp-markets',     'FP Markets (AU)',       'broker',    'https://fpmarkets.com',                     'CPA',           'CPA'),
  ('pepperstone-au', 'Pepperstone (AU)',      'broker',    'https://pepperstone.com',                   'CPA',           'CPA')
ON CONFLICT (slug) DO NOTHING;

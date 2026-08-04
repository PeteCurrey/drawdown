-- Migrate: Affiliate Links and Clicks Schema
-- Path: supabase/migrations/20260804_affiliate_links_and_clicks.sql

-- 1. Create the affiliate_links table
CREATE TABLE IF NOT EXISTS public.affiliate_links (
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

-- 2. Create the affiliate_clicks table
CREATE TABLE IF NOT EXISTS public.affiliate_clicks (
  id                 uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  affiliate_id       uuid        REFERENCES public.affiliate_links(id) ON DELETE CASCADE,
  user_id            uuid,
  source_url         text,
  region             text,
  ip_hash            text,
  clicked_at         timestamptz DEFAULT now(),
  created_at         timestamptz DEFAULT now(),
  slug               text,
  destination_url    text,
  has_affiliate_link boolean     DEFAULT false,
  referrer           text,
  vertical           text,
  target_id          text,
  source_page        text
);

-- 3. Create indexes for quick lookup and analytics
CREATE INDEX IF NOT EXISTS idx_affiliate_clicks_affiliate_id ON public.affiliate_clicks(affiliate_id);
CREATE INDEX IF NOT EXISTS idx_affiliate_clicks_clicked_at  ON public.affiliate_clicks(clicked_at);
CREATE INDEX IF NOT EXISTS idx_affiliate_links_slug         ON public.affiliate_links(slug);

-- 4. Enable Row Level Security (RLS)
ALTER TABLE public.affiliate_links  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.affiliate_clicks ENABLE ROW LEVEL SECURITY;

-- 5. Drop existing policies to prevent conflicts
DROP POLICY IF EXISTS "Public can read active affiliate links" ON public.affiliate_links;
DROP POLICY IF EXISTS "Admins can manage affiliate links" ON public.affiliate_links;
DROP POLICY IF EXISTS "Admins can read affiliate clicks" ON public.affiliate_clicks;
DROP POLICY IF EXISTS "Server can insert affiliate clicks" ON public.affiliate_clicks;

-- 6. Create RLS policies
CREATE POLICY "Public can read active affiliate links"
  ON public.affiliate_links FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admins can manage affiliate links"
  ON public.affiliate_links FOR ALL
  USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can read affiliate clicks"
  ON public.affiliate_clicks FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Server can insert affiliate clicks"
  ON public.affiliate_clicks FOR INSERT
  WITH CHECK (true);

-- 7. Trigger to automatically update updated_at on affiliate_links
CREATE OR REPLACE FUNCTION public.update_affiliate_links_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_affiliate_links_updated_at ON public.affiliate_links;
CREATE TRIGGER trg_affiliate_links_updated_at
  BEFORE UPDATE ON public.affiliate_links
  FOR EACH ROW EXECUTE FUNCTION public.update_affiliate_links_updated_at();

-- 8. Trigger to automatically map slug to affiliate_id on click insertion
CREATE OR REPLACE FUNCTION public.fill_affiliate_id_from_slug()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.affiliate_id IS NULL AND NEW.slug IS NOT NULL THEN
    SELECT id INTO NEW.affiliate_id FROM public.affiliate_links WHERE slug = NEW.slug;
  END IF;
  IF NEW.clicked_at IS NULL THEN
    NEW.clicked_at = now();
  END IF;
  IF NEW.created_at IS NULL THEN
    NEW.created_at = now();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_fill_affiliate_id_from_slug ON public.affiliate_clicks;
CREATE TRIGGER trg_fill_affiliate_id_from_slug
  BEFORE INSERT ON public.affiliate_clicks
  FOR EACH ROW EXECUTE FUNCTION public.fill_affiliate_id_from_slug();

-- 9. Seed production links
INSERT INTO public.affiliate_links (slug, display_name, type, destination_url, commission_type, commission_detail)
VALUES 
  ('ftmo', 'FTMO Challenge', 'prop_firm', 'https://trader.ftmo.com/?affiliates=IuDKuiDWoYwPvOzBWcSy', 'Revenue Share', '15% per challenge'),
  ('the5ers', 'The 5%ers', 'prop_firm', 'https://www.the5ers.com/?afmc=1dv0', 'Revenue Share', '10% per purchase'),
  ('funding-pips', 'Funding Pips', 'prop_firm', 'https://fundingpips.com', NULL, NULL),
  ('ig', 'IG Markets UK', 'broker', 'https://www.ig.com/uk', 'CPA', 'CPA via Impact.com'),
  ('pepperstone', 'Pepperstone', 'broker', 'https://pepperstone.com/en-gb/', 'CPA', 'CPA'),
  ('ic-markets', 'IC Markets', 'broker', 'https://icmarkets.com/en-gb/', 'IB', 'IB Revenue Share'),
  ('trading-212', 'Trading 212', 'broker', 'https://www.trading212.com', 'Referral', 'Referral'),
  ('xtb', 'XTB', 'broker', 'https://www.xtb.com/uk', 'CPA', 'CPA'),
  ('cmc-markets', 'CMC Markets', 'broker', 'https://www.cmcmarkets.com/en-gb/', 'CPA', 'CPA'),
  ('fp-markets', 'FP Markets', 'broker', 'https://www.fpmarkets.com/', 'CPA', 'CPA'),
  ('city-index', 'City Index', 'broker', 'https://www.cityindex.com/en-uk/', 'CPA', 'CPA'),
  ('spreadex', 'Spreadex', 'broker', 'https://www.spreadex.com/', 'CPA', 'CPA'),
  ('tastyfx', 'tastyfx', 'broker', 'https://www.tastyfx.com/uk', 'CPA', 'CPA'),
  ('fusion-markets', 'Fusion Markets', 'broker', 'https://fusionmarkets.com/en-gb/', 'IB', 'IB'),
  ('tradingview', 'TradingView Pro', 'tool', 'https://www.tradingview.com/?aff_id=165855', 'Recurring', '30% lifetime recurring')
ON CONFLICT (slug) DO UPDATE
SET display_name = EXCLUDED.display_name,
    type = EXCLUDED.type,
    destination_url = EXCLUDED.destination_url,
    commission_type = EXCLUDED.commission_type,
    commission_detail = EXCLUDED.commission_detail;

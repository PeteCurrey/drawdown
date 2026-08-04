import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { config } from 'dotenv';
import pg from 'pg';
import dns from 'dns';

// Force DNS resolution to prefer IPv4 over IPv6
dns.setDefaultResultOrder('ipv4first');

const __dirname = dirname(fileURLToPath(import.meta.url));
config({ path: join(__dirname, '../.env.local') });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const PROJECT_REF = SUPABASE_URL.replace('https://', '').replace('.supabase.co', '');

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const REGIONS = [
  'eu-west-2',     // London
  'eu-west-1',     // Ireland
  'eu-central-1',  // Frankfurt
  'us-east-1',     // N. Virginia
  'us-east-2',     // Ohio
  'us-west-1',     // N. California
  'us-west-2',     // Oregon
  'ap-southeast-1' // Singapore
];

const sqlSchema = `
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

CREATE INDEX IF NOT EXISTS idx_affiliate_clicks_affiliate_id ON public.affiliate_clicks(affiliate_id);
CREATE INDEX IF NOT EXISTS idx_affiliate_clicks_clicked_at  ON public.affiliate_clicks(clicked_at);
CREATE INDEX IF NOT EXISTS idx_affiliate_links_slug         ON public.affiliate_links(slug);

ALTER TABLE public.affiliate_links  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.affiliate_clicks ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can read active affiliate links" ON public.affiliate_links;
DROP POLICY IF EXISTS "Admins can manage affiliate links" ON public.affiliate_links;
DROP POLICY IF EXISTS "Admins can read affiliate clicks" ON public.affiliate_clicks;
DROP POLICY IF EXISTS "Server can insert affiliate clicks" ON public.affiliate_clicks;

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
`;

const seedLinks = [
  { slug: 'ftmo', display_name: 'FTMO Challenge', type: 'prop_firm', destination_url: 'https://trader.ftmo.com/?affiliates=IuDKuiDWoYwPvOzBWcSy', commission_type: 'Revenue Share', commission_detail: '15% per challenge' },
  { slug: 'the5ers', display_name: 'The 5%ers', type: 'prop_firm', destination_url: 'https://www.the5ers.com/?afmc=1dv0', commission_type: 'Revenue Share', commission_detail: '10% per purchase' },
  { slug: 'funding-pips', display_name: 'Funding Pips', type: 'prop_firm', destination_url: 'https://fundingpips.com', commission_type: null, commission_detail: null },
  { slug: 'ig', display_name: 'IG Markets UK', type: 'broker', destination_url: 'https://www.ig.com/uk', commission_type: 'CPA', commission_detail: 'CPA via Impact.com' },
  { slug: 'pepperstone', display_name: 'Pepperstone', type: 'broker', destination_url: 'https://pepperstone.com/en-gb/', commission_type: 'CPA', commission_detail: 'CPA' },
  { slug: 'ic-markets', display_name: 'IC Markets', type: 'broker', destination_url: 'https://icmarkets.com/en-gb/', commission_type: 'IB', commission_detail: 'IB Revenue Share' },
  { slug: 'trading-212', display_name: 'Trading 212', type: 'broker', destination_url: 'https://www.trading212.com', commission_type: 'Referral', commission_detail: 'Referral' },
  { slug: 'xtb', display_name: 'XTB', type: 'broker', destination_url: 'https://www.xtb.com/uk', commission_type: 'CPA', commission_detail: 'CPA' },
  { slug: 'cmc-markets', display_name: 'CMC Markets', type: 'broker', destination_url: 'https://www.cmcmarkets.com/en-gb/', commission_type: 'CPA', commission_detail: 'CPA' },
  { slug: 'fp-markets', display_name: 'FP Markets', type: 'broker', destination_url: 'https://www.fpmarkets.com/', commission_type: 'CPA', commission_detail: 'CPA' },
  { slug: 'city-index', display_name: 'City Index', type: 'broker', destination_url: 'https://www.cityindex.com/en-uk/', commission_type: 'CPA', commission_detail: 'CPA' },
  { slug: 'spreadex', display_name: 'Spreadex', type: 'broker', destination_url: 'https://www.spreadex.com/', commission_type: 'CPA', commission_detail: 'CPA' },
  { slug: 'tastyfx', display_name: 'tastyfx', type: 'broker', destination_url: 'https://www.tastyfx.com/uk', commission_type: 'CPA', commission_detail: 'CPA' },
  { slug: 'fusion-markets', display_name: 'Fusion Markets', type: 'broker', destination_url: 'https://fusionmarkets.com/en-gb/', commission_type: 'IB', commission_detail: 'IB' },
  { slug: 'tradingview', display_name: 'TradingView Pro', type: 'tool', destination_url: 'https://www.tradingview.com/?aff_id=165855', commission_type: 'Recurring', commission_detail: '30% lifetime recurring' }
];

async function deploy() {
  let successfulClient = null;
  let activeRegion = null;
  const user = `postgres.${PROJECT_REF}`;
  
  console.log(`Scanning regional poolers for Supabase project ${PROJECT_REF}...`);
  
  for (const region of REGIONS) {
    const host = `aws-0-${region}.pooler.supabase.com`;
    console.log(`Trying pooler in region ${region} (${host})...`);
    
    const client = new pg.Client({
      host: host,
      port: 5432,
      database: 'postgres',
      user: user,
      password: SERVICE_ROLE_KEY,
      ssl: { rejectUnauthorized: false },
      connectionTimeoutMillis: 5000 // fast timeout for scanning
    });
    
    try {
      await client.connect();
      console.log(`\n✅ SUCCESS! Connected to active pooler in region: ${region}`);
      successfulClient = client;
      activeRegion = region;
      break;
    } catch (err) {
      console.log(`   Region ${region} failed: ${err.message.split('\n')[0]}`);
      await client.end().catch(() => {});
    }
  }
  
  if (!successfulClient) {
    console.error('\n❌ Could not connect to any regional database pooler.');
    process.exit(1);
  }
  
  try {
    console.log('Executing SQL schema creation...');
    await successfulClient.query(sqlSchema);
    console.log('✅ Schema and triggers created successfully.');

    console.log('Seeding affiliate links...');
    for (const link of seedLinks) {
      const query = `
        INSERT INTO public.affiliate_links (slug, display_name, type, destination_url, commission_type, commission_detail)
        VALUES ($1, $2, $3, $4, $5, $6)
        ON CONFLICT (slug) DO UPDATE
        SET display_name = EXCLUDED.display_name,
            type = EXCLUDED.type,
            destination_url = EXCLUDED.destination_url,
            commission_type = EXCLUDED.commission_type,
            commission_detail = EXCLUDED.commission_detail;
      `;
      await successfulClient.query(query, [
        link.slug,
        link.display_name,
        link.type,
        link.destination_url,
        link.commission_type,
        link.commission_detail
      ]);
    }
    console.log(`✅ Seeded ${seedLinks.length} affiliate links successfully.`);
  } catch (error) {
    console.error('❌ Direct PostgreSQL migration failed:', error.message);
    process.exit(1);
  } finally {
    await successfulClient.end();
  }
}

deploy().catch(console.error);

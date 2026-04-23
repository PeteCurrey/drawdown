-- DRAWDOWN ADMIN INTELLIGENCE & COMPETITOR MAPPING

-- Competitors Table
CREATE TABLE IF NOT EXISTS competitors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  category TEXT NOT NULL, -- broker, media, prop-firm
  monitored_keywords TEXT[],
  last_crawl_at TIMESTAMPTZ,
  health_status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Competitor Intelligence Logs
CREATE TABLE IF NOT EXISTS competitor_intelligence (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  competitor_id UUID REFERENCES competitors(id) ON DELETE CASCADE,
  trend_topic TEXT,
  observation TEXT,
  impact_score INT CHECK (impact_score >= 1 AND impact_score <= 10),
  action_taken BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- AI Content Drafts
CREATE TABLE IF NOT EXISTS ai_content_drafts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  target_platform TEXT NOT NULL, -- blog, twitter, linkedin, newsletter
  status TEXT DEFAULT 'draft', -- draft, published, archived
  meta_data JSONB,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Add sample competitors (Real world data)
INSERT INTO competitors (name, url, category, monitored_keywords) VALUES
('Investopedia', 'https://www.investopedia.com', 'media', ARRAY['trading psychology', 'best brokers', 'technical analysis']),
('Forex.com', 'https://www.forex.com', 'broker', ARRAY['forex signals', 'trading platforms', 'spreads']),
('FTMO', 'https://ftmo.com', 'prop-firm', ARRAY['funding challenge', 'trading results', 'prop firm rules']),
('BabyPips', 'https://www.babypips.com', 'media', ARRAY['forex education', 'market analysis', 'beginner trading']),
('IG Markets', 'https://www.ig.com', 'broker', ARRAY['spread betting', 'fca regulation', 'market range']),
('Pepperstone', 'https://pepperstone.com', 'broker', ARRAY['raw spreads', 'ctrader', 'tradingview integration']),
('Interactive Brokers', 'https://www.interactivebrokers.com', 'broker', ARRAY['institutional trading', 'tws', 'lowest commissions']);

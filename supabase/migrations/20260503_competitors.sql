-- Competitor Tracker Table
CREATE TABLE IF NOT EXISTS competitor_tracking (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    url TEXT UNIQUE NOT NULL,
    seo_visibility_score INT,
    top_keywords TEXT[],
    last_crawled_at TIMESTAMPTZ,
    ai_analysis_summary TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE competitor_tracking ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage competitor tracking"
  ON competitor_tracking FOR ALL
  USING (auth.role() = 'authenticated');

-- Seed initial competitors
INSERT INTO competitor_tracking (name, url, seo_visibility_score, top_keywords)
VALUES 
('BabyPips', 'https://www.babypips.com', 95, ARRAY['learn forex', 'forex for beginners', 'forex glossary']),
('DailyFX', 'https://www.dailyfx.com', 88, ARRAY['market news', 'forex calendar', 'live rates']),
('Investopedia', 'https://www.investopedia.com', 99, ARRAY['trading definitions', 'stock market 101']),
('Forex.com Learning', 'https://www.forex.com/en-uk/education/', 75, ARRAY['trading strategy', 'uk forex brokers'])
ON CONFLICT (url) DO NOTHING;

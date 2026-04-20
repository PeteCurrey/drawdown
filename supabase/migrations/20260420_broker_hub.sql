-- Broker Affiliates & Click Tracking Schema

-- 1. Broker Affiliates Table
CREATE TABLE IF NOT EXISTS broker_affiliates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    logo_url TEXT,
    type TEXT CHECK (type IN ('broker', 'prop_firm', 'tool')),
    affiliate_url TEXT NOT NULL,
    best_for TEXT,
    rating DECIMAL(3,1) DEFAULT 0.0,
    min_deposit TEXT,
    spread_from TEXT,
    platforms TEXT[],
    leverage TEXT,
    fca_regulated BOOLEAN DEFAULT false,
    pros TEXT[],
    cons TEXT[],
    review_content TEXT,
    category_tags TEXT[],
    display_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    commission_type TEXT, -- 'CPA', 'revenue_share', 'hybrid'
    commission_detail TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Click Tracking Table
CREATE TABLE IF NOT EXISTS broker_clicks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    broker_id UUID REFERENCES broker_affiliates(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    source_page TEXT,
    clicked_at TIMESTAMPTZ DEFAULT NOW(),
    ip_hash TEXT
);

-- Indexing for performance
CREATE INDEX IF NOT EXISTS idx_broker_clicks_broker_id ON broker_clicks(broker_id);
CREATE INDEX IF NOT EXISTS idx_broker_clicks_clicked_at ON broker_clicks(clicked_at);

-- RLS Policies
ALTER TABLE broker_affiliates ENABLE ROW LEVEL SECURITY;
ALTER TABLE broker_clicks ENABLE ROW LEVEL SECURITY;

-- Public can read active brokers
CREATE POLICY "Public Read Active Brokers" ON broker_affiliates
    FOR SELECT USING (is_active = true);

-- Only service role/admins can view clicks
CREATE POLICY "Admin Read Clicks" ON broker_clicks
    FOR SELECT TO service_role USING (true);

-- Anyone can insert a click (via API)
CREATE POLICY "Public Insert Clicks" ON broker_clicks
    FOR INSERT WITH CHECK (true);

-- DRAWDOWN PHASE 2 SCHEMA EXPANSION

-- Daily Briefs (The Wire)
CREATE TABLE IF NOT EXISTS daily_briefs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  brief_date DATE UNIQUE NOT NULL,
  content_html TEXT NOT NULL,
  content_text TEXT NOT NULL,
  market_data JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Weekly Roundups
CREATE TABLE IF NOT EXISTS weekly_roundups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  week_ending DATE UNIQUE NOT NULL,
  content_html TEXT NOT NULL,
  content_text TEXT NOT NULL,
  market_data JSONB,
  auto_published_as_blog BOOLEAN DEFAULT false,
  blog_post_id UUID, -- FK to blog_posts would go here if it exists as a table
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Broker Affiliates
CREATE TABLE IF NOT EXISTS broker_affiliates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  broker_name TEXT NOT NULL,
  broker_slug TEXT UNIQUE NOT NULL,
  logo_url TEXT,
  affiliate_url TEXT NOT NULL,
  rating DECIMAL(3,2),
  min_deposit TEXT,
  spread_from TEXT,
  platforms TEXT[],
  fca_regulated BOOLEAN DEFAULT false,
  summary TEXT,
  pros TEXT[],
  cons TEXT[],
  category_tags TEXT[],
  review_content TEXT,
  is_active BOOLEAN DEFAULT true,
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Broker Clicks (Tracking)
CREATE TABLE IF NOT EXISTS broker_clicks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  broker_id UUID REFERENCES broker_affiliates(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  source_page TEXT,
  clicked_at TIMESTAMPTZ DEFAULT now()
);

-- Course Modules
CREATE TABLE IF NOT EXISTS course_modules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phase INT NOT NULL,
  module_number INT NOT NULL,
  title TEXT NOT NULL,
  subtitle TEXT,
  description TEXT,
  video_url TEXT, -- Mux playback ID or Cloudflare Stream URL
  content_mdx TEXT,
  resources JSONB DEFAULT '[]'::jsonb,
  transcript TEXT,
  quiz_questions JSONB DEFAULT '[]'::jsonb,
  duration_minutes INT DEFAULT 0,
  tier_required TEXT DEFAULT 'free', -- free, foundation, edge
  is_published BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(phase, module_number)
);

-- Video Watch Progress
CREATE TABLE IF NOT EXISTS video_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  module_id UUID REFERENCES course_modules(id) ON DELETE CASCADE,
  last_position_seconds INT DEFAULT 0,
  total_watch_time_seconds INT DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, module_id)
);

-- Programmatic SEO Pages
CREATE TABLE IF NOT EXISTS seo_pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_type TEXT NOT NULL, -- how_to, glossary, learn_to_trade, location
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  seo_title TEXT,
  seo_description TEXT,
  content TEXT, -- MDX or HTML
  parent_topic TEXT,
  location TEXT,
  target_keywords TEXT[],
  word_count INT,
  is_published BOOLEAN DEFAULT false,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Market Data Cache
CREATE TABLE IF NOT EXISTS market_data_cache (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  instrument TEXT NOT NULL,
  data_type TEXT NOT NULL, -- price, ohlcv, indicators
  data JSONB NOT NULL,
  fetched_at TIMESTAMPTZ DEFAULT now(),
  expires_at TIMESTAMPTZ NOT NULL,
  UNIQUE(instrument, data_type)
);

-- Newsletter Logs
CREATE TABLE IF NOT EXISTS newsletter_sends (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subject TEXT NOT NULL,
  content_html TEXT NOT NULL,
  sent_at TIMESTAMPTZ DEFAULT now(),
  recipient_count INT DEFAULT 0,
  open_rate DECIMAL(5,2),
  click_rate DECIMAL(5,2)
);

-- Notifications
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL, -- ai_alert, streak, achievement, system, trade_alert
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  read BOOLEAN DEFAULT false,
  action_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- User Badges (Gamification)
CREATE TABLE IF NOT EXISTS user_badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  badge_key TEXT NOT NULL,
  awarded_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, badge_key)
);

-- Newsletter Subscribers
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  tier TEXT DEFAULT 'free',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Course Discussions
CREATE TABLE IF NOT EXISTS discussions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  module_id UUID REFERENCES course_modules(id) ON DELETE CASCADE,
  parent_id UUID REFERENCES discussions(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- RLS POLICIES

-- Profiles (Publicly readable, only owner updates)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
-- (Assuming base profile policies already exist)

-- Daily Briefs (Publicly readable for paid tiers later checked in code/middleware)
ALTER TABLE daily_briefs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read for daily_briefs" ON daily_briefs FOR SELECT USING (true);

-- Broker Affiliates (Publicly readable)
ALTER TABLE broker_affiliates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read for broker_affiliates" ON broker_affiliates FOR SELECT USING (is_active = true);

-- SEO Pages (Publicly readable)
ALTER TABLE seo_pages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read for seo_pages" ON seo_pages FOR SELECT USING (is_published = true);

-- Journal Entries (Owner only)
ALTER TABLE journal_entries ENABLE ROW LEVEL SECURITY;
-- (Assuming owner policy already exists)

-- Market Data Cache (Public read, internal write)
ALTER TABLE market_data_cache ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read for market_data_cache" ON market_data_cache FOR SELECT USING (true);

-- Notifications (Owner only)
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Owner read for notifications" ON notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Owner update for notifications" ON notifications FOR UPDATE USING (auth.uid() = user_id);

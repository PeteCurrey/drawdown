-- DRAWDOWN PHASE 4A: THE WIRE NEWSLETTER SYSTEM

-- Enable ENUM types
DO $$ BEGIN
    CREATE TYPE newsletter_edition_type AS ENUM ('daily', 'weekend');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE newsletter_status AS ENUM ('generating', 'draft', 'scheduled', 'sending', 'sent', 'failed', 'cancelled');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE subscription_tier AS ENUM ('free', 'foundation', 'edge', 'floor');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE subscriber_status AS ENUM ('active', 'unsubscribed', 'bounced', 'complained');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE edition_preference AS ENUM ('daily', 'weekend', 'both');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 1. Newsletter Editions
CREATE TABLE IF NOT EXISTS newsletter_editions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  edition_type newsletter_edition_type NOT NULL,
  status newsletter_status DEFAULT 'generating',
  scheduled_send_at TIMESTAMPTZ NOT NULL,
  sent_at TIMESTAMPTZ,
  subject_line TEXT,
  preview_text TEXT,
  html_content TEXT,
  plain_text_content TEXT,
  ai_generated_json JSONB,
  human_edited BOOLEAN DEFAULT false,
  edited_by UUID REFERENCES profiles(id),
  resend_broadcast_id TEXT,
  recipient_count INTEGER,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Newsletter Sections
CREATE TABLE IF NOT EXISTS newsletter_sections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  edition_id UUID REFERENCES newsletter_editions(id) ON DELETE CASCADE,
  section_key TEXT NOT NULL,
  section_title TEXT NOT NULL,
  ai_content TEXT,
  edited_content TEXT,
  display_order INTEGER DEFAULT 0,
  is_visible BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Newsletter Subscribers
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  first_name TEXT,
  subscription_tier subscription_tier DEFAULT 'free',
  status subscriber_status DEFAULT 'active',
  edition_preference edition_preference DEFAULT 'both',
  locale TEXT DEFAULT 'uk',
  source TEXT,
  subscribed_at TIMESTAMPTZ DEFAULT now(),
  unsubscribed_at TIMESTAMPTZ,
  resend_contact_id TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Newsletter Analytics
CREATE TABLE IF NOT EXISTS newsletter_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  edition_id UUID REFERENCES newsletter_editions(id) ON DELETE SET NULL,
  resend_event_type TEXT NOT NULL,
  subscriber_id UUID REFERENCES newsletter_subscribers(id) ON DELETE SET NULL,
  link_url TEXT,
  occurred_at TIMESTAMPTZ DEFAULT now(),
  resend_event_id TEXT UNIQUE
);

-- 5. Newsletter Settings
CREATE TABLE IF NOT EXISTS newsletter_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  daily_enabled BOOLEAN DEFAULT true,
  weekend_enabled BOOLEAN DEFAULT true,
  daily_send_time TIME DEFAULT '07:00:00',
  weekend_send_time TIME DEFAULT '08:00:00',
  auto_send_enabled BOOLEAN DEFAULT false,
  require_approval BOOLEAN DEFAULT true,
  from_name TEXT DEFAULT 'Pete @ Drawdown',
  from_email TEXT DEFAULT 'thewire@drawdown.trading',
  reply_to TEXT DEFAULT 'hello@drawdown.trading',
  subject_prefix TEXT DEFAULT 'The Wire:',
  footer_unsubscribe_text TEXT DEFAULT 'You''re receiving this because you subscribed to The Wire. Unsubscribe anytime.',
  design_tokens JSONB DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Insert default settings row if not exists
INSERT INTO newsletter_settings (id) 
SELECT gen_random_uuid() 
WHERE NOT EXISTS (SELECT 1 FROM newsletter_settings);

-- RLS POLICIES
ALTER TABLE newsletter_editions ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_settings ENABLE ROW LEVEL SECURITY;

-- Admin-only policies
CREATE POLICY "Admin only select editions" ON newsletter_editions FOR SELECT USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "Admin only insert editions" ON newsletter_editions FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "Admin only update editions" ON newsletter_editions FOR UPDATE USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- Public read for sent editions (for archive)
CREATE POLICY "Public read sent editions" ON newsletter_editions FOR SELECT USING (status = 'sent');

-- Section policies
CREATE POLICY "Admin manage sections" ON newsletter_sections FOR ALL USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "Public read sections of sent editions" ON newsletter_sections FOR SELECT USING (EXISTS (SELECT 1 FROM newsletter_editions WHERE id = edition_id AND status = 'sent'));

-- Subscriber policies
CREATE POLICY "Admin manage subscribers" ON newsletter_subscribers FOR ALL USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "Public insert subscribers" ON newsletter_subscribers FOR INSERT WITH CHECK (true);

-- Analytics & Settings (Admin only)
CREATE POLICY "Admin manage analytics" ON newsletter_analytics FOR ALL USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "Admin manage settings" ON newsletter_settings FOR ALL USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

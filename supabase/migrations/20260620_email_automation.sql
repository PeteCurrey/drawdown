-- DRAWDOWN PHASE 4B: EMAIL AUTOMATION SYSTEM & BLOG_POSTS SCHEMA

-- 1. Create email_subscribers table
CREATE TABLE IF NOT EXISTS email_subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  first_name TEXT,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  subscribed_morning BOOLEAN DEFAULT true,
  subscribed_evening BOOLEAN DEFAULT true,
  subscribed_weekly BOOLEAN DEFAULT true,
  subscribed_at TIMESTAMPTZ DEFAULT now(),
  unsubscribed_at TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT true,
  source TEXT DEFAULT 'signup', -- 'signup', 'marketing', 'manual'
  tags TEXT[] DEFAULT '{}',
  resend_contact_id TEXT, -- store Resend contact ID for management
  unsubscribe_token TEXT UNIQUE DEFAULT encode(gen_random_bytes(32), 'hex')
);

-- Index for quick lookups on unsubscribe tokens and user_ids
CREATE INDEX IF NOT EXISTS idx_email_subscribers_token ON email_subscribers(unsubscribe_token);
CREATE INDEX IF NOT EXISTS idx_email_subscribers_user_id ON email_subscribers(user_id);
CREATE INDEX IF NOT EXISTS idx_email_subscribers_email ON email_subscribers(email);

-- 2. Create email_sends table
CREATE TABLE IF NOT EXISTS email_sends (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL, -- 'morning_brief', 'evening_wrap', 'welcome', 'weekly'
  subject TEXT NOT NULL,
  content_html TEXT NOT NULL,
  content_text TEXT,
  generated_at TIMESTAMPTZ DEFAULT now(),
  sent_at TIMESTAMPTZ,
  recipient_count INTEGER DEFAULT 0,
  resend_broadcast_id TEXT,
  status TEXT DEFAULT 'pending', -- 'pending', 'sending', 'sent', 'failed'
  error_message TEXT,
  metadata JSONB DEFAULT '{}'::jsonb -- store market data used, Claude model etc.
);

CREATE INDEX IF NOT EXISTS idx_email_sends_type ON email_sends(type);
CREATE INDEX IF NOT EXISTS idx_email_sends_status ON email_sends(status);

-- 3. Create email_opens table
CREATE TABLE IF NOT EXISTS email_opens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email_send_id UUID REFERENCES email_sends(id) ON DELETE CASCADE,
  subscriber_id UUID REFERENCES email_subscribers(id) ON DELETE CASCADE,
  opened_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Create blog_posts table
CREATE TABLE IF NOT EXISTS blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  content TEXT NOT NULL,
  category TEXT DEFAULT 'Market Analysis',
  excerpt TEXT,
  author TEXT DEFAULT 'Pete Currey',
  published BOOLEAN DEFAULT true,
  published_at TIMESTAMPTZ DEFAULT now(),
  tags TEXT[] DEFAULT '{}',
  meta_title TEXT,
  meta_description TEXT,
  image TEXT,
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published ON blog_posts(published, published_at DESC);

-- Enable RLS
ALTER TABLE email_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_sends ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_opens ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

-- Policies
-- Email tables are service-role only (no public/auth policies defined means only service role has access)

-- Blog posts policies
CREATE POLICY "Allow public read access for published posts" 
  ON blog_posts 
  FOR SELECT 
  USING (published = true);

CREATE POLICY "Allow admin to manage blog posts" 
  ON blog_posts 
  FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- Backfill data from newsletter_subscribers if it exists
DO $$
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'newsletter_subscribers') THEN
    INSERT INTO email_subscribers (email, first_name, is_active, source, subscribed_at, resend_contact_id)
    SELECT email, first_name, (status = 'active'), source, subscribed_at, resend_contact_id
    FROM newsletter_subscribers
    ON CONFLICT (email) DO NOTHING;
  END IF;
END $$;

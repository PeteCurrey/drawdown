-- Migration: platform_settings & floor_waitlist

CREATE TABLE IF NOT EXISTS platform_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  setting_key TEXT UNIQUE NOT NULL,
  setting_value JSONB NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Insert default Floor cap
INSERT INTO platform_settings (setting_key, setting_value)
VALUES ('floor_cap', '15'::jsonb)
ON CONFLICT (setting_key) DO NOTHING;

CREATE TABLE IF NOT EXISTS floor_waitlist (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- RLS
ALTER TABLE platform_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE floor_waitlist ENABLE ROW LEVEL SECURITY;

-- Allow public read of platform_settings (needed for pricing page)
CREATE POLICY "Public read platform_settings" ON platform_settings FOR SELECT USING (true);
CREATE POLICY "Admin full access platform_settings" ON platform_settings USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND (role = 'admin' OR is_admin = true))
);

-- Allow public insert to floor_waitlist
CREATE POLICY "Public insert floor_waitlist" ON floor_waitlist FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin read floor_waitlist" ON floor_waitlist FOR SELECT USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND (role = 'admin' OR is_admin = true))
);


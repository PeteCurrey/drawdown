-- Migration: service_delivery tables

-- Alter floor_waitlist to include tier and status if they don't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'floor_waitlist' AND column_name = 'tier') THEN
    ALTER TABLE floor_waitlist ADD COLUMN tier TEXT DEFAULT 'floor';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'floor_waitlist' AND column_name = 'status') THEN
    ALTER TABLE floor_waitlist ADD COLUMN status TEXT DEFAULT 'pending';
  END IF;
END $$;

-- 1. weekly_breakdowns
CREATE TABLE IF NOT EXISTS weekly_breakdowns (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  video_url TEXT,
  summary_md TEXT,
  week_of DATE,
  published_at TIMESTAMP WITH TIME ZONE,
  tier_required TEXT DEFAULT 'foundation',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. live_events
CREATE TABLE IF NOT EXISTS live_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  event_type TEXT NOT NULL, -- e.g. 'q_and_a', 'market_prep'
  scheduled_at TIMESTAMP WITH TIME ZONE NOT NULL,
  duration_mins INTEGER DEFAULT 60,
  meeting_url TEXT,
  replay_url TEXT,
  tier_required TEXT DEFAULT 'edge',
  status TEXT DEFAULT 'scheduled', -- 'scheduled', 'live', 'completed', 'cancelled'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. mentorship_sessions
CREATE TABLE IF NOT EXISTS mentorship_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  member_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  booked_for TIMESTAMP WITH TIME ZONE NOT NULL,
  cal_booking_uid TEXT,
  status TEXT DEFAULT 'scheduled', -- 'scheduled', 'completed', 'cancelled'
  notes_md TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. service_delivery_log
CREATE TABLE IF NOT EXISTS service_delivery_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_type TEXT NOT NULL, -- e.g. 'weekly_breakdown_published', 'event_held', 'session_delivered'
  event_id UUID, -- References the specific item
  member_id UUID REFERENCES auth.users(id) ON DELETE CASCADE, -- Optional if applicable to a single member
  delivered_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- RLS
ALTER TABLE weekly_breakdowns ENABLE ROW LEVEL SECURITY;
ALTER TABLE live_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE mentorship_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_delivery_log ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view published weekly_breakdowns" ON weekly_breakdowns FOR SELECT USING (published_at <= now());
CREATE POLICY "Users can view live_events" ON live_events FOR SELECT USING (true);
CREATE POLICY "Users can view their own mentorship_sessions" ON mentorship_sessions FOR SELECT USING (member_id = auth.uid());
CREATE POLICY "Users can view their own service_delivery_log" ON service_delivery_log FOR SELECT USING (member_id = auth.uid() OR member_id IS NULL);

-- Admin Policies
CREATE POLICY "Admin full access weekly_breakdowns" ON weekly_breakdowns USING (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND (profiles.role = 'admin' OR profiles.is_admin = true))
);
CREATE POLICY "Admin full access live_events" ON live_events USING (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND (profiles.role = 'admin' OR profiles.is_admin = true))
);
CREATE POLICY "Admin full access mentorship_sessions" ON mentorship_sessions USING (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND (profiles.role = 'admin' OR profiles.is_admin = true))
);
CREATE POLICY "Admin full access service_delivery_log" ON service_delivery_log USING (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND (profiles.role = 'admin' OR profiles.is_admin = true))
);

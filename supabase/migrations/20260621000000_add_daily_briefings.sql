-- Daily Intelligence Briefings
-- Stores one AI-generated report per day, keyed by date.
-- Generated at 06:00 UTC by the cron job at /api/cron/daily-report

CREATE TABLE IF NOT EXISTS daily_briefings (
  id             uuid        DEFAULT gen_random_uuid() PRIMARY KEY,
  report_date    date        UNIQUE NOT NULL,
  macro_narrative text,
  macro_data     jsonb       DEFAULT '{}',
  events_today   jsonb       DEFAULT '[]',
  instrument_briefs jsonb    DEFAULT '[]',
  top_setups     jsonb       DEFAULT '[]',
  risk_radar     jsonb       DEFAULT '[]',
  generated_at   timestamptz DEFAULT now(),
  created_at     timestamptz DEFAULT now()
);

-- Row-Level Security
ALTER TABLE daily_briefings ENABLE ROW LEVEL SECURITY;

-- Authenticated subscribers can read
CREATE POLICY "Subscribers can read daily briefings"
  ON daily_briefings FOR SELECT
  TO authenticated
  USING (true);

-- Index for fast date lookups
CREATE INDEX IF NOT EXISTS idx_daily_briefings_date ON daily_briefings(report_date DESC);

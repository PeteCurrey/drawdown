-- Daily Briefs table for The Wire newsletter automation
CREATE TABLE IF NOT EXISTS daily_briefs (
  id              uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  brief_date      date        UNIQUE NOT NULL,
  subject_line    text        NOT NULL DEFAULT '',
  content_html    text        NOT NULL,
  content_text    text        NOT NULL,
  market_data     jsonb,
  sent_at         timestamptz,
  recipient_count int,
  created_at      timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_daily_briefs_date ON daily_briefs(brief_date DESC);

ALTER TABLE daily_briefs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage daily briefs"
  ON daily_briefs FOR ALL
  USING (auth.role() = 'authenticated');

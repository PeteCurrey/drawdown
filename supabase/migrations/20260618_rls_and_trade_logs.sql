-- ==========================================
-- TASK 1: FIX ROW LEVEL SECURITY
-- ==========================================

-- Enable RLS on all unprotected tables
ALTER TABLE course_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE discussions ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_sends ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE video_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE weekly_roundups ENABLE ROW LEVEL SECURITY;

-- drop existing policies if they exist to avoid duplicates
DROP POLICY IF EXISTS "Anyone can read course modules" ON course_modules;
DROP POLICY IF EXISTS "Only admins can modify course modules" ON course_modules;
DROP POLICY IF EXISTS "Authenticated users can read discussions" ON discussions;
DROP POLICY IF EXISTS "Users can create discussions" ON discussions;
DROP POLICY IF EXISTS "Users can edit own discussions" ON discussions;
DROP POLICY IF EXISTS "Users can delete own discussions" ON discussions;
DROP POLICY IF EXISTS "Users can manage own newsletter sub" ON newsletter_subscribers;
DROP POLICY IF EXISTS "Anyone can insert newsletter sub" ON newsletter_subscribers;
DROP POLICY IF EXISTS "Admin only for newsletter sends" ON newsletter_sends;
DROP POLICY IF EXISTS "Users can read own badges" ON user_badges;
DROP POLICY IF EXISTS "System can insert badges" ON user_badges;
DROP POLICY IF EXISTS "Users manage own video progress" ON video_progress;
DROP POLICY IF EXISTS "Users insert own video progress" ON video_progress;
DROP POLICY IF EXISTS "Anyone can read weekly roundups" ON weekly_roundups;

-- course_modules: public read (education content), no public write
CREATE POLICY "Anyone can read course modules"
  ON course_modules FOR SELECT
  USING (true);

CREATE POLICY "Only admins can modify course modules"
  ON course_modules FOR ALL
  USING (auth.jwt() ->> 'role' = 'admin');

-- discussions: authenticated users can read and create, only own posts can be edited/deleted
CREATE POLICY "Authenticated users can read discussions"
  ON discussions FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create discussions"
  ON discussions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can edit own discussions"
  ON discussions FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own discussions"
  ON discussions FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- newsletter_subscribers: users manage own record
CREATE POLICY "Users can manage own newsletter sub"
  ON newsletter_subscribers FOR ALL
  USING (auth.uid() = user_id);

CREATE POLICY "Anyone can insert newsletter sub"
  ON newsletter_subscribers FOR INSERT
  WITH CHECK (true);

-- newsletter_sends: admin only
CREATE POLICY "Admin only for newsletter sends"
  ON newsletter_sends FOR ALL
  USING (auth.jwt() ->> 'role' = 'admin');

-- user_badges: users read own, system writes
CREATE POLICY "Users can read own badges"
  ON user_badges FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "System can insert badges"
  ON user_badges FOR INSERT
  WITH CHECK (true);

-- video_progress: users manage own
CREATE POLICY "Users manage own video progress"
  ON video_progress FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users insert own video progress"
  ON video_progress FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- weekly_roundups: public read
CREATE POLICY "Anyone can read weekly roundups"
  ON weekly_roundups FOR SELECT
  USING (true);

-- ==========================================
-- TASK 2: AUDIT AND EXTEND TRADE JOURNAL
-- ==========================================

ALTER TABLE trade_logs 
  ADD COLUMN IF NOT EXISTS direction text 
    CHECK (direction IN ('long','short')),
  ADD COLUMN IF NOT EXISTS stop_loss 
    numeric(12,5),
  ADD COLUMN IF NOT EXISTS take_profit 
    numeric(12,5),
  ADD COLUMN IF NOT EXISTS position_size 
    numeric(10,4),
  ADD COLUMN IF NOT EXISTS risk_amount 
    numeric(10,2),
  ADD COLUMN IF NOT EXISTS risk_percentage 
    numeric(5,2),
  ADD COLUMN IF NOT EXISTS account_balance_at_entry 
    numeric(12,2),
  ADD COLUMN IF NOT EXISTS pnl_percentage 
    numeric(6,3),
  ADD COLUMN IF NOT EXISTS rrr_planned 
    numeric(5,2),
  ADD COLUMN IF NOT EXISTS rrr_achieved 
    numeric(5,2),
  ADD COLUMN IF NOT EXISTS session text 
    CHECK (session IN ('london','new_york',
      'asian','overlap','other')),
  ADD COLUMN IF NOT EXISTS emotional_state_entry 
    text CHECK (emotional_state_entry IN (
      'calm','confident','anxious','fearful',
      'excited','frustrated','neutral')),
  ADD COLUMN IF NOT EXISTS emotional_state_exit 
    text CHECK (emotional_state_exit IN (
      'calm','satisfied','disappointed',
      'relieved','angry','neutral')),
  ADD COLUMN IF NOT EXISTS followed_plan 
    boolean,
  ADD COLUMN IF NOT EXISTS setup_type text,
  ADD COLUMN IF NOT EXISTS entry_reason text,
  ADD COLUMN IF NOT EXISTS exit_reason text,
  ADD COLUMN IF NOT EXISTS notes text,
  ADD COLUMN IF NOT EXISTS mistakes text,
  ADD COLUMN IF NOT EXISTS tags text[],
  ADD COLUMN IF NOT EXISTS status text 
    DEFAULT 'open'
    CHECK (status IN ('open','closed','cancelled')),
  ADD COLUMN IF NOT EXISTS created_at 
    timestamptz DEFAULT now(),
  ADD COLUMN IF NOT EXISTS updated_at 
    timestamptz DEFAULT now();

-- Enable RLS on trade_logs
ALTER TABLE trade_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can only see own trades" ON trade_logs;
CREATE POLICY "Users can only see own trades"
  ON trade_logs FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Drop previous journal_ai_analysis table if exists and recreate with exact new schema
DROP TABLE IF EXISTS journal_ai_analysis CASCADE;

CREATE TABLE IF NOT EXISTS journal_ai_analysis (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) 
    ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  analysis_type text DEFAULT 'pattern',
  trade_count integer,
  analysis_content text,
  patterns_detected jsonb,
  recommendations jsonb
);

ALTER TABLE journal_ai_analysis 
  ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users see own analyses" ON journal_ai_analysis;
CREATE POLICY "Users see own analyses"
  ON journal_ai_analysis FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

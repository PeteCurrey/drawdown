-- Discipline Reports Table
CREATE TABLE IF NOT EXISTS discipline_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    week_ending DATE NOT NULL,
    discipline_score INT NOT NULL,
    grade TEXT NOT NULL, -- A, B, C, D, F
    pattern_data JSONB NOT NULL,
    report_content TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Session Check-ins Table
CREATE TABLE IF NOT EXISTS session_checkins (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    feeling INT NOT NULL, -- 1-5
    sleep_quality BOOLEAN NOT NULL,
    external_stress BOOLEAN NOT NULL,
    today_plan TEXT,
    coach_recommendation TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- RLS
ALTER TABLE discipline_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE session_checkins ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own discipline reports" ON discipline_reports
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own checkins" ON session_checkins
    FOR ALL USING (auth.uid() = user_id);

-- Add public_id for viral sharing
ALTER TABLE discipline_reports ADD COLUMN IF NOT EXISTS public_id UUID DEFAULT gen_random_uuid() UNIQUE;
CREATE POLICY "Public can view shared discipline reports" ON discipline_reports
    FOR SELECT USING (true);

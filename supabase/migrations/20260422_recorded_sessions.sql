CREATE TABLE IF NOT EXISTS public.recorded_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    category TEXT NOT NULL, -- strategy, mindset, journal, recap
    video_url TEXT NOT NULL,
    thumbnail_url TEXT,
    duration TEXT,
    pete_verified BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.recorded_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read for recorded_sessions" ON public.recorded_sessions FOR SELECT USING (true);
CREATE POLICY "Admins can manage recorded_sessions" ON public.recorded_sessions FOR ALL 
USING (
    EXISTS (
        SELECT 1 FROM public.profiles
        WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
);

-- Seed with some initial data
INSERT INTO public.recorded_sessions (title, description, category, video_url, duration) VALUES
('The Institutional Liquidity Trap', 'Analysis of how retail traders are trapped at key levels.', 'strategy', 'https://placeholder.com/video1', '1h 24m'),
('Mindset: Managing the Drawdown', 'Psychological framing for losing streaks.', 'mindset', 'https://placeholder.com/video2', '45m'),
('London Open Breakdown: April 15', 'Full walkthrough of the London session execution.', 'recap', 'https://placeholder.com/video3', '1h 05m'),
('The Art of the Trade Journal', 'How to log for behavioral improvement.', 'journal', 'https://placeholder.com/video4', '32m')
ON CONFLICT DO NOTHING;

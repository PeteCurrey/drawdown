CREATE TABLE IF NOT EXISTS public.institutes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    type TEXT NOT NULL,
    url TEXT NOT NULL,
    status TEXT DEFAULT 'active', -- active, broken
    last_checked_at TIMESTAMPTZ DEFAULT now(),
    created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.institutes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read for institutes" ON public.institutes FOR SELECT USING (true);
CREATE POLICY "Admins can manage institutes" ON public.institutes FOR ALL 
USING (
    EXISTS (
        SELECT 1 FROM public.profiles
        WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
);

-- Seed with some data
INSERT INTO public.institutes (name, type, url, status) VALUES
('Bank of England', 'Central Bank', 'https://www.bankofengland.co.uk', 'active'),
('London School of Economics', 'University', 'https://www.lse.ac.uk', 'active'),
('Financial Times', 'News Outlet', 'https://www.ft.com', 'active'),
('Bloomberg Terminal Docs', 'Research Firm', 'https://www.bloomberg.com/professional/support/', 'active')
ON CONFLICT DO NOTHING;

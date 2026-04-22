CREATE TABLE IF NOT EXISTS public.intelligence_signals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    type TEXT NOT NULL, -- correlation, unusual_volume, insider_cluster
    severity TEXT DEFAULT 'medium', -- high, medium, low
    content TEXT NOT NULL,
    related_symbols TEXT[],
    confidence_score DECIMAL(3,2),
    created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.intelligence_signals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read for intelligence_signals" ON public.intelligence_signals FOR SELECT USING (true);
CREATE POLICY "Admins can manage signals" ON public.intelligence_signals FOR ALL 
USING (
    EXISTS (
        SELECT 1 FROM public.profiles
        WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
);

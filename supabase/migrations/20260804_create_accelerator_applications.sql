CREATE TABLE IF NOT EXISTS public.accelerator_applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    experience TEXT NOT NULL,
    capital TEXT NOT NULL,
    motivation TEXT NOT NULL,
    status TEXT DEFAULT 'pending', -- pending, reviewing, approved, rejected
    created_at TIMESTAMPTZ DEFAULT now(),
    notes TEXT
);

ALTER TABLE public.accelerator_applications ENABLE ROW LEVEL SECURITY;

-- Allow public to insert applications
CREATE POLICY "Public can submit applications" ON public.accelerator_applications FOR INSERT WITH CHECK (true);

-- Only admins can manage applications
CREATE POLICY "Admins can manage applications" ON public.accelerator_applications FOR ALL 
USING (
    EXISTS (
        SELECT 1 FROM public.profiles
        WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
);

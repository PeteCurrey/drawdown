CREATE TABLE IF NOT EXISTS public.contact_submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    subject TEXT NOT NULL,
    message TEXT NOT NULL,
    status TEXT DEFAULT 'unread', -- unread, read, contacted, deleted
    priority TEXT DEFAULT 'normal', -- high, normal
    created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;

-- Allow public to insert (anyone can contact us)
CREATE POLICY "Public can submit contact form" ON public.contact_submissions FOR INSERT WITH CHECK (true);

-- Only admins can view/manage
CREATE POLICY "Admins can manage contact submissions" ON public.contact_submissions FOR ALL 
USING (
    EXISTS (
        SELECT 1 FROM public.profiles
        WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
);

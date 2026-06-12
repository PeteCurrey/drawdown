CREATE TABLE IF NOT EXISTS public.affiliate_clicks (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    slug text NOT NULL,
    destination_url text NOT NULL,
    has_affiliate_link boolean NOT NULL,
    referrer text,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

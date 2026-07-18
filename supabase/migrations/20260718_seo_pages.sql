-- Create seo_pages table for dynamic SEO templates (/best, /compare, /how-to)
CREATE TABLE IF NOT EXISTS seo_pages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT NOT NULL UNIQUE,
    page_type TEXT NOT NULL CHECK (page_type IN ('best', 'compare', 'how-to')),
    title TEXT NOT NULL,
    meta_description TEXT NOT NULL,
    content_jsonb JSONB DEFAULT '{}'::jsonb, -- Flexible content structure
    is_published BOOLEAN DEFAULT false,
    published_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS Policies
ALTER TABLE seo_pages ENABLE ROW LEVEL SECURITY;

-- Allow public read access to published SEO pages
CREATE POLICY "Public can view published seo pages"
    ON seo_pages FOR SELECT
    USING (is_published = true);

-- Allow authenticated admins full access
CREATE POLICY "Admins can manage seo pages"
    ON seo_pages FOR ALL
    USING (auth.jwt() ->> 'role' = 'admin');

-- Add trigger for updated_at
CREATE OR REPLACE FUNCTION update_seo_pages_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_seo_pages_timestamp
    BEFORE UPDATE ON seo_pages
    FOR EACH ROW
    EXECUTE FUNCTION update_seo_pages_updated_at();

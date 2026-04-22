CREATE TABLE IF NOT EXISTS seo_analytics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  path TEXT UNIQUE NOT NULL,
  views INTEGER DEFAULT 0,
  last_viewed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Function to increment view count
CREATE OR REPLACE FUNCTION increment_page_view(page_path TEXT)
RETURNS VOID AS $$
BEGIN
  INSERT INTO seo_analytics (path, views, last_viewed_at, updated_at)
  VALUES (page_path, 1, NOW(), NOW())
  ON CONFLICT (path)
  DO UPDATE SET 
    views = seo_analytics.views + 1,
    last_viewed_at = EXCLUDED.last_viewed_at,
    updated_at = NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

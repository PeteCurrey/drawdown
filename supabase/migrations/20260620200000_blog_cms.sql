-- DROP PRE-EXISTING TABLES TO ENSURE CLEAN CMS UPGRADE
DROP TRIGGER IF EXISTS trigger_update_blog_post_seo_updated_at ON blog_post_seo;
DROP TRIGGER IF EXISTS trigger_update_blog_posts_updated_at ON blog_posts;
DROP TABLE IF EXISTS blog_post_seo CASCADE;
DROP TABLE IF EXISTS blog_posts CASCADE;
DROP TABLE IF EXISTS author_profiles CASCADE;

-- 1. Create author_profiles table
CREATE TABLE author_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  role TEXT,
  bio TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. Create blog_posts table
CREATE TABLE blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  subtitle TEXT,
  eyebrow TEXT,
  body TEXT NOT NULL,
  author_id UUID REFERENCES author_profiles(id) ON DELETE SET NULL,
  hero_image_url TEXT,
  hero_image_alt TEXT,
  read_time TEXT,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  is_published BOOLEAN NOT NULL DEFAULT false,
  related_post_slugs TEXT[] DEFAULT '{}',
  category TEXT,
  dark_background BOOLEAN NOT NULL DEFAULT false
);

-- 3. Create blog_post_seo table
CREATE TABLE blog_post_seo (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID REFERENCES blog_posts(id) ON DELETE CASCADE UNIQUE,
  meta_title TEXT,
  meta_description TEXT,
  og_title TEXT,
  og_description TEXT,
  og_image_url TEXT,
  canonical_url TEXT,
  schema_type TEXT NOT NULL DEFAULT 'BlogPosting',
  no_index BOOLEAN NOT NULL DEFAULT false,
  focus_keyword TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indices for optimal queries
CREATE INDEX idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX idx_blog_posts_is_published ON blog_posts(is_published, published_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE author_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_post_seo ENABLE ROW LEVEL SECURITY;

-- 4. RLS Policies
-- Authenticated users can manage (CRUD) all tables
CREATE POLICY "Allow authenticated manage on author_profiles"
  ON author_profiles FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Allow authenticated manage on blog_posts"
  ON blog_posts FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Allow authenticated manage on blog_post_seo"
  ON blog_post_seo FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Public read access:
-- blog_posts: public can read published posts only
CREATE POLICY "Allow public select on published posts"
  ON blog_posts FOR SELECT TO public USING (is_published = true);

CREATE POLICY "Allow public select on author_profiles"
  ON author_profiles FOR SELECT TO public USING (true);

CREATE POLICY "Allow public select on blog_post_seo"
  ON blog_post_seo FOR SELECT TO public USING (true);

-- 5. Storage Bucket Configuration
-- Create storage bucket 'blog-assets' if not exists
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('blog-assets', 'blog-assets', true, 2097152, '{image/jpeg,image/png,image/webp}')
ON CONFLICT (id) DO NOTHING;

-- RLS Storage Policies
CREATE POLICY "Allow public read access to blog-assets objects"
  ON storage.objects FOR SELECT TO public
  USING (bucket_id = 'blog-assets');

CREATE POLICY "Allow authenticated to manage blog-assets objects"
  ON storage.objects FOR ALL TO authenticated
  USING (bucket_id = 'blog-assets')
  WITH CHECK (bucket_id = 'blog-assets');

-- 6. Trigger to auto-update updated_at
CREATE OR REPLACE FUNCTION handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_blog_posts_updated_at
  BEFORE UPDATE ON blog_posts
  FOR EACH ROW
  EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER trigger_update_blog_post_seo_updated_at
  BEFORE UPDATE ON blog_post_seo
  FOR EACH ROW
  EXECUTE FUNCTION handle_updated_at();

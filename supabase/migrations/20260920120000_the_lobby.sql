-- supabase/migrations/20260920120000_the_lobby.sql
-- Drawdown The Lobby: Foundational Schema, Editorial CMS, Sources & Audit Layer

-- 1. Create Enums if they do not exist
DO $$ BEGIN
    CREATE TYPE lobby_article_type AS ENUM (
        'NEWS', 'ANALYSIS', 'EXPLAINER', 'INDUSTRY UPDATE', 
        'TRADE FEATURE', 'PLATFORM SPOTLIGHT', 'BROKER WATCH', 
        'PROP FIRM WATCH', 'DRAWDOWN FEATURE'
    );
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE lobby_article_status AS ENUM (
        'DRAFT', 'REVIEW', 'PUBLISHED', 'ARCHIVED'
    );
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE lobby_confidence AS ENUM (
        'VERIFIED', 'KNOWN', 'INFERRED', 'UNKNOWN'
    );
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE lobby_importance AS ENUM (
        'lead', 'featured', 'standard', 'bulletin'
    );
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE lobby_section AS ENUM (
        'lead', 'whats_happening', 'just_in', 'coming_up', 
        'watchlist', 'broker_watch', 'prop_firm_watch', 
        'platform_spotlight', 'trade_of_the_month', 
        'drawdown_desk', 'explained', 'standard'
    );
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- 2. Lobby Articles Table
CREATE TABLE IF NOT EXISTS public.lobby_articles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    excerpt TEXT NOT NULL DEFAULT '',
    body TEXT NOT NULL DEFAULT '',
    category TEXT NOT NULL CHECK (category IN (
        'MARKETS', 'BROKERS', 'PROP FIRMS', 'PLATFORMS', 
        'MACRO', 'REGULATION', 'TRADING TECHNOLOGY', 'TRADES', 
        'DRAWDOWN', 'EDUCATION', 'INDUSTRY', 'OTHER'
    )),
    subcategory TEXT,
    article_type lobby_article_type NOT NULL DEFAULT 'NEWS',
    status lobby_article_status NOT NULL DEFAULT 'DRAFT',
    confidence lobby_confidence NOT NULL DEFAULT 'VERIFIED',
    importance lobby_importance NOT NULL DEFAULT 'standard',
    section lobby_section NOT NULL DEFAULT 'standard',
    author_id UUID REFERENCES public.author_profiles(id) ON DELETE SET NULL,
    author_name TEXT NOT NULL DEFAULT 'Drawdown Editorial',
    author_role TEXT DEFAULT 'Editorial Desk',
    hero_image_url TEXT,
    hero_image_alt TEXT,
    hero_image_caption TEXT,
    hero_image_credit TEXT,
    reading_time_minutes INTEGER NOT NULL DEFAULT 3,
    tags TEXT[] NOT NULL DEFAULT '{}',
    sources JSONB NOT NULL DEFAULT '[]'::jsonb,
    primary_source_name TEXT,
    primary_source_url TEXT,
    primary_source_date TIMESTAMPTZ,
    primary_source_type TEXT,
    primary_source_classification TEXT DEFAULT 'primary',
    editorial_metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    related_article_slugs TEXT[] NOT NULL DEFAULT '{}',
    related_tool_slugs TEXT[] NOT NULL DEFAULT '{}',
    related_broker_slugs TEXT[] NOT NULL DEFAULT '{}',
    related_prop_firm_slugs TEXT[] NOT NULL DEFAULT '{}',
    related_platform_slugs TEXT[] NOT NULL DEFAULT '{}',
    related_markets TEXT[] NOT NULL DEFAULT '{}',
    meta_title TEXT,
    meta_description TEXT,
    schema_type TEXT NOT NULL DEFAULT 'Article' CHECK (schema_type IN ('Article', 'NewsArticle')),
    canonical_url TEXT,
    published_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. Lobby Article Audit Logs
CREATE TABLE IF NOT EXISTS public.lobby_article_audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    article_id UUID REFERENCES public.lobby_articles(id) ON DELETE CASCADE NOT NULL,
    action TEXT NOT NULL CHECK (action IN ('created', 'edited', 'submitted_for_review', 'published', 'unpublished', 'archived')),
    actor_id TEXT NOT NULL,
    actor_email TEXT,
    previous_status TEXT,
    new_status TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 4. Lobby Sources Registry Table
CREATE TABLE IF NOT EXISTS public.lobby_sources (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    domain TEXT NOT NULL,
    url TEXT NOT NULL,
    source_type TEXT NOT NULL,
    reliability_classification TEXT NOT NULL DEFAULT 'primary_verified',
    polling_frequency_minutes INTEGER NOT NULL DEFAULT 60,
    active BOOLEAN NOT NULL DEFAULT true,
    last_checked TIMESTAMPTZ,
    last_successful_check TIMESTAMPTZ,
    error_state TEXT,
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 5. Lobby Events Table (Deduplicated Event Layer)
CREATE TABLE IF NOT EXISTS public.lobby_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    summary TEXT NOT NULL DEFAULT '',
    event_type TEXT NOT NULL,
    entity_references TEXT[] NOT NULL DEFAULT '{}',
    related_symbols TEXT[] NOT NULL DEFAULT '{}',
    primary_source_url TEXT,
    corroborating_sources JSONB NOT NULL DEFAULT '[]'::jsonb,
    importance TEXT NOT NULL DEFAULT 'NORMAL' CHECK (importance IN ('LOW', 'NORMAL', 'HIGH', 'URGENT')),
    status TEXT NOT NULL DEFAULT 'DETECTED' CHECK (status IN ('DETECTED', 'RESEARCHING', 'DRAFTED', 'NEEDS_REVIEW', 'APPROVED', 'PUBLISHED', 'REJECTED')),
    article_id UUID REFERENCES public.lobby_articles(id) ON DELETE SET NULL,
    discovered_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 6. Indices for Efficient Broadsheet Queries
CREATE INDEX IF NOT EXISTS idx_lobby_articles_slug ON public.lobby_articles (slug);
CREATE INDEX IF NOT EXISTS idx_lobby_articles_published ON public.lobby_articles (status, published_at DESC);
CREATE INDEX IF NOT EXISTS idx_lobby_articles_category ON public.lobby_articles (category, status, published_at DESC);
CREATE INDEX IF NOT EXISTS idx_lobby_articles_section ON public.lobby_articles (section, status, published_at DESC);
CREATE INDEX IF NOT EXISTS idx_lobby_articles_importance ON public.lobby_articles (importance);
CREATE INDEX IF NOT EXISTS idx_lobby_audit_article ON public.lobby_article_audit_logs (article_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_lobby_sources_active ON public.lobby_sources (active, source_type);
CREATE INDEX IF NOT EXISTS idx_lobby_events_status ON public.lobby_events (status, discovered_at DESC);

-- 7. Trigger for updated_at
CREATE OR REPLACE TRIGGER set_lobby_articles_updated_at
    BEFORE UPDATE ON public.lobby_articles
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE OR REPLACE TRIGGER set_lobby_sources_updated_at
    BEFORE UPDATE ON public.lobby_sources
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE OR REPLACE TRIGGER set_lobby_events_updated_at
    BEFORE UPDATE ON public.lobby_events
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- 8. Row Level Security (RLS) Configuration
ALTER TABLE public.lobby_articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lobby_article_audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lobby_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lobby_events ENABLE ROW LEVEL SECURITY;

-- Public read access: published items with verified/known/inferred confidence only
CREATE POLICY "Allow public read on published lobby articles"
    ON public.lobby_articles FOR SELECT
    TO public
    USING (status = 'PUBLISHED' AND confidence != 'UNKNOWN');

-- Authenticated staff/admins can perform all operations
CREATE POLICY "Allow authenticated manage on lobby_articles"
    ON public.lobby_articles FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Allow authenticated manage on lobby_audit_logs"
    ON public.lobby_article_audit_logs FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Allow authenticated manage on lobby_sources"
    ON public.lobby_sources FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Allow authenticated manage on lobby_events"
    ON public.lobby_events FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

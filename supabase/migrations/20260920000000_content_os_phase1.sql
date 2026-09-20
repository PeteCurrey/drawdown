-- supabase/migrations/20260920000000_content_os_phase1.sql
-- Drawdown Content OS Phase 1: Foundational Additive Schema
-- Provider-agnostic content authoring, asset specs, channel adaptations, news radar, and delivery receipts

-- 1. Create Enums if they do not exist
DO $$ BEGIN
    CREATE TYPE content_item_type AS ENUM (
        'evergreen', 'educational', 'case_study', 'market_analysis', 
        'product', 'announcement', 'news', 'opinion', 'weekly_recap'
    );
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE content_status AS ENUM (
        'idea', 'draft', 'review', 'approved', 'scheduled', 'published', 'archived'
    );
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE content_priority AS ENUM ('critical', 'high', 'medium', 'low');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE content_asset_type AS ENUM (
        'image', 'carousel', 'video', 'chart', 'social_graphic'
    );
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE social_channel AS ENUM (
        'instagram', 'x', 'linkedin', 'threads', 'facebook', 'bluesky', 'tiktok'
    );
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE social_delivery_status AS ENUM (
        'queued', 'publishing', 'published', 'failed', 'retrying', 'unconfirmed', 'cancelled'
    );
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE news_source_type AS ENUM (
        'rss', 'corporate_newsroom', 'regulator', 'government', 
        'central_bank', 'exchange', 'financial_publication', 'api'
    );
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE news_trust_tier AS ENUM ('tier_1_primary', 'tier_2_verified', 'tier_3_secondary', 'tier_4_untrusted');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE news_verification_status AS ENUM ('unverified', 'partially_verified', 'verified', 'rejected');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE news_editorial_status AS ENUM ('new', 'reviewing', 'draft_ready', 'approved', 'published', 'ignored');
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- 2. Core Content Items Table
CREATE TABLE IF NOT EXISTS public.content_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    content_type content_item_type NOT NULL,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    status content_status NOT NULL DEFAULT 'draft',
    category TEXT NOT NULL DEFAULT 'market_intelligence',
    priority content_priority NOT NULL DEFAULT 'medium',
    source_type TEXT NOT NULL DEFAULT 'original', -- 'original', 'news', 'research', 'evergreen'
    source_reference TEXT,
    body TEXT NOT NULL DEFAULT '',
    excerpt TEXT,
    canonical_url TEXT,
    published_at TIMESTAMPTZ,
    scheduled_at TIMESTAMPTZ,
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    approved_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    approved_at TIMESTAMPTZ,
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. Content Assets Table
CREATE TABLE IF NOT EXISTS public.content_assets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    content_item_id UUID REFERENCES public.content_items(id) ON DELETE CASCADE NOT NULL,
    asset_type content_asset_type NOT NULL,
    storage_url TEXT NOT NULL,
    alt_text TEXT,
    mime_type TEXT,
    width INTEGER,
    height INTEGER,
    aspect_ratio TEXT, -- '1:1', '4:5', '1.91:1', '16:9'
    display_order INTEGER NOT NULL DEFAULT 0,
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 4. Content Channel Adaptations Table
CREATE TABLE IF NOT EXISTS public.content_channels (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    content_item_id UUID REFERENCES public.content_items(id) ON DELETE CASCADE NOT NULL,
    channel social_channel NOT NULL,
    headline TEXT,
    body TEXT NOT NULL,
    hashtags TEXT[] NOT NULL DEFAULT '{}',
    media_references JSONB NOT NULL DEFAULT '[]'::jsonb,
    status TEXT NOT NULL DEFAULT 'draft', -- 'draft', 'ready', 'scheduled', 'published', 'failed'
    scheduled_at TIMESTAMPTZ,
    published_at TIMESTAMPTZ,
    provider TEXT DEFAULT 'onesocial',
    provider_post_id TEXT,
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE(content_item_id, channel)
);

-- 5. Social Deliveries (Audit / Truthful Receipts Layer)
CREATE TABLE IF NOT EXISTS public.social_deliveries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    content_channel_id UUID REFERENCES public.content_channels(id) ON DELETE CASCADE NOT NULL,
    provider TEXT NOT NULL,
    channel social_channel NOT NULL,
    status social_delivery_status NOT NULL DEFAULT 'queued',
    provider_post_id TEXT,
    published_at TIMESTAMPTZ,
    failure_reason TEXT,
    retry_count INTEGER NOT NULL DEFAULT 0,
    raw_response JSONB DEFAULT '{}'::jsonb,
    idempotency_key TEXT UNIQUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 6. Content Metrics Table
CREATE TABLE IF NOT EXISTS public.content_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    content_channel_id UUID REFERENCES public.content_channels(id) ON DELETE CASCADE NOT NULL,
    metric_name TEXT NOT NULL, -- 'impressions', 'reach', 'likes', 'comments', 'shares', 'clicks', 'saves', 'engagement_rate', 'video_views'
    metric_value NUMERIC(15, 4) NOT NULL,
    observed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    provider TEXT NOT NULL,
    channel social_channel NOT NULL,
    raw_metrics JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 7. News Sources Table
CREATE TABLE IF NOT EXISTS public.news_sources (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    source_type news_source_type NOT NULL,
    domain TEXT NOT NULL,
    feed_url TEXT NOT NULL UNIQUE,
    active BOOLEAN NOT NULL DEFAULT true,
    priority INTEGER NOT NULL DEFAULT 1,
    trust_tier news_trust_tier NOT NULL DEFAULT 'tier_2_verified',
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    last_fetched_at TIMESTAMPTZ,
    last_failure_reason TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 8. News Candidates Table
CREATE TABLE IF NOT EXISTS public.news_candidates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    summary TEXT NOT NULL DEFAULT '',
    source TEXT NOT NULL,
    source_url TEXT NOT NULL,
    published_at TIMESTAMPTZ,
    discovered_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    entity_references TEXT[] NOT NULL DEFAULT '{}',
    related_symbols TEXT[] NOT NULL DEFAULT '{}',
    asset_classes TEXT[] NOT NULL DEFAULT '{}',
    relevance_score NUMERIC(5, 2) NOT NULL DEFAULT 0.0,
    market_impact_score NUMERIC(5, 2) NOT NULL DEFAULT 0.0,
    confidence_score NUMERIC(5, 2) NOT NULL DEFAULT 0.0,
    priority_level content_priority NOT NULL DEFAULT 'low',
    scoring_reasons TEXT[] NOT NULL DEFAULT '{}',
    duplicate_key TEXT NOT NULL,
    parent_event_id UUID REFERENCES public.news_candidates(id) ON DELETE SET NULL,
    corroborating_sources JSONB NOT NULL DEFAULT '[]'::jsonb,
    verification_status news_verification_status NOT NULL DEFAULT 'unverified',
    verification_evidence JSONB NOT NULL DEFAULT '{}'::jsonb,
    editorial_status news_editorial_status NOT NULL DEFAULT 'new',
    content_item_id UUID REFERENCES public.content_items(id) ON DELETE SET NULL,
    processed_at TIMESTAMPTZ,
    raw_payload JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 9. Content Audit Logs Table
CREATE TABLE IF NOT EXISTS public.content_audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entity_type TEXT NOT NULL, -- 'content_item', 'content_channel', 'social_delivery', 'news_candidate'
    entity_id TEXT NOT NULL,
    actor_id TEXT NOT NULL, -- user_id or 'system'
    previous_state TEXT,
    new_state TEXT NOT NULL,
    reason TEXT,
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indices for efficient querying
CREATE INDEX IF NOT EXISTS idx_content_items_status_sched ON public.content_items (status, scheduled_at);
CREATE INDEX IF NOT EXISTS idx_content_items_type ON public.content_items (content_type);
CREATE INDEX IF NOT EXISTS idx_content_channels_item ON public.content_channels (content_item_id);
CREATE INDEX IF NOT EXISTS idx_social_deliveries_channel ON public.social_deliveries (content_channel_id, status);
CREATE INDEX IF NOT EXISTS idx_content_metrics_channel ON public.content_metrics (content_channel_id, metric_name);
CREATE INDEX IF NOT EXISTS idx_news_candidates_dup_key ON public.news_candidates (duplicate_key);
CREATE INDEX IF NOT EXISTS idx_news_candidates_status ON public.news_candidates (editorial_status, verification_status);
CREATE INDEX IF NOT EXISTS idx_news_candidates_discovered ON public.news_candidates (discovered_at DESC);
CREATE INDEX IF NOT EXISTS idx_content_audit_logs_entity ON public.content_audit_logs (entity_type, entity_id, created_at DESC);

-- Triggers for updated_at
CREATE OR REPLACE TRIGGER set_content_items_updated_at
    BEFORE UPDATE ON public.content_items
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE OR REPLACE TRIGGER set_content_channels_updated_at
    BEFORE UPDATE ON public.content_channels
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE OR REPLACE TRIGGER set_social_deliveries_updated_at
    BEFORE UPDATE ON public.social_deliveries
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE OR REPLACE TRIGGER set_news_sources_updated_at
    BEFORE UPDATE ON public.news_sources
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE OR REPLACE TRIGGER set_news_candidates_updated_at
    BEFORE UPDATE ON public.news_candidates
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Row Level Security (RLS) Configuration
ALTER TABLE public.content_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_channels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.social_deliveries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.news_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.news_candidates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_audit_logs ENABLE ROW LEVEL SECURITY;

-- Helper function: verify if current user is admin
CREATE OR REPLACE FUNCTION public.is_content_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  );
$$;

-- RLS Policies: Content Items
CREATE POLICY "Public read published content items"
    ON public.content_items FOR SELECT
    USING (status = 'published');

CREATE POLICY "Admin manage content items"
    ON public.content_items FOR ALL
    TO authenticated
    USING (is_content_admin())
    WITH CHECK (is_content_admin());

-- RLS Policies: Content Assets
CREATE POLICY "Public read assets of published items"
    ON public.content_assets FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM public.content_items 
        WHERE id = content_item_id AND status = 'published'
    ));

CREATE POLICY "Admin manage content assets"
    ON public.content_assets FOR ALL
    TO authenticated
    USING (is_content_admin())
    WITH CHECK (is_content_admin());

-- RLS Policies: Content Channels
CREATE POLICY "Admin manage content channels"
    ON public.content_channels FOR ALL
    TO authenticated
    USING (is_content_admin())
    WITH CHECK (is_content_admin());

-- RLS Policies: Social Deliveries
CREATE POLICY "Admin manage social deliveries"
    ON public.social_deliveries FOR ALL
    TO authenticated
    USING (is_content_admin())
    WITH CHECK (is_content_admin());

-- RLS Policies: Content Metrics
CREATE POLICY "Admin manage content metrics"
    ON public.content_metrics FOR ALL
    TO authenticated
    USING (is_content_admin())
    WITH CHECK (is_content_admin());

-- RLS Policies: News Sources
CREATE POLICY "Admin manage news sources"
    ON public.news_sources FOR ALL
    TO authenticated
    USING (is_content_admin())
    WITH CHECK (is_content_admin());

-- RLS Policies: News Candidates
CREATE POLICY "Admin manage news candidates"
    ON public.news_candidates FOR ALL
    TO authenticated
    USING (is_content_admin())
    WITH CHECK (is_content_admin());

-- RLS Policies: Content Audit Logs
CREATE POLICY "Admin read content audit logs"
    ON public.content_audit_logs FOR SELECT
    TO authenticated
    USING (is_content_admin());

CREATE POLICY "Admin insert content audit logs"
    ON public.content_audit_logs FOR INSERT
    TO authenticated
    WITH CHECK (is_content_admin());

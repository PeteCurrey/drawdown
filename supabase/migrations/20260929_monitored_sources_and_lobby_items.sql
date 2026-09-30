-- supabase/migrations/20260929_monitored_sources_and_lobby_items.sql
-- Lobby Instagram Surveillance & Fact Verification Architecture

-- 1. Table: monitored_sources
CREATE TABLE IF NOT EXISTS public.monitored_sources (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    platform TEXT NOT NULL CHECK (platform IN ('instagram', 'rss')),
    handle TEXT NOT NULL,
    ingest_mode TEXT NOT NULL DEFAULT 'inbox' CHECK (ingest_mode IN ('api', 'inbox')),
    active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT uq_monitored_sources_platform_handle UNIQUE (platform, handle)
);

-- Index for platform & active lookup
CREATE INDEX IF NOT EXISTS idx_monitored_sources_platform_active 
    ON public.monitored_sources (platform, active);

-- 2. Seed Initial Instagram Sources (ingest_mode 'inbox' until API verified)
INSERT INTO public.monitored_sources (platform, handle, ingest_mode, active)
VALUES 
    ('instagram', 'daytrading', 'inbox', true),
    ('instagram', 'stockmarketchasers', 'inbox', true),
    ('instagram', 'money.focus', 'inbox', true)
ON CONFLICT (platform, handle) DO UPDATE 
SET active = EXCLUDED.active;

-- 3. Table: lobby_items
CREATE TABLE IF NOT EXISTS public.lobby_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    source_id UUID NOT NULL REFERENCES public.monitored_sources(id) ON DELETE CASCADE,
    original_url TEXT NOT NULL,
    posted_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    extracted_claims JSONB NOT NULL DEFAULT '{"headline": "", "claims": []}'::jsonb,
    verified_facts JSONB NOT NULL DEFAULT '[]'::jsonb,
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'rejected')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes for status, posted_at, and source lookups
CREATE INDEX IF NOT EXISTS idx_lobby_items_status_posted 
    ON public.lobby_items (status, posted_at DESC);
CREATE INDEX IF NOT EXISTS idx_lobby_items_source_id 
    ON public.lobby_items (source_id);

-- 4. Enable Row Level Security (RLS)
ALTER TABLE public.monitored_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lobby_items ENABLE ROW LEVEL SECURITY;

-- 5. RLS Policies
DO $$ BEGIN
    DROP POLICY IF EXISTS "Public read active monitored sources" ON public.monitored_sources;
    CREATE POLICY "Public read active monitored sources"
        ON public.monitored_sources FOR SELECT
        USING (active = true);
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    DROP POLICY IF EXISTS "Public read published lobby items" ON public.lobby_items;
    CREATE POLICY "Public read published lobby items"
        ON public.lobby_items FOR SELECT
        USING (status = 'published');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    DROP POLICY IF EXISTS "Full access for service role on monitored_sources" ON public.monitored_sources;
    CREATE POLICY "Full access for service role on monitored_sources"
        ON public.monitored_sources FOR ALL
        TO service_role
        USING (true)
        WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    DROP POLICY IF EXISTS "Full access for service role on lobby_items" ON public.lobby_items;
    CREATE POLICY "Full access for service role on lobby_items"
        ON public.lobby_items FOR ALL
        TO service_role
        USING (true)
        WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN null; END $$;

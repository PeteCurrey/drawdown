-- supabase/migrations/20260920000001_intelligence_data_platform.sql
-- Drawdown Intelligence Data Platform: Core Schema & Additive Foundation
-- Provider-agnostic canonical entities, sources, observations, events, raw audit, and provider health.

-- 1. Create Enums if they do not exist
DO $$ BEGIN
    CREATE TYPE data_source_category AS ENUM (
        'MARKET', 'MACRO', 'NEWS', 'CENTRAL_BANK', 'REGULATOR', 
        'CORPORATE', 'EARNINGS', 'POSITIONING', 'OPTIONS', 'FUTURES', 
        'BROKER', 'PROP_FIRM', 'PLATFORM', 'CRYPTO', 'WEATHER', 
        'SHIPPING', 'AIS', 'SATELLITE', 'ENERGY', 'AGRICULTURE', 
        'GEOPOLITICAL', 'SOCIAL', 'SEARCH_TRENDS', 'OTHER'
    );
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE data_entity_type AS ENUM (
        'company', 'market', 'instrument', 'broker', 'prop_firm', 
        'platform', 'regulator', 'central_bank', 'country', 
        'commodity', 'vessel', 'port', 'economic_indicator'
    );
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE data_source_reliability AS ENUM (
        'PRIMARY', 'AUTHORITATIVE_SECONDARY', 'SECONDARY', 'COMMUNITY', 'UNVERIFIED'
    );
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE data_confidence_level AS ENUM (
        'VERIFIED', 'KNOWN', 'INFERRED', 'UNKNOWN'
    );
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE data_ingestion_state AS ENUM (
        'DISCOVERED', 'FETCHING', 'INGESTED', 'NORMALIZED', 
        'VALIDATED', 'CORRELATED', 'READY', 'FAILED', 'STALE', 'REJECTED'
    );
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE data_schedule_interval AS ENUM (
        'realtime', 'every-minute', 'every-5-minutes', 'hourly', 'daily', 'weekly', 'event-driven'
    );
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- 2. Canonical Data Entities (Institutions, Instruments, Countries, Commodities, etc.)
CREATE TABLE IF NOT EXISTS public.data_entities (
    id TEXT PRIMARY KEY, -- e.g. 'inst:eurusd', 'ind:us-fed-funds', 'comm:crude-wti'
    entity_type data_entity_type NOT NULL,
    name TEXT NOT NULL,
    symbol TEXT,
    country_code TEXT, -- ISO 2-letter
    sector TEXT,
    identifiers JSONB NOT NULL DEFAULT '{}'::jsonb,
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. Data Sources Registry
CREATE TABLE IF NOT EXISTS public.data_sources (
    id TEXT PRIMARY KEY, -- e.g. 'fred-api', 'twelve-data-market', 'eia-v2-api'
    name TEXT NOT NULL,
    provider_id TEXT NOT NULL,
    category data_source_category NOT NULL,
    reliability data_source_reliability NOT NULL DEFAULT 'SECONDARY',
    source_type TEXT NOT NULL, -- 'api', 'rss', 'filing', 'scrape'
    url TEXT NOT NULL,
    documentation_url TEXT,
    license_notes TEXT,
    attribution_required BOOLEAN NOT NULL DEFAULT false,
    attribution_text TEXT,
    refresh_frequency data_schedule_interval NOT NULL DEFAULT 'daily',
    active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 4. Raw Ingestion Audit Records (Complete Request/Response Lineage)
CREATE TABLE IF NOT EXISTS public.data_ingestion_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    provider_id TEXT NOT NULL,
    source_id TEXT REFERENCES public.data_sources(id) ON DELETE CASCADE,
    endpoint TEXT NOT NULL,
    request_params_hash TEXT NOT NULL,
    response_payload_hash TEXT NOT NULL,
    response_payload_snippet JSONB, -- truncated metadata reference compliant with licensing
    http_status INTEGER NOT NULL,
    latency_ms INTEGER NOT NULL,
    schema_version TEXT NOT NULL DEFAULT '1.0',
    state data_ingestion_state NOT NULL DEFAULT 'INGESTED',
    error_details TEXT,
    record_count INTEGER NOT NULL DEFAULT 0,
    fetched_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    processed_at TIMESTAMPTZ
);

-- 5. Canonical Data Observations (Normalized Quantitative Time-Series & Snapshots)
CREATE TABLE IF NOT EXISTS public.data_observations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    source_id TEXT REFERENCES public.data_sources(id) ON DELETE RESTRICT NOT NULL,
    ingestion_record_id UUID REFERENCES public.data_ingestion_records(id) ON DELETE SET NULL,
    entity_id TEXT REFERENCES public.data_entities(id) ON DELETE RESTRICT NOT NULL,
    metric TEXT NOT NULL, -- e.g. 'price', 'interest_rate', 'inventory_level', 'yield_10y'
    value NUMERIC NOT NULL,
    unit TEXT NOT NULL, -- 'USD', '%', 'USD/bbl', 'index'
    currency TEXT,
    period TEXT, -- 'daily', 'monthly', '2026-Q3'
    region TEXT, -- 'US', 'EU', 'GLOBAL'
    observed_at TIMESTAMPTZ NOT NULL, -- Event timestamp
    received_at TIMESTAMPTZ NOT NULL DEFAULT now(), -- Ingestion timestamp
    confidence data_confidence_level NOT NULL DEFAULT 'KNOWN',
    source_reliability data_source_reliability NOT NULL DEFAULT 'SECONDARY',
    ingestion_state data_ingestion_state NOT NULL DEFAULT 'READY',
    source_reference TEXT,
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT uq_obs_source_entity_metric_time UNIQUE (source_id, entity_id, metric, observed_at)
);

-- 6. Canonical Data Events (Discrete Events, Macro Releases, Regulatory Actions)
CREATE TABLE IF NOT EXISTS public.data_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_type TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL DEFAULT '',
    entity_ids TEXT[] NOT NULL DEFAULT '{}',
    source_ids TEXT[] NOT NULL DEFAULT '{}',
    occurred_at TIMESTAMPTZ NOT NULL, -- When event took place
    detected_at TIMESTAMPTZ NOT NULL DEFAULT now(), -- When ingested
    severity TEXT NOT NULL DEFAULT 'normal' CHECK (severity IN ('low', 'normal', 'high', 'critical')),
    confidence data_confidence_level NOT NULL DEFAULT 'KNOWN',
    source_reliability data_source_reliability NOT NULL DEFAULT 'SECONDARY',
    status TEXT NOT NULL DEFAULT 'READY',
    primary_source_url TEXT,
    corroborating_references JSONB NOT NULL DEFAULT '[]'::jsonb,
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 7. Provider Health Tracking (Live Operational Status & Circuit Breakers)
CREATE TABLE IF NOT EXISTS public.data_provider_health (
    provider_id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'AVAILABLE' CHECK (status IN ('AVAILABLE', 'DEGRADED', 'UNAVAILABLE', 'STALE', 'NOT_CONFIGURED')),
    successful_requests BIGINT NOT NULL DEFAULT 0,
    failed_requests BIGINT NOT NULL DEFAULT 0,
    consecutive_failures INTEGER NOT NULL DEFAULT 0,
    average_latency_ms INTEGER NOT NULL DEFAULT 0,
    last_successful_fetch TIMESTAMPTZ,
    last_attempted_fetch TIMESTAMPTZ,
    last_error_message TEXT,
    circuit_breaker_state TEXT NOT NULL DEFAULT 'CLOSED' CHECK (circuit_breaker_state IN ('CLOSED', 'OPEN', 'HALF_OPEN')),
    rate_limit_reset_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 8. Performance Indexes
CREATE INDEX IF NOT EXISTS idx_data_entities_type ON public.data_entities (entity_type, symbol);
CREATE INDEX IF NOT EXISTS idx_data_sources_provider ON public.data_sources (provider_id, category, active);
CREATE INDEX IF NOT EXISTS idx_data_ingestion_audit ON public.data_ingestion_records (provider_id, fetched_at DESC);
CREATE INDEX IF NOT EXISTS idx_data_obs_entity_metric ON public.data_observations (entity_id, metric, observed_at DESC);
CREATE INDEX IF NOT EXISTS idx_data_obs_confidence ON public.data_observations (confidence, ingestion_state);
CREATE INDEX IF NOT EXISTS idx_data_events_time ON public.data_events (occurred_at DESC);
CREATE INDEX IF NOT EXISTS idx_data_events_confidence ON public.data_events (confidence, status);

-- 9. Row Level Security
ALTER TABLE public.data_entities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.data_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.data_ingestion_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.data_observations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.data_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.data_provider_health ENABLE ROW LEVEL SECURITY;

-- Public read access for canonical observations & events meeting the confidence threshold
DROP POLICY IF EXISTS "Public read access for verified observations" ON public.data_observations;
CREATE POLICY "Public read access for verified observations"
    ON public.data_observations FOR SELECT
    USING (confidence IN ('VERIFIED', 'KNOWN', 'INFERRED') AND ingestion_state = 'READY');

DROP POLICY IF EXISTS "Public read access for verified events" ON public.data_events;
CREATE POLICY "Public read access for verified events"
    ON public.data_events FOR SELECT
    USING (confidence IN ('VERIFIED', 'KNOWN', 'INFERRED') AND status = 'READY');

DROP POLICY IF EXISTS "Public read access for active sources" ON public.data_sources;
CREATE POLICY "Public read access for active sources"
    ON public.data_sources FOR SELECT
    USING (active = true);

DROP POLICY IF EXISTS "Public read access for entities" ON public.data_entities;
CREATE POLICY "Public read access for entities"
    ON public.data_entities FOR SELECT
    USING (true);

DROP POLICY IF EXISTS "Public read access for provider health" ON public.data_provider_health;
CREATE POLICY "Public read access for provider health"
    ON public.data_provider_health FOR SELECT
    USING (true);

-- Service role full access on all tables
DROP POLICY IF EXISTS "Service role full access on data_entities" ON public.data_entities;
CREATE POLICY "Service role full access on data_entities"
    ON public.data_entities FOR ALL TO service_role USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Service role full access on data_sources" ON public.data_sources;
CREATE POLICY "Service role full access on data_sources"
    ON public.data_sources FOR ALL TO service_role USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Service role full access on data_ingestion_records" ON public.data_ingestion_records;
CREATE POLICY "Service role full access on data_ingestion_records"
    ON public.data_ingestion_records FOR ALL TO service_role USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Service role full access on data_observations" ON public.data_observations;
CREATE POLICY "Service role full access on data_observations"
    ON public.data_observations FOR ALL TO service_role USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Service role full access on data_events" ON public.data_events;
CREATE POLICY "Service role full access on data_events"
    ON public.data_events FOR ALL TO service_role USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Service role full access on data_provider_health" ON public.data_provider_health;
CREATE POLICY "Service role full access on data_provider_health"
    ON public.data_provider_health FOR ALL TO service_role USING (true) WITH CHECK (true);

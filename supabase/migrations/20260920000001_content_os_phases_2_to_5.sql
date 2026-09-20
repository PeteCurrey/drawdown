-- supabase/migrations/20260920000001_content_os_phases_2_to_5.sql
-- Drawdown Content OS: Schema for Phases 2, 3, 4, 5
-- Additive migration: Series, Taxonomy, News Events/Entities, Receipts, Attribution, UTMs

-- 1. Phase 2: Content Series Table
CREATE TABLE IF NOT EXISTS public.content_series (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL UNIQUE,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    pillar TEXT NOT NULL,
    default_channels TEXT[] NOT NULL DEFAULT '{"instagram", "x", "linkedin", "threads"}'::text[],
    cadence TEXT NOT NULL DEFAULT 'weekly',
    visual_family TEXT NOT NULL DEFAULT 'DATA',
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. Phase 2: Editorial Pillars Configuration
CREATE TABLE IF NOT EXISTS public.editorial_pillars_config (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    pillar_key TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    target_weight_percent NUMERIC(5, 2) NOT NULL,
    description TEXT,
    max_consecutive_days INT NOT NULL DEFAULT 2,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Seed default editorial pillars if empty
INSERT INTO public.editorial_pillars_config (pillar_key, name, target_weight_percent, max_consecutive_days)
VALUES 
    ('market_intelligence', 'Market Intelligence', 20.0, 2),
    ('risk_and_drawdown', 'Risk & Drawdown', 20.0, 2),
    ('trading_education', 'Trading Education', 15.0, 2),
    ('trader_psychology', 'Trader Psychology', 10.0, 1),
    ('case_studies', 'Historical Case Studies', 10.0, 1),
    ('quantitative_insights', 'Quantitative Insights', 10.0, 1),
    ('product_tools', 'Product / Tool', 10.0, 1),
    ('weekly_recap', 'Weekly / Periodic Recap', 5.0, 1)
ON CONFLICT (pillar_key) DO NOTHING;

-- Seed default content series
INSERT INTO public.content_series (title, slug, description, pillar, visual_family)
VALUES
    ('Drawdown 101', 'drawdown-101', 'Foundational drawdown principles and recovery mathematics', 'risk_and_drawdown', 'DRAWDOWN'),
    ('Market History', 'market-history', 'Historical crashes, bubbles, and recovery trajectories', 'case_studies', 'CASE_STUDY'),
    ('One Chart', 'one-chart', 'Single powerful chart highlighting market anomalies or data', 'quantitative_insights', 'DATA'),
    ('Risk Reality', 'risk-reality', 'Practical position sizing and capital preservation rules', 'risk_and_drawdown', 'EXPLAINER'),
    ('Biggest Drawdowns', 'biggest-drawdowns', 'Deep-dives into major historical asset drawdowns', 'case_studies', 'CASE_STUDY'),
    ('What Happened Next?', 'what-happened-next', 'Historical volatility setups and subsequent price action', 'market_intelligence', 'MARKET_UPDATE'),
    ('Trader Psychology', 'trader-psychology', 'Loss aversion, revenge trading, and emotional discipline', 'trader_psychology', 'EXPLAINER'),
    ('Market Myth vs Data', 'market-myth-vs-data', 'Debunking retail trading myths with quantitative evidence', 'quantitative_insights', 'DATA')
ON CONFLICT (slug) DO NOTHING;

-- 3. Phase 2: Editorial QA Evaluations Table
CREATE TABLE IF NOT EXISTS public.content_qa_evaluations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    content_item_id UUID REFERENCES public.content_items(id) ON DELETE CASCADE NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('PASS', 'WARN', 'BLOCK')),
    reasons TEXT[] NOT NULL DEFAULT '{}',
    violations TEXT[] NOT NULL DEFAULT '{}',
    content_fingerprint TEXT NOT NULL,
    evaluated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 4. Phase 3: News Events & Entity Extraction Table
CREATE TABLE IF NOT EXISTS public.news_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_type TEXT NOT NULL,
    title TEXT NOT NULL,
    canonical_summary TEXT NOT NULL,
    primary_entity TEXT,
    entities JSONB NOT NULL DEFAULT '[]'::jsonb,
    symbols TEXT[] NOT NULL DEFAULT '{}',
    first_detected_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    last_updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    source_count INT NOT NULL DEFAULT 1,
    priority_bucket TEXT NOT NULL DEFAULT 'MEDIUM',
    verification_status TEXT NOT NULL DEFAULT 'UNVERIFIED',
    editorial_brief JSONB DEFAULT '{}'::jsonb
);

CREATE TABLE IF NOT EXISTS public.news_alerts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    news_candidate_id UUID REFERENCES public.news_candidates(id) ON DELETE CASCADE,
    event_id UUID REFERENCES public.news_events(id) ON DELETE CASCADE,
    priority TEXT NOT NULL, -- CRITICAL, HIGH
    title TEXT NOT NULL,
    potential_angle TEXT,
    suggested_action TEXT,
    status TEXT NOT NULL DEFAULT 'UNREAD', -- UNREAD, ACKNOWLEDGED, DISMISSED, ACTIONED
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 5. Phase 5: UTM Campaigns & Web Attribution Sessions
CREATE TABLE IF NOT EXISTS public.utm_campaigns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    content_item_id UUID REFERENCES public.content_items(id) ON DELETE CASCADE,
    utm_source TEXT NOT NULL,
    utm_medium TEXT NOT NULL DEFAULT 'social',
    utm_campaign TEXT NOT NULL,
    utm_content TEXT NOT NULL,
    destination_url TEXT NOT NULL,
    full_url TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.web_attribution_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id TEXT NOT NULL,
    content_item_id UUID REFERENCES public.content_items(id) ON DELETE SET NULL,
    utm_campaign_id UUID REFERENCES public.utm_campaigns(id) ON DELETE SET NULL,
    referrer TEXT,
    landing_page TEXT NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    tool_used TEXT,
    lead_captured BOOLEAN DEFAULT false,
    converted_paid BOOLEAN DEFAULT false,
    subscription_tier TEXT,
    revenue_pence INT DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indices
CREATE INDEX IF NOT EXISTS idx_content_series_slug ON public.content_series(slug);
CREATE INDEX IF NOT EXISTS idx_content_qa_item ON public.content_qa_evaluations(content_item_id);
CREATE INDEX IF NOT EXISTS idx_news_events_type ON public.news_events(event_type);
CREATE INDEX IF NOT EXISTS idx_news_alerts_status ON public.news_alerts(status, priority);
CREATE INDEX IF NOT EXISTS idx_utm_campaigns_content ON public.utm_campaigns(content_item_id);
CREATE INDEX IF NOT EXISTS idx_web_attribution_content ON public.web_attribution_sessions(content_item_id);

-- Enable RLS
ALTER TABLE public.content_series ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.editorial_pillars_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_qa_evaluations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.news_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.news_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.utm_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.web_attribution_sessions ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Public read content series" ON public.content_series FOR SELECT USING (true);
CREATE POLICY "Admin manage content series" ON public.content_series FOR ALL TO authenticated USING (is_content_admin()) WITH CHECK (is_content_admin());

CREATE POLICY "Admin manage editorial pillars" ON public.editorial_pillars_config FOR ALL TO authenticated USING (is_content_admin()) WITH CHECK (is_content_admin());
CREATE POLICY "Admin read editorial pillars" ON public.editorial_pillars_config FOR SELECT TO authenticated USING (true);

CREATE POLICY "Admin manage content QA" ON public.content_qa_evaluations FOR ALL TO authenticated USING (is_content_admin()) WITH CHECK (is_content_admin());
CREATE POLICY "Admin manage news events" ON public.news_events FOR ALL TO authenticated USING (is_content_admin()) WITH CHECK (is_content_admin());
CREATE POLICY "Admin manage news alerts" ON public.news_alerts FOR ALL TO authenticated USING (is_content_admin()) WITH CHECK (is_content_admin());
CREATE POLICY "Admin manage utm campaigns" ON public.utm_campaigns FOR ALL TO authenticated USING (is_content_admin()) WITH CHECK (is_content_admin());
CREATE POLICY "Admin manage attribution" ON public.web_attribution_sessions FOR ALL TO authenticated USING (is_content_admin()) WITH CHECK (is_content_admin());

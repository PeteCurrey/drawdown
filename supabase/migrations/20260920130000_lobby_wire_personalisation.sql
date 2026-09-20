-- supabase/migrations/20260920130000_lobby_wire_personalisation.sql
-- The Wire Distribution Engine & The Lobby Personalisation Architecture

-- ─── 1. THE WIRE EDITIONS ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.wire_editions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  edition_type TEXT NOT NULL CHECK (edition_type IN ('MORNING', 'EVENING', 'BREAKING')),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  scheduled_for TIMESTAMPTZ,
  published_at TIMESTAMPTZ,
  status TEXT NOT NULL DEFAULT 'DRAFT' CHECK (status IN ('DRAFT', 'SCHEDULED', 'PUBLISHED', 'ARCHIVED')),
  subject_line TEXT NOT NULL,
  preview_text TEXT,
  editorial_notes TEXT,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ─── 2. THE WIRE EDITION ITEMS ─────────────────────────────────────────────
-- Items in a briefing edition reference canonical Lobby stories without duplicating content
CREATE TABLE IF NOT EXISTS public.wire_edition_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  edition_id UUID NOT NULL REFERENCES public.wire_editions(id) ON DELETE CASCADE,
  article_id UUID REFERENCES public.lobby_articles(id) ON DELETE SET NULL,
  display_order INTEGER NOT NULL DEFAULT 0,
  item_title TEXT NOT NULL,
  wire_summary TEXT NOT NULL,
  why_it_matters TEXT NOT NULL,
  recommended_tool_slug TEXT,
  market_category TEXT,
  source_attribution TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ─── 3. SOCIAL DISTRIBUTION QUEUE ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.lobby_social_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  article_id UUID NOT NULL REFERENCES public.lobby_articles(id) ON DELETE CASCADE,
  channel TEXT NOT NULL CHECK (channel IN ('X', 'LINKEDIN', 'INSTAGRAM')),
  content_text TEXT NOT NULL,
  media_urls JSONB NOT NULL DEFAULT '[]'::jsonb,
  status TEXT NOT NULL DEFAULT 'DRAFT' CHECK (status IN ('DRAFT', 'READY_FOR_REVIEW', 'APPROVED', 'SCHEDULED', 'PUBLISHED')),
  scheduled_for TIMESTAMPTZ,
  utm_params JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ─── 4. USER LOBBY PREFERENCES (WATCHLISTS & ALERTS) ───────────────────────
CREATE TABLE IF NOT EXISTS public.user_lobby_preferences (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  followed_markets TEXT[] NOT NULL DEFAULT '{}',
  followed_brokers TEXT[] NOT NULL DEFAULT '{}',
  followed_prop_firms TEXT[] NOT NULL DEFAULT '{}',
  followed_platforms TEXT[] NOT NULL DEFAULT '{}',
  followed_categories TEXT[] NOT NULL DEFAULT '{}',
  followed_tools TEXT[] NOT NULL DEFAULT '{}',
  alert_new_articles BOOLEAN NOT NULL DEFAULT true,
  alert_broker_updates BOOLEAN NOT NULL DEFAULT true,
  alert_prop_firm_updates BOOLEAN NOT NULL DEFAULT true,
  alert_market_events BOOLEAN NOT NULL DEFAULT true,
  alert_drawdown_updates BOOLEAN NOT NULL DEFAULT true,
  wire_digest_subscribed BOOLEAN NOT NULL DEFAULT true,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ─── 5. USER SAVED ARTICLES (BOOKMARKS) ────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.user_saved_articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  article_id UUID NOT NULL REFERENCES public.lobby_articles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT uq_user_saved_article UNIQUE (user_id, article_id)
);

-- ─── INDEXES ──────────────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_wire_editions_status ON public.wire_editions(status);
CREATE INDEX IF NOT EXISTS idx_wire_editions_slug ON public.wire_editions(slug);
CREATE INDEX IF NOT EXISTS idx_wire_editions_published_at ON public.wire_editions(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_wire_edition_items_edition_id ON public.wire_edition_items(edition_id, display_order ASC);
CREATE INDEX IF NOT EXISTS idx_wire_edition_items_article_id ON public.wire_edition_items(article_id);
CREATE INDEX IF NOT EXISTS idx_lobby_social_article_id ON public.lobby_social_posts(article_id);
CREATE INDEX IF NOT EXISTS idx_lobby_social_status ON public.lobby_social_posts(status);
CREATE INDEX IF NOT EXISTS idx_user_saved_articles_user_id ON public.user_saved_articles(user_id);

-- ─── ROW LEVEL SECURITY (RLS) ─────────────────────────────────────────────
ALTER TABLE public.wire_editions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wire_edition_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lobby_social_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_lobby_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_saved_articles ENABLE ROW LEVEL SECURITY;

-- Wire editions: Public read published
CREATE POLICY "Public read published wire editions"
  ON public.wire_editions FOR SELECT
  USING (status = 'PUBLISHED');

-- Wire editions: Admin full access
CREATE POLICY "Admin full access wire editions"
  ON public.wire_editions FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Wire edition items: Public read when edition is published
CREATE POLICY "Public read published wire items"
  ON public.wire_edition_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.wire_editions
      WHERE wire_editions.id = wire_edition_items.edition_id
      AND wire_editions.status = 'PUBLISHED'
    )
  );

-- Wire edition items: Admin full access
CREATE POLICY "Admin full access wire items"
  ON public.wire_edition_items FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Social posts: Admin only
CREATE POLICY "Admin full access social posts"
  ON public.lobby_social_posts FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- User preferences: Users access own preferences
CREATE POLICY "Users access own lobby preferences"
  ON public.user_lobby_preferences FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- User saved articles: Users access own saved articles
CREATE POLICY "Users access own saved articles"
  ON public.user_saved_articles FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

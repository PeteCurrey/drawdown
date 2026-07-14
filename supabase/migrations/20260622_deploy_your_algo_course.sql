-- ============================================================
-- DEPLOY YOUR ALGO — MINI COURSE
-- Migration: 20260622_deploy_your_algo_course.sql
-- ============================================================

-- ── Table 1: courses ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS courses (
  id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  slug            TEXT        UNIQUE NOT NULL,
  title           TEXT        NOT NULL,
  subtitle        TEXT,
  description     TEXT,
  price_gbp       INTEGER     NOT NULL,   -- in pence (9700 = £97)
  stripe_price_id TEXT,                   -- populated after Stripe setup
  is_published    BOOLEAN     DEFAULT false,
  is_free_for_floor BOOLEAN   DEFAULT true,
  thumbnail_url   TEXT,
  created_at      TIMESTAMPTZ DEFAULT now()
);

-- ── Table 2: course_modules ───────────────────────────────────
CREATE TABLE IF NOT EXISTS course_modules (
  id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id  UUID        REFERENCES courses(id) ON DELETE CASCADE,
  title      TEXT        NOT NULL,
  subtitle   TEXT,
  sort_order INTEGER     NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ── Table 3: course_lessons ───────────────────────────────────
CREATE TABLE IF NOT EXISTS course_lessons (
  id                 UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id          UUID        REFERENCES course_modules(id) ON DELETE CASCADE,
  course_id          UUID        REFERENCES courses(id) ON DELETE CASCADE,
  title              TEXT        NOT NULL,
  slug               TEXT        NOT NULL,
  content_mdx        TEXT,                   -- full lesson prose in markdown
  estimated_minutes  INTEGER,
  sort_order         INTEGER     NOT NULL,
  is_preview         BOOLEAN     DEFAULT false, -- visible without purchase
  created_at         TIMESTAMPTZ DEFAULT now(),
  UNIQUE(course_id, slug)
);

-- ── Table 4: course_purchases ─────────────────────────────────
CREATE TABLE IF NOT EXISTS course_purchases (
  id                       UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id                  UUID        REFERENCES auth.users(id) ON DELETE CASCADE,
  course_id                UUID        REFERENCES courses(id) ON DELETE CASCADE,
  stripe_payment_intent_id TEXT,                    -- null if granted via tier
  stripe_session_id        TEXT,
  amount_paid_pence        INTEGER,                 -- 0 if granted via Floor tier
  access_granted_via       TEXT        NOT NULL,   -- 'stripe_purchase' | 'floor_tier' | 'manual_grant'
  purchased_at             TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, course_id)
);

-- ── Table 5: course_progress ──────────────────────────────────
CREATE TABLE IF NOT EXISTS course_progress (
  id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID        REFERENCES auth.users(id) ON DELETE CASCADE,
  lesson_id    UUID        REFERENCES course_lessons(id) ON DELETE CASCADE,
  course_id    UUID        REFERENCES courses(id) ON DELETE CASCADE,
  completed_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, lesson_id)
);

-- ── RLS Policies ──────────────────────────────────────────────

ALTER TABLE courses         ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_modules  ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_lessons  ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_progress ENABLE ROW LEVEL SECURITY;

-- courses: anyone can read published courses
DROP POLICY IF EXISTS "courses_public_read"   ON courses;
CREATE POLICY "courses_public_read" ON courses
  FOR SELECT USING (is_published = true);

-- course_modules: publicly readable (purchase check in app layer)
DROP POLICY IF EXISTS "modules_public_read"   ON course_modules;
CREATE POLICY "modules_public_read" ON course_modules
  FOR SELECT USING (true);

-- course_lessons: publicly readable (purchase check in app layer)
DROP POLICY IF EXISTS "lessons_public_read"   ON course_lessons;
CREATE POLICY "lessons_public_read" ON course_lessons
  FOR SELECT USING (true);

-- course_purchases: users can only see/write their own rows
DROP POLICY IF EXISTS "purchases_own"         ON course_purchases;
CREATE POLICY "purchases_own" ON course_purchases
  FOR ALL USING (auth.uid() = user_id);

-- course_progress: users can only see/write their own rows
DROP POLICY IF EXISTS "progress_own"          ON course_progress;
CREATE POLICY "progress_own" ON course_progress
  FOR ALL USING (auth.uid() = user_id);

-- Service-role bypass for webhook inserts (purchases, progress)
-- The webhook runs with service role so it can insert for any user.
-- No extra policy needed — service role bypasses RLS.

-- ── Seed: "Deploy Your Algo" course ──────────────────────────
INSERT INTO courses (slug, title, subtitle, description, price_gbp, is_published, is_free_for_floor)
VALUES (
  'deploy-your-algo',
  'Deploy Your Algo',
  'From generated code to live chart in under an hour.',
  'The only guide written specifically for traders who have generated their first Pine Script or Python strategy and have no idea what to do next. Five modules. No fluff. Just the exact steps.',
  9700,
  true,
  true
)
ON CONFLICT (slug) DO NOTHING;

-- ── Floor-tier auto-grant function ────────────────────────────
-- Called from the Stripe webhook when a user upgrades to Floor tier.
CREATE OR REPLACE FUNCTION grant_floor_courses(p_user_id UUID)
RETURNS VOID AS $$
DECLARE
  v_course_id UUID;
BEGIN
  FOR v_course_id IN
    SELECT id FROM courses
    WHERE is_free_for_floor = true
      AND is_published      = true
  LOOP
    INSERT INTO course_purchases (
      user_id,
      course_id,
      amount_paid_pence,
      access_granted_via
    ) VALUES (
      p_user_id,
      v_course_id,
      0,
      'floor_tier'
    )
    ON CONFLICT (user_id, course_id) DO NOTHING;
  END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute to authenticated users (webhook calls via service role,
-- but keeping this open lets future server-actions call it too)
GRANT EXECUTE ON FUNCTION grant_floor_courses(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION grant_floor_courses(UUID) TO service_role;

-- ============================================================
-- DEPLOY YOUR ALGO — Module + Lesson skeleton
-- Migration: 20260622_deploy_your_algo_modules.sql
-- Run AFTER 20260622_deploy_your_algo_course.sql
-- ============================================================

DO $$
DECLARE
  v_course_id UUID;
  v_mod1 UUID; v_mod2 UUID; v_mod3 UUID; v_mod4 UUID; v_mod5 UUID;
BEGIN
  SELECT id INTO v_course_id FROM courses WHERE slug = 'deploy-your-algo';
  IF v_course_id IS NULL THEN
    RAISE EXCEPTION 'Course deploy-your-algo not found — run the course seed first';
  END IF;

  -- ── Modules ────────────────────────────────────────────────
  INSERT INTO course_modules (course_id, title, subtitle, sort_order) VALUES
    (v_course_id, 'Module 1', 'Your First Script on TradingView', 1)
    RETURNING id INTO v_mod1;

  INSERT INTO course_modules (course_id, title, subtitle, sort_order) VALUES
    (v_course_id, 'Module 2', 'Reading Backtest Results Like a Pro', 2)
    RETURNING id INTO v_mod2;

  INSERT INTO course_modules (course_id, title, subtitle, sort_order) VALUES
    (v_course_id, 'Module 3', 'Automating Your Alerts', 3)
    RETURNING id INTO v_mod3;

  INSERT INTO course_modules (course_id, title, subtitle, sort_order) VALUES
    (v_course_id, 'Module 4', 'Running Python Backtests', 4)
    RETURNING id INTO v_mod4;

  INSERT INTO course_modules (course_id, title, subtitle, sort_order) VALUES
    (v_course_id, 'Module 5', 'Going Live — Brokers, APIs & Risk', 5)
    RETURNING id INTO v_mod5;

  -- ── Module 1 lessons ───────────────────────────────────────
  INSERT INTO course_lessons (module_id, course_id, title, slug, estimated_minutes, sort_order, is_preview) VALUES
    (v_mod1, v_course_id, 'Where does the code actually go?',  'where-does-the-code-go',   5, 1, true),
    (v_mod1, v_course_id, 'Opening the Pine Script Editor',    'opening-pine-editor',       5, 2, false),
    (v_mod1, v_course_id, 'Adding your strategy to the chart', 'adding-to-chart',           5, 3, false);

  -- ── Module 2 lessons ───────────────────────────────────────
  INSERT INTO course_lessons (module_id, course_id, title, slug, estimated_minutes, sort_order, is_preview) VALUES
    (v_mod2, v_course_id, 'The five stats that actually matter', 'five-stats-that-matter',      8, 1, false),
    (v_mod2, v_course_id, 'Why win rate is a lie (on its own)', 'win-rate-is-a-lie',            7, 2, false),
    (v_mod2, v_course_id, 'Spotting overfitted results',        'spotting-overfitted-results',  5, 3, false);

  -- ── Module 3 lessons ───────────────────────────────────────
  INSERT INTO course_lessons (module_id, course_id, title, slug, estimated_minutes, sort_order, is_preview) VALUES
    (v_mod3, v_course_id, 'How TradingView alerts work',    'how-alerts-work',        7, 1, false),
    (v_mod3, v_course_id, 'Setting up your first webhook',  'setting-up-webhook',     8, 2, false),
    (v_mod3, v_course_id, 'Connecting to TradersPost',      'connecting-traderspost', 5, 3, false);

  -- ── Module 4 lessons ───────────────────────────────────────
  INSERT INTO course_lessons (module_id, course_id, title, slug, estimated_minutes, sort_order, is_preview) VALUES
    (v_mod4, v_course_id, 'Installing Python in 10 minutes', 'installing-python',       8, 1, false),
    (v_mod4, v_course_id, 'Running your backtest script',    'running-backtest',       10, 2, false),
    (v_mod4, v_course_id, 'Reading the terminal output',     'reading-terminal-output', 7, 3, false);

  -- ── Module 5 lessons ───────────────────────────────────────
  INSERT INTO course_lessons (module_id, course_id, title, slug, estimated_minutes, sort_order, is_preview) VALUES
    (v_mod5, v_course_id, 'The honest truth about live algo trading', 'honest-truth-live-trading', 8, 1, false),
    (v_mod5, v_course_id, 'Choosing a broker with an API',            'choosing-broker-api',       7, 2, false),
    (v_mod5, v_course_id, 'Your pre-live checklist',                  'pre-live-checklist',        5, 3, false);

END $$;

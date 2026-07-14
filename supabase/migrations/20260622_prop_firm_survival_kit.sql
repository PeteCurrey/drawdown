-- ============================================================
-- PROP FIRM SURVIVAL KIT — DATABASE & SEED
-- Migration: 20260622_prop_firm_survival_kit.sql
-- ============================================================

-- ── 1. Schema Extensions & New Columns ────────────────────────

-- Check if we need to modify course_modules to align with course_id and slug columns
ALTER TABLE course_modules
  ADD COLUMN IF NOT EXISTS course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  ADD COLUMN IF NOT EXISTS slug TEXT,
  ADD COLUMN IF NOT EXISTS sort_order INTEGER;

-- Make phase and module_number nullable since they are not used in modular courses
ALTER TABLE course_modules 
  ALTER COLUMN phase DROP NOT NULL,
  ALTER COLUMN module_number DROP NOT NULL;

-- Drop phase/module_number unique constraint if we use course_id & slug
ALTER TABLE course_modules DROP CONSTRAINT IF EXISTS course_modules_phase_module_number_key;

-- Add new columns to course_lessons
ALTER TABLE course_lessons 
  ADD COLUMN IF NOT EXISTS callouts JSONB DEFAULT '[]',
  ADD COLUMN IF NOT EXISTS key_points TEXT[] DEFAULT '{}';

-- ── 2. Quiz Tables ──────────────────────────────────────────

-- Quiz questions table
CREATE TABLE IF NOT EXISTS course_quiz_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id UUID REFERENCES course_modules(id) ON DELETE CASCADE,
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  options JSONB NOT NULL,      -- array of {id, text} objects
  correct_option_id TEXT NOT NULL,
  explanation TEXT,            -- shown after answering
  sort_order INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Quiz attempts table (tracks per-user quiz results)
CREATE TABLE IF NOT EXISTS course_quiz_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  module_id UUID REFERENCES course_modules(id) ON DELETE CASCADE,
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  score INTEGER NOT NULL,          -- number of correct answers
  total_questions INTEGER NOT NULL,
  passed BOOLEAN NOT NULL,         -- true if score >= 80%
  answers JSONB NOT NULL,          -- {question_id: selected_option_id}
  attempted_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, module_id)       -- one attempt stored (best score)
);

-- ── RLS Policies ──────────────────────────────────────────────

ALTER TABLE course_quiz_questions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "quiz_questions_public_read" ON course_quiz_questions;
CREATE POLICY "quiz_questions_public_read" ON course_quiz_questions 
  FOR SELECT USING (true);

ALTER TABLE course_quiz_attempts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "quiz_attempts_own" ON course_quiz_attempts;
CREATE POLICY "quiz_attempts_own" ON course_quiz_attempts 
  FOR ALL USING (auth.uid() = user_id);

-- ── 3. Seed Course, Modules, and Lessons ──────────────────────

DO $$
DECLARE
  v_course_id UUID;
  v_mod1 UUID; v_mod2 UUID; v_mod3 UUID; 
  v_mod4 UUID; v_mod5 UUID; v_mod6 UUID;
BEGIN

-- Insert course if not exists
INSERT INTO courses (
  slug, title, subtitle, description, price_gbp, 
  is_published, is_free_for_floor, stripe_price_id
) VALUES (
  'prop-firm-survival-kit',
  'Prop Firm Survival Kit',
  'Most traders don''t fail the challenge. They fail because nobody told them the real rules.',
  'Five modules. Every rule decoded. Every psychological spiral named. Pass each module quiz to complete the kit.',
  9700,
  true,
  true,
  null
) 
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  subtitle = EXCLUDED.subtitle,
  description = EXCLUDED.description
RETURNING id INTO v_course_id;

-- Ensure modules exist
-- MODULE 1
INSERT INTO course_modules (course_id, title, subtitle, sort_order)
VALUES (v_course_id, 'The Truth About Prop Firms', 'Understanding the industry before you risk a penny', 1)
ON CONFLICT DO NOTHING;

SELECT id INTO v_mod1 FROM course_modules WHERE course_id = v_course_id AND sort_order = 1;
IF v_mod1 IS NULL THEN
  INSERT INTO course_modules (course_id, title, subtitle, sort_order)
  VALUES (v_course_id, 'The Truth About Prop Firms', 'Understanding the industry before you risk a penny', 1)
  RETURNING id INTO v_mod1;
END IF;

-- MODULE 2
INSERT INTO course_modules (course_id, title, subtitle, sort_order)
VALUES (v_course_id, 'How Evaluations Really Work', 'Understanding the rules before they understand you', 2)
ON CONFLICT DO NOTHING;

SELECT id INTO v_mod2 FROM course_modules WHERE course_id = v_course_id AND sort_order = 2;
IF v_mod2 IS NULL THEN
  INSERT INTO course_modules (course_id, title, subtitle, sort_order)
  VALUES (v_course_id, 'How Evaluations Really Work', 'Understanding the rules before they understand you', 2)
  RETURNING id INTO v_mod2;
END IF;

-- MODULE 3
INSERT INTO course_modules (course_id, title, subtitle, sort_order)
VALUES (v_course_id, 'The Rules — And Why They Exist', 'The framework that separates professionals from gamblers', 3)
ON CONFLICT DO NOTHING;

SELECT id INTO v_mod3 FROM course_modules WHERE course_id = v_course_id AND sort_order = 3;
IF v_mod3 IS NULL THEN
  INSERT INTO course_modules (course_id, title, subtitle, sort_order)
  VALUES (v_course_id, 'The Rules — And Why They Exist', 'The framework that separates professionals from gamblers', 3)
  RETURNING id INTO v_mod3;
END IF;

-- MODULE 4
INSERT INTO course_modules (course_id, title, subtitle, sort_order)
VALUES (v_course_id, 'Risk Management Framework', 'The foundation of every successful trader', 4)
ON CONFLICT DO NOTHING;

SELECT id INTO v_mod4 FROM course_modules WHERE course_id = v_course_id AND sort_order = 4;
IF v_mod4 IS NULL THEN
  INSERT INTO course_modules (course_id, title, subtitle, sort_order)
  VALUES (v_course_id, 'Risk Management Framework', 'The foundation of every successful trader', 4)
  RETURNING id INTO v_mod4;
END IF;

-- MODULE 5
INSERT INTO course_modules (course_id, title, subtitle, sort_order)
VALUES (v_course_id, 'Building Your Trading Plan', 'Creating the operating system for consistent trading success', 5)
ON CONFLICT DO NOTHING;

SELECT id INTO v_mod5 FROM course_modules WHERE course_id = v_course_id AND sort_order = 5;
IF v_mod5 IS NULL THEN
  INSERT INTO course_modules (course_id, title, subtitle, sort_order)
  VALUES (v_course_id, 'Building Your Trading Plan', 'Creating the operating system for consistent trading success', 5)
  RETURNING id INTO v_mod5;
END IF;

-- MODULE 6
INSERT INTO course_modules (course_id, title, subtitle, sort_order)
VALUES (v_course_id, 'The Drawdown Commandments', 'The principles every funded trader must live by', 6)
ON CONFLICT DO NOTHING;

SELECT id INTO v_mod6 FROM course_modules WHERE course_id = v_course_id AND sort_order = 6;
IF v_mod6 IS NULL THEN
  INSERT INTO course_modules (course_id, title, subtitle, sort_order)
  VALUES (v_course_id, 'The Drawdown Commandments', 'The principles every funded trader must live by', 6)
  RETURNING id INTO v_mod6;
END IF;

-- Clean out existing lessons for the course to allow clean seed/re-run
DELETE FROM course_lessons WHERE course_id = v_course_id;

-- MODULE 1 LESSONS (6 lessons)
INSERT INTO course_lessons (module_id, course_id, title, slug, estimated_minutes, sort_order, is_preview) VALUES
  (v_mod1, v_course_id, 'What a Prop Firm Actually Is', 'what-is-a-prop-firm', 4, 1, true),
  (v_mod1, v_course_id, 'How Prop Firms Actually Make Money', 'how-prop-firms-make-money', 4, 2, false),
  (v_mod1, v_course_id, 'The Prop Firm Business Model', 'prop-firm-business-model', 4, 3, false),
  (v_mod1, v_course_id, 'Why Most Traders Fail', 'why-most-traders-fail', 5, 4, false),
  (v_mod1, v_course_id, 'Selecting the Right Prop Firm', 'selecting-the-right-prop-firm', 4, 5, false),
  (v_mod1, v_course_id, 'The Real Opportunity', 'the-real-opportunity', 3, 6, false);

-- MODULE 2 LESSONS (7 lessons)
INSERT INTO course_lessons (module_id, course_id, title, slug, estimated_minutes, sort_order, is_preview) VALUES
  (v_mod2, v_course_id, 'What an Evaluation Actually Tests', 'what-evaluation-tests', 4, 1, false),
  (v_mod2, v_course_id, 'The Three Evaluation Models', 'three-evaluation-models', 5, 2, false),
  (v_mod2, v_course_id, 'Understanding Maximum Drawdown', 'understanding-maximum-drawdown', 5, 3, false),
  (v_mod2, v_course_id, 'Static vs Trailing Drawdown', 'static-vs-trailing-drawdown', 5, 4, false),
  (v_mod2, v_course_id, 'Daily Loss Limits Explained', 'daily-loss-limits', 4, 5, false),
  (v_mod2, v_course_id, 'Consistency Rules and News Restrictions', 'consistency-and-news-rules', 4, 6, false),
  (v_mod2, v_course_id, 'The Challenge Passing Framework', 'challenge-passing-framework', 5, 7, false);

-- MODULE 3 LESSONS (7 lessons)
INSERT INTO course_lessons (module_id, course_id, title, slug, estimated_minutes, sort_order, is_preview) VALUES
  (v_mod3, v_course_id, 'Why Rules Exist in the First Place', 'why-rules-exist', 4, 1, false),
  (v_mod3, v_course_id, 'The Maximum Drawdown Rule', 'maximum-drawdown-rule', 5, 2, false),
  (v_mod3, v_course_id, 'Daily Loss Limits as Circuit Breakers', 'daily-loss-circuit-breakers', 4, 3, false),
  (v_mod3, v_course_id, 'The Truth About Consistency Rules', 'truth-about-consistency-rules', 4, 4, false),
  (v_mod3, v_course_id, 'News Trading Restrictions Decoded', 'news-trading-restrictions', 4, 5, false),
  (v_mod3, v_course_id, 'The Hidden Rule Nobody Talks About', 'hidden-rule-professionalism', 3, 6, false),
  (v_mod3, v_course_id, 'The Drawdown Philosophy', 'drawdown-philosophy', 4, 7, false);

-- MODULE 4 LESSONS (10 lessons)
INSERT INTO course_lessons (module_id, course_id, title, slug, estimated_minutes, sort_order, is_preview) VALUES
  (v_mod4, v_course_id, 'Capital Is Inventory', 'capital-is-inventory', 4, 1, false),
  (v_mod4, v_course_id, 'Thinking in Probabilities', 'thinking-in-probabilities', 4, 2, false),
  (v_mod4, v_course_id, 'Expectancy: The Metric That Actually Matters', 'expectancy-metric', 5, 3, false),
  (v_mod4, v_course_id, 'Position Sizing — The Silent Account Killer', 'position-sizing', 5, 4, false),
  (v_mod4, v_course_id, 'The 1% Rule Explained', 'one-percent-rule', 4, 5, false),
  (v_mod4, v_course_id, 'Understanding Losing Streaks', 'understanding-losing-streaks', 4, 6, false),
  (v_mod4, v_course_id, 'The Professional Risk Pyramid', 'professional-risk-pyramid', 4, 7, false),
  (v_mod4, v_course_id, 'How Hedge Funds Think About Risk', 'hedge-fund-risk-thinking', 4, 8, false),
  (v_mod4, v_course_id, 'Risk of Ruin', 'risk-of-ruin', 3, 9, false),
  (v_mod4, v_course_id, 'Building Your Personal Risk Framework', 'personal-risk-framework', 5, 10, false);

-- MODULE 5 LESSONS (6 lessons)
INSERT INTO course_lessons (module_id, course_id, title, slug, estimated_minutes, sort_order, is_preview) VALUES
  (v_mod5, v_course_id, 'What a Trading Plan Actually Is', 'what-is-a-trading-plan', 4, 1, false),
  (v_mod5, v_course_id, 'Defining Your Trading Business', 'defining-your-trading-business', 4, 2, false),
  (v_mod5, v_course_id, 'Entry Criteria, Exits and Position Rules', 'entry-exit-position-rules', 5, 3, false),
  (v_mod5, v_course_id, 'The Importance of Journaling', 'importance-of-journaling', 4, 4, false),
  (v_mod5, v_course_id, 'Your Daily Trading Routine', 'daily-trading-routine', 4, 5, false),
  (v_mod5, v_course_id, 'Building Your Personal Playbook', 'personal-playbook', 4, 6, false);

-- MODULE 6 LESSONS (4 lessons)
INSERT INTO course_lessons (module_id, course_id, title, slug, estimated_minutes, sort_order, is_preview) VALUES
  (v_mod6, v_course_id, 'Commandments 1–4: Capital and Survival', 'commandments-1-4', 4, 1, false),
  (v_mod6, v_course_id, 'Commandments 5–8: Process and Consistency', 'commandments-5-8', 4, 2, false),
  (v_mod6, v_course_id, 'Commandments 9–10: The Long Game', 'commandments-9-10', 3, 3, false),
  (v_mod6, v_course_id, 'Your Pre-Challenge Checklist', 'pre-challenge-checklist', 5, 4, false);

END $$;

-- ── 4. Seed Quiz Questions (5 per module, 30 total) ───────────

-- Clean existing questions for the course
DELETE FROM course_quiz_questions 
WHERE course_id = (SELECT id FROM courses WHERE slug = 'prop-firm-survival-kit');

-- Module 1 Questions
INSERT INTO course_quiz_questions (module_id, course_id, question, options, correct_option_id, explanation, sort_order)
SELECT 
  m.id,
  m.course_id,
  q.question,
  q.options::JSONB,
  q.correct_option_id,
  q.explanation,
  q.sort_order
FROM course_modules m
CROSS JOIN (VALUES
  (
    'What is the primary revenue source for most retail prop firms?',
    '[{"id":"a","text":"Profit sharing from funded traders"},{"id":"b","text":"Challenge fees from evaluation purchases"},{"id":"c","text":"Brokerage rebates"},{"id":"d","text":"Data licensing"}]',
    'b',
    'While prop firms profit from successful traders, challenge fees are the primary revenue driver. Many traders fail and repurchase, creating substantial recurring revenue.',
    1
  ),
  (
    'What does "protect capital first" mean in practice?',
    '[{"id":"a","text":"Never take any risk"},{"id":"b","text":"Only trade when you are certain"},{"id":"c","text":"Every decision should prioritise preserving your account balance before chasing profit"},{"id":"d","text":"Use the smallest possible position sizes always"}]',
    'c',
    'Capital is inventory. Without it you cannot trade. Every decision flows from protecting it — not eliminating risk, but ensuring no single loss removes you from the game.',
    2
  ),
  (
    'Which failure pattern accounts for the most prop challenge failures?',
    '[{"id":"a","text":"Poor strategy selection"},{"id":"b","text":"Not enough screen time"},{"id":"c","text":"Behaviour — overleveraging, impatience, revenge trading"},{"id":"d","text":"Choosing the wrong broker"}]',
    'c',
    'Most traders fail due to behaviour, not strategy. The four patterns are overleveraging, impatience, revenge trading, and ignoring rules — none of which are strategy problems.',
    3
  ),
  (
    'What is the key distinction between a customer and a funded trader at a prop firm?',
    '[{"id":"a","text":"There is no distinction"},{"id":"b","text":"You are a customer first, funded trader second, business partner third"},{"id":"c","text":"Funded traders have more rights than customers"},{"id":"d","text":"Customers do not interact with the firm"}]',
    'b',
    'Understanding this removes emotion from the relationship. The firm is not your friend or enemy — it is a business. Treat it accordingly.',
    4
  ),
  (
    'What does passing a challenge actually prove?',
    '[{"id":"a","text":"Long-term profitability"},{"id":"b","text":"Emotional control"},{"id":"c","text":"That you passed a challenge — nothing more"},{"id":"d","text":"Professional discipline"}]',
    'c',
    'Passing a challenge proves you passed a challenge. Long-term profitability, emotional control and sustainable performance are demonstrated over months and years, not days.',
    5
  )
) AS q(question, options, correct_option_id, explanation, sort_order)
WHERE m.course_id = (SELECT id FROM courses WHERE slug = 'prop-firm-survival-kit')
AND m.sort_order = 1;

-- Module 2 Questions
INSERT INTO course_quiz_questions (module_id, course_id, question, options, correct_option_id, explanation, sort_order)
SELECT 
  m.id,
  m.course_id,
  q.question,
  q.options::JSONB,
  q.correct_option_id,
  q.explanation,
  q.sort_order
FROM course_modules m
CROSS JOIN (VALUES
  (
    'What does a prop firm evaluation actually test?',
    '[{"id":"a","text":"Your technical indicator knowledge"},{"id":"b","text":"Your market prediction accuracy"},{"id":"c","text":"Your ability to follow strict rules and manage downside"},{"id":"d","text":"Your ability to trade high lot sizes"}]',
    'c',
    'Evaluations are designed to filter out high-risk gamblers. They test risk compliance, discipline, and drawdowns, not just profit generation.',
    1
  ),
  (
    'How does static drawdown differ from trailing drawdown?',
    '[{"id":"a","text":"Static drawdown is tied to a fixed balance floor, while trailing drawdown moves up with your account high equity"},{"id":"b","text":"Static drawdown moves down as your account equity grows"},{"id":"c","text":"Static drawdown only applies to closed trades"},{"id":"d","text":"Trailing drawdown does not exist in prop firms"}]',
    'a',
    'Static drawdown is fixed at a certain level below your starting balance. Trailing drawdown trails your peak account equity, making it harder to maintain buffer as your account grows.',
    2
  ),
  (
    'Why are daily loss limits calculated on equity rather than just closed balance?',
    '[{"id":"a","text":"It is easier to calculate"},{"id":"b","text":"To encourage holding trades overnight"},{"id":"c","text":"To protect the firm from sudden market gaps"},{"id":"d","text":"To prevent traders from holding large, open losing positions past the daily limit"}]',
    'd',
    'Calculating limits on equity ensures that open losses are counted against your daily limit, preventing you from hiding risk in open positions.',
    3
  ),
  (
    'If your daily loss limit is 5% and you lose 4.8% on closed trades but your open floating loss reaches 5.1%, what happens?',
    '[{"id":"a","text":"Nothing, as long as you close the trade in profit"},{"id":"b","text":"You breach the daily limit and fail the challenge"},{"id":"c","text":"You get a warning email from the firm"},{"id":"d","text":"The firm automatically closes your trade but you do not fail"}]',
    'b',
    'Any touch of the daily loss limit (closed or open equity) constitutes a hard breach and instant failure.',
    4
  ),
  (
    'What is the primary purpose of consistency rules at prop firms?',
    '[{"id":"a","text":"To ensure your profits are not generated by a single lucky trade"},{"id":"b","text":"To force you to trade every single day"},{"id":"c","text":"To restrict your trade duration"},{"id":"d","text":"To limit the volume of your trades"}]',
    'a',
    'Consistency rules prevent gamblers from passing challenges with one huge lucky trade and then doing minimal trading to qualify for payouts.',
    5
  )
) AS q(question, options, correct_option_id, explanation, sort_order)
WHERE m.course_id = (SELECT id FROM courses WHERE slug = 'prop-firm-survival-kit')
AND m.sort_order = 2;

-- Module 3 Questions
INSERT INTO course_quiz_questions (module_id, course_id, question, options, correct_option_id, explanation, sort_order)
SELECT 
  m.id,
  m.course_id,
  q.question,
  q.options::JSONB,
  q.correct_option_id,
  q.explanation,
  q.sort_order
FROM course_modules m
CROSS JOIN (VALUES
  (
    'Why do prop firms enforce news trading restrictions?',
    '[{"id":"a","text":"Because news is unpredictable"},{"id":"b","text":"To shield the firm from slippage and extreme volatility during high-impact releases"},{"id":"c","text":"To prevent traders from making too much money"},{"id":"d","text":"Because the feeds go down during news"}]',
    'b',
    'News releases trigger high volatility, wide spreads, and slippage. Firms restrict trading around high-impact news to prevent traders from exposing capital to random risk they cannot hedge.',
    1
  ),
  (
    'What is the true purpose of the maximum drawdown rule?',
    '[{"id":"a","text":"It serves as the firm''s hard stop-loss to prevent catastrophic losses of their capital pool"},{"id":"b","text":"To limit the speed of your account growth"},{"id":"c","text":"To encourage you to buy more challenges"},{"id":"d","text":"To charge additional fees"}]',
    'a',
    'Catastrophic drawdown threatens the capital base of the firm. The max drawdown limit is their absolute circuit breaker to stop losses on an account.',
    2
  ),
  (
    'Under consistency rules, what is a common requirement for payout eligibility?',
    '[{"id":"a","text":"You must trade for 30 consecutive days"},{"id":"b","text":"You must use the exact same lot size on every trade"},{"id":"c","text":"No single trading day can account for more than a set percentage (e.g., 30% or 40%) of total profits"},{"id":"d","text":"You must only trade one instrument"}]',
    'c',
    'Most consistency rules enforce that a single day cannot exceed a percentage of your total profit, ensuring gains are distributed across multiple setups.',
    3
  ),
  (
    'Why do prop firms treat daily loss limits as automatic circuit breakers?',
    '[{"id":"a","text":"Because they want you to take a break"},{"id":"b","text":"To charge a restart fee"},{"id":"c","text":"To check your indicators"},{"id":"d","text":"To force a stop to trading for the day, preventing emotional revenge trading"}]',
    'd',
    'Daily loss limits act as automatic circuit breakers to protect both you and the firm from emotional spiraling or revenge trading on bad days.',
    4
  ),
  (
    'What is the "hidden rule" of professional trading that prop firms exploit?',
    '[{"id":"a","text":"The spread markup"},{"id":"b","text":"Retail traders struggle with boredom and will overtrade when there is no market setup"},{"id":"c","text":"Platform lag"},{"id":"d","text":"Inaccurate charts"}]',
    'b',
    'Prop firms know that retail traders lack patience. Over time, boredom leading to overtrading accounts for a massive percentage of breaches.',
    5
  )
) AS q(question, options, correct_option_id, explanation, sort_order)
WHERE m.course_id = (SELECT id FROM courses WHERE slug = 'prop-firm-survival-kit')
AND m.sort_order = 3;

-- Module 4 Questions
INSERT INTO course_quiz_questions (module_id, course_id, question, options, correct_option_id, explanation, sort_order)
SELECT 
  m.id,
  m.course_id,
  q.question,
  q.options::JSONB,
  q.correct_option_id,
  q.explanation,
  q.sort_order
FROM course_modules m
CROSS JOIN (VALUES
  (
    'Why is capital described as "inventory" in professional trading?',
    '[{"id":"a","text":"Because it can be sold for goods"},{"id":"b","text":"Because it must be stored in a warehouse"},{"id":"c","text":"Because losses are simply the cost of doing business, not a personal failure"},{"id":"d","text":"Because you must accumulate as much of it as possible"}]',
    'c',
    'Professional traders look at money like raw inventory. Losses are cost of goods sold, and gains are revenue. This keeps emotion out of standard trading outcomes.',
    1
  ),
  (
    'What does "thinking in probabilities" mean for a trader?',
    '[{"id":"a","text":"Accepting that any single trade outcome is random, but a large sample size of trades will yield an edge"},{"id":"b","text":"Using mathematical equations to predict the exact next candle"},{"id":"c","text":"Assuming all trades have a 50/50 chance of winning"},{"id":"d","text":"Only trading when there is a 99% probability of winning"}]',
    'a',
    'Individual trades have random outcomes. Probability thinking means you focus on executing your edge consistently over hundreds of trades where the net result is positive.',
    2
  ),
  (
    'How is trading expectancy calculated?',
    '[{"id":"a","text":"Win Rate / Loss Rate"},{"id":"b","text":"(Win Rate * Average Win Size) - (Loss Rate * Average Loss Size)"},{"id":"c","text":"Average Win Size - Average Loss Size"},{"id":"d","text":"Win Rate * Average Win Size"}]',
    'b',
    'Expectancy calculates the average value of each trade you place. Positive expectancy is what guarantees long-term growth.',
    3
  ),
  (
    'Why is position sizing called the "silent account killer"?',
    '[{"id":"a","text":"Because it is hidden from the broker"},{"id":"b","text":"Because it varies by country"},{"id":"c","text":"Because brokers charge hidden fees on it"},{"id":"d","text":"Because incorrect sizing is the direct mechanism that turns standard losing streaks into account breaches"}]',
    'd',
    'Even the best strategies experience losing streaks. If position sizing is too aggressive, a minor streak will wipe out the account buffer before the edge can play out.',
    4
  ),
  (
    'Under the 1% risk rule, how much should you risk on any single trade setup?',
    '[{"id":"a","text":"A maximum of 1% of your current account balance"},{"id":"b","text":"Exactly 1% of your target payout"},{"id":"c","text":"1% of your leverage limit"},{"id":"d","text":"1% of your monthly profit target"}]',
    'a',
    'Risking a maximum of 1% per trade preserves your drawdown buffer and gives you a runway of dozens of trades to survive drawdowns.',
    5
  )
) AS q(question, options, correct_option_id, explanation, sort_order)
WHERE m.course_id = (SELECT id FROM courses WHERE slug = 'prop-firm-survival-kit')
AND m.sort_order = 4;

-- Module 5 Questions
INSERT INTO course_quiz_questions (module_id, course_id, question, options, correct_option_id, explanation, sort_order)
SELECT 
  m.id,
  m.course_id,
  q.question,
  q.options::JSONB,
  q.correct_option_id,
  q.explanation,
  q.sort_order
FROM course_modules m
CROSS JOIN (VALUES
  (
    'What is the primary purpose of a trading plan?',
    '[{"id":"a","text":"To show to potential investors"},{"id":"b","text":"To guarantee 100% win rates"},{"id":"c","text":"To serve as a written, objective operating system that removes in-the-moment emotional decisions"},{"id":"d","text":"To explain market cycles"}]',
    'c',
    'A trading plan acts as your rules manual. It pre-determines what you will do in every scenario, shutting down emotional impulses in real-time.',
    1
  ),
  (
    'Which of the following is a critical element of entry criteria in a playbook?',
    '[{"id":"a","text":"A specific, pre-defined technical pattern with exact rules"},{"id":"b","text":"A strong gut feeling about market direction"},{"id":"c","text":"What social media accounts are saying"},{"id":"d","text":"The daily profit goal of the firm"}]',
    'a',
    'Entry criteria must be objective, repeatable, and clearly defined. Gut feelings do not constitute a trading plan.',
    2
  ),
  (
    'Why is journaling trades considered non-negotiable for professional growth?',
    '[{"id":"a","text":"To save your historical charts"},{"id":"b","text":"To prove to others that you trade"},{"id":"c","text":"To satisfy prop firm regulations"},{"id":"d","text":"It allows you to find statistical patterns in your own performance and track emotional compliance"}]',
    'd',
    'Journaling helps you identify where you are deviating from your plan and isolates which setups are performing versus which ones are leaking capital.',
    3
  ),
  (
    'What is a key component of a professional daily trading routine?',
    '[{"id":"a","text":"Trading whenever you have free time"},{"id":"b","text":"Pre-market preparation, identifying key levels, and post-market review"},{"id":"c","text":"Watching live streams all day"},{"id":"d","text":"Constant lot scaling"}]',
    'b',
    'Routine establishes consistency. Pre-market prep prevents chasing setups, and post-market reviews catch bad behaviors early.',
    4
  ),
  (
    'What is a "personal playbook" in the context of trading?',
    '[{"id":"a","text":"A handbook of famous traders"},{"id":"b","text":"A standard trading book"},{"id":"c","text":"A documented library of your setup variations, complete with screenshots and performance statistics"},{"id":"d","text":"A list of brokers"}]',
    'c',
    'A playbook contains the specific edge setups you trade. It lists exact specifications, filters, rules, and variations you specialize in.',
    5
  )
) AS q(question, options, correct_option_id, explanation, sort_order)
WHERE m.course_id = (SELECT id FROM courses WHERE slug = 'prop-firm-survival-kit')
AND m.sort_order = 5;

-- Module 6 Questions
INSERT INTO course_quiz_questions (module_id, course_id, question, options, correct_option_id, explanation, sort_order)
SELECT 
  m.id,
  m.course_id,
  q.question,
  q.options::JSONB,
  q.correct_option_id,
  q.explanation,
  q.sort_order
FROM course_modules m
CROSS JOIN (VALUES
  (
    'What is the main focus of Commandments 1–4 (Capital and Survival)?',
    '[{"id":"a","text":"Defending the account at all costs and treating drawdown as the ultimate boundary"},{"id":"b","text":"Reaching your profit targets as fast as possible"},{"id":"c","text":"Scaling up to maximum leverage"},{"id":"d","text":"Finding new entry methods"}]',
    'a',
    'Survival is step zero. The first commandments dictate that you defend capital first and prioritize preserving the account above everything else.',
    1
  ),
  (
    'According to Commandments 5–8 (Process and Consistency), what should you focus on instead of daily financial targets?',
    '[{"id":"a","text":"The size of your next payout"},{"id":"b","text":"Your win percentage"},{"id":"c","text":"Flawless execution of your setup rules and maintaining consistency"},{"id":"d","text":"The opinions of other traders"}]',
    'c',
    'Targeting numbers leads to forced trades. Commandments 5-8 emphasize execution quality, process adherence, and emotional discipline.',
    2
  ),
  (
    'What is the core lesson of the "Long Game" (Commandments 9–10)?',
    '[{"id":"a","text":"To hold trades as long as possible"},{"id":"b","text":"Recognising that professional funding is a multi-year business, not a get-rich-quick scheme"},{"id":"c","text":"To trade only high timeframes"},{"id":"d","text":"To double your target targets monthly"}]',
    'b',
    'Professional trading is a career. Commandment 9 and 10 instruct you to build a long-term foundation rather than treating challenges like slot machines.',
    3
  ),
  (
    'What is the final item on your pre-challenge checklist before purchasing an evaluation?',
    '[{"id":"a","text":"Applying for a payout"},{"id":"b","text":"Setting up your payout bank account"},{"id":"c","text":"Buying a new setup indicator"},{"id":"d","text":"Verifying that you have backtested your strategy, documented your risk rules, and accepted the drawdown limits"}]',
    'd',
    'A pre-challenge checklist ensures you are fully prepared technically and emotionally before risking capital on a new evaluation.',
    4
  ),
  (
    'What should you do immediately after experiencing a max daily loss limit breach warning?',
    '[{"id":"a","text":"Close the trading platform, step away from the screen, and review your compliance logs"},{"id":"b","text":"Double your lot size to try and make it back"},{"id":"c","text":"Open a hedge position in the opposite direction"},{"id":"d","text":"Call the prop firm support to explain the error"}]',
    'a',
    'A daily limit warning is a hard stop. You must step away immediately to interrupt the psychological spiral before you breach the account.',
    5
  )
) AS q(question, options, correct_option_id, explanation, sort_order)
WHERE m.course_id = (SELECT id FROM courses WHERE slug = 'prop-firm-survival-kit')
AND m.sort_order = 6;

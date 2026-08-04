-- Create accelerator_cohorts table
CREATE TABLE IF NOT EXISTS public.accelerator_cohorts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    start_date TIMESTAMPTZ NOT NULL,
    seat_cap INTEGER DEFAULT 15,
    status TEXT NOT NULL CHECK (status IN ('upcoming', 'active', 'closed')),
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Create accelerator_enrolments table
CREATE TABLE IF NOT EXISTS public.accelerator_enrolments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    cohort_id UUID REFERENCES public.accelerator_cohorts(id) ON DELETE CASCADE NOT NULL,
    payment_status TEXT NOT NULL CHECK (payment_status IN ('unpaid', 'paid', 'refunded')) DEFAULT 'unpaid',
    enrolled_at TIMESTAMPTZ DEFAULT now(),
    current_week INTEGER NOT NULL CHECK (current_week BETWEEN 1 AND 6) DEFAULT 1,
    UNIQUE (user_id, cohort_id)
);

-- Create accelerator_weeks table
CREATE TABLE IF NOT EXISTS public.accelerator_weeks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    week_number INTEGER UNIQUE NOT NULL CHECK (week_number BETWEEN 1 AND 6),
    title TEXT NOT NULL,
    quote TEXT,
    core_modules JSONB NOT NULL DEFAULT '[]'::jsonb, -- e.g., ["Systematic Probability", "Pine Script 101"]
    milestone_description TEXT NOT NULL,
    personal_input_description TEXT NOT NULL,
    tooling_name TEXT NOT NULL
);

-- Create accelerator_milestones table
CREATE TABLE IF NOT EXISTS public.accelerator_milestones (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    enrolment_id UUID REFERENCES public.accelerator_enrolments(id) ON DELETE CASCADE NOT NULL,
    week_number INTEGER NOT NULL CHECK (week_number BETWEEN 1 AND 6),
    status TEXT NOT NULL CHECK (status IN ('locked', 'submitted', 'cleared', 'needs_resubmission')) DEFAULT 'locked',
    submission_content JSONB, -- stores text submissions, uploaded file URLs, or checklist answers
    submitted_at TIMESTAMPTZ,
    reviewed_at TIMESTAMPTZ,
    reviewed_by UUID REFERENCES auth.users(id),
    review_notes TEXT,
    UNIQUE (enrolment_id, week_number)
);

-- Create accelerator_personal_sessions table
CREATE TABLE IF NOT EXISTS public.accelerator_personal_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    enrolment_id UUID REFERENCES public.accelerator_enrolments(id) ON DELETE CASCADE NOT NULL,
    week_number INTEGER NOT NULL CHECK (week_number BETWEEN 1 AND 6),
    session_type TEXT NOT NULL CHECK (session_type IN ('group_workshop', 'breakout', '1on1', 'office_hours')),
    scheduled_at TIMESTAMPTZ NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('scheduled', 'completed', 'missed')) DEFAULT 'scheduled',
    notes TEXT
);

-- Enable RLS on all tables
ALTER TABLE public.accelerator_cohorts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.accelerator_enrolments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.accelerator_weeks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.accelerator_milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.accelerator_personal_sessions ENABLE ROW LEVEL SECURITY;

-- Cohorts & Weeks: authenticated users can read, only admins can modify
DROP POLICY IF EXISTS "Everyone can read cohorts" ON public.accelerator_cohorts;
CREATE POLICY "Everyone can read cohorts" ON public.accelerator_cohorts FOR SELECT USING (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Admins can manage cohorts" ON public.accelerator_cohorts;
CREATE POLICY "Admins can manage cohorts" ON public.accelerator_cohorts FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
);

DROP POLICY IF EXISTS "Everyone can read weeks" ON public.accelerator_weeks;
CREATE POLICY "Everyone can read weeks" ON public.accelerator_weeks FOR SELECT USING (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Admins can manage weeks" ON public.accelerator_weeks;
CREATE POLICY "Admins can manage weeks" ON public.accelerator_weeks FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
);

-- Enrolments: Students can view their own, admins can fully manage
DROP POLICY IF EXISTS "Students can read own enrolments" ON public.accelerator_enrolments;
CREATE POLICY "Students can read own enrolments" ON public.accelerator_enrolments FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can manage enrolments" ON public.accelerator_enrolments;
CREATE POLICY "Admins can manage enrolments" ON public.accelerator_enrolments FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
);

-- Milestones: Students can select/insert/update own, admins can manage
DROP POLICY IF EXISTS "Students can read own milestones" ON public.accelerator_milestones;
CREATE POLICY "Students can read own milestones" ON public.accelerator_milestones FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.accelerator_enrolments WHERE id = enrolment_id AND user_id = auth.uid())
);

DROP POLICY IF EXISTS "Students can modify own milestones" ON public.accelerator_milestones;
CREATE POLICY "Students can modify own milestones" ON public.accelerator_milestones FOR ALL USING (
  EXISTS (SELECT 1 FROM public.accelerator_enrolments WHERE id = enrolment_id AND user_id = auth.uid())
);

DROP POLICY IF EXISTS "Admins can manage milestones" ON public.accelerator_milestones;
CREATE POLICY "Admins can manage milestones" ON public.accelerator_milestones FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
);

-- Sessions: Students can view own, admins can manage
DROP POLICY IF EXISTS "Students can read own sessions" ON public.accelerator_personal_sessions;
CREATE POLICY "Students can read own sessions" ON public.accelerator_personal_sessions FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.accelerator_enrolments WHERE id = enrolment_id AND user_id = auth.uid())
);

DROP POLICY IF EXISTS "Admins can manage sessions" ON public.accelerator_personal_sessions;
CREATE POLICY "Admins can manage sessions" ON public.accelerator_personal_sessions FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
);

-- Seed Accelerator Weeks
INSERT INTO public.accelerator_weeks (week_number, title, quote, core_modules, milestone_description, personal_input_description, tooling_name) VALUES
(1, 'Systematic Probability & Mathematical Foundations', 'In trading, the math doesn''t lie; the human mind does.', '["Systematic Foundations", "Probability Distributions in Markets", "Expected Value Modeling"]'::jsonb, 'Submit an expected value calculation spreadsheet mapping historical trade samples and establishing a formal risk-to-reward matrix.', 'Detail your trading background, account size/capital, and primary systematic trading goals.', 'Excel/Python Modeling Notebook'),
(2, 'Quantitative Edge & Custom Indicator Engineering', 'An edge is not a secret setup; it is a statistical anomaly repeated over time.', '["Pine Script 101", "Coding Custom Technical Filters", "Statistical Significance Testing"]'::jsonb, 'Submit your customized Pine Script indicator code mapping your market-entry edge rules.', 'Outline the specific mathematical variables of your engineered systematic edge.', 'TradingView Pine Editor'),
(3, 'Systematic Backtesting & Walk-Forward Optimization', 'Backtesting is the laboratory where trading illusions go to die.', '["Backtesting Mechanics", "Avoiding Overfitting & Curve Fitting", "Walk-Forward Matrix Design"]'::jsonb, 'Upload a backtesting performance report spanning 100+ simulated trades with Drawdown metrics.', 'Explain your process for adjusting variables without introducing curve-fitting bias.', 'Walk-Forward Optimization Matrix'),
(4, 'Hedge-Fund Portfolio Risk Management & Position Sizing', 'Risk is not a single number; it is a dynamic spectrum of survival.', '["Kelly Criterion & Optimal f", "Ruins Theory & Monte Carlo Simulations", "Multi-Asset Correlations"]'::jsonb, 'Submit a Monte Carlo simulator log proving your strategy survival probability across 10,000 runs.', 'Reflect on how your emotions handle drawdown stretches and describe your sizing boundaries.', 'Monte Carlo Risk Simulator'),
(5, 'Algorithmic Automation & Real-Time Trade Journaling', 'The ultimate journal is written in real-time execution logs.', '["Webhook Automation", "Trade Journal Logging", "API Execution Bridges"]'::jsonb, 'Submit screenshots or active logs showing webhook communication running into a trade journal.', 'Discuss any execution slippage or latency challenges experienced during setup.', 'Webhook Journal Bridge'),
(6, 'Institutional Compliance, Taxes & Fund Scaling Structures', 'Amateurs trade accounts; professionals trade corporate balance sheets.', '["Limited Company Structures for Traders", "Tax Optimization & Write-offs", "Prop-Firm & Client Capital Scaling"]'::jsonb, 'Submit a formal structured business plan for your prop-firm scaling or corporate entity.', 'Describe your path toward fully transitioning from retail trader to corporate quant director.', 'Corporate Scaling Blueprint')
ON CONFLICT (week_number) DO UPDATE SET
    title = EXCLUDED.title,
    quote = EXCLUDED.quote,
    core_modules = EXCLUDED.core_modules,
    milestone_description = EXCLUDED.milestone_description,
    personal_input_description = EXCLUDED.personal_input_description,
    tooling_name = EXCLUDED.tooling_name;

-- Seed a default upcoming/active cohort so that testing and first signups are valid instantly
INSERT INTO public.accelerator_cohorts (id, name, start_date, seat_cap, status)
VALUES ('77777777-7777-7777-7777-777777777777', 'Inaugural Institutional Quant Cohort', now() + interval '7 days', 15, 'active')
ON CONFLICT (id) DO NOTHING;

-- Storage Bucket Configuration
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('accelerator-submissions', 'accelerator-submissions', false, 52428800, '{text/plain,application/pdf,application/zip,application/x-zip-compressed,image/png,image/jpeg,image/webp,text/javascript,application/javascript,text/x-python,application/octet-stream}')
ON CONFLICT (id) DO NOTHING;

-- Storage Security Policies
DROP POLICY IF EXISTS "Allow students to upload their own submissions" ON storage.objects;
CREATE POLICY "Allow students to upload their own submissions"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'accelerator-submissions' AND (storage.foldername(name))[1] = auth.uid()::text);

DROP POLICY IF EXISTS "Allow students to view their own submissions" ON storage.objects;
CREATE POLICY "Allow students to view their own submissions"
  ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'accelerator-submissions' AND (storage.foldername(name))[1] = auth.uid()::text);

DROP POLICY IF EXISTS "Allow admins to view all submissions" ON storage.objects;
CREATE POLICY "Allow admins to view all submissions"
  ON storage.objects FOR SELECT TO authenticated
  USING (
    bucket_id = 'accelerator-submissions' AND
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

DROP POLICY IF EXISTS "Allow admins to manage all submissions" ON storage.objects;
CREATE POLICY "Allow admins to manage all submissions"
  ON storage.objects FOR ALL TO authenticated
  USING (
    bucket_id = 'accelerator-submissions' AND
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  )
  WITH CHECK (
    bucket_id = 'accelerator-submissions' AND
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

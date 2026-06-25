-- Create curriculum_modules table
CREATE TABLE IF NOT EXISTS public.curriculum_modules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  phase_slug text NOT NULL,
  phase_number integer NOT NULL,
  module_number integer NOT NULL,
  title text NOT NULL,
  subtitle text,
  estimated_minutes integer NOT NULL DEFAULT 15,
  video_url text,
  content_html text,
  key_takeaways jsonb DEFAULT '[]'::jsonb,
  resources jsonb DEFAULT '[]'::jsonb,
  quiz jsonb DEFAULT '[]'::jsonb,
  is_published boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now(),
  UNIQUE(phase_slug, module_number)
);

-- Enable RLS (Service role bypasses RLS)
ALTER TABLE public.curriculum_modules ENABLE ROW LEVEL SECURITY;

-- Allow public read access to published modules
CREATE POLICY "Public read published modules" 
ON public.curriculum_modules FOR SELECT 
USING (is_published = true);

-- Create certificates table
CREATE TABLE IF NOT EXISTS public.certificates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
  phase_slug text NOT NULL,
  phase_name text NOT NULL,
  issued_at timestamp with time zone DEFAULT now(),
  certificate_number text UNIQUE NOT NULL,
  UNIQUE(user_id, phase_slug)
);

ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;

-- Allow users to view their own certificates
CREATE POLICY "Users can view their own certificates" 
ON public.certificates FOR SELECT 
USING (auth.uid() = user_id);

-- Add new columns to course_progress
ALTER TABLE public.course_progress
ADD COLUMN IF NOT EXISTS quiz_score integer,
ADD COLUMN IF NOT EXISTS quiz_passed boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS completed_at timestamp with time zone,
ADD COLUMN IF NOT EXISTS time_spent_seconds integer DEFAULT 0;

-- Refresh schema cache if using PostgREST
NOTIFY pgrst, 'reload schema';

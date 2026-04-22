ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS has_onboarded BOOLEAN DEFAULT false;

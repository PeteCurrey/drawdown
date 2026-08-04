-- Add discipline badge options to profiles table
ALTER TABLE public.profiles 
  ADD COLUMN IF NOT EXISTS show_badges_publicly BOOLEAN DEFAULT false NOT NULL,
  ADD COLUMN IF NOT EXISTS sync_badges_to_discord BOOLEAN DEFAULT false NOT NULL;

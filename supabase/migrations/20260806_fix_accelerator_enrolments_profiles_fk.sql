-- Migration to establish FK relationship from accelerator_enrolments.user_id to public.profiles.id
-- This allows Supabase PostgREST schema cache to resolve profile:profiles(*) joins in queries.

ALTER TABLE public.accelerator_enrolments
  DROP CONSTRAINT IF EXISTS accelerator_enrolments_user_id_profiles_fkey;

ALTER TABLE public.accelerator_enrolments
  ADD CONSTRAINT accelerator_enrolments_user_id_profiles_fkey
  FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

-- Also add relationship for reviewed_by on accelerator_milestones to public.profiles.id
ALTER TABLE public.accelerator_milestones
  DROP CONSTRAINT IF EXISTS accelerator_milestones_reviewed_by_profiles_fkey;

ALTER TABLE public.accelerator_milestones
  ADD CONSTRAINT accelerator_milestones_reviewed_by_profiles_fkey
  FOREIGN KEY (reviewed_by) REFERENCES public.profiles(id) ON DELETE SET NULL;

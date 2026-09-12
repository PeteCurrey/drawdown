-- ==============================================================================
-- Migration: 20260912_entitlement_security_hardening.sql
-- Description: Hardens sensitive profile columns against client self-elevation,
--              restricts SECURITY DEFINER RPC functions to service_role,
--              sets explicit search_path on public functions,
--              and creates stripe_events table for webhook idempotency.
-- ==============================================================================

-- 1. Protect Sensitive Columns on Profiles via Trigger
-- Prevents authenticated clients from elevating subscription_tier, role, or stripe attributes.
CREATE OR REPLACE FUNCTION public.protect_sensitive_profile_fields()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Allow service_role, supabase_admin, or postgres superuser to update any fields
  IF current_user IN ('service_role', 'postgres', 'supabase_admin')
     OR NULLIF(current_setting('request.jwt.claim.role', true), '') = 'service_role' THEN
    RETURN NEW;
  END IF;

  -- Disallow changes to sensitive entitlement and authorization fields by normal users
  IF NEW.subscription_tier IS DISTINCT FROM OLD.subscription_tier THEN
    RAISE EXCEPTION 'Unauthorized: client cannot modify subscription_tier';
  END IF;
  IF NEW.subscription_status IS DISTINCT FROM OLD.subscription_status THEN
    RAISE EXCEPTION 'Unauthorized: client cannot modify subscription_status';
  END IF;
  IF NEW.role IS DISTINCT FROM OLD.role THEN
    RAISE EXCEPTION 'Unauthorized: client cannot modify role';
  END IF;
  IF NEW.stripe_customer_id IS DISTINCT FROM OLD.stripe_customer_id THEN
    RAISE EXCEPTION 'Unauthorized: client cannot modify stripe_customer_id';
  END IF;
  IF NEW.stripe_subscription_id IS DISTINCT FROM OLD.stripe_subscription_id THEN
    RAISE EXCEPTION 'Unauthorized: client cannot modify stripe_subscription_id';
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_protect_sensitive_profile_fields ON public.profiles;
CREATE TRIGGER trg_protect_sensitive_profile_fields
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.protect_sensitive_profile_fields();

-- 2. Harden grant_floor_courses RPC
-- Revoke execution from authenticated / anon / public. Grant strictly to service_role.
CREATE OR REPLACE FUNCTION public.grant_floor_courses(p_user_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_course_id UUID;
BEGIN
  -- Verify caller is service_role or admin
  IF current_user NOT IN ('service_role', 'postgres', 'supabase_admin')
     AND NULLIF(current_setting('request.jwt.claim.role', true), '') != 'service_role' THEN
    RAISE EXCEPTION 'Access denied: grant_floor_courses requires service_role';
  END IF;

  FOR v_course_id IN
    SELECT id FROM public.courses
    WHERE is_free_for_floor = true
      AND is_published      = true
  LOOP
    INSERT INTO public.course_purchases (
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
$$;

REVOKE ALL ON FUNCTION public.grant_floor_courses(UUID) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.grant_floor_courses(UUID) TO service_role;

-- 3. Harden get_user_id_by_email RPC
-- Prevent email enumeration and ID harvesting by untrusted clients.
CREATE OR REPLACE FUNCTION public.get_user_id_by_email(p_email TEXT)
RETURNS UUID
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT id FROM auth.users WHERE email = p_email LIMIT 1;
$$;

REVOKE ALL ON FUNCTION public.get_user_id_by_email(TEXT) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_user_id_by_email(TEXT) TO service_role;

-- 4. Harden is_partner and increment_page_view with explicit search_path
CREATE OR REPLACE FUNCTION public.is_partner()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN (
    SELECT role = 'partner'
    FROM public.profiles
    WHERE id = auth.uid()
  );
END;
$$;

CREATE OR REPLACE FUNCTION public.increment_page_view(page_path TEXT)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.seo_analytics (path, views, last_viewed_at, updated_at)
  VALUES (page_path, 1, NOW(), NOW())
  ON CONFLICT (path)
  DO UPDATE SET 
    views = public.seo_analytics.views + 1,
    last_viewed_at = EXCLUDED.last_viewed_at,
    updated_at = NOW();
END;
$$;

-- 5. Stripe Webhook Idempotency Table
CREATE TABLE IF NOT EXISTS public.stripe_events (
  event_id TEXT PRIMARY KEY,
  event_type TEXT NOT NULL,
  processed_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.stripe_events ENABLE ROW LEVEL SECURITY;
-- Default deny for all client roles; service_role bypasses RLS

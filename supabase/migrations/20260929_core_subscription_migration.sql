-- ══════════════════════════════════════════════════════════════════════════════
-- Avorria Trading — Core Subscription Migration
-- 20260929_core_subscription_migration.sql
--
-- Purpose:
--   1. Allow 'core' as a valid subscription_tier value on the profiles table
--   2. Add stripe_customer_id and stripe_subscription_id columns to profiles
--      (webhook references these columns but they did not exist — latent bug fix)
--   3. Ensure relevant indexes exist for webhook lookups by stripe_customer_id
--
-- Safety guarantees:
--   - All operations use IF NOT EXISTS / DO $$ patterns — safe to re-run
--   - No existing data is modified
--   - No existing columns are dropped or renamed
--   - No existing Stripe price IDs or subscriptions are touched
--   - Zero external paying public subscribers confirmed at migration time (2026-09-29)
-- ══════════════════════════════════════════════════════════════════════════════

-- ── Step 1: Add 'core' to the subscription_tier check constraint ───────────────
-- The profiles table may have a check constraint limiting allowed tier values.
-- We drop and recreate it to include 'core'.
-- If no constraint exists, this is a no-op.

DO $$
DECLARE
  constraint_name text;
BEGIN
  -- Find any check constraint on profiles.subscription_tier
  SELECT conname INTO constraint_name
  FROM pg_constraint
  WHERE conrelid = 'public.profiles'::regclass
    AND contype = 'c'
    AND pg_get_constraintdef(oid) ILIKE '%subscription_tier%'
  LIMIT 1;

  IF constraint_name IS NOT NULL THEN
    EXECUTE format('ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS %I', constraint_name);
  END IF;
END $$;

-- Add the updated check constraint with 'core' included
-- Existing valid tiers: free, signal-centre, foundation, edge, floor, accelerator, investment-centre
-- New valid tier: core
ALTER TABLE public.profiles
  DROP CONSTRAINT IF EXISTS profiles_subscription_tier_check;

ALTER TABLE public.profiles
  ADD CONSTRAINT profiles_subscription_tier_check
  CHECK (subscription_tier IN (
    'free',
    'core',
    'signal-centre',
    'foundation',
    'edge',
    'floor',
    'accelerator',
    'investment-centre'
  ));

-- ── Step 2: Add stripe_customer_id column ─────────────────────────────────────
-- The webhook at /api/stripe/webhook/route.ts upserts stripe_customer_id but
-- this column did not exist on the profiles table.
-- Adding it now resolves the latent bug.

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS stripe_customer_id text;

-- ── Step 3: Add stripe_subscription_id column ────────────────────────────────
-- Useful for subscription lifecycle management (pause, cancel, upgrade lookups).

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS stripe_subscription_id text;

-- ── Step 4: Indexes for webhook performance ───────────────────────────────────
-- Webhook handlers look up profiles by stripe_customer_id — ensure this is indexed.

CREATE INDEX IF NOT EXISTS idx_profiles_stripe_customer_id
  ON public.profiles (stripe_customer_id)
  WHERE stripe_customer_id IS NOT NULL;

-- ── Step 5: RLS — new columns follow existing profile RLS ─────────────────────
-- stripe_customer_id and stripe_subscription_id are added to a table that
-- already has RLS enabled. No new policies are needed — the existing
-- "Users can only read/update their own profile" policy covers these columns.
-- Service-role key (used by webhook) bypasses RLS, so webhook upserts work.

-- ── Verification query (run manually to confirm) ──────────────────────────────
-- SELECT column_name, data_type
-- FROM information_schema.columns
-- WHERE table_schema = 'public'
--   AND table_name = 'profiles'
--   AND column_name IN ('stripe_customer_id', 'stripe_subscription_id', 'subscription_tier')
-- ORDER BY column_name;

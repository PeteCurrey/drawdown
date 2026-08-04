-- Migration: Add Challenge Status and Tracking Columns to Profiles
-- Date: 2026-08-04

-- Add challenge_status column if it doesn't exist
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS challenge_status TEXT DEFAULT 'not_started';

-- Add check constraint to ensure only valid statuses are allowed
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_challenge_status_check;
ALTER TABLE profiles ADD CONSTRAINT profiles_challenge_status_check 
  CHECK (challenge_status IN ('not_started', 'in_progress', 'passed', 'failed', 'funded'));

-- Add challenge_prop_firm_id to track which firm they are challenging
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS challenge_prop_firm_id TEXT;

-- Add challenge_tier to track challenge sizing
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS challenge_tier TEXT;

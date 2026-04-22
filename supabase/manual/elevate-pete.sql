-- ============================================================
-- DRAWDOWN SUPERUSER ELEVATION SCRIPT
-- Run this in the Supabase SQL Editor for project:
-- https://miiasjbonwlleggiukyf.supabase.co
-- ============================================================

-- Step 1: Verify the user exists (check output before running Step 2)
SELECT 
  id, 
  email, 
  subscription_tier, 
  role,
  created_at
FROM profiles
WHERE id = (
  SELECT id FROM auth.users WHERE email = 'petecurrey@gmail.com'
);

-- Step 2: Elevate to Floor tier + Admin role
-- Run this AFTER confirming the user in Step 1
UPDATE profiles
SET 
  subscription_tier = 'floor',
  role              = 'admin',
  subscription_status = 'active',
  updated_at        = now()
WHERE id = (
  SELECT id FROM auth.users WHERE email = 'petecurrey@gmail.com'
);

-- Step 3: Verify the change was applied
SELECT 
  p.id, 
  u.email, 
  p.subscription_tier, 
  p.role,
  p.subscription_status,
  p.updated_at
FROM profiles p
JOIN auth.users u ON u.id = p.id
WHERE u.email = 'petecurrey@gmail.com';

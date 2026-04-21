-- Phase 7: Partner RBAC & Analytics Schema

-- 1. Create Profile Role Type
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
        CREATE TYPE user_role AS ENUM ('student', 'partner', 'admin');
    END IF;
END $$;

-- 2. Update Profiles Table
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS role user_role DEFAULT 'student';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS partner_id UUID REFERENCES broker_affiliates(id) ON DELETE SET NULL;

-- 3. Update RLS for broker_clicks
-- Only allow partners to see clicks linked to their own broker profile
DROP POLICY IF EXISTS "Admin Read Clicks" ON broker_clicks;
CREATE POLICY "Admin & Partner Read Clicks" ON broker_clicks
    FOR SELECT USING (
        (auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin')) OR
        (auth.uid() IN (SELECT id FROM profiles WHERE role = 'partner' AND partner_id = broker_clicks.broker_id))
    );

-- 4. Update RLS for broker_affiliates
-- Allow partners to read their own affiliate data (even if not active)
CREATE POLICY "Partners Read Own Profile" ON broker_affiliates
    FOR SELECT USING (
        auth.uid() IN (SELECT id FROM profiles WHERE partner_id = broker_affiliates.id)
    );

-- 5. Helper function to check if user is partner (optional but useful for RLS)
CREATE OR REPLACE FUNCTION is_partner()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN (
    SELECT role = 'partner'
    FROM profiles
    WHERE id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

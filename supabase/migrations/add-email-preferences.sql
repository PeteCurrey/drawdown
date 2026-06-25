-- Add email_preferences column to profiles table with default JSONB
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS email_preferences JSONB DEFAULT '{"morning_brief": true, "evening_wrap": true, "breaking_news": true, "marketing": false}'::jsonb;

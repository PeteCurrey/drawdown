-- Add subscribed_breaking column to email_subscribers table
-- This enables per-subscriber preference for breaking news alerts

ALTER TABLE email_subscribers 
ADD COLUMN IF NOT EXISTS subscribed_breaking BOOLEAN NOT NULL DEFAULT true;

-- Update any existing rows to have breaking news enabled by default
UPDATE email_subscribers 
SET subscribed_breaking = true 
WHERE subscribed_breaking IS NULL;

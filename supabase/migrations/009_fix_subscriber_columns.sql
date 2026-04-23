-- Ensure first_name column exists
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='newsletter_subscribers' AND column_name='first_name') THEN
        ALTER TABLE newsletter_subscribers ADD COLUMN first_name TEXT;
    END IF;
END $$;

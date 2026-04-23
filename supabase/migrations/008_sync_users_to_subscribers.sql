-- Sync existing users to newsletter subscribers
INSERT INTO newsletter_subscribers (email, first_name, status, source)
SELECT 
    email, 
    COALESCE(raw_user_meta_data->>'first_name', 'Trader'), 
    'active', 
    'user_sync'
FROM auth.users
ON CONFLICT (email) DO NOTHING;

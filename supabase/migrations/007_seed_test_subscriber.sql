-- Add admin as first subscriber for testing
INSERT INTO newsletter_subscribers (email, first_name, status, source)
VALUES ('peter@drawdown.trading', 'Pete', 'active', 'admin_init')
ON CONFLICT (email) DO UPDATE SET status = 'active';

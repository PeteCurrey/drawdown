-- Ensure newsletter_settings table exists and is properly configured
CREATE TABLE IF NOT EXISTS public.newsletter_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  daily_enabled BOOLEAN DEFAULT true,
  weekend_enabled BOOLEAN DEFAULT true,
  daily_send_time TIME DEFAULT '07:00:00',
  weekend_send_time TIME DEFAULT '08:00:00',
  auto_send_enabled BOOLEAN DEFAULT false,
  require_approval BOOLEAN DEFAULT true,
  from_name TEXT DEFAULT 'Pete @ Drawdown',
  from_email TEXT DEFAULT 'thewire@drawdown.trading',
  reply_to TEXT DEFAULT 'hello@drawdown.trading',
  subject_prefix TEXT DEFAULT 'The Wire:',
  footer_unsubscribe_text TEXT DEFAULT 'You''re receiving this because you subscribed to The Wire. Unsubscribe anytime.',
  design_tokens JSONB DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Insert default settings row if missing
INSERT INTO public.newsletter_settings (id) 
SELECT gen_random_uuid() 
WHERE NOT EXISTS (SELECT 1 FROM public.newsletter_settings);

-- Enable RLS
ALTER TABLE public.newsletter_settings ENABLE ROW LEVEL SECURITY;

-- Admin-only policy (Drop first to avoid duplicates if migration is re-run)
DROP POLICY IF EXISTS "Admin manage settings" ON public.newsletter_settings;
CREATE POLICY "Admin manage settings" ON public.newsletter_settings FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

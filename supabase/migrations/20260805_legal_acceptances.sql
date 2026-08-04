-- Create legal_acceptances audit table for versioned legal consent records
CREATE TABLE IF NOT EXISTS public.legal_acceptances (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    document_type TEXT NOT NULL DEFAULT 'terms_and_conditions',
    document_version TEXT NOT NULL DEFAULT 'LEG-2026-V1',
    accepted_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    checkout_session_id TEXT,
    terms_accepted BOOLEAN NOT NULL DEFAULT true,
    privacy_acknowledged BOOLEAN NOT NULL DEFAULT true,
    immediate_supply_requested BOOLEAN NOT NULL DEFAULT false,
    digital_content_acknowledgement BOOLEAN NOT NULL DEFAULT false,
    marketing_consent BOOLEAN NOT NULL DEFAULT false,
    consent_source TEXT NOT NULL DEFAULT 'checkout',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexing
CREATE INDEX IF NOT EXISTS idx_legal_acceptances_user_id ON public.legal_acceptances(user_id);
CREATE INDEX IF NOT EXISTS idx_legal_acceptances_checkout_session ON public.legal_acceptances(checkout_session_id);

-- Enable RLS
ALTER TABLE public.legal_acceptances ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own legal acceptances"
    ON public.legal_acceptances
    FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Authenticated users can record legal acceptances"
    ON public.legal_acceptances
    FOR INSERT
    WITH CHECK (auth.uid() = user_id OR auth.uid() IS NULL);

-- Grant privileges
GRANT ALL ON public.legal_acceptances TO service_role;
GRANT SELECT, INSERT ON public.legal_acceptances TO authenticated, anon;

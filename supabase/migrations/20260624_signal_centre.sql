CREATE TABLE IF NOT EXISTS public.signals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    instrument TEXT NOT NULL,
    timeframe TEXT NOT NULL,
    bias TEXT NOT NULL, -- 'BULLISH', 'BEARISH'
    confluence_score INTEGER NOT NULL,
    entry_price NUMERIC NOT NULL,
    stop_loss NUMERIC NOT NULL,
    take_profit_1 NUMERIC NOT NULL,
    take_profit_2 NUMERIC NOT NULL,
    take_profit_3 NUMERIC NOT NULL,
    rr_ratio NUMERIC NOT NULL,
    atr NUMERIC NOT NULL,
    catalyst_event JSONB,
    confluence_factors JSONB NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT now(),
    expires_at TIMESTAMPTZ NOT NULL
);

CREATE TABLE IF NOT EXISTS public.signals_saved (
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    signal_id UUID NOT NULL REFERENCES public.signals(id) ON DELETE CASCADE,
    instrument TEXT NOT NULL,
    saved_at TIMESTAMPTZ DEFAULT now(),
    notes TEXT,
    PRIMARY KEY (user_id, signal_id)
);

-- Indices
CREATE INDEX IF NOT EXISTS signals_instrument_idx ON public.signals(instrument);
CREATE INDEX IF NOT EXISTS signals_expires_at_idx ON public.signals(expires_at);
CREATE INDEX IF NOT EXISTS signals_is_active_idx ON public.signals(is_active);

-- Enable RLS
ALTER TABLE public.signals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.signals_saved ENABLE ROW LEVEL SECURITY;

-- Policies for public.signals
DROP POLICY IF EXISTS "Public select signals" ON public.signals;
CREATE POLICY "Public select signals" ON public.signals FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins can manage signals" ON public.signals;
CREATE POLICY "Admins can manage signals" ON public.signals FOR ALL USING (
    (auth.jwt() ->> 'role' = 'service_role') OR 
    (auth.uid() IS NOT NULL AND EXISTS (
        SELECT 1 FROM public.profiles
        WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    ))
);

-- Policies for public.signals_saved
DROP POLICY IF EXISTS "Users can read own saved signals" ON public.signals_saved;
CREATE POLICY "Users can read own saved signals" ON public.signals_saved FOR SELECT USING (
    auth.uid() = user_id
);

DROP POLICY IF EXISTS "Users can manage own saved signals" ON public.signals_saved;
CREATE POLICY "Users can manage own saved signals" ON public.signals_saved FOR ALL USING (
    auth.uid() = user_id
);

-- Migration: User Watchlist, Price Alerts, and Push Notification Tokens
-- Date: 2026-04-23

-- 1. Push Tokens Table
CREATE TABLE IF NOT EXISTS public.push_tokens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    token TEXT NOT NULL UNIQUE,
    platform TEXT, -- 'ios' | 'android'
    device_name TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. User Watchlist
CREATE TABLE IF NOT EXISTS public.user_watchlists (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    symbol TEXT NOT NULL,
    alerts_enabled BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(user_id, symbol)
);

-- 3. Price Alerts
CREATE TABLE IF NOT EXISTS public.price_alerts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    symbol TEXT NOT NULL,
    trigger_price DECIMAL NOT NULL,
    trigger_condition TEXT NOT NULL, -- 'above' | 'below'
    is_active BOOLEAN DEFAULT true,
    triggered_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.push_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_watchlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.price_alerts ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can manage their own push tokens" ON public.push_tokens FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their own watchlist" ON public.user_watchlists FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their own price alerts" ON public.price_alerts FOR ALL USING (auth.uid() = user_id);

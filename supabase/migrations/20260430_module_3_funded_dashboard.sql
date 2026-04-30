-- Create Custom Enums
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'daily_loss_type') THEN
        CREATE TYPE daily_loss_type AS ENUM ('balance_based', 'equity_based');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'max_drawdown_type') THEN
        CREATE TYPE max_drawdown_type AS ENUM ('static', 'trailing_eod', 'trailing_intraday', 'relative');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'account_phase') THEN
        CREATE TYPE account_phase AS ENUM ('challenge_phase1', 'challenge_phase2', 'funded', 'verification');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'account_status') THEN
        CREATE TYPE account_status AS ENUM ('active', 'breached', 'passed', 'withdrawn');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'trade_direction') THEN
        CREATE TYPE trade_direction AS ENUM ('long', 'short');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'trade_session') THEN
        CREATE TYPE trade_session AS ENUM ('london', 'new_york', 'asia', 'overlap', 'other');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'alert_type') THEN
        CREATE TYPE alert_type AS ENUM ('daily_loss_amber', 'daily_loss_red', 'drawdown_amber', 'drawdown_red', 'breach', 'target_reached');
    END IF;
END $$;

-- 1. Prop Firms Table
CREATE TABLE IF NOT EXISTS prop_firms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    logo_url TEXT,
    daily_loss_type daily_loss_type NOT NULL,
    max_drawdown_type max_drawdown_type NOT NULL,
    default_daily_loss_pct DECIMAL NOT NULL,
    default_max_drawdown_pct DECIMAL NOT NULL,
    default_profit_target_pct DECIMAL,
    default_min_trading_days INT,
    payout_frequency TEXT,
    profit_split TEXT,
    website_url TEXT,
    affiliate_url TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Funded Accounts Table
CREATE TABLE IF NOT EXISTS funded_accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    account_name TEXT NOT NULL,
    prop_firm_id UUID REFERENCES prop_firms(id) ON DELETE SET NULL,
    account_size DECIMAL NOT NULL,
    current_balance DECIMAL NOT NULL,
    daily_loss_limit DECIMAL NOT NULL,
    daily_loss_type daily_loss_type NOT NULL,
    max_drawdown_limit DECIMAL NOT NULL,
    max_drawdown_type max_drawdown_type NOT NULL,
    profit_target DECIMAL,
    min_trading_days INT,
    days_traded INT DEFAULT 0,
    account_phase account_phase NOT NULL,
    account_status account_status DEFAULT 'active',
    currency TEXT NOT NULL, -- e.g. USD, GBP, EUR, AUD
    platform TEXT NOT NULL, -- e.g. mt4, mt5, ctrader, tradovate, other
    last_sync_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Funded Account Snapshots Table
CREATE TABLE IF NOT EXISTS funded_account_snapshots (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    account_id UUID REFERENCES funded_accounts(id) ON DELETE CASCADE NOT NULL,
    balance DECIMAL NOT NULL,
    equity DECIMAL,
    daily_pnl DECIMAL NOT NULL,
    daily_loss_used_pct DECIMAL NOT NULL,
    max_drawdown_used_pct DECIMAL NOT NULL,
    drawdown_remaining DECIMAL NOT NULL,
    snapshot_date DATE DEFAULT CURRENT_DATE,
    snapshot_time TIMESTAMPTZ DEFAULT now(),
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Individual Trades Table
CREATE TABLE IF NOT EXISTS individual_trades (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    account_id UUID REFERENCES funded_accounts(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    ticket_number TEXT,
    instrument TEXT NOT NULL,
    direction trade_direction NOT NULL,
    lot_size DECIMAL NOT NULL,
    entry_price DECIMAL NOT NULL,
    exit_price DECIMAL NOT NULL,
    entry_time TIMESTAMPTZ NOT NULL,
    exit_time TIMESTAMPTZ NOT NULL,
    pnl DECIMAL NOT NULL,
    commission DECIMAL,
    swap DECIMAL,
    net_pnl DECIMAL NOT NULL,
    duration_minutes INT,
    session trade_session,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 5. Account Alerts Table
CREATE TABLE IF NOT EXISTS account_alerts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    account_id UUID REFERENCES funded_accounts(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    alert_type alert_type NOT NULL,
    message TEXT NOT NULL,
    triggered_at TIMESTAMPTZ DEFAULT now(),
    acknowledged BOOLEAN DEFAULT false
);

-- ROW LEVEL SECURITY (RLS)
ALTER TABLE prop_firms ENABLE ROW LEVEL SECURITY;
ALTER TABLE funded_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE funded_account_snapshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE individual_trades ENABLE ROW LEVEL SECURITY;
ALTER TABLE account_alerts ENABLE ROW LEVEL SECURITY;

-- Policies for prop_firms (Public read, no write)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public Read Prop Firms') THEN
        CREATE POLICY "Public Read Prop Firms" ON prop_firms FOR SELECT USING (true);
    END IF;
END $$;

-- Policies for funded_accounts
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can manage their own funded accounts') THEN
        CREATE POLICY "Users can manage their own funded accounts" ON funded_accounts
            FOR ALL USING (auth.uid() = user_id);
    END IF;
END $$;

-- Policies for snapshots
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can see snapshots of their accounts') THEN
        CREATE POLICY "Users can see snapshots of their accounts" ON funded_account_snapshots
            FOR SELECT USING (
                EXISTS (
                    SELECT 1 FROM funded_accounts 
                    WHERE funded_accounts.id = funded_account_snapshots.account_id 
                    AND funded_accounts.user_id = auth.uid()
                )
            );
    END IF;
END $$;

-- Policies for individual_trades
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can manage their own trades') THEN
        CREATE POLICY "Users can manage their own trades" ON individual_trades
            FOR ALL USING (auth.uid() = user_id);
    END IF;
END $$;

-- Policies for account_alerts
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can manage their own alerts') THEN
        CREATE POLICY "Users can manage their own alerts" ON account_alerts
            FOR ALL USING (auth.uid() = user_id);
    END IF;
END $$;

-- SEED DATA: Prop Firms
INSERT INTO prop_firms (name, slug, daily_loss_type, max_drawdown_type, default_daily_loss_pct, default_max_drawdown_pct, default_profit_target_pct, default_min_trading_days, payout_frequency, profit_split, website_url, is_active)
VALUES 
('FTMO', 'ftmo', 'balance_based', 'trailing_eod', 5, 10, 10, 4, 'Bi-weekly', '80/20', 'https://ftmo.com', true),
('The5ers', 'the5ers', 'equity_based', 'relative', 5, 10, 8, 3, 'Bi-weekly', '80/20', 'https://the5ers.com', true),
('FundedNext', 'fundednext', 'balance_based', 'static', 5, 10, 10, 5, 'Bi-weekly', '80/20', 'https://fundednext.com', true),
('City Traders Imperium', 'cti', 'equity_based', 'trailing_eod', 5, 10, 10, 3, 'Bi-weekly', '70/30', 'https://citytradersimperium.com', true),
('Topstep', 'topstep', 'balance_based', 'trailing_intraday', 4, 8, 10, 0, 'Weekly', '90/10', 'https://topstep.com', true),
('Apex Trader Funding', 'apex', 'balance_based', 'trailing_intraday', 0, 10, 10, 7, 'Monthly', '90/10', 'https://apextraderfunding.com', true)
ON CONFLICT (slug) DO UPDATE SET
    daily_loss_type = EXCLUDED.daily_loss_type,
    max_drawdown_type = EXCLUDED.max_drawdown_type,
    default_daily_loss_pct = EXCLUDED.default_daily_loss_pct,
    default_max_drawdown_pct = EXCLUDED.default_max_drawdown_pct,
    default_profit_target_pct = EXCLUDED.default_profit_target_pct,
    default_min_trading_days = EXCLUDED.default_min_trading_days,
    payout_frequency = EXCLUDED.payout_frequency,
    profit_split = EXCLUDED.profit_split,
    website_url = EXCLUDED.website_url;

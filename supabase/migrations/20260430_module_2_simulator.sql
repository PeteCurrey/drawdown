-- Simulation Results Table
CREATE TYPE simulation_result_type AS ENUM ('pass', 'fail_daily_loss', 'fail_max_drawdown', 'fail_target', 'fail_min_days');

CREATE TABLE IF NOT EXISTS simulation_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    prop_firm_id UUID REFERENCES prop_firms(id) ON DELETE SET NULL,
    account_size DECIMAL NOT NULL,
    result simulation_result_type NOT NULL,
    risk_score INT NOT NULL,
    final_balance DECIMAL NOT NULL,
    peak_balance DECIMAL NOT NULL,
    max_drawdown_reached DECIMAL NOT NULL,
    worst_daily_loss DECIMAL NOT NULL,
    trading_days INT NOT NULL,
    profit_reached DECIMAL NOT NULL,
    equity_curve JSONB NOT NULL, -- [{date, balance}]
    daily_pnl JSONB NOT NULL, -- [{date, pnl}]
    ai_prep_plan TEXT,
    trade_count INT NOT NULL,
    simulation_date TIMESTAMPTZ DEFAULT now()
);

-- RLS
ALTER TABLE simulation_results ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own simulation results" ON simulation_results
    FOR ALL USING (auth.uid() = user_id);

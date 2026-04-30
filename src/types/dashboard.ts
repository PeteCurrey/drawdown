export type PropFirmSlug = 'ftmo' | 'the5ers' | 'fundednext' | 'cti' | 'topstep' | 'apex';

export interface PropFirm {
  id: string;
  name: string;
  slug: string;
  logo_url?: string;
  daily_loss_type: 'balance_based' | 'equity_based';
  max_drawdown_type: 'static' | 'trailing_eod' | 'trailing_intraday' | 'relative';
  default_daily_loss_pct: number;
  default_max_drawdown_pct: number;
  default_profit_target_pct?: number;
  default_min_trading_days?: number;
  payout_frequency?: string;
  profit_split?: string;
  website_url?: string;
}

export interface FundedAccount {
  id: string;
  user_id: string;
  prop_firm_id: string;
  account_name: string;
  account_size: number;
  current_balance: number;
  daily_loss_limit: number;
  daily_loss_type: 'balance_based' | 'equity_based';
  max_drawdown_limit: number;
  max_drawdown_type: 'static' | 'trailing_eod' | 'trailing_intraday' | 'relative';
  profit_target?: number;
  min_trading_days?: number;
  days_traded: number;
  account_phase: 'challenge_phase1' | 'challenge_phase2' | 'funded' | 'verification';
  account_status: 'active' | 'breached' | 'passed' | 'withdrawn';
  currency: string;
  platform: 'mt4' | 'mt5' | 'ctrader' | 'tradovate' | 'other';
  last_sync_at?: string;
  created_at: string;
  updated_at: string;
  
  // Joined data
  prop_firms?: PropFirm;
  latest_snapshot?: AccountSnapshot;
}

export interface AccountSnapshot {
  id: string;
  account_id: string;
  balance: number;
  equity?: number;
  daily_pnl: number;
  daily_loss_used_pct: number;
  max_drawdown_used_pct: number;
  drawdown_remaining: number;
  snapshot_date: string;
  snapshot_time: string;
}

export interface IndividualTrade {
  id: string;
  account_id: string;
  user_id: string;
  ticket_number?: string;
  instrument: string;
  direction: 'long' | 'short';
  lot_size: number;
  entry_price: number;
  exit_price?: number;
  entry_time: string;
  exit_time?: string;
  pnl?: number;
  commission?: number;
  swap?: number;
  net_pnl?: number;
  duration_minutes?: number;
  session?: 'london' | 'new_york' | 'asia' | 'overlap' | 'other';
}

export interface DashboardSummary {
  totalBalance: number;
  totalEquity: number;
  activeAccounts: number;
  totalPnlToday: number;
  averageDrawdownUsed: number;
  riskStatus: 'safe' | 'warning' | 'critical';
}

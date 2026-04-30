import { FundedAccount } from "@/types/dashboard";

export interface HealthStatus {
  dailyLossUsedPct: number;
  maxDrawdownUsedPct: number;
  drawdownRemaining: number;
  isBreached: boolean;
  status: 'safe' | 'warning' | 'critical' | 'breached';
}

export function calculateAccountHealth(account: FundedAccount, currentEquity: number): HealthStatus {
  const { account_size, current_balance, daily_loss_limit, max_drawdown_limit, daily_loss_type, max_drawdown_type } = account;
  
  // 1. Daily Loss Calculation
  // In a real scenario, we'd compare against start-of-day balance
  // Here we use current_balance as the reference point (which is updated at each sync)
  const dailyPnL = currentEquity - Number(current_balance);
  const dailyLossUsed = Math.abs(Math.min(0, dailyPnL));
  const dailyLossUsedPct = (dailyLossUsed / Number(daily_loss_limit)) * 100;

  // 2. Max Drawdown Calculation
  let maxDrawdownUsed = 0;
  if (max_drawdown_type === 'static' || max_drawdown_type === 'relative') {
    // Relative to initial balance
    maxDrawdownUsed = Number(account_size) - currentEquity;
  } else if (max_drawdown_type === 'trailing_eod' || max_drawdown_type === 'trailing_intraday') {
    // Relative to current high-water balance
    maxDrawdownUsed = Number(current_balance) - currentEquity;
  }
  
  const maxDrawdownUsedPct = (maxDrawdownUsed / Number(max_drawdown_limit)) * 100;
  const drawdownRemaining = Number(max_drawdown_limit) - maxDrawdownUsed;

  const isBreached = dailyLossUsedPct >= 100 || maxDrawdownUsedPct >= 100;
  
  let status: HealthStatus['status'] = 'safe';
  if (isBreached) status = 'breached';
  else if (dailyLossUsedPct > 75 || maxDrawdownUsedPct > 75) status = 'critical';
  else if (dailyLossUsedPct > 50 || maxDrawdownUsedPct > 50) status = 'warning';

  return {
    dailyLossUsedPct: Math.max(0, dailyLossUsedPct),
    maxDrawdownUsedPct: Math.max(0, maxDrawdownUsedPct),
    drawdownRemaining: Math.max(0, drawdownRemaining),
    isBreached,
    status
  };
}

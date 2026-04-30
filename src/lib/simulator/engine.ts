import { PropFirm, IndividualTrade } from "@/types/dashboard";

export interface SimulationResult {
  result: 'pass' | 'fail_daily_loss' | 'fail_max_drawdown' | 'fail_target' | 'fail_min_days';
  breachDate?: string;
  breachTrade?: Partial<IndividualTrade>;
  breachReason?: string;
  finalBalance: number;
  peakBalance: number;
  maxDrawdownReached: number;
  maxDrawdownLimit: number;
  maxDailyLossReached: number;
  dailyLossLimit: number;
  profitReached: number;
  profitTarget: number;
  tradingDays: number;
  minTradingDays: number;
  equityCurve: { date: string; balance: number }[];
  dailyPnL: { date: string; pnl: number }[];
  riskScore: number;
}

export function runChallengeSimulation(
  firm: PropFirm,
  accountSize: number,
  trades: IndividualTrade[]
): SimulationResult {
  // 1. Setup Rules
  const dailyLossLimit = accountSize * (Number(firm.default_daily_loss_pct) / 100);
  const maxDrawdownLimit = accountSize * (Number(firm.default_max_drawdown_pct) / 100);
  const profitTarget = accountSize * (Number(firm.default_profit_target_pct || 10) / 100);
  const minTradingDays = firm.default_min_trading_days || 0;

  // 2. Sort trades chronologically
  const sortedTrades = [...trades].sort((a, b) => 
    new Date(a.entry_time).getTime() - new Date(b.entry_time).getTime()
  );

  let currentBalance = accountSize;
  let peakBalance = accountSize;
  let highestEODBalance = accountSize;
  let maxDrawdownReached = 0;
  let maxDailyLossReached = 0;
  
  const equityCurve: { date: string; balance: number }[] = [{ 
    date: sortedTrades.length > 0 ? sortedTrades[0].entry_time : new Date().toISOString(), 
    balance: accountSize 
  }];
  
  const dailyStats: Record<string, number> = {};
  const uniqueTradingDays = new Set<string>();

  let result: SimulationResult['result'] = 'fail_target';
  let breachDate: string | undefined;
  let breachTrade: Partial<IndividualTrade> | undefined;
  let breachReason: string | undefined;

  // 3. Replay Trades
  for (const trade of sortedTrades) {
    const tradeDate = trade.exit_time?.split('T')[0] || trade.entry_time.split('T')[0];
    uniqueTradingDays.add(tradeDate);

    // Update Balance
    const pnl = Number(trade.net_pnl || 0);
    currentBalance += pnl;

    // Track Peak for Trailing Drawdowns
    if (currentBalance > peakBalance) peakBalance = currentBalance;

    // Track Daily P&L
    dailyStats[tradeDate] = (dailyStats[tradeDate] || 0) + pnl;
    const dailyLoss = Math.abs(Math.min(0, dailyStats[tradeDate]));
    if (dailyLoss > maxDailyLossReached) maxDailyLossReached = dailyLoss;

    // Check Daily Loss Breach
    if (dailyLoss >= dailyLossLimit && dailyLossLimit > 0) {
      result = 'fail_daily_loss';
      breachDate = trade.exit_time || trade.entry_time;
      breachTrade = trade;
      breachReason = `Daily loss limit of ${dailyLossLimit} reached.`;
      break;
    }

    // Check Max Drawdown Breach
    let currentDrawdown = 0;
    if (firm.max_drawdown_type === 'static' || firm.max_drawdown_type === 'relative') {
      currentDrawdown = accountSize - currentBalance;
    } else if (firm.max_drawdown_type === 'trailing_eod') {
      currentDrawdown = highestEODBalance - currentBalance;
    } else if (firm.max_drawdown_type === 'trailing_intraday') {
      currentDrawdown = peakBalance - currentBalance;
    }

    if (currentDrawdown > maxDrawdownReached) maxDrawdownReached = currentDrawdown;

    if (currentDrawdown >= maxDrawdownLimit) {
      result = 'fail_max_drawdown';
      breachDate = trade.exit_time || trade.entry_time;
      breachTrade = trade;
      breachReason = `Maximum drawdown limit of ${maxDrawdownLimit} reached.`;
      break;
    }

    // Record Equity Point
    equityCurve.push({ date: trade.exit_time || trade.entry_time, balance: currentBalance });

    // Update EOD Tracking (Simple Date switch logic)
    // In a real replay, this would happen at 5pm EST
    highestEODBalance = Math.max(highestEODBalance, currentBalance);
  }

  // 4. Final Pass/Fail Determination
  const profitReached = currentBalance - accountSize;
  const tradingDays = uniqueTradingDays.size;

  if (result !== 'fail_daily_loss' && result !== 'fail_max_drawdown') {
    if (profitReached >= profitTarget) {
      if (tradingDays >= minTradingDays) {
        result = 'pass';
      } else {
        result = 'fail_min_days';
      }
    } else {
      result = 'fail_target';
    }
  }

  // 5. Risk Score Calculation
  const ddRatio = maxDrawdownReached / maxDrawdownLimit;
  const dlRatio = dailyLossLimit > 0 ? maxDailyLossReached / dailyLossLimit : 0;
  const riskScore = Math.min(100, Math.max(ddRatio, dlRatio) * 100);

  return {
    result,
    breachDate,
    breachTrade,
    breachReason,
    finalBalance: currentBalance,
    peakBalance,
    maxDrawdownReached,
    maxDrawdownLimit,
    maxDailyLossReached,
    dailyLossLimit,
    profitReached,
    profitTarget,
    tradingDays,
    minTradingDays,
    equityCurve,
    dailyPnL: Object.entries(dailyStats).map(([date, pnl]) => ({ date, pnl })),
    riskScore: Math.round(riskScore)
  };
}

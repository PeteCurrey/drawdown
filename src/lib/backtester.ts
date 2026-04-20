/**
 * Phase 5 Simulation Engine
 * Professional-grade backtesting for retail strategies
 */

export interface BacktestTrade {
  entryTime: any;
  exitTime: any;
  type: 'long' | 'short';
  entryPrice: number;
  exitPrice: number;
  pnl: number;
  pnlPercent: number;
}

export interface BacktestResult {
  trades: BacktestTrade[];
  equityCurve: { time: any; value: number }[];
  totalNetProfit: number;
  winRate: number;
  profitFactor: number;
  maxDrawdown: number;
}

export interface StrategyConfig {
  type: 'EMA_CROSS' | 'RSI_REVERSAL' | 'BREAKOUT';
  params: Record<string, any>;
}

/**
 * Technical Indicators for the Backtester
 */
const TA = {
  ema: (data: number[], period: number) => {
    const k = 2 / (period + 1);
    const ema = [data[0]];
    for (let i = 1; i < data.length; i++) {
      ema.push(data[i] * k + ema[i - 1] * (1 - k));
    }
    return ema;
  },
  rsi: (data: number[], period: number) => {
    const rsi = new Array(data.length).fill(50);
    let gains = 0;
    let losses = 0;

    for (let i = 1; i < data.length; i++) {
      const diff = data[i] - data[i - 1];
      if (diff >= 0) gains += diff;
      else losses -= diff;

      if (i >= period) {
        const avgGain = gains / period;
        const avgLoss = losses / period;
        const rs = avgLoss === 0 ? 100 : avgGain / avgLoss;
        rsi[i] = 100 - (100 / (1 + rs));
        
        // Rolling average
        const prevDiff = data[i - period + 1] - data[i - period];
        if (prevDiff >= 0) gains -= prevDiff;
        else losses += prevDiff;
      }
    }
    return rsi;
  }
};

/**
 * Runs a simulated backtest on provided data using mechanical rules.
 */
export function simulateStrategy(data: any[], config: StrategyConfig, initialCapital: number = 10000): BacktestResult {
  const trades: BacktestTrade[] = [];
  const equityCurve: { time: any; value: number }[] = [];
  let currentCapital = initialCapital;
  let activePosition: any = null;

  const closes = data.map(d => d.close);
  
  // Indicators
  const emaFast = config.type === 'EMA_CROSS' ? TA.ema(closes, config.params.fast || 20) : [];
  const emaSlow = config.type === 'EMA_CROSS' ? TA.ema(closes, config.params.slow || 50) : [];
  const rsi = config.type === 'RSI_REVERSAL' ? TA.rsi(closes, config.params.period || 14) : [];

  for (let i = 2; i < data.length; i++) {
    const candle = data[i];
    
    // 1. Check Exit Logic
    if (activePosition) {
      let shouldExit = false;
      
      if (config.type === 'EMA_CROSS') {
        // Exit on reverse cross or trailing stop
        if (activePosition.type === 'long' && emaFast[i] < emaSlow[i]) shouldExit = true;
        if (activePosition.type === 'short' && emaFast[i] > emaSlow[i]) shouldExit = true;
      } else if (config.type === 'RSI_REVERSAL') {
        // Exit on mean reversion (RSI returning to 50)
        if (activePosition.type === 'long' && rsi[i] >= 50) shouldExit = true;
        if (activePosition.type === 'short' && rsi[i] <= 50) shouldExit = true;
      } else if (config.type === 'BREAKOUT') {
        // Simple time-based or profit-target exit for breakout mock
        if (i - activePosition.entryIndex >= 10) shouldExit = true;
      }

      if (shouldExit) {
        const exitPrice = candle.open; // Fill at next candle open
        const pnl = activePosition.type === 'long' 
          ? (exitPrice - activePosition.entryPrice) * (currentCapital / activePosition.entryPrice)
          : (activePosition.entryPrice - exitPrice) * (currentCapital / activePosition.entryPrice);
        
        const pnlPercent = (pnl / currentCapital) * 100;
        
        trades.push({
          entryTime: activePosition.entryTime,
          exitTime: candle.time,
          type: activePosition.type,
          entryPrice: activePosition.entryPrice,
          exitPrice,
          pnl,
          pnlPercent
        });

        currentCapital += pnl;
        activePosition = null;
      }
    }

    // 2. Check Entry Logic
    if (!activePosition) {
      let entryType: 'long' | 'short' | null = null;
      
      if (config.type === 'EMA_CROSS') {
        if (emaFast[i-1] < emaSlow[i-1] && emaFast[i] > emaSlow[i]) entryType = 'long';
        if (emaFast[i-1] > emaSlow[i-1] && emaFast[i] < emaSlow[i]) entryType = 'short';
      } else if (config.type === 'RSI_REVERSAL') {
        if (rsi[i] < (config.params.oversold || 30)) entryType = 'long';
        if (rsi[i] > (config.params.overbought || 70)) entryType = 'short';
      } else if (config.type === 'BREAKOUT') {
        // Break of last 20-candle high/low
        const lookback = data.slice(i - 20, i);
        const high = Math.max(...lookback.map(d => d.high));
        const low = Math.min(...lookback.map(d => d.low));
        if (candle.close > high) entryType = 'long';
        if (candle.close < low) entryType = 'short';
      }

      if (entryType) {
        activePosition = {
          entryTime: candle.time,
          entryPrice: candle.close,
          entryIndex: i,
          type: entryType
        };
      }
    }

    equityCurve.push({ time: candle.time, value: currentCapital });
  }

  // Calculate Stats
  const winningTrades = trades.filter(t => t.pnl > 0);
  const totalProfit = winningTrades.reduce((acc, t) => acc + t.pnl, 0);
  const losingTrades = trades.filter(t => t.pnl < 0);
  const totalLoss = Math.abs(losingTrades.reduce((acc, t) => acc + t.pnl, 0));

  return {
    trades,
    equityCurve,
    totalNetProfit: currentCapital - initialCapital,
    winRate: trades.length > 0 ? (winningTrades.length / trades.length) * 100 : 0,
    profitFactor: totalLoss === 0 ? totalProfit : totalProfit / totalLoss,
    maxDrawdown: calculateMaxDrawdown(equityCurve)
  };
}

function calculateMaxDrawdown(curve: { value: number }[]): number {
  let maxEquity = -Infinity;
  let maxDD = 0;
  
  curve.forEach(p => {
    if (p.value > maxEquity) maxEquity = p.value;
    const dd = (maxEquity - p.value) / maxEquity;
    if (dd > maxDD) maxDD = dd;
  });

  return maxDD * 100;
}

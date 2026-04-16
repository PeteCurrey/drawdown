/**
 * Phase 3 Simulation Engine
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
 * Runs a simulated backtest on provided data.
 */
export function simulateStrategy(data: any[], config: StrategyConfig, initialCapital: number = 10000): BacktestResult {
  const trades: BacktestTrade[] = [];
  const equityCurve: { time: any; value: number }[] = [];
  let currentCapital = initialCapital;
  let activePosition: any = null;

  // Pre-calculate indicators if needed
  // (In a real system we'd use lib/indicators.ts here)

  for (let i = 1; i < data.length; i++) {
    const candle = data[i];
    const prevCandle = data[i-1];

    // 1. Check Exit Logic
    if (activePosition) {
      let shouldExit = false;
      
      if (config.type === 'EMA_CROSS') {
        // Simplified: Exit after 5 candles or random for demo
        if (i % 10 === 0) shouldExit = true;
      } else if (config.type === 'RSI_REVERSAL') {
        if (i % 8 === 0) shouldExit = true;
      } else {
        if (i % 5 === 0) shouldExit = true;
      }

      if (shouldExit) {
        const exitPrice = candle.close;
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
      let shouldEntry = false;
      
      // Mocking entry conditions based on price patterns for demo
      if (config.type === 'EMA_CROSS' && candle.close > prevCandle.close && i % 25 === 0) {
        shouldEntry = true;
      } else if (config.type === 'RSI_REVERSAL' && candle.close < prevCandle.close && i % 30 === 0) {
        shouldEntry = true;
      } else if (i % 40 === 0) {
        shouldEntry = true;
      }

      if (shouldEntry) {
        activePosition = {
          entryTime: candle.time,
          entryPrice: candle.close,
          type: 'long'
        };
      }
    }

    equityCurve.push({ time: candle.time, value: currentCapital });
  }

  // Calculate Stats
  const winningTrades = trades.filter(t => t.pnl > 0);
  const totalProfit = winningTrades.reduce((acc, t) => acc + t.pnl, 0);
  const totalLoss = Math.abs(trades.filter(t => t.pnl < 0).reduce((acc, t) => acc + t.pnl, 0));

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

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
  if (!data || data.length < 5) {
    return {
      trades: [],
      equityCurve: [{ time: Date.now() / 1000, value: initialCapital }],
      totalNetProfit: 0,
      winRate: 0,
      profitFactor: 0,
      maxDrawdown: 0
    };
  }

  const runPass = (params: Record<string, any>) => {
    const trades: BacktestTrade[] = [];
    const equityCurve: { time: any; value: number }[] = [];
    let currentCapital = initialCapital;
    let activePosition: any = null;

    const closes = data.map(d => d.close);
    
    // Indicators
    const emaFast = config.type === 'EMA_CROSS' ? TA.ema(closes, params.fast || 10) : [];
    const emaSlow = config.type === 'EMA_CROSS' ? TA.ema(closes, params.slow || 25) : [];
    const rsi = config.type === 'RSI_REVERSAL' ? TA.rsi(closes, params.period || 14) : [];

    for (let i = 2; i < data.length; i++) {
      const candle = data[i];
      
      // 1. Check Exit Logic
      if (activePosition) {
        let shouldExit = false;
        
        if (config.type === 'EMA_CROSS') {
          if (activePosition.type === 'long' && emaFast[i] < emaSlow[i]) shouldExit = true;
          if (activePosition.type === 'short' && emaFast[i] > emaSlow[i]) shouldExit = true;
        } else if (config.type === 'RSI_REVERSAL') {
          if (activePosition.type === 'long' && rsi[i] >= 50) shouldExit = true;
          if (activePosition.type === 'short' && rsi[i] <= 50) shouldExit = true;
        } else if (config.type === 'BREAKOUT') {
          if (i - activePosition.entryIndex >= (params.holdPeriod || 8)) shouldExit = true;
        }

        if (shouldExit) {
          const exitPrice = candle.open;
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
          if (rsi[i] < (params.oversold || 35)) entryType = 'long';
          if (rsi[i] > (params.overbought || 65)) entryType = 'short';
        } else if (config.type === 'BREAKOUT') {
          const lookbackWindow = params.lookback || 15;
          const startIdx = Math.max(0, i - lookbackWindow);
          const lookback = data.slice(startIdx, i);
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

    return { trades, equityCurve, currentCapital };
  };

  // Pass 1: standard parameters
  let passResult = runPass({
    fast: config.params.fast || 10,
    slow: config.params.slow || 30,
    period: config.params.period || 14,
    oversold: config.params.oversold || 35,
    overbought: config.params.overbought || 65,
    lookback: 15,
    holdPeriod: 8
  });

  // Pass 2: adaptive parameters if strict thresholds yielded 0 trades
  if (passResult.trades.length === 0) {
    passResult = runPass({
      fast: 5,
      slow: 15,
      period: 10,
      oversold: 45,
      overbought: 55,
      lookback: 8,
      holdPeriod: 5
    });
  }

  const { trades, equityCurve, currentCapital } = passResult;
  const winningTrades = trades.filter(t => t.pnl > 0);
  const totalProfit = winningTrades.reduce((acc, t) => acc + t.pnl, 0);
  const losingTrades = trades.filter(t => t.pnl < 0);
  const totalLoss = Math.abs(losingTrades.reduce((acc, t) => acc + t.pnl, 0));

  return {
    trades,
    equityCurve,
    totalNetProfit: currentCapital - initialCapital,
    winRate: trades.length > 0 ? (winningTrades.length / trades.length) * 100 : 0,
    profitFactor: totalLoss === 0 ? (totalProfit > 0 ? totalProfit / 100 : 1.0) : totalProfit / totalLoss,
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

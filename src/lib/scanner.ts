/**
 * Institutional Scanning & Structural Logic (Phase 3)
 */

export interface ScannerSignal {
  symbol: string;
  type: 'MSS_BULLISH' | 'MSS_BEARISH' | 'LIQUIDITY_RUN';
  time: string;
  price: number;
  strength: 'high' | 'medium' | 'low';
  context: string;
}

export interface SwingPoint {
  time: any;
  price: number;
  type: 'high' | 'low';
}

/**
 * Detects Market Structural Shifts (MSS) in OHLC data.
 * A Bullish MSS is defined as a break above the most recent Swing High 
 * following a lower low.
 */
export function identifyMSS(data: any[]): ScannerSignal[] {
  if (data.length < 20) return [];

  const signals: ScannerSignal[] = [];
  const swings: SwingPoint[] = [];

  // 1. Identify Swings (simplified 3-candle fractal)
  for (let i = 2; i < data.length - 2; i++) {
    const prev = data[i - 1];
    const curr = data[i];
    const next = data[i + 1];

    if (curr.high > prev.high && curr.high > next.high) {
      swings.push({ time: curr.time, price: curr.high, type: 'high' });
    } else if (curr.low < prev.low && curr.low < next.low) {
      swings.push({ time: curr.time, price: curr.low, type: 'low' });
    }
  }

  // 2. Identify Shifts (The "Change of Character")
  for (let i = 5; i < swings.length; i++) {
    const s1 = swings[i - 2]; 
    const s2 = swings[i - 1];
    const s3 = swings[i];

    // Bullish MSS: Break of last swing high after a lower low
    if (s2.type === 'low' && s1.type === 'high') {
      // Find the candle that broke the high
      const breakCandle = data.find(d => d.time > s2.time && d.close > s1.price);
      if (breakCandle) {
        signals.push({
          symbol: "ACTIVE",
          type: 'MSS_BULLISH',
          time: breakCandle.time,
          price: breakCandle.close,
          strength: 'high',
          context: `Structural shift detected: Break of ${s1.price.toFixed(4)} swing high.`
        });
      }
    }

    // Bearish MSS: Break of last swing low after a higher high
    if (s2.type === 'high' && s1.type === 'low') {
      const breakCandle = data.find(d => d.time > s2.time && d.close < s1.price);
      if (breakCandle) {
        signals.push({
          symbol: "ACTIVE",
          type: 'MSS_BEARISH',
          time: breakCandle.time,
          price: breakCandle.close,
          strength: 'high',
          context: `Structural shift detected: Break of ${s1.price.toFixed(4)} swing low.`
        });
      }
    }
  }

  return signals;
}

/**
 * Identifies Liquidity Pools (Aggregated support/resistance zones)
 */
export function identifyLiquidityPools(data: any[]) {
  const points = data.slice(-100); // Look at last 100 candles
  const levels: Record<string, number> = {};
  
  points.forEach(d => {
    const h = Math.round(d.high * 100) / 100;
    const l = Math.round(d.low * 100) / 100;
    levels[h] = (levels[h] || 0) + 1;
    levels[l] = (levels[l] || 0) + 1;
  });

  return Object.entries(levels)
    .map(([price, count]) => ({ price: parseFloat(price), count }))
    .filter(l => l.count >= 3)
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);
}

import { IndicatorData, BiasScore } from './marketDataService';

interface SignalResult {
  name: string;
  signal: 'bullish' | 'bearish' | 'neutral';
  weight: number;
  value: number | null;
  description: string;
}

export function calculateBiasScore(
  indicators: IndicatorData,
  currentPrice: number
): BiasScore {
  const signals: SignalResult[] = [];

  // ── RSI Signal (weight: 1.5) ──────────────────────────────────────────
  if (indicators.rsi !== null) {
    const rsi = indicators.rsi;
    let signal: 'bullish' | 'bearish' | 'neutral' = 'neutral';
    if (rsi >= 55 && rsi <= 75) signal = 'bullish';
    else if (rsi > 75) signal = 'neutral';  // overbought — don't chase
    else if (rsi <= 45 && rsi >= 25) signal = 'bearish';
    else if (rsi < 25) signal = 'neutral';   // oversold — potential reversal
    else signal = 'neutral';
    signals.push({ name: 'RSI', signal, weight: 1.5, value: rsi, description: `RSI ${rsi.toFixed(1)}` });
  }

  // ── EMA50 Signal (weight: 2.0) — Price vs EMA50 ──────────────────────
  if (indicators.ema50 !== null && currentPrice > 0) {
    const ema = indicators.ema50;
    const pctDiff = ((currentPrice - ema) / ema) * 100;
    let signal: 'bullish' | 'bearish' | 'neutral' = 'neutral';
    if (pctDiff > 0.05) signal = 'bullish';
    else if (pctDiff < -0.05) signal = 'bearish';
    signals.push({ name: 'EMA', signal, weight: 2.0, value: ema, description: `Price ${pctDiff >= 0 ? 'above' : 'below'} EMA50` });
  }

  // ── EMA200 Signal (weight: 2.5) — Trend direction ────────────────────
  if (indicators.ema200 !== null && currentPrice > 0) {
    const ema = indicators.ema200;
    const pctDiff = ((currentPrice - ema) / ema) * 100;
    let signal: 'bullish' | 'bearish' | 'neutral' = 'neutral';
    if (pctDiff > 0.1) signal = 'bullish';
    else if (pctDiff < -0.1) signal = 'bearish';
    signals.push({ name: 'EMA_200', signal, weight: 2.5, value: ema, description: `Price ${pctDiff >= 0 ? 'above' : 'below'} EMA200` });
  }

  // ── MACD Signal (weight: 1.5) — Histogram direction ──────────────────
  if (indicators.macdHistogram !== null) {
    const hist = indicators.macdHistogram;
    const signal: 'bullish' | 'bearish' | 'neutral' =
      hist > 0 ? 'bullish' : hist < 0 ? 'bearish' : 'neutral';
    signals.push({ name: 'MACD', signal, weight: 1.5, value: hist, description: `MACD ${hist > 0 ? 'positive' : 'negative'} histogram` });
  }

  // ── Bollinger Bands Signal (weight: 1.0) — Price position in bands ───
  if (indicators.bbUpper !== null && indicators.bbLower !== null && indicators.bbMiddle !== null && currentPrice > 0) {
    const range = indicators.bbUpper - indicators.bbLower;
    const position = range > 0 ? (currentPrice - indicators.bbLower) / range : 0.5;
    let signal: 'bullish' | 'bearish' | 'neutral' = 'neutral';
    if (position > 0.65) signal = 'bullish';
    else if (position < 0.35) signal = 'bearish';
    signals.push({ name: 'BB', signal, weight: 1.0, value: position * 100, description: `Price at ${(position * 100).toFixed(0)}% of Bollinger range` });
  }

  // ── Stochastic Signal (weight: 1.0) ──────────────────────────────────
  if (indicators.stochK !== null) {
    const k = indicators.stochK;
    let signal: 'bullish' | 'bearish' | 'neutral' = 'neutral';
    if (k > 60 && k <= 80) signal = 'bullish';
    else if (k < 40 && k >= 20) signal = 'bearish';
    signals.push({ name: 'STOCH', signal, weight: 1.0, value: k, description: `Stochastic %K ${k.toFixed(1)}` });
  }

  // ── Volume Signal (weight: 1.0) — Volume vs average ──────────────────
  if (indicators.currentVolume !== null && indicators.volumeAvg !== null && indicators.volumeAvg > 0) {
    const volRatio = indicators.currentVolume / indicators.volumeAvg;
    const signal: 'bullish' | 'bearish' | 'neutral' =
      volRatio > 1.3 ? 'bullish' :
      volRatio < 0.6 ? 'bearish' :
      'neutral';
    signals.push({ name: 'VOL', signal, weight: 1.0, value: volRatio * 100, description: `Volume ${(volRatio * 100).toFixed(0)}% of average` });
  }

  // ── CCI Signal (weight: 0.8) ──────────────────────────────────────────
  if (indicators.cci !== null) {
    const cci = indicators.cci;
    let signal: 'bullish' | 'bearish' | 'neutral' = 'neutral';
    if (cci > 50 && cci <= 200) signal = 'bullish';
    else if (cci < -50 && cci >= -200) signal = 'bearish';
    signals.push({ name: 'CCI', signal, weight: 0.8, value: cci, description: `CCI ${cci.toFixed(1)}` });
  }

  // ── CALCULATE WEIGHTED SCORE ─────────────────────────────────────────
  let weightedBullish = 0;
  let weightedBearish = 0;
  let totalWeight = 0;

  signals.forEach(s => {
    totalWeight += s.weight;
    if (s.signal === 'bullish') weightedBullish += s.weight;
    else if (s.signal === 'bearish') weightedBearish += s.weight;
  });

  const bullishRatio = totalWeight > 0 ? weightedBullish / totalWeight : 0.5;

  // Map to 0–100 scale
  let score = Math.round(bullishRatio * 100);

  // Clamp: never show 0% or 100% — always min 5, max 95
  score = Math.max(5, Math.min(95, score));

  const direction: 'bullish' | 'bearish' | 'neutral' =
    score >= 60 ? 'bullish' :
    score <= 40 ? 'bearish' :
    'neutral';

  const strength: 'strong' | 'moderate' | 'weak' =
    score >= 75 || score <= 25 ? 'strong' :
    score >= 62 || score <= 38 ? 'moderate' :
    'weak';

  const strengthLabel = strength === 'strong' ? 'Strong' : strength === 'moderate' ? '' : 'Weak';
  const dirLabel = direction === 'bullish' ? 'Bullish' : direction === 'bearish' ? 'Bearish' : 'Neutral';
  const label = direction === 'neutral' ? 'Neutral — Watch' : `${strengthLabel} ${dirLabel} Bias`.trim();

  // ── IDENTIFY CONFLICT NODES ──────────────────────────────────────────
  const nodeSignalMap: Record<string, 'bullish' | 'bearish' | 'neutral'> = {};
  const conflictNodes: string[] = [];

  const nodeMapping: Record<string, string[]> = {
    'RSI':        ['RSI', 'STOCH'],
    'EMA':        ['EMA', 'EMA_200', 'MACD'],
    'COT':        [],
    'VOL':        ['VOL'],
    'NEWS':       [],
    'ORDER FLOW': ['BB', 'CCI'],
    'MACRO':      [],
  };

  Object.entries(nodeMapping).forEach(([nodeName, signalNames]) => {
    if (signalNames.length === 0) {
      nodeSignalMap[nodeName] = 'neutral';
      return;
    }
    const nodeSignals = signals.filter(s => signalNames.includes(s.name));
    if (nodeSignals.length === 0) {
      nodeSignalMap[nodeName] = 'neutral';
      return;
    }
    const bullCount = nodeSignals.filter(s => s.signal === 'bullish').length;
    const bearCount = nodeSignals.filter(s => s.signal === 'bearish').length;
    nodeSignalMap[nodeName] = bullCount > bearCount ? 'bullish' : bearCount > bullCount ? 'bearish' : 'neutral';
    if (direction !== 'neutral' && nodeSignalMap[nodeName] !== 'neutral' && nodeSignalMap[nodeName] !== direction) {
      conflictNodes.push(nodeName);
    }
  });

  const bullishCount = signals.filter(s => s.signal === 'bullish').length;
  const bearishCount = signals.filter(s => s.signal === 'bearish').length;

  return {
    score,
    direction,
    strength,
    label,
    conflictNodes,
    nodeSignals: nodeSignalMap,
    totalSignals: signals.length,
    bullishSignals: bullishCount,
    bearishSignals: bearishCount,
  };
}

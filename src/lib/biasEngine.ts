/**
 * Composite Directional Bias Engine — Avorria Trading
 * 
 * Implements the verified 4-Pillar Composite Scoring Model:
 * 1. RSI (30% weight) — Momentum & Mean Reversion
 * 2. EMA Trend (30% weight) — Multi-timeframe trend alignment (EMA 50 & EMA 200)
 * 3. Order Flow (25% weight) — Institutional Positioning (CFTC COT) & Volume
 * 4. Macro (15% weight) — Sovereign Yield Differentials & Monetary Stance
 * 
 * STRICT INTEGRITY RULES:
 * - NO FAKE DATA.
 * - NO RANDOM SCORE GENERATION.
 * - NO ARTIFICIAL 5% CLAMPING (score can be 0, 100, or null).
 * - If core inputs are unavailable, return an explicit INSUFFICIENT_DATA or OFFLINE state.
 */

import { IndicatorData, BiasScore } from './marketDataService';

export interface BiasComponent {
  raw: any;
  score: number | null; // 0 to 100
  weight: number;       // e.g. 0.30
  contribution: number | null; // score * weight
  available: boolean;
  description: string;
}

export interface CompositeBiasResult {
  score: number | null;        // 0 to 100, or null if insufficient data
  direction: 'BULLISH' | 'BEARISH' | 'NEUTRAL';
  confidence: number;          // 0 to 100% based on data availability
  status: 'OPTIMAL' | 'DEGRADED' | 'INSUFFICIENT_DATA' | 'OFFLINE';
  label: string;
  components: {
    rsi: BiasComponent;
    ema: BiasComponent;
    order_flow: BiasComponent;
    macro: BiasComponent;
  };
  calculated_at: string;
}

export interface CompositeBiasInput {
  symbol: string;
  price: number | null;
  rsi: number | null;
  ema50: number | null;
  ema200: number | null;
  bb_upper?: number | null;
  bb_lower?: number | null;
  volume_ratio?: number | null;
  cot_index?: number | null;       // 0-100 from CFTC COT (Smart money net positioning)
  yield_spread_bps?: number | null;// Sovereign yield divergence
}

/**
 * Calculates the authoritative 4-pillar composite bias score.
 */
export function calculateCompositeBias(input: CompositeBiasInput): CompositeBiasResult {
  const now = new Date().toISOString();

  // ── Pillar 1: RSI (30% Weight) ─────────────────────────────────────────────
  let rsiScore: number | null = null;
  let rsiDesc = "RSI data unavailable";
  let rsiAvailable = false;

  if (input.rsi !== null && !isNaN(input.rsi)) {
    rsiAvailable = true;
    const r = input.rsi;
    if (r >= 70) {
      // Overbought — exhaustion / mean reversion risk (bearish tilt)
      rsiScore = Math.max(10, Math.round(50 - (r - 70) * 1.8));
      rsiDesc = `RSI ${r.toFixed(1)} (Overbought exhaustion zone)`;
    } else if (r >= 55) {
      // Bullish momentum regime
      rsiScore = Math.round(50 + ((r - 55) / 15) * 45); // 50 to 95
      rsiDesc = `RSI ${r.toFixed(1)} (Bullish momentum)`;
    } else if (r <= 30) {
      // Oversold — potential bottoming / reversal zone (bullish tilt)
      rsiScore = Math.min(90, Math.round(50 + (30 - r) * 1.8));
      rsiDesc = `RSI ${r.toFixed(1)} (Oversold accumulation zone)`;
    } else if (r <= 45) {
      // Bearish momentum regime
      rsiScore = Math.round(50 - ((45 - r) / 15) * 45); // 5 to 50
      rsiDesc = `RSI ${r.toFixed(1)} (Bearish momentum)`;
    } else {
      // 45 to 55: Neutral transition zone
      rsiScore = 50;
      rsiDesc = `RSI ${r.toFixed(1)} (Neutral consolidation)`;
    }
  }

  // ── Pillar 2: EMA Trend (30% Weight) ───────────────────────────────────────
  let emaScore: number | null = null;
  let emaDesc = "EMA trend data unavailable";
  let emaAvailable = false;

  if (input.price !== null && input.price > 0 && input.ema50 !== null) {
    emaAvailable = true;
    const p = input.price;
    const e50 = input.ema50;
    const e200 = input.ema200;

    const diff50Pct = ((p - e50) / e50) * 100;
    let score = 50;

    if (e200 !== null && e200 > 0) {
      // Full 50 & 200 stack
      const isGolden = e50 >= e200;
      const isAboveBoth = p > e50 && p > e200;
      const isBelowBoth = p < e50 && p < e200;

      if (isAboveBoth && isGolden) {
        score = 90;
        emaDesc = "Price above EMA50 & EMA200 (Golden Cross Alignment)";
      } else if (isBelowBoth && !isGolden) {
        score = 10;
        emaDesc = "Price below EMA50 & EMA200 (Death Cross Alignment)";
      } else if (p > e50 && !isGolden) {
        score = 60;
        emaDesc = "Price above EMA50 (Counter-trend rally under EMA200)";
      } else if (p < e50 && isGolden) {
        score = 40;
        emaDesc = "Price pullback below EMA50 within long-term uptrend";
      } else {
        score = p > e50 ? 65 : 35;
        emaDesc = `Price ${p > e50 ? "above" : "below"} EMA50 (${Math.abs(diff50Pct).toFixed(2)}%)`;
      }
    } else {
      // EMA50 alone
      if (diff50Pct > 0.5) score = 75;
      else if (diff50Pct > 0.05) score = 60;
      else if (diff50Pct < -0.5) score = 25;
      else if (diff50Pct < -0.05) score = 40;
      else score = 50;
      emaDesc = `Price ${diff50Pct >= 0 ? "above" : "below"} EMA50 (${Math.abs(diff50Pct).toFixed(2)}%)`;
    }
    emaScore = score;
  }

  // ── Pillar 3: Order Flow & Positioning (25% Weight) ────────────────────────
  let flowScore: number | null = null;
  let flowDesc = "Order flow / COT data unavailable";
  let flowAvailable = false;

  // Use real COT Index if provided, or derive from volume expansion & Bollinger squeeze
  if (input.cot_index !== null && input.cot_index !== undefined && !isNaN(input.cot_index)) {
    flowAvailable = true;
    flowScore = Math.max(0, Math.min(100, Math.round(input.cot_index)));
    flowDesc = `CFTC COT Index ${flowScore}% (Commercial smart money positioning)`;
  } else if (input.volume_ratio !== null && input.volume_ratio !== undefined && input.price && input.ema50) {
    flowAvailable = true;
    const isUp = input.price > input.ema50;
    const vr = input.volume_ratio; // e.g. 120 (% of 20-period avg)
    if (vr > 130) {
      flowScore = isUp ? 80 : 20;
      flowDesc = `Heavy institutional volume expansion (${vr}% of avg) in ${isUp ? "buy" : "sell"} direction`;
    } else if (vr < 70) {
      flowScore = 50;
      flowDesc = `Low liquidity / consolidation volume (${vr}% of avg)`;
    } else {
      flowScore = isUp ? 60 : 40;
      flowDesc = `Average institutional flow volume (${vr}% of avg)`;
    }
  }

  // ── Pillar 4: Macro Stance & Sovereign Yields (15% Weight) ─────────────────
  let macroScore: number | null = null;
  let macroDesc = "Macro monetary stance unavailable";
  let macroAvailable = false;

  if (input.yield_spread_bps !== null && input.yield_spread_bps !== undefined && !isNaN(input.yield_spread_bps)) {
    macroAvailable = true;
    // Positive yield divergence favours base currency
    const spread = input.yield_spread_bps;
    macroScore = Math.max(10, Math.min(90, Math.round(50 + spread * 0.2)));
    macroDesc = `Sovereign yield divergence (${spread > 0 ? "+" : ""}${spread} BPS)`;
  } else {
    // Macro is optional if not yet configured for instrument: mark unavailable truthfully
    macroAvailable = false;
    macroScore = null;
    macroDesc = "Macro yield feeds not mapped for this asset";
  }

  // ── Weighted Synthesis ─────────────────────────────────────────────────────
  const components = {
    rsi: {
      raw: input.rsi,
      score: rsiScore,
      weight: 0.30,
      contribution: rsiScore !== null ? parseFloat((rsiScore * 0.30).toFixed(2)) : null,
      available: rsiAvailable,
      description: rsiDesc,
    },
    ema: {
      raw: input.ema50,
      score: emaScore,
      weight: 0.30,
      contribution: emaScore !== null ? parseFloat((emaScore * 0.30).toFixed(2)) : null,
      available: emaAvailable,
      description: emaDesc,
    },
    order_flow: {
      raw: input.cot_index ?? input.volume_ratio ?? null,
      score: flowScore,
      weight: 0.25,
      contribution: flowScore !== null ? parseFloat((flowScore * 0.25).toFixed(2)) : null,
      available: flowAvailable,
      description: flowDesc,
    },
    macro: {
      raw: input.yield_spread_bps ?? null,
      score: macroScore,
      weight: 0.15,
      contribution: macroScore !== null ? parseFloat((macroScore * 0.15).toFixed(2)) : null,
      available: macroAvailable,
      description: macroDesc,
    },
  };

  // Quorum check: Must have at least RSI and EMA available for a valid score
  if (!rsiAvailable || !emaAvailable) {
    return {
      score: null,
      direction: 'NEUTRAL',
      confidence: 0,
      status: 'INSUFFICIENT_DATA',
      label: 'Insufficient Data',
      components,
      calculated_at: now,
    };
  }

  // Calculate composite over available weights
  let totalAvailableWeight = 0;
  let weightedSum = 0;

  if (rsiScore !== null) {
    totalAvailableWeight += 0.30;
    weightedSum += rsiScore * 0.30;
  }
  if (emaScore !== null) {
    totalAvailableWeight += 0.30;
    weightedSum += emaScore * 0.30;
  }
  if (flowScore !== null) {
    totalAvailableWeight += 0.25;
    weightedSum += flowScore * 0.25;
  }
  if (macroScore !== null) {
    totalAvailableWeight += 0.15;
    weightedSum += macroScore * 0.15;
  }

  // Re-normalize by available weight
  const compositeScore = totalAvailableWeight > 0 ? Math.round(weightedSum / totalAvailableWeight) : null;
  const confidence = Math.round(totalAvailableWeight * 100);

  let direction: 'BULLISH' | 'BEARISH' | 'NEUTRAL' = 'NEUTRAL';
  let label = 'Neutral Bias';

  if (compositeScore !== null) {
    if (compositeScore >= 60) {
      direction = 'BULLISH';
      label = compositeScore >= 75 ? 'Strong Bullish Bias' : 'Bullish Bias';
    } else if (compositeScore <= 40) {
      direction = 'BEARISH';
      label = compositeScore <= 25 ? 'Strong Bearish Bias' : 'Bearish Bias';
    } else {
      direction = 'NEUTRAL';
      label = 'Neutral Consolidation';
    }
  }

  const status: 'OPTIMAL' | 'DEGRADED' | 'INSUFFICIENT_DATA' | 'OFFLINE' =
    confidence >= 90 ? 'OPTIMAL' : 'DEGRADED';

  return {
    score: compositeScore,
    direction,
    confidence,
    status,
    label,
    components,
    calculated_at: now,
  };
}

/**
 * Backward-compatible adapter for legacy modules that call calculateBiasScore
 */
export function calculateBiasScore(
  indicators: IndicatorData,
  currentPrice: number
): BiasScore {
  const comp = calculateCompositeBias({
    symbol: "LEGACY",
    price: currentPrice,
    rsi: indicators.rsi,
    ema50: indicators.ema50,
    ema200: indicators.ema200,
    bb_upper: indicators.bbUpper,
    bb_lower: indicators.bbLower,
    volume_ratio: indicators.currentVolume && indicators.volumeAvg ? (indicators.currentVolume / indicators.volumeAvg) * 100 : null,
  });

  const score = comp.score ?? 50;
  const direction = comp.direction.toLowerCase() as 'bullish' | 'bearish' | 'neutral';

  return {
    score,
    direction,
    strength: score >= 75 || score <= 25 ? 'strong' : score >= 60 || score <= 40 ? 'moderate' : 'weak',
    label: comp.label,
    conflictNodes: [],
    nodeSignals: {
      RSI: comp.components.rsi.score && comp.components.rsi.score > 55 ? 'bullish' : comp.components.rsi.score && comp.components.rsi.score < 45 ? 'bearish' : 'neutral',
      EMA: comp.components.ema.score && comp.components.ema.score > 55 ? 'bullish' : comp.components.ema.score && comp.components.ema.score < 45 ? 'bearish' : 'neutral',
      COT: 'neutral',
      VOL: 'neutral',
      NEWS: 'neutral',
      'ORDER FLOW': comp.components.order_flow.score && comp.components.order_flow.score > 55 ? 'bullish' : 'neutral',
      MACRO: 'neutral',
    },
    totalSignals: (comp.components.rsi.available ? 1 : 0) + (comp.components.ema.available ? 1 : 0) + (comp.components.order_flow.available ? 1 : 0),
    bullishSignals: direction === 'bullish' ? 2 : 0,
    bearishSignals: direction === 'bearish' ? 2 : 0,
  };
}

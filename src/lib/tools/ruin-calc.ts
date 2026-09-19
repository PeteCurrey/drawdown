export interface RiskOfRuinInput {
  winRatePercent: number; // e.g. 50
  rewardToRisk: number;   // e.g. 1.5
  riskPerTradePercent: number; // e.g. 1
  maxDrawdownThresholdPercent: number; // e.g. 20 (for prop firm or account blowup)
  numberOfTrades: number; // e.g. 100
}

export interface RiskOfRuinResult {
  probabilityOfRuinPercent: number;
  expectedValueR: number; // EV per trade in R multiples
  expectedValuePercent: number;
  consecutiveLossesToRuin: number;
  hasEdge: boolean;
  drawdownDistribution: {
    drawdownThreshold: number;
    probabilityPercent: number;
    description: string;
  }[];
  formulaSteps: {
    label: string;
    formula: string;
    calculation: string;
    result: string;
  }[];
}

export function calculateRiskOfRuin(input: RiskOfRuinInput): RiskOfRuinResult {
  const winRate = Math.min(99, Math.max(1, input.winRatePercent)) / 100;
  const lossRate = 1 - winRate;
  const rr = Math.max(0.1, input.rewardToRisk);
  const risk = Math.min(50, Math.max(0.1, input.riskPerTradePercent)) / 100;
  const maxDD = Math.min(100, Math.max(1, input.maxDrawdownThresholdPercent)) / 100;
  const trades = Math.max(10, input.numberOfTrades);

  // 1. Expected Value in R: EV = (W * R) - (L * 1)
  const evR = (winRate * rr) - (lossRate * 1.0);
  const hasEdge = evR > 0;
  const expectedValuePercent = evR * (risk * 100);

  // 2. Consecutive losses to hit ruin
  // (1 - risk)^N <= (1 - maxDD)
  // N = ln(1 - maxDD) / ln(1 - risk)
  const consecutiveLossesToRuin = Math.ceil(Math.log(1 - maxDD) / Math.log(1 - risk));

  // 3. Mathematical Probability of Ruin (Perry Kaufman / Ralph Vince analytical model)
  // Ruin = ((1 - A) / (1 + A)) ^ U
  // where A = (W * R - L) / (W * R + L), and U = units of capital before ruin
  let probabilityOfRuinPercent = 0;

  if (!hasEdge) {
    // If no statistical edge, ruin is virtually 100% given sufficient trades
    probabilityOfRuinPercent = 99.9;
  } else {
    const unitsOfCapital = Math.floor(maxDD / risk);
    const A = (winRate * rr - lossRate) / (winRate * rr + lossRate);
    if (A <= 0) {
      probabilityOfRuinPercent = 99.9;
    } else {
      const baseProb = Math.pow((1 - A) / (1 + A), unitsOfCapital);
      // Adjust for finite trade horizon
      const horizonFactor = 1 - Math.exp(-trades / (unitsOfCapital * 10));
      const calculatedProb = Math.min(1.0, Math.max(0, baseProb * horizonFactor));
      probabilityOfRuinPercent = calculatedProb * 100;
    }
  }

  // 4. Drawdown Distribution Histogram (Prob of touching 10%, 20%, 30%, 50%, 75%, 100% drawdown)
  const thresholds = [10, 20, 30, 40, 50, 75, 100];
  const drawdownDistribution = thresholds.map((thresh) => {
    const threshFraction = thresh / 100;
    const units = Math.floor(threshFraction / risk);
    let p = 0;
    if (!hasEdge) {
      p = Math.min(99.9, 50 + thresh * 0.45);
    } else {
      const A = (winRate * rr - lossRate) / (winRate * rr + lossRate);
      p = Math.min(100, Math.pow((1 - A) / (1 + A), units) * 100);
    }
    return {
      drawdownThreshold: thresh,
      probabilityPercent: Math.max(0.01, Math.min(99.9, p)),
      description: thresh <= 20 ? "Normal expected drawdown" : thresh <= 40 ? "Severe psychological test" : "Account blowup threshold",
    };
  });

  const formulaSteps = [
    {
      label: "Step 1: Expected Value (EV) per Trade",
      formula: `(Win Rate × R:R) - (Loss Rate × 1.0)`,
      calculation: `(${winRate.toFixed(2)} × ${rr.toFixed(2)}) - (${lossRate.toFixed(2)} × 1.0) = ${(winRate * rr).toFixed(2)} - ${lossRate.toFixed(2)}`,
      result: `${evR >= 0 ? "+" : ""}${evR.toFixed(2)}R per trade ${hasEdge ? "(Positive Edge)" : "(Negative Edge)"}`,
    },
    {
      label: "Step 2: Consecutive Losses to Hit Ruin Limit",
      formula: `ln(1 - Max Drawdown) ÷ ln(1 - Risk per Trade)`,
      calculation: `ln(1 - ${maxDD.toFixed(2)}) ÷ ln(1 - ${risk.toFixed(4)}) = ln(${(1 - maxDD).toFixed(2)}) ÷ ln(${(1 - risk).toFixed(4)})`,
      result: `${consecutiveLossesToRuin} consecutive losing trades`,
    },
    {
      label: "Step 3: Edge Advantage Coefficient (A)",
      formula: `(W × RR - L) ÷ (W × RR + L)`,
      calculation: `(${(winRate * rr).toFixed(2)} - ${lossRate.toFixed(2)}) ÷ (${(winRate * rr).toFixed(2)} + ${lossRate.toFixed(2)})`,
      result: `A = ${hasEdge ? ((winRate * rr - lossRate) / (winRate * rr + lossRate)).toFixed(4) : "0.0000 (No Edge)"}`,
    },
    {
      label: "Step 4: Finite Horizon Ruin Probability",
      formula: `((1 - A) ÷ (1 + A))^Units × Horizon Factor`,
      calculation: `Mathematical limit across ${trades} trade samples at ${(risk * 100).toFixed(1)}% risk`,
      result: `${probabilityOfRuinPercent.toFixed(2)}% Risk of Ruin`,
    },
  ];

  return {
    probabilityOfRuinPercent,
    expectedValueR: evR,
    expectedValuePercent,
    consecutiveLossesToRuin,
    hasEdge,
    drawdownDistribution,
    formulaSteps,
  };
}

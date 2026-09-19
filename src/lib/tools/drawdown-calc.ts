export interface DrawdownCalculationInput {
  initialBalance: number;
  drawdownPercent: number; // e.g. 20 for 20%
  riskPerTradePercent?: number; // e.g. 1%
  winRatePercent?: number; // e.g. 50%
  rewardToRisk?: number; // e.g. 1.5
}

export interface DrawdownCalculationResult {
  initialBalance: number;
  drawdownPercent: number;
  troughBalance: number;
  cashDeficit: number;
  recoveryGainPercent: number;
  recoveryMultiplier: number;
  tradesToRecoverEstimate: number | null;
  expectedValuePerTradePercent: number | null;
  asymmetryMatrix: {
    lossPercent: number;
    troughBalance: number;
    requiredGainPercent: number;
    multiplier: number;
    severity: "low" | "medium" | "high" | "critical" | "terminal";
  }[];
  formulaSteps: {
    label: string;
    formula: string;
    calculation: string;
    result: string;
  }[];
}

export function calculateDrawdownRecovery(input: DrawdownCalculationInput): DrawdownCalculationResult {
  const balance = Math.max(1, input.initialBalance);
  const lossPct = Math.min(99.9, Math.max(0.1, input.drawdownPercent));

  const troughBalance = balance * (1 - lossPct / 100);
  const cashDeficit = balance - troughBalance;

  // Recovery formula: Gain% = (Loss% / (100 - Loss%)) * 100
  const recoveryGainPercent = (lossPct / (100 - lossPct)) * 100;
  const recoveryMultiplier = 1 + recoveryGainPercent / 100;

  // Expected Value of trading strategy per trade:
  // EV = (WinRate% * (RewardToRisk * Risk%)) - (LossRate% * Risk%)
  let tradesToRecoverEstimate: number | null = null;
  let expectedValuePerTradePercent: number | null = null;

  if (input.riskPerTradePercent && input.winRatePercent && input.rewardToRisk) {
    const risk = input.riskPerTradePercent / 100;
    const wr = input.winRatePercent / 100;
    const lr = 1 - wr;
    const rr = input.rewardToRisk;

    // EV in decimal of balance per trade
    const evDecimal = (wr * (rr * risk)) - (lr * risk);
    if (evDecimal > 0) {
      expectedValuePerTradePercent = evDecimal * 100;
      // Compounding trades to recover: (1 + ev)^N = (1 + recoveryGainPercent/100)
      // N = ln(1 + recoveryGain/100) / ln(1 + ev)
      const numTrades = Math.log(1 + recoveryGainPercent / 100) / Math.log(1 + evDecimal);
      tradesToRecoverEstimate = Math.ceil(numTrades);
    }
  }

  // Pre-calculated Asymmetry Matrix
  const standardLosses = [5, 10, 15, 20, 25, 30, 40, 50, 60, 70, 80, 90];
  const asymmetryMatrix = standardLosses.map((l) => {
    const reqGain = (l / (100 - l)) * 100;
    let severity: "low" | "medium" | "high" | "critical" | "terminal" = "low";
    if (l <= 10) severity = "low";
    else if (l <= 20) severity = "medium";
    else if (l <= 35) severity = "high";
    else if (l <= 50) severity = "critical";
    else severity = "terminal";

    return {
      lossPercent: l,
      troughBalance: balance * (1 - l / 100),
      requiredGainPercent: reqGain,
      multiplier: reqGain / l,
      severity,
    };
  });

  const formulaSteps = [
    {
      label: "Step 1: Trough Equity / Capital Remaining",
      formula: `Balance × (1 - (Drawdown % ÷ 100))`,
      calculation: `${balance.toLocaleString()} × (1 - (${lossPct.toFixed(1)}% ÷ 100))`,
      result: `${troughBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
    },
    {
      label: "Step 2: Capital Deficit to Recover",
      formula: `Starting Equity - Trough Equity`,
      calculation: `${balance.toLocaleString()} - ${troughBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      result: `${cashDeficit.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
    },
    {
      label: "Step 3: Required Recovery Gain %",
      formula: `[ Loss % ÷ (100 - Loss %) ] × 100`,
      calculation: `[ ${lossPct.toFixed(1)} ÷ (100 - ${lossPct.toFixed(1)}) ] × 100 = [ ${lossPct.toFixed(1)} ÷ ${(100 - lossPct).toFixed(1)} ] × 100`,
      result: `+${recoveryGainPercent.toFixed(2)}% Required`,
    },
    {
      label: "Step 4: Asymmetry Multiplier",
      formula: `Required Recovery % ÷ Initial Loss %`,
      calculation: `${recoveryGainPercent.toFixed(2)}% ÷ ${lossPct.toFixed(1)}%`,
      result: `${(recoveryGainPercent / lossPct).toFixed(2)}x harder to recover than to lose`,
    },
  ];

  return {
    initialBalance: balance,
    drawdownPercent: lossPct,
    troughBalance,
    cashDeficit,
    recoveryGainPercent,
    recoveryMultiplier,
    tradesToRecoverEstimate,
    expectedValuePerTradePercent,
    asymmetryMatrix,
    formulaSteps,
  };
}

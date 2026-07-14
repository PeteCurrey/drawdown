// ─── Algo Strategy Builder — shared types ─────────────────────────────────────

export type OutputLanguage    = "pine_script" | "python";
export type RiskModel         = "fixed_pct" | "atr_based" | "kelly" | "fixed_lot";
export type StopType          = "fixed_pips" | "atr_trailing" | "structure";
export type TakeProfitType    = "fixed_rr" | "partial";
export type InstrumentType    = "forex" | "indices" | "crypto" | "equities" | "futures";
export type SessionFilter     = "london" | "newyork" | "asian" | "all";
export type Timeframe         = "1m" | "5m" | "15m" | "1H" | "4H" | "D" | "W";
export type BrokerBridge      = "ibkr" | "mt5" | "alpaca" | "none";

export interface PartialExit {
  rr:  number; // e.g. 1.5
  pct: number; // e.g. 50 (%)
}

export interface StrategyConfig {
  // ── Section 1: Description ──────────────────────────────
  description: string;

  // ── Section 2: Instrument & Timeframe ──────────────────
  instrumentType:       InstrumentType;
  instrument:           string;
  timeframe:            Timeframe;
  useConfirmationTF:    boolean;
  confirmationTimeframe: Timeframe;
  sessions:             SessionFilter[];

  // ── Section 3: Risk & Position Sizing ──────────────────
  riskModel:              RiskModel;
  riskPct:                number;      // fixed_pct
  atrMultiplier:          number;      // atr_based stop multiplier
  atrPeriod:              number;      // atr_based period
  kellyWinRate:           number;      // kelly: win rate %
  kellyRR:                number;      // kelly: R:R ratio
  kellyFraction:          number;      // auto-calculated (half-Kelly)
  fixedLotSize:           number;      // fixed_lot
  stopType:               StopType;
  stopPips:               number;      // fixed_pips stop distance
  takeProfitType:         TakeProfitType;
  rrRatio:                number;      // fixed_rr multiplier
  partialExits:           PartialExit[];
  useMaxDailyLoss:        boolean;
  maxDailyLossPct:        number;
  maxConcurrentPositions: number;

  // ── Section 4: Code Preferences ────────────────────────
  outputLanguage:           OutputLanguage;
  // Pine Script
  includeTVAlerts:          boolean;
  alertMessage:             string;
  includeVisualLabels:      boolean;
  commissionPct:            number;
  // Python
  includeBacktraderClass:   boolean;
  includePandasTA:          boolean;
  includeQuantConnect:      boolean;
  brokerBridge:             BrokerBridge;
  // Code quality
  addInlineComments:        boolean;
  addBiasWarnings:          boolean;
  includePerformanceMetrics: boolean;
}

export const DEFAULT_CONFIG: StrategyConfig = {
  description:              "",
  instrumentType:           "forex",
  instrument:               "GBPUSD",
  timeframe:                "15m",
  useConfirmationTF:        false,
  confirmationTimeframe:    "1H",
  sessions:                 ["all"],
  riskModel:                "fixed_pct",
  riskPct:                  1,
  atrMultiplier:            1.5,
  atrPeriod:                14,
  kellyWinRate:             50,
  kellyRR:                  2,
  kellyFraction:            0,
  fixedLotSize:             0.1,
  stopType:                 "fixed_pips",
  stopPips:                 50,
  takeProfitType:           "fixed_rr",
  rrRatio:                  2,
  partialExits:             [{ rr: 1.5, pct: 50 }, { rr: 2, pct: 50 }],
  useMaxDailyLoss:          false,
  maxDailyLossPct:          5,
  maxConcurrentPositions:   1,
  outputLanguage:           "pine_script",
  includeTVAlerts:          true,
  alertMessage:             "{{ticker}} {{strategy.order.action}} at {{close}}",
  includeVisualLabels:      true,
  commissionPct:            0.05,
  includeBacktraderClass:   true,
  includePandasTA:          true,
  includeQuantConnect:      false,
  brokerBridge:             "none",
  addInlineComments:        true,
  addBiasWarnings:          true,
  includePerformanceMetrics: true,
};

export interface SavedStrategy {
  id:          string;
  user_id:     string;
  name:        string;
  description: string | null;
  language:    OutputLanguage;
  code:        string;
  instrument:  string | null;
  timeframe:   string | null;
  version:     number;
  is_favourite: boolean;
  created_at:  string;
  updated_at:  string;
}

export interface HealthCheckResult {
  trades:       number;
  winRate:      number;
  maxDrawdown:  number;
  profitFactor: number;
  equityCurve:  { date: string; value: number }[];
}

// ─── Shared types for the AI Trade Journal ───────────────────────────────────
// Used by all components, API routes, and subagents.

export type Direction       = 'BUY' | 'SELL';
export type TradeStatus     = 'OPEN' | 'CLOSED' | 'CANCELLED';
export type InstrumentType  = 'forex_major' | 'forex_minor' | 'index' | 'commodity' | 'crypto';
export type Session         = 'LONDON' | 'NEW_YORK' | 'ASIAN' | 'OVERLAP' | 'PRE_MARKET';
export type EmotionBefore   = 'CONFIDENT' | 'NERVOUS' | 'NEUTRAL' | 'FOMO' | 'REVENGE' | 'BORED';
export type EmotionDuring   = 'CALM' | 'ANXIOUS' | 'GREEDY' | 'DISCIPLINED' | 'PANICKED';
export type MarketCondition = 'TRENDING' | 'RANGING' | 'VOLATILE' | 'QUIET';
export type ScannerBias     = 'BULLISH' | 'BEARISH' | 'NEUTRAL';
export type PropPhase       = 'CHALLENGE' | 'FUNDED' | 'SCALING';
export type VerdictType     = 'GOOD_PROCESS' | 'POOR_PROCESS' | 'MIXED' | 'REVIEW_NEEDED';
export type PatternFlag     = 'EARLY_EXIT' | 'REVENGE_TRADE' | 'FOMO_ENTRY' | 'STOP_MOVED' | 'OVERSIZED' | string;

export interface TradeEntry {
  id:                      string;
  user_id:                 string;
  created_at:              string;
  updated_at:              string;

  // TRADE CORE
  symbol:                  string;
  instrument_type:         InstrumentType;
  direction:               Direction;
  status:                  TradeStatus;

  // EXECUTION
  entry_price:             number;
  exit_price:              number | null;
  stop_loss:               number;
  take_profit:             number | null;
  position_size_lots:      number;

  // CALCULATED
  risk_amount:             number | null;
  risk_percent:            number | null;
  rr_planned:              number | null;
  rr_achieved:             number | null;
  pnl_amount:              number | null;
  pnl_percent:             number | null;
  pips_gained:             number | null;

  // TIMING
  entry_time:              string;
  exit_time:               string | null;
  session:                 Session | null;
  trading_day:             string;   // date string "YYYY-MM-DD"
  duration_minutes:        number | null;

  // CONTEXT
  atr_at_entry:            number | null;
  spread_at_entry:         number | null;
  vix_at_entry:            number | null;
  dxy_at_entry:            number | null;
  setup_score_at_entry:    number | null;
  scanner_bias_at_entry:   ScannerBias | null;

  // TRADER TAGS
  setup_type:              string | null;
  confluences:             string[] | null;
  mistakes:                string[] | null;
  emotions_before:         EmotionBefore | null;
  emotions_during:         EmotionDuring | null;
  market_conditions:       MarketCondition | null;

  // NOTES
  pre_trade_notes:         string | null;
  post_trade_notes:        string | null;
  rules_followed:          boolean | null;
  checklist_completed:     boolean | null;

  // SCREENSHOTS
  chart_screenshot_url:    string | null;

  // AI FIELDS
  ai_verdict:              string | null;  // JSON-stringified ParsedAiVerdict
  ai_verdict_generated_at: string | null;
  ai_tags_auto:            string[] | null;

  // PROP FIRM
  prop_firm:               string | null;
  prop_account_id:         string | null;
  prop_phase:              PropPhase | null;
}

export interface ParsedAiVerdict {
  verdict:          VerdictType;
  score:            number;           // 0-100 process quality
  headline:         string;
  what_went_well:   string;
  what_to_improve:  string;
  key_lesson:       string;
  pattern_flag:     PatternFlag | null;
}

export interface WeeklyReviewData {
  week_headline:          string;
  overall_grade:          'A' | 'B' | 'C' | 'D';
  pnl_summary:            string;
  what_worked:            string[];
  what_didnt:             string[];
  pattern_of_week:        string;
  one_focus_for_next_week: string;
  momentum:               'IMPROVING' | 'STABLE' | 'DECLINING';
}

export interface WeeklyReview {
  id:           string;
  user_id:      string;
  week:         string;
  week_start:   string;
  week_end:     string;
  content:      string;   // JSON-stringified WeeklyReviewData
  generated_at: string;
  trade_count:  number | null;
  pnl_amount:   number | null;
}

// ─── Chat message for AI Coach ────────────────────────────────────────────────
export interface ChatMessage {
  role:    'user' | 'assistant';
  content: string;
}

// ─── Date range filter ────────────────────────────────────────────────────────
export type DateRangePreset = 'today' | 'week' | 'month' | 'quarter' | 'all' | 'custom';
export interface DateRange {
  preset: DateRangePreset;
  from:   string | null;   // ISO date
  to:     string | null;   // ISO date
}

// ─── View types ───────────────────────────────────────────────────────────────
export type JournalView = 'calendar' | 'log' | 'analytics' | 'coach' | 'weekly';

// ─── Analytics helpers ────────────────────────────────────────────────────────
export interface SetupStat {
  setup:       string;
  trades:      number;
  wins:        number;
  winRate:     number;
  avgRR:       number;
  totalPnL:    number;
  bestTrade:   number;
  worstTrade:  number;
}

export interface ConfluenceStat {
  tag:         string;
  uses:        number;
  wins:        number;
  winRate:     number;
  avgPnL:      number;
  winShare:    number;   // % of all winning trades that had this confluence
}

export interface EmotionStat {
  emotion:   EmotionBefore;
  trades:    number;
  wins:      number;
  winRate:   number;
  avgPnL:    number;
}

export interface InstrumentStat {
  symbol:      string;
  trades:      number;
  wins:        number;
  winRate:     number;
  avgPnL:      number;
  totalPnL:    number;
  recommendation: 'keep' | 'reduce' | 'stop';
}

// ─── CSV import ───────────────────────────────────────────────────────────────
export interface CsvRow {
  [key: string]: string;
}

export interface ImportedTrade extends Partial<Omit<TradeEntry, 'id' | 'user_id' | 'created_at' | 'updated_at'>> {
  _csvRow?: number;
  _valid?: boolean;
  _issues?: string[];
}

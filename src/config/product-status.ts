/**
 * Single Source of Truth: Product Status Registry
 *
 * All feature/tool status badges (Beta, Released, Planned, etc.) MUST
 * reference this file rather than hardcoded strings. This ensures consistent
 * messaging across pricing tables, tool cards, and marketing pages.
 *
 * @see /methodology/backtesting-engine for the backtester claim evidence card
 */

export type ProductStatusId =
  | "released"
  | "beta"
  | "early_access"
  | "planned"
  | "deprecated";

export interface ProductStatus {
  id: ProductStatusId;
  label: string;
  /** Short description shown in tooltips / methodology cross-references */
  description: string;
  /** Hex colour for badge background (use CSS vars where possible) */
  color: string;
  textColor: string;
}

export const STATUS: Record<ProductStatusId, ProductStatus> = {
  released: {
    id: "released",
    label: "Live",
    description: "Generally available to subscribers on the relevant plan.",
    color: "#14532d",
    textColor: "#86efac",
  },
  beta: {
    id: "beta",
    label: "Beta",
    description:
      "Actively developed and available to eligible subscribers. Results are hypothetical and subject to change. See methodology for limitations.",
    color: "#1e3a5f",
    textColor: "#93c5fd",
  },
  early_access: {
    id: "early_access",
    label: "Early Access",
    description:
      "Available to Edge+ subscribers for early testing. API and interface may change.",
    color: "#3b1f5e",
    textColor: "#d8b4fe",
  },
  planned: {
    id: "planned",
    label: "Planned",
    description: "On the public roadmap. Not yet available.",
    color: "#1c1917",
    textColor: "#a8a29e",
  },
  deprecated: {
    id: "deprecated",
    label: "Deprecated",
    description: "No longer actively maintained. Use the successor feature.",
    color: "#450a0a",
    textColor: "#fca5a5",
  },
};

/**
 * Product registry - maps each Drawdown tool/feature to its canonical status.
 * Update here first; pricing pages and tool cards consume this centrally.
 */
export const PRODUCT_STATUSES = {
  // === Analytics & Research ===
  investmentCentre: STATUS.released,
  marketCharts: STATUS.released,
  economicCalendar: STATUS.released,
  riskCalculator: STATUS.released,
  tradeJournal: STATUS.released,
  signalCentre: STATUS.released,

  // === AI Features ===
  aiConsensus: STATUS.released,
  aiJournalInsights: STATUS.released,

  // === Backtesting ===
  strategyBacktester: STATUS.beta,

  // === Planned / Upcoming ===
  automatedAlerts: STATUS.planned,
  portfolioTracker: STATUS.planned,
  socialJournal: STATUS.planned,
} as const;

export type ProductKey = keyof typeof PRODUCT_STATUSES;

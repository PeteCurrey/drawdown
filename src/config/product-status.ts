/**
 * Product Status Registry
 * =======================
 * All feature/tool status badges MUST reference this file.
 * Ensures consistent messaging across pricing tables, tool cards,
 * and marketing pages.
 *
 * Rules:
 *  - Only "released" capabilities appear in current-value checklists.
 *  - "beta" capabilities display a visible Beta label.
 *  - "in_development" capabilities appear only in roadmap sections.
 *  - "planned" capabilities do not have checkout value.
 *  - "legacy_grandfathered" products are not available for new purchase.
 *  - "retired" capabilities disappear from marketing pages.
 *
 * @see /methodology/backtesting-engine for the backtester claim evidence card
 */

export type ProductStatusId =
  | "released"
  | "beta"
  | "in_development"
  | "planned"
  | "legacy_grandfathered"
  | "retired";

export interface ProductStatus {
  id: ProductStatusId;
  label: string;
  /** Short description shown in tooltips / methodology cross-references */
  description: string;
  /** Hex colour for badge background */
  color: string;
  textColor: string;
  /**
   * If true, this status indicates the feature is NOT currently available
   * and must not appear in current-value membership checklists.
   */
  isUnavailable: boolean;
}

export const STATUS: Record<ProductStatusId, ProductStatus> = {
  released: {
    id: "released",
    label: "Live",
    description: "Generally available to subscribers on the relevant plan.",
    color: "#14532d",
    textColor: "#86efac",
    isUnavailable: false,
  },
  beta: {
    id: "beta",
    label: "Beta",
    description:
      "Actively developed and available to eligible subscribers. Results are hypothetical and subject to change. See methodology for limitations.",
    color: "#1e3a5f",
    textColor: "#93c5fd",
    isUnavailable: false,
  },
  in_development: {
    id: "in_development",
    label: "In Development",
    description:
      "Under active development. Not yet available. Not counted toward current membership value.",
    color: "#1c2a1c",
    textColor: "#86efac",
    isUnavailable: true,
  },
  planned: {
    id: "planned",
    label: "Planned",
    description:
      "On the public roadmap. Not yet available. Not counted toward current membership value.",
    color: "#1c1917",
    textColor: "#a8a29e",
    isUnavailable: true,
  },
  legacy_grandfathered: {
    id: "legacy_grandfathered",
    label: "Legacy",
    description:
      "No longer available for new purchase. Existing subscribers retain access while their subscription remains active.",
    color: "#1c1917",
    textColor: "#fbbf24",
    isUnavailable: true,
  },
  retired: {
    id: "retired",
    label: "Retired",
    description: "No longer available.",
    color: "#450a0a",
    textColor: "#fca5a5",
    isUnavailable: true,
  },
};

/**
 * Product registry — maps each Drawdown tool/feature to its canonical status.
 * Update here first; pricing pages and tool cards consume this centrally.
 *
 * A product CANNOT be "released" on pricing and "planned" on the course roadmap.
 * A tool CANNOT appear as included if the route is unavailable or non-functional.
 */
export const PRODUCT_STATUSES = {
  // === Analytics & Research ===
  investmentCentre:      STATUS.released,         // included in Edge + Floor
  marketCharts:          STATUS.released,
  economicCalendar:      STATUS.released,
  riskCalculator:        STATUS.released,
  tradeJournal:          STATUS.released,

  // === Market Intelligence ===
  marketIntelligenceHub: STATUS.released,         // consumer name for signal centre capability
  signalCentre:          STATUS.legacy_grandfathered, // internal key — no new purchase

  // === AI Features ===
  aiConsensus:           STATUS.released,
  aiJournalInsights:     STATUS.released,

  // === Backtesting ===
  strategyBacktester:    STATUS.beta,

  // === In Development ===
  monteCarloTools:       STATUS.in_development,
  advancedPerformanceAnalytics: STATUS.in_development,

  // === Planned ===
  automatedAlerts:       STATUS.planned,
  portfolioTracker:      STATUS.planned,
  socialJournal:         STATUS.planned,
  pineScriptResources:   STATUS.planned,
} as const;

export type ProductKey = keyof typeof PRODUCT_STATUSES;

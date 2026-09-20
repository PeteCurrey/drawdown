// src/lib/lobby-constants.ts
// Pure constants, types, and URL slug mappings for The Lobby.
// Safe for both client and server components (no DB or server runtime imports).

import type { 
  LobbyCategory, 
  LobbyArticleType 
} from "../types/lobby";

export const LOBBY_CATEGORIES: LobbyCategory[] = [
  'MARKETS',
  'BROKERS',
  'PROP FIRMS',
  'PLATFORMS',
  'MACRO',
  'REGULATION',
  'TRADING TECHNOLOGY',
  'TRADES',
  'DRAWDOWN',
  'EDUCATION',
  'INDUSTRY',
  'OTHER'
];

export const LOBBY_ARTICLE_TYPES: LobbyArticleType[] = [
  'NEWS',
  'ANALYSIS',
  'EXPLAINER',
  'INDUSTRY UPDATE',
  'TRADE FEATURE',
  'PLATFORM SPOTLIGHT',
  'BROKER WATCH',
  'PROP FIRM WATCH',
  'DRAWDOWN FEATURE'
];

/**
 * Converts a controlled category to an SEO-friendly URL slug.
 */
export function categoryToSlug(category: LobbyCategory): string {
  return category.toLowerCase().replace(/\s+/g, '-');
}

/**
 * Resolves a URL slug to its controlled LobbyCategory, or null if invalid.
 */
export function slugToCategory(slug: string): LobbyCategory | null {
  const normalised = slug.toLowerCase().trim();
  const match = LOBBY_CATEGORIES.find(
    cat => categoryToSlug(cat) === normalised
  );
  return match || null;
}

// ─── Real Drawdown Tool & Entity Reference Catalogues ────────────────────────
export interface ToolReference {
  slug: string;
  name: string;
  href: string;
  description: string;
}

export const DRAWDOWN_TOOLS: Record<string, ToolReference> = {
  "position-size-calculator": {
    slug: "position-size-calculator",
    name: "Position Size Calculator",
    href: "/tools/position-size-calculator",
    description: "Exact lot sizing, invalidation distance & cash risk standardisation.",
  },
  "drawdown-recovery-calculator": {
    slug: "drawdown-recovery-calculator",
    name: "Drawdown Recovery Calculator",
    href: "/tools/drawdown-recovery-calculator",
    description: "Loss asymmetry analysis & break-even trade modeling.",
  },
  "pip-value-calculator": {
    slug: "pip-value-calculator",
    name: "Pip Value Calculator",
    href: "/tools/pip-value-calculator",
    description: "Multi-currency pip and tick values across account currencies.",
  },
  "risk-of-ruin-calculator": {
    slug: "risk-of-ruin-calculator",
    name: "Risk of Ruin Calculator",
    href: "/tools/risk-of-ruin-calculator",
    description: "Statistical probability of catastrophic capital depletion.",
  },
  "forex-market-hours": {
    slug: "forex-market-hours",
    name: "Forex Market Hours",
    href: "/tools/forex-market-hours",
    description: "Live session clock with London & New York liquidity overlap radar.",
  },
  "signal-centre": {
    slug: "signal-centre",
    name: "Signal Centre",
    href: "/signal-centre",
    description: "AI consensus decision support across Claude, GPT-4o, and Grok.",
  },
  "ai-trade-journal": {
    slug: "ai-trade-journal",
    name: "AI Trade Journal",
    href: "/tools/ai-trade-journal",
    description: "Execution audit and behavioural bias detection.",
  }
};

export interface EntityReference {
  slug: string;
  name: string;
  href: string;
  type: 'broker' | 'prop_firm' | 'platform';
}

export const DRAWDOWN_ENTITIES: Record<string, EntityReference> = {
  // Brokers
  "pepperstone": { slug: "pepperstone", name: "Pepperstone", href: "/brokers/pepperstone", type: "broker" },
  "ig-markets": { slug: "ig-markets", name: "IG Markets", href: "/brokers/ig-markets", type: "broker" },
  "ic-markets": { slug: "ic-markets", name: "IC Markets", href: "/brokers/ic-markets", type: "broker" },
  // Prop Firms
  "ftmo": { slug: "ftmo", name: "FTMO", href: "/prop-firms/ftmo", type: "prop_firm" },
  "the5ers": { slug: "the5ers", name: "The5ers", href: "/prop-firms/the5ers", type: "prop_firm" },
  "funding-pips": { slug: "funding-pips", name: "Funding Pips", href: "/prop-firms/funding-pips", type: "prop_firm" },
  // Platforms
  "tradingview": { slug: "tradingview", name: "TradingView", href: "/tools/tradingview", type: "platform" },
  "metatrader-5": { slug: "metatrader-5", name: "MetaTrader 5", href: "/tools", type: "platform" },
  "ctrader": { slug: "ctrader", name: "cTrader", href: "/tools", type: "platform" }
};

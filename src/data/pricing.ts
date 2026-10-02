/**
 * Pricing data helpers
 * ====================
 * All prices, features, and tier data are derived from the central
 * commercial catalogue. Do NOT hardcode prices here.
 *
 * Regional pricing uses multipliers applied to GBP base prices.
 * The source of truth for GBP prices is src/data/commercial-catalogue.ts.
 */

import { Region } from "@/lib/seo/hreflang";
import {
  COMMERCIAL_CATALOGUE,
  CommercialProduct,
  calculateAnnualSavingPence,
  annualSavingDescription,
  formatGBP,
  getMembershipTiers,
} from "@/data/commercial-catalogue";
import { STATUS } from "@/config/product-status";

// ─── Re-export helpers for backward compatibility ─────────────────────────────
export { calculateAnnualSavingPence, annualSavingDescription, formatGBP };

// ─── Currency symbol map ──────────────────────────────────────────────────────
export const REGION_CURRENCY_SYMBOL: Record<Region, string> = {
  uk: "£",
  us: "$",
  au: "A$",
  sg: "S$",
  hk: "HK$",
  ca: "C$",
  de: "€",
  ae: "AED ",
  in: "₹",
  my: "RM ",
  ph: "₱",
};

// ─── Regional multipliers (approximate local equivalents of GBP prices) ───────
// Foundation GBP base: £49/mo, £490/yr
// Edge GBP base: £99/mo, £990/yr
// Floor GBP base: £299/mo
const REGION_MULTIPLIERS: Record<Region, number> = {
  uk: 1.0,
  us: 1.22,
  au: 1.63,
  sg: 1.63,
  hk: 9.64,
  ca: 1.63,
  de: 1.22,
  ae: 4.44,
  in: 104.89,
  my: 5.76,
  ph: 68.0,
};

// ─── Standalone PDF prices per region ────────────────────────────────────────
// Approximate local equivalents of £49 / £79 / £59 / £129
export const REGION_PDF_PRICES: Record<
  Region,
  { propKit: string; howTo: string; edge: string; bundle: string }
> = {
  uk:  { propKit: "£49",     howTo: "£79",     edge: "£59",     bundle: "£129" },
  us:  { propKit: "$59",     howTo: "$99",     edge: "$74",     bundle: "$159" },
  au:  { propKit: "A$89",    howTo: "A$149",   edge: "A$109",   bundle: "A$239" },
  sg:  { propKit: "S$79",    howTo: "S$129",   edge: "S$99",    bundle: "S$209" },
  hk:  { propKit: "HK$459",  howTo: "HK$749",  edge: "HK$569",  bundle: "HK$1,239" },
  ca:  { propKit: "C$79",    howTo: "C$129",   edge: "C$99",    bundle: "C$209" },
  de:  { propKit: "€55",     howTo: "€89",     edge: "€65",     bundle: "€149" },
  ae:  { propKit: "AED 215", howTo: "AED 349", edge: "AED 259", bundle: "AED 569" },
  in:  { propKit: "₹4,899",  howTo: "₹7,899",  edge: "₹5,899",  bundle: "₹12,899" },
  my:  { propKit: "RM 249",  howTo: "RM 399",  edge: "RM 299",  bundle: "RM 659" },
  ph:  { propKit: "₱2,799",  howTo: "₱4,599",  edge: "₱3,299",  bundle: "₱7,199" },
};

// ─── PricingTier shape (for backward compatibility with pricing components) ────
export interface PricingTier {
  id: string;
  name: string;
  shortName: string;
  tierKey: string;
  /** Monthly price in local currency (0 for Free) */
  monthlyPrice: number;
  /** Annual price in local currency (total for year, 0 if no annual option) */
  annualPrice: number;
  /** Annual saving in local currency */
  annualSaving: number;
  /** Description of the annual saving (e.g. "Two months at no additional charge") */
  annualSavingDescription: string;
  description: string;
  buttonText: string;
  highlight: boolean;
  applicationRequired: boolean;
  hasAnnualOption: boolean;
  /** Released features shown in the checklist */
  releasedFeatures: FeatureRow[];
  /** Planned features shown only in roadmap sections */
  plannedFeatures: string[];
  accentColor: string;
  borderAccent: string;
  /** Permanent entitlement keys granted with annual plan */
  annualPermanentEntitlements: string[];
  capacity?: number;
  badge?: string;
  features?: FeatureRow[];
}

export interface FeatureRow {
  name: string;
  included: boolean;
  status?: "released" | "beta" | "in_development" | "planned";
  /** Annual plan only — shown with a different indicator */
  annualOnly?: boolean;
  /** Short note (e.g. "Beta") */
  note?: string;
  badge?: string;
  tierNote?: string;
  accent?: boolean;
}

// ─── GBP tier definitions ─────────────────────────────────────────────────────
// All feature descriptions and entitlement logic come from the catalogue.
// This layer only handles UI presentation.

export const GBP_TIERS: PricingTier[] = [
  {
    id: "free",
    name: "Drawdown Free",
    shortName: "Free",
    tierKey: "free",
    monthlyPrice: 0,
    annualPrice: 0,
    annualSaving: 0,
    annualSavingDescription: "",
    description: "Start here. No card required.",
    buttonText: "Start Free",
    highlight: false,
    applicationRequired: false,
    hasAnnualOption: false,
    releasedFeatures: [
      { name: "Phase 1: Ground Zero (introductory lessons)", included: true },
      { name: "Manual trade journal", included: true },
      { name: "Position size calculator", included: true },
      { name: "Risk/reward calculator", included: true },
      { name: "Drawdown and recovery calculator", included: true },
      { name: "Selected market articles and research", included: true },
      { name: "Weekly email briefing", included: true },
      { name: "Public broker and prop-firm research", included: true },
    ],
    plannedFeatures: [],
    accentColor: "rgba(148, 163, 184, 0.06)",
    borderAccent: "#94a3b8",
    annualPermanentEntitlements: [],
    capacity: undefined,
  },
  {
    id: "core",
    name: "Drawdown Core Membership",
    shortName: "Core",
    tierKey: "core",
    monthlyPrice: 24.99,
    annualPrice: 0,
    annualSaving: 0,
    annualSavingDescription: "",
    description:
      "One subscription. Complete access to every released platform tool, quantitative scanner, risk calculator, and curriculum phase.",
    buttonText: "Join Core Membership",
    highlight: true,
    applicationRequired: false,
    hasAnnualOption: false, // Phase 1 is monthly-only (£24.99/mo)
    releasedFeatures: [
      { name: "Everything in Free", included: true },
      { name: "Complete curriculum access (all released phases)", included: true },
      { name: "Quantitative Technical Scanner & Market Screener", included: true },
      { name: "Live Signal Centre feeds & alerts", included: true },
      { name: "Institutional Investment Centre & macro risk engine", included: true },
      { name: "AI-assisted Trade Journal & pattern review", included: true },
      { name: "Strategy Backtester (Beta)", included: true, status: "beta", note: "Beta" },
      { name: "Algo Strategy Builder Pine Script / Python export", included: true },
      { name: "Market Intelligence Hub, The Wire & Grok sentiment", included: true },
      { name: "Watchlists & custom saved screens", included: true },
      { name: "Private member community & events access", included: true },
      { name: "Priority support desk", included: true },
    ],
    plannedFeatures: [
      "Monte Carlo risk simulator (in development)",
      "Automated webhook order execution (planned)",
    ],
    accentColor: "rgba(200, 241, 53, 0.08)",
    borderAccent: "#C8F135",
    annualPermanentEntitlements: [],
    capacity: undefined,
  },
  // Legacy Tiers — Retained for DB, schema & backward compatibility only.
  // Not displayed in public customer-facing UI.
  {
    id: "foundation",
    name: "Foundation (Legacy)",
    shortName: "Foundation",
    tierKey: "foundation",
    monthlyPrice: 49,
    annualPrice: 490,
    annualSaving: 98,
    annualSavingDescription: "Two months at no additional charge",
    description:
      "Legacy tier. Retained for account compatibility.",
    buttonText: "Start Foundation",
    highlight: false,
    applicationRequired: false,
    hasAnnualOption: true,
    releasedFeatures: [
      { name: "Everything in Free", included: true },
      { name: "Manual trade journal", included: true },
      { name: "Position sizing and exposure tools", included: true },
      { name: "Technical charting access", included: true },
      { name: "Market Intelligence Hub & The Wire", included: true },
    ],
    plannedFeatures: [],
    accentColor: "rgba(99, 102, 241, 0.08)",
    borderAccent: "#6366f1",
    annualPermanentEntitlements: [],
    capacity: undefined,
  },
  {
    id: "edge",
    name: "Edge (Legacy)",
    shortName: "Edge",
    tierKey: "edge",
    monthlyPrice: 99,
    annualPrice: 990,
    annualSaving: 198,
    annualSavingDescription: "Two months at no additional charge",
    description:
      "Legacy tier. Retained for account compatibility.",
    buttonText: "Join Edge",
    highlight: false,
    applicationRequired: false,
    hasAnnualOption: true,
    releasedFeatures: [
      { name: "Everything in Foundation", included: true },
      { name: "Investment Centre access", included: true },
      { name: "AI-assisted journal review", included: true },
      { name: "Strategy backtester", included: true, status: "beta", note: "Beta" },
    ],
    plannedFeatures: [],
    accentColor: "rgba(6, 182, 212, 0.08)",
    borderAccent: "#0891b2",
    annualPermanentEntitlements: [],
    capacity: undefined,
  },
  {
    id: "floor",
    name: "The Floor (Legacy)",
    shortName: "Floor",
    tierKey: "floor",
    monthlyPrice: 299,
    annualPrice: 0,
    annualSaving: 0,
    annualSavingDescription: "",
    description:
      "Legacy tier. Retained for account compatibility.",
    buttonText: "Apply for The Floor",
    highlight: false,
    applicationRequired: false,
    hasAnnualOption: false,
    releasedFeatures: [
      { name: "Everything in Edge", included: true },
      { name: "All released curriculum", included: true },
      { name: "Founder reviews", included: true },
    ],
    plannedFeatures: [],
    accentColor: "rgba(200, 241, 53, 0.06)",
    borderAccent: "#C8F135",
    annualPermanentEntitlements: [],
    capacity: 20,
  },
];

// ─── Feature helpers ──────────────────────────────────────────────────────────
export function GET_CORE_FEATURES() {
  return GBP_TIERS.find((t) => t.id === "core")?.releasedFeatures || [];
}

export function GET_DEFAULT_FEATURES() {
  return GET_CORE_FEATURES();
}

export function GET_EDGE_FEATURES() {
  return GET_CORE_FEATURES();
}

export function GET_FLOOR_FEATURES() {
  return GET_CORE_FEATURES();
}

// ─── Regional pricing helper ──────────────────────────────────────────────────
// Applies regional multipliers to GBP base prices.
// Returns tiers with localised prices for display only.
// Checkout always uses Stripe price IDs from environment variables.

function roundToNearest(value: number, nearest: number): number {
  return Math.round(value / nearest) * nearest;
}

function mapFeatures(features: FeatureRow[]): FeatureRow[] {
  return features.map((f) => ({
    ...f,
    tierNote: f.tierNote || (f.annualOnly ? "Annual plan" : f.note),
    badge: f.badge || (f.status === "beta" ? "Beta" : f.status === "in_development" ? "In development" : undefined),
    accent: f.accent !== undefined ? f.accent : (f.status === "beta" || f.status === "in_development"),
  }));
}

export function getRegionalTiers(region: Region): PricingTier[] {
  const tiers = region === "uk" ? GBP_TIERS : GBP_TIERS.map((tier) => {
    const multiplier = REGION_MULTIPLIERS[region] ?? 1.0;
    if (tier.monthlyPrice === 0) return tier; // Free tier unchanged
    const localMonthly = roundToNearest(tier.monthlyPrice * multiplier, 1);
    const localAnnual = tier.hasAnnualOption
      ? roundToNearest(localMonthly * 10, 10) // 10 months = 2 months free
      : 0;
    const localSaving = tier.hasAnnualOption ? localMonthly * 2 : 0;
    return {
      ...tier,
      monthlyPrice: localMonthly,
      annualPrice: localAnnual,
      annualSaving: localSaving,
      annualSavingDescription: tier.hasAnnualOption
        ? "Two months at no additional charge"
        : "",
    };
  });

  return tiers.map((tier) => ({
    ...tier,
    features: mapFeatures(tier.releasedFeatures),
  }));
}

// ─── Comparison matrix data ───────────────────────────────────────────────────

export type MatrixValue =
  | "included"
  | "not_included"
  | "beta"
  | "in_development"
  | "annual_only"
  | "permanent_entitlement"
  | "active_subscription";

export interface MatrixRow {
  feature: string;
  free: MatrixValue;
  foundation: MatrixValue;
  edge: MatrixValue;
  floor: MatrixValue;
  note?: string;
}

export const COMPARISON_MATRIX: { group: string; rows: MatrixRow[] }[] = [
  {
    group: "Education",
    rows: [
      {
        feature: "Phase 1: Ground Zero",
        free: "included",
        foundation: "included",
        edge: "included",
        floor: "included",
      },
      {
        feature: "Phases 2–4 (Foundation curriculum)",
        free: "not_included",
        foundation: "in_development",
        edge: "in_development",
        floor: "in_development",
        note: "Phases added as released",
      },
      {
        feature: "Phases 5–10 (Edge curriculum)",
        free: "not_included",
        foundation: "not_included",
        edge: "in_development",
        floor: "in_development",
        note: "Phases added as released",
      },
      {
        feature: "Phases 11–13 (Floor curriculum)",
        free: "not_included",
        foundation: "not_included",
        edge: "not_included",
        floor: "in_development",
        note: "Phases added as released",
      },
    ],
  },
  {
    group: "Journal & Risk Workflow",
    rows: [
      {
        feature: "Manual trade journal",
        free: "included",
        foundation: "included",
        edge: "included",
        floor: "included",
      },
      {
        feature: "Position size calculator",
        free: "included",
        foundation: "included",
        edge: "included",
        floor: "included",
      },
      {
        feature: "Risk/reward calculator",
        free: "included",
        foundation: "included",
        edge: "included",
        floor: "included",
      },
      {
        feature: "Drawdown and recovery calculator",
        free: "included",
        foundation: "included",
        edge: "included",
        floor: "included",
      },
      {
        feature: "AI-assisted journal review",
        free: "not_included",
        foundation: "not_included",
        edge: "included",
        floor: "included",
      },
    ],
  },
  {
    group: "Market Intelligence",
    rows: [
      {
        feature: "Selected market articles",
        free: "included",
        foundation: "included",
        edge: "included",
        floor: "included",
      },
      {
        feature: "Market Intelligence Hub & The Wire",
        free: "not_included",
        foundation: "included",
        edge: "included",
        floor: "included",
      },
      {
        feature: "Advanced market and macro briefings",
        free: "not_included",
        foundation: "not_included",
        edge: "included",
        floor: "included",
      },
    ],
  },
  {
    group: "Analysis & Testing",
    rows: [
      {
        feature: "Technical charting access",
        free: "not_included",
        foundation: "included",
        edge: "included",
        floor: "included",
      },
      {
        feature: "Investment Centre",
        free: "not_included",
        foundation: "not_included",
        edge: "included",
        floor: "included",
      },
      {
        feature: "Strategy backtester",
        free: "not_included",
        foundation: "not_included",
        edge: "beta",
        floor: "beta",
        note: "Beta — see methodology for limitations",
      },
      {
        feature: "Monte Carlo simulation tools",
        free: "not_included",
        foundation: "not_included",
        edge: "in_development",
        floor: "in_development",
      },
      {
        feature: "Automated market alerts",
        free: "not_included",
        foundation: "not_included",
        edge: "in_development",
        floor: "in_development",
      },
    ],
  },
  {
    group: "Downloads",
    rows: [
      {
        feature: "Prop Firm Survival Kit (permanent)",
        free: "not_included",
        foundation: "annual_only",
        edge: "annual_only",
        floor: "permanent_entitlement",
        note: "Active subscription access for monthly members; permanent for annual and Floor",
      },
      {
        feature: "How to Trade Manual (permanent)",
        free: "not_included",
        foundation: "annual_only",
        edge: "annual_only",
        floor: "permanent_entitlement",
      },
      {
        feature: "The Edge Manual (permanent)",
        free: "not_included",
        foundation: "not_included",
        edge: "annual_only",
        floor: "permanent_entitlement",
      },
      {
        feature: "Deploy Your Algo mini-course",
        free: "not_included",
        foundation: "not_included",
        edge: "annual_only",
        floor: "permanent_entitlement",
      },
    ],
  },
  {
    group: "Community",
    rows: [
      {
        feature: "General community access",
        free: "not_included",
        foundation: "included",
        edge: "included",
        floor: "included",
      },
      {
        feature: "Private Floor community channel",
        free: "not_included",
        foundation: "not_included",
        edge: "not_included",
        floor: "included",
      },
    ],
  },
  {
    group: "Founder-Led Support",
    rows: [
      {
        feature: "Priority support queue",
        free: "not_included",
        foundation: "not_included",
        edge: "included",
        floor: "included",
      },
      {
        feature: "Onboarding and process-mapping call (30 min)",
        free: "not_included",
        foundation: "not_included",
        edge: "not_included",
        floor: "included",
      },
      {
        feature: "Founder-led group process review (monthly)",
        free: "not_included",
        foundation: "not_included",
        edge: "not_included",
        floor: "included",
      },
      {
        feature: "Individual process and journal review (quarterly)",
        free: "not_included",
        foundation: "not_included",
        edge: "not_included",
        floor: "included",
      },
    ],
  },
];

// ─── FAQ data ─────────────────────────────────────────────────────────────────

export interface FAQ {
  question: string;
  answer: string;
}

export const PRICING_FAQS: FAQ[] = [
  {
    question: "What is included in the £24.99/month Core Membership?",
    answer:
      "Drawdown Core Membership unlocks complete access to the core platform: the Quantitative Technical Scanner, Market Screener, Signal Centre feeds, Investment Centre macro analysis, AI Trade Journal, Strategy Backtester (Beta), Algo Strategy Builder export, Market Intelligence Hub, The Wire, watchlists, saved screens, and the full multi-phase curriculum. Everything you need to build and execute a disciplined trading process is included.",
  },
  {
    question: "Can I cancel my monthly membership?",
    answer:
      "Yes. There are no long-term contracts. You can cancel at any time directly from your account settings. Your access continues through the end of your current billing period.",
  },
  {
    question: "Is there an annual plan available?",
    answer:
      "For Phase 1, Drawdown Core Membership is available exclusively on a flexible monthly subscription at £24.99/month. We keep the barrier to entry low and commitment flexible.",
  },
  {
    question: "How do I get the Prop Firm Survival Kit?",
    answer:
      "The Prop Firm Survival Kit is completely free. You can download the 100-page evaluation blueprint, rule decoder, and position sizing sheets directly by entering your email — no credit card required.",
  },
  {
    question: "Are premium courses and PDF manuals included in Core?",
    answer:
      "Core Membership includes the complete core platform curriculum and tools. Advanced standalone courses (like Deploy Your Algo and the Institutional Accelerator) and Pete Currey's published trading manuals (How to Trade, The Edge Manual) are separate standalone purchases and are not bundled into the £24.99 subscription.",
  },
  {
    question: "Does Core Membership include 1-on-1 mentorship or financial advice?",
    answer:
      "No. Drawdown Trading is an educational and analytical software platform. Core Membership does not include personalized financial advice, trade signals, or individual mentorship. All tools are designed to support your own independent trading discipline.",
  },
  {
    question: "Is VAT included in the listed price?",
    answer:
      "All prices shown are inclusive of UK VAT where applicable. Your Stripe invoice will display the exact VAT breakdown for accounting purposes.",
  },
];

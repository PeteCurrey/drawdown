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
    id: "foundation",
    name: "Foundation",
    shortName: "Foundation",
    tierKey: "foundation",
    monthlyPrice: 49,
    annualPrice: 490,
    annualSaving: 98, // (49 × 12) − 490 = 588 − 490 = 98
    annualSavingDescription: "Two months at no additional charge",
    description:
      "For developing traders who need structured education, a risk framework and a repeatable trading-review process.",
    buttonText: "Start Foundation",
    highlight: false,
    applicationRequired: false,
    hasAnnualOption: true,
    releasedFeatures: [
      { name: "Everything in Free", included: true },
      {
        name: "Foundation curriculum: Phase 1 live; Phases 2–4 added as released",
        included: true,
        status: "in_development",
        note: "In development",
      },
      { name: "Manual trade journal", included: true },
      { name: "Position sizing and exposure tools", included: true },
      { name: "Technical charting access", included: true },
      { name: "Market Intelligence Hub & The Wire", included: true },
      { name: "General community access", included: true },
      {
        name: "Prop Firm Survival Kit (permanent download)",
        included: true,
        annualOnly: true,
        note: "Annual plan",
      },
      {
        name: "How to Trade Manual (permanent download)",
        included: true,
        annualOnly: true,
        note: "Annual plan",
      },
    ],
    plannedFeatures: [],
    accentColor: "rgba(99, 102, 241, 0.08)",
    borderAccent: "#6366f1",
    annualPermanentEntitlements: [
      "prop_firm_survival_kit_download",
      "how_to_trade_download",
    ],
    capacity: undefined,
  },
  {
    id: "edge",
    name: "Edge",
    shortName: "Edge",
    tierKey: "edge",
    monthlyPrice: 99,
    annualPrice: 990,
    annualSaving: 198, // (99 × 12) − 990 = 1188 − 990 = 198
    annualSavingDescription: "Two months at no additional charge",
    description:
      "For active traders who require advanced analysis, structured strategy testing and deeper performance-review tools.",
    buttonText: "Join Edge",
    highlight: true,
    applicationRequired: false,
    hasAnnualOption: true,
    releasedFeatures: [
      { name: "Everything in Foundation", included: true },
      {
        name: "Edge curriculum: Phases 5–10 as released",
        included: true,
        status: "in_development",
        note: "In development",
      },
      { name: "Investment Centre access", included: true },
      { name: "AI-assisted journal review", included: true },
      {
        name: "Strategy backtester",
        included: true,
        status: "beta",
        note: "Beta",
      },
      { name: "Advanced market and macro briefings", included: true },
      { name: "Priority support queue", included: true },
      {
        name: "Prop Firm Survival Kit (permanent download)",
        included: true,
        annualOnly: true,
        note: "Annual plan",
      },
      {
        name: "How to Trade Manual (permanent download)",
        included: true,
        annualOnly: true,
        note: "Annual plan",
      },
      {
        name: "The Edge Manual (permanent download)",
        included: true,
        annualOnly: true,
        note: "Annual plan",
      },
      {
        name: "Deploy Your Algo mini-course",
        included: true,
        annualOnly: true,
        note: "Annual plan",
      },
    ],
    plannedFeatures: [
      "Monte Carlo simulation tools (in development)",
      "Automated market alerts (planned)",
      "Pine Script strategy development resources (planned)",
    ],
    accentColor: "rgba(6, 182, 212, 0.08)",
    borderAccent: "#0891b2",
    annualPermanentEntitlements: [
      "prop_firm_survival_kit_download",
      "how_to_trade_download",
      "edge_manual_download",
      "deploy_your_algo_access",
    ],
    capacity: undefined,
  },
  {
    id: "floor",
    name: "The Floor",
    shortName: "Floor",
    tierKey: "floor",
    monthlyPrice: 299,
    annualPrice: 0, // No public annual checkout at launch
    annualSaving: 0,
    annualSavingDescription: "",
    description:
      "For serious traders who require the complete released platform plus defined access to founder-led process reviews.",
    buttonText: "Apply for The Floor",
    highlight: false,
    applicationRequired: false, // No application required for direct checkout, but capacity-enforced
    hasAnnualOption: false, // Annual arrangements offered only after application + manual approval
    releasedFeatures: [
      { name: "Everything in Edge", included: true },
      { name: "All released curriculum", included: true },
      { name: "Investment Centre access", included: true },
      { name: "Private Floor community channel", included: true },
      { name: "Onboarding and process-mapping call (30 min)", included: true },
      {
        name: "Founder-led group trading-process review (monthly)",
        included: true,
      },
      {
        name: "Individual process and journal review (quarterly, 30 min)",
        included: true,
      },
      {
        name: "Priority support — target 2 UK business day response",
        included: true,
      },
      { name: "Early access to selected new tools", included: true },
      {
        name: "All three premium manual permanent downloads",
        included: true,
      },
      { name: "Deploy Your Algo mini-course", included: true },
    ],
    plannedFeatures: [],
    accentColor: "rgba(200, 241, 53, 0.06)",
    borderAccent: "#C8F135",
    annualPermanentEntitlements: [
      "prop_firm_survival_kit_download",
      "how_to_trade_download",
      "edge_manual_download",
      "deploy_your_algo_access",
    ],
    capacity: 20,
  },
];

// ─── Backward compatibility feature helpers ───────────────────────────────────
export function GET_DEFAULT_FEATURES() {
  return GBP_TIERS.find((t) => t.id === "foundation")?.releasedFeatures || [];
}

export function GET_EDGE_FEATURES() {
  return GBP_TIERS.find((t) => t.id === "edge")?.releasedFeatures || [];
}

export function GET_FLOOR_FEATURES() {
  return GBP_TIERS.find((t) => t.id === "floor")?.releasedFeatures || [];
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
    question: "Can I cancel my monthly membership?",
    answer:
      "Yes. You can cancel at any time from your account billing page. Your access continues until the end of the current billing period. No refund is issued for the remaining portion of the period on cancellation.",
  },
  {
    question: "What happens to my downloads if I cancel?",
    answer:
      "Files you have permanently purchased or earned through an annual plan remain yours. Active-membership library access — where you could view manuals inside the platform while subscribed — ends when your subscription ends. If you are unsure which category applies to your downloads, check your account page under Permanent Purchases.",
  },
  {
    question: "Are the manuals included with an annual plan mine to keep?",
    answer:
      "Yes. Permanent download entitlements granted through an annual Foundation or Edge plan are yours to keep regardless of whether you subsequently cancel or change your plan.",
  },
  {
    question: "Do planned features count toward the membership price?",
    answer:
      "No. Drawdown's pricing reflects only features that are currently available. Features listed under 'Coming to Edge' or on the roadmap are not part of the current membership value and do not justify the current price.",
  },
  {
    question: "What happens if I upgrade mid-month?",
    answer:
      "Stripe prorates your billing automatically. You pay only for the days remaining in the current period at the new tier price. Your entitlements update immediately after the upgrade payment is confirmed.",
  },
  {
    question: "Can I receive credit for a manual I already purchased?",
    answer:
      "Yes. If you purchase a standalone manual and then upgrade to an annual Foundation or annual Edge plan within 30 days, the amount you paid for the manual is credited against the annual plan price at checkout. Credit applies once, cannot exceed the plan price, and cannot be stacked with other promotional credits.",
  },
  {
    question: "Is The Floor financial advice?",
    answer:
      "No. Floor founder access covers educational process reviews, journal feedback, platform guidance and general trading-discipline discussions. It does not include personalised financial advice, trade instructions, portfolio management, tax advice, legal advice or guaranteed response during live market events.",
  },
  {
    question: "Is the Accelerator a membership?",
    answer:
      "No. The Accelerator is a separate one-time cohort enrolment. It includes 12 months of Edge membership starting on the cohort commencement date, but it is not a recurring subscription. Enrolment requires an application and manual acceptance.",
  },
  {
    question: "What happens if the Accelerator cohort is full?",
    answer:
      "When the 15-seat cap is reached, the checkout is closed and a waitlist opens automatically. You can join the waitlist to be notified when the next cohort opens for applications.",
  },
  {
    question: "What happens to legacy Signal Centre subscriptions?",
    answer:
      "Existing Signal Centre subscribers keep their access for as long as their subscription remains active. Their price will not increase automatically. Signal Centre is no longer available for new purchase. If you wish, you can upgrade to Foundation, which includes the relevant market intelligence plus education and tools. Once a legacy Signal Centre subscription is cancelled, it cannot be restarted under the legacy plan.",
  },
  {
    question: "Is VAT included in the listed prices?",
    answer:
      "All prices shown are inclusive of UK VAT where applicable. Your invoice will show the VAT breakdown.",
  },
  {
    question: "How does the Accelerator instalment plan work?",
    answer:
      "The Accelerator instalment option is three monthly payments of £550, totalling £1,650 in all. This is £150 more than the single payment of £1,500. Both the total cost and the saving from paying in full are displayed at checkout before you confirm.",
  },
];

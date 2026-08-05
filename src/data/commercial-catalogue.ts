/**
 * Drawdown Commercial Catalogue
 * ================================
 * Single source of truth for every product, price, status and entitlement
 * across the Drawdown platform.
 *
 * Rules:
 *  - Every pricing page, course gate, dashboard upsell and checkout MUST
 *    read from this file — no hardcoded prices elsewhere.
 *  - Stripe price IDs are read from environment variables. Never commit real
 *    price IDs here.
 *  - Do not edit existing Stripe prices. Create new price objects and
 *    set the env var to the new ID.
 *  - Annual saving is calculated programmatically. Never hardcode a saving
 *    amount or percentage.
 *  - Planned / in_development features must NOT appear in current-value
 *    checklists. Use `plannedFeatures` only in roadmap sections.
 */

// ─── Types ───────────────────────────────────────────────────────────────────

export type CommercialProductType =
  | "free_membership"
  | "recurring_membership"
  | "standalone_download"
  | "standalone_course"
  | "cohort_programme"
  | "legacy_subscription";

export type CommercialProductStatus =
  | "active"
  | "beta"
  | "in_development"
  | "planned"
  | "sold_out"
  | "waitlist"
  | "legacy_grandfathered"
  | "retired";

export type BillingInterval =
  | "none"
  | "month"
  | "year"
  | "one_time"
  | "instalment";

export type EntitlementAccessType =
  | "active_subscription"   // access ends when subscription ends
  | "permanent"             // customer owns this regardless of subscription
  | "time_limited"          // expires after a fixed period
  | "cohort_limited";       // access for duration of cohort only

export interface ProductPrice {
  id: string;
  amountPence: number;
  interval: BillingInterval;
  /** Resolved from env var at runtime — never hardcoded */
  stripePriceId: string | undefined;
  active: boolean;
  taxBehaviour: "inclusive" | "exclusive" | "unspecified";
  /** ISO date string — optional validity window */
  validFrom?: string;
  validUntil?: string;
}

export type WorkflowStage =
  | "prepare"
  | "plan"
  | "execute_elsewhere"
  | "record"
  | "review"
  | "improve"
  | "repeat_weekly";

export interface ProductEntitlement {
  key: string;
  name: string;
  description: string;
  accessType: EntitlementAccessType;
  /** Whether the underlying feature is actually available right now */
  featureStatus: "released" | "beta" | "in_development" | "planned" | "retired";
  expiresAfterDays?: number;
  workflowStages?: WorkflowStage[];
}

export interface CommercialProduct {
  id: string;
  slug: string;
  name: string;
  shortName: string;
  description: string;
  productType: CommercialProductType;
  status: CommercialProductStatus;
  availableForNewPurchase: boolean;
  currency: "GBP";
  prices: ProductPrice[];
  /** Keys of features included with an active subscription */
  activeMembershipEntitlements: string[];
  /** Keys of items permanently owned (downloads, one-time courses) */
  permanentEntitlements: string[];
  /** Features confirmed released — show in current-value checklist */
  releasedFeatures: string[];
  /** Features on roadmap — show ONLY in roadmap section, never in checklist */
  plannedFeatures: string[];
  stripeProductId: string | undefined;
  displayOrder: number;
  applicationRequired: boolean;
  /** Maximum number of concurrent active members (Floor, Accelerator) */
  capacity?: number;
  refundPolicyId?: string;
  termsUrl?: string;
  /** Internal IDs of legacy products this supersedes */
  legacyProductIds?: string[];
  /** Human-readable note shown to admins about this product's commercial treatment */
  adminNote?: string;
}

// ─── Annual saving helper ────────────────────────────────────────────────────

/**
 * Calculate the annual saving in pence compared with paying monthly.
 * Returns 0 if no monthly or annual price exists.
 */
export function calculateAnnualSavingPence(product: CommercialProduct): number {
  const monthly = product.prices.find(
    (p) => p.interval === "month" && p.active
  );
  const annual = product.prices.find(
    (p) => p.interval === "year" && p.active
  );
  if (!monthly || !annual) return 0;
  return monthly.amountPence * 12 - annual.amountPence;
}

/**
 * Format a pence amount as a GBP string (e.g. 4900 → "£49").
 * Strips trailing ".00" for whole pound amounts.
 */
export function formatGBP(pence: number): string {
  const pounds = pence / 100;
  return pounds % 1 === 0
    ? `£${pounds.toLocaleString("en-GB")}`
    : `£${pounds.toLocaleString("en-GB", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

/**
 * Returns "Two months at no additional charge" for 10-month annual pricing,
 * or a generic saving description for other structures.
 */
export function annualSavingDescription(product: CommercialProduct): string {
  const savingPence = calculateAnnualSavingPence(product);
  if (savingPence <= 0) return "";
  const monthly = product.prices.find(
    (p) => p.interval === "month" && p.active
  );
  if (monthly && savingPence === monthly.amountPence * 2) {
    return "Two months at no additional charge";
  }
  return `Save ${formatGBP(savingPence)} per year`;
}

// ─── Entitlement definitions ─────────────────────────────────────────────────

export const ENTITLEMENTS: Record<string, ProductEntitlement> = {
  // Education — released
  phase_1_curriculum: {
    key: "phase_1_curriculum",
    name: "Phase 1: Ground Zero",
    description: "Introductory curriculum covering trading fundamentals.",
    accessType: "active_subscription",
    featureStatus: "released",
  },
  phase_2_4_curriculum: {
    key: "phase_2_4_curriculum",
    name: "Foundation Curriculum: Phases 2–4",
    description: "Foundation-level curriculum phases as they are released.",
    accessType: "active_subscription",
    featureStatus: "in_development",
  },
  phase_5_10_curriculum: {
    key: "phase_5_10_curriculum",
    name: "Edge Curriculum: Phases 5–10",
    description: "Advanced curriculum phases as they are released.",
    accessType: "active_subscription",
    featureStatus: "in_development",
  },
  phase_11_13_curriculum: {
    key: "phase_11_13_curriculum",
    name: "Floor Curriculum: Phases 11–13",
    description: "Full released curriculum including advanced phases.",
    accessType: "active_subscription",
    featureStatus: "in_development",
  },
  // Tools — released
  trade_journal_manual: {
    key: "trade_journal_manual",
    name: "Manual Trade Journal",
    description: "Structured manual trade journal for recording and reviewing trades.",
    accessType: "active_subscription",
    featureStatus: "released",
  },
  position_size_calculator: {
    key: "position_size_calculator",
    name: "Position Size Calculator",
    description: "Calculate correct position size based on account risk.",
    accessType: "active_subscription",
    featureStatus: "released",
  },
  risk_reward_calculator: {
    key: "risk_reward_calculator",
    name: "Risk/Reward Calculator",
    description: "Evaluate trade risk-to-reward before entry.",
    accessType: "active_subscription",
    featureStatus: "released",
  },
  drawdown_recovery_calculator: {
    key: "drawdown_recovery_calculator",
    name: "Drawdown & Recovery Calculator",
    description: "Model drawdown scenarios and required recovery.",
    accessType: "active_subscription",
    featureStatus: "released",
  },
  technical_charts: {
    key: "technical_charts",
    name: "Technical Charting",
    description: "TradingView-powered charting integration.",
    accessType: "active_subscription",
    featureStatus: "released",
  },
  market_intelligence_hub: {
    key: "market_intelligence_hub",
    name: "Market Intelligence Hub",
    description: "Drawdown market and macro intelligence briefings, The Wire.",
    accessType: "active_subscription",
    featureStatus: "released",
  },
  community_access: {
    key: "community_access",
    name: "Community Access",
    description: "Access to the Drawdown member community.",
    accessType: "active_subscription",
    featureStatus: "released",
  },
  // Investment Centre
  investment_centre: {
    key: "investment_centre",
    name: "Investment Centre",
    description: "Institutional macro and risk analysis engine.",
    accessType: "active_subscription",
    featureStatus: "released",
  },
  // Edge tools
  ai_journal_review: {
    key: "ai_journal_review",
    name: "AI-Assisted Journal Review",
    description: "AI-assisted trade journal analysis. See methodology for limitations.",
    accessType: "active_subscription",
    featureStatus: "released",
  },
  strategy_backtester: {
    key: "strategy_backtester",
    name: "Strategy Backtester",
    description: "Beta strategy backtesting tool. See methodology for limitations.",
    accessType: "active_subscription",
    featureStatus: "beta",
  },
  advanced_briefings: {
    key: "advanced_briefings",
    name: "Advanced Market & Macro Briefings",
    description: "In-depth macro analysis and market intelligence.",
    accessType: "active_subscription",
    featureStatus: "released",
  },
  priority_support: {
    key: "priority_support",
    name: "Priority Support Queue",
    description: "Priority product support queue.",
    accessType: "active_subscription",
    featureStatus: "released",
  },
  // Floor
  floor_community: {
    key: "floor_community",
    name: "Private Floor Community Channel",
    description: "Access to the private Floor member channel.",
    accessType: "active_subscription",
    featureStatus: "released",
  },
  founder_onboarding_call: {
    key: "founder_onboarding_call",
    name: "Onboarding & Process-Mapping Call (30 min)",
    description: "One 30-minute onboarding and process-mapping call with Pete.",
    accessType: "active_subscription",
    featureStatus: "released",
  },
  founder_monthly_group_review: {
    key: "founder_monthly_group_review",
    name: "Founder-Led Group Trading-Process Review (monthly)",
    description: "One founder-led group trading-process review each month.",
    accessType: "active_subscription",
    featureStatus: "released",
  },
  founder_quarterly_individual_review: {
    key: "founder_quarterly_individual_review",
    name: "Individual Process & Journal Review (quarterly)",
    description: "One 30-minute individual process and journal review per calendar quarter.",
    accessType: "active_subscription",
    featureStatus: "released",
  },
  // Planned tools
  automated_alerts: {
    key: "automated_alerts",
    name: "Automated Market Alerts",
    description: "Automated alerting system. Not yet available.",
    accessType: "active_subscription",
    featureStatus: "planned",
  },
  monte_carlo_tools: {
    key: "monte_carlo_tools",
    name: "Monte Carlo Simulation Tools",
    description: "Statistical survival probability modelling. Not yet available.",
    accessType: "active_subscription",
    featureStatus: "planned",
  },
  // Permanent downloads
  prop_firm_survival_kit_download: {
    key: "prop_firm_survival_kit_download",
    name: "Prop Firm Survival Kit (permanent download)",
    description: "Permanent ownership of the Prop Firm Survival Kit PDF.",
    accessType: "permanent",
    featureStatus: "released",
  },
  how_to_trade_download: {
    key: "how_to_trade_download",
    name: "How to Trade Manual (permanent download)",
    description: "Permanent ownership of the How to Trade Manual PDF.",
    accessType: "permanent",
    featureStatus: "released",
  },
  edge_manual_download: {
    key: "edge_manual_download",
    name: "The Edge Manual (permanent download)",
    description: "Permanent ownership of The Edge Manual PDF.",
    accessType: "permanent",
    featureStatus: "released",
  },
  deploy_your_algo_access: {
    key: "deploy_your_algo_access",
    name: "Deploy Your Algo Mini-Course",
    description: "Access to the Deploy Your Algo course.",
    accessType: "permanent",
    featureStatus: "released",
  },
};

// ─── Products ─────────────────────────────────────────────────────────────────

export const COMMERCIAL_CATALOGUE: CommercialProduct[] = [
  // ── 1. Free ───────────────────────────────────────────────────────────────
  {
    id: "free",
    slug: "free",
    name: "Drawdown Free",
    shortName: "Free",
    description:
      "Start your trading journey. Experience Drawdown's approach and tools at no cost — no card required.",
    productType: "free_membership",
    status: "active",
    availableForNewPurchase: true,
    currency: "GBP",
    prices: [
      {
        id: "free_access",
        amountPence: 0,
        interval: "none",
        stripePriceId: undefined,
        active: true,
        taxBehaviour: "unspecified",
      },
    ],
    activeMembershipEntitlements: [
      "phase_1_curriculum",
      "trade_journal_manual",
      "position_size_calculator",
      "risk_reward_calculator",
      "drawdown_recovery_calculator",
    ],
    permanentEntitlements: [],
    releasedFeatures: [
      "Phase 1: Ground Zero (introductory lessons)",
      "Manual trade journal",
      "Position size calculator",
      "Risk/reward calculator",
      "Drawdown and recovery calculator",
      "Selected market and educational articles",
      "Free worksheets and checklists",
      "Weekly Drawdown email briefing",
      "Basic account dashboard",
      "Public broker and prop-firm research",
    ],
    plannedFeatures: [],
    stripeProductId: undefined,
    displayOrder: 1,
    applicationRequired: false,
  },

  // ── 2. Foundation ─────────────────────────────────────────────────────────
  {
    id: "foundation",
    slug: "foundation",
    name: "Foundation",
    shortName: "Foundation",
    description:
      "For developing traders who need structured education, a risk framework and a repeatable trading-review process.",
    productType: "recurring_membership",
    status: "active",
    availableForNewPurchase: true,
    currency: "GBP",
    prices: [
      {
        id: "foundation_monthly_gbp",
        amountPence: 4900,
        interval: "month",
        stripePriceId: process.env.STRIPE_PRICE_FOUNDATION_MONTHLY_GBP,
        active: true,
        taxBehaviour: "inclusive",
      },
      {
        id: "foundation_annual_gbp",
        amountPence: 49000, // £490 = 10 × £49 (two months at no additional charge)
        interval: "year",
        stripePriceId: process.env.STRIPE_PRICE_FOUNDATION_ANNUAL_GBP,
        active: true,
        taxBehaviour: "inclusive",
      },
    ],
    activeMembershipEntitlements: [
      "phase_1_curriculum",
      "phase_2_4_curriculum",
      "trade_journal_manual",
      "position_size_calculator",
      "risk_reward_calculator",
      "drawdown_recovery_calculator",
      "technical_charts",
      "market_intelligence_hub",
      "community_access",
    ],
    // Annual Foundation members receive permanent download entitlement to:
    permanentEntitlements: [
      // Granted on annual plan only — enforced in webhook handler
      "prop_firm_survival_kit_download",
      "how_to_trade_download",
    ],
    releasedFeatures: [
      "Everything in Free",
      "Foundation curriculum: Phase 1 live; Phases 2–4 added as released",
      "Manual trade journal",
      "Personal trading risk plan",
      "Position sizing and exposure tools",
      "Technical charting access",
      "Market Intelligence Hub & The Wire",
      "General community access",
      "In-platform access to eligible Foundation manuals (active membership)",
      "20% off standalone manuals (monthly members)",
    ],
    plannedFeatures: [
      "Signal Centre integration (in development — see roadmap)",
    ],
    stripeProductId: process.env.STRIPE_PRODUCT_FOUNDATION,
    displayOrder: 2,
    applicationRequired: false,
    refundPolicyId: "membership_satisfaction_guarantee",
    legacyProductIds: [],
    adminNote:
      "Annual Foundation members receive permanent download entitlement to Prop Firm Survival Kit and How to Trade Manual. Monthly members receive 20% discount on standalone manuals only. Do NOT grant permanent downloads to monthly Foundation members.",
  },

  // ── 3. Edge ──────────────────────────────────────────────────────────────
  {
    id: "edge",
    slug: "edge",
    name: "Edge",
    shortName: "Edge",
    description:
      "For active traders who require advanced analysis, structured strategy testing and deeper performance-review tools.",
    productType: "recurring_membership",
    status: "active",
    availableForNewPurchase: true,
    currency: "GBP",
    prices: [
      {
        id: "edge_monthly_gbp_v2",
        amountPence: 9900, // £99 — new price (was £149)
        interval: "month",
        stripePriceId: process.env.STRIPE_PRICE_EDGE_MONTHLY_GBP,
        active: true,
        taxBehaviour: "inclusive",
      },
      {
        id: "edge_annual_gbp_v2",
        amountPence: 99000, // £990 = 10 × £99 (two months at no additional charge)
        interval: "year",
        stripePriceId: process.env.STRIPE_PRICE_EDGE_ANNUAL_GBP,
        active: true,
        taxBehaviour: "inclusive",
      },
    ],
    activeMembershipEntitlements: [
      "phase_1_curriculum",
      "phase_2_4_curriculum",
      "phase_5_10_curriculum",
      "trade_journal_manual",
      "position_size_calculator",
      "risk_reward_calculator",
      "drawdown_recovery_calculator",
      "technical_charts",
      "market_intelligence_hub",
      "community_access",
      "investment_centre",
      "ai_journal_review",
      "strategy_backtester",
      "advanced_briefings",
      "priority_support",
    ],
    permanentEntitlements: [
      // Annual Edge members receive permanent download entitlement to:
      "prop_firm_survival_kit_download",
      "how_to_trade_download",
      "edge_manual_download",
      // Deploy Your Algo included with annual Edge — verified released
      "deploy_your_algo_access",
    ],
    releasedFeatures: [
      "Everything in Foundation",
      "Edge curriculum: Phases 5–10 as released",
      "Investment Centre access",
      "AI-assisted journal review",
      "Strategy backtester (Beta — see methodology)",
      "Advanced market and macro briefings",
      "Priority support queue",
      "25% off all standalone premium manuals (monthly members)",
      "20% off eligible standalone mini-courses (monthly members)",
    ],
    plannedFeatures: [
      "Monte Carlo simulation tools (in development)",
      "Automated market alerts (planned)",
      "Pine Script strategy development resources (planned)",
    ],
    stripeProductId: process.env.STRIPE_PRODUCT_EDGE,
    displayOrder: 3,
    applicationRequired: false,
    refundPolicyId: "membership_satisfaction_guarantee",
    legacyProductIds: ["edge_legacy_149"],
    adminNote:
      "Edge price changed from £149 to £99 per month (£990/yr). Existing £149 customers should migrate to the new price at their next renewal after notification. Annual Edge members receive permanent downloads: Prop Firm Survival Kit, How to Trade Manual, The Edge Manual, Deploy Your Algo.",
  },

  // ── 4. Floor ─────────────────────────────────────────────────────────────
  {
    id: "floor",
    slug: "floor",
    name: "The Floor",
    shortName: "Floor",
    description:
      "For serious traders who require the complete released platform plus defined access to founder-led process reviews and a capped private membership environment.",
    productType: "recurring_membership",
    status: "active",
    availableForNewPurchase: true,
    currency: "GBP",
    prices: [
      {
        id: "floor_monthly_gbp",
        amountPence: 29900, // £299
        interval: "month",
        stripePriceId: process.env.STRIPE_PRICE_FLOOR_MONTHLY_GBP,
        active: true,
        taxBehaviour: "inclusive",
      },
      // No public annual checkout at launch. Annual arrangements offered only
      // after application and manual approval.
    ],
    activeMembershipEntitlements: [
      "phase_1_curriculum",
      "phase_2_4_curriculum",
      "phase_5_10_curriculum",
      "phase_11_13_curriculum",
      "trade_journal_manual",
      "position_size_calculator",
      "risk_reward_calculator",
      "drawdown_recovery_calculator",
      "technical_charts",
      "market_intelligence_hub",
      "community_access",
      "investment_centre",
      "ai_journal_review",
      "strategy_backtester",
      "advanced_briefings",
      "priority_support",
      "floor_community",
      "founder_onboarding_call",
      "founder_monthly_group_review",
      "founder_quarterly_individual_review",
    ],
    permanentEntitlements: [
      "prop_firm_survival_kit_download",
      "how_to_trade_download",
      "edge_manual_download",
      "deploy_your_algo_access",
    ],
    releasedFeatures: [
      "Everything in Edge",
      "All released curriculum",
      "Investment Centre access",
      "Private Floor community channel",
      "One 30-minute onboarding and process-mapping call",
      "One founder-led group trading-process review each month",
      "One 30-minute individual process and journal review per quarter",
      "Priority support — target 2 UK business day response",
      "Early access to selected new tools",
      "Priority application access to future Accelerator cohorts",
      "All three permanent manual downloads (Prop Kit, How to Trade, Edge Manual)",
      "Deploy Your Algo mini-course access",
    ],
    plannedFeatures: [],
    stripeProductId: process.env.STRIPE_PRODUCT_FLOOR,
    displayOrder: 4,
    applicationRequired: false,
    // Default capacity — configurable via admin. No public annual checkout.
    capacity: 20,
    refundPolicyId: "membership_satisfaction_guarantee",
    adminNote:
      "Floor founder access covers educational process reviews, journal feedback, platform guidance and general trading-discipline discussions. It does NOT include personalised financial advice, trade instructions or portfolio management. Capacity is 20 active members. When reached, show waitlist CTA and remove live checkout. Annual Floor arrangements offered only after application and manual approval.",
  },

  // ── 5. Accelerator ───────────────────────────────────────────────────────
  {
    id: "accelerator",
    slug: "institutional-accelerator",
    name: "Drawdown Institutional Accelerator",
    shortName: "Accelerator",
    description:
      "A six-week live cohort programme for serious traders. Application required. Manual acceptance required. Maximum 15 participants per cohort.",
    productType: "cohort_programme",
    status: "active",
    availableForNewPurchase: true,
    currency: "GBP",
    prices: [
      {
        id: "accelerator_full_gbp",
        amountPence: 150000, // £1,500 full payment
        interval: "one_time",
        stripePriceId: process.env.STRIPE_PRICE_ACCELERATOR_GBP,
        active: true,
        taxBehaviour: "inclusive",
      },
      {
        id: "accelerator_instalment_gbp",
        amountPence: 55000, // £550 × 3 = £1,650 total
        interval: "instalment",
        stripePriceId: process.env.STRIPE_PRICE_ACCELERATOR_INSTALMENT_GBP,
        active: true,
        taxBehaviour: "inclusive",
      },
    ],
    activeMembershipEntitlements: [],
    permanentEntitlements: [
      "prop_firm_survival_kit_download",
      "how_to_trade_download",
      "edge_manual_download",
      "deploy_your_algo_access",
    ],
    releasedFeatures: [
      "Six-week structured live cohort programme",
      "Maximum 15 accepted participants per cohort",
      "12 months Edge membership (starts on cohort commencement date)",
      "All three premium manual permanent downloads",
      "Deploy Your Algo mini-course access",
      "Cohort materials and recordings (subject to enrolment terms)",
      "Defined live educational sessions",
      "Defined process review sessions",
      "Cohort community access for the stated period",
    ],
    plannedFeatures: [],
    stripeProductId: process.env.STRIPE_PRODUCT_ACCELERATOR,
    displayOrder: 5,
    applicationRequired: true,
    capacity: 15,
    refundPolicyId: "accelerator_conditional_refund",
    termsUrl: "/terms/accelerator",
    adminNote:
      "Accelerator includes 12 months Edge membership — NOT Floor membership. Checkout available only after admin acceptance of application. Instalment plan totals £1,650 (3 × £550), which is £150 more than the full payment of £1,500. This must be clearly disclosed before checkout. Do not give Accelerator participants undefined or unlimited founder access.",
  },

  // ── Standalone products ───────────────────────────────────────────────────

  {
    id: "prop_firm_survival_kit",
    slug: "prop-firm-survival-kit",
    name: "Prop Firm Survival Kit",
    shortName: "Prop Kit",
    description:
      "Rule decoder, position sizing calculators and psychological protocols for passing prop firm evaluations. 100 pages. Permanent download.",
    productType: "standalone_download",
    status: "active",
    availableForNewPurchase: true,
    currency: "GBP",
    prices: [
      {
        id: "prop_kit_gbp",
        amountPence: 4900, // £49
        interval: "one_time",
        stripePriceId: process.env.STRIPE_PRICE_PROP_KIT_GBP,
        active: true,
        taxBehaviour: "inclusive",
      },
    ],
    activeMembershipEntitlements: [],
    permanentEntitlements: ["prop_firm_survival_kit_download"],
    releasedFeatures: [
      "100-page PDF — permanent download",
      "Prop firm rule decoder",
      "Position sizing calculators for evaluation accounts",
      "Psychological protocols",
      "30-day credit toward annual Foundation or annual Edge (if upgraded within 30 days)",
    ],
    plannedFeatures: [],
    stripeProductId: process.env.STRIPE_PRODUCT_PROP_KIT,
    displayOrder: 10,
    applicationRequired: false,
    refundPolicyId: "digital_download_refund",
    adminNote:
      "Standalone purchase = permanent download. NOT free with monthly Foundation membership. Annual Foundation and above: included as a permanent download entitlement.",
  },

  {
    id: "how_to_trade_manual",
    slug: "how-to-trade",
    name: "How to Trade Manual",
    shortName: "How to Trade",
    description:
      "100 pages covering market structure, session theory, order flow, execution mechanics and professional risk. Permanent download.",
    productType: "standalone_download",
    status: "active",
    availableForNewPurchase: true,
    currency: "GBP",
    prices: [
      {
        id: "how_to_trade_gbp",
        amountPence: 7900, // £79
        interval: "one_time",
        stripePriceId: process.env.STRIPE_PRICE_HOW_TO_TRADE_GBP,
        active: true,
        taxBehaviour: "inclusive",
      },
    ],
    activeMembershipEntitlements: [],
    permanentEntitlements: ["how_to_trade_download"],
    releasedFeatures: [
      "100-page PDF — permanent download",
      "Market structure and session theory",
      "Order flow and execution mechanics",
      "Professional risk framework",
      "30-day credit toward annual Foundation or annual Edge (if upgraded within 30 days)",
    ],
    plannedFeatures: [],
    stripeProductId: process.env.STRIPE_PRODUCT_HOW_TO_TRADE,
    displayOrder: 11,
    applicationRequired: false,
    refundPolicyId: "digital_download_refund",
  },

  {
    id: "edge_manual",
    slug: "the-edge-manual",
    name: "The Edge Manual",
    shortName: "Edge Manual",
    description:
      "Liquidity theory, institutional order flow, confluence framework and advanced setups. 100 pages. Permanent download.",
    productType: "standalone_download",
    status: "active",
    availableForNewPurchase: true,
    currency: "GBP",
    prices: [
      {
        id: "edge_manual_gbp",
        amountPence: 5900, // £59
        interval: "one_time",
        stripePriceId: process.env.STRIPE_PRICE_EDGE_MANUAL_GBP,
        active: true,
        taxBehaviour: "inclusive",
      },
    ],
    activeMembershipEntitlements: [],
    permanentEntitlements: ["edge_manual_download"],
    releasedFeatures: [
      "100-page PDF — permanent download",
      "Liquidity theory",
      "Institutional order flow",
      "Confluence framework",
      "Advanced setups and playbook",
      "30-day credit toward annual Edge (if upgraded within 30 days)",
    ],
    plannedFeatures: [],
    stripeProductId: process.env.STRIPE_PRODUCT_EDGE_MANUAL,
    displayOrder: 12,
    applicationRequired: false,
    refundPolicyId: "digital_download_refund",
  },

  {
    id: "manual_bundle",
    slug: "manual-bundle",
    name: "Complete Manual Collection",
    shortName: "Manual Bundle",
    description:
      "All three Drawdown premium manuals in one permanent-download bundle: Prop Firm Survival Kit, How to Trade Manual and The Edge Manual.",
    productType: "standalone_download",
    status: "active",
    availableForNewPurchase: true,
    currency: "GBP",
    prices: [
      {
        id: "manual_bundle_gbp",
        amountPence: 12900, // £129 (vs £49 + £79 + £59 = £187 separate)
        interval: "one_time",
        stripePriceId: process.env.STRIPE_PRICE_MANUAL_BUNDLE_GBP,
        active: true,
        taxBehaviour: "inclusive",
      },
    ],
    activeMembershipEntitlements: [],
    permanentEntitlements: [
      "prop_firm_survival_kit_download",
      "how_to_trade_download",
      "edge_manual_download",
    ],
    releasedFeatures: [
      "All three PDFs — permanent download",
      "Prop Firm Survival Kit (£49 separately)",
      "How to Trade Manual (£79 separately)",
      "The Edge Manual (£59 separately)",
      "30-day credit toward annual Edge (if upgraded within 30 days)",
    ],
    plannedFeatures: [],
    stripeProductId: process.env.STRIPE_PRODUCT_MANUAL_BUNDLE,
    displayOrder: 13,
    applicationRequired: false,
    refundPolicyId: "digital_download_refund",
    adminNote:
      "Separate retail value: £187 (£49 + £79 + £59). Bundle saving = £58. This saving is calculated programmatically — never hardcode £58. Stripe product needs creating.",
  },

  {
    id: "deploy_your_algo",
    slug: "deploy-your-algo",
    name: "Deploy Your Algo",
    shortName: "Deploy Your Algo",
    description:
      "Five modules covering how to take a generated Pine Script or Python strategy and deploy it to a live chart.",
    productType: "standalone_course",
    // NOTE: Pete to verify that all 5 modules are accessible before changing to "active"
    status: "active",
    availableForNewPurchase: true,
    currency: "GBP",
    prices: [
      {
        id: "deploy_algo_gbp",
        amountPence: 9700, // £97
        interval: "one_time",
        stripePriceId: process.env.STRIPE_PRICE_DEPLOY_ALGO_GBP,
        active: true,
        taxBehaviour: "inclusive",
      },
    ],
    activeMembershipEntitlements: [],
    permanentEntitlements: ["deploy_your_algo_access"],
    releasedFeatures: [
      "Five course modules",
      "Pine Script deployment walkthrough",
      "Included with annual Edge, Floor and Accelerator",
    ],
    plannedFeatures: [],
    stripeProductId: process.env.STRIPE_PRODUCT_DEPLOY_ALGO,
    displayOrder: 14,
    applicationRequired: false,
    refundPolicyId: "digital_download_refund",
    adminNote:
      "VERIFY: Confirm all 5 modules are accessible before counting this as active. If any module is unavailable, change status to 'in_development' and remove from membership inclusions.",
  },

  // ── Legacy products (grandfathered — not available for new purchase) ────────

  {
    id: "signal_centre_legacy",
    slug: "signal-centre",
    name: "Signal Centre",
    shortName: "Signal Centre",
    description:
      "Legacy standalone market intelligence subscription. Not available for new purchase. Existing subscribers are grandfathered.",
    productType: "legacy_subscription",
    status: "legacy_grandfathered",
    availableForNewPurchase: false,
    currency: "GBP",
    prices: [
      {
        id: "signal_centre_monthly_gbp_legacy",
        amountPence: 3900, // £39
        interval: "month",
        stripePriceId: process.env.STRIPE_PRICE_SIGNAL_CENTRE_MONTHLY_GBP,
        active: false,
        taxBehaviour: "inclusive",
      },
    ],
    activeMembershipEntitlements: ["market_intelligence_hub"],
    permanentEntitlements: [],
    releasedFeatures: [],
    plannedFeatures: [],
    stripeProductId: undefined,
    displayOrder: 99,
    applicationRequired: false,
    adminNote:
      "Legacy grandfathered product. Do NOT cancel existing subscriptions. Do NOT increase price automatically. Offer existing customers an upgrade path to Foundation. Once cancelled, cannot be restarted under the legacy plan.",
  },

  {
    id: "investment_centre_addon_legacy",
    slug: "investment-centre-addon",
    name: "Investment Centre Add-on",
    shortName: "IC Add-on",
    description:
      "Legacy Investment Centre add-on subscription. Not available for new purchase. Investment Centre is now included in Edge and Floor.",
    productType: "legacy_subscription",
    status: "legacy_grandfathered",
    availableForNewPurchase: false,
    currency: "GBP",
    prices: [
      {
        id: "investment_centre_monthly_gbp_legacy",
        amountPence: 9900, // £99
        interval: "month",
        stripePriceId: process.env.STRIPE_PRICE_INVESTMENT_CENTRE_MONTHLY_GBP,
        active: false,
        taxBehaviour: "inclusive",
      },
    ],
    activeMembershipEntitlements: ["investment_centre"],
    permanentEntitlements: [],
    releasedFeatures: [],
    plannedFeatures: [],
    stripeProductId: undefined,
    displayOrder: 99,
    applicationRequired: false,
    adminNote:
      "Legacy grandfathered add-on. Investment Centre is now included in Edge and Floor for new customers. Offer existing standalone add-on customers an upgrade to Edge at the new Edge price. Prevent double billing, duplicate entitlements and overlapping subscriptions.",
  },
];

// ─── Lookup helpers ──────────────────────────────────────────────────────────

/** Get a product by its slug */
export function getProduct(slug: string): CommercialProduct | undefined {
  return COMMERCIAL_CATALOGUE.find((p) => p.slug === slug);
}

/** Get a product by its ID */
export function getProductById(id: string): CommercialProduct | undefined {
  return COMMERCIAL_CATALOGUE.find((p) => p.id === id);
}

/** Get all products available for new purchase, sorted by displayOrder */
export function getActiveProducts(): CommercialProduct[] {
  return COMMERCIAL_CATALOGUE.filter((p) => p.availableForNewPurchase).sort(
    (a, b) => a.displayOrder - b.displayOrder
  );
}

/** Get membership tiers only (for pricing page display) */
export function getMembershipTiers(): CommercialProduct[] {
  return COMMERCIAL_CATALOGUE.filter(
    (p) =>
      (p.productType === "free_membership" ||
        p.productType === "recurring_membership") &&
      p.availableForNewPurchase
  ).sort((a, b) => a.displayOrder - b.displayOrder);
}

/** Get standalone download products */
export function getStandaloneProducts(): CommercialProduct[] {
  return COMMERCIAL_CATALOGUE.filter(
    (p) =>
      (p.productType === "standalone_download" ||
        p.productType === "standalone_course") &&
      p.availableForNewPurchase
  ).sort((a, b) => a.displayOrder - b.displayOrder);
}

/** Get the monthly price for a product in pence */
export function getMonthlyPricePence(product: CommercialProduct): number {
  const price = product.prices.find(
    (p) => p.interval === "month" && p.active
  );
  return price?.amountPence ?? 0;
}

/** Get the annual price for a product in pence */
export function getAnnualPricePence(product: CommercialProduct): number {
  const price = product.prices.find(
    (p) => p.interval === "year" && p.active
  );
  return price?.amountPence ?? 0;
}

/**
 * Calculate the bundle saving in pence (sum of individual prices minus bundle price).
 * Used for Manual Bundle display.
 */
export function calculateBundleSavingPence(): number {
  const propKit = COMMERCIAL_CATALOGUE.find((p) => p.id === "prop_firm_survival_kit");
  const howToTrade = COMMERCIAL_CATALOGUE.find((p) => p.id === "how_to_trade_manual");
  const edgeManual = COMMERCIAL_CATALOGUE.find((p) => p.id === "edge_manual");
  const bundle = COMMERCIAL_CATALOGUE.find((p) => p.id === "manual_bundle");
  if (!propKit || !howToTrade || !edgeManual || !bundle) return 0;
  const individualTotal =
    (propKit.prices[0]?.amountPence ?? 0) +
    (howToTrade.prices[0]?.amountPence ?? 0) +
    (edgeManual.prices[0]?.amountPence ?? 0);
  const bundlePrice = bundle.prices[0]?.amountPence ?? 0;
  return individualTotal - bundlePrice;
}

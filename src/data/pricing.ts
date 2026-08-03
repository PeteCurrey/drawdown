import { Region } from "@/lib/seo/hreflang";

export interface PricingTier {
  name: string;
  price: { monthly: number; yearly: number };
  description: string;
  buttonText: string;
  highlight: boolean;
  borderColor: string;
  badge?: string | null;
  savings?: string;
  leftBorder?: boolean;
  accentColor?: string;
  borderAccent?: string;
  features: { name: string; included: boolean; badge?: string; tierNote?: string; accent?: boolean }[];
}

// Currency symbol map — used by the shared pricing client
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

// PDF standalone prices per region (approximate local equivalents of £49 / £79 / £59)
export const REGION_PDF_PRICES: Record<Region, { propKit: string; howTo: string; edge: string }> = {
  uk:  { propKit: "£49",    howTo: "£79",    edge: "£59" },
  us:  { propKit: "$59",    howTo: "$99",    edge: "$74" },
  au:  { propKit: "A$89",   howTo: "A$149",  edge: "A$109" },
  sg:  { propKit: "S$79",   howTo: "S$129",  edge: "S$99" },
  hk:  { propKit: "HK$459", howTo: "HK$749", edge: "HK$569" },
  ca:  { propKit: "C$79",   howTo: "C$129",  edge: "C$99" },
  de:  { propKit: "€55",    howTo: "€89",    edge: "€65" },
  ae:  { propKit: "AED 215",howTo: "AED 349",edge: "AED 259" },
  in:  { propKit: "₹4,899", howTo: "₹7,899", edge: "₹5,899" },
  my:  { propKit: "RM 249", howTo: "RM 399", edge: "RM 299" },
  ph:  { propKit: "₱2,799", howTo: "₱4,599", edge: "₱3,299" },
};

export const GET_DEFAULT_FEATURES = () => [
  { name: "Full Course Library (Phase 1 complete — new phases added as released)", included: true },
  { name: "Trade Journal (Manual)", included: true },
  { name: "Position Size Calculator", included: true },
  { name: "Intelligence Hub", included: true },
  { name: "Technical Charts", included: true },
  { name: "Community Discord Access", included: true },
  { name: "The Wire (Daily Edition)", included: true },
];

export const GET_EDGE_FEATURES = () => [
  { name: "Everything in Foundation", included: true },
  { name: "AI Trade Journal", included: true },
  { name: "AI Market Scanner & Alerting", included: true },
  { name: "AI Strategy Backtester", included: true },
  { name: "AI Daily Briefing", included: true },
];

export const GET_FLOOR_FEATURES = () => [
  { name: "Everything in Edge", included: true },
  { name: "The Investment Centre (Institutional Macro & Risk Engine)", included: true },
  { name: "Direct Discord Access to Founder", included: true },
];

export const GET_SIGNAL_CENTRE_FEATURES = () => [
  { name: "Live Signal Feed (Forex, Indices, Metals)", included: true },
  { name: "AI Consensus Panel — Claude + GPT-4o + Grok", included: true },
  { name: "Technical Confluence Grid (M15 to D1)", included: true },
  { name: "Crypto Intelligence Hub", included: true },
  { name: "Signal Archive & Performance Tracker", included: true },
  { name: "Push notifications for high-DCS signals", included: true },
  { name: "The Investment Centre", included: false, tierNote: "Add-on" },
];

// Helper: builds the 4-tier array for a region given its prices
function buildTiers(
  symbol: string,
  signalMonthly: number, signalYearly: number,
  foundMonthly: number, foundYearly: number,
  edgeMonthly: number, edgeYearly: number,
  floorMonthly: number, floorYearly: number,
  regionLabel: string,
): PricingTier[] {
  const investAddOn = `Add-on ${symbol}${Math.round(floorMonthly * 0.33)}/mo`;
  return [
    {
      name: "Signal Centre",
      price: { monthly: signalMonthly, yearly: signalYearly },
      description: "For traders who want intelligence, not lectures.",
      buttonText: "Start Signal Centre",
      highlight: false,
      badge: null,
      borderColor: "border-text-primary/20",
      accentColor: "rgba(200, 241, 53, 0.06)",
      borderAccent: "#C8F135",
      savings: String(Math.round(signalMonthly * 12 - signalYearly * 12)),
      leftBorder: true,
      features: [
        ...GET_SIGNAL_CENTRE_FEATURES().map(f =>
          f.tierNote ? { ...f, tierNote: investAddOn } : f
        ),
      ],
    },
    {
      name: "Foundation",
      price: { monthly: foundMonthly, yearly: foundYearly },
      description: `For ${regionLabel} traders building their knowledge base.`,
      buttonText: "Start Foundation",
      highlight: false,
      badge: null,
      borderColor: "border-text-primary/20",
      accentColor: "rgba(99, 102, 241, 0.12)",
      borderAccent: "#6366f1",
      savings: String(Math.round(foundMonthly * 12 - foundYearly * 12)),
      features: [
        ...GET_DEFAULT_FEATURES(),
        { name: "PDF Manuals: How to Trade & Prop Survival Kit", included: true, badge: "Included FREE" },
        { name: "The Investment Centre", included: false, tierNote: investAddOn },
      ],
    },
    {
      name: "Edge",
      price: { monthly: edgeMonthly, yearly: edgeYearly },
      description: `For active ${regionLabel} traders seeking AI-powered edge.`,
      buttonText: "Join Edge",
      highlight: true,
      badge: "MOST POPULAR",
      borderColor: "border-accent",
      accentColor: "rgba(6, 182, 212, 0.10)",
      borderAccent: "#0891b2",
      savings: String(Math.round(edgeMonthly * 12 - edgeYearly * 12)),
      features: [
        ...GET_EDGE_FEATURES(),
        { name: "All 3 PDF Manuals (Prop Kit, How to Trade, Edge)", included: true, badge: "Included FREE" },
        { name: "The Investment Centre", included: false, tierNote: investAddOn },
      ],
    },
    {
      name: "Floor",
      price: { monthly: floorMonthly, yearly: floorYearly },
      description: "Direct access, full suite & institutional macro engine.",
      buttonText: "Enter the Floor",
      highlight: false,
      badge: "VIP INSTITUTIONAL",
      borderColor: "border-premium",
      accentColor: "rgba(200, 241, 53, 0.12)",
      borderAccent: "#C8F135",
      savings: String(Math.round(floorMonthly * 12 - floorYearly * 12)),
      features: [
        { name: "The Investment Centre Terminal", included: true, badge: `INCLUDED FREE (${symbol}${Math.round(floorMonthly * 0.33)}/mo value)`, accent: true },
        ...GET_FLOOR_FEATURES(),
        { name: "Deploy Your Algo Mini Course", included: true, badge: "Included", accent: true },
        { name: "All 3 PDF Ebooks & Manuals", included: true, badge: "Included FREE", accent: true },
      ],
    },
  ];
}

export const REGIONAL_PRICING: Record<Region, PricingTier[]> = {
  uk:  buildTiers("£",    39,  31,  49,  39, 149, 119, 299, 239, "UK"),
  us:  buildTiers("$",    49,  39,  59,  47, 179, 143, 359, 287, "US"),
  au:  buildTiers("A$",   59,  47,  79,  63, 239, 191, 479, 383, "Australian"),
  sg:  buildTiers("S$",   59,  47,  79,  63, 239, 191, 479, 383, "Singaporean"),
  hk:  buildTiers("HK$", 359, 287, 469, 375,1399,1119,2799,2239, "Hong Kong"),
  ca:  buildTiers("C$",   59,  47,  79,  63, 239, 191, 479, 383, "Canadian"),
  de:  buildTiers("€",    45,  36,  59,  47, 179, 143, 359, 287, "German"),
  ae:  buildTiers("AED ", 159,127, 219, 175, 659, 527,1319,1055, "Emirati"),
  in:  buildTiers("₹",  3799,3039,4999,3999,14999,11999,29999,23999, "Indian"),
  my:  buildTiers("RM ", 199, 159, 279, 223, 849, 679,1699,1359, "Malaysian"),
  ph:  buildTiers("₱",  2499,1999,3299,2639,9999,7999,19999,15999, "Filipino"),
};

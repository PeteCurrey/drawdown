export interface Broker {
  id: string;
  name: string;
  slug: string;
  logo: string;
  oneLine: string;
  rating: number;
  minDeposit: string;
  spreads: string;
  platforms: string[];
  fcaRegulated: boolean;
  pros: string[];
  cons: string[];
  affiliateUrl: string;
  category: "Beginner" | "Forex" | "Stocks" | "Institutional" | "Global";
}

export const brokers: Broker[] = [
  {
    id: "ig",
    name: "IG",
    slug: "ig-review",
    logo: "/brokers/ig.svg",
    oneLine: "Best for UK spread betting and CFDs",
    rating: 4.8,
    minDeposit: "£250",
    spreads: "0.6 pips",
    platforms: ["IG Platform", "MT4", "L2 Dealer"],
    fcaRegulated: true,
    pros: ["Largest UK provider", "Excellent education", "Reliable execution"],
    cons: ["Higher share commissions", "Interface takes time to learn"],
    affiliateUrl: "https://www.ig.com/uk",
    category: "Stocks"
  },
  {
    id: "interactive-brokers",
    name: "Interactive Brokers",
    slug: "ibkr-review",
    logo: "/brokers/ibkr.svg",
    oneLine: "The gold standard for serious multi-asset traders",
    rating: 4.9,
    minDeposit: "£0",
    spreads: "0.1 pips",
    platforms: ["TWS", "IBKR Mobile", "Client Portal"],
    fcaRegulated: true,
    pros: ["Lowest commissions", "Near-infinite asset list", "Institutional tools"],
    cons: ["Very complex software", "Inactive account fees may apply"],
    affiliateUrl: "https://www.interactivebrokers.co.uk",
    category: "Institutional"
  },
  {
    id: "trading-212",
    name: "Trading 212",
    slug: "trading-212-review",
    logo: "/brokers/t212.svg",
    oneLine: "Best commission-free platform for UK investors",
    rating: 4.6,
    minDeposit: "£1",
    spreads: "Dynamic",
    platforms: ["T212 App", "Web Platform"],
    fcaRegulated: true,
    pros: ["Zero commission", "Cleanest UI in the industry", "Easy ISA accounts"],
    cons: ["Limited technical tools", "Customer support can be slow"],
    affiliateUrl: "https://www.trading212.com",
    category: "Beginner"
  },
  {
    id: "pepperstone",
    name: "Pepperstone",
    slug: "pepperstone-review",
    logo: "/brokers/pepperstone.svg",
    oneLine: "Our top pick for dedicated Forex traders",
    rating: 4.7,
    minDeposit: "£200",
    spreads: "0.0 pips (Razor)",
    platforms: ["cTrader", "MT4", "MT5", "TradingView"],
    fcaRegulated: true,
    pros: ["Ultra-low spreads", "Superior cTrader support", "Lightning-fast execution"],
    cons: ["Forex/CFD focused only", "No direct share ownership"],
    affiliateUrl: "https://pepperstone.com",
    category: "Forex"
  },
  {
    id: "etoro",
    name: "eToro",
    slug: "etoro-review",
    logo: "/brokers/etoro.svg",
    oneLine: "Best for social trading and copy trading",
    rating: 4.4,
    minDeposit: "$100",
    spreads: "1.0 pips",
    platforms: ["eToro Platform", "Mobile App"],
    fcaRegulated: true,
    pros: ["Social trading community", "Zero commission stocks", "User-friendly"],
    cons: ["Higher spreads on forex", "Withdrawal fees apply"],
    affiliateUrl: "https://www.etoro.com",
    category: "Beginner"
  },
  {
    id: "xtb",
    name: "XTB",
    slug: "xtb-review",
    logo: "/brokers/xtb.svg",
    oneLine: "Solid all-rounder with a powerful proprietary platform",
    rating: 4.5,
    minDeposit: "£0",
    spreads: "0.5 pips",
    platforms: ["xStation 5", "xStation Mobile"],
    fcaRegulated: true,
    pros: ["Superior platform (xStation)", "No commission on stocks", "Excellent support"],
    cons: ["No MT4/MT5 support", "Limited crypto range for UK"],
    affiliateUrl: "https://www.xtb.com",
    category: "Global"
  },
  {
    id: "cmc-markets",
    name: "CMC Markets",
    slug: "cmc-markets-review",
    logo: "/brokers/cmc.svg",
    oneLine: "UK pioneer with professional-grade charting",
    rating: 4.6,
    minDeposit: "£0",
    spreads: "0.7 pips",
    platforms: ["Next Generation", "MT4"],
    fcaRegulated: true,
    pros: ["Incredible charting", "Thousands of markets", "UK listed company"],
    cons: ["Platform can be overwhelming", "Higher costs for small accounts"],
    affiliateUrl: "https://www.cmcmarkets.com",
    category: "Stocks"
  },
  {
    id: "plus500",
    name: "Plus500",
    slug: "plus500-review",
    logo: "/brokers/plus500.svg",
    oneLine: "Clean, simple mobile-first CFD trading",
    rating: 4.2,
    minDeposit: "£100",
    spreads: "Dynamic",
    platforms: ["Plus500 Web", "Mobile App"],
    fcaRegulated: true,
    pros: ["Easiest UI for mobile", "Fast onboarding", "Publicly listed company"],
    cons: ["CFD only (no dividends)", "Limited technical indicators"],
    affiliateUrl: "https://www.plus500.com",
    category: "Beginner"
  }
];

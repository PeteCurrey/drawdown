export interface TradingTool {
  id: string;
  name: string;
  slug: string;
  logo: string;
  category: "Charting" | "Journal" | "Backtesting" | "VPS" | "Market Data" | "AI Tool";
  tagline: string;
  rating: number;
  pricing: string;
  affiliateUrl: string;
  pros: string[];
  cons: string[];
  overview: string;
  verdict: string;
  faqs: { question: string; answer: string }[];
}

export const tradingTools: TradingTool[] = [
  {
    id: "tradingview",
    name: "TradingView",
    slug: "tradingview",
    logo: "https://upload.wikimedia.org/wikipedia/commons/4/40/TradingView_Logo.svg",
    category: "Charting",
    tagline: "The world's leading charting platform and social network for active traders.",
    rating: 4.9,
    pricing: "Free / From $12.95/mo",
    affiliateUrl: "/go/tradingview",
    pros: [
      "Unrivaled charting speeds and clean browser interface",
      "Massive indicators library and Pine Script v5 development",
      "Native broker integrations for direct execution",
      "Robust alerts system based on technical events"
    ],
    cons: [
      "Real-time exchange data requires separate subscriptions",
      "Customer support is restricted for free tier users"
    ],
    overview: "TradingView is the gold standard for charting in 2026. Used by over 50 million traders worldwide, it operates completely in the browser or via desktop apps. It integrates standard indicators, drawing tools, multi-device layout syncing, and the Pine Script scripting engine for designing strategies.",
    verdict: "Essential tool for any trader. If you aren't using TradingView for analysis, you are trading at a significant disadvantage.",
    faqs: [
      { question: "Is TradingView free?", answer: "Yes, TradingView offers a fully functional free tier with limited indicators per chart. Paid tiers unlock layouts, alerts, and more indicators." },
      { question: "Can I trade directly from TradingView?", answer: "Yes, you can connect supported brokers like Pepperstone directly to trade from the charts." }
    ]
  },
  {
    id: "tradervue",
    name: "Tradervue",
    slug: "tradervue",
    logo: "/logos/tradervue.svg",
    category: "Journal",
    tagline: "Log, analyze, and share your trades automatically.",
    rating: 4.6,
    pricing: "Free / From $29/mo",
    affiliateUrl: "/go/tradervue",
    pros: [
      "Automated import for 80+ platforms and brokers",
      "Deep risk metrics and win-expectancy attribution",
      "Easy trade sharing for coaching purposes"
    ],
    cons: [
      "Interface feels slightly dated",
      "Free version is limited to 100 imports per month"
    ],
    overview: "Tradervue is a dedicated trading journal built for serious active traders. It supports importing execution files directly from MT4/MT5, TradingView, and standard brokers, providing detailed attribution analysis of your expectancy, drawdown, and daily performance metrics.",
    verdict: "The most respected spreadsheet replacement for active journaling. High value for metric tracking.",
    faqs: [
      { question: "Does Tradervue sync with MT4/MT5?", answer: "Yes, you can export your account history file and import it directly into Tradervue in seconds." }
    ]
  },
  {
    id: "forex-tester",
    name: "Forex Tester",
    slug: "forex-tester",
    logo: "/logos/forextester.svg",
    category: "Backtesting",
    tagline: "Professional software for simulating manual forex trading.",
    rating: 4.7,
    pricing: "From $149 (One-Time)",
    affiliateUrl: "/go/forex-tester",
    pros: [
      "Realistic speed control and historical news feed simulator",
      "Support for multi-chart layouts and customized scripts",
      "Preloaded with 20+ years of high-quality tick data"
    ],
    cons: [
      "Requires software download (Windows only)",
      "Steep learning curve for custom indicators"
    ],
    overview: "Forex Tester is the premier software for manual backtesting. It simulates live market conditions, allowing you to run years of historical charts in hours, record your trades manually, and verify your edge before committing live capital.",
    verdict: "Best manual backtester on the market. Indispensable for backtesting swing and day trading setups.",
    faqs: []
  },
  {
    id: "forexvps",
    name: "ForexVPS",
    slug: "forexvps",
    logo: "/logos/forexvps.svg",
    category: "VPS",
    tagline: "Ultra-low latency virtual servers for automated trading systems.",
    rating: 4.8,
    pricing: "From $24.99/mo",
    affiliateUrl: "/go/forexvps",
    pros: [
      "Sub-2ms latency to Equinix London (LD4) and New York (NY4)",
      "99.99% uptime guarantee with automated backups",
      "Pre-installed MT4/5 terminals for fast setup"
    ],
    cons: [
      "Setting up custom OS versions can be complex"
    ],
    overview: "ForexVPS provides high-performance virtual private servers specifically optimized for hosting trading terminals and Expert Advisors (EAs). By locating their servers inside Equinix data centers, they reduce execution slippage and ensure EAs run 24/7.",
    verdict: "Highly reliable VPS hosting with lightning-fast execution times. The gold standard for EA hosting.",
    faqs: []
  },
  {
    id: "dxfeed",
    name: "dxFeed",
    slug: "dxfeed",
    logo: "/logos/dxfeed.svg",
    category: "Market Data",
    tagline: "Institutional-grade real-time market data feeds.",
    rating: 4.8,
    pricing: "Custom/From $39/mo",
    affiliateUrl: "/go/dxfeed",
    pros: [
      "Direct feed connections to primary exchanges (CME, NYSE)",
      "Zero-lag tick data delivery",
      "Supported by top charting software"
    ],
    cons: [
      "Complex signup and verification process for professional tiers"
    ],
    overview: "dxFeed is a leading provider of real-time and historical market data for institutional and retail traders. They deliver pure exchange-cleared data directly into terminal platforms, completely removing the filtering or delays typical of cheap retail feeds.",
    verdict: "The absolute gold standard for pure, unfiltered market data. Crucial for order-flow analysis.",
    faqs: []
  },
  {
    id: "trade-ideas",
    name: "Trade Ideas",
    slug: "trade-ideas",
    logo: "/logos/tradeideas.svg",
    category: "AI Tool",
    tagline: "AI-powered stock scanning and market intelligence.",
    rating: 4.7,
    pricing: "From $89/mo",
    affiliateUrl: "/go/trade-ideas",
    pros: [
      "Real-time AI trade signals with automated entry/exit guides",
      "Massive scan filtering options for momentum and value setups",
      "Built-in simulator to validate automated alerts"
    ],
    cons: [
      "Higher monthly subscription cost",
      "Interface is complex and data-heavy"
    ],
    overview: "Trade Ideas is the leading AI-powered stock scanner. It analyzes thousands of equities every second, filtering for custom setups, trend breaks, and volume anomalies, delivering high-probability alerts directly to your desktop.",
    verdict: "Outstanding scan engine for momentum stock day traders. High utility if you trade US equities.",
    faqs: []
  }
];

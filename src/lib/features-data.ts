import { LayoutDashboard, Calculator, Scan, History, Mail, LucideIcon } from "lucide-react";

export interface FeatureDetail {
  slug: string;
  name: string;
  subtitle: string;
  description: string;
  icon: LucideIcon;
  image: string;
  tier: "Foundation+" | "Edge+";
  capabilities: {
    title: string;
    description: string;
  }[];
  theEdge: string;
  toolUrl: string;
}

export const FEATURES_DATA: Record<string, FeatureDetail> = {
  "ai-trade-journal": {
    slug: "ai-trade-journal",
    name: "AI Trade Journal",
    subtitle: "Turn your past data into future profits.",
    description: "Your journal shouldn't just be a log—it should be a coach. Our AI analyzes every facet of your trading, from entries to emotions, identifying the invisible patterns that lead to your biggest wins and losses.",
    icon: LayoutDashboard,
    image: "https://images.unsplash.com/photo-1611974717514-cc4ac649b85a?q=80&w=1200",
    tier: "Edge+",
    theEdge: "While most journals track P&L, Drawdown tracks *you*. We find the 20% of your habits that generate 80% of your results, and expose the psychological traps sabotaging your growth.",
    toolUrl: "/tools/journal",
    capabilities: [
      {
        title: "Emotional Profiling",
        description: "Connect your state of mind to your trade results. Discover if fomo or boredom is draining your account."
      },
      {
        title: "Alpha Detection",
        description: "Automated analysis of your strike rate across different sessions, assets, and setups."
      },
      {
        title: "Trade Replay AI",
        description: "Relive your trades with an AI overlay that highlights where you followed your plan—and where you didn't."
      }
    ]
  },
  "risk-calculator": {
    slug: "risk-calculator",
    name: "Risk Calculator",
    subtitle: "Survival is the only game in town.",
    description: "Amateurs focus on how much they can make; professionals focus on how much they can lose. Our risk engine ensures you never take a position that threatens your survival.",
    icon: Calculator,
    image: "https://images.unsplash.com/photo-1551288049-bbbda536ad0a?q=80&w=1200",
    tier: "Foundation+",
    theEdge: "Precision position sizing calibrated for your specific account equity and volatility targets. No guesswork. Just professional-grade math.",
    toolUrl: "/tools/risk-calculator",
    capabilities: [
      {
        title: "Lot Size Optimization",
        description: "Instant calculations for Forex, Crypto, and Equities based on your precise stop-loss distance."
      },
      {
        title: "Drawdown Protection",
        description: "Automated warnings when a position's risk-of-ruin exceeds safe mathematical thresholds."
      },
      {
        title: "Multi-Currency Sync",
        description: "Calculate risk in your native currency across any market in the world with real-time rate conversion."
      }
    ]
  },
  "ai-market-scanner": {
    slug: "ai-market-scanner",
    name: "AI Market Scanner",
    subtitle: "Filter the noise. Find the signal.",
    description: "The market is a flood of data. Our scanner acts as your filter, scouring thousands of data points to find the high-probability setups that align with Pete's core strategies.",
    icon: Scan,
    tier: "Edge+",
    theEdge: "Don't scan for indicators—scan for context. Our AI identifies market structural shifts (MSS) and liquidity sweeps before they become obvious to the retail crowd.",
    toolUrl: "/tools/scanner",
    capabilities: [
      {
        title: "Liquidity Mapping",
        description: "Visualise where big money is hiding. Track the pools of liquidity that dictate price movement."
      },
      {
        title: "Pattern Recognition",
        description: "AI detection of flags, wedges, and complex Elliot wave structures across all timeframes."
      },
      {
        title: "Real-time Alerts",
        description: "Get notified the moment a setup enters 'The Zone' based on your custom criteria."
      }
    ]
  },
  "strategy-backtester": {
    slug: "strategy-backtester",
    name: "Strategy Backtester",
    subtitle: "Confidence is built on historical truth.",
    description: "Stop trading on hope. Use historical data to stress-test your strategy against different market conditions, from high-volatility news events to low-volume grinding markets.",
    icon: History,
    tier: "Edge+",
    theEdge: "Our backtester isn't just about the numbers; it's about the 'Why'. We provide a detailed failure analysis for every losing trade in your backtest set.",
    toolUrl: "/tools/backtester",
    capabilities: [
      {
        title: "Fast-Forward Data",
        description: "Relive years of market data in minutes with our high-frequency data engine."
      },
      {
        title: "Variable Slippage",
        description: "Realistic testing that accounts for spread widening and slippage during news events."
      },
      {
        title: "Equity Curve Projection",
        description: "Visualise your long-term growth and maximum expected drawdown based on backtest results."
      }
    ]
  },
  "ai-daily-briefing": {
    slug: "ai-daily-briefing",
    name: "AI Daily Briefing",
    subtitle: "Start your day with Pete's bias.",
    description: "Every morning, our AI synthesises the global macro environment, overnight session performance, and upcoming high-impact news into a 2-minute briefing tailored to your watchlist.",
    icon: Mail,
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1200",
    tier: "Edge+",
    theEdge: "No generic news summaries. This is Pete's Voice Profile (PVP) applied to current data. Expect direct, risk-aware guidance that tells you what to look for and, more importantly, when to stay out.",
    toolUrl: "/tools/briefing",
    capabilities: [
      {
        title: "Watchlist Sync",
        description: "Prioritises the pairs and assets you actually trade. No noise from instruments you don't care about."
      },
      {
        title: "Macro-Context",
        description: "Daily breakdowns of Fed moves, economic data prints, and geopolitical shifts."
      },
      {
        title: "Tactical Planning",
        description: "Defines 'Bullish Above' and 'Bearish Below' levels for the day based on high-probability zones."
      }
    ]
  }
};

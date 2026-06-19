import { ShieldCheck, LineChart, Zap, Lock, BrainCircuit, Play, Globe, Percent, Briefcase, LucideIcon } from "lucide-react";

export interface CoursePhase {
  id: number;
  slug: string;
  name: string;
  subtitle: string;
  number: string;
  tier: "Free" | "Foundation" | "Edge" | "Floor";
  duration: string;
  modules_count: number;
  modules_list: string[];
  icon: string;
  image: string;
  description: string;
  full_description: string;
}

export const phases: CoursePhase[] = [
  {
    id: 1,
    slug: "ground-zero",
    number: "01",
    name: "Ground Zero",
    subtitle: "The Foundation of Discipline",
    tier: "Free",
    duration: "4.5 Hours",
    modules_count: 8,
    icon: "ShieldCheck",
    image: "/images/nav/phase-01.png",
    description: "Unlearn the noise. Build the fundamental psychological and mechanical foundation every trader needs before touching a chart.",
    full_description: "Phase 01 is designed to strip away the bad habits and false expectations that plague most retail traders. We focus on the environment, the routine, and the mathematics of risk before we ever look for a trade setup. This is where professional discipline begins.",
    modules_list: [
      "Why 90% of Traders Lose Money",
      "How Financial Markets Actually Work",
      "Understanding Price — What a Chart Really Shows",
      "The Three Types of Market Participant",
      "What Spread Betting Is and Why It Matters for UK Traders",
      "Understanding Risk — The Maths That Keep You in the Game",
      "Choosing Your Instrument — What to Trade and Why",
      "Setting Up Your Trading Environment"
    ]
  },
  {
    id: 2,
    slug: "chart-reader",
    number: "02",
    name: "Chart Reader",
    subtitle: "Market Geometry & Price Action",
    tier: "Foundation",
    duration: "8 Hours",
    modules_count: 12,
    icon: "LineChart",
    image: "/images/tools/strategy-backtester.png",
    description: "Master naked price action. Learn to see what the institutions are doing without relying on lagging indicators or guru 'signals'.",
    full_description: "Stop relying on indicators that only tell you what has already happened. In Phase 02, you will learn to read the story of the tape through raw price action, market structure, and liquidity zones. You'll develop the ability to identify high-probability areas for institutional interest.",
    modules_list: [
      "Structure: Higher Highs & Lower Lows",
      "The Truth About Support & Resistance",
      "Identifying Market Phases",
      "Candlestick Geometry",
      "Liquidity Zones & Balsa Wood",
      "Trend Identification & Strength",
      "Multi-Timeframe Confluence",
      "Volume Profile Basics"
    ]
  },
  {
    id: 3,
    slug: "strategist",
    number: "03",
    name: "Strategist",
    subtitle: "Building Your Edge",
    tier: "Foundation",
    duration: "6.5 Hours",
    modules_count: 10,
    icon: "Zap",
    image: "/images/tools/ai-trade-journal.png",
    description: "Develop, test, and refine high-probability setups. We move from theory to a specific, repeatable mechanical edge.",
    full_description: "A professional trader has a mechanical process. Phase 03 takes your chart reading skills and turns them into a repeatable strategist. We define entry models, exit protocols, and strict rulesets that remove the guesswork from your trading day.",
    modules_list: [
      "Building a Mechanical Ruleset",
      "Session-Based Strategy Selection",
      "Breakout vs. Reversal Entry Models",
      "The Pullback & Retest Protocol",
      "Backtesting Excellence",
      "Analyzing Statistical Edge",
      "Standardizing Your Setups",
      "Strategy Compliance Tracking"
    ]
  },
  {
    id: 4,
    slug: "risk-manager",
    number: "04",
    name: "Risk Manager",
    subtitle: "The Math of Survival",
    tier: "Foundation",
    duration: "3 Hours",
    modules_count: 6,
    icon: "Lock",
    image: "/images/tools/risk-calculator.png",
    description: "The most important phase. Learn the professional position sizing and account management that keeps you in the game.",
    full_description: "You can be right 80% of the time and still go broke. Phase 04 is the defensive wall. We cover advanced position sizing, correlation risk, and the psychology of drawdowns. Learn the formulas that the big funds use to survive decades, not days.",
    modules_list: [
      "The Math of Ruin",
      "Position Sizing Formulas",
      "Fixed vs. Percentage Risk Models",
      "Drawdown Psychology & Recovery",
      "Compounding Capital Safely",
      "Handling Correlation Risk"
    ]
  },
  {
    id: 5,
    slug: "mind-over-market",
    number: "05",
    name: "Mind Over Market",
    subtitle: "Advanced Psychology",
    tier: "Edge",
    duration: "5 Hours",
    modules_count: 10,
    icon: "BrainCircuit",
    image: "/images/tools/ai-daily-briefing.png",
    description: "Conquer the internal battles. Dealing with streaks, tilt, and the loneliness of the screens.",
    full_description: "Trading is 20% strategy and 80% mind management. Once you have a mechanical edge, the only thing that can break it is you. Phase 05 dives deep into cognitive biases, emotional regulation, and the performance psychology required to execute under pressure.",
    modules_list: [
      "Identifying Cognitive Biases",
      "Trading the Curve of Discipline",
      "Post-Trade Emotional Analysis",
      "The Professional Routine",
      "Handling a Winning Streak",
      "Conquering the Fear of Missing Out"
    ]
  },
  {
    id: 6,
    slug: "the-edge",
    number: "06",
    name: "The Edge",
    subtitle: "Portfolio & AI Integration",
    tier: "Floor",
    duration: "12 Hours",
    modules_count: 14,
    icon: "Play",
    image: "/images/tools/ai-market-scanner.png",
    description: "Scaling up. Integrating custom AI workflows, portfolio diversification, and long-term wealth management.",
    full_description: "At the highest level, trading is about optimization and scale. Phase 06 introduces advanced institutional tools: order flow depth, AI-assisted journaling, and complex portfolio management. This is designed for those looking to manage six and seven-figure capital.",
    modules_list: [
      "Institutional Order Flow",
      "Delta & Footprint Analysis",
      "Scalping the Tape",
      "AI-Assisted Journaling",
      "Portfolio Diversification",
      "Scaling for Prop Firms"
    ]
  },
  {
    id: 7,
    slug: "fundamental-edge",
    number: "07",
    name: "Fundamental Edge",
    subtitle: "Macroeconomics & Market Catalysts",
    tier: "Edge",
    duration: "6 Hours",
    modules_count: 6,
    icon: "Globe",
    image: "/images/tools/ai-daily-briefing.png",
    description: "Learn to trade high-impact news, macroeconomic indicators, and central bank policies without getting caught in the noise.",
    full_description: "Technical analysis tells you where price might go, but fundamentals tell you why it moves. Phase 07 teaches you how to interpret high-impact events like interest rate decisions, CPI inflation data, and Non-Farm Payrolls (NFP). You'll develop a systematic process for trading around news releases and exploiting structural volatility.",
    modules_list: [
      "Macroeconomics 101: Central Banks & Interest Rates",
      "High-Impact Indicators: CPI, GDP, and Employment Data",
      "The Mechanics of News Cycles: Pricing-in vs. Deviations",
      "Trading Volatile Markets: Managing Risk During Spikes",
      "Sentiment Analysis: Commitments of Traders (COT) Report",
      "Correlations: Bonds, Commodities, and FX Yields"
    ]
  },
  {
    id: 8,
    slug: "derivatives-options",
    number: "08",
    name: "Derivatives & Options",
    subtitle: "Leveraging CFDs, Options & Risk Profiles",
    tier: "Edge",
    duration: "7 Hours",
    modules_count: 6,
    icon: "Percent",
    image: "/images/tools/risk-calculator.png",
    description: "Master derivative contracts. Understand leverage, margin requirements, contract sizing, and hedging strategies using CFDs and options.",
    full_description: "To execute professionally, you must understand the mathematics of your trading vehicles. Phase 08 covers the mechanics of CFD contracts, option Greeks, and margin limits. You will learn how to structure complex risk profiles, leverage capital safely, and hedge exposure across correlated markets.",
    modules_list: [
      "CFD Mechanics: Leverage, Margin & Financing Costs",
      "CFDs vs. Spread Betting vs. Direct Share Ownership",
      "Introduction to Options: Puts, Calls & Risk Profiles",
      "Understanding Option Greeks: Delta, Theta, and Vega",
      "Hedging Strategies: Protecting Capital in Adverse Conditions",
      "Choosing the Right Product for Your Account Size"
    ]
  },
  {
    id: 9,
    slug: "portfolio-architect",
    number: "09",
    name: "Portfolio Architect",
    subtitle: "Long-Term Wealth & Allocation",
    tier: "Floor",
    duration: "8 Hours",
    modules_count: 6,
    icon: "Briefcase",
    image: "/images/nav/phase-01.png",
    description: "Move beyond short-term speculation. Learn to construct a diversified, institutional-grade investment portfolio for long-term wealth.",
    full_description: "Speculative trading generates active income, but long-term wealth is built through passive allocation. Phase 09 transitions you from a short-term speculator to a portfolio architect. Learn how to allocate capital across equities, bonds, gold, and real estate, manage drawdown correlations, and rebalance assets systematically.",
    modules_list: [
      "Investing vs. Saving: The Power of Compounding",
      "Asset Classes: Equities, Fixed Income, Commodities & Crypto",
      "Modern Portfolio Theory & Diversification Basics",
      "Constructing a Core-Satellite Portfolio",
      "Systematic Rebalancing & Dividend Reinvestment",
      "Tax-Efficient Investing: ISAs, SIPPs, and Capital Gains"
    ]
  }
];

export const phaseIconMap: Record<string, LucideIcon> = {
  ShieldCheck,
  LineChart,
  Zap,
  Lock,
  BrainCircuit,
  Play,
  Globe,
  Percent,
  Briefcase
};

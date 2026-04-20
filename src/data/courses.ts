import { ShieldCheck, LineChart, Zap, Lock, BrainCircuit, Play, LucideIcon } from "lucide-react";

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
  icon: string; // Storing as string to avoid LucideIcon issues in some contexts, or we can export a mapping
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
    description: "Unlearn the noise. Build the fundamental psychological and mechanical foundation every trader needs before touching a chart.",
    full_description: "Phase 01 is designed to strip away the bad habits and false expectations that plague most retail traders. We focus on the environment, the routine, and the mathematics of risk before we ever look for a trade setup. This is where professional discipline begins.",
    modules_list: [
      "The Honest Reality of Trading",
      "Setting Up Your Professional Environment",
      "Risk First: The Survival Mindset",
      "Market Theory & Mechanics",
      "Order Types & Execution",
      "The Power of the Daily Routine",
      "Introduction to the Trade Journal",
      "Phase 1 Assessment"
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
];

export const phaseIconMap: Record<string, LucideIcon> = {
  ShieldCheck,
  LineChart,
  Zap,
  Lock,
  BrainCircuit,
  Play
};

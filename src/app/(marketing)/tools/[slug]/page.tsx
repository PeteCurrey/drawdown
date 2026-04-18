"use client";

import { useParams, notFound } from "next/navigation";
import { 
  ArrowLeft, 
  CheckCircle2, 
  ArrowRight,
  ShieldAlert,
  Terminal,
  Layers,
  Activity
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const toolDetails: Record<string, any> = {
  "ai-trade-journal": {
    title: "AI Trade Journal",
    tagline: "Performance attribution for the modern age.",
    description: "Stop repeating the same mistakes. Our AI Trade Journal doesn't just record prices; it records psychology, market regime, and technical execution. Then, it tells you exactly where your edge is leaking.",
    longDescription: "Most traders fail because they don't actually know what works. The Drawdown AI Journal uses proprietary sentiment analysis to cross-reference your trades against institutional flow, helping you identify if your wins are skill-based or luck-driven.",
    features: [
      "Real-time Equity Curve with Drawdown Modeling",
      "Psychological Tagging & Sentiment Heatmaps",
      "Institutional Flow Cross-Referencing",
      "Automated Trade Import & Multi-Broker Support"
    ],
    stats: [
      { label: "Data Points", value: "450+" },
      { label: "Analysis Speed", value: "<100ms" },
      { label: "Accuracy", value: "99.9%" }
    ],
    cta: "Start Your Journal"
  },
  "risk-calculator": {
    title: "Institutional Position Sizer",
    tagline: "Mathematical certainty in every trade.",
    description: "Retail calculators are too simple. Our engine accounts for correlated risk, volatility-adjusted position sizing (ATR), and multi-currency margin requirements simultaneously.",
    longDescription: "Protecting your capital is the only way to stay in the game. Our calculator allows you to model entire multi-asset portfolios to ensure that a single market event doesn't trigger a catastrophic drawdown across correlated pairs.",
    features: [
      "Volatility-Adjusted (ATR) Sizing",
      "Correlation Risk Mapping",
      "Multiple Position Stacking Alerts",
      "Complex Margin & Leverage Estimation"
    ],
    stats: [
      { label: "Currencies", value: "150+" },
      { label: "Risk Models", value: "12" },
      { label: "Logic", value: "Quant-Safe" }
    ],
    cta: "Calculate Risk"
  },
  "institutional-scanner": {
    title: "Institutional Scanner",
    tagline: "See where the smart money is leaning.",
    description: "Stop chasing indicators. Our scanner identifies institutional levels of supply and demand, volume profile anomalies, and macro-confluence across 24 asset classes.",
    longDescription: "We scan thousands of data points every second to find high-probability opportunities where technical structure aligns with fundamental reality. No noise, just actionable institutional zones.",
    features: [
      "Order Flow & Volume Profiling",
      "Cross-Asset Correlation Scans",
      "High-Impact Macro Event Anchoring",
      "Real-time Technical Consensus"
    ],
    stats: [
      { label: "Assets", value: "1200+" },
      { label: "Scan Time", value: "Real-time" },
      { label: "Confluence", value: "4-Point" }
    ],
    cta: "Enter the Scanner"
  },
  "backtester": {
    title: "Strategy Backtester",
    tagline: "Your trade plan, stress-tested to 2012.",
    description: "Validate your edge with precision. Our engine runs sub-tick simulation on decade-long historical data to prove your strategy's statistical expectancy.",
    longDescription: "Backtesting manually is a recipe for observer bias. Our systematic engine removes emotion, allowing you to run thousands of iterations of your strategy to find the exact parameters for maximum profitability and minimum drawdown.",
    features: [
      "Tick-Level Execution Simulation",
      "Monte Carlo Drawdown Analysis",
      "Custom Strategy Scripting (Quant-ready)",
      "Multi-Timeframe Variable Stress Testing"
    ],
    stats: [
      { label: "History", value: "12+ Yrs" },
      { label: "Iterations", value: "10k/sec" },
      { label: "Precision", value: "Tick-Level" }
    ],
    cta: "Verify Your Strategy"
  },
  "market-charts": {
    title: "Technical Charts",
    tagline: "High-performance data visualization.",
    description: "Built on institutional charting logic, these are not your standard retail platform charts. Optimized for speed and clarity with built-in Drawdown proprietary indicators.",
    longDescription: "Our charting engine is designed for clarity. We've removed the clutter of traditional platforms to focus on what matters: price, timeframe confluence, and institutional levels. Fully synced across your mobile and desktop devices.",
    features: [
      "Proprietary Range & Flow Indicators",
      "Institutional Supply/Demand Drawing Tools",
      "Zero-Lag Price Execution Feeds",
      "Multi-Pane Macro Confluence View"
    ],
    stats: [
      { label: "Latency", value: "Sub-10ms" },
      { label: "Sync", value: "Instant" },
      { label: "Data", value: "Direct Feed" }
    ],
    cta: "Open Charts"
  },
  "daily-briefing": {
    title: "Expert Intelligence Hub",
    tagline: "Information is liquidity.",
    description: "Get the exact same market setup data that Pete and his desk use to trade every day. Direct to your dashboard 30 minutes before every major session open.",
    longDescription: "Market regimes change fast. Our Intelligence Hub provides the macro context, institutional bias, and technical zones you need to navigate the session with confidence. We translate the complex macro landscape into actionable trading zones.",
    features: [
      "Daily Macro Bias Reports",
      "High-Impact Level Mapping",
      "Sentiment & Volatility Forecasts",
      "Weekly Strategic Navigator"
    ],
    stats: [
      { label: "Updates", value: "Daily" },
      { label: "Expertise", value: "Institutional" },
      { label: "Depth", value: "Macro-First" }
    ],
    cta: "Read Briefings"
  }
};

export default function ToolDetailPage() {
  const { slug } = useParams();
  const tool = toolDetails[slug as string];

  if (!tool) {
    notFound();
  }

  return (
    <div className="flex flex-col pt-32 pb-24 min-h-screen bg-background-primary">
      <div className="container mx-auto px-6">
        {/* Breadcrumb */}
        <Link href="/tools" className="inline-flex items-center gap-2 text-text-tertiary hover:text-accent transition-colors text-[10px] font-mono uppercase tracking-widest mb-12">
           <ArrowLeft className="w-3 h-3" /> Back to Tools
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
           {/* Content */}
           <div className="space-y-10">
              <div className="space-y-4">
                 <div className="flex items-center gap-3 text-accent/60">
                    <Terminal className="w-4 h-4" />
                    <span className="text-[10px] font-mono uppercase tracking-[0.3em]">FEATURE_DETAIL // {slug}</span>
                 </div>
                 <h1 className="text-5xl md:text-7xl font-display font-extrabold uppercase tracking-tight leading-tight">
                    {tool.title}
                 </h1>
                 <p className="text-xl text-accent font-mono uppercase tracking-wide opacity-80">
                    {tool.tagline}
                 </p>
              </div>

              <div className="space-y-6">
                 <p className="text-xl text-text-primary leading-relaxed border-l-2 border-accent/20 pl-8 italic">
                    "{tool.description}"
                 </p>
                 <p className="text-md text-text-secondary leading-relaxed">
                    {tool.longDescription}
                 </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-10 border-t border-border-slate">
                 {tool.stats.map((stat: any, i: number) => (
                   <div key={i} className="p-6 bg-background-surface border border-border-slate flex flex-col items-center justify-center text-center">
                      <span className="text-3xl font-display font-black text-text-primary mb-1">{stat.value}</span>
                      <span className="text-[9px] font-mono uppercase text-text-tertiary tracking-widest">{stat.label}</span>
                   </div>
                 ))}
              </div>

              <div className="pt-10">
                 <Link href="/signup" className="inline-flex items-center gap-4 bg-accent text-background-primary px-10 py-5 font-bold uppercase tracking-widest text-xs hover:bg-accent-hover transition-all group">
                    {tool.cta}
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
                 </Link>
              </div>
           </div>

           {/* Features & Visual Block */}
           <div className="space-y-12">
              <div className="p-10 bg-background-surface border border-border-slate relative overflow-hidden group">
                 <div className="relative z-10 space-y-8">
                    <div className="flex items-center gap-3 border-b border-border-slate pb-6">
                       <Layers className="w-5 h-5 text-accent" />
                       <h3 className="text-xl font-display font-bold uppercase tracking-widest">Key Features</h3>
                    </div>
                    
                    <div className="space-y-6">
                       {tool.features.map((feature: string, i: number) => (
                         <div key={i} className="flex items-start gap-4 group/item">
                            <CheckCircle2 className="w-5 h-5 text-profit mt-0.5 shrink-0 transition-scale group-hover/item:scale-110" />
                            <span className="text-sm text-text-primary uppercase tracking-tight leading-snug group-hover/item:text-accent transition-colors">
                               {feature}
                            </span>
                         </div>
                       ))}
                    </div>

                    <div className="pt-10 space-y-4">
                       <div className="flex items-center gap-2 text-[10px] font-mono text-text-tertiary uppercase tracking-widest">
                          <ShieldAlert className="w-3 h-3" /> Note: Feature access depends on plan level.
                       </div>
                    </div>
                 </div>

                 {/* Decorative background visual */}
                 <div className="absolute -bottom-10 -right-10 opacity-5 pointer-events-none group-hover:translate-x-2 group-hover:-translate-y-2 transition-transform duration-1000">
                    <Activity className="w-64 h-64 text-accent" />
                 </div>
              </div>

              {/* Mock UI Representation */}
              <div className="aspect-video bg-background-primary border border-border-slate relative overflow-hidden flex items-center justify-center p-12">
                 <div className="w-full h-full border border-accent/10 bg-accent/5 relative">
                    <div className="absolute top-0 left-0 w-full h-1 bg-accent/20" />
                    <div className="absolute inset-0 flex items-center justify-center">
                       <span className="text-[10px] font-mono uppercase text-accent/30 tracking-[0.5em] animate-pulse">Preview Visualization</span>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}

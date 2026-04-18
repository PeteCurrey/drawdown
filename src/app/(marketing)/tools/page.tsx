"use client";

import { 
  Wrench, 
  BarChart3, 
  Percent, 
  LayoutDashboard, 
  History, 
  Cpu, 
  ArrowRight,
  ShieldCheck,
  Zap
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const toolCategories = [
  {
    slug: "ai-trade-journal",
    title: "AI Trade Journal",
    description: "Institutional-grade logging with sentiment analysis and performance attribution.",
    icon: LayoutDashboard,
    features: ["Automated Logging", "Sentiment Tracking", "Visual Equity Curve"],
    tier: "Foundation",
    color: "accent"
  },
  {
    slug: "risk-calculator",
    title: "Position Sizer",
    description: "Advanced risk-of-ruin management and complex multi-asset positioning.",
    icon: Percent,
    features: ["Drawdown Modeling", "Margin Optimization", "Position Sizing"],
    tier: "Free",
    color: "profit"
  },
  {
    slug: "institutional-scanner",
    title: "Technical Scanner",
    description: "Cross-asset technical consensus & price action relative to key macro levels.",
    icon: Zap,
    features: ["Macro Correlation", "Technical Consensus", "Multi-Timeframe Scan"],
    tier: "Edge",
    color: "premium"
  },
  {
    slug: "backtester",
    title: "Strategy Backtester",
    description: "Validate your edge on decade-long historical data with sub-millisecond precision.",
    icon: History,
    features: ["Optimization Engine", "Monte Carlo Sim", "Detailed Stats"],
    tier: "Edge",
    color: "accent"
  },
  {
    slug: "market-charts",
    title: "Technical Charts",
    description: "High-performance charting with internal institutional indicators and logic.",
    icon: BarChart3,
    features: ["Custom Indicators", "Drawing Tools", "Multi-Device Sync"],
    tier: "Foundation",
    color: "accent"
  },
  {
    slug: "daily-briefing",
    title: "Intelligence Hub",
    description: "Expert market takes and analysis delivered to your dashboard every session.",
    icon: Cpu,
    features: ["Pete's Daily Bias", "Macro Calendar", "Sentiment Gauge"],
    tier: "Free",
    color: "warning"
  }
];

export default function ToolsMarketingPage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 bg-background-primary overflow-hidden border-b border-border-slate">
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl space-y-8">
            <div className="flex items-center gap-3 text-accent transition-all duration-700">
               <div className="w-8 h-[1px] bg-accent" />
               <span className="text-[10px] font-mono uppercase tracking-[0.3em]">PROPRIETARY_TECH_STACK</span>
            </div>
            
            <h1 className="text-6xl md:text-8xl font-display font-extrabold uppercase tracking-tight leading-[0.9]">
              The <span className="text-accent underline decoration-accent/20">Alpha</span> Stack.
            </h1>
            
            <p className="text-xl md:text-2xl text-text-secondary leading-relaxed max-w-2xl">
              Professional-grade tools built by traders, for traders. No generic alerts. No retail noise. Just institutional-grade execution.
            </p>

            <div className="flex flex-wrap gap-4 pt-4">
              <Link href="/signup" className="px-8 py-4 bg-accent text-background-primary font-bold uppercase tracking-widest text-xs hover:bg-accent-hover transition-colors">
                Get All Access
              </Link>
              <Link href="/pricing" className="px-8 py-4 border border-border-slate hover:border-accent text-text-primary font-bold uppercase tracking-widest text-xs transition-colors">
                View Pricing
              </Link>
            </div>
          </div>
        </div>

        {/* Aesthetic Background Pattern */}
        <div className="absolute top-0 right-0 w-1/2 h-full opacity-10 pointer-events-none overflow-hidden">
           <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_10%,var(--color-accent)_10.5%,transparent_11%)] [background-size:2vw_100%]" />
        </div>
      </section>

      {/* Tools Grid */}
      <section className="py-24 bg-background-surface">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1px bg-border-slate border border-border-slate">
             {toolCategories.map((tool) => {
               const Icon = tool.icon;
               return (
                 <div key={tool.slug} className="group p-10 bg-background-primary hover:bg-background-elevated transition-all duration-500 relative overflow-hidden">
                    <div className="text-accent mb-8 flex justify-between items-start">
                       <div className="p-3 bg-background-elevated border border-border-slate group-hover:border-accent group-hover:bg-accent/5 transition-all">
                          <Icon className="w-8 h-8" />
                       </div>
                       <span className={cn(
                          "text-[8px] font-mono uppercase tracking-widest px-2 py-1 border",
                          tool.tier === "Free" ? "text-profit border-profit/30" : 
                          tool.tier === "Foundation" ? "text-accent border-accent/30" : 
                          "text-premium border-premium/30"
                       )}>
                          {tool.tier}
                       </span>
                    </div>

                    <h3 className="text-2xl font-display font-bold uppercase mb-4 text-text-primary group-hover:text-accent transition-colors">
                       {tool.title}
                    </h3>
                    
                    <p className="text-sm text-text-secondary leading-relaxed mb-8 h-12">
                       {tool.description}
                    </p>

                    <div className="space-y-3 mb-10">
                       {tool.features.map((feature, i) => (
                         <div key={i} className="flex items-center gap-3 text-text-tertiary">
                            <ShieldCheck className="w-4 h-4 text-accent/40" />
                            <span className="text-[10px] font-mono uppercase tracking-widest">{feature}</span>
                         </div>
                       ))}
                    </div>

                    <Link 
                      href={`/tools/${tool.slug}`}
                      className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-accent group-hover:gap-4 transition-all"
                    >
                       Learn More <ArrowRight className="w-3 h-3" />
                    </Link>

                    {/* Background Detail */}
                    <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none group-hover:opacity-10 transition-opacity">
                       <Icon className="w-32 h-32" />
                    </div>
                 </div>
               );
             })}
          </div>
        </div>
      </section>

      {/* CTA Footer */}
      <section className="py-32 bg-background-primary border-t border-border-slate">
         <div className="container mx-auto px-6 text-center">
            <div className="max-w-3xl mx-auto space-y-10">
               <h2 className="text-5xl md:text-7xl font-display font-black uppercase tracking-tighter leading-none">
                  Ready to stop <span className="text-loss">guessing?</span>
               </h2>
               <p className="text-xl text-text-secondary leading-relaxed uppercase tracking-widest font-mono text-sm opacity-60">
                  Data-driven edge is only one decision away.
               </p>
               <Link href="/signup" className="inline-flex items-center gap-4 bg-accent text-background-primary px-12 py-6 font-display font-black uppercase tracking-[0.2em] text-sm hover:translate-y-[-2px] transition-all shadow-xl shadow-accent/20">
                  Secure Your Access
               </Link>
            </div>
         </div>
      </section>
    </div>
  );
}

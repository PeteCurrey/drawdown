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
  Zap,
  Terminal
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

const toolCategories = [
  {
    slug: "ai-trade-journal",
    title: "AI Trade Journal",
    description: "Institutional-grade logging with sentiment analysis and performance attribution.",
    icon: LayoutDashboard,
    features: ["Automated Logging", "Sentiment Tracking", "Visual Equity Curve"],
    tier: "Edge+",
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
    slug: "ai-market-scanner",
    title: "Technical Scanner",
    description: "Cross-asset technical consensus & price action relative to key macro levels.",
    icon: Zap,
    features: ["Macro Correlation", "Technical Consensus", "Multi-Timeframe Scan"],
    tier: "Edge+",
    color: "premium"
  },
  {
    slug: "strategy-backtester",
    title: "Strategy Backtester",
    description: "Validate your edge on decade-long historical data with rapid precision.",
    icon: History,
    features: ["Optimization Engine", "Monte Carlo Sim", "Detailed Stats"],
    tier: "Edge+",
    color: "accent"
  },
  {
    slug: "market-charts",
    title: "Technical Charts",
    description: "High-performance charting with internal institutional indicators and logic.",
    icon: BarChart3,
    features: ["Custom Indicators", "Drawing Tools", "Multi-Device Sync"],
    tier: "Foundation+",
    color: "accent"
  },
  {
    slug: "intelligence-hub",
    title: "Intelligence Hub",
    description: "Expert market takes and analysis delivered to your dashboard every session.",
    icon: Cpu,
    features: ["Pete's Daily Bias", "Macro Calendar", "Sentiment Gauge"],
    tier: "Foundation+",
    color: "warning"
  },
  {
    slug: "algo-strategy-builder",
    title: "Algo Strategy Builder",
    description: "Describe your strategy. Get the code. AI-powered conversion of rules to Pine Script or Python.",
    icon: Terminal,
    features: ["Natural Language Input", "Pine Script v5", "Python Backtrader"],
    tier: "Floor",
    color: "premium"
  }
];

export default function ToolsMarketingPage() {
  return (
    <div className="flex flex-col bg-background-primary text-text-primary min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden border-b border-border-slate/50 min-h-screen flex flex-col justify-center">
        <div className="w-full max-w-7xl mx-auto px-6 relative z-10">
          <div className="max-w-3xl space-y-8">
            <span className="text-[11px] font-sans font-bold text-text-tertiary uppercase tracking-widest block">
              // PROPRIETARY TECH STACK
            </span>
            
            <h1 className="text-4xl md:text-6xl font-sans font-extrabold tracking-tight text-text-primary leading-tight">
              The Alpha Stack.
            </h1>
            
            <p className="text-base text-text-tertiary leading-relaxed max-w-2xl font-sans">
              Professional-grade tools built by traders, for traders. No generic alerts. No retail noise. Just institutional-grade execution.
            </p>

            <div className="flex flex-wrap gap-3 pt-2">
              <Link href="/signup" className="px-7 py-3 rounded-lg bg-mkt-ink text-white font-sans font-semibold text-sm hover:bg-neutral-800 transition-colors">
                Get All Access
              </Link>
              <Link href="/pricing" className="px-7 py-3 rounded-lg border border-border-slate/50 hover:border-border-slate text-text-primary font-sans font-semibold text-sm transition-colors">
                View Pricing
              </Link>
            </div>
          </div>
        </div>

        {/* Aesthetic Background Pattern */}
        <div className="absolute top-0 right-0 w-1/2 h-full opacity-5 pointer-events-none overflow-hidden">
           <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_10%,var(--color-accent)_10.5%,transparent_11%)] [background-size:2vw_100%]" />
        </div>
      </section>

      {/* Intro / Philosophy Section */}
      <section className="py-24 border-b border-border-slate/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-6">
              <span className="text-[11px] font-sans font-bold text-text-tertiary uppercase tracking-widest block mb-4">
                // THE DRAWDOWN DIFFERENCE
              </span>
              <h2 className="text-3xl md:text-5xl font-sans font-extrabold tracking-tight text-text-primary leading-tight">
                We Built What <br />
                <span className="text-text-secondary">We Couldn't Find.</span>
              </h2>
              <div className="w-12 h-1 bg-accent mb-8" />
              <p className="text-lg text-text-secondary leading-relaxed font-sans font-light">
                The retail trading industry is built on lagging indicators, arbitrary patterns, and false promises. We got tired of using scattered, retail-grade tools to manage serious capital. 
              </p>
              <p className="text-lg text-text-secondary leading-relaxed font-sans font-light">
                Drawdown's tool suite is engineered from the ground up for precision, speed, and statistical validity. Every scanner, backtester, and journal feature was built because our own trading desk demanded it.
              </p>
              
              <div className="pt-6 grid grid-cols-2 gap-8">
                <div>
                  <div className="text-3xl font-sans font-extrabold text-text-primary mb-2">100%</div>
                  <p className="text-[10px] font-mono uppercase tracking-widest text-text-tertiary">Data-Driven Logic</p>
                </div>
                <div>
                  <div className="text-3xl font-sans font-extrabold text-text-primary mb-2">&lt;1ms</div>
                  <p className="text-[10px] font-mono uppercase tracking-widest text-text-tertiary">Execution Speed</p>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-accent/10 to-transparent blur-3xl opacity-30" />
              <div className="relative bg-background-surface/40 backdrop-blur-md border border-border-slate/50 transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,0,0,0.2)] hover:border-border-slate hover:-translate-y-0.5 p-8 rounded-[14px]">
                <div className="flex items-center gap-4 mb-8 pb-8 border-b border-border-slate/50">
                  <div className="w-12 h-12 rounded-full bg-border-slate overflow-hidden shrink-0 relative">
                    <Image src="/images/pete.jpg" alt="Pete" fill className="w-full h-full object-cover grayscale" />
                  </div>
                  <div>
                    <h4 className="text-text-primary font-bold uppercase tracking-widest text-sm">Pete Currey</h4>
                    <p className="text-[10px] font-mono text-accent uppercase tracking-widest">Head of Trading</p>
                  </div>
                </div>
                <blockquote className="text-xl font-sans italic text-text-secondary leading-relaxed">
                  "If a tool doesn't give us a measurable statistical edge, we don't build it. Period. We aren't here to sell you magic signals; we're here to give you the infrastructure to execute properly."
                </blockquote>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tools Grid Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
             {toolCategories.map((tool) => {
               const Icon = tool.icon;
               return (
                 <div key={tool.slug} className="bg-background-surface/40 border border-border-slate/50 backdrop-blur-md rounded-[14px] p-8 transition-all duration-300 hover:shadow-[0_8px_32px_rgba(0,0,0,0.06)] hover:border-border-slate hover:-translate-y-0.5 relative flex flex-col group overflow-hidden">
                    <div className="text-accent mb-8 flex justify-between items-start">
                       <div className="p-3 bg-background-elevated/40 border border-border-slate/50 group-hover:border-border-slate group-hover:bg-accent/5 transition-all rounded-lg">
                          <Icon className="w-8 h-8" />
                       </div>
                       <span className={cn(
                          "text-[8px] font-mono uppercase tracking-widest px-2 py-1 border rounded-md",
                          tool.tier === "Free" ? "text-profit border-profit/30" : 
                          tool.tier === "Foundation+" ? "text-accent border-border-slate/50/30" : 
                          tool.tier === "Edge+" ? "text-premium border-premium/30" :
                          "text-accent border-border-slate/50/30 bg-accent/5"
                       )}>
                          {tool.tier}
                       </span>
                    </div>

                    <h3 className="text-2xl font-sans font-bold uppercase mb-4 text-text-primary group-hover:text-accent transition-colors">
                       {tool.title}
                    </h3>
                    
                    <p className="text-sm text-text-secondary leading-relaxed mb-8 h-12 font-sans font-light">
                       {tool.description}
                    </p>

                    <div className="space-y-3 mb-10">
                       {tool.features.map((feature, i) => (
                         <div key={i} className="flex items-center gap-3 text-text-tertiary">
                            <ShieldCheck className="w-4 h-4 text-profit" />
                            <span className="text-[10px] font-mono uppercase tracking-widest">{feature}</span>
                         </div>
                       ))}
                    </div>

                    <Link 
                      href={`/tools/${tool.slug}`}
                      className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-accent group-hover:gap-4 transition-all mt-auto pt-4"
                    >
                       Learn More <ArrowRight className="w-3 h-3" />
                    </Link>

                    {/* Background Detail */}
                    <div className="absolute -bottom-8 -right-8 opacity-5 pointer-events-none group-hover:opacity-10 transition-all duration-500 group-hover:scale-110">
                       <Icon className="w-36 h-36" />
                    </div>
                 </div>
               );
             })}
          </div>
        </div>
      </section>

      {/* Trust & Verification Section */}
      <section className="py-24 border-t border-border-slate/50 overflow-hidden relative">
         <div className="max-w-7xl mx-auto px-6 relative z-10">
            <div className="text-center max-w-3xl mx-auto mb-16">
               <span className="text-[11px] font-sans font-bold text-text-tertiary uppercase tracking-widest block mb-4">
                 // INSTITUTIONAL STANDARDS
               </span>
               <h2 className="text-3xl md:text-5xl font-sans font-extrabold tracking-tight text-text-primary leading-tight">
                 Built for <span className="text-text-primary">Survival.</span>
               </h2>
               <p className="text-text-secondary leading-relaxed text-lg font-sans font-light">
                 The tools you use dictate the quality of your execution. We don't compromise on speed, accuracy, or data integrity.
               </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
               <div className="p-8 bg-background-surface/40 border border-border-slate/50 backdrop-blur-md rounded-[14px] hover:border-border-slate hover:-translate-y-0.5 transition-all duration-300">
                  <div className="w-12 h-12 bg-accent/10 flex items-center justify-center mb-6 rounded-lg">
                     <History className="w-6 h-6 text-accent" />
                  </div>
                  <h3 className="text-xl font-sans font-bold uppercase mb-4 text-text-primary">Rigorously Backtested</h3>
                  <p className="text-sm text-text-secondary leading-relaxed font-sans font-light">
                     Every indicator and scanner algorithm is tested against 10+ years of tick-data across multiple asset classes before deployment. We don't release theories; we release proven statistical edges.
                  </p>
               </div>
               
               <div className="p-8 bg-background-surface/40 border border-border-slate/50 backdrop-blur-md rounded-[14px] hover:border-border-slate hover:-translate-y-0.5 transition-all duration-300">
                  <div className="w-12 h-12 bg-profit/10 flex items-center justify-center mb-6 rounded-lg">
                     <Zap className="w-6 h-6 text-profit" />
                  </div>
                  <h3 className="text-xl font-sans font-bold uppercase mb-4 text-text-primary">Zero-Lag Execution</h3>
                  <p className="text-sm text-text-secondary leading-relaxed font-sans font-light">
                     Our infrastructure runs on the edge. Pricing data, scanner alerts, and journal entries are processed with rapid latency, ensuring you never miss a critical market shift.
                  </p>
               </div>

               <div className="p-8 bg-background-surface/40 border border-border-slate/50 backdrop-blur-md rounded-[14px] hover:border-border-slate hover:-translate-y-0.5 transition-all duration-300">
                  <div className="w-12 h-12 bg-premium/10 flex items-center justify-center mb-6 rounded-lg">
                     <ShieldCheck className="w-6 h-6 text-premium" />
                  </div>
                  <h3 className="text-xl font-sans font-bold uppercase mb-4 text-text-primary">Secure & Private</h3>
                  <p className="text-sm text-text-secondary leading-relaxed font-sans font-light">
                     Your trade history and API keys are heavily encrypted. We don't sell your data, we don't counter-trade you, and we don't share your proprietary strategies with anyone.
                  </p>
               </div>
            </div>
         </div>
      </section>

      {/* CTA Footer */}
      <section className="py-32 border-t border-border-slate/50">
         <div className="max-w-7xl mx-auto px-6 text-center">
            <div className="max-w-3xl mx-auto space-y-10">
               <h2 className="text-3xl md:text-5xl font-sans font-extrabold tracking-tight text-text-primary leading-tight uppercase">
                  Ready to stop <span className="text-red-500">guessing?</span>
               </h2>
               <p className="text-xl text-text-secondary leading-relaxed uppercase tracking-widest font-mono text-sm opacity-60">
                  Data-driven edge is only one decision away.
               </p>
               <Link href="/signup" className="inline-flex items-center gap-4 bg-mkt-ink text-white px-8 py-4 font-sans font-semibold text-sm hover:bg-neutral-800 transition-all rounded-lg shadow-xl shadow-accent/10">
                  Secure Your Access
               </Link>
            </div>
         </div>
      </section>
    </div>
  );
}

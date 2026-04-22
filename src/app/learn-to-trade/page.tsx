import { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BookOpen, Target, TrendingUp, Shield, BarChart3, Globe, Zap, Cpu } from "lucide-react";

export const metadata: Metadata = {
  title: "Learn to Trade — Free Educational Guides | Drawdown",
  description: "Comprehensive library of free trading education. From basics to advanced strategies, master the art of trading with Pete's anti-guru guides.",
};

const TOPICS = [
  {
    name: "Day Trading",
    slug: "day-trading",
    description: "Master the art of short-term volatility and intraday execution.",
    icon: Zap
  },
  {
    name: "Forex Trading",
    slug: "forex-trading",
    description: "Navigate the world's largest liquidity pool with precision.",
    icon: Globe
  },
  {
    name: "Risk Management",
    slug: "risk-management",
    description: "The only real edge in trading. Learn how to stay in the game.",
    icon: Shield
  },
  {
    name: "Trading Psychology",
    slug: "trading-psychology",
    description: "Master your emotions and overcome the cognitive biases that kill accounts.",
    icon: Target
  },
  {
    name: "Swing Trading",
    slug: "swing-trading",
    description: "Capture larger market moves without sitting in front of screens all day.",
    icon: TrendingUp
  },
  {
    name: "Technical Analysis",
    slug: "technical-analysis",
    description: "Learn to read price action and identify high-probability setups.",
    icon: BarChart3
  },
  {
    name: "Spread Betting",
    slug: "spread-betting",
    description: "Tax-efficient trading for UK residents explained clearly.",
    icon: BookOpen
  },
  {
    name: "Algorithmic Trading",
    slug: "algorithmic-trading",
    description: "The future of execution. How to leverage code in your trading.",
    icon: Cpu
  }
];

export default function LearnToTradeIndex() {
  return (
    <main className="min-h-screen bg-background-primary pt-32 pb-20 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="max-w-3xl mb-16 space-y-6">
          <div className="text-accent font-mono text-xs tracking-[0.3em] uppercase">// EDUCATIONAL HUB</div>
          <h1 className="text-5xl md:text-7xl font-display font-bold uppercase tracking-tighter leading-[0.9]">
            Master the <br /> Business <span className="text-accent italic">of</span> Risk
          </h1>
          <p className="text-text-tertiary font-mono text-sm uppercase tracking-widest leading-relaxed">
            Free, honest, UK-focused education for traders who are done with the hype.
          </p>
        </div>

        {/* Topics Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {TOPICS.map((topic) => (
            <Link 
              key={topic.slug} 
              href={`/learn-to-trade/${topic.slug}`}
              className="group bg-background-elevated border border-border-slate p-8 hover:border-accent transition-all flex flex-col"
            >
              <div className="mb-6 p-4 bg-background-surface w-fit group-hover:bg-accent group-hover:text-background-primary transition-colors">
                <topic.icon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-display font-bold mb-3 uppercase tracking-wider">{topic.name}</h3>
              <p className="text-sm text-text-tertiary leading-relaxed mb-8 flex-1">{topic.description}</p>
              <div className="flex items-center space-x-2 text-[10px] font-mono uppercase tracking-[0.2em] text-accent">
                <span>Read Guide</span>
                <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>

        {/* Secondary Grid (Placeholders for remaining 12) */}
        <div className="grid md:grid-cols-3 gap-6 mb-20 opacity-60">
           {["Crypto Trading", "Stock Trading", "CFD Trading", "Options Trading", "Price Action", "Order Flow"].map(name => (
             <Link key={name} href={`/learn-to-trade/${name.toLowerCase().replace(/ /g, '-')}`} className="p-6 border border-border-slate hover:border-accent transition-colors">
                <h4 className="font-mono text-xs uppercase tracking-widest text-text-tertiary">{name} Guide &rarr;</h4>
             </Link>
           ))}
        </div>

        {/* Footer CTA */}
        <section className="bg-background-elevated border border-border-slate p-12 md:p-20 text-center space-y-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-accent/5 pointer-events-none" />
          <h2 className="text-4xl md:text-5xl font-display font-bold uppercase tracking-tight">The Best Education is <span className="text-accent">Practical</span></h2>
          <p className="text-text-secondary font-mono text-sm max-w-xl mx-auto uppercase tracking-widest leading-relaxed">
            Stop reading. Start doing. Get access to our full curriculum and professional trading tools.
          </p>
          <Link href="/signup" className="inline-flex items-center space-x-3 bg-text-primary text-background-primary px-10 py-5 text-xs font-bold uppercase tracking-[0.2em] hover:bg-accent hover:text-background-primary transition-all">
            <span>Join Drawdown Free</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </section>
      </div>
    </main>
  );
}

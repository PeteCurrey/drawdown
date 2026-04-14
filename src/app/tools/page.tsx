"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  Calculator,
  BookOpen,
  Radar,
  History,
  CloudSun,
  BrainCircuit,
  Lock,
  ArrowRight,
} from "lucide-react";

const tools = [
  {
    name: "Risk Calculator",
    description: "Calculate position sizes, risk-reward ratios, and visualise how different risk percentages impact your account over a sequence of trades.",
    href: "/tools/risk-calculator",
    icon: Calculator,
    tier: "free",
    status: "live",
  },
  {
    name: "AI Trade Journal",
    description: "Log every trade with emotional state tracking. Our AI analyses your patterns to find the specific behaviours costing you money.",
    href: "/tools/journal",
    icon: BookOpen,
    tier: "edge",
    status: "live",
  },
  {
    name: "Market Scanner",
    description: "AI-assisted identification of high-probability setups across Forex, Crypto, and UK Equities with real-time alerts.",
    href: "/tools/scanner",
    icon: Radar,
    tier: "edge",
    status: "live",
  },
  {
    name: "Strategy Backtester",
    description: "Describe your strategy in plain English. Our AI converts it to backtestable rules and runs it against years of historical data.",
    href: "/tools/backtester",
    icon: History,
    tier: "floor",
    status: "live",
  },
  {
    name: "The Wire — Daily Briefing",
    description: "Your personalised morning intelligence report covering overnight moves, key levels, and economic events that matter to your watchlist.",
    href: "/tools/briefing",
    icon: CloudSun,
    tier: "edge",
    status: "live",
  },
];

const tierLabels: Record<string, { label: string; color: string }> = {
  free: { label: "Free", color: "text-profit border-profit/30 bg-profit/5" },
  foundation: { label: "Foundation", color: "text-text-primary border-border-slate bg-background-elevated" },
  edge: { label: "Edge", color: "text-accent border-accent/30 bg-accent/5" },
  floor: { label: "Floor", color: "text-premium border-premium/30 bg-premium/5" },
};

export default function ToolsLandingPage() {
  return (
    <div className="pt-32 pb-24 bg-background-primary min-h-screen">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="max-w-3xl mb-20">
          <span className="text-accent font-mono text-[10px] uppercase tracking-widest block mb-4">
            // Trading Intelligence
          </span>
          <h1 className="text-4xl md:text-7xl font-display font-bold uppercase mb-6 leading-tight">
            Tools That Actually <span className="text-accent">Help.</span>
          </h1>
          <p className="text-text-secondary text-lg leading-relaxed max-w-2xl">
            No gimmicks. Every tool here was built to solve a real problem that traders face daily —
            from position sizing to psychological pattern recognition.
          </p>
        </div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-24">
          {tools.map((tool) => {
            const Icon = tool.icon;
            const tier = tierLabels[tool.tier];
            return (
              <Link
                key={tool.name}
                href={tool.href}
                className="group p-8 bg-background-surface border border-border-slate hover:border-accent/40 transition-all duration-500 hover:-translate-y-1 flex flex-col"
              >
                <div className="flex items-center justify-between mb-8">
                  <div className="w-14 h-14 bg-background-elevated border border-border-slate flex items-center justify-center group-hover:border-accent/30 transition-colors">
                    <Icon className="w-6 h-6 text-text-secondary group-hover:text-accent transition-colors" />
                  </div>
                  <span className={cn("text-[8px] font-bold uppercase tracking-widest px-2 py-0.5 border", tier.color)}>
                    {tier.label}
                  </span>
                </div>

                <h3 className="text-xl font-display font-bold uppercase mb-3 group-hover:text-accent transition-colors">
                  {tool.name}
                </h3>
                <p className="text-sm text-text-secondary leading-relaxed flex-grow mb-8">
                  {tool.description}
                </p>

                <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-accent opacity-0 group-hover:opacity-100 transition-opacity mt-auto">
                  Launch Tool <ArrowRight className="w-3 h-3" />
                </div>
              </Link>
            );
          })}
        </div>

        {/* AI Disclosure */}
        <div className="max-w-4xl mx-auto p-10 bg-background-elevated border border-border-slate flex flex-col md:flex-row items-center gap-8">
          <div className="w-16 h-16 bg-accent/10 border border-accent/20 flex items-center justify-center shrink-0">
            <BrainCircuit className="w-8 h-8 text-accent" />
          </div>
          <div>
            <h4 className="text-lg font-display font-bold uppercase mb-2">
              Powered by Claude AI
            </h4>
            <p className="text-sm text-text-secondary leading-relaxed">
              Our AI tools use Anthropic&apos;s Claude to provide analysis and insights. All outputs are
              for educational purposes only and do not constitute financial advice. AI usage is
              metered by subscription tier.
            </p>
          </div>
          <Link
            href="/pricing"
            className="shrink-0 px-8 py-4 border border-border-slate hover:border-accent text-[10px] font-bold uppercase tracking-widest hover:text-accent transition-all"
          >
            View Plans
          </Link>
        </div>
      </div>
    </div>
  );
}

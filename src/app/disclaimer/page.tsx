"use client";

import { AlertTriangle, ShieldCheck, History, Info } from "lucide-react";

export default function DisclaimerPage() {
  const sections = [
    {
      title: "Risk of Loss",
      icon: AlertTriangle,
      color: "text-loss",
      content: "Trading financial instruments involves a high degree of risk. Most retail investor accounts lose money. You should never trade with money you cannot afford to lose. The possibility exists that you could sustain a loss of some or all of your initial investment."
    },
    {
      title: "Educational Purpose",
      icon: Info,
      color: "text-accent",
      content: "Drawdown is an educational platform. We provide tools, data analysis, and curriculum based on historical market behavior. We are NOT registered financial advisors. We do not provide personalized investment advice or trade signals."
    },
    {
      title: "Past Performance",
      icon: History,
      color: "text-text-tertiary",
      content: "Any success stories or historical backtests shown on this site are for illustrative purposes only. Past performance—whether logged in our AI Trade Journal or demonstrated in our Strategy Backtester—is not indicative of future results."
    },
    {
      title: "AI Limitations",
      icon: ShieldCheck,
      color: "text-accent",
      content: "Our AI analysis tools are designed to assist you in finding patterns. However, AI can hallucinate or misinterpret market conditions. All AI-generated outputs (The Wire, Journal Analysis) should be verified through your own independent analysis."
    }
  ];

  return (
    <div className="pt-32 pb-24 bg-background-primary min-h-screen">
      <div className="container mx-auto px-6 max-w-4xl">
        <div className="mb-20">
          <span className="text-accent font-mono text-[10px] uppercase tracking-widest block mb-4">
            // RISK COMMAND
          </span>
          <h1 className="text-4xl md:text-7xl font-display font-bold uppercase mb-8">
            Risk <span className="text-accent">Disclaimer.</span>
          </h1>
          <p className="text-text-secondary text-lg leading-relaxed border-l-4 border-loss pl-8">
            Read this carefully. Trading is a profession of probabilities, not certainties. 
            By using this platform, you acknowledge the inherent risks involved in the financial markets.
          </p>
        </div>

        <div className="space-y-12">
          {sections.map((section, i) => (
            <div key={i} className="p-8 md:p-12 bg-background-surface border border-border-slate">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-10 h-10 bg-background-elevated border border-border-slate flex items-center justify-center">
                  <section.icon className={`w-5 h-5 ${section.color}`} />
                </div>
                <h3 className="text-xl font-display font-bold uppercase tracking-tight">{section.title}</h3>
              </div>
              <p className="text-text-secondary leading-relaxed text-sm md:text-base">
                {section.content}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-20 p-8 bg-background-elevated border border-border-slate/50">
          <p className="text-[10px] font-mono leading-relaxed text-text-tertiary uppercase tracking-widest text-center">
            By accessing or using Drawdown, you are agreeing to these terms. If you do not accept these risks, please disconnect your account and cease use of our tools immediately.
          </p>
        </div>
      </div>
    </div>
  );
}

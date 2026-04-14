"use client";

import { Shield, Lock, Eye, Server } from "lucide-react";

export default function PrivacyPage() {
  const sections = [
    {
      title: "Data We Collect",
      icon: Shield,
      content: "We collect only what is necessary to provide our services. This includes your email for account access, and optional profile information. If you use our AI tools, we log usage metadata to ensure fair usage tier compliance."
    },
    {
      title: "AI & Your Data",
      icon: Server,
      content: "When using our AI Trade Journal or Strategy Backtester, your data is processed through secure API endpoints. We do not use your personal trade data to train public AI models. Your edge remains yours."
    },
    {
      title: "Discord Synchronization",
      icon: Lock,
      content: "When you connect your Discord account, we only access your basic profile (ID and Username) to synchronize your subscription tier with our server roles. We cannot read your private messages."
    },
    {
      title: "Third Party Partners",
      icon: Eye,
      content: "We use Stripe for payment processing and Supabase for secure authentication. These partners have their own strict privacy protocols. We never sell your data to third-party marketers."
    }
  ];

  return (
    <div className="pt-32 pb-24 bg-background-primary min-h-screen">
      <div className="container mx-auto px-6 max-w-4xl">
        <div className="mb-20">
          <span className="text-accent font-mono text-[10px] uppercase tracking-widest block mb-4">
            // LEGAL COMMAND
          </span>
          <h1 className="text-4xl md:text-7xl font-display font-bold uppercase mb-8">
            Privacy <span className="text-accent">Protocol.</span>
          </h1>
          <p className="text-text-secondary text-lg leading-relaxed">
            We value your privacy as much as your pips. This document outlines how we handle 
            your digital footprint on the Drawdown platform.
          </p>
        </div>

        <div className="space-y-12">
          {sections.map((section, i) => (
            <div key={i} className="p-8 md:p-12 bg-background-surface border border-border-slate group hover:border-accent/30 transition-colors">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-10 h-10 bg-background-elevated border border-border-slate flex items-center justify-center group-hover:border-accent/40 transition-colors">
                  <section.icon className="w-5 h-5 text-text-tertiary group-hover:text-accent transition-colors" />
                </div>
                <h3 className="text-xl font-display font-bold uppercase tracking-tight">{section.title}</h3>
              </div>
              <p className="text-text-secondary leading-relaxed text-sm md:text-base">
                {section.content}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-20 pt-12 border-t border-border-slate text-center">
          <p className="text-[10px] font-mono uppercase tracking-widest text-text-tertiary">
            Last Updated: April 14, 2026 // Version 1.0.4
          </p>
        </div>
      </div>
    </div>
  );
}

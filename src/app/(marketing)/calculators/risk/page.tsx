"use client";

import React from "react";
import { ShieldAlert } from "lucide-react";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { LeadMagnet } from "@/components/seo/LeadMagnet";
import { RiskCalculator } from "@/components/tools/RiskCalculator";

export default function RiskCalculatorPage() {
  return (
    <div className="min-h-screen pb-24 pt-32 bg-background-primary text-text-primary">
      <div className="container mx-auto px-6 max-w-5xl">
        <Breadcrumbs 
          items={[
            { label: "Calculators", href: "/calculators" },
            { label: "Risk Modeler", href: "/calculators/risk" }
          ]}
        />

        {/* Hero */}
        <header className="mb-12 max-w-3xl space-y-4">
          <div className="flex items-center gap-3 text-accent">
            <ShieldAlert className="w-4 h-4" />
            <span className="text-[10px] font-mono uppercase tracking-[0.3em]">Risk Modeler</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-sans font-black uppercase leading-tight">
            Risk <span className="text-accent italic">Calculator.</span>
          </h1>
          <p className="text-sm text-text-secondary leading-relaxed">
            Verify how much absolute capital is at risk on your trade and check your account survival metrics instantly.
          </p>
        </header>

        {/* Interactive Calculator Section */}
        <div className="mb-20">
          <RiskCalculator />
        </div>

        {/* SEO Article Content */}
        <article className="prose prose-invert max-w-none text-text-secondary leading-relaxed mb-20 space-y-8 border-t border-border-slate/50/30 pt-16">
          <h2 className="text-3xl font-sans font-black uppercase text-text-primary">Understanding Risk Exposure in Live Markets</h2>
          <p>
            While position sizing tells you how much to buy, the risk calculator shows you the absolute capital cost of a trade failing. By knowing exactly how much cash is at risk, you can stay within your personal risk tolerance levels and protect your trading longevity.
          </p>

          <h3 className="text-xl font-bold uppercase text-text-primary">How to Check Capital Risk</h3>
          <p>
            The risk calculator multiplies your trade volume (lots) by the distance to your stop loss and the currency value of each pip:
          </p>
          <div className="bg-background-primary p-6 border border-border-slate/50 font-mono text-xs overflow-x-auto text-text-primary">
            Cash Risk = Position Size (Lots) × Stop Loss (Pips) × Pip Value
          </div>

          <h3 className="text-xl font-bold uppercase text-text-primary">Why a 1% Limit is Recommended</h3>
          <p>
            Professional traders rarely risk more than 1% to 2% of their account balance per trade. Doing so ensures that even a 10-trade losing streak only draws down the account by roughly 10%, which is relatively easy to recover from. Risking 5% or 10% per trade means you could face account ruin within a single highly volatile trading session.
          </p>
        </article>

        {/* Lead Magnet */}
        <LeadMagnet 
          resourceId="risk-guide" 
          title="Download the Complete Risk Management Guide PDF"
          description="Protect your capital from market swings. This manual covers advanced leverage management, position sizing sheets, and prop challenge protocols."
        />
      </div>
    </div>
  );
}

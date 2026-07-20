import React from "react";
import Link from "next/link";
import { 
  Percent, 
  Calculator, 
  ChevronRight, 
  TrendingUp, 
  ShieldAlert, 
  LineChart, 
  Activity, 
  DollarSign, 
  Layers, 
  ArrowRight 
} from "lucide-react";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { TrackPageView } from "@/components/admin/TrackPageView";

export const metadata = {
  title: "Trading Calculator Hub — Risk & Drawdown Modeler",
  description: "Access our suite of professional trading calculators. Size your positions, manage risk, model drawdowns, and calculate recovery metrics precisely.",
};

const calculators = [
  {
    slug: "position-size",
    title: "Position Size Calculator",
    desc: "Calculate the exact lot size for your trade based on account currency, size, risk percentage, and stop loss.",
    icon: Percent,
    category: "Risk Management"
  },
  {
    slug: "risk",
    title: "Risk Calculator",
    desc: "Convert percentages to cash exposure and view trade survival odds before executing.",
    icon: ShieldAlert,
    category: "Risk Management"
  },
  {
    slug: "drawdown",
    title: "Drawdown Calculator",
    desc: "Model how consecutive losing streaks impact your capital under different win-rate regimes.",
    icon: Activity,
    category: "Drawdown Modeling"
  },
  {
    slug: "drawdown-recovery",
    title: "Drawdown Recovery Calculator",
    desc: "Calculate the precise percentage gain required to return your account back to breakeven.",
    icon: TrendingUp,
    category: "Drawdown Modeling"
  },
  {
    slug: "compounding",
    title: "Compounding Calculator",
    desc: "Project your long-term equity growth by compounding gains daily, weekly, or monthly.",
    icon: LineChart,
    category: "Growth & Profit"
  },
  {
    slug: "risk-of-ruin",
    title: "Risk Of Ruin Calculator",
    desc: "Determine the statistical probability of blowing your account based on win rate and reward-to-risk ratio.",
    icon: ShieldAlert,
    category: "Risk Management"
  },
  {
    slug: "pip-value",
    title: "Pip Value Calculator",
    desc: "Calculate the exact value of a single pip across forex pairs, indices, metals, and crypto.",
    icon: DollarSign,
    category: "Execution Specs"
  },
  {
    slug: "prop-firm-daily-loss",
    title: "Prop Firm Daily Loss Calculator",
    desc: "Determine your maximum daily drawdown floor to prevent breaking strict evaluation limits.",
    icon: Calculator,
    category: "Prop Trading"
  },
  {
    slug: "prop-firm-maximum-loss",
    title: "Prop Firm Maximum Loss Calculator",
    desc: "Calculate the overall static or trailing drawdown safety zone for funded challenges.",
    icon: Calculator,
    category: "Prop Trading"
  }
];

export default function CalculatorsHubPage() {
  return (
    <div className="min-h-screen pb-24 pt-32 bg-background-primary text-text-primary">
      <TrackPageView path="/calculators" />
      <div className="container mx-auto px-6">
        <Breadcrumbs 
          items={[
            { label: "Calculators", href: "/calculators" }
          ]}
        />

        {/* Hero */}
        <div className="max-w-4xl mb-16 space-y-6">
          <div className="flex items-center gap-3 text-accent">
            <div className="w-8 h-[1px] bg-accent" />
            <span className="text-[10px] font-mono uppercase tracking-[0.3em]">Execution Utilities</span>
          </div>
          <h1 className="text-4xl md:text-7xl font-sans font-black uppercase leading-[0.9] text-text-primary">
            Calculator <span className="text-accent italic">Hub.</span>
          </h1>
          <p className="text-lg text-text-secondary max-w-2xl leading-relaxed">
            Professional-grade mathematical utilities designed to replace manual spreadsheet errors. Size your risk, model your drawdowns, and execute with precision.
          </p>
        </div>

        {/* Calculator Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-24">
          {calculators.map((calc) => {
            const Icon = calc.icon;
            return (
              <Link 
                key={calc.slug}
                href={`/calculators/${calc.slug}`}
                className="p-8 border border-border-slate/50 hover:border-accent bg-background-surface/40 backdrop-blur-md flex flex-col justify-between group transition-colors"
              >
                <div className="space-y-6">
                  <div className="flex justify-between items-start">
                    <div className="p-3 bg-background-primary border border-border-slate/50 group-hover:border-accent/30 transition-colors">
                      <Icon className="w-6 h-6 text-accent" />
                    </div>
                    <span className="text-[8px] font-mono uppercase tracking-widest text-text-tertiary bg-background-primary px-2.5 py-1 border border-border-slate/50/50">
                      {calc.category}
                    </span>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-sans font-black uppercase text-text-primary group-hover:text-accent transition-colors">
                      {calc.title}
                    </h3>
                    <p className="text-xs text-text-secondary leading-relaxed h-12 overflow-hidden">
                      {calc.desc}
                    </p>
                  </div>
                </div>
                <div className="pt-8 flex items-center gap-2 text-[9px] font-mono font-bold uppercase tracking-widest text-text-tertiary group-hover:text-accent transition-colors">
                  LAUNCH TOOL <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1.5 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>

        {/* Info Banner */}
        <section className="bg-background-primary border border-border-slate/50 p-12 text-center space-y-6">
          <h2 className="text-3xl font-sans font-black text-text-primary uppercase tracking-tight">Need a custom dashboard?</h2>
          <p className="text-text-secondary text-sm max-w-xl mx-auto leading-relaxed">
            Subscribers gain access to our live API connections and the Drawdown Risk Modeler that hooks directly to your MT4/MT5 trading terminals for automated sizing.
          </p>
          <div className="pt-4">
            <Link 
              href="/pricing"
              className="px-10 py-5 bg-mkt-ink hover:bg-accent-hover text-white text-xs font-black uppercase tracking-widest transition-colors inline-flex items-center gap-2"
            >
              Unlock Pro Modeler <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}

"use client";

import { ArrowRight, Lock, ChevronRight, Activity, Shield, CheckCircle2, TrendingUp } from "lucide-react";
import Link from "next/link";

const dashboardModules = [
  {
    label: "Discipline Score",
    value: "88",
    unit: "/100",
    status: "healthy",
    note: "4-day rule compliance streak",
    color: "text-profit"
  },
  {
    label: "Monthly R:R",
    value: "1:2.7",
    unit: "",
    status: "healthy",
    note: "Above your 1:2 target",
    color: "text-profit"
  },
  {
    label: "Win Rate (MTD)",
    value: "51%",
    unit: "",
    status: "neutral",
    note: "Sufficient with your R:R",
    color: "text-warning"
  },
  {
    label: "Max Drawdown",
    value: "3.2%",
    unit: "",
    status: "healthy",
    note: "Well within 5% daily limit",
    color: "text-profit"
  }
];

const actionItems = [
  { text: "Review 3 untagged trades from yesterday.", urgency: "high" },
  { text: "Sunday Prep memo from Pete is ready.", urgency: "info" },
  { text: "Your EUR/USD win rate has dropped 12% — view attribution report.", urgency: "warning" }
];

export default function DashboardConceptPage() {
  return (
    <div className="flex flex-col min-h-screen pt-24">
      <div className="max-w-7xl mx-auto px-6 py-12 max-w-7xl">

        {/* Page Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12 pb-12 border-b border-border-slate/50">
          <div>
            <p className="text-[10px] font-mono uppercase tracking-widest text-text-tertiary mb-2">
              // MEMBER DASHBOARD — EDGE TIER
            </p>
            <h1 className="text-3xl md:text-4xl font-sans font-black uppercase">
              Welcome back, Pete.
            </h1>
          </div>
          <div className="flex gap-4">
            <Link href="/journal" className="px-6 py-3 bg-accent text-[#08090D] font-bold uppercase tracking-widest text-xs hover:bg-accent-hover transition-colors flex items-center gap-2">
              Log A Trade <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Metrics Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {dashboardModules.map((mod, i) => (
            <div key={i} className="bg-background-surface/40 backdrop-blur-md border border-border-slate/50 transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,0,0,0.2)] hover:border-border-slate hover:-translate-y-0.5 p-6 hover:border-border-slate/20 transition-colors">
              <p className="text-[10px] font-mono uppercase tracking-widest text-text-tertiary mb-3">{mod.label}</p>
              <div className={`text-4xl font-sans font-black mb-2 ${mod.color}`}>
                {mod.value}<span className="text-xl text-text-secondary">{mod.unit}</span>
              </div>
              <p className="text-[10px] font-mono text-text-tertiary">{mod.note}</p>
            </div>
          ))}
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">

          {/* Equity Curve (Large) */}
          <div className="lg:col-span-2 bg-background-surface/40 backdrop-blur-md border border-border-slate/50 transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,0,0,0.2)] hover:border-border-slate hover:-translate-y-0.5 p-6 flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-sm font-bold uppercase tracking-widest text-text-primary">Equity Curve</h2>
              <div className="flex gap-2">
                {["1W","1M","3M"].map(t => (
                  <button key={t} className={`text-[10px] font-mono px-3 py-1 border transition-colors ${t === "1M" ? "border-border-slate/50 text-accent" : "border-border-slate/50 text-text-tertiary hover:text-text-primary hover:border-text-primary"}`}>{t}</button>
                ))}
              </div>
            </div>
            {/* Placeholder curve */}
            <div className="flex-grow bg-background-surface/40 backdrop-blur-md border border-border-slate/50 transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,0,0,0.2)] hover:border-border-slate hover:-translate-y-0.5/30 rounded-sm flex items-center justify-center min-h-[200px] relative overflow-hidden">
              <svg className="absolute inset-0 w-full h-full opacity-30" viewBox="0 0 400 200" preserveAspectRatio="none">
                <polyline points="0,180 50,150 100,160 150,120 200,90 250,100 300,60 350,40 400,20" fill="none" stroke="#E4E2DD" strokeWidth="1.5"/>
                <polyline points="0,180 50,150 100,160 150,120 200,90 250,100 300,60 350,40 400,20 400,200 0,200" fill="url(#grad)" opacity="0.3"/>
                <defs>
                  <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#E4E2DD" stopOpacity="0.4"/>
                    <stop offset="100%" stopColor="#E4E2DD" stopOpacity="0"/>
                  </linearGradient>
                </defs>
              </svg>
              <div className="relative z-10 text-center">
                <Activity className="w-8 h-8 text-accent mx-auto mb-2 opacity-40" />
                <p className="text-[10px] font-mono text-text-tertiary uppercase tracking-widest opacity-60">Live data synced from journal</p>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="flex flex-col gap-8">

            {/* Pete's Daily Take */}
            <div className="bg-background-surface/40 backdrop-blur-md border border-border-slate/50 transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,0,0,0.2)] hover:border-border-slate hover:-translate-y-0.5 p-6">
              <div className="flex items-center gap-2 text-warning mb-4">
                <div className="w-2 h-2 rounded-full bg-warning animate-pulse" />
                <span className="text-[10px] font-mono uppercase tracking-widest font-bold">Pete's Daily Take</span>
              </div>
              <p className="text-sm text-text-secondary leading-relaxed mb-4 font-medium">
                "Risk-Off today. DXY bid is strong ahead of PCE data. Sitting on hands until 13:30 GMT. Anything short of the data release is noise."
              </p>
              <Link href="/learn/pete-memo" className="text-[10px] font-mono uppercase tracking-widest text-accent hover:underline flex items-center gap-1">
                Read Full Memo <ChevronRight className="w-3 h-3" />
              </Link>
            </div>

            {/* Macro Events */}
            <div className="bg-background-surface/40 backdrop-blur-md border border-border-slate/50 transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,0,0,0.2)] hover:border-border-slate hover:-translate-y-0.5 p-6">
              <h3 className="text-sm font-bold uppercase tracking-widest text-text-primary mb-4">This Week That Matters</h3>
              <div className="space-y-3">
                {[
                  { time: "Thu 13:30", event: "US Core PCE m/m", impact: "HIGH" },
                  { time: "Fri 07:00", event: "UK GDP q/q", impact: "MED" }
                ].map((ev, i) => (
                  <div key={i} className="flex items-center justify-between py-2 border-b border-border-slate/50/40 last:border-none">
                    <div>
                      <p className="text-xs font-mono text-text-tertiary">{ev.time}</p>
                      <p className="text-sm text-text-primary font-bold">{ev.event}</p>
                    </div>
                    <span className={`text-[10px] font-mono px-2 py-1 uppercase ${ev.impact === "HIGH" ? "text-red-500 bg-loss/10" : "text-warning bg-warning/10"}`}>
                      {ev.impact}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Action Items */}
        <div className="bg-background-surface/40 backdrop-blur-md border border-border-slate/50 transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,0,0,0.2)] hover:border-border-slate hover:-translate-y-0.5 p-6">
          <h2 className="text-sm font-bold uppercase tracking-widest text-text-primary mb-6 flex items-center gap-2">
            <Shield className="w-4 h-4 text-accent" /> Action Items
          </h2>
          <div className="space-y-4">
            {actionItems.map((item, i) => (
              <div key={i} className={`flex items-start gap-4 p-4 border-l-2 ${
                item.urgency === "high" ? "border-loss bg-loss/5" :
                item.urgency === "warning" ? "border-warning bg-warning/5" :
                "border-border-slate/50/30 bg-accent/5"
              }`}>
                <CheckCircle2 className={`w-4 h-4 shrink-0 mt-0.5 ${
                  item.urgency === "high" ? "text-red-500" :
                  item.urgency === "warning" ? "text-warning" : "text-accent"
                }`} />
                <p className="text-sm text-text-secondary">{item.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Upsell for non-Edge users (Gated concept) */}
        <div className="mt-8 border border-premium/20 p-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-premium/5 to-transparent" />
          <div className="relative z-10 flex flex-col md:flex-row gap-6 items-center justify-between">
            <div className="flex items-center gap-4">
              <Lock className="w-10 h-10 text-premium shrink-0" />
              <div>
                <h3 className="text-text-primary font-bold uppercase tracking-widest text-sm mb-1">AI Performance Attribution</h3>
                <p className="text-xs text-text-secondary">Unlock your full breakdown of win rate by session, setup, and psychological state.</p>
              </div>
            </div>
            <Link href="/pricing" className="shrink-0 px-6 py-3 bg-premium text-[#08090D] font-bold uppercase tracking-widest text-xs hover:opacity-90 transition-opacity flex items-center gap-2">
              Upgrade to Edge <TrendingUp className="w-4 h-4" />
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}

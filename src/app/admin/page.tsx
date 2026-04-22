"use client";

import { BarChart4, Users, ArrowUpRight } from "lucide-react";

export default function AdminOverviewPage() {
  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      <div>
        <h1 className="text-3xl font-display font-bold uppercase mb-2">Platform Overview</h1>
        <p className="text-xs text-text-tertiary">Real-time metrics and system health.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: "Total MRR", value: "£4,280", change: "+12%" },
          { label: "Active Subs", value: "142", change: "+8" },
          { label: "AI Calls", value: "842", change: "24h" },
        ].map((stat, i) => (
          <div key={i} className="p-8 bg-background-surface border border-border-slate hover:border-accent/50 transition-colors">
            <p className="text-[10px] font-mono text-text-tertiary uppercase tracking-widest mb-2">{stat.label}</p>
            <div className="flex items-end justify-between">
               <p className="text-3xl font-display font-black">{stat.value}</p>
               <span className="text-[10px] font-mono text-profit font-bold">{stat.change}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-background-surface border border-border-slate h-96 flex flex-col items-center justify-center space-y-4 relative overflow-hidden group">
         <div className="absolute inset-0 bg-gradient-to-t from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
         <BarChart4 className="w-8 h-8 text-accent/20 group-hover:text-accent transition-colors relative z-10" />
         <p className="text-[10px] font-mono uppercase tracking-widest text-text-tertiary relative z-10">MRR Growth Chart: Integration Ready</p>
         <button className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-widest text-accent mt-4 relative z-10 opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0">
           Connect Stripe API <ArrowUpRight className="w-3 h-3" />
         </button>
      </div>
    </div>
  );
}

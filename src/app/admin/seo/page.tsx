"use client";

import { cn } from "@/lib/utils";
import { 
  Search, 
  TrendingUp, 
  Target, 
  BarChart2,
  Crosshair,
  AlertTriangle,
  CheckCircle2,
  Zap,
  Eye,
  MousePointerClick,
  Globe
} from "lucide-react";

export default function SEOSuitePage() {
  return (
    <div className="space-y-12 animate-in fade-in duration-700 pb-24">
      {/* Header */}
      <div className="border-b border-border-slate pb-6">
        <h1 className="text-3xl font-display font-bold uppercase mb-2">SEO Engine</h1>
        <p className="text-xs text-text-tertiary flex items-center gap-2">
          Linked with Google Cloud <CheckCircle2 className="w-3 h-3 text-profit" /> Search Console API Active
        </p>
      </div>

      {/* High Level Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: "Total Impressions", value: "248.5K", trend: "+14%", icon: Eye },
          { label: "Total Clicks", value: "12.4K", trend: "+8%", icon: MousePointerClick },
          { label: "Avg Position", value: "14.2", trend: "-2.1", icon: BarChart2 },
          { label: "Indexed Pages", value: "482", trend: "+12", icon: Globe },
        ].map((stat, i) => {
          const isPositive = stat.trend.startsWith('+') || stat.label === "Avg Position";
          return (
            <div key={i} className="p-6 bg-background-surface border border-border-slate">
               <p className="text-[9px] font-mono text-text-tertiary uppercase tracking-widest mb-4">{stat.label}</p>
               <div className="flex items-end justify-between">
                 <span className="text-2xl font-display font-black">{stat.value}</span>
                 <span className={cn("text-[10px] font-mono font-bold", isPositive ? "text-profit" : "text-loss")}>
                   {stat.trend}
                 </span>
               </div>
            </div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Keyword Performance */}
        <div className="space-y-6">
          <div className="flex items-center gap-3 border-b border-border-slate/50 pb-2">
            <TrendingUp className="w-5 h-5 text-accent" />
            <h2 className="text-xl font-display font-bold uppercase">Top Keywords</h2>
          </div>
          <div className="bg-background-surface border border-border-slate overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-background-elevated/50 text-[9px] font-mono uppercase tracking-widest text-text-tertiary">
                <tr>
                  <th className="px-4 py-3">Query</th>
                  <th className="px-4 py-3">Clicks</th>
                  <th className="px-4 py-3">Pos</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-slate/30 text-xs">
                {[
                  { q: "institutional order flow terminal", c: "1,240", p: "2.4" },
                  { q: "prop firm challenge guide", c: "842", p: "4.1" },
                  { q: "how to read footprints", c: "612", p: "5.8" },
                  { q: "best forex brokers uk", c: "450", p: "11.2" },
                ].map((row, i) => (
                  <tr key={i} className="hover:bg-background-elevated/20 transition-colors">
                    <td className="px-4 py-3 font-bold text-text-secondary">{row.q}</td>
                    <td className="px-4 py-3 font-mono">{row.c}</td>
                    <td className="px-4 py-3 font-mono text-accent">{row.p}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Competitor Analysis Tool */}
        <div className="space-y-6">
          <div className="flex items-center gap-3 border-b border-border-slate/50 pb-2">
            <Crosshair className="w-5 h-5 text-loss" />
            <h2 className="text-xl font-display font-bold uppercase">Competitor Analysis</h2>
          </div>
          <div className="p-6 bg-background-surface border border-border-slate flex flex-col h-full justify-between">
            <div>
              <p className="text-xs text-text-secondary mb-6 leading-relaxed">
                Enter a competitor URL to analyze their keyword density, heading structure, and generate an AI-driven strategy to outrank them.
              </p>
              <div className="flex gap-2 mb-6">
                <input 
                  type="text" 
                  placeholder="https://competitor.com/landing-page"
                  className="flex-grow bg-background-primary border border-border-slate p-3 text-xs outline-none focus:border-loss/50"
                />
                <button className="px-6 py-3 bg-background-elevated border border-border-slate hover:bg-loss/10 hover:border-loss hover:text-loss transition-colors text-[10px] font-bold uppercase tracking-widest flex items-center gap-2">
                  <Zap className="w-3 h-3" /> Analyze
                </button>
              </div>
            </div>

            <div className="p-4 border border-loss/20 bg-loss/5 rounded-sm">
               <div className="flex items-center gap-2 mb-2">
                 <Target className="w-4 h-4 text-loss" />
                 <span className="text-[10px] font-bold uppercase tracking-widest text-loss">Current Target: FTMO</span>
               </div>
               <p className="text-xs text-text-secondary">AI Analysis suggests targeting "drawdown limits" and "no time limits" as secondary LSI keywords to capture their bounce traffic.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


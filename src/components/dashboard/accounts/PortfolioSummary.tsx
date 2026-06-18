'use client';
 
import { DollarSign, Activity, Target, ShieldAlert } from "lucide-react";
import { cn } from "@/lib/utils";
import { DashboardSummary } from "@/types/dashboard";
 
interface PortfolioSummaryProps {
  summary: DashboardSummary;
}
 
export function PortfolioSummary({ summary }: PortfolioSummaryProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Total Balance */}
      <div className="p-6 bg-background-surface border border-border-slate/50 rounded-xl flex flex-col justify-between shadow-[0_8px_32px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_32px_rgba(0,0,0,0.06)] hover:-translate-y-0.5 transition-all duration-300">
        <div className="flex items-center justify-between mb-4">
          <div className="p-2 bg-accent/10 rounded-lg">
            <DollarSign className="w-4 h-4 text-accent" />
          </div>
          <span className="text-[10px] font-mono text-text-tertiary uppercase font-bold">Total Alloc.</span>
        </div>
        <div>
          <h3 className="text-2xl font-display font-black uppercase leading-none mb-1 text-text-primary">
            ${summary.totalBalance.toLocaleString()}
          </h3>
          <p className="text-[10px] font-mono text-text-tertiary uppercase tracking-widest">Gross Balance</p>
        </div>
      </div>
 
      {/* Total Equity */}
      <div className="p-6 bg-background-surface border border-border-slate/50 rounded-xl flex flex-col justify-between shadow-[0_8px_32px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_32px_rgba(0,0,0,0.06)] hover:-translate-y-0.5 transition-all duration-300">
        <div className="flex items-center justify-between mb-4">
          <div className={cn("p-2 rounded-lg", summary.totalEquity >= summary.totalBalance ? "bg-profit/10" : "bg-loss/10")}>
            <Activity className={cn("w-4 h-4", summary.totalEquity >= summary.totalBalance ? "text-profit" : "text-loss")} />
          </div>
          <span className="text-[10px] font-mono text-text-tertiary uppercase font-bold">Current Equity</span>
        </div>
        <div>
          <h3 className={cn("text-2xl font-display font-black uppercase leading-none mb-1", summary.totalEquity >= summary.totalBalance ? "text-profit" : "text-loss")}>
            ${summary.totalEquity.toLocaleString()}
          </h3>
          <p className="text-[10px] font-mono text-text-tertiary uppercase tracking-widest">Real-time NAV</p>
        </div>
      </div>
 
      {/* Average Drawdown */}
      <div className="p-6 bg-background-surface border border-border-slate/50 rounded-xl flex flex-col justify-between shadow-[0_8px_32px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_32px_rgba(0,0,0,0.06)] hover:-translate-y-0.5 transition-all duration-300">
        <div className="flex items-center justify-between mb-4">
          <div className={cn("p-2 rounded-lg", summary.riskStatus === 'safe' ? "bg-profit/10" : "bg-warning/10")}>
            <Target className={cn("w-4 h-4", summary.riskStatus === 'safe' ? "text-profit" : "text-warning")} />
          </div>
          <span className="text-[10px] font-mono text-text-tertiary uppercase font-bold">Avg. Drawdown</span>
        </div>
        <div>
          <h3 className={cn("text-2xl font-display font-black uppercase leading-none mb-1", summary.riskStatus === 'critical' ? "text-loss" : summary.riskStatus === 'warning' ? "text-warning" : "text-text-primary")}>
            {summary.averageDrawdownUsed.toFixed(1)}%
          </h3>
          <p className="text-[10px] font-mono text-text-tertiary uppercase tracking-widest">Combined Exposure</p>
        </div>
      </div>
 
      {/* Active Accounts */}
      <div className="p-6 bg-background-surface border border-border-slate/50 rounded-xl flex flex-col justify-between shadow-[0_8px_32px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_32px_rgba(0,0,0,0.06)] hover:-translate-y-0.5 transition-all duration-300">
        <div className="flex items-center justify-between mb-4">
          <div className="p-2 bg-accent/10 rounded-lg">
            <ShieldAlert className="w-4 h-4 text-accent" />
          </div>
          <span className="text-[10px] font-mono text-text-tertiary uppercase font-bold">Active Firms</span>
        </div>
        <div>
          <h3 className="text-2xl font-display font-black uppercase leading-none mb-1 text-text-primary">
            {summary.activeAccounts}
          </h3>
          <p className="text-[10px] font-mono text-text-tertiary uppercase tracking-widest">Verified Accounts</p>
        </div>
      </div>
    </div>
  );
}

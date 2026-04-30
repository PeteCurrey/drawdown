"use client";

import { FundedAccount } from "@/types/dashboard";
import { formatCurrency } from "@/lib/utils";
import { TrendingUp, Clock, Activity, AlertTriangle, ShieldAlert, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

interface AccountCardProps {
  account: FundedAccount;
}

export function AccountCard({ account }: AccountCardProps) {
  const snapshot = account.latest_snapshot;
  
  const status = snapshot?.daily_loss_used_pct >= 100 || snapshot?.max_drawdown_used_pct >= 100 ? 'breached' :
                snapshot?.daily_loss_used_pct > 75 || snapshot?.max_drawdown_used_pct > 75 ? 'critical' :
                snapshot?.daily_loss_used_pct > 50 || snapshot?.max_drawdown_used_pct > 50 ? 'warning' : 'safe';

  const statusColors = {
    safe: "text-profit border-profit/20 bg-profit/5",
    warning: "text-warning border-warning/20 bg-warning/5",
    critical: "text-loss border-loss/20 bg-loss/5",
    breached: "text-loss border-loss bg-loss/10",
  };

  const StatusIcon = status === 'safe' ? ShieldCheck : status === 'breached' ? ShieldAlert : AlertTriangle;

  return (
    <div className="bg-background-surface border border-border-slate hover:border-accent/40 transition-all duration-500 group overflow-hidden flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-border-slate flex justify-between items-start">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono text-text-tertiary uppercase tracking-widest">
              {account.prop_firms?.name || "Prop Account"}
            </span>
            <span className={cn(
              "px-1.5 py-0.5 rounded-none text-[8px] font-bold uppercase tracking-tighter border",
              account.account_phase === 'funded' ? "text-profit border-profit/30 bg-profit/5" : "text-accent border-accent/30 bg-accent/5"
            )}>
              {account.account_phase.replace('_', ' ')}
            </span>
          </div>
          <h3 className="text-xl font-display font-bold uppercase text-text-primary group-hover:text-accent transition-colors truncate max-w-[200px]">
            {account.account_name}
          </h3>
        </div>
        <div className={cn(
          "px-3 py-1 border text-[10px] font-mono font-bold uppercase tracking-widest flex items-center gap-2",
          statusColors[status]
        )}>
          <StatusIcon className="w-3 h-3" />
          {status}
        </div>
      </div>

      {/* Main Stats */}
      <div className="p-6 grid grid-cols-2 gap-8 border-b border-border-slate">
        <div>
          <span className="text-[10px] font-mono text-text-tertiary uppercase tracking-widest block mb-2">Equity</span>
          <div className="text-2xl font-display font-bold text-text-primary">
            {formatCurrency(Number(account.current_balance), account.currency)}
          </div>
          <div className="flex items-center gap-1 mt-1">
            <TrendingUp className={cn("w-3 h-3", Number(snapshot?.daily_pnl || 0) >= 0 ? "text-profit" : "text-loss")} />
            <span className={cn("text-[10px] font-mono", Number(snapshot?.daily_pnl || 0) >= 0 ? "text-profit" : "text-loss")}>
              {formatCurrency(Number(snapshot?.daily_pnl || 0), account.currency)} Today
            </span>
          </div>
        </div>
        <div>
          <span className="text-[10px] font-mono text-text-tertiary uppercase tracking-widest block mb-2">Account Size</span>
          <div className="text-2xl font-display font-bold text-text-secondary">
            {formatCurrency(Number(account.account_size), account.currency)}
          </div>
          <span className="text-[10px] font-mono text-text-tertiary uppercase tracking-widest mt-1 block">
            {account.platform.toUpperCase()} Platform
          </span>
        </div>
      </div>

      {/* Health Bars */}
      <div className="p-6 space-y-6 flex-grow">
        <div>
          <div className="flex justify-between items-end mb-2">
            <span className="text-[10px] font-mono text-text-tertiary uppercase tracking-widest">Daily Loss Used</span>
            <span className={cn(
              "text-[10px] font-mono font-bold",
              Number(snapshot?.daily_loss_used_pct || 0) > 80 ? "text-loss" : "text-text-primary"
            )}>
              {Number(snapshot?.daily_loss_used_pct || 0).toFixed(1)}%
            </span>
          </div>
          <div className="h-1 bg-border-slate overflow-hidden">
            <div 
              className={cn(
                "h-full transition-all duration-1000",
                Number(snapshot?.daily_loss_used_pct || 0) > 80 ? "bg-loss" : 
                Number(snapshot?.daily_loss_used_pct || 0) > 50 ? "bg-warning" : "bg-profit"
              )}
              style={{ width: `${Math.min(100, Number(snapshot?.daily_loss_used_pct || 0))}%` }}
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between items-end mb-2">
            <span className="text-[10px] font-mono text-text-tertiary uppercase tracking-widest">Max Drawdown Used</span>
            <span className={cn(
              "text-[10px] font-mono font-bold",
              Number(snapshot?.max_drawdown_used_pct || 0) > 80 ? "text-loss" : "text-text-primary"
            )}>
              {Number(snapshot?.max_drawdown_used_pct || 0).toFixed(1)}%
            </span>
          </div>
          <div className="h-1 bg-border-slate overflow-hidden">
            <div 
              className={cn(
                "h-full transition-all duration-1000",
                Number(snapshot?.max_drawdown_used_pct || 0) > 80 ? "bg-loss" : 
                Number(snapshot?.max_drawdown_used_pct || 0) > 50 ? "bg-warning" : "bg-profit"
              )}
              style={{ width: `${Math.min(100, Number(snapshot?.max_drawdown_used_pct || 0))}%` }}
            />
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="px-6 py-4 bg-background-elevated flex justify-between items-center mt-auto">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 text-text-tertiary">
            <Clock className="w-3.5 h-3.5" />
            <span className="text-[10px] font-mono uppercase">{account.days_traded} Days</span>
          </div>
          <div className="flex items-center gap-1.5 text-text-tertiary">
            <Activity className="w-3.5 h-3.5" />
            <span className="text-[10px] font-mono uppercase">
              {account.last_sync_at ? 'Synced' : 'No Data'}
            </span>
          </div>
        </div>
        <button className="text-[10px] font-bold uppercase tracking-widest text-accent hover:underline">
          View Details →
        </button>
      </div>
    </div>
  );
}

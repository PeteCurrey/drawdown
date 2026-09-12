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
  
  const status = (snapshot?.daily_loss_used_pct ?? 0) >= 100 || (snapshot?.max_drawdown_used_pct ?? 0) >= 100 ? 'breached' :
                (snapshot?.daily_loss_used_pct ?? 0) > 75 || (snapshot?.max_drawdown_used_pct ?? 0) > 75 ? 'critical' :
                (snapshot?.daily_loss_used_pct ?? 0) > 50 || (snapshot?.max_drawdown_used_pct ?? 0) > 50 ? 'warning' : 'safe';
 
  const statusColors = {
    safe: "text-profit border-profit/20 bg-profit/5 rounded-lg",
    warning: "text-warning border-warning/20 bg-warning/5 rounded-lg",
    critical: "text-loss border-loss/20 bg-loss/5 rounded-lg",
    breached: "text-loss border-loss bg-loss/10 rounded-lg",
  };
 
  const StatusIcon = status === 'safe' ? ShieldCheck : status === 'breached' ? ShieldAlert : AlertTriangle;
 
  return (
    <div className="bg-white border border-[#E8E6E1] hover:border-[#F9771D]/60 hover:shadow-xs rounded-lg transition-all flex flex-col overflow-hidden">
      {/* Header */}
      <div className="p-5 border-b border-[#E8E6E1] flex justify-between items-start">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-semibold text-[#888882] uppercase tracking-wider">
              {account.prop_firms?.name || "Prop Account"}
            </span>
            <span className={cn(
              "px-1.5 py-0.5 rounded text-[9px] font-semibold uppercase tracking-wider border",
              account.account_phase === 'funded' ? "text-[#18B880] border-[rgba(24,184,128,0.2)] bg-[#F0FDF8]" : "text-[#F9771D] border-[rgba(249,119,29,0.2)] bg-[#FFF4EC]"
            )}>
              {account.account_phase.replace('_', ' ')}
            </span>
          </div>
          <h3 className="text-lg font-bold font-display text-[#1A1A1A] truncate max-w-[200px]">
            {account.account_name}
          </h3>
        </div>
        <div className={cn(
          "px-2.5 py-1 border text-[10px] font-semibold uppercase tracking-wider flex items-center gap-1.5 rounded",
          statusColors[status]
        )}>
          <StatusIcon className="w-3.5 h-3.5" />
          {status}
        </div>
      </div>
 
      {/* Main Stats */}
      <div className="p-5 grid grid-cols-2 gap-6 border-b border-[#E8E6E1]">
        <div>
          <span className="text-[11px] font-medium text-[#888882] uppercase tracking-[0.06em] block mb-1">Equity</span>
          <div className="text-xl font-bold font-display text-[#1A1A1A] dd-tabular">
            {formatCurrency(Number(account.current_balance), account.currency)}
          </div>
          <div className="flex items-center gap-1 mt-1">
            <TrendingUp className={cn("w-3 h-3", Number(snapshot?.daily_pnl || 0) >= 0 ? "text-[#18B880]" : "text-[#CE6969]")} />
            <span className={cn("text-[11px] font-semibold dd-tabular", Number(snapshot?.daily_pnl || 0) >= 0 ? "text-[#18B880]" : "text-[#CE6969]")}>
              {formatCurrency(Number(snapshot?.daily_pnl || 0), account.currency)} Today
            </span>
          </div>
        </div>
        <div>
          <span className="text-[11px] font-medium text-[#888882] uppercase tracking-[0.06em] block mb-1">Account Size</span>
          <div className="text-xl font-bold font-display text-[#4A4A47] dd-tabular">
            {formatCurrency(Number(account.account_size), account.currency)}
          </div>
          <span className="text-[10px] text-[#888882] uppercase tracking-wider mt-1 block">
            {account.platform.toUpperCase()} Platform
          </span>
        </div>
      </div>
 
      {/* Health Bars */}
      <div className="p-5 space-y-4 flex-grow">
        <div>
          <div className="flex justify-between items-end mb-1.5">
            <span className="text-[11px] font-medium text-[#888882]">Daily Loss Used</span>
            <span className={cn(
              "text-[11px] font-semibold dd-tabular",
              Number(snapshot?.daily_loss_used_pct || 0) > 80 ? "text-[#CE6969]" : "text-[#1A1A1A]"
            )}>
              {Number(snapshot?.daily_loss_used_pct || 0).toFixed(1)}%
            </span>
          </div>
          <div className="h-1.5 bg-[#E8E6E1] overflow-hidden rounded-full">
            <div 
              className={cn(
                "h-full transition-all duration-700 rounded-full",
                Number(snapshot?.daily_loss_used_pct || 0) > 80 ? "bg-[#CE6969]" : 
                Number(snapshot?.daily_loss_used_pct || 0) > 50 ? "bg-[#D97706]" : "bg-[#18B880]"
              )}
              style={{ width: `${Math.min(100, Number(snapshot?.daily_loss_used_pct || 0))}%` }}
            />
          </div>
        </div>
 
        <div>
          <div className="flex justify-between items-end mb-1.5">
            <span className="text-[11px] font-medium text-[#888882]">Max Drawdown Used</span>
            <span className={cn(
              "text-[11px] font-semibold dd-tabular",
              Number(snapshot?.max_drawdown_used_pct || 0) > 80 ? "text-[#CE6969]" : "text-[#1A1A1A]"
            )}>
              {Number(snapshot?.max_drawdown_used_pct || 0).toFixed(1)}%
            </span>
          </div>
          <div className="h-1.5 bg-[#E8E6E1] overflow-hidden rounded-full">
            <div 
              className={cn(
                "h-full transition-all duration-700 rounded-full",
                Number(snapshot?.max_drawdown_used_pct || 0) > 80 ? "bg-[#CE6969]" : 
                Number(snapshot?.max_drawdown_used_pct || 0) > 50 ? "bg-[#D97706]" : "bg-[#18B880]"
              )}
              style={{ width: `${Math.min(100, Number(snapshot?.max_drawdown_used_pct || 0))}%` }}
            />
          </div>
        </div>
      </div>
 
      {/* Footer */}
      <div className="px-5 py-3 bg-[#FAFAF9] flex justify-between items-center mt-auto border-t border-[#E8E6E1]">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 text-[#888882]">
            <Clock className="w-3.5 h-3.5" />
            <span className="text-[10px] font-medium">{account.days_traded} Days</span>
          </div>
          <div className="flex items-center gap-1.5 text-[#888882]">
            <Activity className="w-3.5 h-3.5 text-[#18B880]" />
            <span className="text-[10px] font-medium">
              {account.last_sync_at ? 'Synced' : 'No Data'}
            </span>
          </div>
        </div>
        <span className="text-[11px] font-semibold text-[#F9771D] hover:underline cursor-pointer">
          Details →
        </span>
      </div>
    </div>
  );
}

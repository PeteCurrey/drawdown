'use client';
 
import { DollarSign, Activity, Target, ShieldAlert } from "lucide-react";
import { cn } from "@/lib/utils";
import { DashboardSummary } from "@/types/dashboard";
 
interface PortfolioSummaryProps {
  summary: DashboardSummary;
}
 
export function PortfolioSummary({ summary }: PortfolioSummaryProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Total Balance */}
      <div className="p-5 bg-white border border-[#E8E6E1] rounded-lg flex flex-col justify-between shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <div className="w-8 h-8 rounded-md bg-[#FFF4EC] flex items-center justify-center">
            <DollarSign className="w-4 h-4 text-[#F9771D]" />
          </div>
          <span className="text-[10px] font-semibold text-[#888882] uppercase tracking-wider">Total Alloc.</span>
        </div>
        <div>
          <h3 className="text-2xl font-bold font-display leading-none mb-1 text-[#1A1A1A] dd-tabular">
            ${summary.totalBalance.toLocaleString()}
          </h3>
          <p className="text-[11px] text-[#888882]">Gross Balance</p>
        </div>
      </div>
 
      {/* Total Equity */}
      <div className="p-5 bg-white border border-[#E8E6E1] rounded-lg flex flex-col justify-between shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <div className={cn("w-8 h-8 rounded-md flex items-center justify-center", summary.totalEquity >= summary.totalBalance ? "bg-[#F0FDF8]" : "bg-[#FDF2F2]")}>
            <Activity className={cn("w-4 h-4", summary.totalEquity >= summary.totalBalance ? "text-[#18B880]" : "text-[#CE6969]")} />
          </div>
          <span className="text-[10px] font-semibold text-[#888882] uppercase tracking-wider">Current Equity</span>
        </div>
        <div>
          <h3 className={cn("text-2xl font-bold font-display leading-none mb-1 dd-tabular", summary.totalEquity >= summary.totalBalance ? "text-[#18B880]" : "text-[#CE6969]")}>
            ${summary.totalEquity.toLocaleString()}
          </h3>
          <p className="text-[11px] text-[#888882]">Real-time NAV</p>
        </div>
      </div>
 
      {/* Average Drawdown */}
      <div className="p-5 bg-white border border-[#E8E6E1] rounded-lg flex flex-col justify-between shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <div className={cn("w-8 h-8 rounded-md flex items-center justify-center", summary.riskStatus === 'safe' ? "bg-[#F0FDF8]" : "bg-[#FFFBEB]")}>
            <Target className={cn("w-4 h-4", summary.riskStatus === 'safe' ? "text-[#18B880]" : "text-[#D97706]")} />
          </div>
          <span className="text-[10px] font-semibold text-[#888882] uppercase tracking-wider">Avg. Drawdown</span>
        </div>
        <div>
          <h3 className={cn("text-2xl font-bold font-display leading-none mb-1 dd-tabular", summary.riskStatus === 'critical' ? "text-[#CE6969]" : summary.riskStatus === 'warning' ? "text-[#D97706]" : "text-[#1A1A1A]")}>
            {summary.averageDrawdownUsed.toFixed(1)}%
          </h3>
          <p className="text-[11px] text-[#888882]">Combined Exposure</p>
        </div>
      </div>
 
      {/* Active Accounts */}
      <div className="p-5 bg-white border border-[#E8E6E1] rounded-lg flex flex-col justify-between shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <div className="w-8 h-8 rounded-md bg-[#F4F3F0] flex items-center justify-center">
            <ShieldAlert className="w-4 h-4 text-[#4A4A47]" />
          </div>
          <span className="text-[10px] font-semibold text-[#888882] uppercase tracking-wider">Active Firms</span>
        </div>
        <div>
          <h3 className="text-2xl font-bold font-display leading-none mb-1 text-[#1A1A1A] dd-tabular">
            {summary.activeAccounts}
          </h3>
          <p className="text-[11px] text-[#888882]">Verified Accounts</p>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { PortfolioSummary } from "@/components/dashboard/accounts/PortfolioSummary";
import { AccountCard } from "@/components/dashboard/accounts/AccountCard";
import { AddAccountModal } from "@/components/dashboard/accounts/AddAccountModal";
import { ImportTradesModal } from "@/components/dashboard/accounts/ImportTradesModal";
import { FundedAccount, DashboardSummary } from "@/types/dashboard";
import { Plus, LayoutGrid, List, Filter, Upload, Loader2, ShieldAlert } from "lucide-react";
import { cn } from "@/lib/utils";
import { getAccountsWithSnapshots, createFundedAccount, importTrades } from "@/app/actions/dashboard";

export default function AccountsPage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [accounts, setAccounts] = useState<FundedAccount[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchAccounts = async () => {
    setIsLoading(true);
    try {
      const data = await getAccountsWithSnapshots();
      setAccounts(data as any);
    } catch (err) {
      console.error("Failed to fetch accounts:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  const calculateSummary = (): DashboardSummary => {
    if (accounts.length === 0) {
      return {
        totalBalance: 0,
        totalEquity: 0,
        activeAccounts: 0,
        totalPnlToday: 0,
        averageDrawdownUsed: 0,
        riskStatus: "safe"
      };
    }

    const totalBalance = accounts.reduce((sum, acc) => sum + Number(acc.account_size), 0);
    const totalEquity = accounts.reduce((sum, acc) => sum + Number(acc.current_balance), 0);
    const totalPnlToday = accounts.reduce((sum, acc) => sum + (Number(acc.latest_snapshot?.daily_pnl) || 0), 0);
    const avgDrawdown = accounts.reduce((sum, acc) => sum + (Number(acc.latest_snapshot?.max_drawdown_used_pct) || 0), 0) / accounts.length;

    return {
      totalBalance,
      totalEquity,
      activeAccounts: accounts.length,
      totalPnlToday,
      averageDrawdownUsed: avgDrawdown,
      riskStatus: avgDrawdown > 75 ? "critical" : avgDrawdown > 50 ? "warning" : "safe"
    };
  };

  const handleAddAccount = async (data: Partial<FundedAccount>) => {
    try {
      await createFundedAccount(data);
      setIsAddModalOpen(false);
      fetchAccounts();
    } catch (err) {
      alert("Error creating account: " + (err as Error).message);
    }
  };

  const handleImportTrades = async (accountId: string, trades: any[]) => {
    try {
      await importTrades(accountId, trades);
      setIsImportModalOpen(false);
      fetchAccounts();
    } catch (err) {
      alert("Error importing trades: " + (err as Error).message);
    }
  };

  const summary = calculateSummary();

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <span className="text-accent font-mono text-[10px] uppercase tracking-widest block mb-3">// PORTFOLIO ENGINE</span>
          <h1 className="text-4xl font-display font-bold uppercase text-text-primary">Funded Accounts.</h1>
          <p className="text-text-secondary text-sm mt-2 max-w-xl">
            Aggregate your prop firm accounts into a single professional-grade dashboard. Monitor drawdown, track limits, and import trades seamlessly.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setIsImportModalOpen(true)}
            disabled={accounts.length === 0}
            className="flex items-center gap-2 px-6 py-3 border border-border-slate text-text-primary font-bold uppercase tracking-widest text-[10px] hover:bg-background-elevated transition-all disabled:opacity-50"
          >
            <Upload className="w-4 h-4" />
            Import Trades
          </button>
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 px-6 py-3 bg-accent text-background-primary font-bold uppercase tracking-widest text-[10px] hover:invert transition-all"
          >
            <Plus className="w-4 h-4" />
            Add Account
          </button>
        </div>
      </header>

      {/* Modals */}
      <AddAccountModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddAccount}
      />
      <ImportTradesModal 
        isOpen={isImportModalOpen} 
        onClose={() => setIsImportModalOpen(false)}
        accounts={accounts}
        onImport={(accountId, trades) => handleImportTrades(accountId, trades)}
      />

      {isLoading ? (
        <div className="py-24 flex flex-col items-center justify-center space-y-4">
          <Loader2 className="w-10 h-10 text-accent animate-spin" />
          <p className="text-xs font-mono uppercase text-text-tertiary tracking-widest">Decrypting Portfolio Data...</p>
        </div>
      ) : (
        <>
          <PortfolioSummary summary={summary} />

          <div className="flex items-center justify-between py-6 border-b border-border-slate">
            <h2 className="text-xs font-mono uppercase tracking-[0.3em] text-text-tertiary">Active Allocations</h2>
            <div className="flex bg-background-elevated p-1 border border-border-slate">
              <button 
                onClick={() => setViewMode("grid")}
                className={cn("p-2 transition-colors", viewMode === "grid" ? "bg-accent text-background-primary" : "text-text-tertiary hover:text-text-primary")}
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button 
                onClick={() => setViewMode("list")}
                className={cn("p-2 transition-colors", viewMode === "list" ? "bg-accent text-background-primary" : "text-text-tertiary hover:text-text-primary")}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>

          {accounts.length === 0 ? (
             <div className="py-24 border-2 border-dashed border-border-slate flex flex-col items-center justify-center text-center px-6">
                <div className="w-16 h-16 bg-background-elevated flex items-center justify-center mb-6">
                   <ShieldAlert className="w-8 h-8 text-text-tertiary" />
                </div>
                <h3 className="text-xl font-display font-bold uppercase mb-2">No Accounts Connected</h3>
                <p className="text-sm text-text-secondary max-w-sm mb-8">
                   You haven&apos;t added any funded or challenge accounts yet. Connect your first firm to begin institutional risk monitoring.
                </p>
                <button 
                  onClick={() => setIsAddModalOpen(true)}
                  className="px-8 py-4 bg-accent text-background-primary font-bold uppercase tracking-widest text-[10px] hover:invert transition-all"
                >
                   Connect First Account
                </button>
             </div>
          ) : (
            <div className={cn(
              "grid gap-6",
              viewMode === "grid" ? "grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3" : "grid-cols-1"
            )}>
              {accounts.map((account) => (
                <AccountCard key={account.id} account={account} />
              ))}

              <button 
                onClick={() => setIsAddModalOpen(true)}
                className="border-2 border-dashed border-border-slate p-12 flex flex-col items-center justify-center text-center group hover:border-accent/40 transition-all"
              >
                <div className="w-12 h-12 rounded-full bg-background-elevated flex items-center justify-center mb-4 group-hover:bg-accent/10 transition-colors">
                  <Plus className="w-6 h-6 text-text-tertiary group-hover:text-accent" />
                </div>
                <span className="text-xs font-mono uppercase tracking-widest text-text-tertiary group-hover:text-text-primary">Connect New Account</span>
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

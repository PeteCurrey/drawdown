"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { 
  Plus, 
  ArrowRight, 
  Shield, 
  Target, 
  BarChart4, 
  Globe, 
  X,
  CheckCircle2,
  ChevronRight,
  Loader2
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { FundedAccount } from "@/types/dashboard";

interface AddAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (account: Partial<FundedAccount>) => void;
}

export function AddAccountModal({ isOpen, onClose, onAdd }: AddAccountModalProps) {
  const [step, setStep] = useState(1);
  const [firms, setFirms] = useState<any[]>([]);
  const [isLoadingFirms, setIsLoadingFirms] = useState(false);
  const [selectedFirm, setSelectedFirm] = useState<any>(null);
  const [formData, setFormData] = useState<Partial<FundedAccount>>({
    account_name: "",
    account_size: 100000,
    daily_loss_limit: 5000,
    max_drawdown_limit: 10000,
    currency: "USD",
    platform: "mt4",
    account_phase: "challenge_phase1",
    daily_loss_type: 'balance_based',
    max_drawdown_type: 'trailing_eod'
  });

  const supabase = createClient();

  useEffect(() => {
    if (isOpen) {
      const fetchFirms = async () => {
        setIsLoadingFirms(true);
        const { data } = await supabase.from("prop_firms").select("*").eq("is_active", true);
        if (data) setFirms(data);
        setIsLoadingFirms(false);
      };
      fetchFirms();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleFirmSelect = (firm: any) => {
    setSelectedFirm(firm);
    setFormData({
      ...formData,
      prop_firm_id: firm.id,
      daily_loss_limit: Number(formData.account_size) * (Number(firm.default_daily_loss_pct) / 100),
      max_drawdown_limit: Number(formData.account_size) * (Number(firm.default_max_drawdown_pct) / 100),
      daily_loss_type: firm.daily_loss_type,
      max_drawdown_type: firm.max_drawdown_type,
      profit_target: Number(formData.account_size) * (Number(firm.default_profit_target_pct || 10) / 100),
      min_trading_days: firm.default_min_trading_days
    });
    setStep(2);
  };

  const steps = [
    { title: "Select Firm", icon: Shield },
    { title: "Account Basics", icon: Target },
    { title: "Risk Rules", icon: BarChart4 },
    { title: "Connectivity", icon: Globe }
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-background-primary/95 backdrop-blur-xl">
      <div className="relative w-full max-w-4xl bg-background-surface border border-border-slate shadow-2xl overflow-hidden flex flex-col md:flex-row animate-in fade-in zoom-in-95 duration-300">
        
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 z-20 p-2 text-text-tertiary hover:text-text-primary transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="hidden md:flex w-80 bg-background-elevated p-10 border-r border-border-slate flex-col justify-between">
           <div className="space-y-12">
              <div className="space-y-1">
                <span className="text-[10px] font-mono text-accent uppercase tracking-widest">// NEW ALLOCATION</span>
                <h2 className="text-xl font-display font-black uppercase">Add Account</h2>
              </div>
              
              <div className="space-y-8">
                 {steps.map((s, i) => (
                   <div key={i} className="flex items-center gap-4 group">
                      <div className={cn(
                        "w-8 h-8 flex items-center justify-center border transition-all",
                        step > i + 1 ? "bg-profit border-profit text-background-primary" : 
                        step === i + 1 ? "border-accent text-accent" : "border-border-slate text-text-tertiary"
                      )}>
                         {step > i + 1 ? <CheckCircle2 className="w-4 h-4" /> : <span className="text-[10px] font-mono font-bold">{i + 1}</span>}
                      </div>
                      <span className={cn(
                        "text-[10px] font-bold uppercase tracking-widest",
                        step === i + 1 ? "text-text-primary" : "text-text-tertiary"
                      )}>{s.title}</span>
                   </div>
                 ))}
              </div>
           </div>
        </div>

        <div className="flex-grow p-12 md:p-16 flex flex-col justify-between min-h-[600px]">
           <div className="flex-grow overflow-y-auto pr-4 scrollbar-thin">
              {step === 1 && (
                <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-500">
                   <div className="space-y-4">
                      <h3 className="text-4xl font-display font-bold uppercase leading-tight">Select your <br /> <span className="text-accent">Prop Firm.</span></h3>
                      <p className="text-sm text-text-secondary">Which organization is providing the capital allocation?</p>
                   </div>
                   {isLoadingFirms ? (
                     <div className="flex items-center gap-3 py-12">
                        <Loader2 className="w-6 h-6 text-accent animate-spin" />
                        <span className="text-xs font-mono uppercase text-text-tertiary">Loading Firm Database...</span>
                     </div>
                   ) : (
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {firms.map((firm) => (
                          <button 
                            key={firm.id}
                            onClick={() => handleFirmSelect(firm)}
                            className={cn(
                              "p-6 text-left border transition-all flex justify-between items-center group",
                              selectedFirm?.id === firm.id ? "border-accent bg-accent/5" : "border-border-slate hover:border-accent/50"
                            )}
                          >
                             <span className="font-bold uppercase text-xs tracking-wider">{firm.name}</span>
                             <ChevronRight className={cn(
                               "w-4 h-4 transition-transform",
                               selectedFirm?.id === firm.id ? "text-accent translate-x-1" : "text-text-tertiary"
                             )} />
                          </button>
                        ))}
                     </div>
                   )}
                </div>
              )}

              {step === 2 && (
                <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-500">
                   <div className="space-y-4">
                      <h3 className="text-4xl font-display font-bold uppercase leading-tight">Account <br /> <span className="text-accent">Basics.</span></h3>
                      <p className="text-sm text-text-secondary">Define the core parameters of this trading account.</p>
                   </div>
                   <div className="space-y-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-mono uppercase text-text-tertiary">Account Label</label>
                        <input 
                          type="text" 
                          placeholder="e.g. My 100K Challenge"
                          value={formData.account_name}
                          onChange={(e) => setFormData({...formData, account_name: e.target.value})}
                          className="w-full bg-background-primary border border-border-slate p-4 text-sm outline-none focus:border-accent"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-[10px] font-mono uppercase text-text-tertiary">Account Size ({formData.currency})</label>
                          <input 
                            type="number" 
                            value={formData.account_size}
                            onChange={(e) => setFormData({...formData, account_size: parseInt(e.target.value)})}
                            className="w-full bg-background-primary border border-border-slate p-4 text-sm outline-none focus:border-accent"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-mono uppercase text-text-tertiary">Current Phase</label>
                          <select 
                            value={formData.account_phase}
                            onChange={(e) => setFormData({...formData, account_phase: e.target.value as any})}
                            className="w-full bg-background-primary border border-border-slate p-4 text-sm outline-none focus:border-accent"
                          >
                            <option value="challenge_phase1">Phase 1 (Evaluation)</option>
                            <option value="challenge_phase2">Phase 2 (Verification)</option>
                            <option value="funded">Funded (Live)</option>
                          </select>
                        </div>
                      </div>
                   </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-500">
                   <div className="space-y-4">
                      <h3 className="text-4xl font-display font-bold uppercase leading-tight">Risk <br /> <span className="text-accent">Parameters.</span></h3>
                      <p className="text-sm text-text-secondary">Verify the breach limits for this specific account.</p>
                   </div>
                   <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                         <label className="text-[10px] font-mono uppercase text-text-tertiary">Max Daily Loss (Limit)</label>
                         <div className="relative">
                           <input 
                             type="number" 
                             value={formData.daily_loss_limit}
                             onChange={(e) => setFormData({...formData, daily_loss_limit: parseInt(e.target.value)})}
                             className="w-full bg-background-primary border border-border-slate p-4 text-sm outline-none focus:border-accent pl-8"
                           />
                           <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary">$</span>
                         </div>
                         <p className="text-[9px] text-text-tertiary uppercase mt-1">Rule: {formData.daily_loss_type?.replace('_', ' ')}</p>
                      </div>
                      <div className="space-y-2">
                         <label className="text-[10px] font-mono uppercase text-text-tertiary">Max Drawdown (Limit)</label>
                         <div className="relative">
                           <input 
                             type="number" 
                             value={formData.max_drawdown_limit}
                             onChange={(e) => setFormData({...formData, max_drawdown_limit: parseInt(e.target.value)})}
                             className="w-full bg-background-primary border border-border-slate p-4 text-sm outline-none focus:border-accent pl-8"
                           />
                           <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary">$</span>
                         </div>
                         <p className="text-[9px] text-text-tertiary uppercase mt-1">Rule: {formData.max_drawdown_type?.replace('_', ' ')}</p>
                      </div>
                   </div>
                </div>
              )}

              {step === 4 && (
                <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-500">
                   <div className="space-y-4">
                      <h3 className="text-4xl font-display font-bold uppercase leading-tight">Sync <br /> <span className="text-accent">Connectivity.</span></h3>
                      <p className="text-sm text-text-secondary">Select the platform for automated trade importing.</p>
                   </div>
                   <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                         <label className="text-[10px] font-mono uppercase text-text-tertiary">Trading Platform</label>
                         <select 
                           value={formData.platform}
                           onChange={(e) => setFormData({...formData, platform: e.target.value as any})}
                           className="w-full bg-background-primary border border-border-slate p-4 text-sm outline-none focus:border-accent"
                         >
                            <option value="mt4">MetaTrader 4</option>
                            <option value="mt5">MetaTrader 5</option>
                            <option value="ctrader">cTrader</option>
                            <option value="tradovate">Tradovate</option>
                            <option value="other">Other</option>
                         </select>
                      </div>
                      <div className="space-y-2">
                         <label className="text-[10px] font-mono uppercase text-text-tertiary">Account Currency</label>
                         <select 
                           value={formData.currency}
                           onChange={(e) => setFormData({...formData, currency: e.target.value as any})}
                           className="w-full bg-background-primary border border-border-slate p-4 text-sm outline-none focus:border-accent"
                         >
                            <option value="USD">USD ($)</option>
                            <option value="GBP">GBP (£)</option>
                            <option value="EUR">EUR (€)</option>
                            <option value="AUD">AUD (A$)</option>
                         </select>
                      </div>
                   </div>
                </div>
              )}
           </div>

           <div className="flex justify-end gap-4 pt-12 border-t border-border-slate mt-8">
              {step > 1 && (
                <button 
                  onClick={() => setStep(step - 1)}
                  className="px-8 py-4 border border-border-slate text-[10px] font-bold uppercase tracking-widest hover:bg-background-elevated transition-colors"
                >
                   Back
                </button>
              )}
              <button 
                onClick={() => step === 4 ? onAdd({ ...formData, current_balance: formData.account_size }) : setStep(step + 1)}
                disabled={step === 2 && !formData.account_name}
                className="px-10 py-4 bg-accent text-background-primary text-[10px] font-bold uppercase tracking-widest hover:bg-accent-hover transition-colors flex items-center gap-2"
              >
                 {step === 4 ? 'Confirm & Connect' : 'Continue'} 
                 <ArrowRight className="w-4 h-4" />
              </button>
           </div>
        </div>
      </div>
    </div>
  );
}

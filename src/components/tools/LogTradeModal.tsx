"use client";

import { useState } from "react";
import { X, Shield, History, Smile, Activity, AlertCircle, TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface LogTradeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const sessions = ["London", "New York", "Asia", "Overlap", "Other"];
const emotions = [
  { label: "Confident", emoji: "😎" },
  { label: "Disciplined", emoji: "🎯" },
  { label: "Neutral", emoji: "😐" },
  { label: "Anxious", emoji: "😰" },
  { label: "FOMO", emoji: "🤯" },
  { label: "Revenge", emoji: "😤" }
];

export function LogTradeModal({ isOpen, onClose }: LogTradeModalProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    instrument: "",
    marketType: "Forex",
    direction: "Long",
    entryPrice: "",
    exitPrice: "",
    positionSize: "",
    stopLoss: "",
    takeProfit: "",
    strategy: "",
    session: "London",
    emotion: "Neutral",
    quality: 3,
    notes: ""
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitting trade:", formData);
    onClose();
    // In production, sync with Supabase
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-background-primary/80 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-background-surface border border-border-slate w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl skew-x-[-0.5deg]">
        {/* Header */}
        <div className="p-8 border-b border-border-slate flex items-center justify-between bg-background-elevated">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-accent/10">
              <History className="w-5 h-5 text-accent" />
            </div>
            <div>
              <h2 className="text-2xl font-display font-black uppercase">Log Performance</h2>
              <p className="text-[10px] font-mono text-text-tertiary uppercase tracking-widest mt-1">
                Step {step} of 2 — {step === 1 ? "Trade Details" : "Execution Context"}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-background-elevated transition-colors border border-transparent hover:border-border-slate">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-grow overflow-y-auto p-8 lg:p-12">
          {step === 1 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="space-y-8">
                <div className="space-y-4">
                  <label className="text-[10px] font-mono uppercase text-text-tertiary tracking-widest">Market & Instrument</label>
                  <div className="grid grid-cols-2 gap-4">
                    <input 
                      type="text" 
                      placeholder="INSTRUMENT (e.g. GBPUSD)" 
                      className="bg-background-primary border border-border-slate p-4 text-[10px] uppercase font-mono focus:border-accent outline-none"
                    />
                    <select className="bg-background-primary border border-border-slate p-4 text-[10px] uppercase font-mono focus:border-accent outline-none">
                      <option>Forex</option>
                      <option>Stocks</option>
                      <option>Crypto</option>
                      <option>Indices</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] font-mono uppercase text-text-tertiary tracking-widest">Entry & Direction</label>
                  <div className="flex gap-4">
                    <button 
                      type="button"
                      onClick={() => setFormData({...formData, direction: "Long"})}
                      className={cn(
                        "flex-grow py-4 text-[10px] font-bold uppercase transition-all flex items-center justify-center gap-2",
                        formData.direction === "Long" ? "bg-profit text-background-primary" : "bg-background-elevated border border-border-slate"
                      )}
                    >
                      <TrendingUp className="w-4 h-4" /> LONG
                    </button>
                    <button 
                      type="button"
                      onClick={() => setFormData({...formData, direction: "Short"})}
                      className={cn(
                        "flex-grow py-4 text-[10px] font-bold uppercase transition-all flex items-center justify-center gap-2",
                        formData.direction === "Short" ? "bg-loss text-background-primary" : "bg-background-elevated border border-border-slate"
                      )}
                    >
                      <TrendingDown className="w-4 h-4" /> SHORT
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <label className="text-[10px] font-mono uppercase text-text-tertiary tracking-widest">Entry Price</label>
                    <input type="number" step="any" className="w-full bg-background-primary border border-border-slate p-4 text-sm font-mono focus:border-accent outline-none" />
                  </div>
                  <div className="space-y-4">
                    <label className="text-[10px] font-mono uppercase text-text-tertiary tracking-widest">Exit Price</label>
                    <input type="number" step="any" className="w-full bg-background-primary border border-border-slate p-4 text-sm font-mono focus:border-accent outline-none" placeholder="OPTIONAL" />
                  </div>
                </div>
              </div>

              <div className="p-8 bg-background-elevated border border-border-slate flex flex-col justify-center text-center space-y-6">
                <Shield className="w-12 h-12 text-accent mx-auto opacity-20" />
                <h3 className="text-xl font-display font-bold uppercase leading-tight">Risk Integrity Check</h3>
                <p className="text-xs text-text-secondary leading-relaxed">
                  Always provide your Stop Loss. Without it, our AI can't calculate your Risk:Reward or identify drawdown sensitivity patterns.
                </p>
                <div className="space-y-4 text-left">
                  <label className="text-[10px] font-mono uppercase text-text-tertiary tracking-widest">Stop Loss Price</label>
                  <input type="number" step="any" className="w-full bg-background-primary border border-accent/30 p-4 text-sm font-mono focus:border-accent outline-none" />
                </div>
              </div>
            </div>
          ) : (
            <div className="max-w-3xl mx-auto space-y-12">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="space-y-6">
                  <label className="text-[10px] font-mono uppercase text-text-tertiary tracking-widest">Trading Session</label>
                  <div className="flex flex-wrap gap-3">
                    {sessions.map(s => (
                      <button 
                        key={s}
                        type="button"
                        onClick={() => setFormData({...formData, session: s})}
                        className={cn(
                          "px-4 py-2 border transition-all text-[10px] font-bold uppercase tracking-widest",
                          formData.session === s ? "border-accent text-accent bg-accent/5 shadow-[0_0_15px_rgba(0,194,255,0.1)]" : "border-border-slate text-text-tertiary hover:border-text-secondary"
                        )}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-6">
                  <label className="text-[10px] font-mono uppercase text-text-tertiary tracking-widest">Emotional State</label>
                  <div className="grid grid-cols-3 gap-3">
                    {emotions.map(e => (
                      <button 
                        key={e.label}
                        type="button"
                        onClick={() => setFormData({...formData, emotion: e.label})}
                        className={cn(
                          "p-3 border transition-all text-center",
                          formData.emotion === e.label ? "border-accent bg-accent/5" : "border-border-slate text-text-tertiary hover:border-text-secondary"
                        )}
                      >
                        <span className="text-xl block mb-1">{e.emoji}</span>
                        <span className="text-[8px] font-mono uppercase font-bold">{e.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <label className="text-[10px] font-mono uppercase text-text-tertiary tracking-widest">Decision Notes — Be Raw</label>
                <textarea 
                  rows={4} 
                  placeholder="WHAT WERE YOU THINKING? WHY DID YOU ENTER HERE? WHAT WOULD PETE SAY?"
                  className="w-full bg-background-primary border border-border-slate p-6 text-sm leading-relaxed focus:border-accent outline-none"
                />
              </div>

              <div className="p-6 bg-background-elevated border-l-2 border-accent flex gap-4">
                <Activity className="w-5 h-5 text-accent shrink-0" />
                <p className="text-xs text-text-secondary leading-relaxed">
                  <span className="font-bold text-text-primary uppercase">Edge Insight:</span> Data suggests you are most prone to overtrading during the NY Session. Consider if this setup meets your strict "Phase 4" criteria.
                </p>
              </div>
            </div>
          )}
        </form>

        {/* Footer */}
        <div className="p-8 border-t border-border-slate bg-background-elevated flex justify-between items-center">
          <div className="flex gap-2">
            {[1, 2].map(i => (
              <div key={i} className={cn("w-8 h-1 transition-all", step === i ? "bg-accent" : "bg-border-slate")} />
            ))}
          </div>
          <div className="flex gap-4">
            {step === 2 && (
              <button 
                type="button"
                onClick={() => setStep(1)}
                className="px-8 py-4 border border-border-slate text-[10px] font-bold uppercase tracking-widest hover:bg-background-primary transition-colors"
              >
                Back
              </button>
            )}
            <button 
              type="button"
              onClick={() => step === 1 ? setStep(2) : handleSubmit({} as any)}
              className="px-12 py-4 bg-accent text-background-primary text-[10px] font-bold uppercase tracking-widest hover:bg-accent-hover transition-colors shadow-2xl shadow-accent/20"
            >
              {step === 1 ? "Next Step" : "Save Performance Log"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

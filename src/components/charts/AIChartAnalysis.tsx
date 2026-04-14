"use client";

import { useState } from "react";
import { Zap, Loader2, X, MessageSquare, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface AIAnalysisProps {
  symbol: string;
  indicators: any;
  isOpen: boolean;
  onClose: () => void;
}

export function AIChartAnalysis({ symbol, indicators, isOpen, onClose }: AIAnalysisProps) {
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalysis = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/ai/chart-analysis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ symbol, indicators })
      });
      
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Analysis failed");
      setAnalysis(data.analysis);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 w-full md:w-[450px] bg-background-surface border-l border-border-slate z-[60] shadow-2xl animate-in slide-in-from-right duration-300">
      <div className="flex flex-col h-full">
        <header className="p-6 border-b border-border-slate flex items-center justify-between bg-background-elevated">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-accent/10 rounded-lg">
              <Zap className="w-5 h-5 text-accent fill-current" />
            </div>
            <div>
              <h3 className="text-xl font-display font-bold uppercase leading-none">AI Intelligence</h3>
              <p className="text-[10px] font-mono text-text-tertiary uppercase mt-1">Instrument: {symbol}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-background-elevated text-text-tertiary transition-colors">
            <X className="w-5 h-5" />
          </button>
        </header>

        <div className="flex-grow overflow-y-auto p-6 space-y-8">
          {!analysis && !loading && !error && (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-6">
              <MessageSquare className="w-12 h-12 text-text-tertiary/20" />
              <div className="space-y-2">
                <p className="font-display font-bold uppercase text-text-secondary">Ready for analysis</p>
                <p className="text-xs text-text-tertiary max-w-[280px]">
                  Pete's AI voice will analyse the current {symbol} chart, indicators, and market momentum.
                </p>
              </div>
              <button 
                onClick={fetchAnalysis}
                className="px-8 py-4 bg-accent hover:bg-accent-hover text-background-primary text-xs font-bold uppercase tracking-widest transition-all"
              >
                Generate Analysis
              </button>
            </div>
          )}

          {loading && (
            <div className="flex flex-col items-center justify-center h-full space-y-4">
              <Loader2 className="w-8 h-8 text-accent animate-spin" />
              <p className="text-xs font-mono text-text-tertiary uppercase animate-pulse">Analysing market structure...</p>
            </div>
          )}

          {error && (
            <div className="p-4 bg-loss/5 border border-loss/20 text-loss text-xs flex gap-3">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <p>{error}</p>
            </div>
          )}

          {analysis && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <div className="prose prose-invert prose-sm">
                {analysis.split("\n\n").map((para, i) => (
                  <p key={i} className="text-text-secondary leading-relaxed mb-4">
                    {para}
                  </p>
                ))}
              </div>
              
              <div className="pt-8 border-t border-border-slate">
                <p className="text-[10px] font-mono text-text-tertiary uppercase italic leading-relaxed">
                  "Protect your capital. The opportunities will come." — Pete
                </p>
              </div>
            </div>
          )}
        </div>

        <footer className="p-6 border-t border-border-slate bg-background-elevated">
          <p className="text-[8px] text-text-tertiary uppercase leading-relaxed">
            This analysis is generated based on technical indicators and market data. 
            It is for educational purposes only and is not a financial recommendation.
          </p>
        </footer>
      </div>
    </div>
  );
}

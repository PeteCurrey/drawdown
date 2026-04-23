"use client";

import { useState } from "react";
import { 
  Terminal, 
  Code, 
  Cpu, 
  Copy, 
  Check, 
  AlertTriangle, 
  Zap, 
  ArrowRight,
  ShieldAlert,
  Save
} from "lucide-react";
import { cn, copyToClipboard } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { streamAnalysis } from "@/lib/ai";

interface AlgoStrategyBuilderProps {
  userId: string;
  userTier: string;
}

export function AlgoStrategyBuilder({ userId, userTier }: AlgoStrategyBuilderProps) {
  const [description, setDescription] = useState("");
  const [language, setLanguage] = useState<"pinescript" | "python">("pinescript");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedCode, setGeneratedCode] = useState("");
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!description.trim()) return;
    
    setIsGenerating(true);
    setGeneratedCode("");
    setError(null);

    const systemPrompt = `You are the Drawdown.trading Algo Strategy Builder. 
Your goal is to convert natural language trading rules into professional-grade code.
Current Language Target: ${language === "pinescript" ? "Pine Script v5 (TradingView)" : "Python (Backtrader framework)"}.

Rules:
1. Only output the code. No conversational filler.
2. Ensure the code is bug-free and follows institutional best practices (e.g., proper risk management, variable naming).
3. If the user's logic is fundamentally flawed (e.g., look-ahead bias), include a comment in the code explaining why.
4. For Pine Script, always start with '//@version=5' and use 'strategy()' call.
5. For Python, assume the 'backtrader' library is used.

Institutional Tone: Direct, efficient, and focused on risk.`;

    try {
      const stream = await streamAnalysis(
        `Convert the following trading logic into ${language}: \n\n ${description}`,
        systemPrompt,
        userId,
        'algo_strategy_builder'
      );

      for await (const chunk of stream) {
        if (chunk.type === 'content_block_delta' && chunk.delta.type === 'text_delta') {
          setGeneratedCode(prev => prev + (chunk.delta as any).text);
        }
      }
    } catch (err: any) {
      setError(err.message || "Failed to generate strategy. Please check your AI quota.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = async () => {
    const success = await copyToClipboard(generatedCode);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const isFloor = userTier.toLowerCase() === 'floor';

  return (
    <div className="space-y-12 max-w-5xl animate-in fade-in duration-700">
      <header className="border-b border-border-slate pb-8">
        <div className="flex items-center gap-3 text-accent mb-4">
          <Terminal className="w-5 h-5" />
          <span className="text-[10px] font-mono uppercase tracking-[0.3em]">Module_08 // Strategy_Synthesis</span>
        </div>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-4xl font-display font-bold uppercase tracking-tight">Algo Strategy <span className="text-accent">Builder.</span></h1>
            <p className="text-sm text-text-tertiary mt-2">Convert natural language logic into professional execution code.</p>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => setLanguage("pinescript")}
              className={cn(
                "px-4 py-2 text-[10px] font-mono uppercase tracking-widest border transition-all",
                language === "pinescript" ? "bg-accent text-background-primary border-accent" : "bg-background-surface border-border-slate text-text-tertiary hover:border-accent/50"
              )}
            >
              Pine Script v5
            </button>
            <button 
              onClick={() => setLanguage("python")}
              className={cn(
                "px-4 py-2 text-[10px] font-mono uppercase tracking-widest border transition-all",
                language === "python" ? "bg-accent text-background-primary border-accent" : "bg-background-surface border-border-slate text-text-tertiary hover:border-accent/50"
              )}
            >
              Python / Backtrader
            </button>
          </div>
        </div>
      </header>

      {!isFloor && (
        <div className="p-8 bg-premium/10 border border-premium/30 flex items-start gap-6">
          <Cpu className="w-6 h-6 text-premium shrink-0 mt-1" />
          <div className="space-y-2">
            <h4 className="text-sm font-display font-bold uppercase text-premium">Floor Tier Required</h4>
            <p className="text-xs text-text-secondary leading-relaxed">
              The Algo Strategy Builder is an institutional tool reserved for **Floor** tier members. Upgrade your account to access our Edge Engine v2.0 and automate your logic.
            </p>
            <button className="mt-4 px-6 py-2 bg-premium text-background-primary text-[10px] font-bold uppercase tracking-widest hover:invert transition-all">
              Upgrade to Floor
            </button>
          </div>
        </div>
      )}

      <div className={cn("grid grid-cols-1 lg:grid-cols-12 gap-10", !isFloor && "opacity-40 pointer-events-none")}>
        {/* Input Column */}
        <div className="lg:col-span-5 space-y-8">
          <div className="bg-background-surface border border-border-slate p-8 space-y-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="text-[10px] font-mono uppercase tracking-widest text-text-tertiary">Strategy Logic</label>
                <div className="flex items-center gap-2 text-[8px] font-mono text-profit">
                  <Zap className="w-3 h-3 animate-pulse" /> AI_ENGINE_READY
                </div>
              </div>
              <textarea 
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g. Buy when the 50 EMA crosses above the 200 EMA on the 4H timeframe. Risk 1% per trade with a 2:1 RR ratio..."
                className="w-full h-64 bg-background-primary border border-border-slate p-6 text-sm text-text-primary outline-none focus:border-accent transition-colors resize-none font-sans leading-relaxed"
              />
            </div>

            <button 
              onClick={handleGenerate}
              disabled={isGenerating || !description.trim()}
              className="w-full py-5 bg-accent text-background-primary text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-accent-hover transition-colors disabled:opacity-50"
            >
              {isGenerating ? (
                <>
                  <Code className="w-4 h-4 animate-spin" /> Synthesizing Logic...
                </>
              ) : (
                <>
                  <Cpu className="w-4 h-4" /> Generate {language === "pinescript" ? "Pine Script" : "Python Code"}
                </>
              )}
            </button>
          </div>

          <div className="p-8 bg-loss/5 border border-loss/20">
            <div className="flex items-start gap-4">
              <ShieldAlert className="w-5 h-5 text-loss mt-1 shrink-0" />
              <div className="space-y-2">
                <h4 className="text-[10px] font-mono font-bold uppercase text-loss tracking-widest">Legal Disclaimer</h4>
                <p className="text-[10px] text-text-secondary leading-relaxed uppercase opacity-70">
                  This tool generates code for educational purposes only. Past performance is not indicative of future results. Drawdown.trading does not provide financial advice. You are responsible for testing any generated code in a demo environment before risking live capital.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Output Column */}
        <div className="lg:col-span-7 flex flex-col min-h-[600px]">
          <div className="flex-grow bg-background-elevated border border-border-slate overflow-hidden flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border-slate bg-background-surface">
              <div className="flex items-center gap-4">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-loss/40" />
                  <div className="w-2.5 h-2.5 rounded-full bg-accent/40" />
                  <div className="w-2.5 h-2.5 rounded-full bg-profit/40" />
                </div>
                <span className="text-[10px] font-mono text-text-tertiary uppercase tracking-widest">
                  {language === "pinescript" ? "strategy.pine" : "strategy.py"}
                </span>
              </div>
              <div className="flex gap-4">
                <button 
                  onClick={handleCopy}
                  disabled={!generatedCode}
                  className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-text-tertiary hover:text-accent transition-colors disabled:opacity-30"
                >
                  {copied ? (
                    <>
                      <Check className="w-3 h-3 text-profit" /> Copied
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" /> Copy
                    </>
                  )}
                </button>
                <button 
                  disabled={!generatedCode}
                  className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-text-tertiary hover:text-accent transition-colors disabled:opacity-30"
                >
                  <Save className="w-3 h-3" /> Save
                </button>
              </div>
            </div>
            
            <div className="flex-grow p-8 font-mono text-xs overflow-auto custom-scrollbar bg-[#0a0a0a] relative group">
              {error ? (
                <div className="h-full flex items-center justify-center text-loss font-display font-bold uppercase tracking-widest text-center max-w-xs mx-auto">
                  {error}
                </div>
              ) : generatedCode ? (
                <pre className="text-text-primary leading-relaxed whitespace-pre-wrap">
                  {generatedCode}
                </pre>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-text-tertiary/20 space-y-4">
                  <Code className="w-12 h-12" />
                  <p className="text-[10px] uppercase tracking-[0.4em] font-mono">Waiting for Logic Input</p>
                </div>
              )}
              
              <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 blur-3xl rounded-full -mr-16 -mt-16 pointer-events-none" />
            </div>
          </div>
          
          <div className="mt-6 flex items-center justify-between text-[9px] font-mono text-text-tertiary uppercase tracking-widest">
            <div className="flex items-center gap-4">
              <span>Encoding: UTF-8</span>
              <span>Context: {language === "pinescript" ? "TradingView_v5" : "Python_Backtrader"}</span>
            </div>
            <div className="flex items-center gap-2 text-accent">
              <Zap className="w-3 h-3" /> Powered by Edge Engine v2.0
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

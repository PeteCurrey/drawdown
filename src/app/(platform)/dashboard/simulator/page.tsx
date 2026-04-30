"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { 
  Zap, 
  Target, 
  ShieldCheck, 
  ArrowRight, 
  ChevronRight, 
  CheckCircle2,
  Brain,
  TrendingUp,
  Globe,
  Upload,
  Database,
  Loader2,
  AlertTriangle,
  Play
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { PropFirm, IndividualTrade } from "@/types/dashboard";
import { runSimulationAction, getUserTradesForSimulation, generateAIPrepPlan } from "@/app/actions/simulator";
import { SimulationResult } from "@/lib/simulator/engine";
import { formatCurrency } from "@/lib/utils";

// Step Components would go here...

export default function SimulatorPage() {
  const [step, setStep] = useState(1);
  const [firms, setFirms] = useState<PropFirm[]>([]);
  const [selectedFirm, setSelectedFirm] = useState<PropFirm | null>(null);
  const [accountSize, setAccountSize] = useState<number>(100000);
  const [trades, setTrades] = useState<IndividualTrade[]>([]);
  const [isSimulating, setIsSimulating] = useState(false);
  const [result, setResult] = useState<SimulationResult | null>(null);
  const [isLoadingFirms, setIsLoadingFirms] = useState(true);
  const [aiPlan, setAiPlan] = useState<string | null>(null);
  const [isGeneratingPlan, setIsGeneratingPlan] = useState(false);

  const supabase = createClient();

  useEffect(() => {
    const fetchFirms = async () => {
      const { data } = await supabase.from("prop_firms").select("*").eq("is_active", true);
      if (data) setFirms(data as any);
      setIsLoadingFirms(false);
    };
    fetchFirms();
  }, []);

  const handleRunSimulation = async () => {
    if (!selectedFirm) return;
    setIsSimulating(true);
    setStep(4); // Moving to simulation screen
    
    try {
      const simResult = await runSimulationAction(selectedFirm.id, accountSize, trades);
      setResult(simResult as any);
      setStep(5); // Results
    } catch (err) {
      console.error(err);
      setStep(3); // Back to trades if failed
    } finally {
      setIsSimulating(false);
    }
  };

  const handleGetAIPlan = async () => {
    if (!result || !(result as any).id) return;
    setIsGeneratingPlan(true);
    try {
      const plan = await generateAIPrepPlan((result as any).id);
      setAiPlan(plan);
    } catch (err) {
      console.error(err);
    } finally {
      setIsGeneratingPlan(false);
    }
  };

  const steps = [
    { title: "Select Firm", icon: Globe },
    { title: "Capitalization", icon: Database },
    { title: "Trade Ingestion", icon: Upload },
    { title: "Analysis", icon: Zap },
    { title: "Intelligence", icon: Brain }
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-24">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <span className="text-accent font-mono text-[10px] uppercase tracking-widest block mb-3">// HYPOTHETICAL REPLAY</span>
          <h1 className="text-4xl font-display font-bold uppercase text-text-primary">Challenge Simulator.</h1>
          <p className="text-text-secondary text-sm mt-2 max-w-xl">
            Stress-test your real trading data against institutional prop firm rules. Find your breach points before they cost you real capital.
          </p>
        </div>
        
        {/* Progress Tracker */}
        <div className="flex items-center gap-2">
           {steps.map((s, i) => (
             <div key={i} className="flex items-center">
                <div className={cn(
                  "w-8 h-8 flex items-center justify-center border text-[10px] font-mono",
                  step > i + 1 ? "bg-profit border-profit text-background-primary" : 
                  step === i + 1 ? "border-accent text-accent" : "border-border-slate text-text-tertiary"
                )}>
                  {step > i + 1 ? <CheckCircle2 className="w-4 h-4" /> : (i + 1)}
                </div>
                {i < steps.length - 1 && <div className="w-4 h-[1px] bg-border-slate" />}
             </div>
           ))}
        </div>
      </header>

      {/* Main Container */}
      <div className="bg-background-surface border border-border-slate overflow-hidden">
         <div className="p-12 min-h-[500px]">
            
            {/* Step 1: Firm Selection */}
            {step === 1 && (
              <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-500">
                 <div className="space-y-4">
                    <h3 className="text-3xl font-display font-bold uppercase">Select Target <span className="text-accent">Prop Firm.</span></h3>
                    <p className="text-sm text-text-secondary">We will apply their exact daily loss and drawdown rules to your trades.</p>
                 </div>
                 {isLoadingFirms ? (
                   <div className="flex items-center gap-3 py-12">
                      <Loader2 className="w-6 h-6 text-accent animate-spin" />
                      <span className="text-[10px] font-mono uppercase text-text-tertiary">Loading rule database...</span>
                   </div>
                 ) : (
                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {firms.map((firm) => (
                        <button 
                          key={firm.id}
                          onClick={() => {
                            setSelectedFirm(firm);
                            setStep(2);
                          }}
                          className={cn(
                            "p-8 text-left border transition-all flex flex-col justify-between group",
                            selectedFirm?.id === firm.id ? "border-accent bg-accent/5 shadow-lg shadow-accent/5" : "border-border-slate hover:border-accent/50"
                          )}
                        >
                           <div>
                             <h4 className="font-display font-bold uppercase text-lg mb-2 group-hover:text-accent transition-colors">{firm.name}</h4>
                             <div className="space-y-1">
                                <p className="text-[9px] font-mono text-text-tertiary uppercase">Daily: {firm.default_daily_loss_pct}% {firm.daily_loss_type.replace('_', ' ')}</p>
                                <p className="text-[9px] font-mono text-text-tertiary uppercase">Max DD: {firm.default_max_drawdown_pct}% {firm.max_drawdown_type.replace('_', ' ')}</p>
                                <p className="text-[9px] font-mono text-text-tertiary uppercase">Target: {firm.default_profit_target_pct}%</p>
                             </div>
                           </div>
                           <ChevronRight className={cn(
                             "w-5 h-5 mt-8 transition-transform",
                             selectedFirm?.id === firm.id ? "text-accent translate-x-1" : "text-text-tertiary"
                           )} />
                        </button>
                      ))}
                   </div>
                 )}
              </div>
            )}

            {/* Step 2: Account Size */}
            {step === 2 && (
              <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-500">
                 <div className="space-y-4">
                    <h3 className="text-3xl font-display font-bold uppercase">Define Account <span className="text-accent">Capital.</span></h3>
                    <p className="text-sm text-text-secondary">Simulate a specific challenge size to calculate exact dollar limits.</p>
                 </div>
                 <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    {[10000, 25000, 50000, 100000, 200000].map((size) => (
                      <button 
                        key={size}
                        onClick={() => setAccountSize(size)}
                        className={cn(
                          "py-6 border transition-all font-mono font-bold text-sm",
                          accountSize === size ? "bg-accent border-accent text-background-primary" : "border-border-slate hover:border-accent/50 text-text-secondary"
                        )}
                      >
                         {formatCurrency(size, "USD").replace('.00', '')}
                      </button>
                    ))}
                 </div>
                 
                 <div className="p-10 bg-background-elevated border border-border-slate flex flex-col md:flex-row gap-12 items-center justify-between">
                    <div className="space-y-6 flex-grow">
                       <h4 className="text-[10px] font-mono text-text-tertiary uppercase tracking-widest">Applied Rules for {selectedFirm?.name}</h4>
                       <div className="grid grid-cols-3 gap-8">
                          <div>
                             <span className="text-[9px] font-mono text-text-tertiary uppercase block mb-1">Daily Loss Limit</span>
                             <span className="text-xl font-display font-bold text-loss">
                               {formatCurrency(accountSize * (Number(selectedFirm?.default_daily_loss_pct) / 100), "USD")}
                             </span>
                          </div>
                          <div>
                             <span className="text-[9px] font-mono text-text-tertiary uppercase block mb-1">Max Drawdown</span>
                             <span className="text-xl font-display font-bold text-loss">
                               {formatCurrency(accountSize * (Number(selectedFirm?.default_max_drawdown_pct) / 100), "USD")}
                             </span>
                          </div>
                          <div>
                             <span className="text-[9px] font-mono text-text-tertiary uppercase block mb-1">Profit Target</span>
                             <span className="text-xl font-display font-bold text-profit">
                               {formatCurrency(accountSize * (Number(selectedFirm?.default_profit_target_pct || 10) / 100), "USD")}
                             </span>
                          </div>
                       </div>
                    </div>
                    <button 
                      onClick={() => setStep(3)}
                      className="px-10 py-5 bg-accent text-background-primary text-[10px] font-bold uppercase tracking-widest hover:invert transition-all flex items-center gap-2 shrink-0"
                    >
                       Continue <ArrowRight className="w-4 h-4" />
                    </button>
                 </div>
              </div>
            )}

            {/* Step 3: Trade Selection */}
            {step === 3 && (
              <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-500">
                 <div className="space-y-4">
                    <h3 className="text-3xl font-display font-bold uppercase">Trade History <span className="text-accent">Ingestion.</span></h3>
                    <p className="text-sm text-text-secondary">Which data set should we replay against the rules?</p>
                 </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="p-8 border border-border-slate hover:border-accent/40 transition-all flex flex-col justify-between group cursor-pointer" onClick={async () => {
                      const userTrades = await getUserTradesForSimulation();
                      setTrades(userTrades as any);
                    }}>
                       <div className="space-y-4">
                          <div className="w-12 h-12 bg-accent/5 border border-accent/20 flex items-center justify-center">
                             <Database className="w-6 h-6 text-accent" />
                          </div>
                          <div>
                             <h4 className="font-bold uppercase text-sm mb-1">Use Existing Data</h4>
                             <p className="text-[10px] font-mono text-text-tertiary uppercase leading-relaxed">Fetch trades already synced to your Drawdown dashboard.</p>
                          </div>
                       </div>
                       {trades.length > 0 && (
                         <div className="mt-6 p-3 bg-profit/5 border border-profit/20 flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-profit" />
                            <span className="text-[10px] font-mono text-profit uppercase font-bold">{trades.length} Trades Loaded</span>
                         </div>
                       )}
                    </div>

                    <div className="p-8 border border-dashed border-border-slate hover:border-accent/40 transition-all flex flex-col justify-center items-center text-center gap-4 group cursor-pointer">
                       <Upload className="w-8 h-8 text-text-tertiary group-hover:text-accent transition-colors" />
                       <div>
                          <h4 className="font-bold uppercase text-sm mb-1">Upload New CSV</h4>
                          <p className="text-[10px] font-mono text-text-tertiary uppercase">MT4 / MT5 / cTrader Reports</p>
                       </div>
                    </div>
                 </div>

                 <div className="flex justify-between items-center pt-8 border-t border-border-slate">
                    <button onClick={() => setStep(2)} className="text-[10px] font-bold uppercase tracking-widest text-text-tertiary hover:text-text-primary">Back</button>
                    <button 
                      onClick={handleRunSimulation}
                      disabled={trades.length === 0}
                      className="px-12 py-5 bg-accent text-background-primary text-[10px] font-bold uppercase tracking-widest hover:invert transition-all flex items-center gap-2 disabled:opacity-50"
                    >
                       Run Simulation <Play className="w-4 h-4 fill-current" />
                    </button>
                 </div>
              </div>
            )}

            {/* Step 4: Simulating */}
            {step === 4 && (
              <div className="flex flex-col items-center justify-center py-24 space-y-8 animate-in fade-in duration-700">
                 <div className="relative">
                    <div className="w-24 h-24 border-4 border-accent/10 border-t-accent animate-spin" />
                    <Zap className="w-10 h-10 text-accent absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                 </div>
                 <div className="text-center space-y-2">
                    <h3 className="text-2xl font-display font-bold uppercase">Replaying History...</h3>
                    <p className="text-xs font-mono text-text-tertiary uppercase tracking-widest">Evaluating {trades.length} trades against {selectedFirm?.name} parameters</p>
                 </div>
              </div>
            )}

            {/* Step 5: Results */}
            {step === 5 && result && (
              <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000">
                 {/* Hero Result */}
                 <div className={cn(
                   "p-12 border flex flex-col md:flex-row items-center justify-between gap-12",
                   result.result === 'pass' ? "border-profit/30 bg-profit/5" : "border-loss/30 bg-loss/5"
                 )}>
                    <div className="space-y-4 text-center md:text-left">
                       <span className={cn(
                         "px-4 py-1 text-[10px] font-bold uppercase tracking-widest inline-block border",
                         result.result === 'pass' ? "border-profit text-profit" : "border-loss text-loss"
                       )}>
                         Simulation Result: {result.result.toUpperCase().replace('_', ' ')}
                       </span>
                       <h2 className="text-6xl font-display font-black uppercase">
                         {result.result === 'pass' ? 'You Passed.' : 'Challenge Failed.'}
                       </h2>
                       <p className="text-sm text-text-secondary max-w-md">
                         {result.result === 'pass' 
                           ? `Your trading strategy is robust enough to pass the ${selectedFirm?.name} evaluation with ${result.tradingDays} active days.`
                           : `Breach detected. ${result.breachReason} on ${result.breachDate?.split('T')[0]}.`
                         }
                       </p>
                    </div>

                    <div className="flex flex-col items-center gap-4">
                       <div className="text-center">
                          <span className="text-[10px] font-mono text-text-tertiary uppercase block mb-1">Risk Exposure Score</span>
                          <div className={cn(
                            "text-5xl font-display font-bold",
                            result.riskScore > 80 ? "text-loss" : result.riskScore > 50 ? "text-warning" : "text-profit"
                          )}>
                             {result.riskScore}/100
                          </div>
                       </div>
                       <div className="w-48 h-2 bg-background-elevated overflow-hidden">
                          <div 
                            className={cn(
                              "h-full transition-all duration-1000",
                              result.riskScore > 80 ? "bg-loss" : result.riskScore > 50 ? "bg-warning" : "bg-profit"
                            )}
                            style={{ width: `${result.riskScore}%` }}
                          />
                       </div>
                    </div>
                 </div>

                 {/* Stats Grid */}
                 <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <div className="p-6 bg-background-elevated border border-border-slate">
                       <span className="text-[9px] font-mono text-text-tertiary uppercase block mb-2">Final Balance</span>
                       <div className="text-xl font-display font-bold">{formatCurrency(result.finalBalance, "USD")}</div>
                    </div>
                    <div className="p-6 bg-background-elevated border border-border-slate">
                       <span className="text-[9px] font-mono text-text-tertiary uppercase block mb-2">Max DD Reached</span>
                       <div className={cn("text-xl font-display font-bold", result.maxDrawdownReached > result.maxDrawdownLimit ? "text-loss" : "")}>
                          {formatCurrency(result.maxDrawdownReached, "USD")}
                       </div>
                    </div>
                    <div className="p-6 bg-background-elevated border border-border-slate">
                       <span className="text-[9px] font-mono text-text-tertiary uppercase block mb-2">Worst Daily Loss</span>
                       <div className={cn("text-xl font-display font-bold", result.maxDailyLossReached > result.dailyLossLimit ? "text-loss" : "")}>
                          {formatCurrency(result.maxDailyLossReached, "USD")}
                       </div>
                    </div>
                    <div className="p-6 bg-background-elevated border border-border-slate">
                       <span className="text-[9px] font-mono text-text-tertiary uppercase block mb-2">Trading Days</span>
                       <div className="text-xl font-display font-bold">{result.tradingDays} / {result.minTradingDays}</div>
                    </div>
                 </div>

                 {/* AI Prep Plan */}
                 <div className="bg-background-elevated border border-accent/20 p-12">
                    <div className="flex items-center justify-between mb-8">
                       <div className="flex items-center gap-3">
                          <Brain className="w-6 h-6 text-accent" />
                          <h3 className="text-xl font-display font-bold uppercase">AI Challenge <span className="text-accent">Prep Plan.</span></h3>
                       </div>
                       {!aiPlan && !isGeneratingPlan && (
                         <button 
                           onClick={handleGetAIPlan}
                           className="px-6 py-3 bg-accent text-background-primary text-[10px] font-bold uppercase tracking-widest hover:invert transition-all"
                         >
                            Analyze with AI
                         </button>
                       )}
                    </div>

                    {isGeneratingPlan ? (
                      <div className="flex flex-col items-center justify-center py-12 gap-4">
                         <Loader2 className="w-8 h-8 text-accent animate-spin" />
                         <p className="text-[10px] font-mono text-text-tertiary uppercase tracking-widest">Claude is analyzing your trade distribution...</p>
                      </div>
                    ) : aiPlan ? (
                      <div className="prose prose-invert prose-sm max-w-none prose-p:leading-relaxed prose-p:text-text-secondary">
                         {aiPlan.split('\n\n').map((para, i) => (
                           <p key={i}>{para}</p>
                         ))}
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-12 text-center">
                         <p className="text-sm text-text-tertiary mb-6">Unlock a deep-dive analysis of your simulation breach points and a 30-day action plan.</p>
                      </div>
                    )}
                 </div>

                 <div className="flex justify-center pt-8">
                    <button 
                      onClick={() => setStep(1)}
                      className="px-10 py-4 border border-border-slate text-[10px] font-bold uppercase tracking-widest hover:bg-background-elevated transition-colors"
                    >
                       Try New Simulation
                    </button>
                 </div>
              </div>
            )}

         </div>
      </div>
    </div>
  );
}

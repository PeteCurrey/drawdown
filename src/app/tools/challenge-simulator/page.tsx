import { Globe, Upload, Zap, ArrowRight, ShieldCheck, Play } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Prop Firm Challenge Simulator | Drawdown",
  description: "Test your real trades against FTMO, The5ers, and Topstep rules before you pay for a challenge. See if you would pass or fail.",
};

export default function SimulatorMarketingPage() {
  return (
    <div className="bg-background-primary pt-24 pb-48">
      {/* Hero */}
      <section className="container mx-auto px-6 mb-32">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <span className="text-accent font-mono text-xs uppercase tracking-[0.5em] block animate-in fade-in slide-in-from-bottom-4 duration-700">
            // RISK DE-ESCALATION TOOL
          </span>
          <h1 className="text-6xl md:text-8xl font-display font-black uppercase leading-none tracking-tighter animate-in fade-in slide-in-from-bottom-8 duration-1000">
            Stop Paying <br /> To <span className="text-loss">Fail.</span>
          </h1>
          <p className="text-xl text-text-secondary max-w-2xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-200">
            Prop firm challenges cost £100–1,000+. Most traders fail. Our simulator replays your real trade history against any firm's rules—so you know you'll pass before you pay.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8 animate-in fade-in slide-in-from-bottom-16 duration-1000 delay-500">
             <Link 
               href="/signup" 
               className="w-full sm:w-auto px-12 py-6 bg-accent text-background-primary font-bold uppercase tracking-widest text-xs hover:invert transition-all flex items-center justify-center gap-2"
             >
                Start Free Simulation <ArrowRight className="w-4 h-4" />
             </Link>
             <Link 
               href="/learn-to-trade/prop-firms" 
               className="w-full sm:w-auto px-12 py-6 border border-border-slate text-text-primary font-bold uppercase tracking-widest text-xs hover:bg-background-elevated transition-all"
             >
                View Firm Database
             </Link>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="container mx-auto px-6 mb-48">
         <div className="grid grid-cols-1 lg:grid-cols-3 gap-1 px-1 bg-border-slate/30 border border-border-slate/30">
            <div className="bg-background-primary p-16 space-y-8">
               <div className="w-16 h-16 bg-background-elevated flex items-center justify-center border border-border-slate">
                  <Globe className="w-8 h-8 text-accent" />
               </div>
               <div>
                  <h3 className="text-2xl font-display font-bold uppercase mb-4">1. Select Firm</h3>
                  <p className="text-sm text-text-tertiary leading-relaxed uppercase">
                    Choose from FTMO, The5ers, Apex, or Topstep. We apply their exact daily loss and trailing drawdown algorithms.
                  </p>
               </div>
            </div>
            <div className="bg-background-primary p-16 space-y-8">
               <div className="w-16 h-16 bg-background-elevated flex items-center justify-center border border-border-slate">
                  <Upload className="w-8 h-8 text-accent" />
               </div>
               <div>
                  <h3 className="text-2xl font-display font-bold uppercase mb-4">2. Upload Trades</h3>
                  <p className="text-sm text-text-tertiary leading-relaxed uppercase">
                    Drag and drop your MT4/MT5 trade history. Our engine parses the data instantly to prepare for the replay.
                  </p>
               </div>
            </div>
            <div className="bg-background-primary p-16 space-y-8">
               <div className="w-16 h-16 bg-background-elevated flex items-center justify-center border border-border-slate">
                  <Zap className="w-8 h-8 text-accent" />
               </div>
               <div>
                  <h3 className="text-2xl font-display font-bold uppercase mb-4">3. Replay & React</h3>
                  <p className="text-sm text-text-tertiary leading-relaxed uppercase">
                    Watch your equity curve draw itself against the breach limits. Get a pass/fail verdict and AI coaching.
                  </p>
               </div>
            </div>
         </div>
      </section>

      {/* Why it Matters */}
      <section className="container mx-auto px-6">
         <div className="max-w-6xl mx-auto bg-background-elevated border border-border-slate overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2">
               <div className="p-16 md:p-24 space-y-12 border-b lg:border-b-0 lg:border-r border-border-slate">
                  <div className="space-y-4">
                     <span className="text-[10px] font-mono text-text-tertiary uppercase tracking-widest block">// THE PROBLEM</span>
                     <h2 className="text-4xl font-display font-bold uppercase">The Hidden <br /> Breach Points.</h2>
                  </div>
                  <div className="space-y-8">
                     <div className="flex gap-6">
                        <div className="shrink-0 w-6 h-6 rounded-full bg-loss/10 flex items-center justify-center">
                           <div className="w-2 h-2 rounded-full bg-loss" />
                        </div>
                        <p className="text-sm text-text-secondary leading-relaxed">
                           <strong className="text-text-primary uppercase">Trailing Drawdowns:</strong> Most traders fail Apex or Topstep because they don't realize how intraday peaks lock in drawdown. Our simulator shows you exactly where you'd have hit the floor.
                        </p>
                     </div>
                     <div className="flex gap-6">
                        <div className="shrink-0 w-6 h-6 rounded-full bg-loss/10 flex items-center justify-center">
                           <div className="w-2 h-2 rounded-full bg-loss" />
                        </div>
                        <p className="text-sm text-text-secondary leading-relaxed">
                           <strong className="text-text-primary uppercase">Equity-Based P&L:</strong> Some firms breach you based on floating equity, not closed balance. We replay your trades with tick-level awareness to catch these violations.
                        </p>
                     </div>
                  </div>
               </div>
               <div className="p-16 md:p-24 bg-background-surface flex flex-col justify-center items-center text-center space-y-8">
                  <ShieldCheck className="w-16 h-16 text-profit" />
                  <h3 className="text-2xl font-display font-bold uppercase">Ready to get funded?</h3>
                  <p className="text-sm text-text-secondary max-w-sm mx-auto uppercase tracking-wide">
                     The simulator is free for your first run. Drawdown Edge members get unlimited simulations and AI-generated challenge preparation plans.
                  </p>
                  <Link 
                    href="/signup" 
                    className="px-12 py-6 bg-accent text-background-primary font-bold uppercase tracking-widest text-xs hover:invert transition-all"
                  >
                     Launch Simulator
                  </Link>
               </div>
            </div>
         </div>
      </section>
    </div>
  );
}

'use client';

import { useParams, notFound } from "next/navigation";
import { 
  CheckCircle2, 
  ShieldCheck, 
  ExternalLink, 
  ArrowRight, 
  AlertCircle, 
  Zap, 
  Lock,
  ArrowLeft,
  ChevronRight,
  Star
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { brokers } from "@/data/brokers";

export default function BrokerBridgePage() {
  const { slug } = useParams();
  const broker = brokers.find(b => b.slug === slug);

  if (!broker) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background-primary pt-32 pb-24">
      <div className="container mx-auto px-6 max-w-4xl">
        
        {/* Back link */}
        <Link 
          href="/brokers" 
          className="inline-flex items-center gap-2 text-[10px] font-mono text-text-tertiary uppercase tracking-widest hover:text-accent transition-colors mb-12"
        >
          <ArrowLeft className="w-3 h-3" /> All Brokers
        </Link>

        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
           {/* Header / Identity */}
           <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 pb-12 border-b border-border-slate">
              <div className="flex items-center gap-6">
                 <div className="w-20 h-20 bg-white p-4 rounded-xl flex items-center justify-center border border-border-slate">
                    {/* Placeholder for logo since we use SVGs from public/brokers */}
                    <span className="text-background-primary font-black text-xl">{broker.name.slice(0, 2).toUpperCase()}</span>
                 </div>
                 <div className="space-y-2">
                    <div className="flex items-center gap-2">
                       <h1 className="text-4xl font-display font-bold uppercase">{broker.name}</h1>
                       {broker.fcaRegulated && (
                          <div className="group relative">
                             <ShieldCheck className="w-6 h-6 text-profit" />
                             <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-background-elevated border border-border-slate text-[8px] font-mono uppercase text-center hidden group-hover:block">
                                FCA Regulated & FSCS Protected
                             </div>
                          </div>
                       )}
                    </div>
                    <p className="text-text-secondary text-lg font-display italic">"{broker.oneLine}"</p>
                 </div>
              </div>
              
              <div className="flex flex-col items-end gap-2">
                 <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className={cn("w-4 h-4", i < Math.floor(broker.rating) ? "fill-accent text-accent" : "text-text-tertiary")} />
                    ))}
                    <span className="text-sm font-mono font-bold ml-2">{broker.rating} / 5.0</span>
                 </div>
                 <span className="text-[10px] font-mono text-text-tertiary uppercase tracking-widest">Drawdown Verified Partner</span>
              </div>
           </div>

           {/* Core Value Props */}
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { label: "Min. Deposit", value: broker.minDeposit },
                { label: "Avg. Spreads", value: broker.spreads },
                { label: "Regulation", value: broker.fcaRegulated ? "FCA (UK)" : "Global Tier-1" },
              ].map((stat, i) => (
                <div key={i} className="p-6 bg-background-surface border border-border-slate space-y-1">
                   <p className="text-[9px] font-mono text-text-tertiary uppercase tracking-widest">{stat.label}</p>
                   <p className="text-xl font-display font-bold uppercase">{stat.value}</p>
                </div>
              ))}
           </div>

           {/* The "Why" Section */}
           <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-8">
              <div className="space-y-6">
                 <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-text-tertiary">The Pros</h3>
                 <div className="space-y-4">
                    {broker.pros.map((pro, i) => (
                       <div key={i} className="flex items-start gap-3">
                          <CheckCircle2 className="w-5 h-5 text-profit shrink-0 mt-0.5" />
                          <p className="text-sm text-text-secondary leading-relaxed">{pro}</p>
                       </div>
                    ))}
                 </div>
              </div>

              <div className="space-y-6">
                 <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-text-tertiary">The Honest Take</h3>
                 <div className="p-8 bg-background-elevated border-l-4 border-accent space-y-4">
                    <Zap className="w-6 h-6 text-accent" />
                    <p className="text-sm text-text-primary leading-relaxed italic">
                       "If you're looking for {broker.category === 'Forex' ? 'raw execution and no nonsense' : 'a solid all-round platform'}, {broker.name} is where we send most of our private community members. They don't play games with fills."
                    </p>
                    <p className="text-[10px] font-mono text-text-tertiary uppercase">— Pete Currey, Founder</p>
                 </div>
              </div>
           </div>

           {/* CTA Section */}
           <div className="pt-12">
              <div className="p-12 bg-background-surface border border-border-slate flex flex-col items-center text-center space-y-8 relative overflow-hidden group">
                 <div className="absolute top-0 left-0 w-full h-1 bg-accent" />
                 
                 <div className="space-y-2 relative z-10">
                    <h2 className="text-3xl font-display font-bold uppercase">Ready to Open Your Account?</h2>
                    <p className="text-text-tertiary text-sm max-w-lg mx-auto">
                       Click below to visit {broker.name} via our secure partner link. You'll get our specific community terms and priority support.
                    </p>
                 </div>

                 <Link 
                   href={`/go/${broker.slug}`}
                   className="px-12 py-6 bg-accent text-background-primary font-bold uppercase tracking-widest text-sm hover:invert transition-all flex items-center gap-3 relative z-10"
                 >
                    Open {broker.name} Account <ExternalLink className="w-4 h-4" />
                 </Link>

                 <div className="flex items-center gap-6 text-[9px] font-mono text-text-tertiary uppercase tracking-widest relative z-10">
                    <div className="flex items-center gap-1"><Lock className="w-3 h-3" /> Secure Redirect</div>
                    <div className="flex items-center gap-1"><ShieldCheck className="w-3 h-3" /> FSCS Protected</div>
                 </div>

                 <div className="absolute -bottom-10 -right-10 opacity-5 rotate-12 transition-transform group-hover:rotate-0 duration-1000">
                    <Star className="w-64 h-64 text-accent" />
                 </div>
              </div>
           </div>

           {/* Disclaimer */}
           <p className="text-[10px] text-text-tertiary text-center leading-relaxed max-w-2xl mx-auto">
              Trading carries risk. We may receive a commission if you open an account via our links. This does not change the cost to you, but it supports our data operations. We only partner with brokers we have personally audited.
           </p>

        </div>
      </div>
    </div>
  );
}

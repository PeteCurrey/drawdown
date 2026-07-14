import { Shield, Target, Activity, TrendingUp, ArrowRight, ExternalLink } from "lucide-react";
import Link from "next/link";
import { AU_BROKERS } from "@/data/seo/au-data";

export default function AustralianBrokerHub() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 border-b border-border-slate/50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="max-w-4xl space-y-8">
            <div className="flex items-center gap-3 text-accent transition-all duration-700">
               <div className="w-8 h-[1px] bg-accent" />
               <span className="text-[10px] font-mono uppercase tracking-[0.3em]">ASIC REGULATED DIRECTORY</span>
            </div>
            
            <h1 className="text-4xl md:text-7xl font-sans font-black uppercase leading-[0.95] tracking-tight">
              Best Brokers for <br />
              <span className="text-accent underline decoration-accent/20">Australian Traders.</span>
            </h1>
            
            <p className="text-lg md:text-xl text-text-secondary leading-relaxed max-w-2xl font-medium">
              We rank Australian brokers by ECN execution quality, slippage data, and regulatory transparency. Every broker listed below is verified by the Australian Securities and Investments Commission (ASIC).
            </p>
          </div>
        </div>

        {/* Decorative Map Pattern */}
        <div className="absolute top-0 right-0 w-1/3 h-full opacity-5 pointer-events-none">
           <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--color-accent)_1px,transparent_1px)] [background-size:24px_24px]" />
        </div>
      </section>

      {/* Broker List */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="space-y-8">
            {AU_BROKERS.map((broker, index) => (
              <div key={broker.slug} className="bg-background-surface/40 backdrop-blur-md border border-border-slate/50 transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,0,0,0.2)] hover:border-border-slate hover:-translate-y-0.5 hover:border-border-slate/70 transition-all p-8 md:p-12 relative overflow-hidden group">
                 {/* Ranking Number */}
                 <div className="absolute -top-4 -left-4 text-9xl font-sans font-black text-white/5 select-none italic group-hover:text-profit transition-colors">
                    0{index + 1}
                 </div>

                 <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                    <div className="lg:col-span-4 space-y-4">
                       <div className="flex items-center gap-3">
                          <h3 className="text-3xl md:text-4xl font-sans font-black uppercase text-text-primary">{broker.name}</h3>
                          {broker.badge && (
                            <span className="px-3 py-1 bg-accent/10 border border-border-slate/50/20 text-accent text-[8px] font-mono uppercase tracking-widest font-bold">
                               {broker.badge}
                            </span>
                          )}
                       </div>
                       <div className="flex items-center gap-2 text-[10px] font-mono text-text-tertiary tracking-widest">
                          <Shield className="w-3 h-3 text-accent" />
                          AFSL {broker.afsl}
                       </div>
                       <p className="text-sm text-text-secondary leading-relaxed">
                          {broker.description}
                       </p>
                    </div>

                    <div className="lg:col-span-4 grid grid-cols-1 gap-4">
                       {broker.pros.map((pro, i) => (
                          <div key={i} className="flex items-center gap-3 py-2 px-4 /50 border border-border-slate/30">
                             <div className="w-1.5 h-1.5 rounded-full bg-profit" />
                             <span className="text-[10px] font-mono uppercase tracking-widest text-text-secondary">{pro}</span>
                          </div>
                       ))}
                    </div>

                    <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-4">
                       <Link 
                          href={`/au/brokers/${broker.slug}`}
                          className="flex-1 py-4 bg-background-elevated/40 border border-border-slate/50 hover:border-border-slate text-center text-[10px] font-bold uppercase tracking-widest transition-all"
                       >
                          Read Deep Dive
                       </Link>
                       <a 
                          href={broker.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 py-4 bg-accent text-[#08090D] hover:bg-accent-hover text-center text-[10px] font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2"
                       >
                          Open Account <ExternalLink className="w-3 h-3" />
                       </a>
                    </div>
                 </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Education Upsell */}
      <section className="py-24 border-y border-border-slate/50">
         <div className="max-w-7xl mx-auto px-6 text-center">
            <div className="max-w-2xl mx-auto space-y-8">
               <Target className="w-12 h-12 text-accent mx-auto" />
               <h2 className="text-3xl md:text-5xl font-sans font-black uppercase">The Strategy Matters <br /> More Than The Broker.</h2>
               <p className="text-text-secondary leading-relaxed">
                  Choosing an ASIC regulated broker is just step one. Without a verified edge and a professional routine, you are just high-quality liquidity for the institutions.
               </p>
               <Link href="/au/courses" className="inline-flex items-center gap-4 text-[#08090D] px-10 py-5 font-sans font-black uppercase tracking-[0.2em] text-sm hover:translate-y-[-2px] transition-all">
                  Join The Curriculum <ArrowRight className="w-4 h-4" />
               </Link>
            </div>
         </div>
      </section>
    </div>
  );
}

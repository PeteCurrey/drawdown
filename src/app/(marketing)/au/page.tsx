import { Shield, Target, Activity, TrendingUp, ArrowRight, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { AU_BROKERS } from "@/data/seo/au-data";

export default function AustralianHomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 bg-background-primary overflow-hidden border-b border-border-slate">
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl space-y-8">
            <div className="flex items-center gap-3 text-accent transition-all duration-700">
               <div className="w-8 h-[1px] bg-accent" />
               <span className="text-[10px] font-mono uppercase tracking-[0.3em]">BUILT FOR AUSTRALIAN TRADERS</span>
            </div>
            
            <h1 className="text-5xl md:text-8xl font-display font-extrabold uppercase tracking-tight leading-[0.9]">
              Trade The <br />
              <span className="text-accent underline decoration-accent/20">Truth.</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-text-secondary leading-relaxed max-w-2xl font-medium">
              professional-grade education and data for Australia's most disciplined traders. ASIC-regulated insights, AUD-normalized analysis, and a professional edge.
            </p>

            <div className="flex flex-wrap gap-4 pt-4">
              <Link href="/au/courses" className="px-8 py-4 bg-accent text-[#08090D] font-bold uppercase tracking-widest text-xs hover:bg-accent-hover transition-colors flex items-center gap-2">
                Start Curriculum <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/au/brokers" className="px-8 py-4 border border-border-slate hover:border-accent text-text-primary font-bold uppercase tracking-widest text-xs transition-colors">
                ASIC Broker Guide
              </Link>
            </div>
          </div>
        </div>

        {/* Market Ticker Simulator */}
        <div className="mt-20 border-y border-border-slate bg-background-surface/50 backdrop-blur-md">
           <div className="container mx-auto px-6 py-6 overflow-hidden">
              <div className="flex items-center gap-12 whitespace-nowrap animate-marquee">
                 {[
                   { name: "ASX 200", value: "7,782.40", change: "+0.45%" },
                   { name: "AUD/USD", value: "0.6582", change: "+0.12%" },
                   { name: "S&P 500", value: "5,248.50", change: "+0.85%" },
                   { name: "GOLD (XAU/AUD)", value: "3,542.10", change: "+1.20%" },
                   { name: "ASX 200", value: "7,782.40", change: "+0.45%" },
                   { name: "AUD/USD", value: "0.6582", change: "+0.12%" },
                 ].map((item, i) => (
                   <div key={i} className="flex items-center gap-4 border-r border-border-slate pr-12 last:border-0">
                      <span className="text-[10px] font-mono text-text-tertiary uppercase tracking-widest">{item.name}</span>
                      <span className="text-sm font-bold text-text-primary">{item.value}</span>
                      <span className="text-[10px] font-mono text-profit">{item.change}</span>
                   </div>
                 ))}
              </div>
           </div>
        </div>
      </section>

      {/* ASIC Trust Module */}
      <section className="py-24 bg-background-surface border-b border-border-slate">
         <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
               <div className="space-y-8">
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-accent/10 border border-accent/20 rounded-full">
                     <Shield className="w-3 h-3 text-accent" />
                     <span className="text-[10px] font-mono uppercase tracking-widest text-accent">ASIC Compliance First</span>
                  </div>
                  <h2 className="text-4xl md:text-5xl font-display font-black uppercase leading-none">
                     Your Edge, <br /> Australian Regulated.
                  </h2>
                  <p className="text-lg text-text-secondary leading-relaxed">
                     Australia remains one of the world's premier trading jurisdictions. But with institutional 1:30 leverage caps and strict client money rules, you need to know exactly where your capital is safest.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-accent shrink-0" />
                        <span className="text-sm text-text-secondary">Segregated client trust accounts at Tier 1 AU banks.</span>
                     </div>
                     <div className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-accent shrink-0" />
                        <span className="text-sm text-text-secondary">Local Australian support and arbitration (AFCA).</span>
                     </div>
                  </div>
               </div>
               <div className="relative aspect-video bg-background-primary border border-border-slate overflow-hidden group">
                  <div className="absolute inset-0 bg-accent/5 opacity-50 group-hover:opacity-0 transition-opacity" />
                  <div className="absolute inset-0 flex items-center justify-center">
                     <Activity className="w-16 h-16 text-accent/20" />
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* Broker Hub Preview */}
      <section className="py-24 bg-background-primary">
         <div className="container mx-auto px-6">
            <div className="mb-16 flex justify-between items-end">
               <div className="space-y-4">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-accent font-bold">// THE SHORTLIST</span>
                  <h2 className="text-4xl font-display font-bold uppercase">Best ASIC Brokers.</h2>
               </div>
               <Link href="/au/brokers" className="hidden md:flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-text-tertiary hover:text-accent transition-colors">
                  View Full Directory <ArrowRight className="w-4 h-4" />
               </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
               {AU_BROKERS.slice(0, 3).map((broker) => (
                  <div key={broker.slug} className="p-8 bg-background-surface border border-border-slate hover:border-accent/30 transition-premium relative group">
                     {broker.badge && (
                       <div className="absolute top-0 right-0 bg-accent text-[#08090D] px-3 py-1 text-[10px] font-bold uppercase tracking-widest">
                          {broker.badge}
                       </div>
                     )}
                     <h3 className="text-2xl font-display font-bold uppercase mb-4">{broker.name}</h3>
                     <p className="text-sm text-text-secondary mb-8 h-12 leading-relaxed">
                        {broker.description}
                     </p>
                     <div className="space-y-3 mb-8">
                        {broker.pros.map((pro, i) => (
                           <div key={i} className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-text-tertiary">
                              <TrendingUp className="w-3 h-3 text-profit" />
                              {pro}
                           </div>
                        ))}
                     </div>
                     <Link href={`/au/brokers/${broker.slug}`} className="block w-full py-4 border border-border-slate group-hover:border-accent text-center text-[10px] font-bold uppercase tracking-widest group-hover:bg-accent group-hover:text-[#08090D] transition-all">
                        Read Deep Dive
                     </Link>
                  </div>
               ))}
            </div>
         </div>
      </section>
    </div>
  );
}

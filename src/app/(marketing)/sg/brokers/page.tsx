import { Shield, Target, Activity, TrendingUp, ArrowRight, ExternalLink } from "lucide-react";
import Link from "next/link";
import { SG_BROKERS } from "@/data/seo/sg-data";

export default function SingaporeBrokerHub() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 border-b border-mkt-bd overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="max-w-4xl space-y-8">
            <div className="flex items-center gap-3 text-accent transition-all duration-700">
               <div className="w-8 h-[1px] bg-accent" />
               <span className="text-[10px] font-mono uppercase tracking-[0.3em]">MAS REGULATED DIRECTORY</span>
            </div>
            
            <h1 className="text-4xl md:text-7xl font-sans font-black uppercase leading-[0.95] tracking-tight">
              Best Brokers for <br />
              <span className="text-accent underline decoration-accent/20">Singapore Traders.</span>
            </h1>
            
            <p className="text-lg md:text-xl text-mkt-i2 leading-relaxed max-w-2xl font-medium">
              We rank Singaporean brokers by MAS execution compliance, slippage data, and retail client protection. Every broker listed below is verified by the Monetary Authority of Singapore (MAS).
            </p>
          </div>
        </div>
      </section>

      {/* Broker List */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="space-y-8">
            {SG_BROKERS.map((broker, index) => (
              <div key={broker.slug} className="bg-white border border-mkt-bd hover:border-mkt-bds/30 transition-all p-8 md:p-12 relative overflow-hidden group">
                 <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                    <div className="lg:col-span-4 space-y-4">
                       <div className="flex items-center gap-3">
                          <h3 className="text-3xl font-sans font-bold uppercase text-mkt-ink">{broker.name}</h3>
                          {broker.badge && (
                            <span className="px-3 py-1 bg-accent/10 border border-mkt-bd/20 text-accent text-[8px] font-mono uppercase tracking-widest font-bold">
                               {broker.badge}
                            </span>
                          )}
                       </div>
                       <div className="flex items-center gap-2 text-[10px] font-mono text-mkt-i4 tracking-widest">
                          <Shield className="w-3 h-3 text-accent" />
                          MAS REGULATED
                       </div>
                       <p className="text-sm text-mkt-i2 leading-relaxed opacity-70">
                          {broker.description}
                       </p>
                    </div>

                    <div className="lg:col-span-4 grid grid-cols-1 gap-4">
                       {broker.pros.map((pro, i) => (
                          <div key={i} className="flex items-center gap-3 py-2 px-4 bg-white/50 border border-mkt-bd/50">
                             <div className="w-1.5 h-1.5 rounded-full bg-profit" />
                             <span className="text-[10px] font-mono uppercase tracking-widest text-mkt-i2">{pro}</span>
                          </div>
                       ))}
                    </div>

                    <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-4">
                       <Link 
                          href={`/sg/brokers/${broker.slug}`}
                          className="flex-1 py-4 bg-[#F7F7F7] border border-mkt-bd hover:border-mkt-bds text-center text-[10px] font-bold uppercase tracking-widest transition-all"
                       >
                          Read Review
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
    </div>
  );
}

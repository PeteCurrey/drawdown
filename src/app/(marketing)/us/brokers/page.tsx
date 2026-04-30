import { Shield, Target, Activity, TrendingUp, ArrowRight, ExternalLink, AlertTriangle } from "lucide-react";
import Link from "next/link";
import { US_BROKERS } from "@/data/seo/us-data";

export default function UnitedStatesBrokerHub() {
  const forexBrokers = US_BROKERS.filter(b => b.type === 'Forex' || b.type === 'Multi-Asset');
  const stockBrokers = US_BROKERS.filter(b => b.type === 'Stocks' || b.type === 'Stocks/Options' || b.type === 'Stocks/Crypto');

  return (
    <div className="flex flex-col min-h-screen bg-background-primary">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 border-b border-border-slate overflow-hidden">
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl space-y-8">
            <div className="flex items-center gap-3 text-accent transition-all duration-700">
               <div className="w-8 h-[1px] bg-accent" />
               <span className="text-[10px] font-mono uppercase tracking-[0.3em]">CFTC & SEC COMPLIANT DIRECTORY</span>
            </div>
            
            <h1 className="text-4xl md:text-7xl font-display font-black uppercase leading-[0.95] tracking-tight">
              Best Brokers for <br />
              <span className="text-accent underline decoration-accent/20">United States.</span>
            </h1>
            
            <p className="text-lg md:text-xl text-text-secondary leading-relaxed max-w-2xl font-medium">
              We only list brokers registered with the CFTC/NFA for forex, and SEC/FINRA for equities. No offshore entities. No unregulated platforms. Only institutional-grade US compliance.
            </p>
          </div>
        </div>
      </section>

      {/* CFTC Disclaimer */}
      <section className="py-8 bg-background-surface border-b border-border-slate">
         <div className="container mx-auto px-6">
            <div className="flex items-start gap-4 p-6 bg-background-primary border border-warning/20">
               <AlertTriangle className="w-6 h-6 text-warning shrink-0" />
               <div className="space-y-2">
                  <p className="text-[10px] font-mono uppercase font-bold text-warning">Required CFTC Disclaimer</p>
                  <p className="text-[10px] font-mono text-text-tertiary leading-relaxed uppercase">
                    FOREX TRADING INVOLVES SIGNIFICANT RISK OF LOSS AND IS NOT SUITABLE FOR ALL INVESTORS. INCREASING LEVERAGE INCREASES RISK. HYPOTHETICAL PERFORMANCE RESULTS HAVE MANY INHERENT LIMITATIONS.
                  </p>
               </div>
            </div>
         </div>
      </section>

      {/* Broker Categories */}
      <section className="py-24">
        <div className="container mx-auto px-6 space-y-32">
          
          {/* Forex & Futures Section */}
          <div className="space-y-12">
            <div className="space-y-4">
               <h2 className="text-3xl font-display font-bold uppercase tracking-tight">Regulated Forex & Futures</h2>
               <div className="w-24 h-1 bg-accent" />
            </div>
            <div className="grid grid-cols-1 gap-8">
               {forexBrokers.map((broker) => (
                  <BrokerRow key={broker.slug} broker={broker} />
               ))}
            </div>
          </div>

          {/* Stocks & Options Section */}
          <div className="space-y-12">
            <div className="space-y-4">
               <h2 className="text-3xl font-display font-bold uppercase tracking-tight">Equities, Options & Bonds</h2>
               <div className="w-24 h-1 bg-accent" />
            </div>
            <div className="grid grid-cols-1 gap-8">
               {stockBrokers.map((broker) => (
                  <BrokerRow key={broker.slug} broker={broker} />
               ))}
            </div>
          </div>

        </div>
      </section>

      {/* Educational Note */}
      <section className="py-24 bg-background-surface border-y border-border-slate">
         <div className="container mx-auto px-6 text-center">
            <div className="max-w-2xl mx-auto space-y-8">
               <Activity className="w-12 h-12 text-accent mx-auto" />
               <h2 className="text-3xl md:text-5xl font-display font-black uppercase">Understand Your Data.</h2>
               <p className="text-text-secondary leading-relaxed">
                  US markets offer the deepest liquidity on earth, but they also have the strictest rules. From FIFO (First In First Out) to the PDT rule, your strategy must be built for the American environment.
               </p>
               <Link href="/us/courses" className="inline-flex items-center gap-4 bg-white text-[#08090D] px-10 py-5 font-display font-black uppercase tracking-[0.2em] text-sm hover:translate-y-[-2px] transition-all">
                  Access US Curriculum <ArrowRight className="w-4 h-4" />
               </Link>
            </div>
         </div>
      </section>
    </div>
  );
}

function BrokerRow({ broker }: { broker: any }) {
  return (
    <div className="bg-background-surface border border-border-slate hover:border-accent/30 transition-all p-8 md:p-12 relative overflow-hidden group">
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-4 space-y-4">
          <div className="flex items-center gap-3">
            <h3 className="text-3xl font-display font-black uppercase text-text-primary">{broker.name}</h3>
            {broker.badge && (
              <span className="px-3 py-1 bg-accent/10 border border-accent/20 text-accent text-[8px] font-mono uppercase tracking-widest font-bold">
                {broker.badge}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 text-[10px] font-mono text-text-tertiary tracking-widest">
            <Shield className="w-3 h-3 text-accent" />
            {broker.regulation}
          </div>
          <p className="text-sm text-text-secondary leading-relaxed opacity-70">
            {broker.description}
          </p>
        </div>

        <div className="lg:col-span-4 grid grid-cols-1 gap-4">
          {broker.pros.map((pro: string, i: number) => (
            <div key={i} className="flex items-center gap-3 py-2 px-4 bg-background-primary/50 border border-border-slate/50">
              <div className="w-1.5 h-1.5 rounded-full bg-profit" />
              <span className="text-[10px] font-mono uppercase tracking-widest text-text-secondary">{pro}</span>
            </div>
          ))}
        </div>

        <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-4">
          <Link 
            href={`/us/brokers/${broker.slug}`}
            className="flex-1 py-4 bg-background-elevated border border-border-slate hover:border-accent text-center text-[10px] font-bold uppercase tracking-widest transition-all"
          >
            Read Review
          </Link>
          <a 
            href={broker.link}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 py-4 bg-accent text-[#08090D] hover:bg-accent-hover text-center text-[10px] font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2"
          >
            Visit Official Site <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </div>
  );
}

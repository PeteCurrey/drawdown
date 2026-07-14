import { Shield, Target, Activity, TrendingUp, ArrowRight, CheckCircle2, AlertTriangle } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { US_BROKERS } from "@/data/seo/us-data";

export default function UnitedStatesHomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 bg-background-primary overflow-hidden border-b border-border-slate">
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl space-y-8">
            <div className="flex items-center gap-3 text-accent transition-all duration-700">
               <div className="w-8 h-[1px] bg-accent" />
               <span className="text-[10px] font-mono uppercase tracking-[0.3em]">BUILT FOR US TRADERS</span>
            </div>
            
            <h1 className="text-5xl md:text-8xl font-display font-extrabold uppercase tracking-tight leading-[0.9]">
              The Business <br />
              Of <span className="text-accent underline decoration-accent/20">Risk.</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-text-secondary leading-relaxed max-w-2xl font-medium">
              professional-grade education for American traders. CFTC/NFA compliant insights, USD-normalized analysis, and a professional edge in stocks, options, and FX.
            </p>

            <div className="flex flex-wrap gap-4 pt-4">
              <Link href="/us/courses" className="px-8 py-4 bg-accent text-[#08090D] font-bold uppercase tracking-widest text-xs hover:bg-accent-hover transition-colors flex items-center gap-2 shadow-xl shadow-accent/10">
                Start Curriculum <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/us/brokers" className="px-8 py-4 border border-border-slate hover:border-accent text-text-primary font-bold uppercase tracking-widest text-xs transition-colors">
                US Broker Guide
              </Link>
            </div>
          </div>
        </div>

        {/* Market Ticker */}
        <div className="mt-20 border-y border-border-slate bg-background-surface/50 backdrop-blur-md">
           <div className="container mx-auto px-6 py-6 overflow-hidden">
              <div className="flex items-center gap-12 whitespace-nowrap animate-marquee">
                 {[
                   { name: "S&P 500", value: "5,248.50", change: "+0.85%" },
                   { name: "NASDAQ", value: "16,384.40", change: "+1.20%" },
                   { name: "DOW", value: "39,127.10", change: "+0.35%" },
                   { name: "EUR/USD", value: "1.0842", change: "-0.05%" },
                   { name: "BTC/USD", value: "68,421.50", change: "+2.40%" },
                   { name: "CRUDE OIL", value: "81.45", change: "+0.90%" },
                   { name: "S&P 500", value: "5,248.50", change: "+0.85%" },
                 ].map((item, i) => (
                   <div key={i} className="flex items-center gap-4 border-r border-border-slate pr-12 last:border-0">
                      <span className="text-[10px] font-mono text-text-tertiary uppercase tracking-widest">{item.name}</span>
                      <span className="text-sm font-bold text-text-primary">${item.value}</span>
                      <span className={cn("text-[10px] font-mono", item.change.startsWith('+') ? "text-profit" : "text-loss")}>{item.change}</span>
                   </div>
                 ))}
              </div>
           </div>
        </div>
      </section>

      {/* CFTC Disclaimer Block */}
      <section className="bg-background-elevated py-8 border-b border-border-slate">
         <div className="container mx-auto px-6">
            <div className="flex flex-col md:flex-row items-center gap-6 p-6 bg-background-primary border border-border-slate/50">
               <AlertTriangle className="w-8 h-8 text-warning shrink-0" />
               <p className="text-[10px] font-mono uppercase tracking-widest text-text-tertiary leading-relaxed">
                  <span className="text-warning font-bold">CFTC RULE 4.41:</span> HYPOTHETICAL PERFORMANCE RESULTS HAVE MANY INHERENT LIMITATIONS. NO REPRESENTATION IS BEING MADE THAT ANY ACCOUNT WILL OR IS LIKELY TO ACHIEVE PROFITS OR LOSSES SIMILAR TO THOSE SHOWN. TRADING INVOLVES SUBSTANTIAL RISK OF LOSS.
               </p>
            </div>
         </div>
      </section>

      {/* US Market Context */}
      <section className="py-24 bg-background-primary border-b border-border-slate">
         <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
               <div className="space-y-8">
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-accent/10 border border-accent/20 rounded-full">
                     <Shield className="w-3 h-3 text-accent" />
                     <span className="text-[10px] font-mono uppercase tracking-widest text-accent">NFA & FINRA Compliance</span>
                  </div>
                  <h2 className="text-4xl md:text-5xl font-display font-black uppercase leading-none">
                     Professional Tools, <br /> US Regulation.
                  </h2>
                  <p className="text-lg text-text-secondary leading-relaxed">
                     The US trading landscape is unique. From PDT rules to FIFO execution, you need a platform that understands the regulatory constraints of the CFTC and SEC. We strip away the offshore noise to focus on what works for US retail traders.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-accent shrink-0" />
                        <span className="text-sm text-text-secondary">PDT-compliant equity management tools.</span>
                     </div>
                     <div className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-accent shrink-0" />
                        <span className="text-sm text-text-secondary">IRS Section 1256/988 tax optimization data.</span>
                     </div>
                  </div>
               </div>
               <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: "STOCKS", count: "8,000+" },
                    { label: "OPTIONS", count: "1M+" },
                    { label: "FUTURES", count: "100+" },
                    { label: "FOREX", count: "68+" },
                  ].map((stat, i) => (
                    <div key={i} className="p-8 bg-background-surface border border-border-slate text-center">
                       <p className="text-3xl font-display font-black text-text-primary mb-1">{stat.count}</p>
                       <p className="text-[10px] font-mono text-accent uppercase tracking-[0.2em]">{stat.label}</p>
                    </div>
                  ))}
               </div>
            </div>
         </div>
      </section>

      {/* US Broker Hub Preview */}
      <section className="py-24 bg-background-surface">
         <div className="container mx-auto px-6">
            <div className="mb-16 flex justify-between items-end">
               <div className="space-y-4">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-accent font-bold">// TOP REGULATED BRANDS</span>
                  <h2 className="text-4xl font-display font-bold uppercase">US Broker Guide.</h2>
               </div>
               <Link href="/us/brokers" className="hidden md:flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-text-tertiary hover:text-accent transition-colors">
                  Full US Directory <ArrowRight className="w-4 h-4" />
               </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
               {US_BROKERS.slice(0, 4).map((broker) => (
                  <div key={broker.slug} className="p-8 bg-background-primary border border-border-slate hover:border-accent/30 transition-premium relative group flex flex-col justify-between">
                     <div>
                        <h3 className="text-xl font-display font-bold uppercase mb-4">{broker.name}</h3>
                        <p className="text-xs text-text-secondary mb-8 leading-relaxed opacity-70">
                           {broker.description}
                        </p>
                     </div>
                     <Link href={`/us/brokers/${broker.slug}`} className="text-[10px] font-bold uppercase tracking-widest text-accent flex items-center gap-2 group-hover:translate-x-2 transition-transform">
                        Review <ArrowRight className="w-3 h-3" />
                     </Link>
                  </div>
               ))}
            </div>
         </div>
      </section>
    </div>
  );
}

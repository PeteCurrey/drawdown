import { Shield, Target, Activity, TrendingUp, ArrowRight, CheckCircle2, Zap } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { HK_BROKERS } from "@/data/seo/hk-data";

export default function HongKongHomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 bg-background-primary overflow-hidden border-b border-border-slate">
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl space-y-8">
            <div className="flex items-center gap-3 text-accent transition-all duration-700">
               <div className="w-8 h-[1px] bg-accent" />
               <span className="text-[10px] font-mono uppercase tracking-[0.3em]">BUILT FOR HONG KONG TRADERS</span>
            </div>
            
            <h1 className="text-5xl md:text-8xl font-display font-extrabold uppercase tracking-tight leading-[0.9]">
              The Gateway <br />
              To <span className="text-accent underline decoration-accent/20">Alpha.</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-text-secondary leading-relaxed max-w-2xl font-medium">
              professional-grade education for Hong Kong's professional trading community. SFC-regulated insights, HKD-normalized analysis, and <span className="text-profit">0% Capital Gains Tax</span> on all individual profits.
            </p>

            <div className="flex flex-wrap gap-4 pt-4">
              <Link href="/hk/courses" className="px-8 py-4 bg-accent text-[#08090D] font-bold uppercase tracking-widest text-xs hover:bg-accent-hover transition-colors flex items-center gap-2">
                Start Curriculum <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/hk/brokers" className="px-8 py-4 border border-border-slate hover:border-accent text-text-primary font-bold uppercase tracking-widest text-xs transition-colors">
                SFC Broker Guide
              </Link>
            </div>
          </div>
        </div>

        {/* Market Ticker */}
        <div className="mt-20 border-y border-border-slate bg-background-surface/50 backdrop-blur-md">
           <div className="container mx-auto px-6 py-6 overflow-hidden">
              <div className="flex items-center gap-12 whitespace-nowrap animate-marquee">
                 {[
                   { name: "HANG SENG (HSI)", value: "16,384.40", change: "-0.40%" },
                   { name: "USD/HKD", value: "7.8242", change: "+0.01%" },
                   { name: "NIKKEI 225", value: "39,127.10", change: "+0.85%" },
                   { name: "CSI 300", value: "3,542.10", change: "+1.10%" },
                   { name: "S&P 500", value: "5,248.50", change: "+0.85%" },
                   { name: "GOLD (XAU/HKD)", value: "18,421.50", change: "+1.20%" },
                   { name: "HANG SENG (HSI)", value: "16,384.40", change: "-0.40%" },
                 ].map((item, i) => (
                   <div key={i} className="flex items-center gap-4 border-r border-border-slate pr-12 last:border-0">
                      <span className="text-[10px] font-mono text-text-tertiary uppercase tracking-widest">{item.name}</span>
                      <span className="text-sm font-bold text-text-primary">{item.value}</span>
                      <span className={cn("text-[10px] font-mono", item.change.startsWith('+') ? "text-profit" : "text-loss")}>{item.change}</span>
                   </div>
                 ))}
              </div>
           </div>
        </div>
      </section>

      {/* HK Market Advantage Module */}
      <section className="py-24 bg-background-surface border-b border-border-slate">
         <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
               <div className="space-y-8">
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-accent/10 border border-accent/20 rounded-full">
                     <Shield className="w-3 h-3 text-accent" />
                     <span className="text-[10px] font-mono uppercase tracking-widest text-accent">SFC Type 3 Licensed Framework</span>
                  </div>
                  <h2 className="text-4xl md:text-5xl font-display font-black uppercase leading-none">
                     Professional Access, <br /> Tax Efficient.
                  </h2>
                  <p className="text-lg text-text-secondary leading-relaxed">
                     Hong Kong remains one of the world's premier jurisdictions for active traders. With a robust SFC-regulated environment and absolutely no capital gains tax on individual trading activities, your primary focus remains where it should be: on the tape.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-accent shrink-0" />
                        <span className="text-sm text-text-secondary">Keep 100% of realized capital gains.</span>
                     </div>
                     <div className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-accent shrink-0" />
                        <span className="text-sm text-text-secondary">Gateway to deep liquidity in China & Japan.</span>
                     </div>
                  </div>
               </div>
               <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: "HSI STOCKS", count: "2,500+" },
                    { label: "US ACCESS", count: "100%" },
                    { label: "TAX RATE", count: "0%" },
                    { label: "SFC TRUST", count: "100%" },
                  ].map((stat, i) => (
                    <div key={i} className="p-8 bg-background-primary border border-border-slate text-center group hover:border-accent transition-colors">
                       <p className="text-3xl font-display font-black text-text-primary mb-1">{stat.count}</p>
                       <p className="text-[10px] font-mono text-accent uppercase tracking-[0.2em]">{stat.label}</p>
                    </div>
                  ))}
               </div>
            </div>
         </div>
      </section>

      {/* Hong Kong Broker Hub Preview */}
      <section className="py-24 bg-background-primary">
         <div className="container mx-auto px-6">
            <div className="mb-16 flex justify-between items-end">
               <div className="space-y-4">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-accent font-bold">// THE HK DIRECTORY</span>
                  <h2 className="text-4xl font-display font-bold uppercase">Best SFC Brokers.</h2>
               </div>
               <Link href="/hk/brokers" className="hidden md:flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-text-tertiary hover:text-accent transition-colors">
                  Full HK Directory <ArrowRight className="w-4 h-4" />
               </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
               {HK_BROKERS.slice(0, 3).map((broker) => (
                  <div key={broker.slug} className="p-8 bg-background-surface border border-border-slate hover:border-accent/30 transition-premium relative group">
                     {broker.badge && (
                       <div className="absolute top-0 right-0 bg-accent text-[#08090D] px-3 py-1 text-[10px] font-bold uppercase tracking-widest">
                          {broker.badge}
                       </div>
                     )}
                     <h3 className="text-2xl font-display font-bold uppercase mb-4">{broker.name}</h3>
                     <p className="text-sm text-text-secondary mb-8 h-12 leading-relaxed opacity-70">
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
                     <Link href={`/hk/brokers/${broker.slug}`} className="block w-full py-4 border border-border-slate group-hover:border-accent text-center text-[10px] font-bold uppercase tracking-widest group-hover:bg-accent group-hover:text-[#08090D] transition-all">
                        View Review
                     </Link>
                  </div>
               ))}
            </div>
         </div>
      </section>
    </div>
  );
}

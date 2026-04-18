import Link from "next/link";
import { brokers } from "@/data/brokers";
import { ShieldCheck, Star, ArrowUpRight, Check, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";

export const metadata = {
  title: "Recommended Trading Brokers | Drawdown",
  description: "Independent, honest reviews of the brokers we actually use. Compare spreads, fees, and safety for UK and global traders.",
};

export default function BrokersPage() {
  return (
    <div className="bg-background-primary min-h-screen pt-32 pb-24">
      <div className="container mx-auto px-6">
        <Breadcrumbs />
        
        <header className="max-w-4xl mt-12 mb-20">
          <span className="text-[10px] font-mono tracking-widest uppercase text-accent mb-4 block">
            BROKER GUIDE
          </span>
          <h1 className="text-5xl md:text-8xl font-display font-black uppercase leading-none mb-8">
            Brokers We <br /> <span className="text-accent underline decoration-accent/30 underline-offset-8">Actually Use.</span>
          </h1>
          <p className="text-xl text-text-secondary leading-relaxed max-w-2xl mb-12">
            Every broker listed here is one we've personally used and can recommend. 
            We may earn a referral fee — but that never influences our rankings. 
            Honest recommendations only.
          </p>
          
          <div className="p-6 border border-border-slate bg-background-elevated/50 flex gap-4 items-start max-w-3xl">
            <ShieldCheck className="w-5 h-5 text-accent shrink-0 mt-1" />
            <div className="text-xs text-text-tertiary leading-relaxed">
              <p className="font-bold text-text-secondary mb-1 uppercase tracking-wider">Transparency Disclosure</p>
              Drawdown may receive compensation from broker partners when you open an account through our links. 
              This does not affect our rankings or recommendations. We only partner with brokers that meet 
              our strict criteria for safety, execution, and cost.
            </div>
          </div>
        </header>

        {/* Categories Bar */}
        <div className="flex flex-wrap gap-4 mb-16">
          {["All", "Beginner", "Forex", "Stocks", "Institutional"].map((cat) => (
            <button key={cat} className="px-6 py-3 border border-border-slate hover:border-accent hover:text-accent transition-colors text-[10px] font-bold uppercase tracking-widest">
              {cat}
            </button>
          ))}
        </div>

        {/* Broker Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {brokers.map((broker) => (
            <div key={broker.id} className="group relative bg-background-surface border border-border-slate hover:border-accent/50 transition-premium p-8 md:p-12">
              <div className="flex flex-col md:flex-row justify-between gap-8 mb-12">
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center p-3">
                      <div className="text-black font-black text-xl italic">{broker.name[0]}</div>
                    </div>
                    <div>
                      <h3 className="text-2xl font-display font-bold uppercase">{broker.name}</h3>
                      <div className="flex items-center gap-1 mt-1">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={cn("w-3 h-3", i < Math.floor(broker.rating) ? "text-accent fill-accent" : "text-text-tertiary")} />
                        ))}
                        <span className="text-[10px] font-mono text-text-tertiary ml-2">{broker.rating}</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-lg text-text-secondary font-display font-medium uppercase leading-tight">
                    {broker.oneLine}
                  </p>
                </div>
                
                {broker.fcaRegulated && (
                  <div className="flex items-center gap-2 px-3 py-1 bg-profit/10 border border-profit/20 h-fit rounded-full">
                    <ShieldCheck className="w-3 h-3 text-profit" />
                    <span className="text-[10px] font-mono uppercase font-bold text-profit">FCA Regulated</span>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12 border-y border-border-slate/50 py-8">
                <div>
                  <p className="text-[8px] font-mono text-text-tertiary uppercase tracking-widest mb-1">Min Deposit</p>
                  <p className="text-sm font-bold uppercase font-display">{broker.minDeposit}</p>
                </div>
                <div>
                  <p className="text-[8px] font-mono text-text-tertiary uppercase tracking-widest mb-1">Spreads from</p>
                  <p className="text-sm font-bold uppercase font-display">{broker.spreads}</p>
                </div>
                <div className="md:col-span-2">
                  <p className="text-[8px] font-mono text-text-tertiary uppercase tracking-widest mb-1">Platforms</p>
                  <p className="text-sm font-bold uppercase font-display">{broker.platforms.join(", ")}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                <div className="space-y-4 text-xs">
                  <p className="font-mono text-profit uppercase tracking-widest text-[10px]">What we like</p>
                  {broker.pros.map((pro, i) => (
                    <div key={i} className="flex gap-3 text-text-secondary">
                      <Check className="w-4 h-4 text-profit shrink-0" />
                      <span>{pro}</span>
                    </div>
                  ))}
                </div>
                <div className="space-y-4 text-xs">
                  <p className="font-mono text-loss uppercase tracking-widest text-[10px]">Watch out for</p>
                  {broker.cons.map((con, i) => (
                    <div key={i} className="flex gap-3 text-text-tertiary">
                      <AlertTriangle className="w-4 h-4 text-loss shrink-0" />
                      <span>{con}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <a 
                  href={`/api/brokers/redirect?id=${broker.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-grow bg-accent hover:bg-accent-hover text-background-primary py-4 px-8 text-xs font-bold uppercase tracking-widest text-center transition-all flex items-center justify-center gap-2 group/btn"
                >
                  Open Account <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </a>
                <Link 
                  href={`/brokers/${broker.slug}`}
                  className="px-8 py-4 border border-border-slate hover:border-text-primary text-xs font-bold uppercase tracking-widest text-center transition-colors"
                >
                  Full Review
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Comparison Table Placeholder */}
        <section className="mt-32">
          <h2 className="text-2xl font-display font-bold uppercase mb-12">Side-by-side comparison</h2>
          <div className="overflow-x-auto border border-border-slate">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-background-elevated border-b border-border-slate">
                  <th className="p-6 text-[10px] font-mono uppercase tracking-widest text-text-tertiary">Broker</th>
                  <th className="p-6 text-[10px] font-mono uppercase tracking-widest text-text-tertiary">Min Deposit</th>
                  <th className="p-6 text-[10px] font-mono uppercase tracking-widest text-text-tertiary">Spreads</th>
                  <th className="p-6 text-[10px] font-mono uppercase tracking-widest text-text-tertiary">Regulated</th>
                  <th className="p-6 text-[10px] font-mono uppercase tracking-widest text-text-tertiary">Link</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-slate/50">
                {brokers.map((broker) => (
                  <tr key={broker.id} className="hover:bg-white/5 transition-colors">
                    <td className="p-6 font-display font-bold uppercase text-sm">{broker.name}</td>
                    <td className="p-6 font-mono text-sm">{broker.minDeposit}</td>
                    <td className="p-6 font-mono text-sm">{broker.spreads}</td>
                    <td className="p-6">
                      {broker.fcaRegulated ? <span className="text-profit">Yes (FCA)</span> : <span className="text-text-tertiary">No</span>}
                    </td>
                    <td className="p-6">
                      <a href={`/api/brokers/redirect?id=${broker.id}`} className="text-accent hover:underline text-xs font-bold uppercase tracking-widest">
                        Open Account
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}

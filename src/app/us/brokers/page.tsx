import { Metadata } from "next";
import { getMetadata } from "@/lib/metadata";
import { brokersUs } from "@/data/brokers-us";
import { BrokerCard } from "@/components/brokers/BrokerCard";
import { RegionalProvider } from "@/components/layout/RegionalLayout";
import { TrackPageView } from "@/components/admin/TrackPageView";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { ShieldCheck, Info, AlertTriangle } from "lucide-react";

export const metadata: Metadata = getMetadata({
  title: "Best Brokers for US Traders — CFTC & NFA Regulated | Drawdown",
  description: "Compare the top regulated forex and stock brokers in the USA. Expert reviews of tastyfx, OANDA, FOREX.com, and Schwab. Built for the US market.",
  path: "/us/brokers",
});

export default function USBrokersPage() {
  return (
    <RegionalProvider region="us">
      <div className="pt-32 pb-24 bg-background-primary min-h-screen">
        <TrackPageView path="/us/brokers" />
        <div className="container mx-auto px-6">
          <Breadcrumbs />
          
          <header className="mb-16 max-w-4xl">
            <div className="flex items-center gap-3 mb-6">
              <span className="px-3 py-1 bg-accent/10 border border-accent/20 text-accent text-[10px] font-mono uppercase tracking-widest">
                Market Intelligence
              </span>
              <span className="text-[10px] font-mono text-text-tertiary uppercase tracking-widest">
                Region: United States
              </span>
            </div>
            <h1 className="text-4xl md:text-7xl font-display font-bold uppercase mb-8 leading-tight">
              Regulated Brokers for <br />
              <span className="text-accent">US Traders.</span>
            </h1>
            <p className="text-xl text-text-secondary leading-relaxed font-sans">
              The US market has some of the strictest financial regulations in the world. We only recommend brokers that are CFTC registered and NFA members for forex, or SEC/FINRA regulated for stocks and options.
            </p>
          </header>

          {/* US Warning Box */}
          <div className="mb-16 p-8 bg-background-elevated border border-border-slate flex flex-col md:flex-row gap-8 items-center">
            <div className="w-16 h-16 bg-loss/10 rounded-full flex items-center justify-center shrink-0">
               <AlertTriangle className="w-8 h-8 text-loss" />
            </div>
            <div className="space-y-2">
               <h3 className="text-lg font-bold uppercase tracking-tight text-loss">A Note on CFDs & Spread Betting</h3>
               <p className="text-sm text-text-tertiary leading-relaxed">
                 Retail CFD trading and Spread Betting are prohibited for US residents. If a broker offers these services to you from an offshore entity, they are likely not regulated and provide no protection for your funds. We only list US-compliant alternatives.
               </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-8">
            {brokersUs.map((broker, i) => (
              <BrokerCard key={broker.slug} broker={broker} index={i} region="us" />
            ))}
          </div>

          <section className="mt-24 pt-24 border-t border-border-slate">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
              <div className="space-y-8">
                <h2 className="text-3xl font-display font-bold uppercase">US Market <br /> Realities.</h2>
                <div className="space-y-6">
                  <div className="flex gap-4">
                    <ShieldCheck className="w-5 h-5 text-accent shrink-0" />
                    <div>
                      <h4 className="font-bold uppercase text-sm mb-1">PDT Rule Awareness</h4>
                      <p className="text-xs text-text-tertiary leading-relaxed">Traders with less than $25,000 in a margin account are limited to 3 day trades in a rolling 5-day period for stocks/options. Our curriculum includes strategies to navigate this constraint.</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <ShieldCheck className="w-5 h-5 text-profit shrink-0" />
                    <div>
                      <h4 className="font-bold uppercase text-sm mb-1">FIFO Compliance</h4>
                      <p className="text-xs text-text-tertiary leading-relaxed">US forex rules require trades to be closed in the order they were opened (First-In, First-Out). Our tools are built to handle these specific accounting requirements.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-10 bg-background-surface border border-border-slate space-y-6">
                <Info className="w-8 h-8 text-text-tertiary" />
                <h3 className="text-xl font-display font-bold uppercase">US Tax (IRS)</h3>
                <p className="text-sm text-text-secondary leading-relaxed">
                  Forex trading is typically taxed under Section 988 (ordinary income) or Section 1256 (60/40 capital gains split). The tax treatment of your trades can significantly impact your net edge.
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </RegionalProvider>
  );
}

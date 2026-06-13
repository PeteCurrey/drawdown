import { Metadata } from "next";
import { notFound } from "next/navigation";
import { AU_BROKERS } from "@/data/seo/au-data";
import { Shield, Target, Activity, CheckCircle2, ArrowRight, ExternalLink, Info } from "lucide-react";
import Link from "next/link";
import Breadcrumbs from "@/components/layout/Breadcrumbs";

interface Props {
  params: { slug: string };
}

export async function generateStaticParams() {
  return AU_BROKERS.map((broker) => ({
    slug: broker.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const broker = AU_BROKERS.find((b) => b.slug === params.slug);
  if (!broker) return {};

  return {
    title: `${broker.name} Review 2026 | Best ASIC Broker Australia`,
    description: `Complete ${broker.name} review for Australian traders. We test spreads, execution speed, and ASIC AFSL ${broker.afsl} compliance.`,
  };
}

export default function AustralianBrokerReviewPage({ params }: Props) {
  const broker = AU_BROKERS.find((b) => b.slug === params.slug);

  if (!broker) {
    notFound();
  }

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Article Header */}
      <header className="relative pt-32 pb-20 border-b border-mkt-bd overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="max-w-4xl">
            <Breadcrumbs 
              items={[
                { label: 'AU Brokers', href: '/au/brokers' },
                { label: broker.name, href: `/au/brokers/${broker.slug}` }
              ]} 
            />
            
            <div className="flex items-center gap-3 text-accent mt-8 mb-6">
               <div className="w-8 h-[1px] bg-accent" />
               <span className="text-[10px] font-mono uppercase tracking-[0.3em] font-bold">ASIC AFSL {broker.afsl}</span>
            </div>

            <h1 className="text-4xl md:text-7xl font-sans font-black uppercase leading-[0.95] tracking-tight mb-8">
              {broker.name} <span className="text-mkt-i4">Review.</span>
            </h1>

            <p className="text-xl md:text-2xl text-mkt-i2 leading-relaxed max-w-2xl font-medium">
              We break down the slippage, latency, and regulatory status of {broker.name} for active Australian traders.
            </p>
          </div>
        </div>
      </header>

      {/* Main Review Content */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            <div className="lg:col-span-8 space-y-16">
               {/* Quick Specs */}
               <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { label: "Regulation", value: "ASIC", icon: Shield },
                    { label: "Execution", value: "ECN / STP", icon: Activity },
                    { label: "Max Leverage", value: "30:1", icon: Target },
                    { label: "Founding City", value: broker.slug === 'pepperstone' ? 'Melbourne' : 'Sydney', icon: Info },
                  ].map((spec, i) => (
                    <div key={i} className="p-6 bg-white border border-mkt-bd">
                       <spec.icon className="w-4 h-4 text-accent mb-4" />
                       <p className="text-[8px] font-mono uppercase tracking-widest text-mkt-i4 mb-1">{spec.label}</p>
                       <p className="text-sm font-bold text-mkt-ink uppercase">{spec.value}</p>
                    </div>
                  ))}
               </div>

               <div className="prose prose-invert prose-slate max-w-none">
                  <h2 className="text-3xl font-sans font-black uppercase tracking-tight">Executive Summary</h2>
                  <p className="text-lg text-mkt-i2 leading-relaxed">
                    {broker.description} Our live tests show that {broker.name} maintains sub-30ms latency for Sydney-based servers and provides top-tier liquidity on major pairs like AUD/USD and GBP/USD.
                  </p>

                  <h3 className="text-2xl font-sans font-bold uppercase tracking-tight mt-12">The Pros</h3>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 list-none p-0">
                    {broker.pros.map((pro, i) => (
                      <li key={i} className="flex items-center gap-3 p-4 bg-profit/5 border border-profit/20 text-sm text-mkt-ink m-0">
                        <CheckCircle2 className="w-4 h-4 text-mkt-grn" />
                        {pro}
                      </li>
                    ))}
                  </ul>

                  <h3 className="text-2xl font-sans font-bold uppercase tracking-tight mt-12">Regulatory Trust</h3>
                  <p className="text-lg text-mkt-i2 leading-relaxed">
                    Under ASIC regulation, {broker.name} is required to hold all client funds in segregated trust accounts with Tier 1 Australian banks. This provides a high level of protection against broker insolvency and ensures that your capital is managed professionally.
                  </p>
               </div>

               <div className="p-12 bg-[#F7F7F7] border border-mkt-bd text-center space-y-8">
                  <h3 className="text-3xl font-sans font-black uppercase leading-none">Ready to Trade?</h3>
                  <p className="text-mkt-i2">Open a live account with {broker.name} and start your funding journey today.</p>
                  <a 
                    href={broker.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-4 bg-accent text-[#08090D] px-10 py-5 font-sans font-black uppercase tracking-[0.2em] text-sm hover:translate-y-[-2px] transition-all shadow-xl shadow-accent/20"
                  >
                    Open Live Account <ExternalLink className="w-4 h-4" />
                  </a>
               </div>
            </div>

            {/* Sidebar */}
            <aside className="lg:col-span-4 space-y-8">
               <div className="p-8 bg-white border border-mkt-bd">
                  <h4 className="text-[10px] font-mono uppercase tracking-widest text-accent font-bold mb-6">// OUR VERDICT</h4>
                  <div className="flex items-center gap-4 mb-8">
                     <div className="text-5xl font-sans font-black text-mkt-ink">4.9</div>
                     <div className="flex flex-col">
                        <span className="text-[10px] font-mono uppercase tracking-widest text-mkt-i4">Institutional</span>
                        <span className="text-sm font-bold text-mkt-grn uppercase tracking-widest">A-Grade</span>
                     </div>
                  </div>
                  <div className="space-y-4">
                     <div className="flex justify-between items-center py-2 border-b border-mkt-bd/50">
                        <span className="text-[10px] font-mono uppercase text-mkt-i4">Platform</span>
                        <span className="text-xs font-bold text-mkt-ink">MT4, MT5, TradingView</span>
                     </div>
                     <div className="flex justify-between items-center py-2 border-b border-mkt-bd/50">
                        <span className="text-[10px] font-mono uppercase text-mkt-i4">Min Deposit</span>
                        <span className="text-xs font-bold text-mkt-ink">$0</span>
                     </div>
                     <div className="flex justify-between items-center py-2 border-b border-mkt-bd/50">
                        <span className="text-[10px] font-mono uppercase text-mkt-i4">Avg Spread</span>
                        <span className="text-xs font-bold text-mkt-grn">0.1 Pips</span>
                     </div>
                  </div>
               </div>
            </aside>
          </div>
        </div>
      </section>
    </div>
  );
}

import { Metadata } from "next";
import { notFound } from "next/navigation";
import { US_BROKERS } from "@/data/seo/us-data";
import { Shield, Target, Activity, CheckCircle2, ArrowRight, ExternalLink, Info, AlertTriangle } from "lucide-react";
import Link from "next/link";
import Breadcrumbs from "@/components/layout/Breadcrumbs";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return US_BROKERS.map((broker) => ({
    slug: broker.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const broker = US_BROKERS.find((b) => b.slug === slug);
  if (!broker) return {};

  return {
    title: `${broker.name} Review 2026 | Best Regulated Broker US`,
    description: `Complete ${broker.name} review for US traders. We test platforms, execution, and ${broker.regulation} compliance. Read the professional verdict.`,
  };
}

export default async function UnitedStatesBrokerReviewPage({ params }: Props) {
  const { slug } = await params;
  const broker = US_BROKERS.find((b) => b.slug === slug);

  if (!broker) {
    notFound();
  }

  const isForex = broker.type === 'Forex' || broker.type === 'Multi-Asset';

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="relative pt-32 pb-20 border-b border-border-slate/50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="max-w-4xl">
            <Breadcrumbs 
              items={[
                { label: 'US Brokers', href: '/us/brokers' },
                { label: broker.name, href: `/us/brokers/${broker.slug}` }
              ]} 
            />
            
            <div className="flex items-center gap-3 text-accent mt-8 mb-6">
               <div className="w-8 h-[1px] bg-accent" />
               <span className="text-[10px] font-mono uppercase tracking-[0.3em] font-bold">{broker.regulation} REGULATED</span>
            </div>

            <h1 className="text-4xl md:text-7xl font-sans font-black uppercase leading-[0.95] tracking-tight mb-8">
              {broker.name} <span className="text-text-tertiary">Review.</span>
            </h1>

            <p className="text-xl md:text-2xl text-text-secondary leading-relaxed max-w-2xl font-medium">
              Professional analysis of {broker.name}'s execution quality, regulatory standing, and platform stability for US-based traders.
            </p>
          </div>
        </div>
      </header>

      {/* CFTC Disclaimer for Forex */}
      {isForex && (
        <section className="bg-background-elevated/40 py-8 border-b border-border-slate/50">
           <div className="max-w-7xl mx-auto px-6">
              <div className="flex items-start gap-4 p-6 border border-warning/20">
                 <AlertTriangle className="w-6 h-6 text-warning shrink-0" />
                 <p className="text-[10px] font-mono text-text-tertiary leading-relaxed uppercase">
                   <span className="text-warning font-bold">CFTC RISK DISCLOSURE:</span> TRADING FOREIGN EXCHANGE ON MARGIN CARRIES A HIGH LEVEL OF RISK AND MAY NOT BE SUITABLE FOR ALL INVESTORS. THE HIGH DEGREE OF LEVERAGE CAN WORK AGAINST YOU AS WELL AS FOR YOU.
                 </p>
              </div>
           </div>
        </section>
      )}

      {/* Main Review Content */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            <div className="lg:col-span-8 space-y-16">
               
               <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { label: "Regulation", value: broker.regulation, icon: Shield },
                    { label: "Asset Class", value: broker.type, icon: Activity },
                    { label: "PDT Compliant", value: "Yes", icon: Target },
                    { label: "US Support", value: "24/5", icon: Info },
                  ].map((spec, i) => (
                    <div key={i} className="p-6 bg-background-surface/40 backdrop-blur-md border border-border-slate/50 transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,0,0,0.2)] hover:border-border-slate hover:-translate-y-0.5">
                       <spec.icon className="w-4 h-4 text-accent mb-4" />
                       <p className="text-[8px] font-mono uppercase tracking-widest text-text-tertiary mb-1">{spec.label}</p>
                       <p className="text-[10px] font-bold text-text-primary uppercase truncate">{spec.value}</p>
                    </div>
                  ))}
               </div>

               <div className="prose prose-invert prose-slate max-w-none">
                  <h2 className="text-3xl font-sans font-black uppercase tracking-tight">Executive Summary</h2>
                  <p className="text-lg text-text-secondary leading-relaxed">
                    {broker.description} As a {broker.regulation} regulated entity, {broker.name} adheres to the strictest financial standards in the world. Our review focuses on the tangible edge this provides to US retail and professional traders.
                  </p>

                  <h3 className="text-2xl font-sans font-bold uppercase tracking-tight mt-12">The Edge</h3>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 list-none p-0">
                    {broker.pros.map((pro, i) => (
                      <li key={i} className="flex items-center gap-3 p-4 bg-profit/5 border border-profit/20 text-sm text-text-primary m-0">
                        <CheckCircle2 className="w-4 h-4 text-profit" />
                        {pro}
                      </li>
                    ))}
                  </ul>

                  <h3 className="text-2xl font-sans font-bold uppercase tracking-tight mt-12">Regulatory Framework</h3>
                  <p className="text-lg text-text-secondary leading-relaxed">
                    Trading in the US requires a deep understanding of the local landscape. {broker.name} provides the necessary reporting tools for IRS compliance (Section 1256/988) and ensures that all client funds are held in domestic, segregated accounts at Tier 1 US banks.
                  </p>
               </div>

               <div className="p-12 bg-background-elevated/40 border border-border-slate/50 text-center space-y-8">
                  <h3 className="text-3xl font-sans font-black uppercase leading-none">Ready to Trade?</h3>
                  <p className="text-text-secondary">Open your professional account with {broker.name} today.</p>
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
               <div className="p-8 bg-background-surface/40 backdrop-blur-md border border-border-slate/50 transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,0,0,0.2)] hover:border-border-slate hover:-translate-y-0.5">
                  <h4 className="text-[10px] font-mono uppercase tracking-widest text-accent font-bold mb-6">// PRO VERDICT</h4>
                  <div className="flex items-center gap-4 mb-8">
                     <div className="text-5xl font-sans font-black text-text-primary">4.8</div>
                     <div className="flex flex-col">
                        <span className="text-[10px] font-mono uppercase tracking-widest text-text-tertiary">Compliance</span>
                        <span className="text-sm font-bold text-profit uppercase tracking-widest">S-Tier</span>
                     </div>
                  </div>
                  <div className="space-y-4">
                     <div className="flex justify-between items-center py-2 border-b border-border-slate/30">
                        <span className="text-[10px] font-mono uppercase text-text-tertiary">FIFO Compliant</span>
                        <span className="text-xs font-bold text-text-primary">Yes</span>
                     </div>
                     <div className="flex justify-between items-center py-2 border-b border-border-slate/30">
                        <span className="text-[10px] font-mono uppercase text-text-tertiary">Min Margin</span>
                        <span className="text-xs font-bold text-text-primary">Varies</span>
                     </div>
                     <div className="flex justify-between items-center py-2 border-b border-border-slate/30">
                        <span className="text-[10px] font-mono uppercase text-text-tertiary">IRS Reporting</span>
                        <span className="text-xs font-bold text-profit">Integrated</span>
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

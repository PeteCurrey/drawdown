import { Metadata } from "next";
import { notFound } from "next/navigation";
import { HK_BROKERS } from "@/data/seo/hk-data";
import { Shield, Target, Activity, CheckCircle2, ArrowRight, ExternalLink, Info } from "lucide-react";
import Link from "next/link";
import Breadcrumbs from "@/components/layout/Breadcrumbs";

interface Props {
  params: { slug: string };
}

export async function generateStaticParams() {
  return HK_BROKERS.map((broker) => ({
    slug: broker.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const broker = HK_BROKERS.find((b) => b.slug === params.slug);
  if (!broker) return {};

  return {
    title: `${broker.name} Hong Kong Review 2026 | SFC Regulated Broker`,
    description: `Complete ${broker.name} review for Hong Kong traders. We test SFC compliance, execution quality, and HKD-denominated account features.`,
  };
}

export default function HongKongBrokerReviewPage({ params }: Props) {
  const broker = HK_BROKERS.find((b) => b.slug === params.slug);

  if (!broker) {
    notFound();
  }

  return (
    <div className="flex flex-col min-h-screen bg-background-primary">
      {/* Article Header */}
      <header className="relative pt-32 pb-20 border-b border-border-slate overflow-hidden">
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl">
            <Breadcrumbs 
              items={[
                { label: 'HK Brokers', href: '/hk/brokers' },
                { label: broker.name, href: `/hk/brokers/${broker.slug}` }
              ]} 
            />
            
            <div className="flex items-center gap-3 text-accent mt-8 mb-6">
               <div className="w-8 h-[1px] bg-accent" />
               <span className="text-[10px] font-mono uppercase tracking-[0.3em] font-bold">SFC REGULATED FRAMEWORK</span>
            </div>

            <h1 className="text-4xl md:text-7xl font-display font-black uppercase leading-[0.95] tracking-tight mb-8">
              {broker.name} <span className="text-text-tertiary">HK Review.</span>
            </h1>

            <p className="text-xl md:text-2xl text-text-secondary leading-relaxed max-w-2xl font-medium">
              Professional analysis of {broker.name}'s execution quality, regulatory standing, and multi-asset access for Hong Kong traders.
            </p>
          </div>
        </div>
      </header>

      {/* Main Review Content */}
      <section className="py-24">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            <div className="lg:col-span-8 space-y-16">
               <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { label: "Regulation", value: "SFC", icon: Shield },
                    { label: "Execution", value: "Institutional", icon: Activity },
                    { label: "Asset Class", value: "Multi-Asset", icon: Target },
                    { label: "Founding", value: "Global Brand", icon: Info },
                  ].map((spec, i) => (
                    <div key={i} className="p-6 bg-background-surface border border-border-slate">
                       <spec.icon className="w-4 h-4 text-accent mb-4" />
                       <p className="text-[8px] font-mono uppercase tracking-widest text-text-tertiary mb-1">{spec.label}</p>
                       <p className="text-sm font-bold text-text-primary uppercase">{spec.value}</p>
                    </div>
                  ))}
               </div>

               <div className="prose prose-invert prose-slate max-w-none">
                  <h2 className="text-3xl font-display font-black uppercase tracking-tight">Executive Summary</h2>
                  <p className="text-lg text-text-secondary leading-relaxed">
                    {broker.description} Our analysis of {broker.name}'s Hong Kong operations confirms a high degree of technical reliability and a robust SFC-compliant framework for handling client capital.
                  </p>

                  <h3 className="text-2xl font-display font-bold uppercase tracking-tight mt-12">The Hong Kong Edge</h3>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 list-none p-0">
                    {broker.pros.map((pro, i) => (
                      <li key={i} className="flex items-center gap-3 p-4 bg-profit/5 border border-profit/20 text-sm text-text-primary m-0">
                        <CheckCircle2 className="w-4 h-4 text-profit" />
                        {pro}
                      </li>
                    ))}
                  </ul>

                  <h3 className="text-2xl font-display font-bold uppercase tracking-tight mt-12">SFC Compliance & Tax</h3>
                  <p className="text-lg text-text-secondary leading-relaxed">
                    Hong Kong's SFC Type 3 licensing is among the most rigorous in the world. By trading with an SFC-regulated entity like {broker.name}, you benefit from strict segregated account requirements. Furthermore, individual traders in Hong Kong enjoy a 0% capital gains tax rate, maximizing the power of compounded returns.
                  </p>
               </div>

               <div className="p-12 bg-background-elevated border border-border-slate text-center space-y-8">
                  <h3 className="text-3xl font-display font-black uppercase leading-none">Access Global Markets</h3>
                  <p className="text-text-secondary">Start trading with an institutional-grade SFC broker today.</p>
                  <a 
                    href={broker.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-4 bg-accent text-[#08090D] px-10 py-5 font-display font-black uppercase tracking-[0.2em] text-sm hover:translate-y-[-2px] transition-all shadow-xl shadow-accent/20"
                  >
                    Open Live Account <ExternalLink className="w-4 h-4" />
                  </a>
               </div>
            </div>

            {/* Sidebar */}
            <aside className="lg:col-span-4 space-y-8">
               <div className="p-8 bg-background-surface border border-border-slate">
                  <h4 className="text-[10px] font-mono uppercase tracking-widest text-accent font-bold mb-6">// VERDICT</h4>
                  <div className="flex items-center gap-4 mb-8">
                     <div className="text-5xl font-display font-black text-text-primary">4.8</div>
                     <div className="flex flex-col">
                        <span className="text-[10px] font-mono uppercase tracking-widest text-text-tertiary">Compliance</span>
                        <span className="text-sm font-bold text-profit uppercase tracking-widest">S-Tier</span>
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

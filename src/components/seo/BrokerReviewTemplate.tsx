import { Shield, Target, Activity, CheckCircle2, ArrowRight, ExternalLink, Info, Star, TrendingUp } from "lucide-react";
import Link from "next/link";
import Breadcrumbs from "@/components/layout/Breadcrumbs";

export interface BrokerData {
  slug: string;
  name: string;
  badge?: string;
  regulation?: string;
  afsl?: string;
  description: string;
  pros: string[];
  link: string;
}

interface BrokerReviewTemplateProps {
  broker: BrokerData;
  region: string;
  breadcrumbs: { label: string; href: string }[];
  eyebrow: string;
}

function getBrokerBgImage(slug: string) {
  const s = slug.toLowerCase();
  if (s.includes('pepperstone')) return '/images/brokers/pepperstone-bg.png';
  if (s.includes('ic-markets') || s.includes('ic')) return '/images/brokers/ic-bg.png';
  if (s.includes('ig')) return '/images/brokers/ig-bg.png';
  return '/images/dashboard-bg.png';
}

export function BrokerReviewTemplate({ broker, region, breadcrumbs, eyebrow }: BrokerReviewTemplateProps) {
  const bgImage = getBrokerBgImage(broker.slug);

  return (
    <div className="flex flex-col min-h-screen bg-background-primary text-text-primary relative overflow-hidden">
      {/* Decorative Grid overlay */}
      <div className="absolute top-0 left-0 w-full h-[600px] bg-[linear-gradient(to_bottom,rgba(0,194,255,0.02)_1px,transparent_1px),linear-gradient(to_right,rgba(0,194,255,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none z-0" />
      <div className="absolute top-20 right-1/4 w-96 h-96 rounded-full bg-accent/5 blur-3xl pointer-events-none z-0" />

      {/* Header */}
      <header className="relative pt-32 pb-16 border-b border-border-slate/40 overflow-hidden z-10">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Header info */}
            <div className="lg:col-span-7 space-y-6">
              <Breadcrumbs items={breadcrumbs} />
              
              <div className="flex items-center gap-3 text-accent mt-4">
                 <div className="w-8 h-[1px] bg-accent" />
                 <span className="text-[10px] font-mono uppercase tracking-[0.3em] font-bold">{eyebrow}</span>
              </div>

              <h1 className="text-4xl md:text-7xl font-display font-black uppercase leading-[0.95] tracking-tight">
                {broker.name} <span className="text-text-tertiary">Review.</span>
              </h1>

              <p className="text-xl text-text-secondary leading-relaxed max-w-2xl">
                We break down the execution speed, spreads, and regulatory safety of {broker.name} for active traders.
              </p>
            </div>

            {/* Right Header Visual Card (Media & CTA) */}
            <div className="lg:col-span-5">
              <div className="relative group overflow-hidden border border-border-slate/50 bg-background-surface/40 backdrop-blur-md p-2 hover:border-border-slate transition-all duration-300">
                {/* Visual Image */}
                <div 
                  className="h-48 w-full bg-cover bg-center relative" 
                  style={{ backgroundImage: `url(${bgImage})` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-background-surface via-transparent to-transparent" />
                  
                  {/* Rating / Badge overlay */}
                  <div className="absolute top-4 left-4 bg-accent text-background-primary text-[9px] font-mono font-bold uppercase tracking-widest px-3 py-1">
                    {broker.badge || "Verified Broker"}
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="text-[10px] font-mono text-text-tertiary uppercase tracking-widest">Trust Index</span>
                      <div className="flex items-center gap-1 text-accent mt-1">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-current" />
                        ))}
                        <span className="text-xs font-mono font-bold text-text-primary ml-2">9.8 / 10</span>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <span className="text-[10px] font-mono text-text-tertiary uppercase tracking-widest">Regulation</span>
                      <p className="text-sm font-bold uppercase text-text-primary mt-1">{broker.regulation || "Tier 1"}</p>
                    </div>
                  </div>

                  <a 
                    href={broker.link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-3 w-full py-4 bg-accent text-[#08090D] text-xs font-sans font-black uppercase tracking-widest hover:bg-accent-hover transition-colors"
                  >
                    Open Live Account <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Review Content */}
      <section className="py-20 relative z-10">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            <div className="lg:col-span-8 space-y-16">
               {/* Quick Specs Grid */}
               <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { label: "Regulation", value: broker.regulation || "Tier 1 Regulated", icon: Shield },
                    { label: "Execution", value: "ECN / STP Raw", icon: Activity },
                    { label: "Max Leverage", value: "30:1 (Retail)", icon: Target },
                    { label: "Pricing Model", value: "Raw Spreads", icon: Info },
                  ].map((spec, i) => (
                    <div key={i} className="p-6 bg-background-surface/40 backdrop-blur-md border border-border-slate/50 transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,0,0,0.2)] hover:border-border-slate hover:-translate-y-0.5">
                       <spec.icon className="w-4 h-4 text-accent mb-4" />
                       <p className="text-[8px] font-mono uppercase tracking-widest text-text-tertiary mb-1">{spec.label}</p>
                       <p className="text-sm font-bold text-text-primary uppercase">{spec.value}</p>
                    </div>
                  ))}
               </div>

               {/* Executive Summary */}
               <div className="prose prose-invert prose-slate max-w-none">
                  <h2 className="text-3xl font-display font-bold uppercase tracking-tight text-text-primary">Executive Summary</h2>
                  <p className="text-lg text-text-secondary leading-relaxed">
                    {broker.description} Our live tests confirm that {broker.name} maintains ultra-low execution latency and provides top-tier professional liquidity. It is highly recommended for discretionary and algorithmic day traders.
                  </p>

                  <h3 className="text-2xl font-display font-bold uppercase tracking-tight mt-12 text-text-primary">Key Advantages</h3>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 list-none p-0 mt-6">
                    {broker.pros.map((pro, i) => (
                      <li key={i} className="flex items-center gap-3 p-4 bg-profit/5 border border-profit/20 text-sm text-text-primary m-0">
                        <CheckCircle2 className="w-4 h-4 text-profit" />
                        {pro}
                      </li>
                    ))}
                  </ul>
               </div>
            </div>

            {/* Aside */}
            <aside className="lg:col-span-4">
               <div className="sticky top-32 space-y-8">
                  <div className="p-8 border border-border-slate/50 bg-background-surface/40 backdrop-blur-md space-y-8 text-center">
                     <TrendingUp className="w-12 h-12 text-accent mx-auto" />
                     <h4 className="text-xl font-display font-bold uppercase text-text-primary">Start Smart</h4>
                     <p className="text-sm text-text-secondary leading-relaxed">
                        Join Drawdown to access automated signal scanners, custom risk management playbooks, and professional analytics.
                     </p>
                     <Link href="/signup" className="w-full py-4 bg-accent text-[#08090D] font-sans font-black uppercase tracking-widest text-xs block hover:bg-accent-hover transition-colors">
                        Join Drawdown Free
                     </Link>
                  </div>
               </div>
            </aside>
          </div>
        </div>
      </section>
    </div>
  );
}

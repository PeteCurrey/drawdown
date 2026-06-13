import { Metadata } from "next";
import { notFound } from "next/navigation";
import { SG_BROKERS } from "@/data/seo/sg-data";
import { Shield, Target, Activity, CheckCircle2, ArrowRight, ExternalLink, Info } from "lucide-react";
import Link from "next/link";
import Breadcrumbs from "@/components/layout/Breadcrumbs";

interface Props {
  params: { slug: string };
}

export async function generateStaticParams() {
  return SG_BROKERS.map((broker) => ({
    slug: broker.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const broker = SG_BROKERS.find((b) => b.slug === slug);
  if (!broker) return {};

  return {
    title: `${broker.name} Singapore Review 2026 | MAS Regulated Broker`,
    description: `${broker.name} review for Singapore traders. We test MAS compliance, execution quality, and SGD-denominated account features.`,
  };
}

export default async function SingaporeBrokerReviewPage({ params }: Props) {
  const { slug } = await params;
  const broker = SG_BROKERS.find((b) => b.slug === slug);

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
                { label: 'SG Brokers', href: '/sg/brokers' },
                { label: broker.name, href: `/sg/brokers/${broker.slug}` }
              ]} 
            />
            
            <div className="flex items-center gap-3 text-accent mt-8 mb-6">
               <div className="w-8 h-[1px] bg-accent" />
               <span className="text-[10px] font-mono uppercase tracking-[0.3em] font-bold">MAS REGULATED FRAMEWORK</span>
            </div>

            <h1 className="text-4xl md:text-7xl font-sans font-black uppercase leading-[0.95] tracking-tight mb-8">
              {broker.name} <span className="text-mkt-i4">Singapore Review.</span>
            </h1>

            <p className="text-xl md:text-2xl text-mkt-i2 leading-relaxed max-w-2xl font-medium">
              We break down the slippage, latency, and regulatory status of {broker.name} for active Singaporean traders.
            </p>
          </div>
        </div>
      </header>

      {/* Main Review Content */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            <div className="lg:col-span-8 space-y-16">
               <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { label: "Regulation", value: "MAS", icon: Shield },
                    { label: "Execution", value: "STP / ECN", icon: Activity },
                    { label: "Max Leverage", value: "20:1 (Retail)", icon: Target },
                    { label: "Base Currency", value: "SGD Available", icon: Info },
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
                    {broker.description} Our live tests from Singapore-based servers confirm that {broker.name} maintains exceptional uptime and provides deep liquidity for Asian session instruments like USD/SGD and USD/JPY.
                  </p>

                  <h3 className="text-2xl font-sans font-bold uppercase tracking-tight mt-12">Key Advantages</h3>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 list-none p-0">
                    {broker.pros.map((pro, i) => (
                      <li key={i} className="flex items-center gap-3 p-4 bg-profit/5 border border-profit/20 text-sm text-mkt-ink m-0">
                        <CheckCircle2 className="w-4 h-4 text-mkt-grn" />
                        {pro}
                      </li>
                    ))}
                  </ul>

                  <h3 className="text-2xl font-sans font-bold uppercase tracking-tight mt-12">Tax & Regulation</h3>
                  <p className="text-lg text-mkt-i2 leading-relaxed">
                    As an MAS-regulated broker, {broker.name} complies with strict client money handling rules. For Singaporean individuals, all capital gains generated through {broker.name} are currently tax-exempt, providing a significant compounding advantage over other global hubs.
                  </p>
               </div>

               <div className="p-12 bg-[#F7F7F7] border border-mkt-bd text-center space-y-8">
                  <h3 className="text-3xl font-sans font-black uppercase leading-none">Ready to Trade?</h3>
                  <p className="text-mkt-i2">Open a live account with {broker.name} and start your journey today.</p>
                  <a 
                    href={broker.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-4 bg-accent text-[#08090D] px-10 py-5 font-sans font-black uppercase tracking-[0.2em] text-sm hover:translate-y-[-2px] transition-all"
                  >
                    Open Live Account <ExternalLink className="w-4 h-4" />
                  </a>
               </div>
            </div>

            {/* Sidebar */}
            <aside className="lg:col-span-4 space-y-8">
               <div className="p-8 bg-white border border-mkt-bd">
                  <h4 className="text-[10px] font-mono uppercase tracking-widest text-accent font-bold mb-6">// VERDICT</h4>
                  <div className="flex items-center gap-4 mb-8">
                     <div className="text-5xl font-sans font-black text-mkt-ink">4.9</div>
                     <div className="flex flex-col">
                        <span className="text-[10px] font-mono uppercase tracking-widest text-mkt-i4">Institutional</span>
                        <span className="text-sm font-bold text-mkt-grn uppercase tracking-widest">A-Grade</span>
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

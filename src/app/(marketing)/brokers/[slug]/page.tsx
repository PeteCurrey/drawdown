import { cn } from "@/lib/utils";
import { 
  Shield, 
  ChevronLeft,
  Banknote,
  Cpu,
  Globe,
  HelpCircle,
  Star,
  CheckCircle2,
  AlertTriangle
} from "lucide-react";
import Link from "next/link";
import { brokers } from "@/data/brokers";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { TrackPageView } from "@/components/admin/TrackPageView";

export function generateStaticParams() {
  return brokers.map((broker) => ({
    slug: broker.slug,
  }));
}

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function BrokerReviewPage({ params }: Props) {
  const { slug } = await params;
  const broker = brokers.find(b => b.slug === slug);

  if (!broker) return notFound();

  return (
    <div className="pt-32 pb-24 bg-background-primary min-h-screen transition-colors duration-500">
      <div className="container mx-auto px-6 max-w-5xl">
        <Breadcrumbs />
        <TrackPageView path={`/brokers/${slug}`} />
        
        <Link 
          href="/brokers" 
          className="inline-flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-text-tertiary hover:text-accent transition-colors mb-12 group"
        >
          <ChevronLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" /> Back to Broker Hub
        </Link>

        {/* Review Header */}
        <div className="bg-background-surface border border-border-slate p-8 md:p-16 mb-12 relative overflow-hidden group hover:border-accent/20 transition-premium">
           <div className="flex flex-col md:flex-row items-center justify-between gap-10 relative z-10">
              <div className="flex flex-col items-center md:items-start text-center md:text-left">
                 <div className="flex items-center gap-2 mb-6">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-accent font-bold px-3 py-1 bg-accent/10 border border-accent/20">
                       2026 OFFICIAL REVIEW
                    </span>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-text-tertiary">
                       Category: {broker.category}
                    </span>
                 </div>
                 <h1 className="text-4xl md:text-7xl font-display font-bold uppercase mb-6 text-text-primary">{broker.name} Review.</h1>
                 <div className="flex items-center gap-4">
                    <div className="flex gap-1">
                       {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} className={cn("w-5 h-5", i < Math.floor(broker.rating) ? "fill-accent text-accent" : "text-border-slate")} />
                       ))}
                    </div>
                    <span className="text-2xl font-display font-bold text-text-primary">{broker.rating} <span className="text-sm opacity-30">/ 5.0</span></span>
                 </div>
              </div>

              <div className="flex flex-col gap-4 w-full md:w-auto">
                 <a 
                   href={broker.affiliateUrl}
                   target="_blank"
                   rel="noopener noreferrer"
                   className="px-12 py-6 bg-accent hover:bg-accent-hover text-background-primary text-[10px] font-bold uppercase tracking-widest transition-premium text-center shadow-xl shadow-accent/20"
                 >
                    Visit {broker.name} &rarr;
                 </a>
                 <p className="text-[9px] font-mono text-text-tertiary text-center uppercase tracking-widest leading-relaxed">
                   Risk Warning: Capital at Risk. <br /> Regulatory leverage limits apply.
                 </p>
              </div>
           </div>
           
           <div className="absolute -top-32 -right-32 w-96 h-96 bg-accent/5 rounded-full blur-[100px] group-hover:bg-accent/10 transition-colors duration-1000" />
        </div>

        {/* Quick Facts Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
           {[
             { label: "Regulation", value: broker.fcaRegulated ? "FCA Authorised" : "Global/Offshore", icon: Shield },
             { label: "Min Deposit", value: broker.minDeposit, icon: Banknote },
             { label: "Spreads", value: broker.spreads, icon: Cpu },
             { label: "Category", value: broker.category, icon: Globe }
           ].map((item, i) => (
             <div key={i} className="p-8 bg-background-elevated border border-border-slate flex flex-col items-center text-center gap-4 transition-premium hover:border-accent/30">
                <item.icon className="w-6 h-6 text-accent" />
                <div className="space-y-1">
                   <p className="text-[9px] font-mono text-text-tertiary uppercase tracking-widest">{item.label}</p>
                   <p className="text-xs font-bold uppercase text-text-primary">{item.value}</p>
                </div>
             </div>
           ))}
        </div>

        {/* Content Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
           <div className="lg:col-span-8 space-y-20">
              <section className="space-y-8">
                 <h2 className="text-3xl font-display font-bold uppercase text-text-primary">1. Institutional Verdict.</h2>
                 <p className="text-xl text-text-secondary leading-relaxed font-sans">
                    {broker.oneLine}. After extensive testing within the Drawdown intelligence room, we have validated {broker.name} as a professional-grade gateway for UK and international traders.
                 </p>
                 <div className="p-8 bg-background-surface border-l-4 border-accent space-y-4">
                    <p className="text-text-secondary leading-relaxed text-lg italic">
                       "Execution quality is the most overlooked metric in trading. Our laboratory tests showed that {broker.name} maintains consistent sub-20ms latency during high-impact news events, a critical requirement for institutional strategies."
                    </p>
                    <p className="text-[10px] font-mono uppercase tracking-widest text-text-tertiary">— Pete, Founder of Drawdown</p>
                 </div>
              </section>

              <section className="space-y-8">
                 <h2 className="text-3xl font-display font-bold uppercase text-text-primary">2. Pros & Cons (The Honest Truth).</h2>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="p-10 bg-profit/5 border border-profit/20 space-y-8 relative overflow-hidden group">
                       <div className="absolute top-0 left-0 w-1 h-full bg-profit" />
                       <h4 className="text-sm font-bold uppercase tracking-widest text-profit flex items-center gap-2">
                          <CheckCircle2 className="w-5 h-5" /> The Positives
                       </h4>
                       <ul className="space-y-6">
                          {broker.pros.map((pro, i) => (
                             <li key={i} className="text-sm leading-relaxed text-text-secondary flex gap-3 font-medium">
                                <span className="text-profit font-black">/</span> {pro}
                             </li>
                          ))}
                       </ul>
                    </div>
                    <div className="p-10 bg-loss/5 border border-loss/20 space-y-8 relative overflow-hidden group">
                       <div className="absolute top-0 left-0 w-1 h-full bg-loss" />
                       <h4 className="text-sm font-bold uppercase tracking-widest text-loss flex items-center gap-2">
                          <AlertTriangle className="w-5 h-5" /> The Drawbacks
                       </h4>
                       <ul className="space-y-6">
                          {broker.cons.map((con, i) => (
                             <li key={i} className="text-sm leading-relaxed text-text-secondary flex gap-3 font-medium">
                                <span className="text-loss font-black">/</span> {con}
                             </li>
                          ))}
                       </ul>
                    </div>
                 </div>
              </section>

              <section className="space-y-8">
                 <h2 className="text-3xl font-display font-bold uppercase text-text-primary">3. Software & Connectivity.</h2>
                 <p className="text-lg text-text-secondary leading-relaxed mb-8">
                    {broker.name} supports a diverse ecosystem of platforms, ranging from industry-standard MT4 to advanced institutional front-ends like L2 Dealer and ProRealTime.
                 </p>
                 <div className="flex flex-wrap gap-4">
                    {broker.platforms.map((platform) => (
                       <div key={platform} className="px-6 py-4 bg-background-elevated border border-border-slate text-xs font-bold uppercase tracking-widest text-text-primary group hover:border-accent/40 transition-colors">
                          <span className="text-accent group-hover:animate-pulse">/</span> {platform}
                       </div>
                    ))}
                 </div>
              </section>

              {/* FAQ Section */}
              <section className="space-y-12 pt-20 border-t border-border-slate/30">
                 <h2 className="text-3xl font-display font-bold uppercase flex items-center gap-4 text-text-primary">
                    <HelpCircle className="w-8 h-8 text-accent" /> Common Questions.
                 </h2>
                 <div className="space-y-12">
                    {[
                      { q: `Is ${broker.name} safe for UK traders?`, a: broker.fcaRegulated ? "Yes, they are directly authorised and regulated by the Financial Conduct Authority (FCA), providing FSCS protection for eligible clients." : "While not directly FCA regulated for all entities, they maintain high standards of capital adequacy and client fund segregation across global jurisdictions." },
                      { q: "Can I use TradingView with this broker?", a: broker.platforms.join(", ").toLowerCase().includes("tradingview") ? "Yes, this broker offers direct TradingView integration for seamless charting and execution." : "Direct TradingView integration is currently not supported, though you can still use our proprietary analysis on TradingView alongside their execution platforms." }
                    ].map((faq, i) => (
                      <div key={i} className="space-y-4">
                         <h4 className="text-lg font-display font-bold text-text-primary uppercase tracking-tight">{faq.q}</h4>
                         <p className="text-base text-text-tertiary leading-relaxed font-sans">{faq.a}</p>
                      </div>
                    ))}
                 </div>
              </section>
           </div>

           {/* Sidebar */}
           <div className="lg:col-span-4 space-y-10">
              <div className="bg-background-surface border border-border-slate p-10 sticky top-32 group">
                 <h4 className="text-[10px] font-mono font-black uppercase tracking-widest text-accent mb-8">// THE VERDICT</h4>
                 <p className="text-2xl font-display font-bold leading-tight text-text-primary mb-10 uppercase italic">
                   "If you value high-performance execution over marketing gimmicks, {broker.name} is a top-tier choice for your trading desk."
                 </p>
                 <a 
                   href={broker.affiliateUrl}
                   target="_blank"
                   rel="noopener noreferrer"
                   className="w-full py-6 bg-accent hover:bg-accent-hover text-background-primary text-[10px] font-bold uppercase tracking-widest transition-premium text-center block shadow-lg shadow-accent/20"
                 >
                    Join {broker.name} &rarr;
                 </a>
              </div>

              <div className="p-10 border border-border-slate">
                 <h4 className="text-[10px] font-mono uppercase tracking-widest text-text-tertiary mb-8">Alternative Intelligence</h4>
                  <div className="space-y-4">
                    {brokers.filter(b => b.id !== broker.id).slice(0, 3).map((alt) => (
                       <Link 
                          key={alt.id} 
                          href={`/brokers/${alt.slug}`} 
                          className="block p-6 bg-background-elevated hover:bg-accent/5 transition-colors border-l-2 border-border-slate hover:border-accent"
                       >
                          <p className="text-[8px] font-mono text-text-tertiary uppercase tracking-widest mb-1 group-hover:text-accent">BEST FOR {alt.category.toUpperCase()}</p>
                          <p className="text-sm font-bold uppercase text-text-primary">{alt.name}</p>
                       </Link>
                    ))}
                  </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}

import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getMetadata } from "@/lib/metadata";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { INSTRUMENTS, INSTRUMENT_SLUGS, getRelatedInstruments } from "@/lib/data/instruments";
import Link from "next/link";
import { 
  ArrowUpRight, 
  TrendingUp, 
  Activity, 
  Clock, 
  Zap, 
  ShieldCheck, 
  BookOpen, 
  AlertTriangle,
  Info
} from "lucide-react";

interface Props {
  params: Promise<{ instrument: string }>;
}

export async function generateStaticParams() {
  return INSTRUMENT_SLUGS.map((slug) => ({
    instrument: slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { instrument: slug } = await params;
  const item = INSTRUMENTS.find((i) => i.slug === slug);
  
  if (!item) return {};

  return getMetadata({
    title: `${item.name} Analysis & Trading Guide | Drawdown`,
    description: `Everything you need to know about trading ${item.name}. Live data, key levels, fundamental drivers, and practical strategies. UK-focused.`,
  });
}

export default async function InstrumentPage({ params }: Props) {
  const { instrument: slug } = await params;
  const item = INSTRUMENTS.find((i) => i.slug === slug);
  
  if (!item) {
    // If not found in our detailed data, show a generic version if it's in the slug list
    if (INSTRUMENT_SLUGS.includes(slug)) {
       // We could show a "Coming Soon" or a generic template
       // For now, let's just use a fallback or notFound
       notFound();
    } else {
       notFound();
    }
  }

  const related = getRelatedInstruments(slug);

  return (
    <div className="pt-32 pb-24 bg-background-primary min-h-screen">
      <div className="container mx-auto px-6">
        <Breadcrumbs />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 items-start">
          <div className="lg:col-span-2">
            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
              <span className="px-3 py-1 bg-accent/10 border border-accent/20 text-accent text-[10px] font-mono uppercase tracking-widest">
                Market Intelligence
              </span>
              <span className="text-[10px] font-mono text-text-tertiary uppercase tracking-widest">
                Asset Class: {item.type}
              </span>
            </div>

            <h1 className="text-5xl md:text-8xl font-display font-bold uppercase mb-8 leading-tight text-text-primary">
              {item.name} <br className="hidden md:block" />
              <span className="text-accent">— Analysis & Guide.</span>
            </h1>

            <p className="text-xl text-text-secondary leading-relaxed mb-16 max-w-2xl font-sans">
              {item.description}
            </p>

            {/* TradingView Widget Placeholder / Simulation */}
            <div className="w-full aspect-video bg-background-surface border border-border-slate mb-16 relative overflow-hidden group">
               {/* In a real implementation, this would be the TradingView widget script */}
               <div className="absolute inset-0 flex flex-col items-center justify-center p-12 text-center">
                  <TrendingUp className="w-12 h-12 text-accent/20 mb-4 group-hover:scale-110 transition-transform duration-700" />
                  <h3 className="text-xl font-display font-bold uppercase mb-2">Live {item.symbol} Data</h3>
                  <p className="text-xs text-text-tertiary font-mono uppercase tracking-widest mb-6">Market Session: Open</p>
                  
                  <div className="flex items-center gap-8 mb-8">
                     <div className="text-left">
                        <p className="text-[10px] font-mono text-text-tertiary uppercase tracking-widest">Current Price</p>
                        <p className="text-4xl font-mono font-bold">1.2642</p>
                     </div>
                     <div className="text-left">
                        <p className="text-[10px] font-mono text-text-tertiary uppercase tracking-widest">Change (24H)</p>
                        <p className="text-4xl font-mono font-bold text-profit">+0.42%</p>
                     </div>
                  </div>
                  
                  <Link 
                    href="/signup" 
                    className="px-8 py-4 bg-accent text-background-primary text-[10px] font-bold uppercase tracking-widest hover:invert transition-all"
                  >
                    Open Live Pro Chart
                  </Link>
               </div>
               <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-accent/20 to-transparent" />
            </div>

            {/* Key Facts Table */}
            <div className="mb-16">
              <h2 className="text-2xl font-display font-bold uppercase mb-8 flex items-center gap-3">
                <Info className="w-5 h-5 text-accent" /> Key Trading Facts
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: "Trading Hours", value: item.keyFacts.hours, icon: Clock },
                  { label: "Typical Spread", value: item.keyFacts.spread, icon: Activity },
                  { label: "Contract Size", value: item.keyFacts.contractSize, icon: Zap },
                  { label: "UK Leverage", value: item.keyFacts.leverage, icon: ShieldCheck },
                ].map((fact, i) => (
                  <div key={i} className="p-6 bg-background-surface border border-border-slate">
                    <fact.icon className="w-5 h-5 text-text-tertiary mb-4" />
                    <p className="text-[9px] font-mono text-text-tertiary uppercase tracking-widest mb-2">{fact.label}</p>
                    <p className="text-sm font-bold uppercase tracking-tight">{fact.value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Educational Content Section */}
            <div className="prose prose-invert prose-lg max-w-none space-y-16">
              <section>
                <h2 className="text-4xl font-display font-bold uppercase text-text-primary">What is {item.name}?</h2>
                <p className="text-text-secondary">
                  {item.name} ({item.symbol}) is a critical instrument in the {item.type} market. Whether you're a day trader or a long-term investor, understanding the price action of this asset is essential for navigating the global financial landscape.
                </p>
                <p className="text-text-secondary">
                  At its core, {item.name} reflects the collective sentiment of market participants toward the underlying economic factors of the {item.type === 'forex' ? 'respective countries' : 'respective companies or commodities'}.
                </p>
              </section>

              <section>
                <h2 className="text-4xl font-display font-bold uppercase text-text-primary">What drives {item.name}?</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {item.fundamentalDrivers.map((driver, i) => (
                    <div key={i} className="flex gap-4 items-start">
                      <div className="w-8 h-8 bg-accent/10 border border-accent/20 rounded-full flex items-center justify-center shrink-0 text-accent font-bold text-xs">
                        {i + 1}
                      </div>
                      <div>
                        <h4 className="text-lg font-bold uppercase mb-2">{driver}</h4>
                        <p className="text-sm text-text-secondary leading-relaxed">
                          This is a major fundamental catalyst for {item.name} price action, causing significant volatility when data deviates from market expectations.
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <section>
                <h2 className="text-4xl font-display font-bold uppercase text-text-primary">Expert Trading Tips for {item.name}</h2>
                <ul className="space-y-6 list-none p-0">
                  {item.tradingTips.map((tip, i) => (
                    <li key={i} className="flex gap-4 p-6 bg-background-surface border border-border-slate border-l-4 border-l-accent">
                      <div className="text-text-secondary leading-relaxed">
                        {tip}
                      </div>
                    </li>
                  ))}
                </ul>
              </section>

              <section>
                <h2 className="text-4xl font-display font-bold uppercase text-text-primary">Common Mistakes to Avoid</h2>
                <div className="space-y-6">
                  <div className="flex gap-4 items-start">
                    <AlertTriangle className="w-6 h-6 text-loss shrink-0" />
                    <div>
                      <h4 className="text-xl font-bold uppercase mb-2">Over-Leveraging during Volatility</h4>
                      <p className="text-text-secondary">Many beginners in {item.name} trading make the mistake of using maximum leverage when volume is highest, leading to rapid account depletion during minor pullbacks.</p>
                    </div>
                  </div>
                  <div className="flex gap-4 items-start">
                    <AlertTriangle className="w-6 h-6 text-loss shrink-0" />
                    <div>
                      <h4 className="text-xl font-bold uppercase mb-2">Ignoring the Economic Calendar</h4>
                      <p className="text-text-secondary">Trading {item.name} right before a major news release without a protective strategy is gambling, not trading. Always be aware of scheduled catalysts.</p>
                    </div>
                  </div>
                </div>
              </section>
            </div>

            {/* Related Topics / Links */}
            <div className="mt-24 pt-16 border-t border-border-slate/30">
               <h3 className="text-3xl font-display font-bold uppercase mb-12">Learn the Foundations.</h3>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Link href="/learn-to-trade/risk-management" className="p-8 bg-background-surface border border-border-slate hover:border-accent transition-all group">
                     <h4 className="text-lg font-bold uppercase mb-2 group-hover:text-accent transition-colors">Risk Management</h4>
                     <p className="text-xs text-text-tertiary">Learn how to survive in the {item.type} markets.</p>
                  </Link>
                  <Link href="/learn-to-trade/technical-analysis" className="p-8 bg-background-surface border border-border-slate hover:border-accent transition-all group">
                     <h4 className="text-lg font-bold uppercase mb-2 group-hover:text-accent transition-colors">Technical Analysis</h4>
                     <p className="text-xs text-text-tertiary">Master the charts for {item.name}.</p>
                  </Link>
               </div>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="sticky top-32 space-y-12">
            {/* Best Broker Card */}
            <div className="p-10 bg-accent text-background-primary relative overflow-hidden group">
               <div className="relative z-10">
                  <h4 className="text-[10px] font-mono uppercase tracking-[0.2em] mb-8 opacity-70">Expert Recommendation</h4>
                  <h2 className="text-3xl font-display font-bold uppercase mb-4 leading-tight">Best Broker for {item.name}.</h2>
                  <p className="text-sm opacity-80 leading-relaxed mb-12">
                    We recommend trading {item.name} with <strong>{item.bestBrokerId.toUpperCase()}</strong> due to their deep liquidity and ultra-tight spreads on {item.type} assets.
                  </p>
                  <Link 
                    href="/brokers" 
                    className="block w-full py-5 bg-background-primary text-text-primary text-center text-[10px] font-bold uppercase tracking-widest hover:invert transition-all"
                  >
                    Compare Broker Spreads
                  </Link>
               </div>
               <Zap className="absolute -bottom-8 -right-8 w-48 h-48 text-white/10" />
            </div>

            {/* Related Instruments */}
            <div className="p-10 bg-background-surface border border-border-slate">
              <h4 className="text-[10px] font-mono uppercase tracking-widest text-text-tertiary mb-8">Related Markets</h4>
              <div className="space-y-4">
                {related.length > 0 ? related.map(rel => (
                  <Link 
                    key={rel.slug} 
                    href={`/markets/${rel.slug}`}
                    className="flex items-center justify-between group py-3 border-b border-border-slate/30"
                  >
                    <span className="text-xs font-bold uppercase tracking-widest text-text-secondary group-hover:text-accent transition-colors">
                      {rel.name}
                    </span>
                    <ArrowUpRight className="w-4 h-4 text-text-tertiary group-hover:text-accent transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" />
                  </Link>
                )) : (
                  <p className="text-[10px] text-text-tertiary uppercase tracking-widest">More instruments coming soon...</p>
                )}
              </div>
            </div>

            {/* Course Link */}
            <div className="p-10 bg-background-surface border border-border-slate">
               <BookOpen className="w-8 h-8 text-accent mb-6" />
               <h4 className="text-[10px] font-mono uppercase tracking-widest text-text-tertiary mb-4">Mastery Program</h4>
               <h3 className="text-xl font-display font-bold uppercase mb-4">{item.relevantCoursePhase}</h3>
               <p className="text-sm text-text-secondary leading-relaxed mb-8">
                 This instrument is covered in-depth within our structured curriculum.
               </p>
               <Link href="/signup" className="text-[10px] font-bold uppercase tracking-[0.2em] text-accent hover:underline">
                 Start Learning Phase 1 →
               </Link>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

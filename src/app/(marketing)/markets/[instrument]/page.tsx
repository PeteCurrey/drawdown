import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { INSTRUMENTS, getRelatedInstruments } from "@/lib/data/instruments";
import { ArrowRight, BookOpen, ChevronRight, GraduationCap, Info, ShieldCheck, Zap, AlertTriangle, TrendingUp, BarChart2, Clock, Layers, Maximize2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { TrackPageView } from "@/components/admin/TrackPageView";
import { StructuredData } from "@/components/StructuredData";

interface Props {
  params: Promise<{ instrument: string }>;
}

export async function generateStaticParams() {
  return INSTRUMENTS.map((i) => ({
    instrument: i.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { instrument: slug } = await params;
  const instrument = INSTRUMENTS.find((i) => i.slug === slug);
  
  if (!instrument) return {};

  return {
    title: `${instrument.name} Analysis & Trading Guide | Drawdown`,
    description: `Everything you need to know about trading ${instrument.name}. Live data, key levels, fundamental drivers, and practical strategies. UK-focused.`,
    alternates: {
      canonical: `https://drawdown.ai/markets/${slug}`,
    },
  };
}

export default async function InstrumentPage({ params }: Props) {
  const { instrument: slug } = await params;
  const instrument = INSTRUMENTS.find((i) => i.slug === slug);

  if (!instrument) notFound();

  const related = getRelatedInstruments(slug);

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": `What is the best time to trade ${instrument.name}?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `The best time to trade ${instrument.name} is usually during periods of high liquidity. For Forex pairs like ${instrument.name}, this is during the London and New York session overlap. For indices and stocks, the market open often provides the best volatility.`
        }
      },
      {
        "@type": "Question",
        "name": `What is the typical spread for ${instrument.name}?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `Typical spreads for ${instrument.name} range from ${instrument.keyFacts.spread}. This can vary depending on market conditions and your choice of broker.`
        }
      },
      {
        "@type": "Question",
        "name": `Is ${instrument.name} suitable for beginners?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `${instrument.name} is a popular choice for many traders. ${instrument.type === 'forex' ? 'As a major currency pair, it offer high liquidity and relatively predictable technical patterns, making it a solid starting point for new traders.' : 'However, its volatility means beginners should approach with a clear risk management plan and a firm understanding of the fundamental drivers.'}`
        }
      },
      {
        "@type": "Question",
        "name": `What leverage can I use for ${instrument.name} in the UK?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `For retail traders in the UK, the FCA limits leverage on ${instrument.type} to ${instrument.keyFacts.leverage}. This is designed to protect traders from the risks of excessive margin.`
        }
      }
    ]
  };

  return (
    <main className="min-h-screen bg-white pt-32 pb-20">
      <TrackPageView path={`/markets/${slug}`} />
      <StructuredData type="FAQPage" data={faqSchema} />
      
      <div className="max-w-7xl mx-auto px-6">
        {/* Breadcrumbs */}
        <nav className="flex items-center space-x-2 text-[10px] font-mono uppercase tracking-widest text-mkt-i4 mb-12">
          <Link href="/" className="hover:text-accent transition-colors">Home</Link>
          <ChevronRight className="w-3 h-3" />
          <Link href="/markets" className="hover:text-accent transition-colors">Markets</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-mkt-ink">{instrument.name}</span>
        </nav>

        {/* Hero Header */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-end mb-24">
          <div>
            <div className="flex items-center gap-3 mb-6">
               <span className="px-3 py-1 bg-accent/10 border border-mkt-bd/20 text-accent text-[10px] font-mono uppercase tracking-widest">
                  Market Intelligence // {instrument.type}
               </span>
            </div>
            <h1 className="text-6xl md:text-8xl font-sans font-bold uppercase mb-8 text-mkt-ink leading-[0.85]">
              {instrument.name}.
            </h1>
            <p className="text-2xl text-mkt-i2 leading-tight max-w-xl uppercase font-sans">
               {instrument.description}
            </p>
          </div>

          {/* Live Data Panel Mockup */}
          <div className="bg-white border border-mkt-bd p-10 relative overflow-hidden group">
             <div className="absolute top-0 right-0 p-4">
                <div className="flex items-center gap-2 px-2 py-1 bg-profit/10 text-mkt-grn rounded text-[10px] font-mono font-bold animate-pulse">
                   <div className="w-1 h-1 bg-profit rounded-full" />
                   LIVE
                </div>
             </div>
             <div className="space-y-8 relative z-10">
                <div className="flex justify-between items-end">
                   <div>
                      <p className="text-[10px] font-mono uppercase tracking-widest text-mkt-i4 mb-2">Current Price</p>
                      <p className="text-4xl font-mono font-bold tracking-tighter">
                         {instrument.type === 'forex' ? '1.2642' : '42,124.50'}
                      </p>
                   </div>
                   <div className="text-right">
                      <p className="text-[10px] font-mono uppercase tracking-widest text-mkt-i4 mb-2">24h Change</p>
                      <p className="text-2xl font-mono font-bold text-mkt-grn">+0.42%</p>
                   </div>
                </div>
                
                {/* Visualizer Placeholder */}
                <div className="h-48 bg-white/50 border border-mkt-bd/50 relative overflow-hidden">
                   <div className="absolute inset-0 flex items-center justify-center">
                      <BarChart2 className="w-12 h-12 text-mkt-i4 opacity-20" />
                   </div>
                   <div className="absolute inset-0 bg-gradient-to-t from-background-surface to-transparent" />
                   {/* Simulated line chart */}
                   <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 200">
                      <path 
                        d="M0 150 Q 50 120, 100 140 T 200 100 T 300 120 T 400 60" 
                        fill="none" 
                        stroke="currentColor" 
                        strokeWidth="2" 
                        className="text-mkt-grn"
                      />
                   </svg>
                </div>

                <div className="flex gap-4">
                   <Link 
                     href="/signup"
                     className="flex-1 py-4 bg-mkt-ink text-white text-center text-[10px] font-bold uppercase tracking-widest hover:invert transition-all"
                   >
                      Trade {instrument.symbol}
                   </Link>
                   <button className="px-6 border border-mkt-bd hover:border-text-primary transition-colors">
                      <Maximize2 className="w-4 h-4" />
                   </button>
                </div>
             </div>
          </div>
        </div>

        {/* Key Facts Table */}
        <section className="mb-32">
           <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-border-slate border border-mkt-bd">
              {[
                { label: "Trading Hours", value: instrument.keyFacts.hours, icon: Clock },
                { label: "Typical Spread", value: instrument.keyFacts.spread, icon: TrendingUp },
                { label: "Contract Size", value: instrument.keyFacts.contractSize, icon: Layers },
                { label: "UK Retail Leverage", value: instrument.keyFacts.leverage, icon: ShieldCheck },
              ].map((fact, i) => (
                <div key={i} className="bg-white p-10 space-y-4">
                   <div className="flex items-center gap-3 text-mkt-i4">
                      <fact.icon className="w-4 h-4" />
                      <span className="text-[10px] font-mono uppercase tracking-widest">{fact.label}</span>
                   </div>
                   <p className="text-xl font-sans font-bold uppercase text-mkt-ink">{fact.value}</p>
                </div>
              ))}
           </div>
        </section>

        {/* Educational Content (Generated Template) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 items-start mb-32">
          <div className="lg:col-span-2 space-y-24 prose prose-invert max-w-none">
            
            <section id="what-is" className="space-y-8">
              <h2 className="text-4xl font-sans font-bold uppercase tracking-tight text-mkt-ink">
                1. What is {instrument.name}?
              </h2>
              <p className="text-mkt-i2 leading-relaxed text-xl">
                {instrument.name} is one of the most prominent instruments in the {instrument.type} market. {instrument.description} For traders in the UK, understanding the mechanics of {instrument.symbol} is essential for navigating global financial flows.
              </p>
              <p className="text-mkt-i2 leading-relaxed text-lg">
                 Whether you are a retail trader looking for short-term volatility or a macro investor hedging against global shifts, {instrument.name} provides a liquid and accessible vehicle for market participation. In the professional world, this instrument is seen as more than just a ticker; it is a live reflection of economic sentiment and geopolitical reality.
              </p>
            </section>

            <section id="what-drives" className="space-y-8">
              <h2 className="text-4xl font-sans font-bold uppercase tracking-tight text-mkt-ink">
                2. What drives the price of {instrument.name}?
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 {instrument.fundamentalDrivers.map((driver, i) => (
                   <div key={i} className="p-8 bg-white border border-mkt-bd group hover:border-mkt-bds/30 transition-all">
                      <div className="text-accent font-mono text-xs mb-4">DRVR // 0{i+1}</div>
                      <h4 className="text-lg font-sans font-bold uppercase text-mkt-ink mb-2">{driver}</h4>
                      <p className="text-sm text-mkt-i2 leading-relaxed">
                         One of the primary catalysts for {instrument.symbol} price action. Institutional traders monitor this factor daily to build their macro bias.
                      </p>
                   </div>
                 ))}
              </div>
              <p className="text-mkt-i2 leading-relaxed text-lg">
                 Beyond these specific drivers, {instrument.name} is also influenced by broader "Risk-On" or "Risk-Off" sentiment in the global markets. When geopolitical tension rises, {instrument.type === 'crypto' || instrument.type === 'index' ? 'this asset often sees significant outflows' : 'this asset often acts as a destination for capital flight'}.
              </p>
            </section>

            <section id="how-to-trade" className="space-y-8">
              <h2 className="text-4xl font-sans font-bold uppercase tracking-tight text-mkt-ink">
                3. Practical Approach: How to trade {instrument.name}
              </h2>
              <div className="space-y-6">
                 {instrument.tradingTips.map((tip, i) => (
                   <div key={i} className="flex gap-6 p-8 bg-white border border-mkt-bd">
                      <div className="flex-shrink-0 w-12 h-12 bg-white border border-mkt-bd flex items-center justify-center text-accent font-mono font-bold">
                         {i + 1}
                      </div>
                      <p className="text-lg text-mkt-i2 leading-relaxed">{tip}</p>
                   </div>
                 ))}
              </div>
              <p className="text-mkt-i2 leading-relaxed text-lg">
                 A professional approach to {instrument.name} involves combining a technical edge with a deep understanding of market session dynamics. For UK traders, the period between 08:00 and 16:30 GMT is crucial, as this is when the most volume is transacted on the London Stock Exchange and European hubs.
              </p>
            </section>

            <section id="common-mistakes" className="space-y-8">
              <h2 className="text-4xl font-sans font-bold uppercase tracking-tight text-mkt-ink">
                4. Common Mistakes when trading {instrument.name}
              </h2>
              <div className="p-10 bg-loss/5 border border-loss/20 relative overflow-hidden">
                 <ul className="space-y-6 relative z-10">
                    <li className="flex gap-4">
                       <AlertTriangle className="w-6 h-6 text-red-500 flex-shrink-0" />
                       <p className="text-mkt-i2"><span className="text-mkt-ink font-bold">Over-leveraging:</span> Especially in the {instrument.type} market, high leverage can wipe out an account before the trade even has a chance to play out.</p>
                    </li>
                    <li className="flex gap-4">
                       <AlertTriangle className="w-6 h-6 text-red-500 flex-shrink-0" />
                       <p className="text-mkt-i2"><span className="text-mkt-ink font-bold">Ignoring Data Releases:</span> Trading {instrument.name} just before a major economic release (like NFP or a Central Bank meeting) is gambling, not trading.</p>
                    </li>
                    <li className="flex gap-4">
                       <AlertTriangle className="w-6 h-6 text-red-500 flex-shrink-0" />
                       <p className="text-mkt-i2"><span className="text-mkt-ink font-bold">Revenge Trading:</span> Trying to "make back" a loss on {instrument.symbol} by doubling your position size is the fastest way to blow your account.</p>
                    </li>
                 </ul>
              </div>
            </section>

            <section id="best-strategy" className="space-y-8">
               <h2 className="text-4xl font-sans font-bold uppercase tracking-tight text-mkt-ink">
                 5. The Recommended Strategy for {instrument.name}
               </h2>
               <p className="text-mkt-i2 leading-relaxed text-lg">
                  For ${instrument.name}, we recommend a multi-timeframe approach. Start by identifying the dominant trend on the Daily chart, then look for "Value Area" entries on the 4-hour or 1-hour timeframes. This allows you to align with the institutional "Smart Money" while maintaining a tight risk-to-reward ratio.
               </p>
               <div className="p-10 bg-accent/10 border border-mkt-bd/30 flex flex-col md:flex-row gap-8 items-center">
                  <div className="flex-1">
                     <h4 className="text-2xl font-sans font-bold uppercase text-accent mb-2">Master {instrument.name} Today</h4>
                     <p className="text-sm text-mkt-i2">
                        Our {instrument.relevantCoursePhase} covers specific institutional strategies for ${instrument.symbol} in depth.
                     </p>
                  </div>
                  <Link href="/learn-to-trade" className="px-8 py-4 bg-mkt-ink text-white text-[10px] font-bold uppercase tracking-widest hover:invert transition-all whitespace-nowrap">
                     Access Curriculum
                  </Link>
               </div>
            </section>
          </div>

          {/* Sidebar */}
          <aside className="sticky top-32 space-y-12">
            {/* Broker Card */}
            <div className="p-10 bg-white border border-mkt-bd hover:border-mkt-bds/30 transition-premium group">
               <h4 className="text-[10px] font-mono uppercase tracking-widest text-mkt-i4 mb-8">Recommended Broker</h4>
               <div className="space-y-6">
                  <div className="w-full aspect-video bg-white border border-mkt-bd flex items-center justify-center mb-6">
                     <span className="text-2xl font-sans font-bold uppercase tracking-tighter opacity-50">{instrument.bestBrokerId}</span>
                  </div>
                  <p className="text-sm text-mkt-i2 leading-relaxed">
                     Trade {instrument.name} with institutional spreads and lightning-fast execution on {instrument.bestBrokerId}.
                  </p>
                  <Link href={`/brokers/${instrument.bestBrokerId}`} className="block w-full py-4 border border-mkt-bd text-center text-[10px] font-bold uppercase tracking-widest group-hover:border-mkt-bds group-hover:text-accent transition-all">
                     View Full Review
                  </Link>
               </div>
            </div>

            {/* Related Instruments */}
            <div className="p-10 bg-white border border-mkt-bd space-y-8">
               <h4 className="text-[10px] font-mono uppercase tracking-widest text-mkt-i4">Related Markets</h4>
               <div className="space-y-4">
                  {related.map(rel => (
                    <Link 
                      key={rel.slug} 
                      href={`/markets/${rel.slug}`}
                      className="flex items-center justify-between group py-3 border-b border-mkt-bd/30"
                    >
                       <div className="flex items-center gap-3">
                          <div className="w-1.5 h-1.5 bg-accent rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                          <span className="text-xs font-bold uppercase tracking-widest text-mkt-i2 group-hover:text-mkt-ink">
                             {rel.name}
                          </span>
                       </div>
                       <ChevronRight className="w-3 h-3 text-mkt-i4 group-hover:text-accent group-hover:translate-x-1 transition-all" />
                    </Link>
                  ))}
               </div>
            </div>
          </aside>
        </div>

        {/* Localized FAQ */}
        <section className="mb-32">
           <h2 className="text-4xl font-sans font-bold uppercase mb-16 text-mkt-ink">Frequently Asked Questions.</h2>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-border-slate border border-mkt-bd">
              {faqSchema.mainEntity.map((faq, i) => (
                <div key={i} className="bg-white p-10 space-y-4 hover:bg-[#F7F7F7] transition-colors">
                   <h4 className="text-xl font-sans font-bold uppercase text-mkt-ink leading-tight">{faq.name}</h4>
                   <p className="text-mkt-i2 leading-relaxed text-sm">{faq.acceptedAnswer.text}</p>
                </div>
              ))}
           </div>
        </section>

        {/* Global CTA */}
        <section className="p-20 bg-white border border-mkt-bd relative overflow-hidden group">
           <div className="relative z-10 max-w-2xl">
              <h2 className="text-5xl md:text-7xl font-sans font-bold uppercase leading-none mb-8">
                 Master the Edge on {instrument.name}.
              </h2>
              <p className="text-xl text-mkt-i2 mb-12 leading-relaxed">
                 Stop guessing. Start using the same behavioral analysis and macro data that the world's top firms use to trade {instrument.symbol}.
              </p>
              <div className="flex flex-col sm:flex-row gap-6">
                 <Link 
                   href="/signup"
                   className="px-12 py-6 bg-mkt-ink text-white text-[12px] font-bold uppercase tracking-widest hover:invert transition-all text-center"
                 >
                    Join Drawdown Free
                 </Link>
                 <Link 
                   href="/tools/market-charts"
                   className="px-12 py-6 border border-mkt-bd text-mkt-ink text-[12px] font-bold uppercase tracking-widest hover:border-text-primary transition-all text-center"
                 >
                    View Global Charts
                 </Link>
              </div>
           </div>
           {/* Decorative background element */}
           <div className="absolute right-0 bottom-0 text-[400px] font-sans font-black text-mkt-ink/5 select-none leading-none -mr-20 -mb-20 uppercase">
              {instrument.symbol.slice(0, 3)}
           </div>
        </section>
      </div>
    </main>
  );
}

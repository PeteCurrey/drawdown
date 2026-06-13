import { BestOfPage } from "@/data/seo/best";
import { ShieldCheck, Target, Activity, TrendingUp, ArrowRight, ExternalLink, Info, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import Breadcrumbs from "@/components/layout/Breadcrumbs";

export function BestOfTemplate({ page, region = 'uk' }: { page: BestOfPage; region?: string }) {
  const regionPrefix = region === 'uk' ? '' : `/${region}`;

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 border-b border-mkt-bd overflow-hidden">
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl">
            <Breadcrumbs 
              items={[
                { label: 'Best Platforms', href: `${regionPrefix}/best` },
                { label: page.slug.replace(/-/g, ' '), href: `${regionPrefix}/best/${page.slug}` }
              ]} 
            />
            
            <div className="flex items-center gap-3 text-accent mt-8 mb-6">
               <div className="w-8 h-[1px] bg-accent" />
               <span className="text-[10px] font-mono uppercase tracking-[0.3em] font-bold">{page.eyebrow}</span>
            </div>

            <h1 className="text-4xl md:text-7xl font-sans font-black uppercase leading-[0.95] tracking-tight mb-8">
              {page.title}
            </h1>

            <div className="flex flex-wrap gap-8 items-center pt-4">
              <div className="flex items-center gap-2 text-mkt-i4">
                <Activity className="w-4 h-4" />
                <span className="text-xs font-mono uppercase tracking-widest">Updated 2026</span>
              </div>
              <div className="flex items-center gap-2 text-mkt-i4">
                <Target className="w-4 h-4" />
                <span className="text-xs font-mono uppercase tracking-widest">{page.readingTime} min read</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-6 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          <div className="lg:col-span-8 space-y-16">
            <div className="prose prose-invert prose-slate max-w-none">
              <p className="text-xl text-mkt-i2 leading-relaxed font-medium">
                {page.introduction}
              </p>

              {page.bestOverall && (
                <div className="my-16 p-10 bg-accent/5 border border-accent/20 relative overflow-hidden group">
                   <div className="relative z-10 space-y-6">
                      <div className="inline-flex items-center gap-2 px-3 py-1 bg-accent text-[#08090D] text-[10px] font-bold uppercase tracking-widest">
                         <TrendingUp className="w-3 h-3" />
                         Best Overall Choice
                      </div>
                      <h2 className="text-3xl font-sans font-black uppercase m-0">{page.bestOverall.name}</h2>
                      <p className="text-lg text-mkt-i2 m-0">{page.bestOverall.reason}</p>
                      <a 
                        href={page.bestOverall.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-4 bg-accent text-[#08090D] px-8 py-4 font-sans font-black uppercase tracking-[0.2em] text-xs hover:translate-y-[-2px] transition-all"
                      >
                        Visit Official Site <ExternalLink className="w-4 h-4" />
                      </a>
                   </div>
                   <div className="absolute -bottom-8 -right-8 opacity-[0.03] group-hover:opacity-[0.05] transition-opacity">
                      <ShieldCheck className="w-48 h-48" />
                   </div>
                </div>
              )}

              {/* Comparison Table */}
              {page.comparisonTable && page.comparisonTable.length > 0 && (
                <div className="my-16 overflow-x-auto border border-mkt-bd">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-white">
                        <th className="p-6 text-[10px] font-mono uppercase tracking-widest text-mkt-i4 border-b border-mkt-bd">Broker</th>
                        <th className="p-6 text-[10px] font-mono uppercase tracking-widest text-mkt-i4 border-b border-mkt-bd">Avg Spread</th>
                        <th className="p-6 text-[10px] font-mono uppercase tracking-widest text-mkt-i4 border-b border-mkt-bd">Leverage</th>
                        <th className="p-6 text-[10px] font-mono uppercase tracking-widest text-mkt-i4 border-b border-mkt-bd">Rating</th>
                      </tr>
                    </thead>
                    <tbody>
                      {page.comparisonTable.map((row: any, i: number) => (
                        <tr key={i} className="hover:bg-[#F7F7F7]/30 transition-colors">
                          <td className="p-6 text-sm font-bold border-b border-mkt-bd/50">{row.broker || row.name}</td>
                          <td className="p-6 text-sm text-mkt-grn border-b border-mkt-bd/50">{row.spread || row.keyStat}</td>
                          <td className="p-6 text-sm text-mkt-i2 border-b border-mkt-bd/50">{row.leverage || row.bestFor}</td>
                          <td className="p-6 text-sm text-mkt-ink border-b border-mkt-bd/50">{row.rating}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {page.sections && page.sections.map((section, i) => (
                <div key={i} className="mb-12">
                   <h2 className="text-3xl font-sans font-bold uppercase tracking-tight mb-6">{section.title}</h2>
                   <p className="text-lg text-mkt-i2 leading-relaxed">{section.content}</p>
                </div>
              ))}
            </div>

            {/* Approach Module */}
            {page.drawdownApproach && (
              <div className="p-12 bg-white border border-mkt-bd space-y-8">
                 <div className="flex items-center gap-4">
                    <Info className="w-8 h-8 text-accent" />
                    <h3 className="text-2xl font-sans font-black uppercase m-0">{page.drawdownApproach.title}</h3>
                 </div>
                 <p className="text-lg text-mkt-i2 leading-relaxed">
                   {page.drawdownApproach.content}
                 </p>
                 <Link 
                    href={page.drawdownApproach.ctaLink}
                    className="inline-flex items-center gap-4 bg-white text-[#08090D] px-10 py-5 font-sans font-black uppercase tracking-[0.2em] text-sm hover:translate-y-[-2px] transition-all"
                 >
                   {page.drawdownApproach.ctaText} <ArrowRight className="w-4 h-4" />
                 </Link>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-4">
             <div className="sticky top-32 space-y-8">
                <div className="p-8 border border-mkt-bd space-y-6">
                   <h4 className="text-[10px] font-mono uppercase tracking-widest text-mkt-i4 font-bold">// WHY TRUST US</h4>
                   <p className="text-sm text-mkt-i2 leading-relaxed">
                      We do not accept payment for rankings. Our data is sourced from live ECN accounts and verified institutional feeds.
                   </p>
                   <div className="space-y-4">
                      {[
                        "No Sponsored Rankings",
                        "Real-Time Spread Monitoring",
                        "ASIC & FCA Verified"
                      ].map((item, i) => (
                        <div key={i} className="flex items-center gap-2 text-[10px] font-mono uppercase text-mkt-ink">
                           <CheckCircle2 className="w-3 h-3 text-mkt-grn" />
                           {item}
                        </div>
                      ))}
                   </div>
                </div>
             </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

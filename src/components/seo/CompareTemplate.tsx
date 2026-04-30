import { ComparisonPage } from "@/data/seo/compare";
import { ShieldCheck, Target, Activity, TrendingUp, ArrowRight, ExternalLink, Info, CheckCircle2, Zap } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import Breadcrumbs from "@/components/layout/Breadcrumbs";

export function CompareTemplate({ page, region = 'uk' }: { page: ComparisonPage; region?: string }) {
  const regionPrefix = region === 'uk' ? '' : `/${region}`;

  return (
    <div className="flex flex-col min-h-screen bg-background-primary">
      {/* Header */}
      <header className="relative pt-32 pb-20 border-b border-border-slate overflow-hidden">
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl">
            <Breadcrumbs 
              items={[
                { label: 'Comparisons', href: `${regionPrefix}/compare` },
                { label: page.slug.replace(/-/g, ' '), href: `${regionPrefix}/compare/${page.slug}` }
              ]} 
            />
            
            <div className="flex items-center gap-3 text-accent mt-8 mb-6">
               <div className="w-8 h-[1px] bg-accent" />
               <span className="text-[10px] font-mono uppercase tracking-[0.3em] font-bold">{page.eyebrow}</span>
            </div>

            <h1 className="text-4xl md:text-7xl font-display font-black uppercase leading-[0.95] tracking-tight mb-8">
              {page.title}
            </h1>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          <div className="lg:col-span-8 space-y-20">
            {/* Quick Verdict */}
            <div className="p-10 bg-background-surface border border-border-slate relative overflow-hidden group">
               <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                  <div className="space-y-6">
                     <div className="inline-flex items-center gap-2 px-3 py-1 bg-profit/10 border border-profit/20 text-profit text-[10px] font-bold uppercase tracking-widest">
                        <Zap className="w-3 h-3" />
                        Quick Verdict
                     </div>
                     <h2 className="text-3xl font-display font-black uppercase m-0">Winner: <span className="text-accent">{page.quickVerdict.winner}</span></h2>
                     <p className="text-lg text-text-secondary m-0">{page.quickVerdict.reason}</p>
                  </div>
                  {page.quickVerdict.prosA && (
                    <div className="space-y-6 bg-background-primary p-8 border border-border-slate/50">
                       <h3 className="text-sm font-mono uppercase tracking-widest text-text-tertiary font-bold">Key Strengths</h3>
                       <ul className="space-y-4 list-none p-0">
                          {page.quickVerdict.prosA.map((pro, i) => (
                             <li key={i} className="flex items-center gap-3 text-xs text-text-secondary m-0">
                                <CheckCircle2 className="w-3.5 h-3.5 text-profit" />
                                {pro}
                             </li>
                          ))}
                       </ul>
                    </div>
                  )}
               </div>
            </div>

            {/* Comparison Table */}
            {page.comparisonTable.length > 0 && (
              <div className="overflow-x-auto border border-border-slate">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-background-surface">
                      <th className="p-6 text-[10px] font-mono uppercase tracking-widest text-text-tertiary border-b border-border-slate">Feature</th>
                      <th className="p-6 text-[10px] font-mono uppercase tracking-widest text-text-tertiary border-b border-border-slate">Broker A</th>
                      <th className="p-6 text-[10px] font-mono uppercase tracking-widest text-text-tertiary border-b border-border-slate">Broker B</th>
                    </tr>
                  </thead>
                  <tbody>
                    {page.comparisonTable.map((row: any, i: number) => (
                      <tr key={i} className="hover:bg-background-elevated/30 transition-colors">
                        <td className="p-6 text-sm font-bold border-b border-border-slate/50 text-text-tertiary">{row.feature}</td>
                        <td className="p-6 text-sm text-text-primary border-b border-border-slate/50">{row.a || row.optionA}</td>
                        <td className="p-6 text-sm text-text-primary border-b border-border-slate/50">{row.b || row.optionB}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <div className="prose prose-invert prose-slate max-w-none">
              {page.sections.map((section, i) => (
                <div key={i} className="mb-12">
                   <h2 className="text-3xl font-display font-bold uppercase tracking-tight mb-6">{section.title}</h2>
                   <p className="text-lg text-text-secondary leading-relaxed">{section.content}</p>
                </div>
              ))}

              {(page.whoShouldChooseA || page.whoShouldChooseB) && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-20">
                  {page.whoShouldChooseA && (
                    <div className="p-10 bg-background-surface border border-border-slate">
                        <h3 className="text-xl font-display font-bold uppercase mb-6">Choose Broker A If...</h3>
                        <ul className="space-y-4 list-none p-0">
                          {page.whoShouldChooseA.map((item, i) => (
                              <li key={i} className="text-sm text-text-secondary leading-relaxed flex gap-3">
                                <span className="text-accent">»</span> {item}
                              </li>
                          ))}
                        </ul>
                    </div>
                  )}
                  {page.whoShouldChooseB && (
                    <div className="p-10 bg-background-surface border border-border-slate">
                        <h3 className="text-xl font-display font-bold uppercase mb-6">Choose Broker B If...</h3>
                        <ul className="space-y-4 list-none p-0">
                          {page.whoShouldChooseB.map((item, i) => (
                              <li key={i} className="text-sm text-text-secondary leading-relaxed flex gap-3">
                                <span className="text-accent">»</span> {item}
                              </li>
                          ))}
                        </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <aside className="lg:col-span-4">
             <div className="sticky top-32 space-y-8">
                <div className="p-8 border border-border-slate bg-background-surface space-y-8 text-center">
                   <Activity className="w-12 h-12 text-accent mx-auto" />
                   <h4 className="text-xl font-display font-bold uppercase">Ready to start?</h4>
                   <p className="text-sm text-text-secondary leading-relaxed">
                      Don't let analysis paralysis stop you. Both platforms provide institutional-grade conditions.
                   </p>
                   <Link href={`${regionPrefix}/brokers`} className="w-full py-5 bg-accent text-[#08090D] font-display font-black uppercase tracking-widest text-xs block">
                      Compare All Brokers
                   </Link>
                </div>
             </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

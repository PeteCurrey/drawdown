import { ShieldCheck, Target, Activity, TrendingUp, ArrowRight, ExternalLink, Info, CheckCircle2, Zap, GitCompare } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import Breadcrumbs from "@/components/layout/Breadcrumbs";

function getLogoForPlatform(name: string) {
  const n = name.toLowerCase();
  if (n.includes('pepperstone')) return '/logos/brokers/pepperstone.svg';
  if (n.includes('ic markets')) return '/logos/brokers/ic-markets.svg';
  if (n.includes('ig')) return '/logos/brokers/ig-markets.svg';
  if (n.includes('oanda')) return '/assets/logos/oanda.svg';
  if (n.includes('saxo')) return '/assets/logos/saxo.svg';
  return null;
}

export function CompareTemplate({ page, region = 'uk', updatedAt }: { page: any; region?: string; updatedAt?: string }) {
  const regionPrefix = region === 'uk' ? '' : `/${region}`;

  // Parse platform names for visual header
  let nameA = 'Platform Alpha';
  let nameB = 'Platform Beta';
  const titleParts = page.title.split(' vs ');
  if (titleParts.length === 2) {
    nameA = titleParts[0].trim();
    nameB = titleParts[1].split(' — ')[0].split(' - ')[0].trim();
  } else {
    const slugParts = page.slug.split('-vs-');
    if (slugParts.length === 2) {
      nameA = slugParts[0].replace(/-/g, ' ').toUpperCase();
      nameB = slugParts[1].replace(/-/g, ' ').toUpperCase();
    }
  }

  const logoA = getLogoForPlatform(nameA);
  const logoB = getLogoForPlatform(nameB);

  return (
    <div className="flex flex-col min-h-screen bg-background-primary text-text-primary relative overflow-hidden">
      {/* Decorative Grid overlay */}
      <div className="absolute top-0 left-0 w-full h-[600px] bg-[linear-gradient(to_bottom,rgba(0,194,255,0.02)_1px,transparent_1px),linear-gradient(to_right,rgba(0,194,255,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none z-0" />
      <div className="absolute top-20 right-1/4 w-96 h-96 rounded-full bg-accent/5 blur-3xl pointer-events-none z-0" />

      {/* Header */}
      <header className="relative pt-32 pb-16 border-b border-border-slate/40 overflow-hidden z-10">
        <div className="container mx-auto px-6">
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
              {page.title.split(' — ')[0]}
            </h1>

            {updatedAt && (
              <div className="mb-8 text-[10px] font-mono text-text-tertiary uppercase tracking-widest">
                Last reviewed: {new Date(updatedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
              </div>
            )}
            
            {/* VS Graphic Banner */}
            <div className="mt-12 grid grid-cols-1 md:grid-cols-11 gap-4 items-center max-w-4xl">
              {/* Entity A Card */}
              <div className="md:col-span-5 p-8 bg-background-surface/40 border border-border-slate/50 backdrop-blur-md flex flex-col items-center justify-center text-center h-36 relative group overflow-hidden">
                <div className="absolute inset-0 bg-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                {logoA ? (
                  <img src={logoA} alt={nameA} className="h-10 max-w-[80%] object-contain relative z-10 brightness-0 invert opacity-70" />
                ) : (
                  <span className="text-xl font-display font-black uppercase text-text-primary relative z-10 tracking-tight">{nameA}</span>
                )}
                <span className="text-[9px] font-mono text-text-tertiary mt-3 uppercase tracking-widest relative z-10">// Platform Alpha</span>
              </div>

              {/* VS Badge */}
              <div className="md:col-span-1 flex justify-center py-2">
                <div className="w-8 h-8 rounded-full bg-accent/10 border border-accent/30 flex items-center justify-center text-[10px] font-mono font-bold text-accent shadow-[0_0_15px_rgba(0,194,255,0.1)]">
                  VS
                </div>
              </div>

              {/* Entity B Card */}
              <div className="md:col-span-5 p-8 bg-background-surface/40 border border-border-slate/50 backdrop-blur-md flex flex-col items-center justify-center text-center h-36 relative group overflow-hidden">
                <div className="absolute inset-0 bg-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                {logoB ? (
                  <img src={logoB} alt={nameB} className="h-10 max-w-[80%] object-contain relative z-10 brightness-0 invert opacity-70" />
                ) : (
                  <span className="text-xl font-display font-black uppercase text-text-primary relative z-10 tracking-tight">{nameB}</span>
                )}
                <span className="text-[9px] font-mono text-text-tertiary mt-3 uppercase tracking-widest relative z-10">// Platform Beta</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-20 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          <div className="lg:col-span-8 space-y-20">
            {/* Quick Verdict */}
            <div className="p-10 bg-background-surface/40 border border-border-slate/50 backdrop-blur-md relative overflow-hidden group">
               <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                  <div className="space-y-6">
                     <div className="inline-flex items-center gap-2 px-3 py-1 bg-profit/10 border border-profit/20 text-profit text-[10px] font-bold uppercase tracking-widest">
                        <Zap className="w-3 h-3 animate-pulse" />
                        Quick Verdict
                     </div>
                     <h2 className="text-3xl font-display font-black uppercase m-0">Winner: <span className="text-accent">{page.quickVerdict.winner}</span></h2>
                     <p className="text-lg text-text-secondary m-0">{page.quickVerdict.reason}</p>
                  </div>
                  {page.quickVerdict.prosA && (
                    <div className="space-y-6 bg-background-elevated/40 p-8 border border-border-slate/30">
                       <h3 className="text-xs font-mono uppercase tracking-widest text-text-tertiary font-bold">// Key Strengths</h3>
                       <ul className="space-y-4 list-none p-0">
                          {page.quickVerdict.prosA.map((pro: string, i: number) => (
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
              <div className="overflow-x-auto border border-border-slate/50 bg-background-surface/20 backdrop-blur-sm">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-background-elevated/40">
                      <th className="p-6 text-[10px] font-mono uppercase tracking-widest text-text-tertiary border-b border-border-slate/50">Feature</th>
                      <th className="p-6 text-[10px] font-mono uppercase tracking-widest text-text-tertiary border-b border-border-slate/50">{nameA}</th>
                      <th className="p-6 text-[10px] font-mono uppercase tracking-widest text-text-tertiary border-b border-border-slate/50">{nameB}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {page.comparisonTable.map((row: any, i: number) => (
                      <tr key={i} className="hover:bg-background-surface/20 transition-colors">
                        <td className="p-6 text-sm font-bold border-b border-border-slate/30 text-text-secondary">{row.feature}</td>
                        <td className="p-6 text-sm text-text-primary border-b border-border-slate/30">{row.a || row.optionA}</td>
                        <td className="p-6 text-sm text-text-primary border-b border-border-slate/30">{row.b || row.optionB}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <div className="prose prose-invert prose-slate max-w-none">
              {page.sections.map((section: any, i: number) => (
                <div key={i} className="mb-16">
                   <h2 className="text-3xl font-display font-bold uppercase tracking-tight mb-6 text-text-primary">{section.title}</h2>
                   <p className="text-lg text-text-secondary leading-relaxed">{section.content}</p>
                </div>
              ))}

              {(page.whoShouldChooseA || page.whoShouldChooseB) && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-20">
                  {page.whoShouldChooseA && (
                    <div className="p-10 bg-background-surface/40 backdrop-blur-md border border-border-slate/50">
                        <h3 className="text-xl font-display font-bold uppercase mb-6 text-text-primary">Choose {nameA} If...</h3>
                        <ul className="space-y-4 list-none p-0">
                          {page.whoShouldChooseA.map((item: string, i: number) => (
                              <li key={i} className="text-sm text-text-secondary leading-relaxed flex gap-3">
                                <span className="text-accent font-bold">»</span> {item}
                              </li>
                          ))}
                        </ul>
                    </div>
                  )}
                  {page.whoShouldChooseB && (
                    <div className="p-10 bg-background-surface/40 backdrop-blur-md border border-border-slate/50">
                        <h3 className="text-xl font-display font-bold uppercase mb-6 text-text-primary">Choose {nameB} If...</h3>
                        <ul className="space-y-4 list-none p-0">
                          {page.whoShouldChooseB.map((item: string, i: number) => (
                              <li key={i} className="text-sm text-text-secondary leading-relaxed flex gap-3">
                                <span className="text-accent font-bold">»</span> {item}
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
                <div className="p-8 border border-border-slate/50 bg-background-surface/40 backdrop-blur-md space-y-8 text-center">
                   <Activity className="w-12 h-12 text-accent mx-auto" />
                   <h4 className="text-xl font-display font-bold uppercase text-text-primary">Ready to start?</h4>
                   <p className="text-sm text-text-secondary leading-relaxed">
                      Don't let analysis paralysis stop you. Both platforms provide professional-grade conditions.
                   </p>
                   <Link href={`${regionPrefix}/brokers`} className="w-full py-5 bg-accent text-[#08090D] font-sans font-black uppercase tracking-widest text-xs block hover:bg-accent-hover transition-colors">
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

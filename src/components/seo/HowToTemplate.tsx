import { BookOpen, Clock, Activity, TrendingUp, ArrowRight, Target, AlertCircle, HelpCircle } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import Breadcrumbs from "@/components/layout/Breadcrumbs";

export function HowToTemplate({ page, region = 'uk' }: { page: any; region?: string }) {
  const regionPrefix = region === 'uk' ? '' : `/${region}`;

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
                { label: 'How-To Guides', href: `${regionPrefix}/how-to` },
                { label: page.slug.replace(/-/g, ' '), href: `${regionPrefix}/how-to/${page.slug}` }
              ]} 
            />
            
            <div className="flex items-center gap-3 text-accent mt-8 mb-6">
               <div className="w-8 h-[1px] bg-accent" />
               <span className="text-[10px] font-mono uppercase tracking-[0.3em] font-bold">{page.eyebrow}</span>
            </div>

            <h1 className="text-4xl md:text-6xl font-display font-black uppercase leading-[0.95] tracking-tight mb-8">
              {page.title}
            </h1>

            <div className="flex flex-wrap gap-8 items-center pt-4">
              <div className="flex items-center gap-2 text-text-secondary">
                <Clock className="w-4 h-4 text-accent" />
                <span className="text-xs font-mono uppercase tracking-widest">{page.readingTime} min read</span>
              </div>
              <div className="flex items-center gap-2 text-text-secondary">
                <BookOpen className="w-4 h-4 text-accent" />
                <span className="text-xs font-mono uppercase tracking-widest">Mastery Level: Intermediate</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-20 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          <article className="lg:col-span-8">
            <div className="prose prose-invert prose-slate max-w-none">
              <p className="text-xl md:text-2xl text-text-secondary leading-relaxed font-medium mb-16 border-l-4 border-accent pl-8 py-2">
                {page.introduction}
              </p>

              {/* Dynamic Strategy Checklist (Media Component) */}
              <div className="relative group overflow-hidden border border-border-slate/50 bg-background-surface/30 backdrop-blur-md p-10 mb-16">
                <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full blur-3xl pointer-events-none" />
                <h3 className="text-xs font-mono uppercase tracking-widest text-accent mb-6 flex items-center gap-2">
                  <Activity className="w-4 h-4" /> Checklist for System Execution
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    "Configure chart layout in TradingView or MT5",
                    "Verify broker execution parameters",
                    "Align rules with regional tax guidelines",
                    "Input target levels in risk calculator",
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-start gap-3 text-sm text-text-secondary">
                      <span className="text-accent mt-0.5">✔</span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Steps */}
              <div className="space-y-16">
                {page.steps.map((step: any, i: number) => (
                  <div key={i} className="relative pl-12 border-l border-border-slate/40 pb-12 last:pb-0 group">
                    <div className="absolute -left-[13px] top-0 w-6 h-6 bg-accent text-[#08090D] flex items-center justify-center text-[10px] font-bold rounded-full group-hover:scale-110 transition-transform">
                       {i + 1}
                    </div>
                    <h2 className="text-2xl font-display font-bold uppercase tracking-tight mb-4 m-0 text-text-primary group-hover:text-accent transition-colors">{step.title}</h2>
                    <p className="text-lg text-text-secondary leading-relaxed m-0">{step.content}</p>
                  </div>
                ))}
              </div>

              {/* Common Mistakes */}
              {page.commonMistakes.length > 0 && (
                <div className="my-20 p-10 bg-loss/5 border border-loss/20 backdrop-blur-md">
                   <h3 className="text-2xl font-display font-black uppercase tracking-tight mb-8 flex items-center gap-3 text-text-primary">
                      <AlertCircle className="w-6 h-6 text-loss" />
                      Critical Mistakes to Avoid.
                   </h3>
                   <ul className="space-y-6 list-none p-0 m-0">
                      {page.commonMistakes.map((mistake: string, i: number) => (
                        <li key={i} className="flex gap-4 text-sm text-text-secondary leading-relaxed m-0 italic">
                          <span className="text-loss font-mono font-bold">»</span>
                          {mistake}
                        </li>
                      ))}
                   </ul>
                </div>
              )}
            </div>

            {/* Approach CTA */}
            <div className="mt-20 p-12 bg-background-surface/40 border border-border-slate/50 backdrop-blur-md space-y-8 relative overflow-hidden group">
               <div className="absolute top-0 right-0 w-48 h-48 bg-accent/5 rounded-full blur-3xl pointer-events-none" />
               <div className="flex items-center gap-4">
                  <Target className="w-8 h-8 text-accent" />
                  <h3 className="text-2xl font-display font-black uppercase m-0 text-text-primary">
                    {page.drawdownApproach.title || "The Drawdown Approach"}
                  </h3>
               </div>
               <p className="text-lg text-text-secondary leading-relaxed">
                 {page.drawdownApproach.content || page.drawdownApproach.text}
               </p>
               <Link 
                  href={page.drawdownApproach.ctaLink || page.drawdownApproach.link || "#"}
                  className="inline-flex items-center gap-4 bg-accent text-[#08090D] px-10 py-5 font-sans font-black uppercase tracking-[0.2em] text-sm hover:bg-accent-hover transition-colors"
               >
                  {page.drawdownApproach.ctaText || page.drawdownApproach.linkText || "Learn More"} <ArrowRight className="w-4 h-4" />
               </Link>
            </div>
          </article>

          <aside className="lg:col-span-4">
            <div className="sticky top-32 space-y-8">
               <div className="p-8 bg-background-surface/40 border border-border-slate/50 backdrop-blur-md space-y-8">
                  <h4 className="text-[10px] font-mono uppercase tracking-widest text-text-tertiary font-bold">// THE PLAYBOOK</h4>
                  <p className="text-sm text-text-secondary leading-relaxed">
                    This guide is part of the Drawdown Professional Curriculum. Start mastering the business of risk with Drawdown.
                  </p>
                  <Link href={`${regionPrefix}/courses`} className="w-full py-4 border border-accent hover:bg-accent hover:text-[#08090D] text-accent transition-all text-center text-[10px] font-bold uppercase tracking-widest block">
                     Access Full Curriculum
                  </Link>
               </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

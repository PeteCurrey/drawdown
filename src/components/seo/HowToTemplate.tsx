import { HowToPage } from "@/data/seo/howto";
import { BookOpen, Clock, Activity, TrendingUp, ArrowRight, Target, AlertCircle, HelpCircle } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import Breadcrumbs from "@/components/layout/Breadcrumbs";

export function HowToTemplate({ page, region = 'uk' }: { page: HowToPage; region?: string }) {
  const regionPrefix = region === 'uk' ? '' : `/${region}`;

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Header */}
      <header className="relative pt-32 pb-20 border-b border-mkt-bd overflow-hidden bg-white">
        <div className="container mx-auto px-6 relative z-10">
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

            <h1 className="text-4xl md:text-6xl font-sans font-black uppercase leading-[0.95] tracking-tight mb-8">
              {page.title}
            </h1>

            <div className="flex flex-wrap gap-8 items-center pt-4">
              <div className="flex items-center gap-2 text-mkt-i4">
                <Clock className="w-4 h-4" />
                <span className="text-xs font-mono uppercase tracking-widest">{page.readingTime} min read</span>
              </div>
              <div className="flex items-center gap-2 text-mkt-i4">
                <BookOpen className="w-4 h-4" />
                <span className="text-xs font-mono uppercase tracking-widest">Mastery Level: Intermediate</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          <article className="lg:col-span-8">
            <div className="prose prose-invert prose-slate max-w-none">
              <p className="text-xl md:text-2xl text-mkt-i2 leading-relaxed font-medium mb-16 border-l-4 border-accent pl-8 py-2">
                {page.introduction}
              </p>

              <div className="space-y-16">
                {page.steps.map((step, i) => (
                  <div key={i} className="relative pl-12 border-l border-mkt-bd pb-12 last:pb-0">
                    <div className="absolute -left-[13px] top-0 w-6 h-6 bg-accent text-[#08090D] flex items-center justify-center text-[10px] font-bold rounded-full">
                       {i + 1}
                    </div>
                    <h2 className="text-2xl font-sans font-bold uppercase tracking-tight mb-6 m-0">{step.title}</h2>
                    <p className="text-lg text-mkt-i2 leading-relaxed m-0">{step.content}</p>
                  </div>
                ))}
              </div>

              {/* Common Mistakes */}
              {page.commonMistakes.length > 0 && (
                <div className="my-20 p-10 bg-loss/5 border border-loss/20">
                   <h3 className="text-2xl font-sans font-black uppercase tracking-tight mb-8 flex items-center gap-3">
                      <AlertCircle className="w-6 h-6 text-red-500" />
                      Critical Mistakes to Avoid.
                   </h3>
                   <ul className="space-y-6 list-none p-0 m-0">
                      {page.commonMistakes.map((mistake, i) => (
                        <li key={i} className="flex gap-4 text-sm text-mkt-i2 leading-relaxed m-0 italic">
                          <span className="text-red-500 font-mono font-bold">»</span>
                          {mistake}
                        </li>
                      ))}
                   </ul>
                </div>
              )}
            </div>

            {/* Approach CTA */}
            <div className="mt-20 p-12 bg-white border border-mkt-bd space-y-8">
               <div className="flex items-center gap-4">
                  <Target className="w-8 h-8 text-accent" />
                  <h3 className="text-2xl font-sans font-black uppercase m-0">
                    {page.drawdownApproach.title || "The Drawdown Approach"}
                  </h3>
               </div>
               <p className="text-lg text-mkt-i2 leading-relaxed">
                 {page.drawdownApproach.content || page.drawdownApproach.text}
               </p>
               <Link 
                  href={page.drawdownApproach.ctaLink || page.drawdownApproach.link || "#"}
                  className="inline-flex items-center gap-4 bg-accent text-[#08090D] px-10 py-5 font-sans font-black uppercase tracking-[0.2em] text-sm hover:translate-y-[-2px] transition-all"
               >
                 {page.drawdownApproach.ctaText || page.drawdownApproach.linkText || "Learn More"} <ArrowRight className="w-4 h-4" />
               </Link>
            </div>
          </article>

          <aside className="lg:col-span-4">
            <div className="sticky top-32 space-y-8">
               <div className="p-8 bg-white border border-mkt-bd space-y-8">
                  <h4 className="text-[10px] font-mono uppercase tracking-widest text-mkt-i4 font-bold">// THE PLAYBOOK</h4>
                  <p className="text-sm text-mkt-i2 leading-relaxed">
                    This guide is part of the Drawdown Institutional Curriculum. Start mastering the business of risk with Drawdown.
                  </p>
                  <Link href={`${regionPrefix}/courses`} className="w-full py-4 border border-accent hover:bg-accent hover:text-[#08090D] transition-all text-center text-[10px] font-bold uppercase tracking-widest block">
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

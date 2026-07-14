import { Metadata } from "next";
import Link from "next/link";
import { Clock, ChevronRight, Layers, Shield } from "lucide-react";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { StructuredData } from "@/components/StructuredData";
import { phases } from "@/data/courses";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: 'Trading Courses UK | 6-Phase Curriculum | Structured Learning',
  description: 'A structured 6-phase trading curriculum built for UK traders. From chart reading to live execution — no shortcuts, no fluff. Start Phase 1 free.',
  alternates: { canonical: 'https://drawdown.trading/courses' }
}

export default function CoursesPage() {
  const courseSchema = {
    "@type": "ItemList",
    "itemListElement": phases.map((phase, i) => ({
      "@type": "ListItem",
      "position": i + 1,
      "item": {
        "@type": "Course",
        "name": `Phase ${phase.number}: ${phase.name}`,
        "description": phase.description,
        "provider": {
          "@type": "Organization",
          "name": "Drawdown",
          "sameAs": "https://drawdown.trading"
        }
      }
    }))
  };

  return (
    <div className="pt-32 pb-24 bg-background-primary min-h-screen">
      <div className="container mx-auto px-6">
        <Breadcrumbs />
        <StructuredData type="ItemList" data={courseSchema} />

        <header className="mb-24 max-w-4xl">
          <span className="text-accent font-mono text-[10px] uppercase tracking-widest block mb-4">
            THE CURRICULUM
          </span>
          <h1 className="text-5xl md:text-8xl font-display font-bold uppercase mb-8 leading-tight">
            A Phase-Based <br /> Learning Path.
          </h1>
          <p className="text-xl text-text-secondary leading-relaxed font-sans max-w-2xl">
            From complete beginner to professional-grade edge. 6 phases. 60+ modules. 
            Built for traders who want to learn properly. No shortcuts. Just the truth.
          </p>
        </header>

        <div className="space-y-32">
          {phases.map((phase, i) => (
            <section key={phase.number} id={`phase-${phase.number}`} className="group scroll-mt-32">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                {/* Visual Marker */}
                <div className="lg:col-span-1 hidden lg:block">
                  <div className="sticky top-40 flex flex-col items-center">
                    <span className="text-4xl font-display font-black text-accent/10 group-hover:text-accent transition-colors">
                      {phase.number}
                    </span>
                    <div className="w-[1px] h-32 bg-gradient-to-b from-accent/20 to-transparent mt-4" />
                  </div>
                </div>

                {/* Content */}
                <div className="lg:col-span-11 grid grid-cols-1 md:grid-cols-2 gap-16">
                  <div className="space-y-8">
                    <div className="flex items-center gap-4">
                      <span className={cn(
                        "px-3 py-1 text-[9px] font-mono uppercase tracking-widest border",
                        phase.tier === 'Free' ? "text-text-primary border-border-slate" : 
                        phase.tier === 'Foundation' ? "text-accent border-accent/20" : 
                        "text-premium border-premium/20"
                      )}>
                        {phase.tier} Tier
                      </span>
                      <span className="text-[9px] font-mono text-text-tertiary uppercase tracking-widest flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {phase.duration}
                      </span>
                      {phase.status === 'in_development' && (
                        <span className="px-3 py-1 text-[9px] font-mono uppercase tracking-widest border border-text-tertiary/30 text-text-tertiary">
                          In Development
                        </span>
                      )}
                    </div>
                    
                    <div>
                      <h2 className={cn(
                        "text-3xl md:text-5xl font-display font-bold uppercase mb-2",
                        phase.status === 'in_development' && "opacity-50"
                      )}>
                        {phase.name}
                      </h2>
                      <p className="text-text-tertiary font-mono uppercase tracking-widest text-xs">
                        {phase.subtitle}
                      </p>
                    </div>

                    <p className="text-text-secondary leading-relaxed text-lg italic border-l-2 border-accent/30 pl-6 py-2">
                      {phase.description}
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4">
                      {phase.status === 'available' ? (
                        <>
                          <Link 
                            href={`/courses/${phase.slug}`}
                            className="inline-flex items-center gap-4 px-10 py-5 bg-accent text-background-primary font-bold uppercase tracking-widest text-[10px] hover:bg-accent-hover transition-colors"
                          >
                            View Course Details
                            <ChevronRight className="w-3 h-3" />
                          </Link>
                          <Link 
                            href="/signup" 
                            className="inline-flex items-center gap-4 px-10 py-5 bg-background-surface border border-border-slate text-text-primary font-bold uppercase tracking-widest text-[10px] hover:border-accent transition-colors"
                          >
                            {phase.tier === 'Free' ? 'Start Free' : 'Create Account'}
                          </Link>
                        </>
                      ) : (
                        <span className="inline-flex items-center gap-4 px-10 py-5 bg-background-elevated border border-border-slate text-text-tertiary font-bold uppercase tracking-widest text-[10px] cursor-not-allowed opacity-60">
                          Coming Soon
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Module List */}
                  <div className="bg-background-surface/50 border border-border-slate p-8 md:p-12">
                    <div className="flex items-center gap-2 mb-8 text-text-tertiary">
                      <Layers className="w-4 h-4 text-accent" />
                      <h4 className="text-[10px] font-mono uppercase tracking-widest font-bold">Included Modules</h4>
                    </div>
                    <ul className="space-y-4">
                      {phase.modules_list.map((module, idx) => (
                        <li key={idx} className="flex gap-4 items-start text-sm text-text-secondary group/item">
                          <span className="text-[10px] font-mono text-accent/40 mt-1">{(idx+1).toString().padStart(2, '0')}</span>
                          <span className="group-hover/item:text-text-primary transition-colors">{module}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </section>
          ))}
        </div>

        {/* Final CTA */}
        <div className="mt-48 p-12 md:p-24 bg-background-elevated border border-border-slate text-center relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-1 bg-accent" />
          <div className="max-w-2xl mx-auto space-y-10 relative z-10">
            <h2 className="  font-display font-bold uppercase">Ready to learn properly?</h2>
            <p className="text-text-secondary text-lg leading-relaxed">
              Start with Phase 1 — completely free. No credit card required. Experience why Drawdown is the choice for disciplined traders.
            </p>
            <Link 
                href="/signup" 
                className="inline-flex items-center gap-4 px-12 py-6 bg-accent text-background-primary font-bold uppercase tracking-widest text-xs hover:bg-accent-hover transition-colors shadow-2xl shadow-accent/20"
              >
                Create Free Account
                <ChevronRight className="w-4 h-4" />
              </Link>
          </div>
          {/* Subtle decoration */}
          <Shield className="absolute -bottom-10 -right-10 w-64 h-64 text-accent/5 -rotate-12" />
        </div>
      </div>
    </div>
  );
}

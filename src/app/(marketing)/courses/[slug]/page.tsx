"use client";

import { use } from "react";
import { phases, phaseIconMap } from "@/data/courses";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { 
  ChevronRight, 
  Clock, 
  Layers, 
  Play, 
  Shield, 
  Target, 
  Zap, 
  Globe,
  CheckCircle2,
  Lock
} from "lucide-react";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { notFound } from "next/navigation";
import { StructuredData } from "@/components/StructuredData";

interface Props {
  params: Promise<{ slug: string }>;
}

export default function CourseLandingPage({ params }: Props) {
  const { slug } = use(params);
  const phase = phases.find(p => p.slug === slug);

  if (!phase) {
    return notFound();
  }

  const Icon = phaseIconMap[phase.icon] || Shield;

  const courseSchema = {
    "name": phase.name,
    "description": phase.full_description,
    "provider": {
      "@type": "Organization",
      "name": "Drawdown",
      "sameAs": "https://drawdown.trading"
    },
    "coursePrerequisites": phase.id > 1 ? `Completion of Phase ${phase.id - 1}` : "None"
  };

  return (
    <div className="pt-28 pb-24 min-h-screen">
      <div className="max-w-7xl mx-auto px-6">
        <Breadcrumbs />
        <StructuredData type="Course" data={courseSchema} />

        <header className="mb-24 mt-12 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <div className="flex items-center gap-4">
              <span className={cn(
                "px-3 py-1 text-[9px] font-mono uppercase tracking-widest border",
                phase.tier === 'Free' ? "text-text-primary border-border-slate/50" : 
                phase.tier === 'Foundation' ? "text-accent border-border-slate/50/20" : 
                "text-premium border-premium/20"
              )}>
                 Phase {phase.number} // {phase.tier} Tier
              </span>
              <span className="text-[9px] font-mono text-text-tertiary uppercase tracking-widest flex items-center gap-1">
                <Clock className="w-3 h-3" /> {phase.duration}
              </span>
            </div>

            <h1 className="text-5xl md:text-8xl font-sans font-bold uppercase leading-tight">
              {phase.name}<span className="text-accent">.</span>
            </h1>
            
            <p className="text-xl text-text-secondary leading-relaxed font-sans max-w-xl italic border-l-2 border-border-slate/50/30 pl-6 py-2">
              {phase.full_description}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link 
                href="/signup" 
                className="inline-flex items-center justify-center gap-4 px-10 py-5 bg-mkt-ink text-white font-bold uppercase tracking-widest text-[10px] hover:bg-accent-hover transition-colors"
              >
                {phase.tier === 'Free' ? 'Start Learning for Free' : 'Unlock Full Access'}
                <ChevronRight className="w-3 h-3" />
              </Link>
              <Link 
                href="/pricing" 
                className="inline-flex items-center justify-center gap-4 px-10 py-5 bg-background-surface/40 backdrop-blur-md border border-border-slate/50 transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,0,0,0.2)] hover:border-border-slate hover:-translate-y-0.5 text-text-primary font-bold uppercase tracking-widest text-[10px] hover:border-border-slate transition-colors"
              >
                View Membership Plans
              </Link>
            </div>
          </div>

          <div className="relative aspect-square lg:aspect-video bg-background-surface/40 backdrop-blur-md border border-border-slate/50 transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,0,0,0.2)] hover:border-border-slate hover:-translate-y-0.5 group overflow-hidden">
             <div className="absolute inset-0 bg-gradient-to-br from-accent/10 to-transparent opacity-50 group-hover:scale-110 transition-transform duration-1000" />
             <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative">
                   <Icon className="w-32 h-32 text-accent opacity-20" />
                   <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-8xl font-sans font-black text-profit select-none">
                     {phase.number}
                   </span>
                </div>
             </div>
             {/* Decorative UI elements */}
             <div className="absolute top-6 right-6 flex items-center gap-2 px-3 py-1.5 bg-background-elevated/40/80 backdrop-blur-md border border-border-slate/50 rounded-full">
                <div className="w-2 h-2 rounded-full bg-profit animate-pulse" />
                <span className="text-[9px] font-mono uppercase tracking-widest text-text-secondary">Course Available</span>
             </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-32">
           <div className="lg:col-span-2 space-y-12">
              <section className="space-y-8">
                 <h2 className="text-3xl font-sans font-bold uppercase flex items-center gap-3">
                    <Target className="w-6 h-6 text-accent" /> What You Will Master
                 </h2>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {phase.modules_list.map((module, i) => (
                      <div key={i} className="p-6 /50 border border-border-slate/50 hover:border-border-slate/70 transition-colors group">
                         <div className="flex items-start gap-4">
                            <span className="text-[10px] font-mono text-profit mt-1">{(i+1).toString().padStart(2, '0')}</span>
                            <span className="text-sm font-bold uppercase tracking-tight group-hover:text-text-primary transition-colors">{module}</span>
                         </div>
                      </div>
                    ))}
                 </div>
              </section>

              <section className="p-12 bg-background-elevated/40 border border-border-slate/50 relative overflow-hidden group">
                 <div className="absolute top-0 left-0 w-full h-1 bg-accent" />
                 <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-12">
                    <div className="space-y-4">
                       <Zap className="w-8 h-8 text-accent" />
                       <h3 className="text-xl font-sans font-bold uppercase">Repeatable Process</h3>
                       <p className="text-xs text-text-secondary leading-relaxed">No theory. Just mechanical rules designed for professional execution.</p>
                    </div>
                    <div className="space-y-4">
                       <Globe className="w-8 h-8 text-accent" />
                       <h3 className="text-xl font-sans font-bold uppercase">Universal Edge</h3>
                       <p className="text-xs text-text-secondary leading-relaxed">Applied across any liquid market: FX, Indices, Metals, or Crypto.</p>
                    </div>
                    <div className="space-y-4">
                       <Shield className="w-8 h-8 text-accent" />
                       <h3 className="text-xl font-sans font-bold uppercase">Risk Centric</h3>
                       <p className="text-xs text-text-secondary leading-relaxed">Built on the foundation of capital preservation above all else.</p>
                    </div>
                 </div>
                 <Shield className="absolute -bottom-10 -right-10 w-64 h-64 text-profit -rotate-12 pointer-events-none" />
              </section>
           </div>

           <aside className="space-y-8">
              <div className="p-8 bg-background-surface/40 backdrop-blur-md border border-border-slate/50 transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,0,0,0.2)] hover:border-border-slate hover:-translate-y-0.5 sticky top-40">
                 <div className="flex items-center gap-2 mb-8 text-text-tertiary">
                    <Layers className="w-4 h-4 text-accent" />
                    <h4 className="text-[10px] font-mono uppercase tracking-widest font-bold">Phase Specs</h4>
                 </div>
                 
                 <div className="space-y-6">
                    <div className="flex justify-between items-center py-3 border-b border-border-slate/30">
                       <span className="text-[10px] font-mono uppercase text-text-tertiary">Duration</span>
                       <span className="text-xs font-bold">{phase.duration}</span>
                    </div>
                    <div className="flex justify-between items-center py-3 border-b border-border-slate/30">
                       <span className="text-[10px] font-mono uppercase text-text-tertiary">Modules</span>
                       <span className="text-xs font-bold">{phase.modules_count} Total</span>
                    </div>
                    <div className="flex justify-between items-center py-3 border-b border-border-slate/30">
                       <span className="text-[10px] font-mono uppercase text-text-tertiary">Skill Level</span>
                       <span className="text-xs font-bold uppercase text-accent">{phase.id <= 1 ? "Foundational" : phase.id <= 4 ? "Core" : "Advanced"}</span>
                    </div>
                    <div className="flex justify-between items-center py-3">
                       <span className="text-[10px] font-mono uppercase text-text-tertiary">Access</span>
                       <span className="text-xs font-bold uppercase">{phase.tier} Tier</span>
                    </div>

                    <Link 
                       href="/signup" 
                       className="block w-full py-4 bg-mkt-ink text-white text-center font-bold uppercase tracking-widest text-[10px] hover:bg-accent-hover transition-colors mt-8"
                    >
                       Get Started Now
                    </Link>
                 </div>
              </div>
           </aside>
        </div>

        {/* Other Phases Preview */}
        <section className="space-y-12">
           <div className="text-center">
              <h2 className="text-3xl font-sans font-bold uppercase">The Full Journey.</h2>
              <p className="text-text-secondary text-sm font-mono uppercase tracking-widest mt-2">6 Sequential Phases to Professionalism</p>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {phases.map((p) => (
                <Link 
                   key={p.slug}
                   href={`/courses/${p.slug}`}
                   className={cn(
                      "group p-6 border transition-premium text-center h-full flex flex-col items-center justify-center",
                      p.slug === slug ? "bg-accent/5 border-border-slate/50" : " border-border-slate/50 hover:border-border-slate/40"
                   )}
                >
                   <span className={cn(
                      "text-2xl font-sans font-black transition-colors mb-2",
                      p.slug === slug ? "text-accent" : "text-text-tertiary group-hover:text-profit"
                   )}>
                      {p.number}
                   </span>
                   <h4 className="text-[10px] font-bold uppercase tracking-tighter text-text-secondary group-hover:text-text-primary transition-colors">
                      {p.name}
                   </h4>
                   {p.slug === slug && (
                      <div className="mt-2 w-1.5 h-1.5 rounded-full bg-accent" />
                   )}
                </Link>
              ))}
           </div>
        </section>
      </div>
    </div>
  );
}

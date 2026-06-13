"use client";

import { useParams, notFound } from "next/navigation";
import { 
  ArrowLeft, 
  CheckCircle2, 
  ArrowRight,
  ShieldAlert,
  Terminal,
  Layers,
  Activity,
  Zap,
  Quote
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { tools } from "@/data/tools";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { TrackPageView } from "@/components/admin/TrackPageView";

export default function ToolDetailPage() {
  const { slug } = useParams();
  const tool = tools.find(t => t.slug === slug);

  if (!tool) {
    notFound();
  }

  const Icon = tool.icon;

  return (
    <div className="flex flex-col pt-28 pb-24 min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-12">
          <Breadcrumbs />
          <TrackPageView path={`/tools/${slug}`} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
           {/* Left Column: Primary Info */}
           <div className="lg:col-span-12 space-y-16">
              <div className="space-y-6 max-w-4xl">
                 <div className="flex items-center gap-3 text-accent transition-all animate-pulse">
                    <Terminal className="w-4 h-4" />
                    <span className="text-[10px] font-mono uppercase tracking-[0.4em]">SYSTEM_MODULE // {tool.slug}</span>
                 </div>
                 <h1 className="text-6xl md:text-9xl font-sans font-extrabold uppercase tracking-tighter leading-[0.85]">
                    {tool.title.split(' ').map((word, i) => (
                      <span key={i} className={i === tool.title.split(' ').length - 1 ? "text-accent" : ""}>
                        {word}{" "}
                      </span>
                    ))}
                 </h1>
                 <p className="text-2xl md:text-3xl text-mkt-i2 font-sans font-light leading-relaxed">
                    {tool.tagline}
                 </p>
              </div>

              {/* Quick Hero Interaction */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                 <div className="lg:col-span-2 aspect-video bg-[#F7F7F7] border border-mkt-bd relative group overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent opacity-50" />
                    <div className="absolute inset-0 flex items-center justify-center p-20">
                       <Icon className="w-32 h-32 text-mkt-grn group-hover:scale-110 transition-transform duration-1000" />
                    </div>
                    <div className="absolute top-0 left-0 p-8">
                       <span className="text-[10px] font-mono text-mkt-i4 uppercase tracking-widest">Live_Terminal_Preview</span>
                    </div>
                    <div className="absolute bottom-0 right-0 p-8 flex items-end gap-2 text-mkt-grn animate-pulse">
                       <Activity className="w-4 h-4" />
                       <span className="text-[8px] font-mono uppercase tracking-widest">Active_Feed_021.4</span>
                    </div>
                 </div>

                 <div className="space-y-8 flex flex-col justify-center">
                    <div className="p-8 bg-accent/5 border border-mkt-bd/20 relative overflow-hidden group">
                       <Quote className="absolute -top-4 -right-4 w-20 h-20 text-mkt-grn" />
                       <p className="text-sm italic text-mkt-ink leading-relaxed relative z-10 mb-6">
                         "{tool.sections.peteTake}"
                       </p>
                       <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center text-[10px] font-bold">P</div>
                          <span className="text-[10px] font-mono uppercase tracking-widest text-mkt-i4">Pete Currey // Founder</span>
                       </div>
                    </div>
                    <Link href="/signup" className="flex items-center justify-between bg-mkt-ink text-white px-8 py-6 font-bold uppercase tracking-widest text-xs hover:bg-accent-hover transition-all group">
                       Get Initial Access
                       <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
                    </Link>
                 </div>
              </div>
           </div>

           {/* Content Sections */}
           <div className="lg:col-span-8 space-y-24">
              {/* Problem Statement */}
              <section className="space-y-8">
                 <div className="flex items-center gap-4">
                    <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-mkt-i4">01_The_Problem</span>
                    <div className="h-px flex-grow bg-border-slate" />
                 </div>
                 <h2 className="text-4xl font-sans font-bold uppercase">{tool.sections.problem.title}</h2>
                 <p className="text-xl text-mkt-i2 leading-relaxed max-w-3xl">
                    {tool.sections.problem.content}
                 </p>
              </section>

              {/* How it Works / Steps */}
              <section className="space-y-12">
                 <div className="flex items-center gap-4">
                    <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-mkt-i4">02_How_It_Works</span>
                    <div className="h-px flex-grow bg-border-slate" />
                 </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-border-slate border border-mkt-bd">
                    {tool.sections.howItWorks.steps.map((step, i) => (
                      <div key={i} className="p-8 bg-white flex flex-col gap-4 group">
                         <span className="text-xs font-mono text-accent">[{i+1}]</span>
                         <h4 className="text-lg font-bold uppercase group-hover:text-accent transition-colors">{step.title}</h4>
                         <p className="text-sm text-mkt-i4 leading-relaxed">{step.description}</p>
                      </div>
                    ))}
                 </div>
              </section>

              {/* Deep Dive Content (Long Markdown) */}
              <section className="space-y-8 pt-12 border-t border-mkt-bd">
                 <div className="flex items-center gap-4">
                    <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-mkt-i4">03_Technical_DeepDive</span>
                    <div className="h-px flex-grow bg-border-slate" />
                 </div>
                 <div className="prose prose-invert prose-drawdown max-w-none">
                    <h2 className="text-4xl font-sans font-bold uppercase text-mkt-ink mb-12">{tool.deepDive.title}</h2>
                    {tool.deepDive.content.split('\n\n').map((para, i) => {
                      if (para.startsWith('## ')) return <h2 key={i} className="text-2xl font-sans font-bold uppercase text-accent mt-16 mb-8">{para.replace('## ', '')}</h2>;
                      if (para.startsWith('### ')) return <h3 key={i} className="text-lg font-sans font-bold uppercase text-mkt-ink mt-12 mb-6">{para.replace('### ', '')}</h3>;
                      if (para.startsWith('* ')) {
                         return (
                           <ul key={i} className="space-y-4 my-8">
                             {para.split('\n').map((li, idx) => (
                               <li key={idx} className="flex items-start gap-3 text-mkt-i2">
                                  <div className="w-1.5 h-1.5 rounded-full bg-accent mt-1.5 shrink-0" />
                                  <span>{li.replace('* ', '')}</span>
                               </li>
                             ))}
                           </ul>
                         );
                      }
                      return <p key={i} className="text-lg text-mkt-i2 leading-relaxed mb-8">{para}</p>;
                    })}
                 </div>
              </section>
           </div>

           {/* Sidebar Info */}
           <aside className="lg:col-span-4 space-y-12">
              <div className="sticky top-40 space-y-12">
                 {/* AI Callout */}
                 <div className="p-8 bg-[#F7F7F7] border-l-4 border-mkt-bd relative overflow-hidden group">
                    <Zap className="absolute top-0 right-0 p-4 w-16 h-16 text-mkt-grn group-hover:scale-125 transition-transform duration-1000" />
                    <div className="relative z-10 space-y-4">
                       <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-accent flex items-center gap-2">
                          <Zap className="w-3 h-3" /> {tool.sections.aiPowered.title}
                       </h3>
                       <p className="text-sm text-mkt-ink leading-relaxed">
                          {tool.sections.aiPowered.content}
                       </p>
                    </div>
                 </div>

                 {/* Feature Checklist */}
                 <div className="space-y-8">
                    <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-mkt-i4">{tool.sections.features.title}</h3>
                    <div className="space-y-6">
                       {tool.sections.features.items.map((item, i) => (
                          <div key={i} className="space-y-2">
                             <div className="flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4 text-mkt-grn" />
                                <span className="text-sm font-bold uppercase tracking-tight">{item.title}</span>
                             </div>
                             <p className="text-[11px] text-mkt-i4 leading-relaxed ml-6">{item.description}</p>
                          </div>
                       ))}
                    </div>
                 </div>

                 {/* Who It's For */}
                 <div className="space-y-4 pt-8 border-t border-mkt-bd">
                    <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-mkt-i4">{tool.sections.whoItIsFor.title}</h3>
                    <p className="text-sm text-mkt-i2 leading-relaxed">
                       {tool.sections.whoItIsFor.content}
                    </p>
                 </div>
              </div>
           </aside>
        </div>
      </div>
    </div>
  );
}

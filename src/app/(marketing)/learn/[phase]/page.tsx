import { Metadata } from "next";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { 
  Play, 
  CheckCircle2, 
  Clock, 
  ChevronLeft,
  ShieldCheck,
  Zap,
  Lock,
  BrainCircuit,
  ArrowRight
} from "lucide-react";
import { phases, phaseIconMap } from "@/data/courses";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ phase: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { phase: slug } = await params;
  const phase = phases.find(p => p.slug === slug);

  if (!phase) return { title: "Phase Not Found" };

  return {
    title: `Phase ${phase.number}: ${phase.name} | Drawdown Academy`,
    description: phase.description,
    openGraph: {
      title: `${phase.name} - Professional Trading Education`,
      description: phase.description,
      images: [phase.image],
    },
  };
}

export default async function PhasePage({ params }: PageProps) {
  const { phase: slug } = await params;
  const phase = phases.find(p => p.slug === slug);

  if (!phase) notFound();

  const Icon = phaseIconMap[phase.icon] || ShieldCheck;

  return (
    <div className="pt-12 pb-24 bg-white min-h-screen transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-6">
        <Link 
          href="/learn" 
          className="inline-flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-mkt-i4 hover:text-accent transition-colors mb-12"
        >
          <ChevronLeft className="w-3 h-3" /> Back to Library
        </Link>

        {/* Phase Header */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 mb-24">
          <div className="lg:col-span-8 space-y-8">
            <div className="flex items-center gap-4">
               <span className="text-sm font-mono font-bold text-accent uppercase tracking-[0.3em] bg-accent/5 px-3 py-1 border border-mkt-bd/20">
                 Phase {phase.number}
               </span>
               <div className="flex-grow h-[1px] bg-border-slate/30" />
            </div>
            
            <h1 className="text-5xl md:text-8xl font-sans font-bold uppercase leading-[0.9] tracking-tighter">
              {phase.name}<span className="text-accent">.</span>
            </h1>

            <p className="text-2xl font-sans font-medium text-mkt-i2 leading-tight uppercase tracking-tight max-w-2xl">
              {phase.subtitle}
            </p>

            <p className="text-lg text-mkt-i2 leading-relaxed max-w-3xl font-light">
              {phase.full_description}
            </p>

            <div className="flex items-center gap-8 pt-8 border-t border-mkt-bd/30">
               <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-mkt-i4">Estimated Time</span>
                  <span className="text-sm font-bold uppercase">{phase.duration}</span>
               </div>
               <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-mkt-i4">Curriculum Tier</span>
                  <span className={cn(
                    "text-sm font-bold uppercase",
                    phase.tier === 'Free' ? "text-mkt-grn" : "text-accent"
                  )}>{phase.tier}</span>
               </div>
            </div>
          </div>

          <div className="lg:col-span-4 hidden lg:block">
             <div className="sticky top-32 p-10 bg-white border border-mkt-bd space-y-8">
                <div className="space-y-4">
                   <div className="w-12 h-12 bg-[#F7F7F7] flex items-center justify-center border border-mkt-bd">
                      <Icon className="w-6 h-6 text-accent" />
                   </div>
                   <h4 className="text-lg font-sans font-bold uppercase">Ready to Start?</h4>
                   <p className="text-xs text-mkt-i4 leading-relaxed">
                     This phase marks the beginning of your professional transition. No indicators, no noise. Just Pure Market Geometry.
                   </p>
                </div>
                <Link 
                  href="/signup" 
                  className="block w-full py-5 bg-mkt-ink hover:bg-mkt-i2 text-background-primary text-center font-bold uppercase tracking-widest text-[10px] transition-colors"
                >
                  Access Module 01
                </Link>
             </div>
          </div>
        </div>

        {/* Phase Breakdown */}
        <div className="mb-24">
           <h2 className="text-3xl font-sans font-bold uppercase mb-12 flex items-center gap-4">
              <span className="text-accent underline decoration-accent/30 underline-offset-8">01.</span> Curriculum Breakdown
           </h2>
           
           <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-border-slate/30 border border-mkt-bd/30">
              {phase.modules_list.map((module, i) => (
                <div key={i} className="bg-white p-8 hover:bg-[#F7F7F7] transition-colors group">
                   <div className="flex items-start gap-6">
                      <span className="text-sm font-mono text-mkt-i4 font-bold">
                        {i + 1 < 10 ? `0${i + 1}` : i + 1}
                      </span>
                      <div className="space-y-2">
                        <h3 className="text-lg font-sans font-bold uppercase group-hover:text-accent transition-colors leading-tight">
                          {module}
                        </h3>
                        <p className="text-[10px] font-mono text-mkt-i4 uppercase tracking-widest">
                          {module.includes("Quiz") || module.includes("Assessment") ? "Technical Evaluation" : "Video Strategic Deep-Dive"}
                        </p>
                      </div>
                   </div>
                </div>
              ))}
           </div>
        </div>

        {/* Lead Branding */}
        <div className="pt-24 border-t border-mkt-bd/30 flex flex-col items-center text-center space-y-12">
            <div className="space-y-4">
               <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-mkt-i4 mb-2">Platform Lead</p>
               <div className="group">
                 <p className="  font-serif italic text-mkt-ink tracking-wide opacity-80 group-hover:opacity-100 transition-opacity select-none" style={{ fontFamily: 'serif' }}>
                   Pete Currey
                 </p>
               </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-4xl w-full">
               {[
                 { label: "Institutional Accuracy", value: "Verified data from actual funded accounts." },
                 { label: "UK Based Mastery", value: "Built and taught from our hub in Chesterfield, UK." },
                 { label: "No Retail Indicators", value: "We teach you to read the pure price action of the tape." }
               ].map((item, i) => (
                 <div key={i} className="space-y-2">
                    <h5 className="text-xs font-bold uppercase text-accent tracking-widest">{item.label}</h5>
                    <p className="text-xs text-mkt-i4 leading-relaxed uppercase font-mono">{item.value}</p>
                 </div>
               ))}
            </div>
            
            <div className="pt-12">
               <Link href="/pricing" className="inline-flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-mkt-ink hover:text-accent transition-colors">
                  Join 2,400+ Students <ArrowRight className="w-4 h-4" />
               </Link>
            </div>
        </div>
      </div>
    </div>
  );
}

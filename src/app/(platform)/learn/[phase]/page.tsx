"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { 
  Play, 
  CheckCircle2, 
  Clock, 
  ChevronLeft,
  FileText,
  HelpCircle,
  Lock
} from "lucide-react";

interface Props {
  params: { phase: string };
}

const modules = [
  { id: 1, title: "The Industry's Toxic Incentive", duration: "24m", status: "completed", type: "video" },
  { id: 2, title: "Why Your Edge Isn't Working", duration: "45m", status: "completed", type: "video" },
  { id: 3, title: "The Math of Survivability", duration: "18m", status: "current", type: "video" },
  { id: 4, title: "Capital vs. Ego", duration: "32m", status: "locked", type: "video" },
  { id: 5, title: "Basics of Risk (Quiz)", duration: "15m", status: "locked", type: "quiz" },
  { id: 6, title: "Phase 1 Workshop", duration: "60m", status: "locked", type: "video" },
];

export default function PhasePage({ params }: Props) {
  const phaseName = params.phase.replace(/-/g, " ");

  return (
    <div className="pt-32 pb-24 bg-background-primary min-h-screen">
      <div className="container mx-auto px-6">
        <Link 
          href="/learn" 
          className="inline-flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-text-tertiary hover:text-accent transition-colors mb-12"
        >
          <ChevronLeft className="w-3 h-3" /> Back to Library
        </Link>

        {/* Phase Header */}
        <div className="mb-20">
          <div className="flex items-center gap-4 mb-6">
            <span className="text-4xl font-display font-black text-accent uppercase tracking-tighter">Phase 01</span>
            <div className="flex-grow h-[1px] bg-border-slate" />
          </div>
          <h1 className="text-5xl md:text-8xl font-display font-bold uppercase mb-8 leading-tight">
            {phaseName}.
          </h1>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl">
            <div className="space-y-2">
              <p className="text-[10px] font-mono uppercase tracking-widest text-text-tertiary">Current Progress</p>
              <div className="flex items-center gap-4">
                <div className="flex-grow h-1 bg-background-elevated">
                  <div className="h-full bg-accent w-[33%]" />
                </div>
                <span className="text-xs font-mono font-bold">33%</span>
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-[10px] font-mono uppercase tracking-widest text-text-tertiary">Complexity</p>
              <p className="text-sm font-bold uppercase tracking-widest text-text-primary">Foundational</p>
            </div>
            <div className="space-y-2">
              <p className="text-[10px] font-mono uppercase tracking-widest text-text-tertiary">Estimated Time</p>
              <p className="text-sm font-bold uppercase tracking-widest text-text-primary">4.5 Hours</p>
            </div>
          </div>
        </div>

        {/* Module List */}
        <div className="space-y-4 max-w-5xl">
          {modules.map((module) => (
            <div 
              key={module.id}
              className={cn(
                "group p-6 flex flex-col md:flex-row items-center justify-between gap-6 border transition-premium",
                module.status === 'locked' ? "bg-background-primary border-border-slate opacity-50" : 
                module.status === 'current' ? "bg-background-elevated border-accent" :
                "bg-background-surface border-border-slate hover:border-text-tertiary"
              )}
            >
              <div className="flex items-center gap-8 w-full md:w-auto">
                <span className="text-2xl font-mono text-text-tertiary group-hover:text-text-primary transition-colors">
                  {module.id < 10 ? `0${module.id}` : module.id}
                </span>
                
                <div className="flex-grow">
                  <h3 className={cn(
                    "text-lg font-display font-bold uppercase tracking-tight",
                    module.status === 'current' ? "text-accent" : "text-text-primary"
                  )}>
                    {module.title}
                  </h3>
                  <div className="flex items-center gap-4 mt-2">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-text-tertiary flex items-center gap-2">
                      <Clock className="w-3 h-3" /> {module.duration}
                    </span>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-text-tertiary flex items-center gap-2">
                      {module.type === 'video' ? <Play className="w-3 h-3" /> : <HelpCircle className="w-3 h-3" />}
                      {module.type}
                    </span>
                  </div>
                </div>
              </div>

              <div className="w-full md:w-auto flex items-center justify-end gap-6">
                {module.status === 'completed' && <CheckCircle2 className="w-6 h-6 text-profit" />}
                {module.status === 'locked' && <Lock className="w-5 h-5 text-text-tertiary" />}
                {module.status !== 'locked' && (
                  <Link 
                    href={`/learn/${params.phase}/module-${module.id}`}
                    className={cn(
                      "px-8 py-3 text-[10px] font-bold uppercase tracking-widest transition-all",
                      module.status === 'current' ? "bg-accent text-background-primary" : "bg-background-elevated border border-border-slate hover:bg-background-surface"
                    )}
                  >
                    {module.status === 'completed' ? "Review" : "Start"}
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

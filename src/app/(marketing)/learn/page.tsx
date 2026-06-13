"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { 
  Lock, 
  Play, 
  CheckCircle2, 
  Clock, 
  LineChart,
  BrainCircuit,
  ShieldCheck,
  Zap
} from "lucide-react";

import { phases, phaseIconMap } from "@/data/courses";

export default function CourseLibraryPage() {
  const userTier = "foundation"; // Mock tier for UI testing

  return (
    <div className="pt-12 pb-24 bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-20">
          <span className="text-accent font-mono text-[10px] uppercase tracking-widest block mb-4">// CURRICULUM</span>
          <h1 className="  font-sans font-bold uppercase mb-4">The Truth.</h1>
          <p className="text-mkt-i2 max-w-xl">
            Six phases of increasing complexity. No shortcuts. Each phase must be mastered before moving to the next.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {phases.map((phase) => {
            const isLocked = phase.tier === "Edge" || phase.tier === "Floor"; // Simple lock logic for UI
            const Icon = phaseIconMap[phase.icon] || ShieldCheck;

            return (
              <Link 
                key={phase.id}
                href={isLocked ? "#" : `/learn/${phase.slug}`}
                className={cn(
                  "group relative p-8 bg-white border-2 transition-premium flex flex-col h-full overflow-hidden",
                  isLocked ? "border-mkt-bd opacity-60 cursor-not-allowed" : "border-transparent hover:border-mkt-bds hover:bg-[#F7F7F7]"
                )}
              >
                {/* Hover Background Image */}
                {!isLocked && (
                  <div className="absolute inset-0 z-0 overflow-hidden">
                    <img 
                      src={phase.image} 
                      alt="" 
                      className="w-full h-full object-cover transition-all duration-1000 scale-110 group-hover:scale-100 opacity-0 group-hover:opacity-10"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background-surface via-background-surface/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                  </div>
                )}

                <div className="relative z-10 flex flex-col h-full">
                  <div className="flex justify-between items-start mb-12">
                    <div className="flex items-center gap-4">
                      <span className="text-4xl font-sans font-black text-mkt-grn group-hover:text-accent transition-colors">
                        {phase.number}
                      </span>
                      <div className="w-10 h-10 bg-[#F7F7F7] flex items-center justify-center border border-mkt-bd">
                        <Icon className="w-5 h-5 text-mkt-i2 group-hover:text-accent transition-colors" />
                      </div>
                    </div>
                    {isLocked ? (
                      <div className="flex items-center gap-2 px-3 py-1 bg-white border border-mkt-bd text-[8px] font-mono uppercase tracking-widest text-mkt-i4">
                        <Lock className="w-3 h-3" /> {phase.tier}
                      </div>
                    ) : (
                      <div className="w-2 h-2 rounded-full bg-profit animate-pulse" />
                    )}
                  </div>

                  <div className="flex-grow space-y-4 mb-12">
                    <h3 className="text-2xl font-sans font-bold uppercase leading-tight group-hover:text-accent transition-colors">
                      {phase.name}
                    </h3>
                    <p className="text-mkt-i4 text-xs font-mono uppercase tracking-widest leading-none">
                      {phase.subtitle}
                    </p>
                    <p className="text-mkt-i2 text-sm leading-relaxed line-clamp-3">
                      {phase.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-8 border-t border-mkt-bd/50">
                    <div className="flex items-center gap-4 text-[10px] font-mono text-mkt-i4 uppercase tracking-widest">
                      <span className="flex items-center gap-1"><Play className="w-3 h-3" /> {phase.modules_count} Modules</span>
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {phase.duration}</span>
                    </div>
                    {!isLocked && (
                      <span className="text-[10px] font-bold uppercase tracking-widest text-accent group-hover:translate-x-1 transition-transform">
                        Continue →
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Support Section */}
        <div className="mt-32 p-12 bg-[#F7F7F7] border border-mkt-bd flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-4 max-w-xl">
            <h4 className="text-2xl font-sans font-bold uppercase">Stuck in a Drawdown?</h4>
            <p className="text-mkt-i2 text-sm leading-relaxed">
              Don't trade alone. Join our community Discord to discuss lessons, share analysis, and get direct feedback from senior traders.
            </p>
          </div>
          <button className="px-12 py-5 bg-white border border-mkt-bd hover:border-mkt-bds hover:text-accent text-[10px] font-bold uppercase tracking-widest transition-all">
            Join the Discord
          </button>
        </div>
      </div>
    </div>
  );
}

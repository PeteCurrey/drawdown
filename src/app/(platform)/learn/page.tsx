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

const phases = [
  {
    id: 1,
    slug: "ground-zero",
    name: "Ground Zero",
    subtitle: "The Foundation of Discipline",
    modules: 8,
    duration: "4.5h",
    icon: ShieldCheck,
    tier: "free",
    description: "Unlearn the noise. Build the fundamental psychological and mechanical foundation every trader needs.",
  },
  {
    id: 2,
    slug: "chart-reader",
    name: "Chart Reader",
    subtitle: "Market Geometry & Price Action",
    modules: 12,
    duration: "8h",
    icon: LineChart,
    tier: "foundation",
    description: "Master naked price action. Learn to see what the institutions are doing without relying on lagging indicators.",
  },
  {
    id: 3,
    slug: "strategist",
    name: "Strategist",
    subtitle: "Building Your Edge",
    modules: 10,
    duration: "6.5h",
    icon: Zap,
    tier: "foundation",
    description: "Develop, test, and refine high-probability setups. We move from theory to a specific, repeatable mechanical edge.",
  },
  {
    id: 4,
    slug: "risk-manager",
    name: "Risk Manager",
    subtitle: "The Math of Survival",
    modules: 6,
    duration: "3h",
    icon: Lock,
    tier: "edge",
    description: "The most important phase. Learn the professional position sizing and account management that keeps you in the game.",
  },
  {
    id: 5,
    slug: "mind-over-market",
    name: "Mind Over Market",
    subtitle: "Advanced Psychology",
    modules: 10,
    duration: "5h",
    icon: BrainCircuit,
    tier: "edge",
    description: "Conquer the internal battles. Dealing with streaks, tilt, and the loneliness of the screens.",
  },
  {
    id: 6,
    slug: "the-edge",
    name: "The Edge",
    subtitle: "Portfolio & AI Integration",
    modules: 14,
    duration: "12h",
    icon: Play,
    tier: "floor",
    description: "Scaling up. Integrating custom AI workflows, portfolio diversification, and long-term wealth management.",
  },
];

export default function CourseLibraryPage() {
  const userTier = "foundation"; // Mock tier for UI testing

  return (
    <div className="pt-32 pb-24 bg-background-primary min-h-screen">
      <div className="container mx-auto px-6">
        <div className="mb-20">
          <span className="text-accent font-mono text-[10px] uppercase tracking-widest block mb-4">// CURRICULUM</span>
          <h1 className="text-4xl md:text-6xl font-display font-bold uppercase mb-4">The Truth.</h1>
          <p className="text-text-secondary max-w-xl">
            Six phases of increasing complexity. No shortcuts. Each phase must be mastered before moving to the next.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {phases.map((phase) => {
            const isLocked = phase.tier === "edge" || phase.tier === "floor"; // Simple lock logic for UI
            const Icon = phase.icon;

            return (
              <Link 
                key={phase.id}
                href={isLocked ? "#" : `/learn/${phase.slug}`}
                className={cn(
                  "group relative p-8 bg-background-surface border-2 transition-premium flex flex-col h-full",
                  isLocked ? "border-border-slate opacity-60 cursor-not-allowed" : "border-transparent hover:border-accent hover:bg-background-elevated"
                )}
              >
                <div className="flex justify-between items-start mb-12">
                  <div className="flex items-center gap-4">
                    <span className="text-4xl font-display font-black text-accent/20 group-hover:text-accent transition-colors">
                      0{phase.id}
                    </span>
                    <div className="w-10 h-10 bg-background-elevated flex items-center justify-center border border-border-slate">
                      <Icon className="w-5 h-5 text-text-secondary group-hover:text-accent transition-colors" />
                    </div>
                  </div>
                  {isLocked ? (
                    <div className="flex items-center gap-2 px-3 py-1 bg-background-primary border border-border-slate text-[8px] font-mono uppercase tracking-widest text-text-tertiary">
                      <Lock className="w-3 h-3" /> {phase.tier}
                    </div>
                  ) : (
                    <div className="w-2 h-2 rounded-full bg-profit animate-pulse" />
                  )}
                </div>

                <div className="flex-grow space-y-4 mb-12">
                  <h3 className="text-2xl font-display font-bold uppercase leading-tight group-hover:text-accent transition-colors">
                    {phase.name}
                  </h3>
                  <p className="text-text-tertiary text-xs font-mono uppercase tracking-widest leading-none">
                    {phase.subtitle}
                  </p>
                  <p className="text-text-secondary text-sm leading-relaxed line-clamp-3">
                    {phase.description}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-8 border-t border-border-slate/50">
                  <div className="flex items-center gap-4 text-[10px] font-mono text-text-tertiary uppercase tracking-widest">
                    <span className="flex items-center gap-1"><Play className="w-3 h-3" /> {phase.modules} Modules</span>
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {phase.duration}</span>
                  </div>
                  {!isLocked && (
                    <span className="text-[10px] font-bold uppercase tracking-widest text-accent group-hover:translate-x-1 transition-transform">
                      Continue →
                    </span>
                  )}
                </div>
              </Link>
            );
          })}
        </div>

        {/* Support Section */}
        <div className="mt-32 p-12 bg-background-elevated border border-border-slate flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-4 max-w-xl">
            <h4 className="text-2xl font-display font-bold uppercase">Stuck in a Drawdown?</h4>
            <p className="text-text-secondary text-sm leading-relaxed">
              Don't trade alone. Join our community Discord to discuss lessons, share analysis, and get direct feedback from senior traders.
            </p>
          </div>
          <button className="px-12 py-5 bg-background-surface border border-border-slate hover:border-accent hover:text-accent text-[10px] font-bold uppercase tracking-widest transition-all">
            Join the Discord
          </button>
        </div>
      </div>
    </div>
  );
}

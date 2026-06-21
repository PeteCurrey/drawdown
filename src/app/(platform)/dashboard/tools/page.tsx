"use client";

import { useState, useEffect } from "react";
import { 
  Wrench, 
  BarChart3, 
  Percent, 
  LayoutDashboard, 
  History, 
  Cpu, 
  ArrowRight,
  Zap,
  Lock,
  ExternalLink
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";

interface ToolDef {
  slug: string;
  title: string;
  description: string;
  icon: any;
  minTier: 'free' | 'foundation' | 'edge' | 'floor';
  color: string;
}

const appTools: ToolDef[] = [
  {
    slug: "intelligence",
    title: "Intelligence Hub",
    description: "Follow the flows of insiders and politicians.",
    icon: Cpu,
    minTier: "edge",
    color: "accent"
  },
  {
    slug: "journal",
    title: "AI Trade Journal",
    description: "Launch your institutional logging suite.",
    icon: LayoutDashboard,
    minTier: "foundation",
    color: "accent"
  },
  {
    slug: "position-sizer",
    title: "Position Sizer",
    description: "Multi-asset position sizer & drawdown engine.",
    icon: Percent,
    minTier: "free",
    color: "profit"
  },
  {
    slug: "technical-scanner",
    title: "Technical Scanner",
    description: "Live cross-asset technical consensus.",
    icon: Zap,
    minTier: "foundation",
    color: "premium"
  },
  {
    slug: "backtester",
    title: "Backtest Engine",
    description: "Systematic strategy validation lab.",
    icon: History,
    minTier: "edge",
    color: "accent"
  },
  {
    slug: "charts",
    title: "Drawdown Charts",
    description: "High-performance charting terminal.",
    icon: BarChart3,
    minTier: "foundation",
    color: "accent"
  }
];

export default function AppToolsHub() {
  const [userTier, setUserTier] = useState<'free' | 'foundation' | 'edge' | 'floor'>('free');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getTier() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('subscription_tier')
          .eq('id', user.id)
          .single();
        
        const tier = (profile as any)?.subscription_tier;
        if (tier) {
          setUserTier(tier as any);
        }
      }
      setLoading(false);
    }
    getTier();
  }, []);

  const tierWeight = { free: 0, foundation: 1, edge: 2, floor: 3 };

  return (
    <div className="space-y-12 fade-in">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-border-slate/50 pb-8">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-accent">
            <Wrench className="w-4 h-4" />
            <span className="text-[10px] font-mono uppercase tracking-[0.3em]">Institutional_Tools</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-extrabold uppercase tracking-tight">
            Tool <span className="text-accent">Hub.</span>
          </h1>
        </div>
        <p className="text-sm text-text-tertiary font-mono uppercase tracking-widest max-w-sm text-right">
          Proprietary analytics and execution support for <span className="text-text-primary underline decoration-accent underline-offset-4 font-bold">{userTier}</span> verified traders.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {appTools.map((tool) => {
          const Icon = tool.icon;
          const isLocked = tierWeight[userTier] < tierWeight[tool.minTier];

          return (
            <div 
              key={tool.slug} 
              className={cn(
                "group p-8 bg-background-surface border rounded-xl transition-all duration-300 relative overflow-hidden flex flex-col justify-between",
                isLocked 
                  ? "border-border-slate/50 opacity-70" 
                  : "border-border-slate/80 hover:border-accent/40 hover:bg-background-surface hover:shadow-[0_8px_32px_rgba(0,0,0,0.06)] hover:-translate-y-0.5"
              )}
            >
              <div>
                <div className="flex justify-between items-start mb-6">
                  <div className={cn(
                    "p-3 rounded-lg border transition-all duration-500",
                    isLocked ? "border-border-slate bg-background-primary grayscale" : "border-accent/20 bg-accent/5 group-hover:scale-110 group-hover:border-accent/50"
                  )}>
                    <Icon className={cn("w-6 h-6", isLocked ? "text-text-tertiary" : "text-accent")} />
                  </div>
                  {isLocked ? (
                    <div className="flex items-center gap-1.5 px-2 py-1 bg-background-primary border border-border-slate rounded-md">
                       <Lock className="w-2.5 h-2.5 text-text-tertiary" />
                       <span className="text-[8px] font-mono text-text-tertiary uppercase">{tool.minTier}+ Required</span>
                    </div>
                  ) : (
                    <div className="px-2 py-1 bg-profit/10 border border-profit/20 rounded-md">
                       <span className="text-[8px] font-mono text-profit uppercase font-bold">Access Verified</span>
                    </div>
                  )}
                </div>

                <div className="space-y-1 mb-8">
                  <h3 className="text-xl font-display font-bold uppercase tracking-tight text-text-primary">
                    {tool.title}
                  </h3>
                  <p className="text-[10px] font-mono text-text-tertiary uppercase tracking-widest leading-relaxed">
                    {tool.description}
                  </p>
                </div>
              </div>

              <div>
                {loading ? (
                  <div className="w-full h-[50px] bg-background-primary animate-pulse rounded-lg" />
                ) : isLocked ? (
                  <Link 
                    href="/pricing"
                    className="flex items-center justify-between w-full px-5 py-3.5 bg-background-primary border border-border-slate text-[10px] font-bold uppercase tracking-widest text-text-secondary hover:text-[#0A0A0A] hover:border-[#0A0A0A] transition-colors rounded-lg"
                  >
                     Unlock with {tool.minTier} <ExternalLink className="w-3.5 h-3.5" />
                   </Link>
                ) : (
                  <Link 
                    href={tool.slug === 'intelligence' ? '/dashboard/intelligence' : `/dashboard/tools/${tool.slug}`}
                    className="flex items-center justify-between w-full px-5 py-3.5 bg-[#0A0A0A] hover:bg-neutral-800 text-white text-[10px] font-bold uppercase tracking-[0.2em] transition-all rounded-lg"
                  >
                     Launch Module <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                  </Link>
                )}
              </div>

              {/* Aesthetic background indicator */}
              <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none group-hover:opacity-10 transition-opacity">
                 <Icon className="w-24 h-24 text-accent" />
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-20 p-8 border-l-2 border-accent bg-accent/5 rounded-r-lg space-y-4">
         <h4 className="text-sm font-display font-bold uppercase tracking-widest text-accent">Deployment Update</h4>
         <p className="text-xs text-text-secondary leading-relaxed max-w-2xl">
            You are currently on version <span className="text-text-primary font-mono font-bold">v4.5.1</span>. All modules are now running on live sessional data with Pete's technical consensus active.
         </p>
      </div>
    </div>
  );
}

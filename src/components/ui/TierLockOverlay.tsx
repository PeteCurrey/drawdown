"use client";

import { Lock, Zap, ArrowRight, ShieldCheck, X } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface TierLockOverlayProps {
  requiredTier: "foundation" | "edge" | "floor";
  featureName: string;
  description?: string;
  className?: string;
  onClose?: () => void;
}

const tierContent = {
  foundation: {
    color: "text-accent",
    bgColor: "bg-accent/10",
    borderColor: "border-accent/20",
    benefits: ["Core Curriculum Access", "Strategy Library", "Daily Market Briefs"]
  },
  edge: {
    color: "text-premium",
    bgColor: "bg-premium/10",
    borderColor: "border-premium/20",
    benefits: ["AI Chart Intelligence", "Deep Emotional Analytics", "Priority Support"]
  },
  floor: {
    color: "text-white",
    bgColor: "bg-background-elevated",
    borderColor: "border-border-slate",
    benefits: ["Full AI Integration", "Portfolio Management", "Direct Admin Access"]
  }
};

export function TierLockOverlay({ requiredTier, featureName, description, className, onClose }: TierLockOverlayProps) {
  const content = tierContent[requiredTier];

  return (
    <div className={cn(
      "absolute inset-0 z-50 flex items-center justify-center p-8 bg-background-primary/60 backdrop-blur-sm animate-in fade-in duration-500",
      className
    )}>
      <div className="max-w-md w-full bg-background-surface border border-border-slate p-8 md:p-10 shadow-2xl relative overflow-hidden group">
        {/* Background Accent */}
        <div className={cn("absolute -top-24 -right-24 w-48 h-48 rounded-full blur-3xl opacity-20 transition-all group-hover:opacity-30", content.bgColor)} />
        
        {onClose && (
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-text-tertiary hover:text-text-primary z-20 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        <div className="relative z-10 space-y-8 text-center">
          <div className={cn("w-16 h-16 mx-auto flex items-center justify-center rounded-2xl border transition-transform group-hover:scale-110", content.bgColor, content.borderColor)}>
            <Lock className={cn("w-8 h-8", content.color)} />
          </div>

          <div className="space-y-3">
            <h3 className="text-2xl font-display font-bold uppercase tracking-tight">
              Unlock {featureName}
            </h3>
            <p className="text-xs text-text-secondary leading-relaxed uppercase tracking-widest font-mono">
              {description || `This high-performance tool requires the ${requiredTier} tier to process data loops.`}
            </p>
          </div>

          <div className="space-y-4 pt-4">
            <div className="space-y-2">
              {content.benefits.map((benefit, i) => (
                <div key={i} className="flex items-center gap-2 justify-center text-[10px] font-bold uppercase tracking-widest text-text-tertiary">
                  <ShieldCheck className={cn("w-3 h-3", content.color)} />
                  {benefit}
                </div>
              ))}
            </div>

            <Link 
              href="/pricing"
              className={cn(
                "w-full py-4 px-8 inline-flex items-center justify-center gap-2 text-[10px] font-bold uppercase tracking-widest transition-all hover:translate-x-1",
                requiredTier === 'edge' ? "bg-premium text-background-primary hover:bg-premium-hover" : "bg-accent text-background-primary hover:bg-accent-hover"
              )}
            >
              Upgrade to {requiredTier} <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

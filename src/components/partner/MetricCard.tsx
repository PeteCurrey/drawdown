"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  icon: LucideIcon;
  subValue?: string;
}

export function MetricCard({ 
  title, 
  value, 
  change, 
  changeType = "neutral", 
  icon: Icon,
  subValue 
}: MetricCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const valueRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (cardRef.current) {
      gsap.fromTo(cardRef.current, 
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" }
      );
    }
  }, []);

  return (
    <div 
      ref={cardRef}
      className="bg-background-surface border border-border-slate p-6 hover:border-text-tertiary transition-premium group"
    >
      <div className="flex justify-between items-start mb-4">
        <div className="p-2 bg-background-elevated rounded-sm group-hover:bg-accent/10 group-hover:text-accent transition-colors">
          <Icon className="w-5 h-5" />
        </div>
        {change && (
          <span className={cn(
            "text-[10px] font-mono font-bold uppercase tracking-widest px-2 py-0.5",
            changeType === "positive" ? "text-profit bg-profit/10" : 
            changeType === "negative" ? "text-loss bg-loss/10" : 
            "text-text-tertiary bg-background-elevated"
          )}>
            {changeType === "positive" ? "+" : ""}{change}
          </span>
        )}
      </div>

      <div className="space-y-1">
        <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-text-tertiary">{title}</p>
        <div className="flex items-baseline gap-2">
          <span ref={valueRef} className="text-3xl font-display font-bold text-text-primary">
            {value}
          </span>
          {subValue && (
            <span className="text-[10px] font-mono text-text-tertiary uppercase">
              / {subValue}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

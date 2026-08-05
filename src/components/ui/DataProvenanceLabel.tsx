"use client";

import { cn } from "@/lib/utils";

interface DataProvenanceLabelProps {
  provider: string;
  delayDescription: string;
  status?: "live" | "delayed" | "cached" | "unavailable";
  className?: string;
}

const STATUS_CONFIG = {
  live:        { dot: "bg-emerald-500 animate-pulse", label: "LIVE",        text: "text-emerald-600" },
  delayed:     { dot: "bg-amber-400",                 label: "DELAYED",      text: "text-amber-600"  },
  cached:      { dot: "bg-blue-400",                  label: "CACHED",       text: "text-blue-600"   },
  unavailable: { dot: "bg-red-400",                   label: "UNAVAILABLE",  text: "text-red-500"    },
};

/**
 * DataProvenanceLabel
 * 
 * Every market widget that displays external data must show:
 * 1. Who provides the data (provider name)
 * 2. What delay is expected
 * 3. The current stream status
 * 
 * This satisfies the platform rule:
 * "Every market widget must show its source, delay, and current status."
 */
export function DataProvenanceLabel({
  provider,
  delayDescription,
  status = "delayed",
  className,
}: DataProvenanceLabelProps) {
  const cfg = STATUS_CONFIG[status];

  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 px-2 py-1 rounded bg-[#F4F4F0] border border-[#EDEDED]",
        className
      )}
      title={`Data source: ${provider} — ${delayDescription}`}
    >
      <span className={cn("w-1.5 h-1.5 rounded-full shrink-0", cfg.dot)} />
      <span className="text-[9px] font-mono text-[#888880] uppercase tracking-wider">
        {provider}
      </span>
      <span className="text-[9px] font-mono text-[#AAAAAA]">·</span>
      <span className={cn("text-[9px] font-mono font-bold uppercase tracking-wider", cfg.text)}>
        {cfg.label}
      </span>
      <span className="text-[9px] font-mono text-[#AAAAAA]">·</span>
      <span className="text-[9px] font-mono text-[#888880]">
        {delayDescription}
      </span>
    </div>
  );
}

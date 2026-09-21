import { ShieldAlert } from "lucide-react";
import { cn } from "@/lib/utils";

interface LobbyEmptyStateProps {
  title?: string;
  description?: string;
  badge?: string;
  scanTime?: string;
  statusLabel?: string;
  className?: string;
}

export function LobbyEmptyState({
  title = "NO STORIES PUBLISHED YET",
  description = "Drawdown verified editorial desk has recorded no published stories in this section. Real events and audits will appear here once verified.",
  badge = "AWAITING EDITORIAL DISPATCH",
  scanTime,
  statusLabel,
  className
}: LobbyEmptyStateProps) {
  return (
    <div 
      className={cn(
        "w-full border border-dashed border-[#DEDDD8] bg-[#FAF9F5]/60 p-8 sm:p-12 text-center rounded-[2px] transition-colors",
        className
      )}
    >
      <div className="max-w-md mx-auto flex flex-col items-center">
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-mono tracking-[0.16em] uppercase text-[#4B5157] bg-[#FFFFFF] border border-[#DEDDD8] rounded-[2px] mb-4">
          <ShieldAlert className="w-3 h-3 text-[#4B5157]" />
          {badge}
        </span>
        
        <h3 className="text-base sm:text-lg font-display font-semibold tracking-[-0.01em] text-[#0B0E12] uppercase mb-2">
          {title}
        </h3>
        
        <p className="text-xs sm:text-sm text-[#4B5157] font-sans leading-relaxed">
          {description}
        </p>

        {(statusLabel || scanTime) && (
          <div className="mt-4 pt-3 border-t border-[#DEDDD8]/60 flex items-center gap-3 text-[10px] font-mono uppercase tracking-wider text-[#4B5157]">
            {statusLabel && <span className="text-[#16213E] font-semibold">{statusLabel}</span>}
            {statusLabel && scanTime && <span>•</span>}
            {scanTime && <span>LAST SCAN: {scanTime}</span>}
          </div>
        )}
      </div>
    </div>
  );
}

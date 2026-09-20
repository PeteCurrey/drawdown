import { Eye } from "lucide-react";
import { LobbyEmptyState } from "./LobbyEmptyState";
import type { LobbyWatchlistItem } from "@/types/lobby";

interface LobbyWatchlistProps {
  items?: LobbyWatchlistItem[];
}

export function LobbyWatchlist({ items = [] }: LobbyWatchlistProps) {
  const hasItems = items.length > 0;

  return (
    <section id="watchlist" className="w-full py-10 border-b border-[#DEDDD8] bg-[#FFFFFF]">
      <div className="max-w-[1320px] mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="flex items-center justify-between pb-3 mb-6 border-b border-[#DEDDD8]">
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4 text-[#16213E]" />
            <h2 className="text-xs font-mono font-bold uppercase tracking-[0.16em] text-[#0B0E12]">
              WHAT&apos;S WORTH WATCHING // EDITORIAL SURVEILLANCE
            </h2>
          </div>
          <span className="text-[10px] font-mono text-[#4B5157] tracking-wider uppercase">
            EXPLANATORY BRIEFS
          </span>
        </div>

        {!hasItems ? (
          <LobbyEmptyState
            title="NO WATCHLIST ITEMS PUBLISHED"
            description="The editorial watch desk curates specific instruments, spread behaviours, and policy shifts worthy of professional trader attention. No active items are flagged today."
            badge="WATCHLIST PASSIVE"
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item, i) => (
              <div 
                key={i} 
                className="border border-[#DEDDD8] bg-[#FFFFFF] p-6 rounded-[2px] flex flex-col justify-between"
              >
                <div>
                  <div className="text-[9px] font-mono uppercase tracking-[0.2em] text-[#16213E] font-bold mb-1">
                    ITEM #{i + 1}
                  </div>
                  <h3 className="text-lg font-display font-bold text-[#0B0E12] leading-tight mb-4">
                    {item.what}
                  </h3>

                  <div className="space-y-3 text-xs font-sans">
                    <div>
                      <span className="font-mono text-[10px] uppercase tracking-wider text-[#4B5157] block mb-0.5">
                        WHY IT MATTERS
                      </span>
                      <p className="text-[#0B0E12] leading-relaxed">
                        {item.why_it_matters}
                      </p>
                    </div>

                    <div>
                      <span className="font-mono text-[10px] uppercase tracking-wider text-[#4B5157] block mb-0.5">
                        TIMING / HORIZON
                      </span>
                      <p className="text-[#4B5157] font-mono text-[11px]">
                        {item.when}
                      </p>
                    </div>
                  </div>
                </div>

                {item.related_content && (
                  <div className="mt-4 pt-3 border-t border-[#DEDDD8]/60 text-[10px] font-mono text-[#16213E]">
                    <span className="text-[#4B5157]">Ref:</span> {item.related_content}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

import Link from "next/link";
import { Briefcase, ArrowRight } from "lucide-react";
import { LobbyEmptyState } from "./LobbyEmptyState";
import type { LobbyPropFirmWatchData } from "@/types/lobby";
import { DRAWDOWN_ENTITIES } from "@/lib/lobby";

interface LobbyPropFirmWatchProps {
  entries?: LobbyPropFirmWatchData[];
}

export function LobbyPropFirmWatch({ entries = [] }: LobbyPropFirmWatchProps) {
  const hasEntries = entries.length > 0;

  return (
    <section id="prop-firms" className="w-full py-10 border-b border-[#DEDDD8] bg-[#FAF9F5]">
      <div className="max-w-[1320px] mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="flex items-center justify-between pb-3 mb-6 border-b border-[#DEDDD8]">
          <div className="flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-[#16213E]" />
            <h2 className="text-xs font-mono font-bold uppercase tracking-[0.16em] text-[#0B0E12]">
              PROP FIRM WATCH // EVALUATION RULES &amp; PAYOUT AUDITS
            </h2>
          </div>
          <span className="text-[10px] font-mono text-[#4B5157] tracking-wider uppercase">
            FACTUAL TRACKER
          </span>
        </div>

        {!hasEntries ? (
          <LobbyEmptyState
            title="NO PROP FIRM RULE REVISIONS RECORDED"
            description="Drawdown tracks evaluation drawdowns, consistency rules, payout intervals, and platform migrations across funded trading firms. No rule updates recorded this cycle."
            badge="FUNDING RULES MONITORED"
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {entries.map((item, idx) => {
              const propEntity = item.prop_firm_slug ? DRAWDOWN_ENTITIES[item.prop_firm_slug] : null;

              return (
                <article 
                  key={idx} 
                  className="border border-[#DEDDD8] bg-[#FFFFFF] p-6 rounded-[2px] flex flex-col justify-between hover:border-[#16213E] transition-colors"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-mono font-bold text-[#16213E] uppercase tracking-wider">
                        {item.company}
                      </span>
                      <span className="text-[10px] font-mono text-[#4B5157]">
                        Eff: {item.effective_date}
                      </span>
                    </div>

                    <h3 className="text-base font-display font-bold text-[#0B0E12] leading-snug mb-3">
                      {item.change_update}
                    </h3>

                    {/* Factual Previous State vs Current State Comparison */}
                    <div className="grid grid-cols-2 gap-3 p-3 bg-[#FAF9F5] border border-[#DEDDD8] rounded-[2px] mb-4">
                      <div>
                        <span className="text-[9px] font-mono uppercase text-[#4B5157] block mb-0.5">
                          PREVIOUS STATE
                        </span>
                        <p className="text-xs font-mono text-[#4B5157] line-through">
                          {item.previous_state}
                        </p>
                      </div>
                      <div>
                        <span className="text-[9px] font-mono uppercase text-[#16213E] font-bold block mb-0.5">
                          CURRENT STATE
                        </span>
                        <p className="text-xs font-mono text-[#0B0E12] font-semibold">
                          {item.current_state}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-[#DEDDD8]/60 flex items-center justify-between text-[11px] font-mono">
                    <span className="text-[#4B5157] truncate max-w-[170px]">
                      Source: {item.source_citation}
                    </span>
                    {propEntity && (
                      <Link 
                        href={propEntity.href}
                        className="inline-flex items-center gap-1 text-[#16213E] font-semibold hover:underline"
                      >
                        Review <ArrowRight className="w-3 h-3" />
                      </Link>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

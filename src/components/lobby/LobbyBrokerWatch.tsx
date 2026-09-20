import Link from "next/link";
import { Building2, ExternalLink } from "lucide-react";
import { LobbyEmptyState } from "./LobbyEmptyState";
import type { LobbyBrokerWatchData } from "@/types/lobby";
import { DRAWDOWN_ENTITIES } from "@/lib/lobby-constants";

interface LobbyBrokerWatchProps {
  entries?: LobbyBrokerWatchData[];
}

export function LobbyBrokerWatch({ entries = [] }: LobbyBrokerWatchProps) {
  const hasEntries = entries.length > 0;

  return (
    <section id="brokers" className="w-full py-10 border-b border-[#DEDDD8] bg-[#FFFFFF]">
      <div className="max-w-[1320px] mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="flex items-center justify-between pb-3 mb-6 border-b border-[#DEDDD8]">
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-[#16213E]" />
            <h2 className="text-xs font-mono font-bold uppercase tracking-[0.16em] text-[#0B0E12]">
              BROKER WATCH // REGULATION &amp; EXECUTION DESK
            </h2>
          </div>
          <span className="text-[10px] font-mono text-[#4B5157] tracking-wider uppercase">
            EVIDENCE-VERIFIED DEVELOPMENTS
          </span>
        </div>

        {!hasEntries ? (
          <LobbyEmptyState
            title="NO BROKER DEVELOPMENTS RECORDED"
            description="Drawdown maintains active surveillance over FCA, ASIC, CySEC and tier-1 regulated broker terms, fee schedules, and platform offerings. No verified changes reported in the current cycle."
            badge="BROKER REGISTRY CURRENT"
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {entries.map((item, idx) => {
              const brokerEntity = item.broker_slug ? DRAWDOWN_ENTITIES[item.broker_slug] : null;

              return (
                <article 
                  key={idx} 
                  className="border border-[#DEDDD8] bg-[#FFFFFF] p-6 rounded-[2px] flex flex-col justify-between group hover:border-[#16213E] transition-colors"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-mono font-bold text-[#16213E] uppercase tracking-wider">
                        {item.broker_name}
                      </span>
                      <span className="text-[10px] font-mono text-[#4B5157]">
                        {item.effective_date}
                      </span>
                    </div>

                    <h3 className="text-base font-display font-bold text-[#0B0E12] leading-snug mb-3">
                      {item.story_headline}
                    </h3>

                    <div className="bg-[#FAF9F5] p-3 border-l-2 border-[#16213E] rounded-[1px] text-xs font-sans text-[#4B5157] leading-relaxed mb-4">
                      <span className="font-mono text-[9px] uppercase tracking-wider text-[#0B0E12] block mb-0.5 font-semibold">
                        WHAT CHANGED:
                      </span>
                      {item.what_changed}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-[#DEDDD8]/60 flex items-center justify-between text-[11px] font-mono">
                    <span className="text-[#4B5157] truncate max-w-[160px]">
                      Source: {item.source_citation}
                    </span>
                    {brokerEntity && (
                      <Link 
                        href={brokerEntity.href}
                        className="inline-flex items-center gap-1 text-[#16213E] font-semibold hover:underline"
                      >
                        Profile <ExternalLink className="w-3 h-3" />
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

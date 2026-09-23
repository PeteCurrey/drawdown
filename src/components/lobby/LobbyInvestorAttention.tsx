import React from "react";
import Link from "next/link";
import { ExternalLink, ShieldCheck, MessageSquare, AlertCircle } from "lucide-react";
import type { InvestorAttentionItem } from "@/lib/lobby";

interface Props {
  items: InvestorAttentionItem[];
}

export function LobbyInvestorAttention({ items }: Props) {
  // Hard Rule 18 & 22: Do not display mock posts or fake feed if no real data is approved
  if (!items || items.length === 0) {
    return null;
  }

  return (
    <section className="border-t-2 border-[#0B0E12] pt-8 pb-12 bg-[#FAFAFA]">
      <div className="max-w-[1320px] mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-[#E5E5E5] mb-8">
          <div>
            <span className="font-mono text-[10px] uppercase tracking-widest text-[#737373] block mb-1">
              // INVESTOR ATTENTION // MONITORED EXTERNAL SOURCES
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-[#0B0E12]">
              What Monitored Accounts &amp; Desks Are Highlighting
            </h2>
            <p className="text-xs text-[#525252] mt-1 max-w-2xl">
              Systematic surveillance of approved external investor and analyst accounts. Clear demarcation between source assertions and independently verified data.
            </p>
          </div>

          <div className="flex items-center gap-2 text-[11px] font-mono text-[#525252] shrink-0">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Monitored Intelligence Live</span>
          </div>
        </div>

        {/* Intelligence Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => {
            const hasVerifiedFacts = item.verified_facts && item.verified_facts.length > 0;
            const timeAgo = getTimeAgo(item.discovered_at || item.published_at);

            return (
              <div 
                key={item.id}
                className="bg-white border border-[#E5E5E5] rounded-xl p-5 shadow-sm flex flex-col justify-between hover:border-[#0B0E12] transition-colors"
              >
                <div>
                  {/* Card Header: Source & Entity Badges */}
                  <div className="flex items-center justify-between gap-2 mb-3 pb-3 border-b border-[#F5F5F5]">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono font-bold uppercase bg-[#F3E8FF] text-[#6B21A8] px-2 py-0.5 rounded">
                        {item.author_handle ? `@${item.author_handle}` : item.source}
                      </span>
                      {item.related_symbols && item.related_symbols.length > 0 && (
                        <div className="flex gap-1">
                          {item.related_symbols.slice(0, 2).map((sym, idx) => (
                            <span key={idx} className="text-[10px] font-mono font-bold bg-[#F5F5F5] text-[#171717] px-1.5 py-0.5 rounded">
                              ${sym}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <span className="text-[10px] font-mono text-[#A3A3A3]">
                      {timeAgo}
                    </span>
                  </div>

                  {/* Headline */}
                  <h3 className="font-serif font-bold text-base text-[#0B0E12] mb-3 leading-snug">
                    {item.title}
                  </h3>

                  {/* 1. SOURCE CLAIM */}
                  <div className="mb-4 bg-[#FAF5FF] border-l-2 border-[#9333EA] p-3 rounded-r">
                    <span className="font-mono text-[9px] uppercase tracking-wider font-bold text-[#7E22CE] block mb-1 flex items-center gap-1">
                      <MessageSquare className="w-3 h-3" /> Source Assertion (Unverified Claim)
                    </span>
                    <p className="text-xs text-[#3B0764] italic leading-relaxed">
                      &ldquo;{item.source_claim || item.title}&rdquo;
                    </p>
                  </div>

                  {/* 2. VERIFIED FACTS (If available) */}
                  {hasVerifiedFacts ? (
                    <div className="mb-4 bg-[#F0FDF4] border-l-2 border-[#16A34A] p-3 rounded-r">
                      <span className="font-mono text-[9px] uppercase tracking-wider font-bold text-[#15803D] block mb-1 flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3" /> Verified Market Facts
                      </span>
                      <ul className="space-y-1">
                        {item.verified_facts?.slice(0, 2).map((fact, idx) => (
                          <li key={idx} className="text-[11px] text-[#14532D]">
                            • {fact.claim}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : (
                    <div className="mb-4 bg-[#FAFAFA] border border-[#E5E5E5] p-2.5 rounded text-[11px] text-[#737373] flex items-center gap-1.5">
                      <AlertCircle className="w-3 h-3 text-[#A3A3A3] shrink-0" />
                      <span>No independent primary filing corroboration attached yet.</span>
                    </div>
                  )}

                  {/* 3. DRAWDOWN CONTEXT */}
                  {item.drawdown_interpretation && (
                    <div className="mb-4">
                      <span className="font-mono text-[9px] uppercase tracking-wider font-bold text-[#525252] block mb-1">
                        Drawdown Context
                      </span>
                      <p className="text-xs text-[#404040] leading-relaxed">
                        {item.drawdown_interpretation}
                      </p>
                    </div>
                  )}
                </div>

                {/* Footer Link & Disclaimer */}
                <div className="pt-3 border-t border-[#F5F5F5] flex items-center justify-between gap-2 mt-2">
                  <span className="text-[9px] font-mono text-[#A3A3A3]">
                    Source opinion; not advice.
                  </span>
                  <a
                    href={item.source_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-mono font-bold text-[#2563EB] hover:underline flex items-center gap-1"
                  >
                    View Original <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function getTimeAgo(dateStr?: string | null): string {
  if (!dateStr) return "recent";
  const ms = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(ms / (1000 * 60));
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

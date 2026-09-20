import Link from "next/link";
import { Terminal, Cpu, ArrowUpRight } from "lucide-react";
import { LobbyEmptyState } from "./LobbyEmptyState";
import type { LobbyArticle } from "@/types/lobby";
import { categoryToSlug } from "@/lib/lobby-constants";

interface LobbyPlatformSpotlightProps {
  article: LobbyArticle | null;
}

export function LobbyPlatformSpotlight({ article }: LobbyPlatformSpotlightProps) {
  return (
    <section id="platforms" className="w-full py-10 border-b border-[#DEDDD8] bg-[#FFFFFF]">
      <div className="max-w-[1320px] mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="flex items-center justify-between pb-3 mb-6 border-b border-[#DEDDD8]">
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-[#16213E]" />
            <h2 className="text-xs font-mono font-bold uppercase tracking-[0.16em] text-[#0B0E12]">
              PLATFORM SPOTLIGHT // EXECUTION &amp; TOOLING ARCHITECTURE
            </h2>
          </div>
          <span className="text-[10px] font-mono text-[#4B5157] tracking-wider uppercase">
            TRADING TECH
          </span>
        </div>

        {!article ? (
          <LobbyEmptyState
            title="NO PLATFORM SPOTLIGHT PUBLISHED"
            description="Our trading technology desk investigates charting frameworks, FIX APIs, latency optimisations, and algorithmic engines. No platform feature published in this issue."
            badge="TECH RADAR ACTIVE"
          />
        ) : (
          <div className="border border-[#DEDDD8] bg-[#FAF9F5] p-6 sm:p-10 rounded-[2px] grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8">
              <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-[#16213E] font-bold mb-2">
                <Terminal className="w-3.5 h-3.5" />
                <span>PLATFORM REVIEW // {article.category}</span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-display font-bold text-[#0B0E12] tracking-tight leading-tight">
                {article.title}
              </h3>

              <p className="mt-3 text-sm sm:text-base text-[#4B5157] font-sans leading-relaxed line-clamp-3">
                {article.excerpt}
              </p>

              <div className="mt-6 flex items-center gap-4">
                <Link
                  href={`/lobby/${categoryToSlug(article.category)}/${article.slug}`}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#16213E] text-[#FFFFFF] text-xs font-mono uppercase tracking-wider rounded-[2px] hover:bg-[#0B0E12] transition-colors"
                >
                  Read Architecture Breakdown <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            <div className="lg:col-span-4 border-t lg:border-t-0 lg:border-l border-[#DEDDD8] lg:pl-8 pt-6 lg:pt-0">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#4B5157] block mb-2">
                SPECIFICATIONS AUDITED
              </span>
              <ul className="space-y-2 text-xs font-mono text-[#0B0E12]">
                <li className="flex items-center justify-between py-1 border-b border-[#DEDDD8]/60">
                  <span className="text-[#4B5157]">Desk:</span>
                  <span>Trading Technology</span>
                </li>
                <li className="flex items-center justify-between py-1 border-b border-[#DEDDD8]/60">
                  <span className="text-[#4B5157]">Data Confidence:</span>
                  <span className="text-emerald-700 font-semibold">{article.confidence}</span>
                </li>
                <li className="flex items-center justify-between py-1 border-b border-[#DEDDD8]/60">
                  <span className="text-[#4B5157]">Reading Time:</span>
                  <span>{article.reading_time_minutes} Mins</span>
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

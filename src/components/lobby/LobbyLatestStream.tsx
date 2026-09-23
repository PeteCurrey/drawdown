"use client";

import { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import type { LobbyArticle, LobbyCategory } from "@/types/lobby";
import { categoryToSlug } from "@/lib/lobby-constants";
import { LobbyEmptyState } from "./LobbyEmptyState";
import { Clock, ArrowUpRight } from "lucide-react";
import { getEditorialFreshness, formatArchiveDate } from "@/lib/lobby-freshness";

interface LobbyLatestStreamProps {
  initialArticles?: LobbyArticle[];
}

const FILTER_TABS = [
  "All",
  "Markets",
  "Brokers",
  "Prop Firms",
  "Platforms",
  "Macro",
  "Regulation",
  "Technology",
  "Education"
] as const;

export function LobbyLatestStream({ initialArticles = [] }: LobbyLatestStreamProps) {
  const [activeFilter, setActiveFilter] = useState<string>("All");

  const filteredArticles = initialArticles.filter((article) => {
    if (activeFilter === "All") return true;
    if (activeFilter === "Technology") {
      return article.category === "TRADING TECHNOLOGY" || article.category === "PLATFORMS";
    }
    return article.category.toLowerCase() === activeFilter.toLowerCase();
  });

  return (
    <section id="latest" className="w-full py-12 bg-[#FFFFFF]">
      <div className="max-w-[1320px] mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between pb-4 mb-6 border-b-2 border-[#0B0E12] gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-display font-bold text-[#0B0E12] tracking-tight">
              LATEST STORIES // THE LOBBY DISPATCH
            </h2>
            <p className="text-xs sm:text-sm text-[#4B5157] font-sans mt-1">
              Chronological reporting and verifiable intelligence across the trading industry.
            </p>
          </div>

          <Link 
            href="/lobby/archive"
            className="text-xs font-mono uppercase tracking-wider text-[#16213E] font-bold hover:underline flex items-center gap-1"
          >
            Full Archive <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-3 mb-6">
          {FILTER_TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveFilter(tab)}
              className={cn(
                "px-3 py-1.5 text-xs font-mono uppercase tracking-wider rounded-[2px] transition-colors shrink-0",
                activeFilter === tab
                  ? "bg-[#16213E] text-[#FFFFFF] font-semibold"
                  : "bg-[#FAF9F5] text-[#4B5157] hover:bg-[#F3F2EE] hover:text-[#0B0E12] border border-[#DEDDD8]"
              )}
            >
              {tab}
            </button>
          ))}
        </div>

        {filteredArticles.length === 0 ? (
          <LobbyEmptyState
            title={activeFilter === "All" ? "NO STORIES PUBLISHED" : `NO ${activeFilter.toUpperCase()} STORIES YET`}
            description="Stories meeting Drawdown's verification standards will stream chronologically once approved by our editorial desk."
            badge="CHRONOLOGICAL INDEX"
          />
        ) : (
          <div className="divide-y divide-[#DEDDD8] border-t border-b border-[#DEDDD8]">
            {filteredArticles.map((article, idx) => {
              const categorySlug = categoryToSlug(article.category);
              const freshness = getEditorialFreshness(article.published_at);
              // Archive always shows the true date. Freshness badge is additive — never replaces.
              const pubDate = formatArchiveDate(article.published_at);

              return (
                <article 
                  key={article.id}
                  className="py-6 sm:py-8 grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-8 group hover:bg-[#FAF9F5]/40 transition-colors px-2 rounded-[2px]"
                >
                  <div className="md:col-span-2 text-[11px] font-mono text-[#4B5157] flex md:flex-col justify-between md:justify-start gap-1">
                    <span className="font-bold text-[#16213E] tracking-wider uppercase">
                      {article.category}
                    </span>
                    <time dateTime={article.published_at || ""} className="flex flex-col gap-1">
                      <span>{pubDate}</span>
                      {freshness.label && (
                        <span className={`px-1 py-0.5 rounded-[2px] text-[9px] ${freshness.badgeClass}`}>
                          {freshness.label}
                        </span>
                      )}
                    </time>
                  </div>

                  <div className="md:col-span-8">
                    <h3 className="text-lg sm:text-xl md:text-2xl font-display font-bold text-[#0B0E12] leading-snug group-hover:text-[#16213E] transition-colors">
                      <Link href={`/lobby/${categorySlug}/${article.slug}`}>
                        {article.title}
                      </Link>
                    </h3>
                    <p className="mt-2 text-xs sm:text-sm text-[#4B5157] font-sans leading-relaxed line-clamp-2">
                      {article.excerpt}
                    </p>
                  </div>

                  <div className="md:col-span-2 flex md:flex-col items-center md:items-end justify-between md:justify-center text-[10px] font-mono text-[#4B5157]">
                    <span className="inline-flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {article.reading_time_minutes} min
                    </span>
                    <span className="text-[#0B0E12] font-semibold mt-1 flex items-center gap-1.5">
                      {article.author_name === "Pete Currey" && (
                        <span className="w-4 h-4 rounded-full overflow-hidden inline-block shrink-0">
                          <img src="/images/pete.jpg" alt="Pete Currey" className="w-full h-full object-cover" />
                        </span>
                      )}
                      By {article.author_name}
                    </span>
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

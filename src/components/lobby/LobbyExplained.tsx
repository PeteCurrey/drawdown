import Link from "next/link";
import { HelpCircle, ChevronRight } from "lucide-react";
import { LobbyEmptyState } from "./LobbyEmptyState";
import type { LobbyArticle } from "@/types/lobby";
import { categoryToSlug } from "@/lib/lobby";

interface LobbyExplainedProps {
  articles?: LobbyArticle[];
}

export function LobbyExplained({ articles = [] }: LobbyExplainedProps) {
  const hasArticles = articles.length > 0;

  return (
    <section id="explained" className="w-full py-10 border-b border-[#DEDDD8] bg-[#FAF9F5]">
      <div className="max-w-[1320px] mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="flex items-center justify-between pb-3 mb-6 border-b border-[#DEDDD8]">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-[#16213E]" />
            <h2 className="text-xs font-mono font-bold uppercase tracking-[0.16em] text-[#0B0E12]">
              EXPLAINED // FOUNDATIONAL MARKET MECHANICS
            </h2>
          </div>
          <span className="text-[10px] font-mono text-[#4B5157] tracking-wider uppercase">
            EVERGREEN EDUCATION
          </span>
        </div>

        {!hasArticles ? (
          <LobbyEmptyState
            title="NO EXPLAINER GUIDES PUBLISHED"
            description="Drawdown Explained demystifies market liquidity, margin requirements, spread mechanics, and mathematical edge principles. Evergreen primers will appear here."
            badge="EDUCATION DESK"
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {articles.map((item) => (
              <article 
                key={item.id} 
                className="bg-[#FFFFFF] border border-[#DEDDD8] p-5 rounded-[2px] flex flex-col justify-between group hover:border-[#16213E] transition-colors"
              >
                <div>
                  <span className="text-[9px] font-mono uppercase tracking-[0.16em] text-[#16213E] font-bold block mb-1">
                    EXPLAINER // {item.category}
                  </span>

                  <h3 className="text-base sm:text-lg font-display font-bold text-[#0B0E12] leading-snug group-hover:text-[#16213E] transition-colors">
                    <Link href={`/lobby/${categoryToSlug(item.category)}/${item.slug}`}>
                      {item.title}
                    </Link>
                  </h3>

                  <p className="mt-2 text-xs text-[#4B5157] font-sans leading-relaxed line-clamp-3">
                    {item.excerpt}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-[#DEDDD8]/60 flex items-center justify-between text-[10px] font-mono text-[#4B5157]">
                  <span>{item.reading_time_minutes} min primer</span>
                  <ChevronRight className="w-3.5 h-3.5 text-[#16213E] group-hover:translate-x-0.5 transition-transform" />
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

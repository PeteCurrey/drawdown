import Link from "next/link";
import { BookOpen, ArrowRight } from "lucide-react";
import { LobbyEmptyState } from "./LobbyEmptyState";
import { LobbyImage } from "./LobbyImage";
import type { LobbyArticle } from "@/types/lobby";
import { categoryToSlug, DRAWDOWN_TOOLS } from "@/lib/lobby-constants";

interface LobbyDrawdownDeskProps {
  articles?: LobbyArticle[];
}

export function LobbyDrawdownDesk({ articles = [] }: LobbyDrawdownDeskProps) {
  const hasArticles = articles.length > 0;

  return (
    <section id="drawdown-desk" className="w-full py-10 border-b border-[#DEDDD8] bg-[#FFFFFF]">
      <div className="max-w-[1320px] mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="flex items-center justify-between pb-3 mb-6 border-b border-[#DEDDD8]">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-[#16213E]" />
            <h2 className="text-xs font-mono font-bold uppercase tracking-[0.16em] text-[#0B0E12]">
              DRAWDOWN DESK // ORIGINAL RESEARCH &amp; TOOL DISCOVERY
            </h2>
          </div>
          <span className="text-[10px] font-mono text-[#4B5157] tracking-wider uppercase">
            PROPRIETARY ANALYSIS
          </span>
        </div>

        {!hasArticles ? (
          <LobbyEmptyState
            title="NO DESK INVESTIGATIONS PUBLISHED"
            description="Drawdown original investigations dissect broker spreads, prop firm liquidation thresholds, and mathematical edge models. Original research reports will be published here."
            badge="INVESTIGATIVE DESK"
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {articles.map((article) => {
              const categorySlug = categoryToSlug(article.category);
              const toolKey = article.related_tool_slugs?.[0];
              const connectedTool = toolKey ? DRAWDOWN_TOOLS[toolKey] : null;

              return (
                <article key={article.id} className="flex flex-col justify-between border border-[#DEDDD8] p-6 rounded-[2px] bg-[#FFFFFF] group hover:border-[#16213E] transition-colors">
                  <div>
                    <LobbyImage
                      src={article.hero_image_url}
                      alt={article.hero_image_alt || article.title}
                      category={article.category}
                      headline={article.title}
                      aspectRatio="16/9"
                      className="mb-4"
                    />

                    <span className="text-[10px] font-mono uppercase tracking-wider text-[#16213E] font-bold block mb-1">
                      {article.category}
                    </span>

                    <h3 className="text-xl font-display font-bold text-[#0B0E12] leading-snug group-hover:text-[#16213E] transition-colors">
                      <Link href={`/lobby/${categorySlug}/${article.slug}`}>
                        {article.title}
                      </Link>
                    </h3>

                    <p className="mt-2 text-xs sm:text-sm text-[#4B5157] font-sans leading-relaxed line-clamp-3">
                      {article.excerpt}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-[#DEDDD8]/60 flex flex-col gap-2">
                    {connectedTool && (
                      <Link 
                        href={connectedTool.href}
                        className="inline-flex items-center justify-between text-xs font-mono text-[#16213E] bg-[#FAF9F5] p-2 border border-[#DEDDD8] rounded-[2px] hover:bg-[#FFFFFF] transition-colors"
                      >
                        <span className="truncate">Tool: {connectedTool.name}</span>
                        <ArrowRight className="w-3 h-3 shrink-0 ml-1" />
                      </Link>
                    )}
                    <span className="text-[10px] font-mono text-[#4B5157]">
                      By {article.author_name} • {article.reading_time_minutes} min read
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

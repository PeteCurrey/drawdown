import Link from "next/link";
import { LobbyImage } from "./LobbyImage";
import { LobbyEmptyState } from "./LobbyEmptyState";
import type { LobbyArticle } from "@/types/lobby";
import { categoryToSlug } from "@/lib/lobby-constants";
import { Zap } from "lucide-react";

interface LobbyWhatsHappeningProps {
  articles: LobbyArticle[];
  justInArticles?: LobbyArticle[];
}

export function LobbyWhatsHappening({ 
  articles = [], 
  justInArticles = [] 
}: LobbyWhatsHappeningProps) {
  const hasStories = articles.length > 0;
  const hasJustIn = justInArticles.length > 0;

  // Secondary prominent story vs compact newsroom stories
  const secondaryStory = articles[0] || null;
  const compactStories = articles.slice(1, 4);

  return (
    <section id="whats-happening" className="w-full py-10 border-b border-[#DEDDD8] bg-[#FFFFFF]">
      <div className="max-w-[1320px] mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="flex items-center justify-between pb-3 mb-8 border-b-2 border-[#0B0E12]">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-[#16213E] rounded-[1px]"></span>
            <h2 className="text-sm font-mono font-bold uppercase tracking-[0.16em] text-[#0B0E12]">
              WHAT&apos;S HAPPENING // DESK FEED
            </h2>
          </div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#4B5157]">
            LIVE SURVEILLANCE
          </span>
        </div>

        {/* Dynamic 2-Column Broadsheet Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Main Editorial Feed (8 cols) */}
          <div className="lg:col-span-8">
            {!hasStories ? (
              <LobbyEmptyState
                title="NO FEED STORIES PUBLISHED"
                description="Desk analysts are monitoring markets, broker actions, and regulatory releases. Stories will stream here once verified."
                badge="EDITORIAL FEED ACTIVE"
              />
            ) : (
              <div className="space-y-8">
                {/* Secondary Prominent Feature */}
                {secondaryStory && (
                  <article className="grid grid-cols-1 md:grid-cols-12 gap-6 pb-8 border-b border-[#DEDDD8] group">
                    <div className="md:col-span-5">
                      <Link href={`/lobby/${categoryToSlug(secondaryStory.category)}/${secondaryStory.slug}`}>
                        <LobbyImage
                          src={secondaryStory.hero_image_url}
                          alt={secondaryStory.hero_image_alt || secondaryStory.title}
                          category={secondaryStory.category}
                          headline={secondaryStory.title}
                          aspectRatio="4/3"
                        />
                      </Link>
                    </div>
                    <div className="md:col-span-7 flex flex-col justify-between">
                      <div>
                        <div className="text-[10px] font-mono uppercase tracking-[0.14em] text-[#16213E] font-semibold mb-1.5">
                          {secondaryStory.category}
                        </div>
                        <h3 className="text-xl sm:text-2xl font-display font-bold tracking-[-0.02em] text-[#0B0E12] leading-tight group-hover:text-[#16213E] transition-colors">
                          <Link href={`/lobby/${categoryToSlug(secondaryStory.category)}/${secondaryStory.slug}`}>
                            {secondaryStory.title}
                          </Link>
                        </h3>
                        <p className="mt-2 text-sm text-[#4B5157] font-sans leading-relaxed line-clamp-3">
                          {secondaryStory.excerpt}
                        </p>
                      </div>
                      <div className="mt-4 text-[10px] font-mono text-[#4B5157] flex items-center gap-2">
                        <span>By {secondaryStory.author_name}</span>
                        <span>•</span>
                        <span>{secondaryStory.reading_time_minutes} min read</span>
                      </div>
                    </div>
                  </article>
                )}

                {/* Compact Asymmetric Items */}
                {compactStories.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    {compactStories.map((story) => (
                      <article key={story.id} className="flex flex-col justify-between border-b sm:border-b-0 sm:border-r border-[#DEDDD8] sm:pr-6 last:border-r-0 last:pr-0 pb-6 sm:pb-0 group">
                        <div>
                          <span className="text-[9px] font-mono uppercase tracking-[0.14em] text-[#4B5157] block mb-1">
                            {story.category}
                          </span>
                          <h4 className="text-base font-display font-semibold tracking-tight text-[#0B0E12] leading-snug group-hover:text-[#16213E] transition-colors">
                            <Link href={`/lobby/${categoryToSlug(story.category)}/${story.slug}`}>
                              {story.title}
                            </Link>
                          </h4>
                          <p className="mt-1.5 text-xs text-[#4B5157] font-sans line-clamp-2 leading-normal">
                            {story.excerpt}
                          </p>
                        </div>
                        <div className="mt-3 text-[9px] font-mono text-[#4B5157]">
                          {story.published_at ? new Date(story.published_at).toLocaleDateString("en-GB", { day: 'numeric', month: 'short' }) : "RECENT"}
                        </div>
                      </article>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* "JUST IN" Chronological Stream (4 cols) */}
          <aside className="lg:col-span-4 lg:border-l border-[#DEDDD8] lg:pl-8">
            <div className="flex items-center justify-between pb-2 mb-4 border-b border-[#0B0E12]/40">
              <div className="flex items-center gap-2">
                <Zap className="w-3.5 h-3.5 text-[#B8752E]" />
                <h3 className="text-xs font-mono font-bold uppercase tracking-[0.16em] text-[#0B0E12]">
                  JUST IN // WIRE
                </h3>
              </div>
              <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
            </div>

            {!hasJustIn ? (
              <div className="p-4 border border-dashed border-[#DEDDD8] bg-[#FAF9F5] text-center rounded-[2px]">
                <p className="text-xs font-mono text-[#4B5157] uppercase tracking-wider">
                  No timestamped wire alerts recorded.
                </p>
              </div>
            ) : (
              <ol className="divide-y divide-[#DEDDD8]/70">
                {justInArticles.map((item) => {
                  const timeString = item.published_at
                    ? new Date(item.published_at).toLocaleTimeString("en-GB", {
                        hour: "2-digit",
                        minute: "2-digit"
                      })
                    : "--:--";

                  return (
                    <li key={item.id} className="py-3 first:pt-0 group">
                      <div className="flex items-start gap-3">
                        <time className="text-[11px] font-mono font-bold text-[#16213E] shrink-0 pt-0.5">
                          {timeString}
                        </time>
                        <div className="flex-1 min-w-0">
                          <Link 
                            href={`/lobby/${categoryToSlug(item.category)}/${item.slug}`}
                            className="text-xs sm:text-sm font-sans font-medium text-[#0B0E12] group-hover:text-[#16213E] leading-snug line-clamp-2 block transition-colors"
                          >
                            {item.title}
                          </Link>
                          <span className="text-[9px] font-mono uppercase tracking-wider text-[#4B5157] mt-1 block">
                            {item.category}
                          </span>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ol>
            )}
          </aside>
        </div>
      </div>
    </section>
  );
}

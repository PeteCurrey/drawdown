import Link from "next/link";
import { LobbyImage } from "./LobbyImage";
import { LobbyEmptyState } from "./LobbyEmptyState";
import type { LobbyArticle } from "@/types/lobby";
import { categoryToSlug } from "@/lib/lobby-constants";
import { Clock, ShieldCheck } from "lucide-react";

interface LobbyLeadStoryProps {
  article: LobbyArticle | null;
}

export function LobbyLeadStory({ article }: LobbyLeadStoryProps) {
  if (!article) {
    return (
      <section className="w-full py-8 border-b border-[#DEDDD8]">
        <div className="max-w-[1320px] mx-auto px-4 sm:px-6">
          <LobbyEmptyState
            title="NO LEAD STORY PUBLISHED"
            description="The editorial desk is currently monitoring live market and broker developments. The lead story will be established once verified."
            badge="LEAD INTELLIGENCE DESK"
          />
        </div>
      </section>
    );
  }

  const categorySlug = categoryToSlug(article.category);
  const articleHref = `/lobby/${categorySlug}/${article.slug}`;
  const pubDate = article.published_at 
    ? new Date(article.published_at).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric"
      })
    : "RECENT";

  return (
    <section className="w-full py-8 md:py-12 border-b border-[#DEDDD8] bg-[#FFFFFF]">
      <div className="max-w-[1320px] mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Main Visual Column (7 cols) */}
          <div className="lg:col-span-7">
            <Link href={articleHref} className="block group">
              <LobbyImage
                src={article.hero_image_url}
                alt={article.hero_image_alt || article.title}
                category={article.category}
                headline={article.title}
                aspectRatio="16/9"
                caption={article.hero_image_caption}
                credit={article.hero_image_credit || article.primary_source_name}
                priority={true}
              />
            </Link>
          </div>

          {/* Lead Editorial Copy (5 cols) */}
          <div className="lg:col-span-5 flex flex-col justify-center">
            {/* Meta Kicker & Confidence Badge */}
            <div className="flex flex-wrap items-center gap-3 mb-3 text-[11px] font-mono uppercase tracking-[0.14em]">
              <Link
                href={`/lobby/${categorySlug}`}
                className="text-[#16213E] font-bold hover:underline"
              >
                {article.category}
              </Link>
              <span className="text-[#DEDDD8]">•</span>
              <span className="text-[#4B5157] inline-flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {article.reading_time_minutes} MIN READ
              </span>
              {article.confidence === "VERIFIED" && (
                <>
                  <span className="text-[#DEDDD8]">•</span>
                  <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-[2px]">
                    <ShieldCheck className="w-3 h-3" />
                    VERIFIED
                  </span>
                </>
              )}
            </div>

            {/* Dominant Headline */}
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-display font-black tracking-[-0.03em] text-[#0B0E12] leading-[1.08] hover:text-[#16213E] transition-colors">
              <Link href={articleHref}>
                {article.title}
              </Link>
            </h2>

            {/* Substantive Deck / Excerpt */}
            <p className="mt-4 text-base sm:text-lg text-[#4B5157] font-sans leading-relaxed line-clamp-4">
              {article.excerpt}
            </p>

            {/* Byline & Dateline */}
            <div className="mt-6 pt-4 border-t border-[#DEDDD8] flex items-center justify-between text-[11px] font-mono text-[#4B5157]">
              <div>
                <span className="uppercase tracking-wider text-[#0B0E12] font-semibold">
                  By {article.author_name}
                </span>
                {article.author_role && (
                  <span className="text-[#4B5157]/80 ml-1.5 hidden sm:inline">
                    ({article.author_role})
                  </span>
                )}
              </div>
              <time dateTime={article.published_at || ""}>
                {pubDate}
              </time>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { getMetadata, siteConfig } from "@/lib/metadata";
import { StructuredData, defaultOrgSchema } from "@/components/StructuredData";
import { LobbyNav } from "@/components/lobby/LobbyNav";
import { LobbyEmptyState } from "@/components/lobby/LobbyEmptyState";
import { 
  slugToCategory, 
  categoryToSlug, 
  getLobbyArticles,
  LOBBY_CATEGORIES 
} from "@/lib/lobby";
import { Clock, ArrowLeft } from "lucide-react";

interface CategoryPageProps {
  params: Promise<{
    category: string;
  }>;
}

export async function generateStaticParams() {
  return LOBBY_CATEGORIES.map((cat) => ({
    category: categoryToSlug(cat),
  }));
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { category: categorySlug } = await params;
  const category = slugToCategory(categorySlug);

  if (!category) {
    return { title: "Category Not Found | The Lobby" };
  }

  return getMetadata({
    title: `${category} Intelligence & News | The Lobby`,
    description: `Verified reporting, regulatory audits, and market intelligence regarding ${category} on Drawdown The Lobby.`,
    path: `/lobby/${categorySlug}`,
  });
}

export default async function LobbyCategoryPage({ params }: CategoryPageProps) {
  const { category: categorySlug } = await params;
  const category = slugToCategory(categorySlug);

  if (!category) {
    notFound();
  }

  const articles = await getLobbyArticles({
    category,
    limit: 30,
  });

  return (
    <div className="w-full bg-[#FFFFFF] min-h-screen text-[#0B0E12] font-sans">
      <LobbyNav />

      {/* Category Header */}
      <header className="border-b border-[#DEDDD8] bg-[#FAF9F5] py-10 md:py-14">
        <div className="max-w-[1320px] mx-auto px-4 sm:px-6">
          <div className="flex items-center gap-2 mb-3">
            <Link 
              href="/lobby" 
              className="inline-flex items-center gap-1 text-[11px] font-mono text-[#4B5157] hover:text-[#16213E] transition-colors uppercase"
            >
              <ArrowLeft className="w-3 h-3" /> The Lobby Home
            </Link>
            <span className="text-[#DEDDD8]">•</span>
            <span className="text-[11px] font-mono uppercase tracking-widest text-[#16213E] font-semibold">
              CATEGORY DESK
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-display font-black tracking-[-0.03em] text-[#0B0E12] uppercase">
            {category}
          </h1>

          <p className="mt-3 text-sm sm:text-base text-[#4B5157] font-sans max-w-2xl leading-relaxed">
            Verified reporting, regulatory updates, and investigative intelligence covering {category.toLowerCase()} across global financial markets.
          </p>
        </div>
      </header>

      {/* Articles Listing */}
      <main className="max-w-[1320px] mx-auto px-4 sm:px-6 py-12">
        {articles.length === 0 ? (
          <LobbyEmptyState
            title={`NO STORIES PUBLISHED IN ${category}`}
            description={`Our editorial desk has not recorded verified stories under the ${category} category in the current dispatch.`}
            badge="CATEGORY DESK CURRENT"
          />
        ) : (
          <div className="divide-y divide-[#DEDDD8] border-t border-b border-[#DEDDD8]">
            {articles.map((article) => {
              const pubDate = article.published_at
                ? new Date(article.published_at).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "short",
                    year: "numeric"
                  })
                : "RECENT";

              return (
                <article
                  key={article.id}
                  className="py-6 sm:py-8 grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-8 group hover:bg-[#FAF9F5]/40 transition-colors px-2 rounded-[2px]"
                >
                  <div className="md:col-span-2 text-[11px] font-mono text-[#4B5157]">
                    <time dateTime={article.published_at || ""}>{pubDate}</time>
                    <span className="text-[#16213E] font-semibold block mt-1">
                      {article.article_type}
                    </span>
                  </div>

                  <div className="md:col-span-8">
                    <h2 className="text-xl sm:text-2xl font-display font-bold text-[#0B0E12] leading-snug group-hover:text-[#16213E] transition-colors">
                      <Link href={`/lobby/${categorySlug}/${article.slug}`}>
                        {article.title}
                      </Link>
                    </h2>
                    <p className="mt-2 text-xs sm:text-sm text-[#4B5157] font-sans leading-relaxed line-clamp-2">
                      {article.excerpt}
                    </p>
                  </div>

                  <div className="md:col-span-2 flex md:flex-col items-center md:items-end justify-between md:justify-center text-[10px] font-mono text-[#4B5157]">
                    <span className="inline-flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {article.reading_time_minutes} min
                    </span>
                    <span className="text-[#0B0E12] font-semibold mt-1">
                      By {article.author_name}
                    </span>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}

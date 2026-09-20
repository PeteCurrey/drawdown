import type { Metadata } from "next";
import Link from "next/link";
import { getMetadata } from "@/lib/metadata";
import { LobbyNav } from "@/components/lobby/LobbyNav";
import { LobbyEmptyState } from "@/components/lobby/LobbyEmptyState";
import { 
  getLobbyArchive, 
  LOBBY_CATEGORIES, 
  categoryToSlug 
} from "@/lib/lobby";
import { Search, Clock, ArrowLeft } from "lucide-react";

export const metadata: Metadata = getMetadata({
  title: "The Lobby Archive // Chronological Market Intelligence Index",
  description: "Browse the complete chronological archive of verified reporting, broker audits, and trading research published on Drawdown The Lobby.",
  path: "/lobby/archive",
});

interface ArchivePageProps {
  searchParams: Promise<{
    category?: string;
    q?: string;
    page?: string;
  }>;
}

export default async function LobbyArchivePage({ searchParams }: ArchivePageProps) {
  const params = await searchParams;
  const currentCategory = params.category;
  const currentQuery = params.q || "";
  const currentPage = parseInt(params.page || "1", 10);

  const { articles, totalCount, totalPages } = await getLobbyArchive({
    categorySlug: currentCategory,
    query: currentQuery,
    page: currentPage,
    pageSize: 15,
  });

  return (
    <div className="w-full bg-[#FFFFFF] min-h-screen text-[#0B0E12] font-sans">
      <LobbyNav />

      {/* Archive Header */}
      <header className="border-b border-[#DEDDD8] bg-[#FAF9F5] py-10">
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
              CHRONOLOGICAL VAULT
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-display font-black tracking-tight text-[#0B0E12] uppercase">
            THE LOBBY ARCHIVE
          </h1>

          <p className="mt-2 text-sm text-[#4B5157] font-sans max-w-xl">
            Complete permanent ledger of Drawdown trading intelligence, broker surveillance, and market mechanics.
          </p>

          {/* Search Form */}
          <form method="GET" action="/lobby/archive" className="mt-6 flex max-w-md gap-2">
            {currentCategory && (
              <input type="hidden" name="category" value={currentCategory} />
            )}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-[#4B5157] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                name="q"
                defaultValue={currentQuery}
                placeholder="Search headlines, tags or body..."
                className="w-full pl-9 pr-4 py-2 text-xs font-mono bg-[#FFFFFF] border border-[#DEDDD8] rounded-[2px] focus:outline-none focus:border-[#16213E]"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-mono uppercase tracking-wider bg-[#16213E] text-[#FFFFFF] rounded-[2px] hover:bg-[#0B0E12] transition-colors"
            >
              Filter
            </button>
          </form>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-6">
            <Link
              href="/lobby/archive"
              className={`px-2.5 py-1 text-[10px] font-mono uppercase tracking-wider rounded-[2px] shrink-0 border ${
                !currentCategory
                  ? "bg-[#16213E] text-[#FFFFFF] border-[#16213E] font-bold"
                  : "bg-[#FFFFFF] text-[#4B5157] border-[#DEDDD8] hover:text-[#0B0E12]"
              }`}
            >
              All Categories
            </Link>
            {LOBBY_CATEGORIES.map((cat) => {
              const slug = categoryToSlug(cat);
              const isActive = currentCategory === slug;
              return (
                <Link
                  key={cat}
                  href={`/lobby/archive?category=${slug}${currentQuery ? `&q=${encodeURIComponent(currentQuery)}` : ""}`}
                  className={`px-2.5 py-1 text-[10px] font-mono uppercase tracking-wider rounded-[2px] shrink-0 border ${
                    isActive
                      ? "bg-[#16213E] text-[#FFFFFF] border-[#16213E] font-bold"
                      : "bg-[#FFFFFF] text-[#4B5157] border-[#DEDDD8] hover:text-[#0B0E12]"
                  }`}
                >
                  {cat}
                </Link>
              );
            })}
          </div>
        </div>
      </header>

      {/* Archive Results */}
      <main className="max-w-[1320px] mx-auto px-4 sm:px-6 py-10">
        <div className="flex items-center justify-between text-xs font-mono text-[#4B5157] pb-4 border-b border-[#DEDDD8] mb-6">
          <span>{totalCount} STORIES RECORDED</span>
          <span>PAGE {currentPage} OF {Math.max(1, totalPages)}</span>
        </div>

        {articles.length === 0 ? (
          <LobbyEmptyState
            title="NO ARCHIVE RECORDS MATCH QUERY"
            description="Adjust category filters or search keywords to view historical dispatches."
            badge="ARCHIVE EMPTY"
          />
        ) : (
          <div className="divide-y divide-[#DEDDD8]">
            {articles.map((article) => {
              const categorySlug = categoryToSlug(article.category);
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
                  className="py-5 sm:py-6 grid grid-cols-1 md:grid-cols-12 gap-4 items-center group hover:bg-[#FAF9F5]/50 px-2 rounded-[2px]"
                >
                  <div className="md:col-span-2 text-xs font-mono text-[#4B5157]">
                    <time dateTime={article.published_at || ""}>{pubDate}</time>
                    <span className="text-[#16213E] font-semibold block text-[10px] mt-0.5">
                      {article.category}
                    </span>
                  </div>

                  <div className="md:col-span-8">
                    <h2 className="text-base sm:text-lg font-display font-bold text-[#0B0E12] leading-snug group-hover:text-[#16213E] transition-colors">
                      <Link href={`/lobby/${categorySlug}/${article.slug}`}>
                        {article.title}
                      </Link>
                    </h2>
                    <p className="mt-1 text-xs text-[#4B5157] font-sans line-clamp-2">
                      {article.excerpt}
                    </p>
                  </div>

                  <div className="md:col-span-2 flex items-center md:justify-end text-[11px] font-mono text-[#4B5157] gap-2">
                    <Clock className="w-3 h-3" />
                    <span>{article.reading_time_minutes} min read</span>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="mt-8 pt-6 border-t border-[#DEDDD8] flex items-center justify-between text-xs font-mono">
            {currentPage > 1 ? (
              <Link
                href={`/lobby/archive?page=${currentPage - 1}${currentCategory ? `&category=${currentCategory}` : ""}${currentQuery ? `&q=${encodeURIComponent(currentQuery)}` : ""}`}
                className="px-3 py-1.5 bg-[#FAF9F5] border border-[#DEDDD8] text-[#0B0E12] rounded-[2px] hover:bg-[#F3F2EE]"
              >
                &larr; Previous Page
              </Link>
            ) : <div />}

            <span>Page {currentPage} of {totalPages}</span>

            {currentPage < totalPages ? (
              <Link
                href={`/lobby/archive?page=${currentPage + 1}${currentCategory ? `&category=${currentCategory}` : ""}${currentQuery ? `&q=${encodeURIComponent(currentQuery)}` : ""}`}
                className="px-3 py-1.5 bg-[#FAF9F5] border border-[#DEDDD8] text-[#0B0E12] rounded-[2px] hover:bg-[#F3F2EE]"
              >
                Next Page &rarr;
              </Link>
            ) : <div />}
          </div>
        )}
      </main>
    </div>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { getMetadata } from "@/lib/metadata";
import { LobbyNav } from "@/components/lobby/LobbyNav";
import { LobbyEmptyState } from "@/components/lobby/LobbyEmptyState";
import { searchLobby, categoryToSlug } from "@/lib/lobby";
import { Search, Clock, ArrowLeft } from "lucide-react";

export const metadata: Metadata = getMetadata({
  title: "Search The Lobby // Financial Intelligence Query",
  description: "Search Drawdown's verified articles, broker audits, platform analyses, and educational explainers.",
  path: "/lobby/search",
});

interface SearchPageProps {
  searchParams: Promise<{
    q?: string;
  }>;
}

export default async function LobbySearchPage({ searchParams }: SearchPageProps) {
  const { q } = await searchParams;
  const query = q || "";
  const results = query ? await searchLobby(query, 30) : [];

  return (
    <div className="w-full bg-[#FFFFFF] min-h-screen text-[#0B0E12] font-sans">
      <LobbyNav />

      {/* Search Header */}
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
              INTELLIGENCE QUERY
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-display font-black tracking-tight text-[#0B0E12] uppercase">
            SEARCH THE LOBBY
          </h1>

          <form method="GET" action="/lobby/search" className="mt-6 flex max-w-xl gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-[#4B5157] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                name="q"
                defaultValue={query}
                autoFocus
                placeholder="Search headlines, markets, brokers, tags or article body..."
                className="w-full pl-9 pr-4 py-2.5 text-xs sm:text-sm font-mono bg-[#FFFFFF] border border-[#DEDDD8] rounded-[2px] focus:outline-none focus:border-[#16213E]"
              />
            </div>
            <button
              type="submit"
              className="px-5 py-2.5 text-xs font-mono uppercase tracking-wider bg-[#16213E] text-[#FFFFFF] font-semibold rounded-[2px] hover:bg-[#0B0E12] transition-colors"
            >
              Search
            </button>
          </form>
        </div>
      </header>

      {/* Results Main */}
      <main className="max-w-[1320px] mx-auto px-4 sm:px-6 py-10">
        {!query ? (
          <div className="py-12 text-center text-xs font-mono text-[#4B5157] uppercase tracking-wider">
            Enter search keywords above to query the verified editorial archive.
          </div>
        ) : results.length === 0 ? (
          <LobbyEmptyState
            title={`NO STORIES FOUND FOR "${query.toUpperCase()}"`}
            description="Our surveillance engine has no verified articles matching your exact query. Try broader keywords or inspect category archives."
            badge="QUERY ZERO RESULTS"
          />
        ) : (
          <div>
            <div className="text-xs font-mono text-[#4B5157] pb-3 mb-6 border-b border-[#DEDDD8]">
              FOUND {results.length} VERIFIED STORY RESULTS FOR &ldquo;{query}&rdquo;
            </div>

            <div className="divide-y divide-[#DEDDD8]">
              {results.map((article) => {
                const categorySlug = categoryToSlug(article.category);
                const pubDate = article.published_at
                  ? new Date(article.published_at).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                      year: "numeric"
                    })
                  : "RECENT";

                return (
                  <article key={article.id} className="py-6 grid grid-cols-1 md:grid-cols-12 gap-4 items-center group hover:bg-[#FAF9F5]/40 px-2 rounded-[2px]">
                    <div className="md:col-span-2 text-xs font-mono text-[#4B5157]">
                      <time dateTime={article.published_at || ""}>{pubDate}</time>
                      <span className="text-[#16213E] font-semibold block text-[10px] mt-0.5">
                        {article.category}
                      </span>
                    </div>

                    <div className="md:col-span-8">
                      <h2 className="text-lg sm:text-xl font-display font-bold text-[#0B0E12] leading-snug group-hover:text-[#16213E] transition-colors">
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
          </div>
        )}
      </main>
    </div>
  );
}

// src/app/(marketing)/lobby/saved/page.tsx
import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Bookmark } from "lucide-react";
import { createInternalSupabase } from "@/lib/supabase/server";
import { getUserSavedArticles } from "@/lib/lobby-personalisation";
import { categoryToSlug } from "@/lib/lobby-constants";
import { LobbyNav } from "@/components/lobby/LobbyNav";
import { BookmarkButton } from "@/components/lobby/BookmarkButton";

export const metadata: Metadata = {
  title: "Saved Stories | The Lobby | Drawdown",
  description: "Your bookmarked articles, market intelligence reports, and trading updates.",
  robots: { index: false, follow: false },
};

export default async function SavedStoriesPage() {
  const supabase = await createInternalSupabase();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return (
      <main className="min-h-screen bg-black text-white selection:bg-zinc-800">
        <LobbyNav activeCategory="MARKETS" />
        <div className="max-w-4xl mx-auto px-4 py-20 text-center">
          <div className="w-12 h-12 mx-auto mb-4 flex items-center justify-center border border-zinc-800 bg-zinc-900">
            <Bookmark className="w-6 h-6 text-amber-400" />
          </div>
          <h1 className="font-serif text-3xl font-bold uppercase mb-4">Saved Stories</h1>
          <p className="font-mono text-sm text-zinc-400 max-w-md mx-auto mb-8">
            Sign in to bookmark articles, curate your reading list, and customize your personal Lobby feed.
          </p>
          <Link
            href="/login?next=/lobby/saved"
            className="inline-block px-6 py-2.5 bg-white text-black font-mono text-xs uppercase font-bold tracking-wider hover:bg-zinc-200 transition-colors"
          >
            Sign In to Drawdown
          </Link>
        </div>
      </main>
    );
  }

  const savedList = await getUserSavedArticles(user.id);

  return (
    <main className="min-h-screen bg-black text-white selection:bg-zinc-800">
      <LobbyNav activeCategory="MARKETS" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-8">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
          <div>
            <Link
              href="/lobby"
              className="inline-flex items-center gap-1.5 font-mono text-xs text-zinc-500 hover:text-zinc-300 uppercase mb-2"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to The Lobby
            </Link>
            <h1 className="font-serif text-3xl sm:text-4xl font-black uppercase text-white tracking-tight flex items-center gap-3">
              <Bookmark className="w-7 h-7 text-amber-400 fill-amber-400" />
              Your Saved Stories
            </h1>
          </div>
          <span className="font-mono text-xs text-zinc-400">
            {savedList.length} BOOKMARKED
          </span>
        </div>

        {savedList.length > 0 ? (
          <div className="space-y-4">
            {savedList.map((item) => {
              const article = item.article;
              if (!article) return null;

              const categorySlug = categoryToSlug(article.category as any);
              const articleHref = `/lobby/${categorySlug}/${article.slug}`;

              return (
                <article
                  key={item.id}
                  className="flex flex-col sm:flex-row sm:items-baseline justify-between p-5 bg-zinc-950 border border-zinc-800 hover:border-zinc-700 transition-colors gap-4"
                >
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-3 text-[10px] font-mono text-zinc-400 uppercase">
                      <span className="text-zinc-300 font-semibold">{article.category}</span>
                      <span>•</span>
                      <span>{article.article_type}</span>
                      <span>•</span>
                      <span>Saved {new Date(item.created_at).toLocaleDateString()}</span>
                    </div>
                    <Link href={articleHref} className="block group">
                      <h2 className="font-serif text-lg font-bold text-white group-hover:text-blue-400 transition-colors leading-snug">
                        {article.title}
                      </h2>
                    </Link>
                    {article.excerpt && (
                      <p className="text-xs font-sans text-zinc-400 line-clamp-2 leading-relaxed">
                        {article.excerpt}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <Link
                      href={articleHref}
                      className="px-3 py-1.5 font-mono text-xs uppercase bg-zinc-900 text-zinc-200 border border-zinc-800 hover:border-zinc-600 hover:text-white transition-colors"
                    >
                      Read →
                    </Link>
                    <BookmarkButton articleId={article.id} initialSaved={true} />
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="border border-zinc-800 bg-zinc-950 p-12 text-center space-y-4">
            <Bookmark className="w-8 h-8 text-zinc-600 mx-auto" />
            <h3 className="font-serif text-xl font-bold uppercase text-zinc-300">No Saved Stories Yet</h3>
            <p className="font-mono text-xs text-zinc-400 max-w-sm mx-auto">
              Click the bookmark icon on any article in The Lobby to save it to your reading list.
            </p>
            <Link
              href="/lobby"
              className="inline-block mt-2 px-5 py-2 font-mono text-xs uppercase tracking-wider bg-white text-black hover:bg-zinc-200 font-bold"
            >
              Browse The Lobby
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}

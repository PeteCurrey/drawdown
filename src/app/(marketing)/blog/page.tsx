import { Metadata } from "next";
import { getMetadata } from "@/lib/metadata";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { getAllPosts } from "@/lib/blog";
import { TrackPageView } from "@/components/admin/TrackPageView";

interface Props {
  searchParams: { category?: string; page?: string };
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  return getMetadata({
    title: "Insights | Market Analysis & Trading Education",
    description: "Market analysis, trading education, and honest commentary from the Drawdown team. No hype, just edge.",
    path: `/blog${searchParams.category ? `?category=${searchParams.category}` : ""}`,
  });
}

const CATEGORIES = ["All", "Market Analysis", "Education", "Psychology", "Tools", "UK Trading", "Risk Management"];
const POSTS_PER_PAGE = 6;

export default function BlogListingPage({ searchParams }: Props) {
  const allPosts = getAllPosts();
  const selectedCategory = searchParams.category || "All";
  const currentPage = parseInt(searchParams.page || "1");

  const filteredPosts = selectedCategory === "All" 
    ? allPosts 
    : allPosts.filter(p => p.category === selectedCategory);

  const featuredPost = filteredPosts[0];
  const remainingPosts = filteredPosts.slice(1);
  
  const totalPages = Math.ceil(remainingPosts.length / POSTS_PER_PAGE);
  const paginatedPosts = remainingPosts.slice(
    (currentPage - 1) * POSTS_PER_PAGE,
    currentPage * POSTS_PER_PAGE
  );

  if (allPosts.length === 0) {
    return (
      <div className="pt-28 pb-24 bg-white min-h-screen">
        <TrackPageView path="/blog" />
        <div className="max-w-7xl mx-auto px-6">
          <Breadcrumbs />
          <h1 className="text-4xl md:text-6xl font-sans font-extrabold tracking-tight text-mkt-ink mb-4">Insights.</h1>
          <p className="text-base text-mkt-i4 font-sans">No articles found yet. Check back soon.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-28 pb-24 bg-white min-h-screen">
      <TrackPageView path="/blog" />
      <div className="max-w-7xl mx-auto px-6">
        <Breadcrumbs />

        <div className="mb-16">
          <span className="text-[11px] font-sans font-bold text-mkt-i4 uppercase tracking-widest block mb-4">// INSIGHTS</span>
          <h1 className="text-4xl md:text-6xl font-sans font-extrabold tracking-tight text-mkt-ink mb-4">
            Insights.
          </h1>
          <p className="text-base text-mkt-i3 max-w-xl font-sans leading-relaxed">
            Market analysis, trading education, and honest commentary on the reality of the markets.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-3 mb-14 border-b border-mkt-bd pb-8">
          {CATEGORIES.map((cat) => (
            <Link 
              key={cat}
              href={`/blog${cat === "All" ? "" : `?category=${encodeURIComponent(cat)}`}`}
              className={cn(
                "px-4 py-2 rounded-full text-[10px] font-sans font-bold uppercase tracking-widest transition-colors border",
                selectedCategory === cat
                  ? "bg-mkt-ink text-white border-mkt-ink"
                  : "text-mkt-i3 border-mkt-bd hover:border-mkt-bds hover:text-mkt-ink"
              )}
            >
              {cat}
            </Link>
          ))}
        </div>

        {/* Featured Post (Only on Page 1) */}
        {featuredPost && currentPage === 1 && (
          <div className="mb-20">
            <Link href={`/blog/${featuredPost.slug}`} className="group grid grid-cols-1 lg:grid-cols-2 gap-0 items-stretch border border-mkt-bd rounded-[14px] overflow-hidden hover:shadow-[0_8px_40px_rgba(0,0,0,0.08)] hover:border-transparent transition-all duration-300">
              <div className="aspect-video lg:aspect-auto bg-[#F0F0F0] relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent z-10" />
                <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-105" style={{backgroundImage: `url(https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=800&auto=format&fit=crop)`}} />
                <div className="absolute inset-x-8 bottom-8 z-20">
                   <span className="text-[10px] font-sans font-bold uppercase tracking-widest text-white/70 mb-2 block">// Featured Post</span>
                   <h2 className="text-2xl md:text-3xl font-sans font-extrabold tracking-tight text-white leading-snug">
                    {featuredPost.title}
                   </h2>
                </div>
              </div>
              <div className="p-8 lg:p-10 space-y-5 bg-white flex flex-col justify-center">
                <p className="text-sm text-mkt-i3 leading-relaxed font-sans">
                  {featuredPost.excerpt}
                </p>
                <div className="flex items-center gap-4 text-[10px] font-sans text-mkt-i4 uppercase tracking-widest">
                  <span>{new Date(featuredPost.publishedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                  <span>·</span>
                  <span>{featuredPost.readingTime} min read</span>
                </div>
                <span className="inline-flex items-center gap-1 text-[11px] font-sans font-bold text-mkt-ink group-hover:underline underline-offset-2 transition-all">
                  Read Article →
                </span>
              </div>
            </Link>
          </div>
        )}

        {/* Post Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {paginatedPosts.map((post) => (
            <Link 
              key={post.slug} 
              href={`/blog/${post.slug}`}
              className="group relative bg-white border border-mkt-bd rounded-[14px] flex flex-col justify-between h-[380px] overflow-hidden hover:shadow-[0_8px_32px_rgba(0,0,0,0.07)] hover:-translate-y-0.5 transition-all duration-300"
            >
              {/* Top image area */}
              <div className="h-[140px] bg-[#F0F0F0] relative overflow-hidden shrink-0">
                <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-105 opacity-60"
                  style={{backgroundImage: `url(https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=600&auto=format&fit=crop)`}} />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white/80" />
                <span className="absolute top-4 left-4 text-[9px] font-sans font-bold px-2.5 py-1 bg-white/90 border border-mkt-bd rounded text-mkt-i3 uppercase tracking-widest">
                  {post.category}
                </span>
              </div>
              <div className="p-6 flex flex-col flex-1">
                <h3 className="text-base font-sans font-extrabold tracking-tight text-mkt-ink group-hover:text-mkt-i2 transition-colors leading-snug mb-3">
                  {post.title}
                </h3>
                <p className="text-xs text-mkt-i3 leading-relaxed font-sans line-clamp-3 flex-1">
                  {post.excerpt}
                </p>
                <div className="flex items-center justify-between text-[10px] font-sans text-mkt-i4 uppercase tracking-widest pt-4 border-t border-mkt-bd mt-4">
                  <span>{new Date(post.publishedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                  <span>{post.readingTime} min read</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-16 flex justify-center gap-2">
            {Array.from({ length: totalPages }).map((_, i) => (
              <Link 
                key={i}
                href={`/blog?category=${encodeURIComponent(selectedCategory)}&page=${i + 1}`}
                className={cn(
                  "w-10 h-10 flex items-center justify-center font-sans text-xs rounded-lg border transition-colors",
                  currentPage === i + 1
                    ? "bg-mkt-ink text-white border-mkt-ink"
                    : "border-mkt-bd text-mkt-i3 hover:border-mkt-bds hover:text-mkt-ink"
                )}
              >
                {i + 1}
              </Link>
            ))}
          </div>
        )}

        {/* RSS Link */}
        <div className="mt-32 text-center">
          <Link href="/blog/rss.xml" className="text-[10px] font-sans uppercase tracking-widest text-mkt-i4 hover:text-mkt-ink transition-colors flex items-center justify-center gap-2">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M6.18,15.64A2.18,2.18,0,0,1,8.36,17.82,2.18,2.18,0,0,1,6.18,20,2.18,2.18,0,0,1,4,17.82,2.18,2.18,0,0,1,6.18,15.64ZM4,4.44A15.56,15.56,0,0,1,19.56,20h-2.83A12.73,12.73,0,0,0,4,7.27Zm0,5.66a9.9,9.9,0,0,1,9.9,9.9H11.07A7.17,7.17,0,0,0,4,12.93Z"/></svg>
            Subscribe via RSS
          </Link>
        </div>
      </div>
    </div>
  );
}

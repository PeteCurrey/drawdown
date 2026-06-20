import { Metadata } from "next";
import { getMetadata } from "@/lib/metadata";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { getAllPosts } from "@/lib/blog";
import { TrackPageView } from "@/components/admin/TrackPageView";
import { Suspense } from "react";
import { BlogSearch } from "@/components/blog/BlogSearch";

interface Props {
  searchParams: { category?: string; page?: string; q?: string };
}

export const metadata: Metadata = {
  title: 'Trading Blog | Market Analysis & Education',
  description: 'Daily market analysis, trading education and honest commentary from Pete Currey and the Drawdown team. No signals. No hype. Just context.',
  alternates: { canonical: 'https://drawdown.trading/blog' }
}

const CATEGORIES = ["All", "Market Analysis", "Education", "Psychology", "Tools", "UK Trading", "Risk Management"];
const POSTS_PER_PAGE = 6;

const CATEGORY_IMAGES: Record<string, string> = {
  "Market Analysis": "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?q=80&w=800&auto=format&fit=crop",
  "Education": "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=800&auto=format&fit=crop",
  "Psychology": "https://images.unsplash.com/photo-1507413245164-6160d8298b31?q=80&w=800&auto=format&fit=crop",
  "Tools": "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800&auto=format&fit=crop",
  "UK Trading": "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?q=80&w=800&auto=format&fit=crop",
  "Risk Management": "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=800&auto=format&fit=crop",
};

export default async function BlogListingPage({ searchParams }: Props) {
  const allPosts = await getAllPosts();
  const resolvedParams = await searchParams;
  const selectedCategory = resolvedParams.category || "All";
  const searchQuery = resolvedParams.q || "";
  const currentPage = parseInt(resolvedParams.page || "1");

  let filteredPosts = selectedCategory === "All" 
    ? allPosts 
    : allPosts.filter(p => p.category === selectedCategory);

  if (searchQuery) {
    const query = searchQuery.toLowerCase();
    filteredPosts = filteredPosts.filter(p => 
      p.title.toLowerCase().includes(query) || 
      p.excerpt.toLowerCase().includes(query)
    );
  }

  const featuredPost = filteredPosts[0];
  const remainingPosts = filteredPosts.slice(1);
  
  const totalPages = Math.ceil(remainingPosts.length / POSTS_PER_PAGE);
  const paginatedPosts = remainingPosts.slice(
    (currentPage - 1) * POSTS_PER_PAGE,
    currentPage * POSTS_PER_PAGE
  );

  if (allPosts.length === 0) {
    return (
      <div className="pt-28 pb-24 min-h-screen bg-white text-slate-850 font-ibm-sans selection:bg-accent selection:text-white relative">
        <TrackPageView path="/blog" />
        <div className="max-w-7xl mx-auto px-6">
          <Breadcrumbs />
          <h1 className="text-4xl md:text-6xl font-display font-black uppercase tracking-tight text-slate-900 mb-4">Insights.</h1>
          <p className="text-sm text-slate-500 font-mono uppercase tracking-wider">// No articles found yet. Check back soon.</p>
        </div>
      </div>
    );
  }

  const featuredImage = featuredPost ? featuredPost.image : "";

  return (
    <div className="pt-28 pb-24 min-h-screen bg-white text-slate-850 font-ibm-sans selection:bg-accent selection:text-white relative">
      <TrackPageView path="/blog" />
      <div className="max-w-7xl mx-auto px-6">
        <Breadcrumbs />

        <div className="mb-16">
          <span className="text-[9px] font-mono font-bold text-text-tertiary uppercase tracking-widest block mb-3">// INSIGHTS</span>
          <h1 className="text-4xl md:text-6xl font-display font-black uppercase tracking-tight text-slate-900 leading-none">
            Insights.
          </h1>
          <p className="text-sm text-slate-500 max-w-xl font-ibm-sans leading-relaxed mt-4">
            Market analysis, trading education, and honest commentary on the reality of the markets. No fluff, just raw edge.
          </p>
        </div>

        {/* Filter and Search Row */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-14 border-b border-[#E5E5E5] pb-8">
          {/* Category Filter */}
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => {
              const urlParams = new URLSearchParams();
              if (cat !== "All") urlParams.set("category", cat);
              if (searchQuery) urlParams.set("q", searchQuery);
              const queryString = urlParams.toString();
              const href = `/blog${queryString ? `?${queryString}` : ""}`;
              
              return (
                <Link 
                  key={cat}
                  href={href}
                  className={cn(
                    "px-4 py-2 rounded-none text-[9px] font-mono font-bold uppercase tracking-widest transition-all border",
                    selectedCategory === cat
                      ? "bg-accent text-[#08090D] border-accent shadow-sm shadow-accent/25"
                      : "text-slate-500 border-[#E5E5E5] hover:border-[#CCCCCC] hover:text-slate-800 bg-white"
                  )}
                >
                  {cat}
                </Link>
              );
            })}
          </div>
          
          {/* Search Bar */}
          <Suspense fallback={<div className="h-10 w-full max-w-md bg-slate-50 animate-pulse border border-[#E5E5E5]" />}>
            <BlogSearch />
          </Suspense>
        </div>

        {filteredPosts.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-[#E5E5E5] bg-slate-50/50">
            <p className="text-sm text-slate-500 font-mono uppercase tracking-wider mb-2">
              // No articles match your search query
            </p>
            <p className="text-xs text-slate-400 font-sans">
              Try adjusting your keywords or category filters.
            </p>
          </div>
        ) : (
          <>
            {/* Featured Post (Only on Page 1) */}
            {featuredPost && currentPage === 1 && (
          <div className="mb-20">
            <Link href={`/blog/${featuredPost.slug}`} className="group grid grid-cols-1 lg:grid-cols-12 gap-0 items-stretch border border-[#E5E5E5] rounded-none hover:shadow-[0_8px_40px_rgba(0,0,0,0.06)] hover:border-[#CCCCCC] transition-all duration-300 bg-white">
              <div className="lg:col-span-7 aspect-video lg:aspect-auto bg-slate-50 relative overflow-hidden min-h-[300px] border-r lg:border-r-0 border-b lg:border-b-0 border-[#E5E5E5]">
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent z-10" />
                <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-[1.01]" style={{backgroundImage: `url(${featuredImage})`}} />
                <div className="absolute inset-x-8 bottom-8 z-20">
                   <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-[#00C2FF] mb-2 block">// Featured Insight</span>
                   <h2 className="text-xl md:text-3xl font-display font-black uppercase tracking-tight text-white leading-none">
                    {featuredPost.title}
                   </h2>
                </div>
              </div>
              <div className="lg:col-span-5 p-8 lg:p-10 space-y-6 flex flex-col justify-center bg-white">
                <p className="text-sm text-slate-600 leading-relaxed font-ibm-sans">
                  {featuredPost.excerpt}
                </p>
                <div className="flex items-center gap-4 text-[9px] font-mono text-text-tertiary uppercase tracking-widest">
                  <span>{new Date(featuredPost.publishedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                  <span>·</span>
                  <span>{featuredPost.readingTime} min read</span>
                </div>
                <span className="inline-flex items-center gap-1.5 text-[9px] font-mono font-bold uppercase tracking-wider text-slate-800 group-hover:text-accent group-hover:underline underline-offset-4 transition-all">
                  Read Article &rarr;
                </span>
              </div>
            </Link>
          </div>
        )}

        {/* Post Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {paginatedPosts.map((post) => {
            const postImage = post.image;
            return (
              <Link 
                key={post.slug} 
                href={`/blog/${post.slug}`}
                className="group relative bg-white border border-[#E5E5E5] hover:border-[#CCCCCC] transition-all duration-300 hover:shadow-[0_8px_30px_rgba(0,0,0,0.05)] rounded-none flex flex-col justify-between h-[390px] overflow-hidden"
              >
                {/* Top image area */}
                <div className="h-[150px] bg-slate-50 relative overflow-hidden shrink-0 border-b border-[#E5E5E5]">
                  <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-103"
                    style={{backgroundImage: `url(${postImage})`}} />
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/15" />
                  <span className="absolute top-4 left-4 text-[8px] font-mono font-bold px-2.5 py-1 bg-white/95 backdrop-blur-sm border border-[#E5E5E5] rounded-none text-slate-850 uppercase tracking-widest shadow-sm">
                    {post.category}
                  </span>
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <h3 className="text-base font-display font-black uppercase tracking-tight text-slate-800 group-hover:text-accent transition-colors leading-snug mb-3 line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed font-ibm-sans line-clamp-3 flex-1">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between text-[8px] font-mono text-text-tertiary uppercase tracking-widest pt-4 border-t border-[#E5E5E5] mt-4">
                    <span>{new Date(post.publishedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                    <span>{post.readingTime} min read</span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-16 flex justify-center gap-2">
                {Array.from({ length: totalPages }).map((_, i) => {
                  const pageParams = new URLSearchParams();
                  if (selectedCategory !== "All") pageParams.set("category", selectedCategory);
                  if (searchQuery) pageParams.set("q", searchQuery);
                  pageParams.set("page", String(i + 1));
                  return (
                    <Link 
                      key={i}
                      href={`/blog?${pageParams.toString()}`}
                      className={cn(
                        "w-10 h-10 flex items-center justify-center font-mono text-xs rounded-none border transition-colors",
                        currentPage === i + 1
                          ? "bg-accent text-[#08090D] border-accent font-bold"
                          : "border-[#E5E5E5] text-slate-500 hover:border-[#CCCCCC] hover:text-slate-800 bg-white"
                      )}
                    >
                      {i + 1}
                    </Link>
                  );
                })}
              </div>
            )}
          </>
        )}

        {/* RSS Link */}
        <div className="mt-24 text-center">
          <Link href="/blog/rss.xml" className="text-[8px] font-mono uppercase tracking-widest text-text-tertiary hover:text-accent transition-colors flex items-center justify-center gap-2 w-fit mx-auto">
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M6.18,15.64A2.18,2.18,0,0,1,8.36,17.82,2.18,2.18,0,0,1,6.18,20,2.18,2.18,0,0,1,4,17.82,2.18,2.18,0,0,1,6.18,15.64ZM4,4.44A15.56,15.56,0,0,1,19.56,20h-2.83A12.73,12.73,0,0,0,4,7.27Zm0,5.66a9.9,9.9,0,0,1,9.9,9.9H11.07A7.17,7.17,0,0,0,4,12.93Z"/></svg>
            Subscribe via RSS
          </Link>
        </div>
      </div>
    </div>
  );
}

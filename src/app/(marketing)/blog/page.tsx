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
      <div className="pt-28 pb-24 min-h-screen bg-white">
        <TrackPageView path="/blog" />
        <div className="max-w-7xl mx-auto px-6">
          <Breadcrumbs />
          <h1 className="text-4xl md:text-6xl font-sans font-extrabold tracking-tight text-slate-900 mb-4">Insights.</h1>
          <p className="text-base text-slate-500 font-sans">No articles found yet. Check back soon.</p>
        </div>
      </div>
    );
  }

  const featuredImage = featuredPost ? featuredPost.image : "";

  return (
    <div className="pt-28 pb-24 min-h-screen bg-white">
      <TrackPageView path="/blog" />
      <div className="max-w-7xl mx-auto px-6">
        <Breadcrumbs />

        <div className="mb-16">
          <span className="text-[11px] font-sans font-bold text-text-tertiary uppercase tracking-widest block mb-3">// INSIGHTS</span>
          <h1 className="text-4xl md:text-6xl font-sans font-black uppercase tracking-tight text-slate-900 leading-none">
            Insights.
          </h1>
          <p className="text-base text-slate-500 max-w-xl font-sans leading-relaxed mt-4">
            Market analysis, trading education, and honest commentary on the reality of the markets. No fluff, just raw edge.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-3 mb-14 border-b border-slate-100 pb-8">
          {CATEGORIES.map((cat) => (
            <Link 
              key={cat}
              href={`/blog${cat === "All" ? "" : `?category=${encodeURIComponent(cat)}`}`}
              className={cn(
                "px-4 py-2 rounded-full text-[10px] font-sans font-bold uppercase tracking-widest transition-all border",
                selectedCategory === cat
                  ? "bg-accent text-[#08090D] border-accent shadow-sm shadow-accent/25"
                  : "text-slate-500 border-slate-200 hover:border-slate-300 hover:text-slate-800 bg-white"
              )}
            >
              {cat}
            </Link>
          ))}
        </div>

        {/* Featured Post (Only on Page 1) */}
        {featuredPost && currentPage === 1 && (
          <div className="mb-20">
            <Link href={`/blog/${featuredPost.slug}`} className="group grid grid-cols-1 lg:grid-cols-12 gap-0 items-stretch border border-slate-100 rounded-2xl overflow-hidden hover:shadow-[0_8px_40px_rgba(0,0,0,0.06)] hover:border-slate-200 transition-all duration-300 bg-slate-50/30">
              <div className="lg:col-span-7 aspect-video lg:aspect-auto bg-slate-100 relative overflow-hidden min-h-[300px]">
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent z-10" />
                <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-[1.01]" style={{backgroundImage: `url(${featuredImage})`}} />
                <div className="absolute inset-x-8 bottom-8 z-20">
                   <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-white/80 mb-2 block">// Featured Insight</span>
                   <h2 className="text-xl md:text-3xl font-sans font-black uppercase tracking-tight text-white leading-tight">
                    {featuredPost.title}
                   </h2>
                </div>
              </div>
              <div className="lg:col-span-5 p-8 lg:p-10 space-y-6 flex flex-col justify-center bg-white border-l border-slate-50">
                <p className="text-sm text-slate-500 leading-relaxed font-sans">
                  {featuredPost.excerpt}
                </p>
                <div className="flex items-center gap-4 text-[10px] font-mono text-text-tertiary uppercase tracking-widest">
                  <span>{new Date(featuredPost.publishedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                  <span>·</span>
                  <span>{featuredPost.readingTime} min read</span>
                </div>
                <span className="inline-flex items-center gap-1.5 text-[10px] font-mono font-bold uppercase tracking-wider text-slate-800 group-hover:text-accent group-hover:underline underline-offset-4 transition-all">
                  Read Article →
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
                className="group relative bg-slate-50/35 border border-slate-100 hover:border-slate-200/80 transition-all duration-300 hover:shadow-[0_8px_30px_rgba(0,0,0,0.05)] rounded-2xl flex flex-col justify-between h-[390px] overflow-hidden bg-white"
              >
                {/* Top image area */}
                <div className="h-[150px] bg-slate-100 relative overflow-hidden shrink-0">
                  <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-103"
                    style={{backgroundImage: `url(${postImage})`}} />
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/10" />
                  <span className="absolute top-4 left-4 text-[9px] font-mono font-bold px-2.5 py-1 bg-white/95 backdrop-blur-sm border border-slate-100 rounded text-slate-700 uppercase tracking-widest shadow-sm">
                    {post.category}
                  </span>
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <h3 className="text-base font-sans font-black uppercase tracking-tight text-slate-800 group-hover:text-accent transition-colors leading-snug mb-3 line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed font-sans line-clamp-3 flex-1">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between text-[9px] font-mono text-text-tertiary uppercase tracking-widest pt-4 border-t border-slate-100 mt-4">
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
            {Array.from({ length: totalPages }).map((_, i) => (
              <Link 
                key={i}
                href={`/blog?category=${encodeURIComponent(selectedCategory)}&page=${i + 1}`}
                className={cn(
                  "w-10 h-10 flex items-center justify-center font-sans text-xs rounded-lg border transition-colors",
                  currentPage === i + 1
                    ? "bg-accent text-[#08090D] border-accent font-bold"
                    : "border-slate-200 text-slate-500 hover:border-slate-300 hover:text-slate-800 bg-white"
                )}
              >
                {i + 1}
              </Link>
            ))}
          </div>
        )}

        {/* RSS Link */}
        <div className="mt-24 text-center">
          <Link href="/blog/rss.xml" className="text-[9px] font-mono uppercase tracking-widest text-text-tertiary hover:text-accent transition-colors flex items-center justify-center gap-2 w-fit mx-auto">
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M6.18,15.64A2.18,2.18,0,0,1,8.36,17.82,2.18,2.18,0,0,1,6.18,20,2.18,2.18,0,0,1,4,17.82,2.18,2.18,0,0,1,6.18,15.64ZM4,4.44A15.56,15.56,0,0,1,19.56,20h-2.83A12.73,12.73,0,0,0,4,7.27Zm0,5.66a9.9,9.9,0,0,1,9.9,9.9H11.07A7.17,7.17,0,0,0,4,12.93Z"/></svg>
            Subscribe via RSS
          </Link>
        </div>
      </div>
    </div>
  );
}

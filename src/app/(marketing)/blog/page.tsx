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
      <div className="pt-32 pb-24 bg-background-primary min-h-screen">
        <TrackPageView path="/blog" />
        <div className="container mx-auto px-6">
          <Breadcrumbs />
          <h1 className="text-5xl md:text-8xl font-display font-extrabold uppercase mb-6 text-text-primary">Insights.</h1>
          <p className="text-xl text-text-tertiary uppercase font-mono tracking-widest">No articles found yet. Check back soon.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-24 bg-background-primary min-h-screen">
      <TrackPageView path="/blog" />
      <div className="container mx-auto px-6">
        <Breadcrumbs />

        <div className="mb-20">
          <h1 className="text-5xl md:text-8xl font-display font-extrabold uppercase mb-6 text-text-primary">
            Insights.
          </h1>
          <p className="text-xl text-text-secondary max-w-2xl font-sans">
            Market analysis, trading education, and honest commentary on the reality of the markets.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-4 mb-20 border-b border-border-slate pb-8">
          {CATEGORIES.map((cat) => (
            <Link 
              key={cat}
              href={`/blog${cat === "All" ? "" : `?category=${encodeURIComponent(cat)}`}`}
              className={cn(
                "px-4 py-2 text-[10px] font-bold uppercase tracking-widest transition-colors",
                selectedCategory === cat ? "bg-accent text-background-primary" : "text-text-tertiary hover:text-text-primary"
              )}
            >
              {cat}
            </Link>
          ))}
        </div>

        {/* Featured Post (Only on Page 1) */}
        {featuredPost && currentPage === 1 && (
          <div className="mb-20">
            <Link href={`/blog/${featuredPost.slug}`} className="group grid grid-cols-1 lg:grid-cols-2 gap-12 items-center bg-background-surface border border-border-slate overflow-hidden hover:border-accent/30 transition-premium">
              <div className="aspect-video bg-background-elevated relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-background-primary/80 to-transparent" />
                <div className="absolute inset-0 bg-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                <div className="absolute inset-x-8 bottom-8">
                   <span className="text-[10px] font-mono uppercase tracking-widest text-accent mb-2 block">// Featured Post</span>
                   <h2 className="text-3xl md:text-4xl font-display font-bold uppercase group-hover:text-accent transition-colors leading-tight text-text-primary">
                    {featuredPost.title}
                   </h2>
                </div>
              </div>
              <div className="p-8 lg:p-12 space-y-6">
                <p className="text-text-secondary text-lg leading-relaxed">
                  {featuredPost.excerpt}
                </p>
                <div className="flex items-center gap-6 text-[10px] font-mono uppercase tracking-widest text-text-tertiary">
                  <span>{new Date(featuredPost.publishedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                  <span>{featuredPost.readingTime} min read</span>
                </div>
                <span className="inline-block py-2 text-accent border-b border-accent font-bold uppercase tracking-widest text-xs group-hover:translate-x-2 transition-transform">
                  Read Article
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
              className="group relative p-8 bg-background-surface border border-border-slate transition-all duration-500 flex flex-col justify-between h-[400px] overflow-hidden hover:border-accent/30"
            >
              <div className="relative z-10">
                <span className="text-[10px] font-mono uppercase tracking-widest text-accent mb-4 block">
                  {post.category}
                </span>
                <h3 className="text-2xl font-display font-bold uppercase group-hover:text-accent transition-colors leading-tight mb-4 text-text-primary">
                  {post.title}
                </h3>
                <p className="text-text-secondary text-sm leading-relaxed line-clamp-3">
                  {post.excerpt}
                </p>
              </div>
              <div className="relative z-10 flex items-center justify-between text-[10px] font-mono uppercase tracking-widest text-text-tertiary pt-6 border-t border-border-slate/50">
                <span>{new Date(post.publishedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                <span>{post.readingTime} min</span>
              </div>
            </Link>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-20 flex justify-center gap-4">
            {Array.from({ length: totalPages }).map((_, i) => (
              <Link 
                key={i}
                href={`/blog?category=${encodeURIComponent(selectedCategory)}&page=${i + 1}`}
                className={cn(
                  "w-12 h-12 flex items-center justify-center font-mono text-[10px] border border-border-slate hover:border-accent transition-colors",
                  currentPage === i + 1 ? "bg-accent text-background-primary border-accent" : "text-text-tertiary"
                )}
              >
                {i + 1}
              </Link>
            ))}
          </div>
        )}

        {/* RSS Link */}
        <div className="mt-32 text-center">
          <Link href="/blog/rss.xml" className="text-[10px] font-mono uppercase tracking-widest text-text-tertiary hover:text-accent transition-colors flex items-center justify-center gap-2">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M6.18,15.64A2.18,2.18,0,0,1,8.36,17.82,2.18,2.18,0,0,1,6.18,20,2.18,2.18,0,0,1,4,17.82,2.18,2.18,0,0,1,6.18,15.64ZM4,4.44A15.56,15.56,0,0,1,19.56,20h-2.83A12.73,12.73,0,0,0,4,7.27Zm0,5.66a9.9,9.9,0,0,1,9.9,9.9H11.07A7.17,7.17,0,0,0,4,12.93Z"/></svg>
            Subscribe via RSS
          </Link>
        </div>
      </div>
    </div>
  );
}

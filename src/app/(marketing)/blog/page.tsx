import { Metadata } from "next";
import { getMetadata } from "@/lib/metadata";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { BLOG_POSTS } from "@/lib/data/blog-posts";

export const metadata: Metadata = getMetadata({
  title: "Insights | Market Analysis & Trading Education",
  description: "Market analysis, trading education, and honest commentary from the Drawdown team. No hype, just edge.",
});

const categories = ["All", "Market Analysis", "Education", "Psychology"];

export default function BlogListingPage() {
  const posts = BLOG_POSTS;
  
  return (
    <div className="pt-32 pb-24 bg-background-primary min-h-screen">
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
          {categories.map((cat) => (
            <button 
              key={cat}
              className={cn(
                "px-4 py-2 text-[10px] font-bold uppercase tracking-widest transition-colors",
                cat === "All" ? "bg-accent text-background-primary" : "text-text-tertiary hover:text-text-primary"
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Featured Post */}
        <div className="mb-20">
          <Link href={`/blog/${posts[0].slug}`} className="group grid grid-cols-1 lg:grid-cols-2 gap-12 items-center bg-background-surface border border-border-slate overflow-hidden hover:border-accent/30 transition-premium">
            <div className="aspect-video bg-background-elevated relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-t from-background-primary/80 to-transparent" />
              <div className="absolute inset-0 bg-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              <div className="absolute inset-x-8 bottom-8">
                 <span className="text-[10px] font-mono uppercase tracking-widest text-accent mb-2 block">// Featured Post</span>
                 <h2 className="text-3xl md:text-4xl font-display font-bold uppercase group-hover:text-accent transition-colors leading-tight text-text-primary">
                  {posts[0].title}
                 </h2>
              </div>
            </div>
            <div className="p-8 lg:p-12 space-y-6">
              <p className="text-text-secondary text-lg leading-relaxed">
                {posts[0].excerpt}
              </p>
              <div className="flex items-center gap-6 text-[10px] font-mono uppercase tracking-widest text-text-tertiary">
                <span>{new Date(posts[0].publishedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                <span>{posts[0].readingTime} min read</span>
              </div>
              <span className="inline-block py-2 text-accent border-b border-accent font-bold uppercase tracking-widest text-xs group-hover:translate-x-2 transition-transform">
                Read Article
              </span>
            </div>
          </Link>
        </div>

        {/* Post Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.slice(1).map((post) => (
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
                <span>{new Date(post.publishedAt).toLocaleDateString('en-GB', { day: 'short', month: 'short', year: 'numeric' })}</span>
                <span>{post.readingTime} min</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

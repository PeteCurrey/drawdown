import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getMetadata } from "@/lib/metadata";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { StructuredData } from "@/components/StructuredData";
import { blogPosts } from "@/data/blog";
import Link from "next/link";
import { Clock, Calendar, ChevronLeft, Share2 } from "lucide-react";

interface Props {
  params: { slug: string };
}

export async function generateStaticParams() {
  return blogPosts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);
  if (!post) return {};
  return getMetadata({
    title: post.title,
    description: post.excerpt,
    path: `/blog/${post.slug}`,
  });
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);
  if (!post) notFound();

  const articleSchema = {
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    author: {
      "@type": "Person",
      "name": post.author,
    },
    image: post.ogImage || "https://drawdown.trade/og/default.png",
  };

  return (
    <div className="pt-32 pb-24 bg-background-primary min-h-screen">
      <div className="container mx-auto px-6">
        <Breadcrumbs />
        <StructuredData type="Article" data={articleSchema} />

        <div className="max-w-4xl mx-auto">
          <Link href="/blog" className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-text-tertiary hover:text-accent transition-colors mb-12 group">
            <ChevronLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" /> Back to Insights
          </Link>

          <header className="space-y-8 mb-16">
            <span className="inline-block px-3 py-1 bg-accent/10 border border-accent/20 text-accent text-[10px] font-mono uppercase tracking-widest">
              {post.category}
            </span>
            <h1 className="text-4xl md:text-7xl font-display font-bold uppercase leading-tight">
              {post.title}
            </h1>
            <div className="flex flex-wrap items-center gap-8 text-[10px] font-mono uppercase tracking-widest text-text-tertiary border-y border-border-slate py-6">
              <div className="flex items-center gap-2"><Calendar className="w-3 h-3 text-accent" /> {post.date}</div>
              <div className="flex items-center gap-2"><Clock className="w-3 h-3 text-accent" /> {post.readingTime} read</div>
              <div className="flex items-center gap-1 cursor-pointer hover:text-accent transition-colors"><Share2 className="w-3 h-3" /> Share</div>
            </div>
          </header>

          <article 
            className="prose prose-invert prose-drawdown max-w-none prose-headings:font-display prose-headings:uppercase prose-h2:text-3xl prose-h2:mt-12 prose-h3:text-xl prose-p:text-text-secondary prose-p:leading-relaxed prose-p:text-lg prose-strong:text-text-primary prose-blockquote:border-l-4 prose-blockquote:border-accent prose-blockquote:bg-background-elevated/30 prose-blockquote:p-6 prose-blockquote:italic"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* CTA Section */}
          <div className="mt-24 p-12 bg-background-elevated border border-border-slate relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-1 h-full bg-accent" />
            <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
              <div className="space-y-4">
                <h4 className="text-2xl font-display font-bold uppercase">Ready to trade properly?</h4>
                <p className="text-text-secondary text-sm max-w-md">
                  Join 2,000+ traders using our AI tools and structured curriculum. Start your free trial today.
                </p>
              </div>
              <Link 
                href="/signup" 
                className="px-10 py-4 bg-accent text-background-primary font-bold uppercase tracking-widest text-[10px] hover:bg-accent-hover transition-colors whitespace-nowrap"
              >
                Join Now
              </Link>
            </div>
          </div>

          <div className="mt-12 p-8 border border-border-slate flex items-start gap-6">
             <div className="w-16 h-16 bg-background-elevated border border-border-slate flex items-center justify-center shrink-0">
               <span className="text-xl font-display font-black text-accent/20">P</span>
             </div>
             <div className="space-y-2">
               <h5 className="text-sm font-display font-bold uppercase">{post.author}</h5>
               <p className="text-xs text-text-tertiary leading-relaxed">
                 Professional trader and founder of Drawdown. Focusing on technical analysis, market geometry, and the psychology of discipline.
               </p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}

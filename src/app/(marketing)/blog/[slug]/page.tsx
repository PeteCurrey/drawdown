import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getMetadata } from "@/lib/metadata";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { StructuredData } from "@/components/StructuredData";
import { getAllPosts, getPostBySlug } from "@/lib/blog";
import { MDXRemote } from "next-mdx-remote/rsc";
import Link from "next/link";
import { Clock, Calendar, ChevronLeft, Share2, ArrowRight } from "lucide-react";
import { TrackPageView } from "@/components/admin/TrackPageView";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};
  
  const baseMetadata = getMetadata({
    title: `${post.title} | Drawdown Blog`,
    description: post.excerpt,
    path: `/blog/${post.slug}`,
  });

  return {
    ...baseMetadata,
    openGraph: {
      ...baseMetadata.openGraph,
      type: "article",
      publishedTime: new Date(post.publishedAt).toISOString(),
      modifiedTime: new Date((post as any).updatedAt || post.publishedAt).toISOString(),
      authors: ["Pete Currey"],
    },
  };
}

function extractHeadings(content: string) {
  const headingRegex = /^## (.*$)/gim;
  const headings = [];
  let match;
  while ((match = headingRegex.exec(content)) !== null) {
    headings.push(match[1]);
  }
  return headings;
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  
  if (!post) notFound();

  const allPosts = getAllPosts();
  const relatedPosts = allPosts
    .filter(p => p.slug !== slug && p.category === post.category)
    .slice(0, 3);

  const headings = extractHeadings(post.content);
  const showTOC = post.content.split(' ').length > 800 && headings.length > 0;

  const articleSchema = {
    "@context": "https://schema.org",
    headline: post.title,
    description: post.excerpt,
    image: "https://drawdown.trading/og/default-og.png",
    author: {
      "@type": "Person",
      "name": "Pete Currey",
      "url": "https://drawdown.trading/about"
    },
    publisher: {
      "@type": "Organization",
      "name": "Drawdown",
      "logo": {
        "@type": "ImageObject",
        "url": "https://drawdown.trading/og/default-og.png"
      }
    },
    datePublished: new Date(post.publishedAt).toISOString(),
    dateModified: new Date((post as any).updatedAt || post.publishedAt).toISOString(),
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://drawdown.trading/blog/${post.slug}`
    }
  };

  return (
    <div className="pt-28 pb-24 bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-6">
        <Breadcrumbs />
        <TrackPageView path={`/blog/${slug}`} />
        <StructuredData type="Article" data={articleSchema} />

        <div className="max-w-4xl mx-auto">
          <Link href="/blog" className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-mkt-i4 hover:text-accent transition-colors mb-12 group">
            <ChevronLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" /> Back to Insights
          </Link>

          <header className="space-y-8 mb-16">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 bg-accent/10 border border-mkt-bd/20 text-accent text-[10px] font-mono uppercase tracking-widest">
                {post.category}
              </span>
              <span className="text-[10px] font-mono text-mkt-i4 uppercase tracking-widest">
                By {post.author}
              </span>
            </div>
            
            <h1 className="text-4xl md:text-7xl font-sans font-bold uppercase leading-[1.1] text-mkt-ink tracking-tight">
              {post.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-8 text-[10px] font-mono uppercase tracking-widest text-mkt-i4 border-y border-mkt-bd py-6">
              <div className="flex items-center gap-2">
                <Calendar className="w-3 h-3 text-accent" /> 
                {new Date(post.publishedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-3 h-3 text-accent" /> 
                {post.readingTime} min read
              </div>
              <div className="flex items-center gap-1 cursor-pointer hover:text-accent transition-colors">
                <Share2 className="w-3 h-3" /> 
                Share Insight
              </div>
            </div>
          </header>

          {/* Table of Contents */}
          {showTOC && (
            <div className="mb-16 p-8 bg-white border border-mkt-bd">
               <h4 className="text-[10px] font-mono uppercase tracking-widest text-accent mb-6 font-bold">// Table of Contents</h4>
               <ul className="space-y-4">
                  {headings.map((heading, i) => (
                    <li key={i}>
                      <a 
                        href={`#${heading.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}
                        className="text-sm text-mkt-i2 hover:text-accent transition-colors flex items-center gap-3"
                      >
                        <span className="text-[10px] font-mono text-mkt-i4">0{i+1}</span>
                        {heading}
                      </a>
                    </li>
                  ))}
               </ul>
            </div>
          )}

          <article 
            className="prose prose-invert prose-drawdown max-w-none 
              prose-headings:font-sans prose-headings:uppercase prose-headings:text-mkt-ink
              prose-h2:text-3xl prose-h2:mt-16 prose-h2:mb-8 prose-h2:pt-16 prose-h2:border-t prose-h2:border-mkt-bd/30
              prose-h3:text-xl prose-h3:mt-10
              prose-p:text-mkt-i2 prose-p:leading-relaxed prose-p:text-lg prose-p:mb-8
              prose-strong:text-mkt-ink prose-strong:font-bold
              prose-blockquote:border-l-4 prose-blockquote:border-mkt-bd prose-blockquote:bg-[#F7F7F7]/30 prose-blockquote:p-8 prose-blockquote:italic prose-blockquote:text-mkt-ink
              prose-ul:list-disc prose-ul:pl-6 prose-ul:mb-10
              prose-li:text-mkt-i2 prose-li:mb-4
              prose-a:text-accent prose-a:underline hover:prose-a:text-accent-hover"
          >
            <MDXRemote source={post.content} />
          </article>

          {/* Author Bio */}
          <div className="mt-24 p-10 bg-white border border-mkt-bd relative overflow-hidden">
             <div className="absolute top-0 right-0 w-24 h-24 opacity-[0.03] pointer-events-none">
                <svg className="w-full h-full" fill="currentColor" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
             </div>
             <div className="flex flex-col md:flex-row items-center md:items-start gap-8 relative z-10">
                <div className="w-24 h-24 bg-white border border-mkt-bd flex items-center justify-center shrink-0">
                  <span className="text-3xl font-sans font-black text-mkt-grn">PC</span>
                </div>
                <div className="space-y-4 text-center md:text-left">
                   <div>
                      <h5 className="text-xl font-sans font-bold uppercase text-mkt-ink">Pete Currey</h5>
                      <p className="text-[10px] font-mono uppercase tracking-widest text-accent">Founder of Drawdown // 15+ Years Trading</p>
                   </div>
                   <p className="text-sm text-mkt-i2 leading-relaxed">
                      Professional trader and algorithmic systems architect. Pete built Drawdown to strip away the marketing fluff of the retail industry and focus on the cold reality of institutional risk management.
                   </p>
                   <Link href="/about" className="inline-flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-mkt-i4 hover:text-accent transition-colors">
                      Read Pete's Full Story <ArrowRight className="w-3 h-3" />
                   </Link>
                </div>
             </div>
          </div>

          {/* Related Posts */}
          {relatedPosts.length > 0 && (
            <div className="mt-32 space-y-12">
               <h4 className="text-[10px] font-mono uppercase tracking-widest text-mkt-i4 border-b border-mkt-bd pb-4">// Related Insights</h4>
               <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {relatedPosts.map(p => (
                    <Link key={p.slug} href={`/blog/${p.slug}`} className="group space-y-4">
                       <span className="text-[8px] font-mono uppercase tracking-widest text-accent">{p.category}</span>
                       <h5 className="text-lg font-sans font-bold uppercase leading-tight group-hover:text-accent transition-colors">{p.title}</h5>
                       <p className="text-xs text-mkt-i4 line-clamp-2">{p.excerpt}</p>
                    </Link>
                  ))}
               </div>
            </div>
          )}

          {/* Final CTA */}
          <div className="mt-32 p-12 bg-[#F7F7F7] border border-mkt-bd relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-1 h-full bg-accent" />
            <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
              <div className="space-y-4">
                <h4 className="text-3xl font-sans font-bold uppercase text-mkt-ink leading-none">Stop Gambling. <br /> Start Trading.</h4>
                <p className="text-mkt-i2 text-sm max-w-md">
                  Start mastering the business of risk with our institutional-grade tools and education.
                </p>
              </div>
              <Link 
                href="/signup" 
                className="px-10 py-5 bg-mkt-ink text-white font-bold uppercase tracking-widest text-[10px] hover:bg-accent-hover transition-all shadow-xl shadow-accent/20 whitespace-nowrap"
              >
                Create Free Account
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

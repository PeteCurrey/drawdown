import React from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getMetadata } from "@/lib/metadata";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { StructuredData } from "@/components/StructuredData";
import { getAllPosts, getPostBySlug } from "@/lib/blog";
import { MDXRemote } from "next-mdx-remote/rsc";
import Link from "next/link";
import { Clock, Calendar, ChevronLeft, ArrowRight } from "lucide-react";
import { TrackPageView } from "@/components/admin/TrackPageView";
import { Callout, BlogChart, BlogTable, KeyTakeaways } from "@/components/blog/MDXComponents";
import { TableOfContents } from "@/components/blog/TableOfContents";
import { ShareButton } from "@/components/blog/ShareButton";

export const dynamicParams = true;
export const revalidate = 3600; // hourly cache revalidation

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.slice(0, 10).map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};
  
  const baseMetadata = getMetadata({
    title: post.metaTitle,
    description: post.metaDescription,
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
      images: [
        {
          url: post.image,
          width: 1200,
          height: 630,
          alt: post.title,
        }
      ]
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

const CATEGORY_IMAGES: Record<string, string> = {
  "Market Analysis": "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?q=80&w=1200&auto=format&fit=crop",
  "Education": "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=1200&auto=format&fit=crop",
  "Psychology": "https://images.unsplash.com/photo-1507413245164-6160d8298b31?q=80&w=1200&auto=format&fit=crop",
  "Tools": "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop",
  "UK Trading": "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?q=80&w=1200&auto=format&fit=crop",
  "Risk Management": "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=1200&auto=format&fit=crop",
};

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

  const postImage = post.image;

  const articleSchema = {
    "@context": "https://schema.org",
    headline: post.title,
    description: post.excerpt,
    image: postImage,
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

  const components = {
    h2: ({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => {
      const text = React.Children.toArray(children).join("");
      const id = text.toLowerCase().replace(/[^a-z0-9]+/g, "-");
      return <h2 id={id} {...props}>{children}</h2>;
    },
    h3: ({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => {
      const text = React.Children.toArray(children).join("");
      const id = text.toLowerCase().replace(/[^a-z0-9]+/g, "-");
      return <h3 id={id} {...props}>{children}</h3>;
    },
    Callout,
    BlogChart,
    BlogTable,
    KeyTakeaways,
  };

  return (
    <div className="pt-28 pb-24 min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <Breadcrumbs />
        <TrackPageView path={`/blog/${slug}`} />
        <StructuredData type="Article" data={articleSchema} />

        <div className="max-w-6xl mx-auto mt-6">
          <Link href="/blog" className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-text-tertiary hover:text-accent transition-colors mb-8 group w-fit">
            <ChevronLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" /> Back to Insights
          </Link>

          <header className="space-y-6 mb-10">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 bg-accent/15 border border-accent/20 text-slate-800 text-[10px] font-mono uppercase tracking-widest rounded">
                {post.category}
              </span>
              <span className="text-[10px] font-mono text-text-tertiary uppercase tracking-widest">
                By {post.author}
              </span>
            </div>
            
            <h1 className="text-3xl md:text-6xl font-sans font-black uppercase leading-[1.05] text-slate-900 tracking-tight max-w-4xl">
              {post.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-6 text-[10px] font-mono uppercase tracking-widest text-text-tertiary border-y border-slate-100 py-4 mt-8">
              <div className="flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5 text-accent" /> 
                {new Date(post.publishedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-accent" /> 
                {post.readingTime} min read
              </div>
              <div className="flex items-center gap-2">
                <ShareButton />
              </div>
            </div>
          </header>

          {/* Featured Image */}
          <div className="w-full h-[240px] md:h-[420px] rounded-2xl overflow-hidden border border-slate-100 mb-12 relative group shadow-sm">
            <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-[1.01]" style={{ backgroundImage: `url(${postImage})` }} />
            <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
          </div>

          {/* Two-Column Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            {/* Main Content Column */}
            <div className="lg:col-span-8 space-y-12">
              {/* Mobile Table of Contents */}
              {showTOC && (
                <div className="lg:hidden p-6 bg-slate-50 border border-slate-200/80 rounded-xl">
                  <TableOfContents headings={headings} />
                </div>
              )}

              <article 
                className="prose prose-drawdown max-w-none prose-headings:font-sans prose-headings:uppercase prose-headings:text-slate-900 prose-h2:text-2xl prose-h2:mt-12 prose-h2:mb-6 prose-h2:pt-8 prose-h2:border-t prose-h2:border-slate-100 prose-h3:text-lg prose-h3:mt-8 prose-p:text-slate-600 prose-p:leading-relaxed prose-p:text-base prose-p:mb-6 prose-strong:text-slate-900 prose-strong:font-bold prose-blockquote:border-l-4 prose-blockquote:border-accent prose-blockquote:bg-slate-50 prose-blockquote:p-6 prose-blockquote:rounded-r-lg prose-blockquote:italic prose-blockquote:text-slate-700 prose-ul:list-disc prose-ul:pl-6 prose-ul:mb-6 prose-li:text-slate-600 prose-li:mb-2 prose-a:text-accent prose-a:font-semibold hover:prose-a:text-accent-hover"
              >
                <MDXRemote source={post.content} components={components} />
              </article>
            </div>

            {/* Sticky Sidebar Column */}
            <div className="lg:col-span-4 lg:sticky lg:top-24 space-y-8">
              {showTOC && (
                <div className="hidden lg:block p-6 bg-slate-50 border border-slate-200/80 rounded-xl shadow-sm">
                  <TableOfContents headings={headings} />
                </div>
              )}

              {/* Author Bio Card */}
              <div className="p-6 bg-slate-50 border border-slate-200/80 rounded-xl shadow-sm relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-16 h-16 opacity-[0.03] pointer-events-none">
                  <svg className="w-full h-full" fill="currentColor" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white border border-slate-200 rounded-lg flex items-center justify-center shadow-sm">
                      <span className="text-lg font-sans font-black text-accent">PC</span>
                    </div>
                    <div>
                      <h5 className="text-sm font-sans font-bold uppercase text-slate-800 leading-tight">Pete Currey</h5>
                      <p className="text-[9px] font-mono uppercase tracking-widest text-accent">Founder of Drawdown</p>
                    </div>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Professional trader and algorithmic systems architect. Pete built Drawdown to strip away retail noise and focus on cold institutional risk.
                  </p>
                  <Link href="/about" className="inline-flex items-center gap-1.5 text-[9px] font-mono uppercase tracking-widest text-slate-400 hover:text-accent transition-colors font-bold">
                    Pete's Story <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>

              {/* Sidebar CTA Card */}
              <div className="p-8 bg-slate-900 border border-slate-800 rounded-xl shadow-xl relative overflow-hidden group text-white">
                <div className="absolute inset-0 bg-cover bg-center opacity-10" style={{ backgroundImage: `url(https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=400)` }} />
                <div className="relative z-10 space-y-6">
                  <div className="space-y-2">
                    <h5 className="text-xl font-sans font-extrabold uppercase leading-tight tracking-tight">Stop Gambling. <br /> Start Trading.</h5>
                    <p className="text-slate-400 text-xs leading-relaxed">
                      Master risk with our professional suite of algorithmic tools and structured academies.
                    </p>
                  </div>
                  <Link href="/signup" className="block w-full py-3 bg-accent text-[#08090D] hover:bg-accent-hover text-center font-sans font-bold uppercase tracking-wider text-[10px] rounded-lg transition-colors shadow-lg shadow-accent/20">
                    Create Free Account
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Related Posts */}
          {relatedPosts.length > 0 && (
            <div className="mt-24 pt-12 border-t border-slate-100 space-y-8">
              <h4 className="text-[10px] font-mono uppercase tracking-widest text-text-tertiary">// Related Insights</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {relatedPosts.map(p => {
                  const relatedImage = p.image;
                  return (
                    <Link key={p.slug} href={`/blog/${p.slug}`} className="group space-y-4 flex flex-col">
                      <div className="aspect-video w-full rounded-xl overflow-hidden border border-slate-100 relative bg-slate-50 shrink-0">
                        <div className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105" style={{ backgroundImage: `url(${relatedImage})` }} />
                      </div>
                      <div className="space-y-2 flex-grow">
                        <span className="text-[8px] font-mono uppercase tracking-widest text-accent font-bold">{p.category}</span>
                        <h5 className="text-base font-sans font-bold uppercase leading-tight text-slate-800 group-hover:text-accent transition-colors">{p.title}</h5>
                        <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{p.excerpt}</p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

import React from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, Clock, Calendar } from "lucide-react";
import { MDXRemote } from "next-mdx-remote/rsc";

import { getAllPosts, getPostBySlug } from "@/lib/blog";
import { cn } from "@/lib/utils";
import { TrackPageView } from "@/components/admin/TrackPageView";
import { DatabaseBlogClient } from "../DatabaseBlogClient";
import JsonLd from "@/components/seo/JsonLd";
import { ReadingProgressBar } from "@/components/blog/ReadingProgressBar";
import { ShareBar } from "@/components/blog/ShareBar";
import { FaqAccordion } from "@/components/blog/FaqAccordion";
import { AuthorBio } from "@/components/blog/AuthorBio";
import { TableOfContents } from "@/components/blog/TableOfContents";
import { 
  Callout, 
  Chart, 
  Diagram, 
  DataTable, 
  PullQuote, 
  BlogChart, 
  BlogTable, 
  KeyTakeaways,
  TradingViewPromoSection,
  AffiliateMarketingSection
} from "@/components/blog/MDXComponents";

export const dynamicParams = true;
export const revalidate = 3600; // hourly cache revalidation

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  // Call notFound() so missing posts produce a clean 404, not a 200 with a
  // 'Post Not Found' title that Google may still crawl and index.
  if (!post) notFound();
  
  const seo = (post as any).seoSettings || {};
  
  return {
    title: seo.meta_title || post.metaTitle || post.title,
    description: seo.meta_description || post.metaDescription || post.excerpt,
    openGraph: {
      title: seo.og_title || post.title,
      description: seo.og_description || post.excerpt,
      type: 'article',
      publishedTime: post.publishedAt,
      modifiedTime: post.dateModified || post.publishedAt,
      authors: [post.author],
      images: [
        {
          url: post.image,
          width: 1200,
          height: 630,
          alt: post.title,
        }
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: seo.twitter_title || post.title,
      description: seo.twitter_description || post.excerpt,
      images: [post.image],
    }
  };
}

const components = {
  Callout,
  Chart,
  Diagram,
  DataTable,
  PullQuote,
  BlogChart,
  BlogTable,
  KeyTakeaways,
  TradingViewPromoSection,
  AffiliateMarketingSection,
};

function preprocessMDXContent(content: string): string {
  if (!content) return "";
  return content
    .replace(/\$\$([\s\S]*?)\$\$/g, (_, inner) => {
      const clean = inner
        .replace(/\\text\{([^}]+)\}/g, '$1')
        .replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g, '($1)/($2)')
        .replace(/\\times/g, '×')
        .replace(/\\div/g, '÷')
        .replace(/\\%/g, '%')
        .trim();
      return `\n\`\`\`\n${clean}\n\`\`\`\n`;
    })
    .replace(/\\text\{([^}]+)\}/g, '$1')
    .replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g, '($1)/($2)')
    .replace(/\\times/g, '×')
    .replace(/\\div/g, '÷')
    .replace(/\\%/g, '%');
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  let post;
  try {
    post = await getPostBySlug(slug);
  } catch (err) {
    console.error(`[Blog] Failed to fetch post for slug "${slug}":`, err);
    // Surface as a 500, not a silent notFound — the content exists but is unavailable.
    throw err;
  }

  if (!post) {
    notFound();
  }

  // Generate Table of Contents headings dynamically
  const headings = post.content
    .split("\n")
    .filter((line) => line.startsWith("## "))
    .map((line) => {
      const text = line.replace("## ", "").trim();
      const id = text.toLowerCase().replace(/[^a-z0-9]+/g, "-");
      return { text, id, level: 2 as const };
    });

  const showTOC = headings.length > 0;
  
  // Fetch related posts (same category, excluding current)
  const allPosts = await getAllPosts();
  const relatedPosts = allPosts
    .filter((p) => p.category === post.category && p.slug !== post.slug)
    .slice(0, 3);

  // Schema.org Article structured data
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    "headline": post.title,
    "image": post.image,
    "datePublished": post.publishedAt,
    "dateModified": post.dateModified || post.publishedAt,
    "author": {
      "@type": "Person",
      "name": post.author,
      "url": "https://drawdown.trading/about"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Drawdown",
      "logo": {
        "@type": "ImageObject",
        "url": "https://drawdown.trading/logo.png"
      }
    },
    "description": post.excerpt
  };

  // If this post is in the database, render the dynamic client view
  if ((post as any).isDatabasePost) {
    return <DatabaseBlogClient post={post} relatedPosts={[]} />;
  }

  const isDark = !!post.dark_background;

  return (
    <div className={cn(
      "pt-24 min-h-screen transition-colors duration-200",
      isDark ? "bg-[#0A0A0A] text-white/90 selection:bg-[#C8F135] selection:text-black" : "bg-white text-slate-900 selection:bg-accent/20"
    )}>
      <JsonLd data={articleSchema} />
      <TrackPageView path={`/blog/${slug}`} />
      
      {/* Scroll indicator bar */}
      <ReadingProgressBar />
 
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Back navigation */}
        <div className="mb-8">
          <Link 
            href="/blog" 
            className={cn(
              "inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-widest transition-colors",
              isDark ? "text-[#A0A0A0] hover:text-[#C8F135]" : "text-text-tertiary hover:text-accent"
            )}
          >
            <ChevronLeft className="w-3.5 h-3.5" /> Back to Insights
          </Link>
        </div>

        {/* Content Container */}
        <div className="max-w-4xl mx-auto">
          {/* Category & Breadcrumb */}
          <span className={cn(
            "font-mono text-[9px] uppercase tracking-widest font-bold block mb-4",
            isDark ? "text-[#C8F135]" : "text-accent"
          )}>
            Insights // {post.category}
          </span>

          <h1 className={cn(
            "text-4xl md:text-5xl font-display font-black uppercase leading-tight tracking-tight mb-8",
            isDark ? "text-white" : "text-slate-900"
          )}>
            {post.title}
          </h1>

          {/* Author/Date row */}
          <header className={cn(
            "flex flex-wrap items-center justify-between gap-6 py-6 border-y mb-12 text-xs font-mono",
            isDark ? "border-[#1A1A1A] text-zinc-400" : "border-[#E5E5E5] text-text-tertiary"
          )}>
            <div className="flex items-center gap-2">
              <span className={isDark ? "text-white font-bold" : "text-slate-900 font-bold"}>{post.author}</span>
              <span className={isDark ? "text-zinc-800" : "text-slate-300"}>/</span>
              <time dateTime={post.publishedAt}>
                {new Date(post.publishedAt).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </time>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <Calendar className={cn("w-3 h-3", isDark ? "text-[#C8F135]" : "text-accent")} /> 
                Updated {new Date(post.dateModified || post.publishedAt).toLocaleDateString("en-GB", { month: "short", year: "numeric" })}
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className={cn("w-3 h-3", isDark ? "text-[#C8F135]" : "text-accent")} /> 
                {post.readingTime} min read
              </div>
            </div>
          </header>

          {/* Hero Image Component */}
          <figure className="w-full mb-12 relative group shadow-sm">
            <div className={cn(
              "aspect-[1200/630] w-full overflow-hidden border rounded-none",
              isDark ? "border-[#1A1A1A] bg-[#111111]" : "border-[#E5E5E5]"
            )}>
              <img 
                src={post.heroImage.src} 
                alt={post.heroImage.alt}
                className="w-full h-full object-cover block"
              />
            </div>
            {post.heroImage.caption && (
              <figcaption className={cn(
                "font-mono text-[9px] uppercase tracking-wider leading-relaxed mt-2.5",
                isDark ? "text-[#A0A0A0]" : "text-text-secondary"
              )}>
                {post.heroImage.caption} {post.heroImage.credit && <span className={isDark ? "text-zinc-600 font-light" : "text-text-tertiary font-light"}>| Credit: {post.heroImage.credit}</span>}
              </figcaption>
            )}
          </figure>

          {/* Two-Column Grid layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            {/* Main Content Column */}
            <div className="lg:col-span-8 space-y-12">
              {/* Mobile Table of Contents */}
              {showTOC && (
                <div className="lg:hidden">
                  <TableOfContents headings={headings} isDark={isDark} />
                </div>
              )}

              <article 
                className={cn(
                  "font-ibm-sans max-w-none prose prose-headings:font-display prose-headings:uppercase",
                  isDark
                    ? "prose-invert prose-headings:text-white prose-p:text-white/80 prose-p:leading-relaxed prose-p:text-base prose-p:mb-6 prose-strong:text-white prose-strong:font-bold prose-blockquote:border-l-4 prose-blockquote:border-[#C8F135] prose-blockquote:bg-[#111111] prose-blockquote:p-6 prose-blockquote:rounded-none prose-blockquote:italic prose-blockquote:text-white/90 prose-ul:list-disc prose-ul:pl-6 prose-ul:mb-6 prose-li:text-white/80 prose-li:mb-2 prose-a:text-[#C8F135] prose-a:font-semibold hover:prose-a:text-white prose-h2:text-2xl prose-h2:mt-12 prose-h2:mb-6 prose-h2:pt-8 prose-h2:border-t prose-h2:border-[#1A1A1A] prose-h3:text-lg prose-h3:mt-8"
                    : "prose-drawdown prose-headings:text-slate-900 prose-h2:text-2xl prose-h2:mt-12 prose-h2:mb-6 prose-h2:pt-8 prose-h2:border-t prose-h2:border-[#E5E5E5] prose-h3:text-lg prose-h3:mt-8 prose-p:text-slate-600 prose-p:leading-relaxed prose-p:text-base prose-p:mb-6 prose-strong:text-slate-900 prose-strong:font-bold prose-blockquote:border-l-4 prose-blockquote:border-accent prose-blockquote:bg-slate-50 prose-blockquote:p-6 prose-blockquote:rounded-none prose-blockquote:italic prose-blockquote:text-slate-700 prose-ul:list-disc prose-ul:pl-6 prose-ul:mb-6 prose-li:text-slate-600 prose-li:mb-2 prose-a:text-accent prose-a:font-semibold hover:prose-a:text-accent-hover"
                )}
              >
                <MDXRemote source={preprocessMDXContent(post.content)} components={components} />
              </article>

              {/* TradingView Promo Section */}
              <TradingViewPromoSection />

              {/* Dynamic Partner / Broker / Prop Firm Marketing Section */}
              <AffiliateMarketingSection />

              {/* FaqAccordion Component */}
              {post.faq && post.faq.length > 0 && (
                <FaqAccordion faqs={post.faq} isDark={isDark} />
              )}

              {/* Inter-linking callouts to dynamic resources */}
              {(() => {
                const mapping = post.relatedCourse ? {
                  href: `/courses/${post.relatedCourse}`,
                  label: `Courses // Lesson: ${post.title}`,
                  description: `Take a structured, professional step with our curated course modules. Start learning risk modeling and trade plans.`,
                  cta: "Start Lesson"
                } : post.relatedTool ? {
                  href: `/tools/${post.relatedTool}`,
                  label: `Tools // Sandbox: ${post.title}`,
                  description: `Integrate proprietary intelligence systems into your daily routine to standardize risk parameters.`,
                  cta: "Use AI Tool"
                } : null;

                if (!mapping) return null;

                return (
                  <div className={cn(
                    "mt-12 p-8 border rounded-none space-y-4 shadow-sm relative overflow-hidden",
                    isDark ? "bg-[#111111] border-[#1A1A1A]" : "border-accent/20 bg-slate-50"
                  )}>
                    <div className={cn(
                      "absolute top-0 left-0 w-2 h-full",
                      isDark ? "bg-[#C8F135]" : "bg-accent"
                    )} />
                    <span className={cn(
                      "font-mono text-[9px] font-bold uppercase tracking-widest block",
                      isDark ? "text-zinc-500" : "text-text-tertiary"
                    )}>// Dynamic Integration Resource</span>
                    <h4 className={cn(
                      "text-lg font-mono font-bold uppercase",
                      isDark ? "text-white" : "text-slate-800"
                    )}>{mapping.label}</h4>
                    <p className={cn(
                      "text-xs leading-relaxed max-w-2xl font-sans",
                      isDark ? "text-zinc-400" : "text-slate-555"
                    )}>{mapping.description}</p>
                    <Link 
                      href={mapping.href} 
                      className={cn(
                        "inline-flex items-center gap-2 text-[10px] font-mono font-bold uppercase tracking-widest transition-colors mt-2",
                        isDark ? "text-[#C8F135] hover:text-white" : "text-accent hover:text-accent-hover"
                      )}
                    >
                      {mapping.cta} &rarr;
                    </Link>
                  </div>
                );
              })()}
            </div>

            {/* Sticky Sidebar Column */}
            <div className="lg:col-span-4 lg:sticky lg:top-24 space-y-8">
              {showTOC && (
                <TableOfContents headings={headings} isDark={isDark} />
              )}

              <ShareBar title={post.title} isDark={isDark} />

              <AuthorBio author={post.author as "Pete Currey" | "Drawdown Team"} isDark={isDark} />

              {/* Sidebar CTA Card (zero border-radius) */}
              <div className="p-8 bg-slate-900 border border-slate-800 rounded-none shadow-xl relative overflow-hidden group text-white">
                <div className="absolute inset-0 bg-cover bg-center opacity-10" style={{ backgroundImage: `url(https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=400)` }} />
                <div className="relative z-10 space-y-6">
                  <div className="space-y-2">
                    <h5 className="text-xl font-display font-black uppercase leading-tight tracking-tight">Stop Gambling. <br /> Start Trading.</h5>
                    <p className="text-slate-400 text-xs leading-relaxed font-sans">
                      Master risk with our professional suite of algorithmic tools and structured academies.
                    </p>
                  </div>
                  <Link href="/signup" className="block w-full py-3 bg-accent text-[#08090D] hover:bg-cyan-400 text-center font-mono font-bold uppercase tracking-wider text-[10px] rounded-none transition-colors shadow-lg">
                    Create Free Account
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Related Insights Grid */}
          {relatedPosts.length > 0 && (
            <div className={cn(
              "mt-24 pt-12 border-t space-y-8",
              isDark ? "border-[#1A1A1A]" : "border-[#E5E5E5]"
            )}>
              <h4 className={cn(
                "font-mono text-[9px] uppercase tracking-widest font-bold",
                isDark ? "text-zinc-500" : "text-text-tertiary"
              )}>// Related Insights</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {relatedPosts.map(p => (
                  <Link key={p.slug} href={`/blog/${p.slug}`} className="group space-y-4 flex flex-col">
                    <div className={cn(
                      "aspect-video w-full rounded-none overflow-hidden border relative shrink-0",
                      isDark ? "border-[#1A1A1A] bg-[#111111]" : "border-[#E5E5E5] bg-slate-50"
                    )}>
                      <div className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-103" style={{ backgroundImage: `url(${p.image})` }} />
                    </div>
                    <div className="space-y-2 flex-grow">
                      <span className={cn(
                        "font-mono text-[8px] uppercase tracking-widest font-bold",
                        isDark ? "text-[#C8F135]" : "text-accent"
                      )}>{p.category}</span>
                      <h5 className={cn(
                        "text-base font-display font-bold uppercase leading-tight transition-colors",
                        isDark ? "text-white group-hover:text-[#C8F135]" : "text-slate-800 group-hover:text-accent"
                      )}>{p.title}</h5>
                      <p className={cn(
                        "text-xs line-clamp-2 leading-relaxed font-sans",
                        isDark ? "text-zinc-400" : "text-slate-555"
                      )}>{p.excerpt}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

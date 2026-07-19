import React from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, Clock, Calendar } from "lucide-react";
import { MDXRemote } from "next-mdx-remote/rsc";

import { getAllPosts, getPostBySlug } from "@/lib/blog";
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
  KeyTakeaways 
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
};

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

  return (
    <div className="pt-24 min-h-screen bg-white text-slate-900 selection:bg-accent/20">
      <JsonLd data={articleSchema} />
      <TrackPageView path={`/blog/${slug}`} />
      
      {/* Scroll indicator bar */}
      <ReadingProgressBar />

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Back navigation */}
        <div className="mb-8">
          <Link 
            href="/blog" 
            className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-widest text-text-tertiary hover:text-accent transition-colors"
          >
            <ChevronLeft className="w-3.5 h-3.5" /> Back to Insights
          </Link>
        </div>

        {/* Content Container */}
        <div className="max-w-4xl mx-auto">
          {/* Category & Breadcrumb */}
          <span className="font-mono text-[9px] uppercase tracking-widest text-accent font-bold block mb-4">
            Insights // {post.category}
          </span>

          <h1 className="text-4xl md:text-5xl font-display font-black uppercase text-slate-900 leading-tight tracking-tight mb-8">
            {post.title}
          </h1>

          {/* Author/Date row */}
          <header className="flex flex-wrap items-center justify-between gap-6 py-6 border-y border-[#E5E5E5] mb-12 text-xs font-mono text-text-tertiary">
            <div className="flex items-center gap-2">
              <span className="text-slate-900 font-bold">{post.author}</span>
              <span className="text-slate-300">/</span>
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
                <Calendar className="w-3 h-3 text-accent" /> 
                Updated {new Date(post.dateModified || post.publishedAt).toLocaleDateString("en-GB", { month: "short", year: "numeric" })}
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="w-3 h-3 text-accent" /> 
                {post.readingTime} min read
              </div>
            </div>
          </header>

          {/* Hero Image Component */}
          <figure className="w-full mb-12 relative group shadow-sm">
            <div className="aspect-[1200/630] w-full overflow-hidden border border-[#E5E5E5] rounded-none">
              <img 
                src={post.heroImage.src} 
                alt={post.heroImage.alt}
                className="w-full h-full object-cover block"
              />
            </div>
            {post.heroImage.caption && (
              <figcaption className="font-mono text-[9px] text-text-secondary uppercase tracking-wider leading-relaxed mt-2.5">
                {post.heroImage.caption} {post.heroImage.credit && <span className="text-text-tertiary font-light">| Credit: {post.heroImage.credit}</span>}
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
                  <TableOfContents headings={headings} />
                </div>
              )}

              <article 
                className="prose prose-drawdown font-ibm-sans max-w-none prose-headings:font-display prose-headings:uppercase prose-headings:text-slate-900 prose-h2:text-2xl prose-h2:mt-12 prose-h2:mb-6 prose-h2:pt-8 prose-h2:border-t prose-h2:border-[#E5E5E5] prose-h3:text-lg prose-h3:mt-8 prose-p:text-slate-600 prose-p:leading-relaxed prose-p:text-base prose-p:mb-6 prose-strong:text-slate-900 prose-strong:font-bold prose-blockquote:border-l-4 prose-blockquote:border-accent prose-blockquote:bg-slate-50 prose-blockquote:p-6 prose-blockquote:rounded-none prose-blockquote:italic prose-blockquote:text-slate-700 prose-ul:list-disc prose-ul:pl-6 prose-ul:mb-6 prose-li:text-slate-600 prose-li:mb-2 prose-a:text-accent prose-a:font-semibold hover:prose-a:text-accent-hover"
              >
                <MDXRemote source={post.content} components={components} />
              </article>

              {/* FaqAccordion Component */}
              {post.faq && post.faq.length > 0 && (
                <FaqAccordion faqs={post.faq} />
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
                  <div className="mt-12 p-8 border border-accent/20 bg-slate-50 rounded-none space-y-4 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-2 h-full bg-accent" />
                    <span className="font-mono text-[9px] font-bold uppercase tracking-widest text-text-tertiary block font-bold">// Dynamic Integration Resource</span>
                    <h4 className="text-lg font-mono font-bold uppercase text-slate-800">{mapping.label}</h4>
                    <p className="text-xs text-slate-555 leading-relaxed max-w-2xl font-sans">{mapping.description}</p>
                    <Link 
                      href={mapping.href} 
                      className="inline-flex items-center gap-2 text-[10px] font-mono font-bold uppercase tracking-widest text-accent hover:text-accent-hover transition-colors mt-2"
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
                <TableOfContents headings={headings} />
              )}

              <ShareBar title={post.title} />

              <AuthorBio author={post.author as "Pete Currey" | "Drawdown Team"} />

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
            <div className="mt-24 pt-12 border-t border-[#E5E5E5] space-y-8">
              <h4 className="font-mono text-[9px] uppercase tracking-widest text-text-tertiary font-bold">// Related Insights</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {relatedPosts.map(p => (
                  <Link key={p.slug} href={`/blog/${p.slug}`} className="group space-y-4 flex flex-col">
                    <div className="aspect-video w-full rounded-none overflow-hidden border border-[#E5E5E5] relative bg-slate-50 shrink-0">
                      <div className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-103" style={{ backgroundImage: `url(${p.image})` }} />
                    </div>
                    <div className="space-y-2 flex-grow">
                      <span className="font-mono text-[8px] uppercase tracking-widest text-accent font-bold">{p.category}</span>
                      <h5 className="text-base font-display font-bold uppercase leading-tight text-slate-800 group-hover:text-accent transition-colors">{p.title}</h5>
                      <p className="text-xs text-slate-555 line-clamp-2 leading-relaxed font-sans">{p.excerpt}</p>
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

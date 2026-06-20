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
  if (!post) return { title: 'Post Not Found' };
  
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
          url: seo.og_image_url || post.image || "https://drawdown.trading/og/default-og.png",
          width: 1200,
          height: 630,
          alt: post.title
        }
      ]
    },
    alternates: {
      canonical: seo.canonical_url || `https://drawdown.trading/blog/${post.slug}`
    }
  };
}

// Extractor that returns H2/H3 headings for TOC
interface HeadingItem {
  text: string;
  id: string;
  level: 2 | 3;
}

function extractHeadings(content: string): HeadingItem[] {
  const headingRegex = /^(##|###) (.*$)/gim;
  const headings: HeadingItem[] = [];
  let match;
  while ((match = headingRegex.exec(content)) !== null) {
    const level = match[1].length as 2 | 3;
    const text = match[2].trim();
    const id = text.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    headings.push({ text, id, level });
  }
  return headings;
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  
  if (!post) notFound();

  // Dynamic Query: same category, excluding current, sorted by date descending, limit 3
  const allPosts = await getAllPosts();
  let relatedPosts = allPosts
    .filter(p => p.slug !== slug && p.category === post.category)
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice(0, 3);

  // Fallback to most recent site-wide if category doesn't have 3 related posts
  if (relatedPosts.length < 3) {
    const filler = allPosts
      .filter(p => p.slug !== slug && !relatedPosts.some(rp => rp.slug === p.slug))
      .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
    relatedPosts = [...relatedPosts, ...filler].slice(0, 3);
  }

  // Route to DatabaseBlogClient for HTML posts; MDX posts use the MDXRemote renderer below.
  if ((post as any).contentFormat !== 'mdx') {
    const seo = (post as any).seoSettings || {};
    const jsonLd = {
      "@context": "https://schema.org",
      "@type": seo.schema_type || "BlogPosting",
      "headline": post.title,
      "description": seo.meta_description || post.metaDescription || post.excerpt,
      "author": {
        "@type": "Person",
        "name": post.author,
        "jobTitle": (post as any).authorProfile?.role || "Founder",
        "worksFor": {
          "@type": "Organization",
          "name": "Drawdown",
          "url": "https://drawdown.trading"
        }
      },
      "publisher": {
        "@type": "Organization",
        "name": "Drawdown",
        "url": "https://drawdown.trading"
      },
      "datePublished": post.publishedAt,
      "dateModified": post.dateModified || post.publishedAt,
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": seo.canonical_url || `https://drawdown.trading/blog/${post.slug}`
      }
    };

    return (
      <>
        <TrackPageView path={`/blog/${slug}`} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <DatabaseBlogClient post={post as any} relatedPosts={relatedPosts} isDark={(post as any).dark_background ?? false} />
      </>
    );
  }

  const headings = extractHeadings(post.content);
  // TOC only renders when readTime is 7 minutes or more
  const showTOC = post.readingTime >= 7 && headings.length > 0;

  const components = {
    h1: () => null, // Suppress MDX body H1 to solve duplicate H1 issue
    h2: ({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => {
      const text = React.Children.toArray(children).join("");
      const id = text.toLowerCase().replace(/[^a-z0-9]+/g, "-");
      return <h2 id={id} className="font-display font-black uppercase text-slate-900 border-t border-[#E5E5E5] pt-8 mt-12 mb-6 text-xl sm:text-2xl" {...props}>{children}</h2>;
    },
    h3: ({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => {
      const text = React.Children.toArray(children).join("");
      const id = text.toLowerCase().replace(/[^a-z0-9]+/g, "-");
      return <h3 id={id} className="font-display font-extrabold uppercase text-slate-800 mt-8 mb-4 text-sm sm:text-base" {...props}>{children}</h3>;
    },
    Callout,
    Chart,
    Diagram,
    DataTable,
    PullQuote,
    BlogChart,
    BlogTable,
    KeyTakeaways
  };

  return (
    <div className="pt-28 pb-24 min-h-screen bg-white text-slate-850 font-ibm-sans selection:bg-accent selection:text-white relative">
      <TrackPageView path={`/blog/${slug}`} />
      <ReadingProgressBar />

      {/* JSON-LD Article Schema */}
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": post.title,
        "description": post.metaDescription || post.excerpt,
        "url": `https://drawdown.trading/blog/${post.slug}`,
        "datePublished": post.publishedAt,
        "dateModified": post.dateModified || post.publishedAt,
        "author": {
          "@type": post.author === "Pete Currey" ? "Person" : "Organization",
          "name": post.author,
          "url": post.author === "Pete Currey" ? "https://drawdown.trading/about" : "https://drawdown.trading"
        },
        "publisher": {
          "@type": "Organization",
          "name": "Drawdown Trading",
          "url": "https://drawdown.trading",
          "logo": {
            "@type": "ImageObject",
            "url": "https://drawdown.trading/og/default-og.png"
          }
        },
        "mainEntityOfPage": {
          "@type": "WebPage",
          "@id": `https://drawdown.trading/blog/${post.slug}`
        },
        "image": post.image || "https://drawdown.trading/og/default-og.png",
        "articleSection": post.category
      }} />

      {/* JSON-LD Breadcrumbs Schema */}
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": "https://drawdown.trading"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Blog",
            "item": "https://drawdown.trading/blog"
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": post.category,
            "item": `https://drawdown.trading/blog?category=${encodeURIComponent(post.category)}`
          },
          {
            "@type": "ListItem",
            "position": 4,
            "name": post.title,
            "item": `https://drawdown.trading/blog/${post.slug}`
          }
        ]
      }} />

      {/* JSON-LD FAQPage Schema */}
      {post.faq && post.faq.length > 0 && (
        <JsonLd data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": post.faq.map(item => ({
            "@type": "Question",
            "name": item.question,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": item.answer
            }
          }))
        }} />
      )}

      <div className="max-w-7xl mx-auto px-6">
        {/* Visible Breadcrumbs */}
        <nav className="flex items-center gap-2 font-mono text-[9px] uppercase tracking-widest text-text-tertiary mb-6">
          <Link href="/" className="hover:text-accent transition-colors">Home</Link>
          <span>/</span>
          <Link href="/blog" className="hover:text-accent transition-colors">Blog</Link>
          <span>/</span>
          <Link href={`/blog?category=${encodeURIComponent(post.category)}`} className="hover:text-accent transition-colors">
            {post.category}
          </Link>
          <span>/</span>
          <span className="text-text-secondary truncate max-w-[200px] sm:max-w-xs">{post.title}</span>
        </nav>

        <div className="max-w-6xl mx-auto">
          <Link 
            href="/blog" 
            className="inline-flex items-center gap-2 text-[9px] font-mono uppercase tracking-widest text-text-tertiary hover:text-accent transition-colors mb-8 group w-fit"
          >
            <ChevronLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" /> Back to Insights
          </Link>

          {/* PostHero Component Block */}
          <header className="space-y-6 mb-10">
            <span className="font-mono text-[9px] font-bold text-accent uppercase tracking-[0.2em] block">
              // {post.category}
            </span>
            
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-display font-black uppercase leading-[1.05] text-slate-900 tracking-tight max-w-4xl">
              {post.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-6 font-mono text-[9px] uppercase tracking-widest text-text-tertiary border-y border-[#E5E5E5] py-4 mt-8">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 bg-neutral-100 border border-[#E5E5E5] flex items-center justify-center shrink-0">
                  <span className="text-[9px] font-bold text-slate-700">{post.author === "Pete Currey" ? "PC" : "DT"}</span>
                </div>
                <span>By {post.author}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3 h-3 text-accent" /> 
                {new Date(post.publishedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
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
                    <p className="text-xs text-slate-500 leading-relaxed max-w-2xl font-sans">{mapping.description}</p>
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

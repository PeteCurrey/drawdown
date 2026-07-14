"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Mail, Link2, Check } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register ScrollTrigger globally
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface AuthorProfile {
  name: string;
  role?: string;
  bio?: string;
  avatar_url?: string;
}

interface SeoSettings {
  meta_title?: string;
  meta_description?: string;
  og_title?: string;
  og_description?: string;
  og_image_url?: string;
  canonical_url?: string;
}

interface BlogPost {
  title: string;
  excerpt: string;
  category: string;
  publishedAt: string;
  readingTime: number;
  author: string;
  slug: string;
  image: string;
  heroImage: {
    src: string;
    alt: string;
  };
  content: string; // The HTML body
  subtitle?: string;
  eyebrow?: string;
  authorProfile?: AuthorProfile;
  seoSettings?: SeoSettings;
}

interface DatabaseBlogClientProps {
  post: BlogPost;
  relatedPosts: any[];
  /** When true (default), uses the dark #0A0A0A theme. When false, uses a light white/slate theme. */
  isDark?: boolean;
}

export function DatabaseBlogClient({ post, relatedPosts, isDark = true }: DatabaseBlogClientProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);
  const [currentUrl, setCurrentUrl] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setCurrentUrl(window.location.href);
    }
  }, []);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(currentUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy link:", err);
    }
  };

  const encodedUrl = encodeURIComponent(currentUrl);
  const encodedTitle = encodeURIComponent(post.title);

  useEffect(() => {
    // 1. Initialize GSAP ScrollTrigger for Scroll Progress Bar
    const progressEl = progressBarRef.current;
    if (progressEl) {
      gsap.to(progressEl, {
        scaleX: 1,
        ease: "none",
        scrollTrigger: {
          trigger: "body",
          start: "top top",
          end: "bottom bottom",
          scrub: true,
        },
      });
    }

    const ctx = gsap.context(() => {
      // 2. Animating main prose paragraphs / sections on scroll entry (No IntersectionObserver)
      const sections = gsap.utils.toArray<HTMLElement>(".reveal-section");
      sections.forEach((sec) => {
        gsap.fromTo(
          sec,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power2.out",
            scrollTrigger: {
              trigger: sec,
              start: "top 85%",
              toggleActions: "play none none none",
            },
          }
        );
      });

      // 3. Disclosure Callout border pulse animation
      const callout = document.querySelector(".disclosure-callout");
      if (callout) {
        gsap.fromTo(
          callout,
          { borderColor: "#1A1A1A" },
          {
            borderColor: "#C8F135",
            duration: 2,
            repeat: -1,
            yoyo: true,
            ease: "power1.inOut",
            scrollTrigger: {
              trigger: callout,
              start: "top 90%",
              toggleActions: "play none none none",
            },
          }
        );
      }

      // 4. Staggered reveal for three-column blocks if present in the post body
      const columns = gsap.utils.toArray<HTMLElement>(".revenue-column");
      if (columns.length > 0) {
        gsap.fromTo(
          columns,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.15,
            ease: "power2.out",
            scrollTrigger: {
              trigger: ".revenue-model-container",
              start: "top 85%",
              toggleActions: "play none none none",
            },
          }
        );
      }

      // 5. Staggered reveal for related posts cards
      const readNextCards = gsap.utils.toArray<HTMLElement>(".read-next-card");
      if (readNextCards.length > 0) {
        gsap.fromTo(
          readNextCards,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.15,
            ease: "power2.out",
            scrollTrigger: {
              trigger: ".read-next-container",
              start: "top 85%",
              toggleActions: "play none none none",
            },
          }
        );
      }
    }, containerRef);

    return () => {
      ctx.revert();
    };
  }, []);

  const authorBio = post.authorProfile?.bio || "Building Drawdown to be the trading education platform that actually tells you the truth.";
  const authorRole = post.authorProfile?.role || "Founder, Drawdown";
  const authorAvatar = post.authorProfile?.avatar_url || "/images/pete.jpg";

  // Format date nicely
  const formattedDate = new Date(post.publishedAt).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric"
  });

  // Theme tokens — resolved once so every element uses consistent values
  const t = isDark
    ? {
        bg: 'bg-[#0A0A0A]',
        bgCard: 'bg-[#111111]',
        border: 'border-[#1A1A1A]',
        text: 'text-white',
        textMuted: 'text-[#A0A0A0]',
        accent: 'text-[#C8F135]',
        accentBg: 'bg-[#C8F135]',
        accentTextOnBg: 'text-black',
        hoverBg: 'hover:bg-[#111111]',
        hoverBorder: 'hover:border-[#C8F135]',
        hoverText: 'hover:text-[#C8F135]',
        selection: 'selection:bg-[#C8F135] selection:text-black',
        avatarBg: 'bg-[#1A1A1A]',
        ctaSecondary: 'border border-white/20 text-white hover:bg-white/5',
        progressBar: 'bg-[#C8F135]',
        divideColor: 'divide-[#1A1A1A]',
        sectionBorder: 'border-[#1A1A1A]',
      }
    : {
        bg: 'bg-white',
        bgCard: 'bg-slate-50',
        border: 'border-[#E5E5E5]',
        text: 'text-slate-900',
        textMuted: 'text-slate-500',
        accent: 'text-accent',
        accentBg: 'bg-accent',
        accentTextOnBg: 'text-[#08090D]',
        hoverBg: 'hover:bg-slate-100',
        hoverBorder: 'hover:border-accent',
        hoverText: 'hover:text-accent',
        selection: 'selection:bg-accent selection:text-white',
        avatarBg: 'bg-neutral-100',
        ctaSecondary: 'border border-slate-300 text-slate-700 hover:bg-slate-100',
        progressBar: 'bg-accent',
        divideColor: 'divide-[#E5E5E5]',
        sectionBorder: 'border-[#E5E5E5]',
      };

  return (
    <div ref={containerRef} className={`${t.bg} ${t.text} min-h-screen relative font-sans ${t.selection}`}>
      {/* Reading Progress Bar */}
      <div 
        ref={progressBarRef}
        className={`fixed top-[58px] left-0 h-[2px] ${t.progressBar} z-[210] w-full origin-left scale-x-0`}
      />

      <div className="max-w-7xl mx-auto px-6 py-12 lg:py-20">
        {/* Breadcrumbs */}
        <div className={`flex items-center gap-2 text-sm ${t.textMuted} font-mono mb-8 max-w-6xl mx-auto`}>
          <Link href="/" className={`${t.hoverText} transition-colors`}>Home</Link>
          <span className="opacity-40">&rarr;</span>
          <Link href="/blog" className={`${t.hoverText} transition-colors`}>Blog</Link>
          <span className="opacity-40">&rarr;</span>
          <span className={`${isDark ? 'text-white/80' : 'text-slate-700'} truncate`}>{post.title}</span>
        </div>

        <div className="max-w-6xl mx-auto">
          {/* Article Header */}
          <header className={`space-y-6 pb-12 border-b ${t.sectionBorder}`}>
            <span className={`text-xs font-mono tracking-widest uppercase ${t.accent} block`}>
              // {post.eyebrow || post.category.toUpperCase()}
            </span>
            <h1 className={`text-4xl sm:text-5xl lg:text-6xl font-display font-extrabold ${t.text} leading-tight uppercase tracking-tight max-w-4xl`}>
              {post.title}
            </h1>
            <p className={`text-lg sm:text-xl ${t.textMuted} leading-relaxed font-sans font-light max-w-3xl`}>
              {post.excerpt}
            </p>

            <div className="flex flex-wrap items-center justify-between gap-4 pt-4">
              {/* Author Row */}
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-full ${t.avatarBg} border ${t.border} flex items-center justify-center font-mono text-xs ${t.accent} font-bold overflow-hidden relative`}>
                  {authorAvatar ? (
                    <Image
                      src={authorAvatar}
                      alt={post.author}
                      fill
                      className="object-cover grayscale"
                    />
                  ) : (
                    post.author.charAt(0)
                  )}
                </div>
                <div>
                  <span className={`text-sm font-semibold ${t.text} block`}>{post.author}</span>
                  <span className={`text-xs ${t.textMuted} block`}>{authorRole}</span>
                </div>
              </div>
              {/* Meta Row */}
              <div className={`flex items-center gap-4 text-xs font-mono ${t.textMuted}`}>
                <span>{formattedDate}</span>
                <span className="opacity-30">•</span>
                <span>{post.readingTime} min read</span>
              </div>
            </div>
          </header>

          {/* Hero Image */}
          <figure className="w-full my-12 relative group shadow-sm">
            <div className={`aspect-[16/9] w-full overflow-hidden border ${t.border} relative ${isDark ? 'bg-[#111111]' : 'bg-slate-50'}`}>
              <Image 
                src={post.heroImage.src} 
                alt={post.heroImage.alt}
                fill
                priority
                className="w-full h-full object-cover block"
              />
            </div>
          </figure>

          {/* Two-Column Grid layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            {/* Left Column: Article Body Content (rendered dynamically from HTML body) */}
            <div 
              className="lg:col-span-8 space-y-16 dynamic-blog-content"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            {/* Right Column: Sticky Sidebar */}
            <div className="lg:col-span-4 lg:sticky lg:top-24 space-y-8 flex flex-col">
              {/* Share Buttons */}
              <div className={`flex items-center gap-2 font-mono text-[9px] uppercase tracking-widest ${t.textMuted}`}>
                <span className="font-bold">// SHARE:</span>
                <div className={`flex items-center border ${t.border} rounded-none divide-x ${t.divideColor}`}>
                  <a
                    href={`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Share on X"
                    className={`w-8 h-8 flex items-center justify-center ${t.hoverBg} ${t.hoverText} transition-colors ${t.textMuted}`}
                  >
                    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                  </a>
                  <a
                    href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Share on LinkedIn"
                    className={`w-8 h-8 flex items-center justify-center ${t.hoverBg} ${t.hoverText} transition-colors ${t.textMuted}`}
                  >
                    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                      <path d="M22.23 0H1.77C.8 0 0 .77 0 1.72v20.56C0 23.23.8 24 1.77 24h20.46c.98 0 1.77-.77 1.77-1.72V1.72C24 .77 23.2 0 22.23 0zM7.12 20.45H3.56V9h3.56v11.45zM5.34 7.43c-1.14 0-2.06-.92-2.06-2.06 0-1.14.92-2.06 2.06-2.06 1.14 0 2.06.92 2.06 2.06 0 1.14-.92 2.06-2.06 2.06zm15.11 13.02h-3.56v-5.6c0-1.34-.03-3.05-1.86-3.05-1.86 0-2.14 1.45-2.14 2.95v5.7H9.33V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29z"/>
                    </svg>
                  </a>
                  <a
                    href={`mailto:?subject=${encodedTitle}&body=${encodedUrl}`}
                    title="Share via Email"
                    className={`w-8 h-8 flex items-center justify-center ${t.hoverBg} ${t.hoverText} transition-colors ${t.textMuted}`}
                  >
                    <Mail className="w-3.5 h-3.5" />
                  </a>
                  <button
                    onClick={handleCopy}
                    title="Copy Link"
                    className={`w-8 h-8 flex items-center justify-center ${t.hoverBg} ${t.hoverText} transition-colors cursor-pointer bg-transparent border-none ${t.textMuted}`}
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-[#00E676]" /> : <Link2 className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* Author Bio */}
              <div className={`p-6 ${t.bgCard} border ${t.border} rounded-none shadow-sm relative overflow-hidden group`}>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-full ${t.avatarBg} border ${t.border} overflow-hidden shrink-0 relative`}>
                      {authorAvatar ? (
                        <Image 
                          src={authorAvatar} 
                          alt={post.author} 
                          fill
                          className="w-full h-full object-cover grayscale"
                        />
                      ) : (
                        <div className={`w-full h-full flex items-center justify-center ${isDark ? 'bg-[#222]' : 'bg-slate-200'} font-bold ${t.accent}`}>
                          {post.author.charAt(0)}
                        </div>
                      )}
                    </div>
                    <div>
                      <h5 className={`text-sm font-mono font-bold uppercase ${t.text} leading-tight`}>
                        {post.author}
                      </h5>
                      <span className={`text-[9px] font-mono uppercase tracking-widest ${t.accent} block`}>
                        {authorRole}
                      </span>
                    </div>
                  </div>
                  <p className={`text-xs ${t.textMuted} leading-relaxed font-sans font-light`}>
                    {authorBio}
                  </p>
                </div>
              </div>

              {/* Drawdown CTA widget */}
              <div className={`p-8 ${t.bgCard} border ${t.border} rounded-none shadow-xl relative overflow-hidden group ${t.text}`}>
                <div 
                  className="absolute inset-0 bg-cover bg-center opacity-5 pointer-events-none" 
                  style={{ backgroundImage: `url(${post.heroImage.src})` }} 
                />
                <div className="relative z-10 space-y-6">
                  <div className="space-y-2">
                    <h5 className={`text-xl font-display font-black uppercase leading-tight tracking-tight ${t.text}`}>
                      STOP GAMBLING.<br />START TRADING.
                    </h5>
                    <p className={`${t.textMuted} text-xs leading-relaxed font-sans font-light`}>
                      Structured education, real AI tools, and zero lifestyle marketing.
                    </p>
                  </div>
                  <Link 
                    href="/register" 
                    className={`block w-full py-3 ${t.accentBg} ${t.accentTextOnBg} hover:opacity-90 text-center font-mono font-bold uppercase tracking-wider text-[10px] rounded-none transition-colors shadow-lg`}
                  >
                    CREATE FREE ACCOUNT
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Posts Row */}
        {relatedPosts.length > 0 && (
          <section className={`read-next-container border-t ${t.sectionBorder} mt-24 pt-16 space-y-8`}>
            <span className={`text-xs font-mono tracking-widest ${t.accent} uppercase block`}>
              // READ NEXT
            </span>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedPosts.map((relPost) => {
                const relImage = relPost.heroImage?.src || relPost.image || "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=400";
                const relCategory = relPost.category?.toUpperCase() || "MARKET";
                return (
                  <Link 
                    key={relPost.slug}
                    href={`/blog/${relPost.slug}`}
                    className={`read-next-card group ${t.bgCard} border border-transparent ${t.hoverBorder} transition-all duration-300 flex flex-col justify-between p-5 cursor-pointer`}
                  >
                    <div className="space-y-4">
                      <div className={`aspect-[16/10] w-full border ${t.border} relative ${isDark ? 'bg-[#0A0A0A]' : 'bg-slate-100'}`}>
                        <Image 
                          src={relImage} 
                          alt={relPost.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <span className={`text-[10px] font-mono ${t.accent} tracking-widest uppercase block`}>// {relCategory}</span>
                      <h3 className={`font-display text-base lg:text-lg font-semibold ${t.text} line-clamp-2 uppercase ${t.hoverText} transition-colors leading-tight`}>
                        {relPost.title}
                      </h3>
                    </div>
                    <span className={`text-xs ${t.textMuted} font-mono mt-6 block`}>{relPost.readingTime || 5} min read</span>
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        {/* CTA Block */}
        <section className={`reveal-section ${t.bgCard} border ${t.border} p-8 lg:p-12 mt-20 text-center space-y-6`}>
          <h2 className={`text-3xl sm:text-4xl font-display font-extrabold ${t.text} uppercase leading-tight`}>
            Trading Education Without the Smoke and Mirrors
          </h2>
          <p className={`${t.textMuted} max-w-2xl mx-auto text-base sm:text-lg leading-relaxed font-sans font-light`}>
            Everything on Drawdown is disclosed. Every affiliate link labelled. Every account type stated. Phase one is free — no card required.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
            <Link
              href="/dashboard"
              className={`${t.accentBg} ${t.accentTextOnBg} font-semibold px-8 py-3.5 hover:opacity-90 transition duration-200 font-sans text-center text-sm`}
            >
              Start Free &rarr;
            </Link>
            <Link
              href="/#curriculum"
              className={`${t.ctaSecondary} px-8 py-3.5 transition duration-200 font-sans text-center text-sm`}
            >
              See the Curriculum &rarr;
            </Link>
          </div>
        </section>

      </div>
    </div>
  );
}

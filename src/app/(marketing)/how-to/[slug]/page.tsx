import { redirect } from "next/navigation";
import { HOW_TO_PAGES } from "@/data/seo/howto";
import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ChevronRight, Clock, AlertTriangle, ArrowRight, BookOpen } from "lucide-react";
import { TrackPageView } from "@/components/admin/TrackPageView";
import { DifficultyBadge } from "@/components/how-to/DifficultyBadge";
import { Prerequisites } from "@/components/how-to/Prerequisites";
import { createInternalSupabase } from "@/lib/supabase/server";

export const dynamicParams = true;

interface Props {
  params: Promise<{ slug: string }>;
}

/** Convert "12 min", "15-20 minutes", 12, etc. → ISO 8601 duration "PT12M" */
function toIsoDuration(t: string | number | undefined): string {
  if (!t) return "PT15M";
  const str = String(t);
  // Take the last number in the string (e.g. "15-20 minutes" → 20)
  const nums = str.match(/\d+/g);
  if (!nums) return "PT15M";
  const minutes = parseInt(nums[nums.length - 1], 10);
  return `PT${minutes}M`;
}

export async function generateStaticParams() {
  return HOW_TO_PAGES.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  try {
    const supabase = createInternalSupabase();
    const { data: dynamicPage } = await supabase
      .from('seo_pages')
      .select('title, seo_description, content')
      .eq('slug', slug)
      .eq('page_type', 'how-to')
      .eq('is_published', true)
      .maybeSingle();

    if (dynamicPage) {
      const page = {
        title: dynamicPage.title,
        metaTitle: dynamicPage.content?.metaTitle,
        metaDescription: dynamicPage.seo_description,
        heroImage: dynamicPage.content?.heroImage,
      };
      return {
        title: page.metaTitle || page.title,
        description: page.metaDescription,
        alternates: { canonical: `https://drawdown.trading/how-to/${slug}` },
        openGraph: {
          title: page.metaTitle || page.title,
          description: page.metaDescription,
          ...(page.heroImage ? { images: [{ url: page.heroImage.src, alt: page.heroImage.alt }] } : {}),
        },
      };
    }
  } catch {
    // Supabase unavailable — fall through to static data
  }

  const staticPage = HOW_TO_PAGES.find((p) => p.slug === slug);
  if (!staticPage) return {};

  return {
    title: (staticPage as any).metaTitle || staticPage.title,
    description: staticPage.metaDescription,
    alternates: { canonical: `https://drawdown.trading/how-to/${slug}` },
    openGraph: {
      title: (staticPage as any).metaTitle || staticPage.title,
      description: staticPage.metaDescription,
      ...((staticPage as any).heroImage ? { images: [{ url: (staticPage as any).heroImage.src, alt: (staticPage as any).heroImage.alt }] } : {}),
    },
  };
}

export default async function HowToPage({ params }: Props) {
  const { slug } = await params;

  // ── 1. Try Supabase for a published dynamic page ─────────────────────────
  let page: any = null;
  try {
    const supabase = createInternalSupabase();
    const { data: dynamicPage } = await supabase
      .from('seo_pages')
      .select('*')
      .eq('slug', slug)
      .eq('page_type', 'how-to')
      .eq('is_published', true)
      .maybeSingle();

    if (dynamicPage && dynamicPage.content) {
      page = {
        slug: dynamicPage.slug,
        title: dynamicPage.title,
        metaDescription: dynamicPage.seo_description,
        updatedAt: dynamicPage.updated_at,
        ...dynamicPage.content,
      };
    }
  } catch {
    // Supabase unavailable — fall through to static data
  }

  // ── 2. Try static fallback data ──────────────────────────────────────────
  if (!page) {
    page = HOW_TO_PAGES.find((p) => p.slug === slug) || null;
  }

  // ── 3. Neither — redirect to hub. Unconditional. ─────────────────────────
  if (!page) {
    redirect('/learn-to-trade');
  }

  // ── JSON-LD: HowTo ──────────────────────────────────────────────────────────
  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: page.title,
    description: page.dek || page.introduction,
    totalTime: toIsoDuration(page.estimatedTime || page.readingTime),
    ...(page.prerequisites && page.prerequisites.length > 0
      ? {
          supply: page.prerequisites.map((p: any) => ({
            "@type": "HowToSupply",
            name: p,
          })),
        }
      : {}),
    step: page.steps.map((step: any, i: number) => ({
      "@type": "HowToStep",
      position: i + 1,
      name: step.title,
      text: step.content,
      ...(step.image ? { image: step.image.src } : {}),
    })),
  };

  // ── JSON-LD: FAQPage ─────────────────────────────────────────────────────────
  const faqSchema =
    page.faqs.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: page.faqs.map((f: any) => ({
            "@type": "Question",
            name: f.question,
            acceptedAnswer: { "@type": "Answer", text: f.answer },
          })),
        }
      : null;

  // ── JSON-LD: BreadcrumbList ──────────────────────────────────────────────────
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://drawdown.trading" },
      { "@type": "ListItem", position: 2, name: "How-To Guides", item: "https://drawdown.trading/how-to" },
      {
        "@type": "ListItem",
        position: 3,
        name: page.title,
        item: `https://drawdown.trading/how-to/${slug}`,
      },
    ],
  };

  const estimatedTime = page.estimatedTime || (page.readingTime ? `${page.readingTime} min read` : null);

  return (
    <>
      {/* JSON-LD */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }} />
      {faqSchema && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      )}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <main className="min-h-screen pt-32 pb-20 px-6">
        <TrackPageView path={`/how-to/${slug}`} />

        <div className="max-w-4xl mx-auto">
          {/* Breadcrumbs */}
          <nav
            aria-label="Breadcrumb"
            className="flex items-center space-x-2 text-[10px] font-mono uppercase tracking-widest text-text-tertiary mb-8"
          >
            <Link href="/" className="hover:text-accent transition-colors">
              Home
            </Link>
            <ChevronRight className="w-3 h-3" />
            <Link href="/how-to" className="hover:text-accent transition-colors">
              How-To Guides
            </Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-text-primary">{page.title.split("—")[0].trim()}</span>
          </nav>

          {/* Hero image */}
          {page.heroImage && (
            <div className="relative w-full h-64 md:h-80 mb-12 overflow-hidden">
              <Image
                src={page.heroImage.src}
                alt={page.heroImage.alt}
                fill
                className="object-cover"
                priority
                unoptimized
              />
            </div>
          )}

          {/* Header */}
          <div className="space-y-6 mb-12">
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-accent font-mono text-xs tracking-[0.2em] uppercase">{page.eyebrow}</span>

              {/* Difficulty badge */}
              {page.difficulty && (
                <DifficultyBadge difficulty={page.difficulty} />
              )}
            </div>

            <h1 className="text-5xl md:text-7xl font-sans font-bold leading-[0.9] uppercase tracking-tighter text-text-primary">
              {page.title}
            </h1>

            {/* Meta row: time + estimated time */}
            <div className="flex flex-wrap items-center gap-6 pt-2">
              {estimatedTime && (
                <div className="flex items-center gap-2 text-text-secondary">
                  <Clock className="w-4 h-4 text-accent" />
                  <span className="text-xs font-mono uppercase tracking-widest">{estimatedTime}</span>
                </div>
              )}
              {page.difficulty && (
                <div className="flex items-center gap-2 text-text-secondary">
                  <BookOpen className="w-4 h-4 text-accent" />
                  <span className="text-xs font-mono uppercase tracking-widest">
                    Level: {page.difficulty}
                  </span>
                </div>
              )}
              {page.updatedAt && (
                <div className="flex items-center gap-2 text-text-secondary">
                  <span className="text-xs font-mono uppercase tracking-widest">
                    Last reviewed: {new Date(page.updatedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </span>
                </div>
              )}
            </div>

            {/* Dek / introduction */}
            <p className="text-xl text-text-secondary leading-relaxed max-w-2xl font-sans italic border-l-2 border-border-slate/50 pl-6 py-2">
              {page.dek || page.introduction}
            </p>
          </div>

          {/* Prerequisites */}
          {page.prerequisites && page.prerequisites.length > 0 && (
            <Prerequisites items={page.prerequisites} />
          )}

          {/* Steps */}
          <div className="space-y-24 mb-24">
            {page.steps.map((step: any, index: number) => (
              <section key={step.title} className="relative group">
                <div className="absolute -left-12 top-0 text-8xl font-sans font-black text-profit select-none transition-colors group-hover:text-profit">
                  0{index + 1}
                </div>
                <div className="relative space-y-6">
                  <h2 className="text-3xl md:text-4xl font-sans font-bold uppercase tracking-tight text-text-primary pt-4">
                    {step.title}
                  </h2>
                  <div className="text-text-secondary leading-relaxed text-lg whitespace-pre-line">
                    {step.content}
                  </div>
                  {step.image && (
                    <div className="relative w-full h-56 overflow-hidden border border-border-slate/30 mt-6">
                      <Image
                        src={step.image.src}
                        alt={step.image.alt}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                  )}
                </div>
              </section>
            ))}
          </div>

          {/* Common Mistakes */}
          <section className="mb-24 p-10 bg-loss/5 border border-loss/20 relative overflow-hidden">
            <div className="relative z-10">
              <div className="flex items-center gap-3 text-red-500 mb-8">
                <AlertTriangle className="w-6 h-6" />
                <h3 className="text-xs font-mono uppercase font-bold tracking-[0.3em]">Common Mistakes to Avoid</h3>
              </div>
              <ul className="grid md:grid-cols-2 gap-6">
                {page.commonMistakes.map((mistake: string, i: number) => (
                  <li key={i} className="flex items-start space-x-3 text-sm text-text-secondary">
                    <span className="text-red-500 font-bold mt-0.5">/</span>
                    <span>{mistake}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* Drawdown Approach */}
          <section className="mb-24 p-10 bg-background-surface/40 backdrop-blur-md border border-border-slate/50 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-4 text-center md:text-left">
              <h3 className="text-xs font-mono uppercase tracking-[0.3em] text-accent">The Drawdown Way</h3>
              <p className="text-text-primary font-medium max-w-lg leading-relaxed">
                {page.drawdownApproach.text || page.drawdownApproach.content}
              </p>
            </div>
            <Link
              href={page.drawdownApproach.link || page.drawdownApproach.ctaLink || "#"}
              className="whitespace-nowrap px-8 py-4 bg-text-primary text-background-primary text-[10px] font-bold uppercase tracking-widest hover:bg-accent hover:text-background-primary transition-all"
            >
              {page.drawdownApproach.linkText || page.drawdownApproach.ctaText || "Learn More"}
            </Link>
          </section>

          {/* FAQs */}
          {page.faqs.length > 0 && (
            <section className="mb-24 space-y-12">
              <h2 className="text-4xl font-sans font-bold uppercase text-text-primary">Questions & Answers.</h2>
              <div className="space-y-4">
                {page.faqs.map((faq: any) => (
                  <div
                    key={faq.question}
                    className="border border-border-slate/50 p-8 hover:border-border-slate/70 transition-colors"
                  >
                    <h3 className="text-xl font-bold mb-4 uppercase tracking-tight">{faq.question}</h3>
                    <p className="text-text-secondary leading-relaxed">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Next Step CTA (new field) or generic CTA */}
          {page.nextStep ? (
            <section className="mb-16 border-l-4 border-accent p-8 bg-background-surface/30">
              <p className="text-[9px] font-mono font-bold uppercase tracking-widest text-accent mb-3">
                // Ready to Go Deeper?
              </p>
              <Link
                href={page.nextStep.href}
                className="group inline-flex items-center gap-3 text-lg font-sans font-bold text-text-primary hover:text-accent transition-colors"
              >
                {page.nextStep.label}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </section>
          ) : (
            <section className="bg-accent p-16 text-center space-y-8 relative overflow-hidden group">
              <div className="relative z-10 space-y-6">
                <h2 className="font-sans font-bold text-background-primary uppercase tracking-tighter">
                  Ready to trade the truth?
                </h2>
                <p className="text-background-primary/80 font-mono text-sm max-w-md mx-auto">
                  Stop guessing. Start learning with Drawdown and master the business of managing risk.
                </p>
                <Link
                  href="/signup"
                  className="inline-flex items-center space-x-4 text-text-primary px-12 py-6 text-xs font-bold uppercase tracking-[0.2em] hover:invert transition-all"
                  id="how-to-final-cta"
                >
                  <span>Join Drawdown Free</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </section>
          )}
        </div>
      </main>
    </>
  );
}

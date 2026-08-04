import { notFound } from "next/navigation";
import { Metadata } from "next";
import Link from "next/link";
import { BookOpen, HelpCircle, Activity, ArrowRight } from "lucide-react";
import { CompareTemplate } from "@/components/seo/CompareTemplate";
import BreadcrumbSchema from "@/components/seo/BreadcrumbSchema";
import { createInternalSupabase } from "@/lib/supabase/server";
import {
  getCategoryForNode,
  getRelatedGlossaryTerms,
  getRelatedHowToGuides,
  getRelatedInstruments,
} from "@/lib/taxonomy";

export const dynamicParams = true;
export const revalidate = 3600;

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return [];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  try {
    const supabase = createInternalSupabase();
    const { data: dynamicPage } = await supabase
      .from("seo_pages")
      .select("title, seo_description")
      .eq("slug", slug)
      .eq("page_type", "compare")
      .eq("is_published", true)
      .maybeSingle();

    if (dynamicPage) {
      return {
        title: dynamicPage.title,
        description: dynamicPage.seo_description,
        alternates: { canonical: `https://drawdown.trading/compare/${slug}` },
      };
    }
  } catch {
    // Supabase unavailable — fall through to notFound()
  }

  // No matching published record found — return a proper 404, not a redirect.
  notFound();
}

export default async function GlobalComparePage({ params }: Props) {
  const { slug } = await params;

  // ── 1. Try Supabase for a published dynamic page ──────────────────────────
  try {
    const supabase = createInternalSupabase();
    const { data: dynamicPage } = await supabase
      .from("seo_pages")
      .select("*")
      .eq("slug", slug)
      .eq("page_type", "compare")
      .eq("is_published", true)
      .maybeSingle();

    if (dynamicPage && dynamicPage.content) {
      const page = {
        slug: dynamicPage.slug,
        title: dynamicPage.title,
        metaDescription: dynamicPage.seo_description,
        updatedAt: dynamicPage.updated_at,
        ...dynamicPage.content,
      } as any;

      const category = getCategoryForNode(slug, "compare");
      const relatedTerms = getRelatedGlossaryTerms(category, slug, 4);
      const relatedMarkets = getRelatedInstruments(category, slug, 3);
      const relatedGuides = getRelatedHowToGuides(category, slug, 3);

      return (
        <>
          <BreadcrumbSchema
            items={[
              { name: "Home", url: "https://drawdown.trading" },
              { name: "Compare", url: "https://drawdown.trading/compare" },
              {
                name: page.title,
                url: `https://drawdown.trading/compare/${slug}`,
              },
            ]}
          />
          <CompareTemplate page={page} region="uk" updatedAt={page.updatedAt} />

          {/* RELATED CONTENT GRAPH */}
          <section className="py-24 border-t border-border-slate/30 bg-[#08090D] relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-[300px] bg-[linear-gradient(to_bottom,rgba(0,194,255,0.01)_1px,transparent_1px)] pointer-events-none z-0" />
            <div className="max-w-6xl mx-auto px-6 relative z-10 space-y-16">
              <div className="text-center md:text-left space-y-3">
                <span className="text-[10px] font-mono font-bold text-accent uppercase tracking-widest block">
                  // RELATED RESOURCES
                </span>
                <h2 className="text-3xl font-display font-black uppercase tracking-tight text-text-primary">
                  Deepen Your Trading Knowledge.
                </h2>
                <p className="text-base text-text-secondary max-w-2xl font-sans leading-relaxed">
                  Understand the regulatory rules, mechanics, and strategies underlying these platforms.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                {/* Related Terminology & affected markets */}
                <div className="lg:col-span-7 space-y-12">
                  {relatedTerms.length > 0 && (
                    <div className="space-y-6">
                      <h3 className="text-[10px] font-mono uppercase tracking-[0.25em] text-text-tertiary font-bold flex items-center gap-2">
                        <BookOpen className="w-4 h-4 text-accent" /> Essential Terminology
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {relatedTerms.slice(0, 4).map((t) => (
                          <Link
                            key={t.slug}
                            href={`/glossary/${t.slug}`}
                            className="p-5 bg-background-surface/35 border border-border-slate/40 rounded-xl hover:border-accent hover:bg-background-elevated/40 transition-all duration-300 group"
                          >
                            <h4 className="text-sm font-sans font-bold text-text-primary group-hover:text-accent transition-colors">
                              {t.term}
                            </h4>
                            <p className="text-xs text-text-secondary mt-1.5 line-clamp-2 leading-relaxed font-sans">
                              {t.definition}
                            </p>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}

                  {relatedMarkets.length > 0 && (
                    <div className="space-y-6 pt-8 border-t border-border-slate/20">
                      <h3 className="text-[10px] font-mono uppercase tracking-[0.25em] text-text-tertiary font-bold flex items-center gap-2">
                        <Activity className="w-4 h-4 text-accent" /> Associated Markets
                      </h3>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        {relatedMarkets.map((m) => (
                          <Link
                            key={m.slug}
                            href={`/markets/${m.category}/${m.slug}`}
                            className="p-4 bg-background-surface/35 border border-border-slate/40 rounded-xl hover:border-accent hover:bg-background-elevated/40 transition-all duration-300 group flex justify-between items-center"
                          >
                            <div>
                              <span className="font-mono text-xs font-bold text-text-primary group-hover:text-accent transition-colors">
                                {m.displayPair}
                              </span>
                              <span className="text-[10px] text-text-tertiary block mt-0.5 uppercase tracking-wider font-sans">
                                {m.name}
                              </span>
                            </div>
                            <ArrowRight className="w-4 h-4 text-text-tertiary group-hover:text-accent group-hover:translate-x-0.5 transition-all" />
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Tactical Guides */}
                <div className="lg:col-span-5 space-y-6">
                  {relatedGuides.length > 0 && (
                    <div className="space-y-6 h-full flex flex-col justify-between">
                      <div>
                        <h3 className="text-[10px] font-mono uppercase tracking-[0.25em] text-text-tertiary font-bold flex items-center gap-2 mb-6">
                          <HelpCircle className="w-4 h-4 text-accent" /> Practical Playbooks
                        </h3>
                        <div className="space-y-4">
                          {relatedGuides.map((g) => (
                            <Link
                              key={g.slug}
                              href={`/how-to/${g.slug}`}
                              className="p-5 bg-background-surface/35 border border-border-slate/40 rounded-xl hover:border-accent hover:bg-background-elevated/40 transition-all duration-300 group block"
                            >
                              <div>
                                <span className="text-[9px] font-mono px-2 py-0.5 bg-accent/10 text-accent border border-accent/20 rounded-full uppercase inline-block mb-3">
                                  {g.difficulty}
                                </span>
                                <h4 className="text-sm font-sans font-bold text-text-primary group-hover:text-accent transition-colors leading-snug">
                                  {g.title}
                                </h4>
                                <p className="text-xs text-text-secondary mt-1.5 line-clamp-2 leading-relaxed font-sans">
                                  {g.metaDescription}
                                </p>
                              </div>
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>
        </>
      );
    }
  } catch {
    // Supabase unavailable or threw
  }

  // ── 2. No published compare page found — return a proper 404. ────────────
  notFound();
}

import { redirect } from "next/navigation";
import { BEST_OF_PAGES } from "@/data/seo/best";
import { brokers, Broker } from "@/data/brokers";
import { Metadata } from "next";
import { TrackPageView } from "@/components/admin/TrackPageView";
import { BestBrokerTemplate } from "@/components/brokers/BestBrokerTemplate";
import { resolveProgrammaticSeo } from "@/lib/seo-generator";
import { createInternalSupabase } from "@/lib/supabase/server";

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
      .eq("page_type", "best")
      .eq("is_published", true)
      .maybeSingle();

    if (dynamicPage) {
      return {
        title: dynamicPage.title,
        description: dynamicPage.seo_description,
        alternates: { canonical: `https://drawdown.trading/best/${slug}` },
      };
    }
  } catch {
    // Supabase unavailable — fall through to static data
  }

  const staticPage =
    BEST_OF_PAGES.find((p) => p.slug === slug) || resolveProgrammaticSeo(slug);

  if (!staticPage) return {};

  return {
    title: staticPage.title,
    description: staticPage.metaDescription,
    alternates: { canonical: `https://drawdown.trading/best/${slug}` },
  };
}

export default async function BestOfPage({ params }: Props) {
  const { slug } = await params;

  // ── 1. Try Supabase for a published dynamic page ──────────────────────────
  try {
    const supabase = createInternalSupabase();
    const { data: dynamicPage } = await supabase
      .from("seo_pages")
      .select("*")
      .eq("slug", slug)
      .eq("page_type", "best")
      .eq("is_published", true)
      .maybeSingle();

    if (dynamicPage && dynamicPage.content) {
      const page = {
        slug: dynamicPage.slug,
        title: dynamicPage.title,
        metaDescription: dynamicPage.seo_description,
        updatedAt: dynamicPage.updated_at,
        ...dynamicPage.content,
      };

      const detailedBrokers = (page.reviews || [])
        .map((review: any) => {
          const baseBroker = brokers.find((b) => b.id === review.id);
          const fallbackItem = {
            id: review.id,
            name: review.id
              .split("-")
              .map((w: string) => w.charAt(0).toUpperCase() + w.slice(1))
              .join(" "),
            slug: review.id,
            logo: `/logos/${review.id}.svg`,
            oneLine: review.bestFor,
            rating: 4.8,
            minDeposit: "N/A",
            spreads: "N/A",
            platforms: [],
            fcaRegulated: false,
            affiliateUrl: review.ctaLink,
            category: "Global" as const,
            pros: review.pros,
            cons: review.cons,
          };
          const base = baseBroker || fallbackItem;
          return {
            ...base,
            pros: review.pros,
            cons: review.cons,
            description: review.description,
            verdict: review.verdict,
            bestFor: review.bestFor,
            ctaLink: review.ctaLink,
          };
        })
        .filter(Boolean) as Broker[];

      return (
        <>
          <TrackPageView path={`/best/${slug}`} />
          <BestBrokerTemplate
            title={page.title}
            intro={page.introduction}
            whoIsNotFor={
              page.whoIsNotFor ||
              "This guide is intended for educational purposes and professional-grade review standards."
            }
            topPickId={page.topPickId || ""}
            top3Ids={page.top3Ids || []}
            brokers={detailedBrokers}
            methodology={
              page.methodology ||
              "Our methodology focuses on three core pillars: Execution (slippage and speed), Costs (spreads and overnight fees), and Trust (regulation and capital safety)."
            }
            faqs={page.faqs || []}
            relatedPages={page.relatedPages || []}
            slug={page.slug}
            updatedAt={page.updatedAt}
          />
        </>
      );
    }
  } catch {
    // Supabase unavailable or threw — fall through to static data
  }

  // ── 2. Try static fallback data ──────────────────────────────────────────
  const staticPage =
    BEST_OF_PAGES.find((p) => p.slug === slug) || resolveProgrammaticSeo(slug);

  if (staticPage) {
    const detailedBrokers = ((staticPage as any).reviews || [])
      .map((review: any) => {
        const baseBroker = brokers.find((b) => b.id === review.id);
        const fallbackItem = {
          id: review.id,
          name: review.id
            .split("-")
            .map((w: string) => w.charAt(0).toUpperCase() + w.slice(1))
            .join(" "),
          slug: review.id,
          logo: `/logos/${review.id}.svg`,
          oneLine: review.bestFor,
          rating: 4.8,
          minDeposit: "N/A",
          spreads: "N/A",
          platforms: [],
          fcaRegulated: false,
          affiliateUrl: review.ctaLink,
          category: "Global" as const,
          pros: review.pros,
          cons: review.cons,
        };
        const base = baseBroker || fallbackItem;
        return {
          ...base,
          pros: review.pros,
          cons: review.cons,
          description: review.description,
          verdict: review.verdict,
          bestFor: review.bestFor,
          ctaLink: review.ctaLink,
        };
      })
      .filter(Boolean) as Broker[];

    return (
      <>
        <TrackPageView path={`/best/${slug}`} />
        <BestBrokerTemplate
          title={staticPage.title}
          intro={(staticPage as any).introduction || ""}
          whoIsNotFor={
            (staticPage as any).whoIsNotFor ||
            "This guide is intended for educational purposes and professional-grade review standards."
          }
          topPickId={(staticPage as any).topPickId || ""}
          top3Ids={(staticPage as any).top3Ids || []}
          brokers={detailedBrokers}
          methodology={
            (staticPage as any).methodology ||
            "Our methodology focuses on three core pillars: Execution (slippage and speed), Costs (spreads and overnight fees), and Trust (regulation and capital safety)."
          }
          faqs={(staticPage as any).faqs || []}
          relatedPages={(staticPage as any).relatedPages || []}
          slug={staticPage.slug}
          updatedAt={(staticPage as any).lastUpdated}
        />
      </>
    );
  }

  // ── 3. Neither DB nor static — redirect to hub. Unconditional. ────────────
  redirect("/brokers");
}

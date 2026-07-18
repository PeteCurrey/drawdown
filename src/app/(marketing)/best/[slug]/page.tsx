import { notFound, redirect } from "next/navigation";
import { BEST_OF_PAGES } from "@/data/seo/best";
import { brokers, Broker } from "@/data/brokers";
import { Metadata } from "next";
import { TrackPageView } from "@/components/admin/TrackPageView";
import { BestBrokerTemplate } from "@/components/brokers/BestBrokerTemplate";
import { resolveProgrammaticSeo } from "@/lib/seo-generator";
import { createClient } from "@/lib/supabase/server";

export const dynamicParams = true;
export const revalidate = 3600; // hourly cache revalidation

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return [];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  
  const supabase = await createClient();
  const { data: dynamicPage } = await supabase
    .from('seo_pages')
    .select('*')
    .eq('slug', slug)
    .eq('page_type', 'best')
    .single();

  const page = dynamicPage 
    ? { title: dynamicPage.title, metaDescription: dynamicPage.seo_description }
    : BEST_OF_PAGES.find((p) => p.slug === slug) || resolveProgrammaticSeo(slug);

  if (!page) return {};

  return {
    title: page.title,
    description: page.metaDescription,
    alternates: {
      canonical: `https://drawdown.trading/best/${slug}`,
    },
  };
}

export default async function BestOfPage({ params }: Props) {
  const { slug } = await params;
  
  const supabase = await createClient();
  const { data: dynamicPage } = await supabase
    .from('seo_pages')
    .select('*')
    .eq('slug', slug)
    .eq('page_type', 'best')
    .single();

  const page = dynamicPage 
    ? {
        slug: dynamicPage.slug,
        title: dynamicPage.title,
        metaDescription: dynamicPage.seo_description,
        updatedAt: dynamicPage.updated_at,
        ...dynamicPage.content
      }
    : BEST_OF_PAGES.find((p) => p.slug === slug) || resolveProgrammaticSeo(slug);

  if (!page) {
    redirect('/brokers');
  }

  // Map the SEO reviews to full broker-like objects for the template
  const detailedBrokers = (page.reviews || []).map(review => {
    const baseBroker = brokers.find(b => b.id === review.id);
    
    // Create a fallback object if the item is a prop firm or trading tool
    const fallbackItem = {
      id: review.id,
      name: review.id.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" "),
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
      cons: review.cons
    };

    const base = baseBroker || fallbackItem;
    
    return {
      ...base,
      pros: review.pros,
      cons: review.cons,
      description: review.description,
      verdict: review.verdict,
      bestFor: review.bestFor,
      ctaLink: review.ctaLink
    };
  }).filter(Boolean) as Broker[];

  return (
    <>
      <TrackPageView path={`/best/${slug}`} />
      <BestBrokerTemplate 
        title={page.title}
        intro={page.introduction}
        whoIsNotFor={page.whoIsNotFor || "This guide is intended for educational purposes and professional-grade review standards."}
        topPickId={page.topPickId || ""}
        top3Ids={page.top3Ids || []}
        brokers={detailedBrokers}
        methodology={page.methodology || "Our methodology focuses on three core pillars: Execution (slippage and speed), Costs (spreads and overnight fees), and Trust (regulation and capital safety)."}
        faqs={page.faqs || []}
        relatedPages={page.relatedPages || []}
        slug={page.slug}
        updatedAt={page.updatedAt}
      />
    </>
  );
}

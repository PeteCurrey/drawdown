import { notFound } from "next/navigation";

export const dynamic = "force-static";
export const dynamicParams = true;
import { BEST_OF_PAGES } from "@/data/seo/best";
import { brokers } from "@/data/brokers";
import { Metadata } from "next";
import { TrackPageView } from "@/components/admin/TrackPageView";
import { BestBrokerTemplate } from "@/components/brokers/BestBrokerTemplate";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return BEST_OF_PAGES.map((page) => ({
    slug: page.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = BEST_OF_PAGES.find((p) => p.slug === slug);

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
  const page = BEST_OF_PAGES.find((p) => p.slug === slug);

  if (!page) notFound();

  // Map the SEO reviews to full broker objects for the template
  const detailedBrokers = (page.reviews || []).map(review => {
    const baseBroker = brokers.find(b => b.id === review.id);
    if (!baseBroker) return null;
    
    return {
      ...baseBroker,
      pros: review.pros,
      cons: review.cons,
      description: review.description,
      verdict: review.verdict,
      bestFor: review.bestFor,
      ctaLink: review.ctaLink
    };
  }).filter(Boolean) as any[];

  return (
    <>
      <TrackPageView path={`/best/${slug}`} />
      <BestBrokerTemplate 
        title={page.title}
        intro={page.introduction}
        whoIsNotFor={page.whoIsNotFor || "This guide is intended for educational purposes and institutional-grade review standards."}
        topPickId={page.topPickId || ""}
        top3Ids={page.top3Ids || []}
        brokers={detailedBrokers}
        methodology={page.methodology || "Our methodology focuses on three core pillars: Execution (slippage and speed), Costs (spreads and overnight fees), and Trust (FCA regulation and capital safety)."}
        faqs={page.faqs || []}
        relatedPages={page.relatedPages || []}
        slug={page.slug}
      />
    </>
  );
}


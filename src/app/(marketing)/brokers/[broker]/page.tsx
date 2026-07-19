import { notFound } from "next/navigation";
import { brokers } from "@/data/brokers";
import { BROKER_REVIEWS } from "@/data/seo/reviews";
import { BrokerReviewTemplate } from "@/components/brokers/BrokerReviewTemplate";
import { TrackPageView } from "@/components/admin/TrackPageView";
import { Metadata } from "next";
import JsonLd from "@/components/seo/JsonLd";
import BreadcrumbSchema from "@/components/seo/BreadcrumbSchema";

export const dynamicParams = true;
export const revalidate = 3600; // hourly cache revalidation

const BROKER_MAP: Record<string, string> = {
  // With -review suffix (used by internal links)
  "ig-markets-review": "ig",
  "pepperstone-review": "pepperstone",
  "ic-markets-review": "ic-markets",
  // Without -review suffix (used by nav and direct links)
  "ig-markets": "ig",
  "pepperstone": "pepperstone",
  "ic-markets": "ic-markets",
};

const BROKER_EXTRA: Record<string, { founded: number; headquarters: string; reviewIntro: string }> = {
  ig: {
    founded: 1974,
    headquarters: "London",
    reviewIntro: "IG Markets is a global leader in retail spread betting and CFD trading, regulated by the FCA.",
  },
  pepperstone: {
    founded: 2010,
    headquarters: "Melbourne",
    reviewIntro: "Pepperstone is a world-class broker offering low spreads and rapid execution for active traders.",
  },
  "ic-markets": {
    founded: 2007,
    headquarters: "Sydney",
    reviewIntro: "IC Markets is a premium choice for high-volume automated traders needing true raw liquidity.",
  }
};

export function generateStaticParams() {
  return [];
}

interface Props {
  params: Promise<{ broker: string }>;
}

function resolveBroker(brokerParam: string) {
  const cleanParam = brokerParam.replace("-review", "");
  const brokerId = BROKER_MAP[brokerParam] || BROKER_MAP[cleanParam] || cleanParam;
  return brokers.find((b) => b.id === brokerId || b.slug === brokerId);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { broker: brokerParam } = await params;
  const broker = resolveBroker(brokerParam);

  if (!broker) notFound();

  return {
    title: `${broker.name} Review 2026 — Is It Worth It? | Drawdown`,
    description: `Honest 2026 review of ${broker.name}. We analyze spreads, regulation, platforms, and fees to help UK traders decide if it's the right choice.`,
    alternates: {
      canonical: `https://drawdown.trading/brokers/${brokerParam}`,
    },
  };
}

export default async function BrokerReviewPage({ params }: Props) {
  const { broker: brokerParam } = await params;
  const broker = resolveBroker(brokerParam);

  if (!broker) notFound();

  const deepReview = BROKER_REVIEWS[broker.id] || {
    overview: `${broker.name} is a leading ${broker.category} broker offering ${broker.oneLine}. They have established a strong reputation in the industry for their ${broker.platforms.join(", ")} support and competitive ${broker.spreads} spreads.`,
    accountTypes: `Standard and Professional accounts are available, catering to both retail and institutional needs.`,
    platformsTools: `${broker.name} supports ${broker.platforms.join(", ")}, providing a robust suite of tools for technical and fundamental analysis.`,
    feesCosts: `Spreads from ${broker.spreads}. Competitive overnight financing and transparent fee structures apply across all asset classes.`,
    regulationSafety: `${broker.name} maintains high standards of safety and is ${broker.fcaRegulated ? "FCA regulated" : "globally regulated"}, with segregated client funds.`,
    whoShouldUse: broker.pros.slice(0, 4),
    whoShouldNotUse: broker.cons.slice(0, 3),
    whoShouldNotUseLong: `Traders who require a different set of tools or asset classes than what ${broker.name} specializes in.`,
    verdict: `A solid choice for traders who value ${broker.oneLine}. Their platform stability and regulatory standing make them a reliable partner for your trading business.`,
    faqs: [
      { question: `Is ${broker.name} safe?`, answer: `Yes, they are highly regulated and have a strong track record of reliability.` },
      { question: `What is the minimum deposit?`, answer: `The minimum deposit for ${broker.name} is ${broker.minDeposit}.` }
    ]
  };

  const extra = BROKER_EXTRA[broker.id] || {
    founded: 2010,
    headquarters: "London",
    reviewIntro: broker.oneLine,
  };

  return (
    <>
      <TrackPageView path={`/brokers/${brokerParam}`} />
      <BreadcrumbSchema items={[
        { name: 'Home', url: 'https://drawdown.trading' },
        { name: 'Brokers', url: 'https://drawdown.trading/brokers' },
        { name: broker.name, url: `https://drawdown.trading/brokers/${brokerParam}` }
      ]} />
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": "Review",
        "name": `${broker.name} Review`,
        "reviewBody": extra.reviewIntro,
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": broker.rating,
          "bestRating": 5,
          "worstRating": 0
        },
        "author": {
          "@type": "Person",
          "name": "Pete Currey",
          "url": "https://drawdown.trading/about"
        },
        "publisher": {
          "@type": "Organization",
          "name": "Drawdown Trading",
          "url": "https://drawdown.trading"
        },
        "itemReviewed": {
          "@type": "FinancialService",
          "name": broker.name,
          "url": broker.affiliateUrl,
          "description": broker.oneLine,
          "foundingDate": extra.founded.toString(),
          "address": {
            "@type": "PostalAddress",
            "addressLocality": extra.headquarters
          }
        },
        "url": `https://drawdown.trading/brokers/${brokerParam}`,
        "datePublished": "2026-01-01"
      }} />
      <BrokerReviewTemplate 
        broker={broker} 
        content={deepReview} 
        slug={brokerParam}
      />
    </>
  );
}

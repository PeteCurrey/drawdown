import { notFound } from "next/navigation";
import { brokers } from "@/data/brokers";
import { BROKER_REVIEWS } from "@/data/seo/reviews";
import { BrokerReviewTemplate } from "@/components/brokers/BrokerReviewTemplate";
import { TrackPageView } from "@/components/admin/TrackPageView";
import { Metadata } from "next";

export const dynamicParams = true;
export const revalidate = 3600; // hourly cache revalidation

const BROKER_MAP: Record<string, string> = {
  "ig-markets-review": "ig",
  "pepperstone-review": "pepperstone",
  "ic-markets-review": "ic-markets",
};

export function generateStaticParams() {
  return [];
}

interface Props {
  params: Promise<{ broker: string }>;
}

function resolveBroker(brokerParam: string) {
  const brokerId = BROKER_MAP[brokerParam] || brokerParam;
  return brokers.find((b) => b.id === brokerId || b.slug === brokerId);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { broker: brokerParam } = await params;
  const broker = resolveBroker(brokerParam);

  if (!broker) return {};

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

  return (
    <>
      <TrackPageView path={`/brokers/${brokerParam}`} />
      <BrokerReviewTemplate 
        broker={broker} 
        content={deepReview} 
        slug={brokerParam}
      />
    </>
  );
}

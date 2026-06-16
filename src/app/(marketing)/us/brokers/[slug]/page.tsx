import { Metadata } from "next";
import { notFound } from "next/navigation";
import { US_BROKERS } from "@/data/seo/us-data";
import { BrokerReviewTemplate } from "@/components/seo/BrokerReviewTemplate";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return US_BROKERS.map((broker) => ({
    slug: broker.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const broker = US_BROKERS.find((b) => b.slug === slug);
  if (!broker) return {};

  return {
    title: `${broker.name} Review 2026 | Best Regulated Broker US`,
    description: `Complete ${broker.name} review for US traders. We test platforms, execution, and ${broker.regulation} compliance. Read the professional verdict.`,
  };
}

export default async function UnitedStatesBrokerReviewPage({ params }: Props) {
  const { slug } = await params;
  const broker = US_BROKERS.find((b) => b.slug === slug);

  if (!broker) {
    notFound();
  }

  const breadcrumbs = [
    { label: 'US Brokers', href: '/us/brokers' },
    { label: broker.name, href: `/us/brokers/${broker.slug}` }
  ];

  return (
    <BrokerReviewTemplate 
      broker={{
        slug: broker.slug,
        name: broker.name,
        badge: broker.badge,
        regulation: broker.regulation || "CFTC / NFA",
        description: broker.description,
        pros: broker.pros,
        link: broker.link
      }}
      region="us"
      breadcrumbs={breadcrumbs}
      eyebrow={`${broker.regulation || "CFTC / NFA"} REGULATED`}
    />
  );
}

import { Metadata } from "next";
import { notFound } from "next/navigation";
import { AU_BROKERS } from "@/data/seo/au-data";
import { BrokerReviewTemplate } from "@/components/seo/BrokerReviewTemplate";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return AU_BROKERS.map((broker) => ({
    slug: broker.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const broker = AU_BROKERS.find((b) => b.slug === slug);
  if (!broker) return {};

  return {
    title: `${broker.name} Review 2026 | Best ASIC Broker Australia`,
    description: `Complete ${broker.name} review for Australian traders. We test spreads, execution speed, and ASIC AFSL ${broker.afsl} compliance.`,
  };
}

export default async function AustralianBrokerReviewPage({ params }: Props) {
  const { slug } = await params;
  const broker = AU_BROKERS.find((b) => b.slug === slug);

  if (!broker) {
    notFound();
  }

  const breadcrumbs = [
    { label: 'AU Brokers', href: '/au/brokers' },
    { label: broker.name, href: `/au/brokers/${broker.slug}` }
  ];

  return (
    <BrokerReviewTemplate 
      broker={{
        slug: broker.slug,
        name: broker.name,
        badge: broker.badge,
        regulation: "ASIC",
        afsl: broker.afsl,
        description: broker.description,
        pros: broker.pros,
        link: broker.link
      }}
      region="au"
      breadcrumbs={breadcrumbs}
      eyebrow={`ASIC AFSL ${broker.afsl || "414530"}`}
    />
  );
}

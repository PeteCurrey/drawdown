import { Metadata } from "next";
import { notFound } from "next/navigation";
import { SG_BROKERS } from "@/data/seo/sg-data";
import { BrokerReviewTemplate } from "@/components/seo/BrokerReviewTemplate";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return SG_BROKERS.map((broker) => ({
    slug: broker.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const broker = SG_BROKERS.find((b) => b.slug === slug);
  if (!broker) return {};

  return {
    title: `${broker.name} Singapore Review 2026 | MAS Regulated Broker`,
    description: `${broker.name} review for Singapore traders. We test MAS compliance, execution quality, and SGD-denominated account features.`,
  };
}

export default async function SingaporeBrokerReviewPage({ params }: Props) {
  const { slug } = await params;
  const broker = SG_BROKERS.find((b) => b.slug === slug);

  if (!broker) {
    notFound();
  }

  const breadcrumbs = [
    { label: 'SG Brokers', href: '/sg/brokers' },
    { label: broker.name, href: `/sg/brokers/${broker.slug}` }
  ];

  return (
    <BrokerReviewTemplate 
      broker={{
        slug: broker.slug,
        name: broker.name,
        badge: broker.badge,
        regulation: "MAS",
        description: broker.description,
        pros: broker.pros,
        link: broker.link
      }}
      region="sg"
      breadcrumbs={breadcrumbs}
      eyebrow="MAS REGULATED FRAMEWORK"
    />
  );
}

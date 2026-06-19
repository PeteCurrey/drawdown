import { Metadata } from "next";
import { notFound } from "next/navigation";
import { HK_BROKERS } from "@/data/seo/hk-data";
import { BrokerReviewTemplate } from "@/components/seo/BrokerReviewTemplate";

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
  const broker = HK_BROKERS.find((b) => b.slug === slug);
  if (!broker) return {};

  return {
    title: `${broker.name} Hong Kong Review 2026 | SFC Regulated Broker`,
    description: `Complete ${broker.name} review for Hong Kong traders. We test SFC compliance, execution quality, and HKD-denominated account features.`,
  };
}

export default async function HongKongBrokerReviewPage({ params }: Props) {
  const { slug } = await params;
  const broker = HK_BROKERS.find((b) => b.slug === slug);

  if (!broker) {
    notFound();
  }

  const breadcrumbs = [
    { label: 'HK Brokers', href: '/hk/brokers' },
    { label: broker.name, href: `/hk/brokers/${broker.slug}` }
  ];

  return (
    <BrokerReviewTemplate 
      broker={{
        slug: broker.slug,
        name: broker.name,
        badge: broker.badge,
        regulation: "SFC",
        description: broker.description,
        pros: broker.pros,
        link: broker.link
      }}
      region="hk"
      breadcrumbs={breadcrumbs}
      eyebrow="SFC REGULATED FRAMEWORK"
    />
  );
}

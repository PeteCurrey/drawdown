import { Metadata } from "next";
import { HK_CITIES, HK_TOPICS, CITY_CONTEXT_HK, TOPIC_DISPLAY_HK } from "@/data/seo/hk-data";
import { getMetadata } from "@/lib/metadata";
import { RegionalLocationPage } from "@/components/seo/RegionalLocationPage";

interface Props {
  params: Promise<{ topic: string; city: string }>;
}

export async function generateStaticParams() {
  const params = [];
  for (const topic of HK_TOPICS) {
    for (const city of HK_CITIES) {
      params.push({ topic, city });
    }
  }
  return params;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { topic, city } = await params;
  const topicLabel = TOPIC_DISPLAY_HK[topic];
  const cityLabel = city.replace(/-/g, ' ');

  if (!topicLabel || !HK_CITIES.includes(city)) return {};

  return getMetadata({
    title: `${topicLabel} in ${cityLabel.charAt(0).toUpperCase() + cityLabel.slice(1)} | Drawdown Hong Kong`,
    description: `Professional ${topicLabel} education and tools for traders in ${cityLabel}. Join the Drawdown community in Hong Kong.`,
    path: `/hk/learn-to-trade/${topic}/${city}`,
  });
}

export default async function HKLocationPage({ params }: Props) {
  const { topic, city } = await params;
  return (
    <RegionalLocationPage 
      region="hk" 
      topic={topic} 
      city={city} 
      topicDisplay={TOPIC_DISPLAY_HK} 
      cityContext={CITY_CONTEXT_HK} 
      regulationLabel="SFC"
    />
  );
}

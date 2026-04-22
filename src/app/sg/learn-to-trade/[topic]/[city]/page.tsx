import { Metadata } from "next";
import { SG_CITIES, SG_TOPICS, CITY_CONTEXT_SG, TOPIC_DISPLAY_SG } from "@/data/seo/sg-data";
import { getMetadata } from "@/lib/metadata";
import { RegionalLocationPage } from "@/components/seo/RegionalLocationPage";

interface Props {
  params: Promise<{ topic: string; city: string }>;
}

export async function generateStaticParams() {
  const params = [];
  for (const topic of SG_TOPICS) {
    for (const city of SG_CITIES) {
      params.push({ topic, city });
    }
  }
  return params;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { topic, city } = await params;
  const topicLabel = TOPIC_DISPLAY_SG[topic];
  const cityLabel = city.replace(/-/g, ' ');

  if (!topicLabel || !SG_CITIES.includes(city)) return {};

  return getMetadata({
    title: `${topicLabel} in ${cityLabel.charAt(0).toUpperCase() + cityLabel.slice(1)} | Drawdown Singapore`,
    description: `Professional ${topicLabel} education and tools for traders in ${cityLabel}. Join the Drawdown community in Singapore.`,
    path: `/sg/learn-to-trade/${topic}/${city}`,
  });
}

export default async function SGLocationPage({ params }: Props) {
  const { topic, city } = await params;
  return (
    <RegionalLocationPage 
      region="sg" 
      topic={topic} 
      city={city} 
      topicDisplay={TOPIC_DISPLAY_SG} 
      cityContext={CITY_CONTEXT_SG} 
      regulationLabel="MAS"
    />
  );
}

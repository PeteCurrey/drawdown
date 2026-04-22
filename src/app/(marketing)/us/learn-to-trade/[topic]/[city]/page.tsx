import { Metadata } from "next";
import { US_CITIES, US_TOPICS, CITY_CONTEXT_US, TOPIC_DISPLAY_US } from "@/data/seo/us-data";
import { getMetadata } from "@/lib/metadata";
import { RegionalLocationPage } from "@/components/seo/RegionalLocationPage";

interface Props {
  params: Promise<{ topic: string; city: string }>;
}

export async function generateStaticParams() {
  const params = [];
  for (const topic of US_TOPICS) {
    for (const city of US_CITIES) {
      params.push({ topic, city });
    }
  }
  return params;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { topic, city } = await params;
  const topicLabel = TOPIC_DISPLAY_US[topic];
  const cityLabel = city.replace(/-/g, ' ');

  if (!topicLabel || !US_CITIES.includes(city)) return {};

  return getMetadata({
    title: `${topicLabel} in ${cityLabel.charAt(0).toUpperCase() + cityLabel.slice(1)} | Drawdown USA`,
    description: `Professional ${topicLabel} education and tools for traders in ${cityLabel}. Join the Drawdown community in the United States.`,
    path: `/us/learn-to-trade/${topic}/${city}`,
  });
}

export default async function USLocationPage({ params }: Props) {
  const { topic, city } = await params;
  return (
    <RegionalLocationPage 
      region="us" 
      topic={topic} 
      city={city} 
      topicDisplay={TOPIC_DISPLAY_US} 
      cityContext={CITY_CONTEXT_US} 
      regulationLabel="NFA/CFTC"
    />
  );
}

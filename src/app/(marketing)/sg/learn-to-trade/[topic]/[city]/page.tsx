import { Metadata } from "next";
import { notFound } from "next/navigation";
import { SG_CITIES, SG_TOPICS, CITY_CONTEXT_SG, TOPIC_DISPLAY_SG } from "@/data/seo/sg-data";
import { getMetadata } from "@/lib/metadata";
import { RegionalLocationPage } from "@/components/seo/RegionalLocationPage";
import { createInternalSupabase } from "@/lib/supabase/server";

export const dynamicParams = true;
export const revalidate = 86400; // 24 hours - content doesn't change often

interface Props {
  params: Promise<{ topic: string; city: string }>;
}

export async function generateStaticParams() {
  return [];
}

async function getSGCityData(topicSlug: string, citySlug: string) {
  let topicLabel = TOPIC_DISPLAY_SG[topicSlug];
  if (!topicLabel) {
    try {
      const supabase = createInternalSupabase();
      const { data: page } = await supabase
        .from("seo_pages")
        .select("*")
        .eq("slug", topicSlug)
        .eq("page_type", "learn_to_trade")
        .maybeSingle();
      if (page) {
        topicLabel = page.title;
      }
    } catch (err) {
      console.error(err);
    }
  }

  let cityLabel = "";
  let cityContext = "";
  let isCityValid = false;

  try {
    const supabase = createInternalSupabase();
    const { data: page } = await supabase
      .from("seo_pages")
      .select("*")
      .eq("slug", citySlug)
      .eq("page_type", "location")
      .maybeSingle();
    if (page) {
      cityLabel = page.title;
      cityContext = page.seo_description || "";
      isCityValid = true;
    }
  } catch (err) {
    console.error(err);
  }

  if (!isCityValid && SG_CITIES.includes(citySlug)) {
    cityLabel = citySlug.replace(/-/g, ' ');
    cityContext = CITY_CONTEXT_SG[citySlug] || "";
    isCityValid = true;
  }

  if (!topicLabel || !isCityValid) return null;

  // Cleanup dollar prefixes and interpolate template placeholders
  const cleanLocName = cityLabel ? (cityLabel.startsWith("$") ? cityLabel.substring(1) : cityLabel) : "";
  const cleanTopicTitle = topicLabel ? (topicLabel.startsWith("$") ? topicLabel.substring(1) : topicLabel) : "";

  const cleanText = (text: string) => {
    if (!text) return "";
    return text
      .replace(/\$Location/g, cleanLocName)
      .replace(/\$Topic/g, cleanTopicTitle)
      .replace(/\$location/g, cleanLocName)
      .replace(/\$topic/g, cleanTopicTitle)
      .replace(/\$London/g, "London")
      .replace(/\$Day Trading/g, "Day Trading")
      .replace(/\$london/gi, "London")
      .replace(/\$day-trading/gi, "Day Trading")
      .replace(/\$day trading/gi, "Day Trading");
  };

  return {
    topicLabel: cleanTopicTitle,
    cityLabel: cleanLocName,
    cityContext: cleanText(cityContext),
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { topic, city } = await params;
  const data = await getSGCityData(topic, city);

  if (!data) return {};

  const { topicLabel, cityLabel } = data;

  return getMetadata({
    title: `${topicLabel} in ${cityLabel.charAt(0).toUpperCase() + cityLabel.slice(1)} | Drawdown Singapore`,
    description: `Professional ${topicLabel} education and tools for traders in ${cityLabel}. Join the Drawdown community in Singapore.`,
    path: `/sg/learn-to-trade/${topic}/${city}`,
  });
}

export default async function SGLocationPage({ params }: Props) {
  const { topic, city } = await params;
  const data = await getSGCityData(topic, city);

  if (!data) notFound();

  const topicDisplay = { [topic]: data.topicLabel };
  const cityContext = { [city]: data.cityContext };

  return (
    <RegionalLocationPage 
      region="sg" 
      topic={topic} 
      city={city} 
      topicDisplay={topicDisplay} 
      cityContext={cityContext} 
      regulationLabel="MAS"
    />
  );
}

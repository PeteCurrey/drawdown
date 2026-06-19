import { Metadata } from "next";
import { notFound } from "next/navigation";
import { HK_CITIES, HK_TOPICS, CITY_CONTEXT_HK, TOPIC_DISPLAY_HK } from "@/data/seo/hk-data";
import { getMetadata } from "@/lib/metadata";
import { RegionalLocationPage } from "@/components/seo/RegionalLocationPage";
import { createInternalSupabase } from "@/lib/supabase/server";

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

async function getHKCityData(topicSlug: string, citySlug: string) {
  let topicLabel = TOPIC_DISPLAY_HK[topicSlug];
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

  if (!isCityValid && HK_CITIES.includes(citySlug)) {
    cityLabel = citySlug.replace(/-/g, ' ');
    cityContext = CITY_CONTEXT_HK[citySlug] || "";
    isCityValid = true;
  }

  if (!topicLabel || !isCityValid) return null;

  return {
    topicLabel,
    cityLabel,
    cityContext,
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { topic, city } = await params;
  const data = await getHKCityData(topic, city);

  if (!data) return {};

  const { topicLabel, cityLabel } = data;

  return getMetadata({
    title: `${topicLabel} in ${cityLabel.charAt(0).toUpperCase() + cityLabel.slice(1)} | Drawdown Hong Kong`,
    description: `Professional ${topicLabel} education and tools for traders in ${cityLabel}. Join the Drawdown community in Hong Kong.`,
    path: `/hk/learn-to-trade/${topic}/${city}`,
  });
}

export default async function HKLocationPage({ params }: Props) {
  const { topic, city } = await params;
  const data = await getHKCityData(topic, city);

  if (!data) notFound();

  const topicDisplay = { [topic]: data.topicLabel };
  const cityContext = { [city]: data.cityContext };

  return (
    <RegionalLocationPage 
      region="hk" 
      topic={topic} 
      city={city} 
      topicDisplay={topicDisplay} 
      cityContext={cityContext} 
      regulationLabel="SFC"
    />
  );
}

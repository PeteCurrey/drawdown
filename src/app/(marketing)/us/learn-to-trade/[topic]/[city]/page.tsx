import { Metadata } from "next";
import { notFound } from "next/navigation";
import { LEARN_TOPICS } from "@/lib/data/learn-to-trade";
import { US_CITIES, CITY_CONTEXT_US } from "@/data/seo/us-data";
import { createInternalSupabase } from "@/lib/supabase/server";
import { LocationPageClient } from "@/components/learn/LocationPageClient";

export const dynamicParams = true;
export const revalidate = 86400;

interface Props {
  params: Promise<{ topic: string; city: string }>;
}

export async function generateStaticParams() {
  return [];
}

const cleanText = (text: string, locName: string, topicTitle: string) => {
  if (!text) return "";
  return text
    .replace(/\$Location/g, locName)
    .replace(/\$Topic/g, topicTitle)
    .replace(/\$location/g, locName)
    .replace(/\$topic/g, topicTitle);
};

async function getUSCityData(topicSlug: string, citySlug: string) {
  let topicTitle = "";
  const localTopic = LEARN_TOPICS.find((t) => t.slug === topicSlug);

  if (localTopic) {
    topicTitle = localTopic.title;
  } else {
    try {
      const supabase = createInternalSupabase();
      const { data: page } = await supabase
        .from("seo_pages")
        .select("*")
        .eq("slug", topicSlug)
        .eq("page_type", "learn_to_trade")
        .maybeSingle();
      if (page) topicTitle = page.title;
    } catch (err) {
      console.error(err);
    }
  }

  if (!topicTitle) return null;

  let cityName = "";
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
      cityName = page.title;
      cityContext = page.seo_description || "";
      isCityValid = true;
    }
  } catch (err) {
    console.error(err);
  }

  if (!isCityValid && US_CITIES.includes(citySlug)) {
    cityName = citySlug
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");
    cityContext = (CITY_CONTEXT_US as Record<string, string>)[citySlug] || "";
    isCityValid = true;
  }

  if (!isCityValid) return null;

  const cleanLocName = cityName.startsWith("$") ? cityName.slice(1) : cityName;
  const cleanTopicTitle = topicTitle.startsWith("$") ? topicTitle.slice(1) : topicTitle;

  const contentSections = localTopic
    ? localTopic.content.map((sec) => ({
        heading: sec.heading,
        text: cleanText(sec.text, cleanLocName, cleanTopicTitle),
        bullets: sec.bullets?.map((b) => cleanText(b, cleanLocName, cleanTopicTitle)),
      }))
    : [
        {
          heading: "Overview",
          text: cleanText(cityContext, cleanLocName, cleanTopicTitle),
          bullets: [] as string[],
        },
      ];

  return {
    topicTitle: cleanTopicTitle,
    topicSlug,
    locationName: cleanLocName,
    locationSlug: citySlug,
    locationContext: cleanText(cityContext, cleanLocName, cleanTopicTitle),
    contentSections,
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { topic: topicSlug, city: citySlug } = await params;
  const data = await getUSCityData(topicSlug, citySlug);
  if (!data) return {};
  return {
    title: `${data.topicTitle} in ${data.locationName} — Professional Online Training | Drawdown US`,
    description: `Master ${data.topicTitle} from ${data.locationName} with Drawdown. Structured courses, US-regulated data, and professional trading education tailored for the American market.`,
  };
}

export default async function UnitedStatesLocationTopicPage({ params }: Props) {
  const { topic: topicSlug, city: citySlug } = await params;
  const data = await getUSCityData(topicSlug, citySlug);
  if (!data) notFound();

  return (
    <LocationPageClient
      {...data}
      pathPrefix="/learn-to-trade"
      regionPrefix="/us"
      regionLabel="US Home"
      complianceBadge="SEC/FINRA Compliance"
      complianceItems={[
        "SEC & FINRA Regulated Brokers",
        "USD Denominated Tools",
        "IRS Tax-Efficient Strategies",
        "NYSE & Nasdaq Integration",
      ]}
      ctaHref="/us/signup"
      ctaLabel="Join Drawdown US Free"
    />
  );
}

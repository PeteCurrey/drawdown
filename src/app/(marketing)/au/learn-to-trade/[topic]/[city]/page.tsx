import { Metadata } from "next";
import { notFound } from "next/navigation";
import { LEARN_TOPICS } from "@/lib/data/learn-to-trade";
import { AU_LOCATIONS } from "@/data/seo/au-locations";
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

async function getAUCityData(topicSlug: string, citySlug: string) {
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
    }
  } catch (err) {
    console.error(err);
  }

  if (!cityName) {
    const localCity = AU_LOCATIONS.find((l) => l.slug === citySlug);
    if (localCity) {
      cityName = localCity.name;
      cityContext = (localCity as any).context || "";
    }
  }

  if (!cityName) return null;

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
  const data = await getAUCityData(topicSlug, citySlug);
  if (!data) return {};
  return {
    title: `${data.topicTitle} in ${data.locationName} — Learn Online | Drawdown AU`,
    description: `Learn ${data.topicTitle} from ${data.locationName} with Drawdown. Structured courses, ASIC-regulated data, and Australian-focused trading education.`,
  };
}

export default async function AustralianLocationTopicPage({ params }: Props) {
  const { topic: topicSlug, city: citySlug } = await params;
  const data = await getAUCityData(topicSlug, citySlug);
  if (!data) notFound();

  return (
    <LocationPageClient
      {...data}
      pathPrefix="/learn-to-trade"
      regionPrefix="/au"
      regionLabel="AU Home"
      complianceBadge="ASIC Compliance"
      complianceItems={[
        "ASIC Regulated Brokers",
        "AUD Denominated Tools",
        "ATO Tax Optimisation",
        "ASX Market Integration",
      ]}
      ctaHref="/au/signup"
      ctaLabel="Join Drawdown AU Free"
    />
  );
}

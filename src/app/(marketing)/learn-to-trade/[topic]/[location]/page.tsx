import { Metadata } from "next";
import { notFound } from "next/navigation";
import { createInternalSupabase } from "@/lib/supabase/server";
import { LEARN_TOPICS } from "@/lib/data/learn-to-trade";
import { UK_LOCATIONS } from "@/lib/data/locations";
import { LocationPageClient } from "@/components/learn/LocationPageClient";

export const dynamicParams = true;
export const revalidate = 86400;

interface Props {
  params: Promise<{ topic: string; location: string }>;
}

export async function generateStaticParams() {
  const primaryCities = ["london", "manchester", "birmingham"];
  const topTopics = [
    "forex-trading",
    "day-trading",
    "prop-firms",
    "spread-betting",
    "technical-analysis",
  ];
  return topTopics.flatMap((topic) =>
    primaryCities.map((location) => ({ topic, location }))
  );
}

const cleanText = (text: string, locName: string, topicTitle: string) => {
  if (!text) return "";
  return text
    .replace(/\$Location/g, locName)
    .replace(/\$Topic/g, topicTitle)
    .replace(/\$location/g, locName)
    .replace(/\$topic/g, topicTitle);
};

async function getLocationData(topicSlug: string, locationSlug: string) {
  let topicTitle = "";
  let contentSections: { heading: string; text: string; bullets?: string[] }[] = [];
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
    } catch (err: any) {
      console.error(err.message);
    }
  }

  if (!topicTitle) return null;

  let locationName = "";
  let locationContext = "";

  try {
    const supabase = createInternalSupabase();
    const { data: page } = await supabase
      .from("seo_pages")
      .select("*")
      .eq("slug", locationSlug)
      .eq("page_type", "location")
      .maybeSingle();
    if (page) {
      locationName = page.title;
      locationContext = page.seo_description || "";
    }
  } catch (err: any) {
    console.error(err.message);
  }

  if (!locationName) {
    const localLoc = UK_LOCATIONS.find((l) => l.slug === locationSlug);
    if (localLoc) {
      locationName = localLoc.name;
      locationContext = (localLoc as any).context || "";
    }
  }

  if (!locationName) return null;

  // Strip leading $ from template artefacts
  const cleanLocName = locationName.startsWith("$") ? locationName.slice(1) : locationName;
  const cleanTopicTitle = topicTitle.startsWith("$") ? topicTitle.slice(1) : topicTitle;

  if (localTopic) {
    contentSections = localTopic.content.map((sec) => ({
      heading: sec.heading,
      text: cleanText(sec.text, cleanLocName, cleanTopicTitle),
      bullets: sec.bullets?.map((b) => cleanText(b, cleanLocName, cleanTopicTitle)),
    }));
  } else {
    contentSections = [
      {
        heading: "Overview",
        text: cleanText(locationContext, cleanLocName, cleanTopicTitle),
        bullets: [],
      },
    ];
  }

  return {
    topicTitle: cleanTopicTitle,
    topicSlug,
    locationName: cleanLocName,
    locationSlug,
    locationContext: cleanText(locationContext, cleanLocName, cleanTopicTitle),
    contentSections,
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { topic: topicSlug, location: locationSlug } = await params;
  const data = await getLocationData(topicSlug, locationSlug);
  if (!data) return {};
  return {
    title: `${data.topicTitle} in ${data.locationName} | Learn to Trade`,
    description: `Learn ${data.topicTitle} from ${data.locationName} with Drawdown. Structured courses, AI tools, and UK-focused trading education. Start free today.`,
    alternates: {
      canonical: `https://drawdown.trading/learn-to-trade/${topicSlug}/${locationSlug}`,
    },
    robots: { index: false, follow: true },
  };
}

export default async function LocationTopicPage({ params }: Props) {
  const { topic: topicSlug, location: locationSlug } = await params;
  const data = await getLocationData(topicSlug, locationSlug);
  if (!data) notFound();

  return (
    <LocationPageClient
      {...data}
      complianceBadge="UK Compliance"
      complianceItems={[
        "FCA Regulated Platforms",
        "Spread Betting Tax Efficiency",
        "GBP Denominated Analysis",
        "London Session Focus",
      ]}
      ctaHref="/signup"
      ctaLabel="Join Drawdown Free"
    />
  );
}

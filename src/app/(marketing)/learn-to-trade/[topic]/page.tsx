import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getMetadata } from "@/lib/metadata";
import { LEARN_TOPICS, LearnTopic } from "@/lib/data/learn-to-trade";
import { createInternalSupabase } from "@/lib/supabase/server";
import { TopicPageClient } from "@/components/learn/TopicPageClient";

export const dynamicParams = true;
export const revalidate = 3600; // hourly cache revalidation

interface Props {
  params: Promise<{ topic: string }>;
}

export async function generateStaticParams() {
  return [];
}

async function getTopicData(topicSlug: string): Promise<LearnTopic | null> {
  try {
    const supabase = createInternalSupabase();
    const { data: page } = await supabase
      .from("seo_pages")
      .select("*")
      .eq("slug", topicSlug)
      .eq("page_type", "learn_to_trade")
      .maybeSingle();

    if (page) {
      return {
        title: page.title,
        slug: page.slug,
        metaTitle: page.seo_title || `${page.title} | Drawdown`,
        metaDescription: page.seo_description || "",
        category: "General",
        difficulty: "Intermediate" as const,
        subtitle: page.seo_description || "",
        description: page.seo_description || "",
        timeToLearn: "30 mins",
        riskLevel: "Medium" as const,
        heroImage: "/images/learn/default.jpg",
        honestReality: "",
        content: [
          {
            heading: "Overview",
            text: page.content || "",
            bullets: [],
            richBlocks: []
          }
        ],
        faqs: [] as any[],
        relatedModules: []
      };
    }
  } catch (err: any) {
    console.error(`[Topic] Exception fetching from Supabase for slug ${topicSlug}:`, err.message);
  }

  const topic = LEARN_TOPICS.find((t) => t.slug === topicSlug);
  return topic || null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { topic: topicSlug } = await params;
  const topic = await getTopicData(topicSlug);
  if (!topic) return {};

  return getMetadata({
    title: topic.metaTitle,
    description: topic.metaDescription,
    image: topic.heroImage,
    path: `/learn-to-trade/${topicSlug}`,
    hasRegionalVariants: true,
  });
}

export default async function TopicPage({ params }: Props) {
  const { topic: topicSlug } = await params;
  const topic = await getTopicData(topicSlug);
  if (!topic) notFound();

  return <TopicPageClient topic={topic} />;
}


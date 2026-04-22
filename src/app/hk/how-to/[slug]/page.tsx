import { Metadata } from "next";
import { BEST_OF_PAGES_HK } from "@/data/seo/hk-data";
import { getMetadata } from "@/lib/metadata";
import { RegionalHowToPage } from "@/components/seo/RegionalHowToPage";

// Using a placeholder data set for now as HK How-To data was merged in my mind
// I'll define it here if it's missing from hk-data
const HOW_TO_PAGES_HK = [
  {
    slug: "start-trading-hong-kong",
    eyebrow: "GETTING STARTED // HONG KONG",
    title: "How to Start Trading in Hong Kong",
    metaDescription: "A step-by-step guide on how to start trading in Hong Kong. Learn about SFC rules, HKD funding, and local market sessions.",
    lastUpdated: "APRIL 2026",
    introduction: "Hong Kong is a world-class financial center with a unique regulatory framework. This guide helps you navigate the SFC environment correctly.",
    steps: [
      { title: "Understand SFC Type 3 Licensing", content: "Ensure your forex broker holds the necessary SFC Type 3 license for retail trading." },
      { title: "Setup HKD Funding", content: "Use local FPS (Faster Payment System) for instant and cost-effective account funding." },
    ],
    faqs: [
      { question: "Is trading tax-free in HK?", answer: "Individuals are generally not taxed on capital gains from trading in Hong Kong." }
    ]
  }
];

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return HOW_TO_PAGES_HK.map((page) => ({
    slug: page.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = HOW_TO_PAGES_HK.find((p) => p.slug === slug);

  if (!page) return {};

  return getMetadata({
    title: page.title,
    description: page.metaDescription,
    path: `/hk/how-to/${slug}`,
    hasRegionalVariants: true,
  });
}

export default async function HKHowToPage({ params }: Props) {
  const { slug } = await params;
  return <RegionalHowToPage region="hk" slug={slug} data={HOW_TO_PAGES_HK} />;
}

import { Metadata } from "next";
import { BEST_OF_PAGES_HK } from "@/data/seo/hk-data";
import { getMetadata } from "@/lib/metadata";
import { RegionalBestOfPage } from "@/components/seo/RegionalBestOfPage";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return BEST_OF_PAGES_HK.map((page) => ({
    slug: page.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = BEST_OF_PAGES_HK.find((p) => p.slug === slug);

  if (!page) return {};

  return getMetadata({
    title: page.title,
    description: page.metaDescription,
    path: `/hk/best/${slug}`,
    hasRegionalVariants: true,
  });
}

export default async function HKBestOfPage({ params }: Props) {
  const { slug } = await params;
  return <RegionalBestOfPage region="hk" slug={slug} data={BEST_OF_PAGES_HK} />;
}

import { Metadata } from "next";
import { BEST_OF_PAGES_SG } from "@/data/seo/sg-data";
import { getMetadata } from "@/lib/metadata";
import { RegionalBestOfPage } from "@/components/seo/RegionalBestOfPage";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return BEST_OF_PAGES_SG.map((page) => ({
    slug: page.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = BEST_OF_PAGES_SG.find((p) => p.slug === slug);

  if (!page) return {};

  return getMetadata({
    title: page.title,
    description: page.metaDescription,
    path: `/sg/best/${slug}`,
    hasRegionalVariants: true,
  });
}

export default async function SGBestOfPage({ params }: Props) {
  const { slug } = await params;
  return <RegionalBestOfPage region="sg" slug={slug} data={BEST_OF_PAGES_SG} />;
}

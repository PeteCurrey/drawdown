import { Metadata } from "next";
import { BEST_OF_PAGES_US } from "@/data/seo/us-data";
import { getMetadata } from "@/lib/metadata";
import { RegionalBestOfPage } from "@/components/seo/RegionalBestOfPage";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return BEST_OF_PAGES_US.map((page) => ({
    slug: page.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = BEST_OF_PAGES_US.find((p) => p.slug === slug);

  if (!page) return {};

  return getMetadata({
    title: page.title,
    description: page.metaDescription,
    path: `/us/best/${slug}`,
    hasRegionalVariants: true,
  });
}

export default async function USBestOfPage({ params }: Props) {
  const { slug } = await params;
  return <RegionalBestOfPage region="us" slug={slug} data={BEST_OF_PAGES_US} />;
}

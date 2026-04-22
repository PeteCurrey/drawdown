import { Metadata } from "next";
import { COMPARE_PAGES_US } from "@/data/seo/us-data";
import { getMetadata } from "@/lib/metadata";
import { RegionalComparePage } from "@/components/seo/RegionalComparePage";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return COMPARE_PAGES_US.map((page) => ({
    slug: page.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = COMPARE_PAGES_US.find((p) => p.slug === slug);

  if (!page) return {};

  return getMetadata({
    title: page.title,
    description: page.metaDescription,
    path: `/us/compare/${slug}`,
    hasRegionalVariants: true,
  });
}

export default async function USComparePage({ params }: Props) {
  const { slug } = await params;
  return <RegionalComparePage region="us" slug={slug} data={COMPARE_PAGES_US} />;
}

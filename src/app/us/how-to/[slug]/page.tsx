import { Metadata } from "next";
import { HOW_TO_PAGES_US } from "@/data/seo/us-data";
import { getMetadata } from "@/lib/metadata";
import { RegionalHowToPage } from "@/components/seo/RegionalHowToPage";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return HOW_TO_PAGES_US.map((page) => ({
    slug: page.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = HOW_TO_PAGES_US.find((p) => p.slug === slug);

  if (!page) return {};

  return getMetadata({
    title: page.title,
    description: page.metaDescription,
    path: `/us/how-to/${slug}`,
    hasRegionalVariants: true,
  });
}

export default async function USHowToPage({ params }: Props) {
  const { slug } = await params;
  return <RegionalHowToPage region="us" slug={slug} data={HOW_TO_PAGES_US} />;
}

import { Metadata } from "next";
import { HOW_TO_PAGES_SG } from "@/data/seo/sg-data";
import { getMetadata } from "@/lib/metadata";
import { RegionalHowToPage } from "@/components/seo/RegionalHowToPage";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return HOW_TO_PAGES_SG.map((page) => ({
    slug: page.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = HOW_TO_PAGES_SG.find((p) => p.slug === slug);

  if (!page) return {};

  return getMetadata({
    title: page.title,
    description: page.metaDescription,
    path: `/sg/how-to/${slug}`,
    hasRegionalVariants: true,
  });
}

export default async function SGHowToPage({ params }: Props) {
  const { slug } = await params;
  return <RegionalHowToPage region="sg" slug={slug} data={HOW_TO_PAGES_SG} />;
}

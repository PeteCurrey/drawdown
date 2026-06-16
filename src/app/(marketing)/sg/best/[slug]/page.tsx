import { Metadata } from "next";
import { notFound } from "next/navigation";
import { BEST_OF_PAGES_SG } from "@/data/seo/best-sg";
import { BestOfTemplate } from "@/components/seo/BestOfTemplate";

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

  return {
    title: page.title,
    description: page.metaDescription,
  };
}

export default async function SgBestOfPage({ params }: Props) {
  const { slug } = await params;
  const page = BEST_OF_PAGES_SG.find((p) => p.slug === slug);

  if (!page) {
    notFound();
  }

  return <BestOfTemplate page={page} region="sg" />;
}

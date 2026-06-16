import { Metadata } from "next";
import { notFound } from "next/navigation";
import { BEST_OF_PAGES_AU } from "@/data/seo/best-au";
import { BestOfTemplate } from "@/components/seo/BestOfTemplate";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return BEST_OF_PAGES_AU.map((page) => ({
    slug: page.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = BEST_OF_PAGES_AU.find((p) => p.slug === slug);
  if (!page) return {};

  return {
    title: page.title,
    description: page.metaDescription,
  };
}

export default async function AuBestOfPage({ params }: Props) {
  const { slug } = await params;
  const page = BEST_OF_PAGES_AU.find((p) => p.slug === slug);

  if (!page) {
    notFound();
  }

  return <BestOfTemplate page={page} region="au" />;
}

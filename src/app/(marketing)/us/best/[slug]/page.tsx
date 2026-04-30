import { Metadata } from "next";
import { notFound } from "next/navigation";
import { BEST_OF_PAGES_US } from "@/data/seo/best-us";
import { BestOfTemplate } from "@/components/seo/BestOfTemplate";

interface Props {
  params: { slug: string };
}

export async function generateStaticParams() {
  return BEST_OF_PAGES_US.map((page) => ({
    slug: page.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const page = BEST_OF_PAGES_US.find((p) => p.slug === params.slug);
  if (!page) return {};

  return {
    title: page.title,
    description: page.metaDescription,
  };
}

export default function UsBestOfPage({ params }: Props) {
  const page = BEST_OF_PAGES_US.find((p) => p.slug === params.slug);

  if (!page) {
    notFound();
  }

  return <BestOfTemplate page={page} region="us" />;
}

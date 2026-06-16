import { notFound } from "next/navigation";
import { COMPARISON_PAGES } from "@/data/seo/compare";
import { Metadata } from "next";
import { CompareTemplate } from "@/components/seo/CompareTemplate";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return COMPARISON_PAGES.map((page) => ({
    slug: page.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = COMPARISON_PAGES.find((p) => p.slug === slug);

  if (!page) return {};

  return {
    title: page.title,
    description: page.metaDescription,
    alternates: {
      canonical: `https://drawdown.trading/compare/${slug}`,
    },
  };
}

export default async function GlobalComparePage({ params }: Props) {
  const { slug } = await params;
  const page = COMPARISON_PAGES.find((p) => p.slug === slug);

  if (!page) {
    notFound();
  }

  return <CompareTemplate page={page} region="uk" />;
}

import { Metadata } from "next";
import { notFound } from "next/navigation";
import { COMPARE_PAGES_AU } from "@/data/seo/compare-au";
import { CompareTemplate } from "@/components/seo/CompareTemplate";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return COMPARE_PAGES_AU.map((page) => ({
    slug: page.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = COMPARE_PAGES_AU.find((p) => p.slug === slug);
  if (!page) return {};

  return {
    title: page.title,
    description: page.metaDescription,
  };
}

export default async function AuComparePage({ params }: Props) {
  const { slug } = await params;
  const page = COMPARE_PAGES_AU.find((p) => p.slug === slug);

  if (!page) {
    notFound();
  }

  return <CompareTemplate page={page} region="au" />;
}

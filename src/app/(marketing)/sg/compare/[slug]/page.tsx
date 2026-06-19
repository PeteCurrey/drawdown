import { Metadata } from "next";
import { notFound } from "next/navigation";
import { COMPARE_PAGES_SG } from "@/data/seo/compare-sg";
import { CompareTemplate } from "@/components/seo/CompareTemplate";

export const dynamicParams = true;
export const revalidate = 3600; // hourly cache revalidation

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return [];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = COMPARE_PAGES_SG.find((p) => p.slug === slug);
  if (!page) return {};

  return {
    title: page.title,
    description: page.metaDescription,
  };
}

export default async function SgComparePage({ params }: Props) {
  const { slug } = await params;
  const page = COMPARE_PAGES_SG.find((p) => p.slug === slug);

  if (!page) {
    notFound();
  }

  return <CompareTemplate page={page} region="sg" />;
}

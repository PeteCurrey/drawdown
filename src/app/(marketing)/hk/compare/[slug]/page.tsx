import { Metadata } from "next";
import { notFound } from "next/navigation";
import { COMPARE_PAGES_HK } from "@/data/seo/compare-hk";
import { CompareTemplate } from "@/components/seo/CompareTemplate";

export const dynamicParams = true;
export const revalidate = 3600; // hourly cache revalidation

interface Props {
  params: { slug: string };
}

export async function generateStaticParams() {
  return [];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = COMPARE_PAGES_HK.find((p) => p.slug === slug);
  if (!page) return {};

  return {
    title: page.title,
    description: page.metaDescription,
  };
}

export default async function HkComparePage({ params }: Props) {
  const { slug } = await params;
  const page = COMPARE_PAGES_HK.find((p) => p.slug === slug);

  if (!page) {
    notFound();
  }

  return <CompareTemplate page={page} region="hk" />;
}

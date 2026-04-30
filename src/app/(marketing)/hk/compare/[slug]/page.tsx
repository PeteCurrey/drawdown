import { Metadata } from "next";
import { notFound } from "next/navigation";
import { COMPARE_PAGES_HK } from "@/data/seo/compare-hk";
import { CompareTemplate } from "@/components/seo/CompareTemplate";

interface Props {
  params: { slug: string };
}

export async function generateStaticParams() {
  return COMPARE_PAGES_HK.map((page) => ({
    slug: page.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const page = COMPARE_PAGES_HK.find((p) => p.slug === params.slug);
  if (!page) return {};

  return {
    title: page.title,
    description: page.metaDescription,
  };
}

export default function HkComparePage({ params }: Props) {
  const page = COMPARE_PAGES_HK.find((p) => p.slug === params.slug);

  if (!page) {
    notFound();
  }

  return <CompareTemplate page={page} region="hk" />;
}

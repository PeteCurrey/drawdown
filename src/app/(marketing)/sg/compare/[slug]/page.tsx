import { Metadata } from "next";
import { notFound } from "next/navigation";
import { COMPARE_PAGES_SG } from "@/data/seo/compare-sg";
import { CompareTemplate } from "@/components/seo/CompareTemplate";

interface Props {
  params: { slug: string };
}

export async function generateStaticParams() {
  return COMPARE_PAGES_SG.map((page) => ({
    slug: page.slug,
  }));
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

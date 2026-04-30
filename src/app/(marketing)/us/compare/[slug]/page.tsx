import { Metadata } from "next";
import { notFound } from "next/navigation";
import { COMPARE_PAGES_US } from "@/data/seo/compare-us";
import { CompareTemplate } from "@/components/seo/CompareTemplate";

interface Props {
  params: { slug: string };
}

export async function generateStaticParams() {
  return COMPARE_PAGES_US.map((page) => ({
    slug: page.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = COMPARE_PAGES_US.find((p) => p.slug === slug);
  if (!page) return {};

  return {
    title: page.title,
    description: page.metaDescription,
  };
}

export default async function UsComparePage({ params }: Props) {
  const { slug } = await params;
  const page = COMPARE_PAGES_US.find((p) => p.slug === slug);

  if (!page) {
    notFound();
  }

  return <CompareTemplate page={page} region="us" />;
}

import { Metadata } from "next";
import { notFound } from "next/navigation";
import { COMPARE_PAGES_AU } from "@/data/seo/compare-au";
import { CompareTemplate } from "@/components/seo/CompareTemplate";

interface Props {
  params: { slug: string };
}

export async function generateStaticParams() {
  return COMPARE_PAGES_AU.map((page) => ({
    slug: page.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const page = COMPARE_PAGES_AU.find((p) => p.slug === params.slug);
  if (!page) return {};

  return {
    title: page.title,
    description: page.metaDescription,
  };
}

export default function AuComparePage({ params }: Props) {
  const page = COMPARE_PAGES_AU.find((p) => p.slug === params.slug);

  if (!page) {
    notFound();
  }

  return <CompareTemplate page={page} region="au" />;
}

import { Metadata } from "next";
import { notFound } from "next/navigation";
import { HOW_TO_PAGES_AU } from "@/data/seo/how-to-au";
import { HowToTemplate } from "@/components/seo/HowToTemplate";

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
  const page = HOW_TO_PAGES_AU.find((p) => p.slug === slug);
  if (!page) return {};

  return {
    title: page.title,
    description: page.metaDescription,
  };
}

export default async function AuHowToPage({ params }: Props) {
  const { slug } = await params;
  const page = HOW_TO_PAGES_AU.find((p) => p.slug === slug);

  if (!page) {
    notFound();
  }

  return <HowToTemplate page={page} region="au" />;
}

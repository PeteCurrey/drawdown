import { Metadata } from "next";
import { notFound } from "next/navigation";
import { HOW_TO_PAGES_US } from "@/data/seo/how-to-us";
import { HowToTemplate } from "@/components/seo/HowToTemplate";

interface Props {
  params: { slug: string };
}

export async function generateStaticParams() {
  return HOW_TO_PAGES_US.map((page) => ({
    slug: page.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = HOW_TO_PAGES_US.find((p) => p.slug === slug);
  if (!page) return {};

  return {
    title: page.title,
    description: page.metaDescription,
  };
}

export default async function UsHowToPage({ params }: Props) {
  const { slug } = await params;
  const page = HOW_TO_PAGES_US.find((p) => p.slug === slug);

  if (!page) {
    notFound();
  }

  return <HowToTemplate page={page} region="us" />;
}

import { Metadata } from "next";
import { notFound } from "next/navigation";
import { HOW_TO_PAGES_AU } from "@/data/seo/how-to-au";
import { HowToTemplate } from "@/components/seo/HowToTemplate";

interface Props {
  params: { slug: string };
}

export async function generateStaticParams() {
  return HOW_TO_PAGES_AU.map((page) => ({
    slug: page.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const page = HOW_TO_PAGES_AU.find((p) => p.slug === params.slug);
  if (!page) return {};

  return {
    title: page.title,
    description: page.metaDescription,
  };
}

export default function AuHowToPage({ params }: Props) {
  const page = HOW_TO_PAGES_AU.find((p) => p.slug === params.slug);

  if (!page) {
    notFound();
  }

  return <HowToTemplate page={page} region="au" />;
}

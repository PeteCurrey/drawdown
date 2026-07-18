import { notFound } from "next/navigation";
import { COMPARISON_PAGES } from "@/data/seo/compare";
import { Metadata } from "next";
import { CompareTemplate } from "@/components/seo/CompareTemplate";
import BreadcrumbSchema from "@/components/seo/BreadcrumbSchema";
import { createClient } from "@/lib/supabase/server";

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
  
  const supabase = await createClient();
  const { data: dynamicPage } = await supabase
    .from('seo_pages')
    .select('*')
    .eq('slug', slug)
    .eq('page_type', 'compare')
    .single();

  const page = dynamicPage 
    ? { title: dynamicPage.title, metaDescription: dynamicPage.meta_description }
    : COMPARISON_PAGES.find((p) => p.slug === slug);

  if (!page) return {};

  return {
    title: page.title,
    description: page.metaDescription,
    alternates: {
      canonical: `https://drawdown.trading/compare/${slug}`,
    },
  };
}

export default async function GlobalComparePage({ params }: Props) {
  const { slug } = await params;
  
  const supabase = await createClient();
  const { data: dynamicPage } = await supabase
    .from('seo_pages')
    .select('*')
    .eq('slug', slug)
    .eq('page_type', 'compare')
    .single();

  const page = dynamicPage 
    ? {
        slug: dynamicPage.slug,
        title: dynamicPage.title,
        metaDescription: dynamicPage.meta_description,
        ...dynamicPage.content_jsonb
      } as any
    : COMPARISON_PAGES.find((p) => p.slug === slug);

  if (!page) {
    notFound();
  }

  return (
    <>
      <BreadcrumbSchema items={[
        { name: 'Home', url: 'https://drawdown.trading' },
        { name: 'Compare', url: 'https://drawdown.trading/compare' },
        { name: page.title, url: `https://drawdown.trading/compare/${slug}` }
      ]} />
      <CompareTemplate page={page} region="uk" />
    </>
  );
}

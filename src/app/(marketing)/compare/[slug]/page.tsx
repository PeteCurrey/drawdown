import { redirect } from "next/navigation";
import { COMPARISON_PAGES } from "@/data/seo/compare";
import { Metadata } from "next";
import { CompareTemplate } from "@/components/seo/CompareTemplate";
import BreadcrumbSchema from "@/components/seo/BreadcrumbSchema";
import { createInternalSupabase } from "@/lib/supabase/server";

export const dynamicParams = true;
export const revalidate = 3600;

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return [];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  try {
    const supabase = createInternalSupabase();
    const { data: dynamicPage } = await supabase
      .from("seo_pages")
      .select("title, seo_description")
      .eq("slug", slug)
      .eq("page_type", "compare")
      .eq("is_published", true)
      .maybeSingle();

    if (dynamicPage) {
      return {
        title: dynamicPage.title,
        description: dynamicPage.seo_description,
        alternates: { canonical: `https://drawdown.trading/compare/${slug}` },
      };
    }
  } catch {
    // Supabase unavailable — fall through to static data
  }

  const staticPage = COMPARISON_PAGES.find((p) => p.slug === slug);

  if (!staticPage) return {};

  return {
    title: staticPage.title,
    description: staticPage.metaDescription,
    alternates: { canonical: `https://drawdown.trading/compare/${slug}` },
  };
}

export default async function GlobalComparePage({ params }: Props) {
  const { slug } = await params;

  // ── 1. Try Supabase for a published dynamic page ──────────────────────────
  try {
    const supabase = createInternalSupabase();
    const { data: dynamicPage } = await supabase
      .from("seo_pages")
      .select("*")
      .eq("slug", slug)
      .eq("page_type", "compare")
      .eq("is_published", true)
      .maybeSingle();

    if (dynamicPage && dynamicPage.content) {
      const page = {
        slug: dynamicPage.slug,
        title: dynamicPage.title,
        metaDescription: dynamicPage.seo_description,
        updatedAt: dynamicPage.updated_at,
        ...dynamicPage.content,
      } as any;

      return (
        <>
          <BreadcrumbSchema
            items={[
              { name: "Home", url: "https://drawdown.trading" },
              { name: "Compare", url: "https://drawdown.trading/compare" },
              {
                name: page.title,
                url: `https://drawdown.trading/compare/${slug}`,
              },
            ]}
          />
          <CompareTemplate page={page} region="uk" updatedAt={page.updatedAt} />
        </>
      );
    }
  } catch {
    // Supabase unavailable or threw — fall through to static data
  }

  // ── 2. Try static fallback data ──────────────────────────────────────────
  const staticPage = COMPARISON_PAGES.find((p) => p.slug === slug);

  if (staticPage) {
    return (
      <>
        <BreadcrumbSchema
          items={[
            { name: "Home", url: "https://drawdown.trading" },
            { name: "Compare", url: "https://drawdown.trading/compare" },
            {
              name: staticPage.title,
              url: `https://drawdown.trading/compare/${slug}`,
            },
          ]}
        />
        <CompareTemplate page={staticPage as any} region="uk" />
      </>
    );
  }

  // ── 3. Neither DB nor static — redirect to hub. Unconditional. ────────────
  redirect("/brokers");
}

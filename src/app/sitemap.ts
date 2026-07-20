import { MetadataRoute } from "next";
import { siteConfig } from "@/lib/metadata";
import { getAllPosts } from "@/lib/blog";
import { phases } from "@/data/courses";
import { LEARN_TOPICS } from "@/lib/data/learn-to-trade";
import { UK_LOCATIONS } from "@/lib/data/locations";
import { getAllSlugs } from "@/lib/markets-config";
import { expertAnalysis } from "@/data/analysis";
import { GLOSSARY_TERMS } from "@/data/seo/glossary";
import { tradingTools } from "@/data/trading-tools";
import { createInternalSupabase } from "@/lib/supabase/server";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = siteConfig.url;
  const staticDate = new Date("2026-07-19");

  // 1. Priority 1.0: Homepage
  const homeRoute = [
    {
      url: `${baseUrl}`,
      lastModified: staticDate,
      changeFrequency: "weekly" as const,
      priority: 1.0,
    },
  ];

  // 2. Priority 0.9: /courses, /courses/[all 13 phase slugs]
  const phaseIndexRoute = {
    url: `${baseUrl}/courses`,
    lastModified: staticDate,
    changeFrequency: "monthly" as const,
    priority: 0.9,
  };
  const phaseRoutes = phases.map((phase) => ({
    url: `${baseUrl}/courses/${phase.slug}`,
    lastModified: staticDate,
    changeFrequency: "monthly" as const,
    priority: 0.9,
  }));

  // 3. Priority 0.8: /courses/[phase-slug]/module-[N] (all module pages)
  const moduleRoutes: any[] = [];
  phases.forEach((phase) => {
    phase.modules_list.forEach((_, idx) => {
      moduleRoutes.push({
        url: `${baseUrl}/courses/${phase.slug}/module-${idx + 1}`,
        lastModified: staticDate,
        changeFrequency: "monthly" as const,
        priority: 0.8,
      });
    });
  });

  // 4. Priority 0.8: /learn-to-trade/[all hub pages]
  const hubRoutes = LEARN_TOPICS.map((topic) => ({
    url: `${baseUrl}/learn-to-trade/${topic.slug}`,
    lastModified: staticDate,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  // 5. Priority 0.7: Core hubs and features
  const platformRoutes = [
    "/platform",
    "/pricing",
    "/brokers",
    "/prop-firms",
    "/markets",
    "/blog",
    "/trading-tools",
    "/editorial-standards"
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: staticDate,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  // 6. Priority 0.6: /blog/[all posts]
  const posts = await getAllPosts();
  const blogRoutes = posts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.dateModified || post.publishedAt),
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  // 7. Priority 0.5: /about, /contact
  const aboutRoutes = [
    "/about",
    "/contact"
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: staticDate,
    changeFrequency: "weekly" as const,
    priority: 0.5,
  }));

  // 8. Priority 0.1: Legal & Footer (excluding /login and /signup due to robots tag exclusion)
  const footerRoutes = [
    "/privacy",
    "/disclaimer"
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: staticDate,
    changeFrequency: "monthly" as const,
    priority: 0.1,
  }));



  // 10. Priority 0.7: /brokers/[broker] reviews (ig, pepperstone, ic-markets with and without review suffix)
  const brokerReviewSlugs = [
    "ig-markets-review",
    "pepperstone-review",
    "ic-markets-review",
    "ig-markets",
    "pepperstone",
    "ic-markets"
  ];
  const brokerRoutes = brokerReviewSlugs.map((slug) => ({
    url: `${baseUrl}/brokers/${slug}`,
    lastModified: staticDate,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  // 11. Priority 0.7: Markets Category Screener pages
  const marketCategoryRoutes = ["forex", "commodities", "indices", "crypto"].map((cat) => ({
    url: `${baseUrl}/markets/${cat}`,
    lastModified: staticDate,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  // 12. Priority 0.7: Individual Market Instruments
  const marketInstruments = getAllSlugs();
  const marketInstrumentRoutes = marketInstruments.map((item) => ({
    url: `${baseUrl}/markets/${item.category}/${item.slug}`,
    lastModified: staticDate,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  // 13. Priority 0.6: Market Expert Analysis reports
  const analysisRoutes = expertAnalysis.map((post) => ({
    url: `${baseUrl}/markets/analysis/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  // 14. Priority 0.5: Glossary Term Pages (Local list)
  const glossaryTermSlugs = new Set<string>();
  const glossaryRoutes = GLOSSARY_TERMS.map((term) => {
    glossaryTermSlugs.add(term.slug);
    return {
      url: `${baseUrl}/glossary/${term.slug}`,
      lastModified: staticDate,
      changeFrequency: "monthly" as const,
      priority: 0.5,
    };
  });

  // 15. Priority 0.6: Trading Tool Reviews
  const tradingToolRoutes = tradingTools.map((tool) => ({
    url: `${baseUrl}/trading-tools/${tool.slug}`,
    lastModified: staticDate,
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  // 16. Dynamic Database Pages from Supabase (is_published = true)
  const supabaseRoutes: any[] = [];
  try {
    const supabase = createInternalSupabase();
    const { data: seoPages } = await supabase
      .from("seo_pages")
      .select("slug, page_type, updated_at")
      .eq("is_published", true);

    if (seoPages) {
      seoPages.forEach((page) => {
        const lastMod = page.updated_at ? new Date(page.updated_at) : staticDate;
        
        if (page.page_type === "compare") {
          supabaseRoutes.push({
            url: `${baseUrl}/compare/${page.slug}`,
            lastModified: lastMod,
            changeFrequency: "weekly" as const,
            priority: 0.7,
          });
        } else if (page.page_type === "best") {
          supabaseRoutes.push({
            url: `${baseUrl}/best/${page.slug}`,
            lastModified: lastMod,
            changeFrequency: "weekly" as const,
            priority: 0.7,
          });
        } else if (page.page_type === "how-to") {
          supabaseRoutes.push({
            url: `${baseUrl}/how-to/${page.slug}`,
            lastModified: lastMod,
            changeFrequency: "weekly" as const,
            priority: 0.7,
          });
        } else if (page.page_type === "glossary" && !glossaryTermSlugs.has(page.slug)) {
          supabaseRoutes.push({
            url: `${baseUrl}/glossary/${page.slug}`,
            lastModified: lastMod,
            changeFrequency: "monthly" as const,
            priority: 0.5,
          });
        }
      });
    }
  } catch (err) {
    console.error("[Sitemap] Failed to query dynamic Supabase seo_pages:", err);
  }

  return [
    ...homeRoute,
    phaseIndexRoute,
    ...phaseRoutes,
    ...moduleRoutes,
    ...hubRoutes,
    ...platformRoutes,
    ...blogRoutes,
    ...aboutRoutes,
    ...footerRoutes,

    ...brokerRoutes,
    ...marketCategoryRoutes,
    ...marketInstrumentRoutes,
    ...analysisRoutes,
    ...glossaryRoutes,
    ...tradingToolRoutes,
    ...supabaseRoutes,
  ] as MetadataRoute.Sitemap;
}

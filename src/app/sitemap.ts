import { MetadataRoute } from "next";
import { siteConfig } from "@/lib/metadata";
import { getAllPosts } from "@/lib/blog";
import { phases } from "@/data/courses";
import { LEARN_TOPICS } from "@/lib/data/learn-to-trade";
import { getAllSlugs } from "@/lib/markets-config";
import { expertAnalysis } from "@/data/analysis";
import { GLOSSARY_TERMS } from "@/data/seo/glossary";
import { tradingTools } from "@/data/trading-tools";
import { createInternalSupabase } from "@/lib/supabase/server";

// ── SEO Audit Phase 1 Freeze Guard ────────────────────────────────────────────
// City/topic programmatic pages (/learn-to-trade/[topic]/[location]) are excluded
// from the sitemap while their consolidation status is assessed (Phase 5).
// UK_LOCATIONS import is intentionally removed.
//
// Dynamic seo_pages from Supabase are only included when publishing is enabled.
const SEO_PUBLISHING_ENABLED = process.env.PROGRAMMATIC_SEO_PUBLISHING_ENABLED === "true";

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

  // 2. Priority 0.9: /courses, /courses/[all phase slugs]
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

  // 3. Priority 0.8: /courses/[phase-slug]/module-[N]
  const moduleRoutes: MetadataRoute.Sitemap = [];
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

  // 4. Priority 0.8: /learn-to-trade/[topic hub pages only]
  // NOTE: /learn-to-trade/[topic]/[city] sub-pages are intentionally excluded.
  // They are under Phase 5 consolidation review.
  const hubRoutes = LEARN_TOPICS.map((topic) => ({
    url: `${baseUrl}/learn-to-trade/${topic.slug}`,
    lastModified: staticDate,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  // 5. Priority 0.7: Core hubs and features
  // NOTE: /brokers is a 301 redirect to /brokers/all — NOT included in sitemap.
  // Only the canonical destination /brokers/all is listed.
  const platformRoutes = [
    "/platform",
    "/pricing",
    "/brokers/all",
    "/prop-firms",
    "/markets",
    "/blog",
    "/trading-tools",
    "/editorial-standards",
    "/editorial-policy",
    "/report-an-error",
    "/methodology",
    "/research",
    "/research/methodology",
    "/research/datasets",
    "/research/broker-testing",
    "/research/trading-costs",
    "/research/risk",
    "/research/prop-firms",
    "/research/corrections",
    "/research/media",
    "/calculators/drawdown-recovery",
    "/calculators/risk-of-ruin",
    "/best",
    "/how-to",
    "/compare",
    "/glossary",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: staticDate,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  const methodologySlugs = [
    "market-prices",
    "economic-calendar",
    "central-banks",
    "news-sentiment",
    "technical-confluence",
    "ai-consensus",
    "position-sizing",
    "backtesting-engine",
    "trading-journal",
    "broker-research",
    "platform-capabilities",
  ];
  const methodologyClaimRoutes = methodologySlugs.map((slug) => ({
    url: `${baseUrl}/methodology/${slug}`,
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
  const aboutRoutes = ["/about", "/contact"].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: staticDate,
    changeFrequency: "weekly" as const,
    priority: 0.5,
  }));

  // 8. Priority 0.1: Legal & Footer
  // NOTE: /login and /signup are disallowed in robots.txt — NOT listed here.
  const footerRoutes = [
    "/terms",
    "/privacy",
    "/cookies",
    "/disclaimer",
    "/legal/financial-disclaimer",
    "/legal/subscription-and-refunds",
    "/community-guidelines",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: staticDate,
    changeFrequency: "monthly" as const,
    priority: 0.1,
  }));

  // 9. Priority 0.7: Broker review pages
  // NOTE: /brokers/ig-index is a redirect to /brokers/ig-markets-review — excluded.
  // NOTE: /brokers/quiz is a redirect — excluded.
  const brokerReviewSlugs = [
    "ig-markets-review",
    "pepperstone-review",
    "ic-markets-review",
    "ig-markets",
    "pepperstone",
    "ic-markets",
    "xtb",
    "trading-212",
    "spreadex",
    "plus500",
    "tastyfx",
  ];
  const brokerRoutes = brokerReviewSlugs.map((slug) => ({
    url: `${baseUrl}/brokers/${slug}`,
    lastModified: staticDate,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  // 10. Priority 0.7: Markets Category pages
  const marketCategoryRoutes = ["forex", "commodities", "indices", "crypto"].map((cat) => ({
    url: `${baseUrl}/markets/${cat}`,
    lastModified: staticDate,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  // 11. Priority 0.7: Individual Market Instruments
  const marketInstruments = getAllSlugs();
  const marketInstrumentRoutes = marketInstruments.map((item) => ({
    url: `${baseUrl}/markets/${item.category}/${item.slug}`,
    lastModified: staticDate,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  // 12. Priority 0.6: Market Expert Analysis reports
  const analysisRoutes = expertAnalysis.map((post) => ({
    url: `${baseUrl}/markets/analysis/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  // 13. Priority 0.5: Glossary Term Pages (static list only)
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

  // 14. Priority 0.6: Trading Tool Reviews
  const tradingToolRoutes = tradingTools.map((tool) => ({
    url: `${baseUrl}/trading-tools/${tool.slug}`,
    lastModified: staticDate,
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  // 15. Dynamic seo_pages from Supabase
  // FREEZE GUARD: Only included when PROGRAMMATIC_SEO_PUBLISHING_ENABLED=true.
  // Currently frozen — no seo_pages enter the sitemap until editorial review is complete.
  const supabaseRoutes: MetadataRoute.Sitemap = [];
  if (SEO_PUBLISHING_ENABLED) {
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
  } else {
    console.log("[Sitemap] PROGRAMMATIC_SEO_PUBLISHING_ENABLED=false — seo_pages excluded from sitemap.");
  }

  // Assemble and deduplicate
  const allRoutes = [
    ...homeRoute,
    phaseIndexRoute,
    ...phaseRoutes,
    ...moduleRoutes,
    ...hubRoutes,
    ...platformRoutes,
    ...methodologyClaimRoutes,
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
  ];

  const seen = new Set<string>();
  return allRoutes.filter((route) => {
    if (seen.has(route.url)) return false;
    seen.add(route.url);
    return true;
  }) as MetadataRoute.Sitemap;
}

import { MetadataRoute } from "next";
import { siteConfig } from "@/lib/metadata";
import { LEARN_TOPICS } from "@/lib/data/learn-to-trade";
import { UK_LOCATIONS } from "@/lib/data/locations";
import { getAllPosts } from "@/lib/blog";

import { GLOSSARY_TERMS } from "@/data/seo/glossary";
import { HOW_TO_PAGES } from "@/data/seo/howto";
import { BEST_OF_PAGES } from "@/data/seo/best";
import { COMPARISON_PAGES } from "@/data/seo/compare";

// Regional SEO Data
import { AU_CITIES, AU_TOPICS, AU_BROKERS } from "@/data/seo/au-data";
import { BEST_OF_PAGES_AU } from "@/data/seo/best-au";
import { HOW_TO_PAGES_AU } from "@/data/seo/how-to-au";
import { COMPARE_PAGES_AU } from "@/data/seo/compare-au";

import { US_CITIES, US_TOPICS, US_BROKERS } from "@/data/seo/us-data";
import { BEST_OF_PAGES_US } from "@/data/seo/best-us";
import { HOW_TO_PAGES_US } from "@/data/seo/how-to-us";
import { COMPARE_PAGES_US } from "@/data/seo/compare-us";

import { SG_BROKERS, BEST_OF_PAGES_SG, HOW_TO_PAGES_SG, COMPARE_PAGES_SG } from "@/data/seo/sg-data";
import { HK_BROKERS, BEST_OF_PAGES_HK, HOW_TO_PAGES_HK, COMPARE_PAGES_HK } from "@/data/seo/hk-data";

import { tradingTools } from "@/data/trading-tools";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = siteConfig.url;

  // Static routes (Global & Root)
  const routes = [
    "", "/about", "/pricing", "/blog", "/courses", "/platform", "/contact", "/privacy", "/disclaimer",
    "/brokers", "/glossary", "/how-to", "/best", "/compare", "/markets/pulse",
    "/tools/scanner", "/tools/tradingview", "/dashboard/news", "/prop-firms", "/guides/tradingview",
    "/au", "/au/brokers", "/au/pricing",
    "/us", "/us/brokers", "/us/pricing", "/us/disclaimer",
    "/sg", "/sg/brokers", "/sg/pricing", "/sg/disclaimer",
    "/hk", "/hk/brokers", "/hk/pricing", "/hk/disclaimer",
    "/calculators", "/calculators/position-size", "/calculators/risk", "/calculators/drawdown",
    "/calculators/drawdown-recovery", "/calculators/compounding", "/calculators/risk-of-ruin",
    "/calculators/pip-value", "/calculators/prop-firm-daily-loss", "/calculators/prop-firm-maximum-loss",
    "/trading-tools"
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 1.0,
  }));

  // Topic routes
  const topics = LEARN_TOPICS.map((topic) => ({ url: `${baseUrl}/learn-to-trade/${topic.slug}`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.8 }));

  // Blog routes
  const blogs = getAllPosts().map((post) => ({ url: `${baseUrl}/blog/${post.slug}`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.7 }));

  // Location programmatic routes
  const ukLocationRoutes: MetadataRoute.Sitemap = [];
  LEARN_TOPICS.forEach(topic => {
    UK_LOCATIONS.forEach(loc => {
      ukLocationRoutes.push({ url: `${baseUrl}/learn-to-trade/${topic.slug}/${loc.slug}`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.5 });
    });
  });

  const auLocationRoutes: MetadataRoute.Sitemap = [];
  AU_TOPICS.forEach(topicSlug => {
    AU_CITIES.forEach(citySlug => {
      auLocationRoutes.push({ url: `${baseUrl}/au/learn-to-trade/${topicSlug}/${citySlug}`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.5 });
    });
  });

  const usLocationRoutes: MetadataRoute.Sitemap = [];
  US_TOPICS.forEach(topicSlug => {
    US_CITIES.forEach(citySlug => {
      usLocationRoutes.push({ url: `${baseUrl}/us/learn-to-trade/${topicSlug}/${citySlug}`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.5 });
    });
  });

  // Regional Content (Best-of, How-to, Compare, Brokers)
  const regionalRoutes = [
    ...BEST_OF_PAGES_AU.map(p => ({ url: `${baseUrl}/au/best/${p.slug}`, priority: 0.7 })),
    ...HOW_TO_PAGES_AU.map(p => ({ url: `${baseUrl}/au/how-to/${p.slug}`, priority: 0.6 })),
    ...COMPARE_PAGES_AU.map(p => ({ url: `${baseUrl}/au/compare/${p.slug}`, priority: 0.7 })),
    ...AU_BROKERS.map(b => ({ url: `${baseUrl}/au/brokers/${b.slug}`, priority: 0.8 })),
    
    ...BEST_OF_PAGES_US.map(p => ({ url: `${baseUrl}/us/best/${p.slug}`, priority: 0.7 })),
    ...HOW_TO_PAGES_US.map(p => ({ url: `${baseUrl}/us/how-to/${p.slug}`, priority: 0.6 })),
    ...COMPARE_PAGES_US.map(p => ({ url: `${baseUrl}/us/compare/${p.slug}`, priority: 0.7 })),
    ...US_BROKERS.map(b => ({ url: `${baseUrl}/us/brokers/${b.slug}`, priority: 0.8 })),

    ...BEST_OF_PAGES_SG.map(p => ({ url: `${baseUrl}/sg/best/${p.slug}`, priority: 0.7 })),
    ...HOW_TO_PAGES_SG.map(p => ({ url: `${baseUrl}/sg/how-to/${p.slug}`, priority: 0.6 })),
    ...COMPARE_PAGES_SG.map(p => ({ url: `${baseUrl}/sg/compare/${p.slug}`, priority: 0.7 })),
    ...SG_BROKERS.map(b => ({ url: `${baseUrl}/sg/brokers/${b.slug}`, priority: 0.8 })),

    ...BEST_OF_PAGES_HK.map(p => ({ url: `${baseUrl}/hk/best/${p.slug}`, priority: 0.7 })),
    ...HOW_TO_PAGES_HK.map(p => ({ url: `${baseUrl}/hk/how-to/${p.slug}`, priority: 0.6 })),
    ...COMPARE_PAGES_HK.map(p => ({ url: `${baseUrl}/hk/compare/${p.slug}`, priority: 0.7 })),
    ...HK_BROKERS.map(b => ({ url: `${baseUrl}/hk/brokers/${b.slug}`, priority: 0.8 })),
  ].map(route => ({
    ...route,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
  }));

  // Global SEO Content
  const globalSeo = [
    ...GLOSSARY_TERMS.map(t => ({ url: `${baseUrl}/glossary/${t.slug}`, priority: 0.5 })),
    ...HOW_TO_PAGES.map(t => ({ url: `${baseUrl}/how-to/${t.slug}`, priority: 0.6 })),
    ...BEST_OF_PAGES.map(t => ({ url: `${baseUrl}/best/${t.slug}`, priority: 0.8 })),
    ...COMPARISON_PAGES.map(t => ({ url: `${baseUrl}/compare/${t.slug}`, priority: 0.7 })),
    ...tradingTools.map(t => ({ url: `${baseUrl}/trading-tools/${t.slug}`, priority: 0.8 })),
  ].map(route => ({
    ...route,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
  }));

  const riskCalculatorRoute = {
    url: `${baseUrl}/tools/risk-calculator`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  };

  return [
    ...routes,
    riskCalculatorRoute,
    ...topics,
    ...blogs,
    ...ukLocationRoutes,
    ...auLocationRoutes,
    ...usLocationRoutes,
    ...regionalRoutes,
    ...globalSeo,
  ] as MetadataRoute.Sitemap;
}

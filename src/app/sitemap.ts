import { MetadataRoute } from "next";
import { siteConfig } from "@/lib/metadata";
import { LEARN_TOPICS } from "@/lib/data/learn-to-trade";
import { UK_LOCATIONS } from "@/lib/data/locations";
import { getAllPosts } from "@/lib/blog";

import { INSTRUMENT_SLUGS } from "@/lib/data/instruments";
import { GLOSSARY_TERMS } from "@/data/seo/glossary";
import { HOW_TO_PAGES } from "@/data/seo/howto";
import { BEST_OF_PAGES } from "@/data/seo/best";
import { COMPARISON_PAGES } from "@/data/seo/compare";

// Regional SEO Data
import { AU_CITIES, AU_TOPICS } from "@/data/seo/locations-au";
import { BEST_OF_PAGES_AU } from "@/data/seo/best-au";
import { HOW_TO_PAGES_AU } from "@/data/seo/how-to-au";
import { COMPARE_PAGES_AU } from "@/data/seo/compare-au";

import { US_CITIES, US_TOPICS, BEST_OF_PAGES_US, HOW_TO_PAGES_US, COMPARE_PAGES_US } from "@/data/seo/us-data";
import { SG_CITIES, SG_TOPICS, BEST_OF_PAGES_SG, HOW_TO_PAGES_SG } from "@/data/seo/sg-data";
import { HK_CITIES, HK_TOPICS, BEST_OF_PAGES_HK } from "@/data/seo/hk-data";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = siteConfig.url;

  // Static routes
  const routes = [
    "",
    "/about",
    "/pricing",
    "/blog",
    "/courses",
    "/contact",
    "/privacy",
    "/disclaimer",
    "/brokers",
    "/glossary",
    "/how-to",
    "/best",
    "/compare",
    "/markets/pulse",
    "/tools/scanner",
    "/dashboard/news",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 1.0,
  }));

  // Tool marketing routes
  const toolRoutes = [
    "ai-trade-journal",
    "risk-calculator",
    "ai-market-scanner",
    "strategy-backtester",
    "market-charts",
    "ai-daily-briefing"
  ].map((slug) => ({
    url: `${baseUrl}/tools/${slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.9,
  }));

  // Topic routes
  const topics = LEARN_TOPICS.map((topic) => ({
    url: `${baseUrl}/learn-to-trade/${topic.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  // Blog routes
  const blogs = getAllPosts().map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  // Programmatic Market Instrument routes
  const markets = INSTRUMENT_SLUGS.map((slug) => ({
    url: `${baseUrl}/markets/${slug}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: 0.7,
  }));

  // Location programmatic routes (600 pages)
  const locationRoutes: { url: string, lastModified: Date, changeFrequency: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never" | undefined, priority: number }[] = [];
  
  LEARN_TOPICS.forEach(topic => {
    UK_LOCATIONS.forEach(loc => {
      locationRoutes.push({
        url: `${baseUrl}/learn-to-trade/${topic.slug}/${loc.slug}`,
        lastModified: new Date(),
        changeFrequency: "monthly" as const,
        priority: 0.5,
      });
    });
  });

  // Glossary routes
  const glossary = GLOSSARY_TERMS.map((term) => ({
    url: `${baseUrl}/glossary/${term.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.5,
  }));

  // How-to routes
  const howTos = HOW_TO_PAGES.map((guide) => ({
    url: `${baseUrl}/how-to/${guide.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  // Best-of routes
  const bestOfs = BEST_OF_PAGES.map((page) => ({
    url: `${baseUrl}/best/${page.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  // Broker review routes
  const brokerReviews = require("@/data/brokers").brokers.map((broker: any) => ({
    url: `${baseUrl}/brokers/${broker.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  // Comparison routes
  const comparisons = COMPARISON_PAGES.map((page) => ({
    url: `${baseUrl}/compare/${page.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  // Regional Location programmatic routes
  const intlLocationRoutes: { url: string, lastModified: Date, changeFrequency: "monthly", priority: number }[] = [];
  
  const regions = [
    { code: "au", topics: AU_TOPICS, cities: AU_CITIES },
    { code: "us", topics: US_TOPICS, cities: US_CITIES },
    { code: "sg", topics: SG_TOPICS, cities: SG_CITIES },
    { code: "hk", topics: HK_TOPICS, cities: HK_CITIES },
  ];

  regions.forEach(region => {
    region.topics.forEach(topic => {
      region.cities.forEach(city => {
        intlLocationRoutes.push({
          url: `${baseUrl}/${region.code}/learn-to-trade/${topic}/${city}`,
          lastModified: new Date(),
          changeFrequency: "monthly",
          priority: 0.5,
        });
      });
    });
  });

  // Regional Best-of routes
  const intlBestOfs = [
    ...BEST_OF_PAGES_AU.map(p => ({ url: `${baseUrl}/au/best/${p.slug}`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.8 })),
    ...BEST_OF_PAGES_US.map(p => ({ url: `${baseUrl}/us/best/${p.slug}`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.8 })),
    ...BEST_OF_PAGES_SG.map(p => ({ url: `${baseUrl}/sg/best/${p.slug}`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.8 })),
    ...BEST_OF_PAGES_HK.map(p => ({ url: `${baseUrl}/hk/best/${p.slug}`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.8 })),
  ];

  // Regional How-To routes
  const intlHowTos = [
    ...HOW_TO_PAGES_AU.map(p => ({ url: `${baseUrl}/au/how-to/${p.slug}`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.6 })),
    ...HOW_TO_PAGES_US.map(p => ({ url: `${baseUrl}/us/how-to/${p.slug}`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.6 })),
    ...HOW_TO_PAGES_SG.map(p => ({ url: `${baseUrl}/sg/how-to/${p.slug}`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.6 })),
  ];

  // Regional Comparison routes
  const intlComparisons = [
    ...COMPARE_PAGES_AU.map(p => ({ url: `${baseUrl}/au/compare/${p.slug}`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.7 })),
    ...COMPARE_PAGES_US.map(p => ({ url: `${baseUrl}/us/compare/${p.slug}`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.7 })),
  ];

  return [
    ...routes, 
    ...toolRoutes, 
    ...topics, 
    ...blogs, 
    ...markets, 
    ...locationRoutes, 
    ...intlLocationRoutes,
    ...glossary, 
    ...howTos, 
    ...intlHowTos,
    ...bestOfs, 
    ...intlBestOfs,
    ...brokerReviews, 
    ...comparisons,
    ...intlComparisons
  ];
}

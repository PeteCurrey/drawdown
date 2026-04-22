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

  return [...routes, ...toolRoutes, ...topics, ...blogs, ...markets, ...locationRoutes, ...glossary, ...howTos, ...bestOfs, ...brokerReviews, ...comparisons];
}

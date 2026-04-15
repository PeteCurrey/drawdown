import { MetadataRoute } from "next";
import { siteConfig } from "@/lib/metadata";
import seoData from "@/data/seo/topics.json";
import { blogPosts } from "@/data/blog";
import { UK_LOCATIONS, TRADING_TOPICS } from "@/lib/seo-locations";

const PAIRS = [
  "gbpusd", "eurusd", "usdjpy", "audusd", "usdcad", "nzdusd", "usdchf",
  "eurgbp", "eurjpy", "gbpjpy", "btcusd", "ethusd", "solusd", "xauusd",
  "wti", "uk100", "spx500", "nsdq100"
];

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
    "/tools/scanner",
    "/dashboard/news",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 1.0,
  }));

  // Topic routes
  const topics = seoData.topics.map((topic) => ({
    url: `${baseUrl}/learn-to-trade/${topic.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  // Blog routes
  const blogs = blogPosts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  // Programmatic Market Pair routes
  const markets = PAIRS.map((symbol) => ({
    url: `${baseUrl}/market/${symbol}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: 0.9,
  }));

  // Location programmatic routes
  const locationRoutes: { url: string, lastModified: Date, changeFrequency: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never" | undefined, priority: number }[] = [];
  
  TRADING_TOPICS.forEach(topic => {
    UK_LOCATIONS.forEach(loc => {
      locationRoutes.push({
        url: `${baseUrl}/learn-to-trade/${topic.id}/${loc.id}`,
        lastModified: new Date(),
        changeFrequency: "monthly" as const,
        priority: 0.6,
      });
    });
  });

  return [...routes, ...topics, ...blogs, ...markets, ...locationRoutes];
}

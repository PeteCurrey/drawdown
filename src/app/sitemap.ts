import { MetadataRoute } from "next";
import { siteConfig } from "@/lib/metadata";
import { getAllPosts } from "@/lib/blog";

const MARKET_SLUGS = [
  "gbpusd", "eurusd", "usdjpy", "gbpjpy", "audusd",
  "ftse-100", "sp-500", "nasdaq", "dax-40",
  "bitcoin", "ethereum",
  "gold-xauusd", "crude-oil-wti"
];

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = siteConfig.url;

  // Base static routes
  const staticRoutes = [
    "",
    "/about",
    "/pricing",
    "/blog",
    "/courses",
    "/platform",
    "/contact",
    "/privacy",
    "/disclaimer",
    "/brokers",
    "/prop-firms",
    "/markets/pulse",
    "/store/prop-survival-kit"
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 1.0,
  }));

  // Tools & Calculators
  const toolRoutes = [
    "/tools/risk-calculator",
    "/tools/tradingview"
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  // Market Symbol pages (13 pages)
  const marketRoutes = MARKET_SLUGS.map((slug) => ({
    url: `${baseUrl}/markets/${slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  // Broker review pages
  const brokerReviewRoutes = [
    "/brokers/ig-markets-review",
    "/brokers/ic-markets-review",
    "/brokers/pepperstone-review"
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  // Blog posts
  const blogRoutes = getAllPosts().map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [
    ...staticRoutes,
    ...toolRoutes,
    ...marketRoutes,
    ...brokerReviewRoutes,
    ...blogRoutes
  ] as MetadataRoute.Sitemap;
}

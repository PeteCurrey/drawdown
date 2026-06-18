import { MetadataRoute } from "next";
import { siteConfig } from "@/lib/metadata";
import { getAllPosts } from "@/lib/blog";
import { MARKETS_CONFIG } from "@/lib/markets-config";

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
    "/store/prop-survival-kit",
    "/markets",
    "/markets/forex",
    "/markets/commodities",
    "/markets/indices",
    "/markets/crypto"
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

  // Market Category Instrument pages (16 pages)
  const marketRoutes = MARKETS_CONFIG.map((inst) => ({
    url: `${baseUrl}/markets/${inst.category}/${inst.slug}`,
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

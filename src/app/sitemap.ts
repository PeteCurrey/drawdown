import { MetadataRoute } from "next";

const BASE_URL = "https://drawdown.trade";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    "",
    "/about",
    "/pricing",
    "/blog",
    "/login",
    "/signup",
  ].map((route) => ({
    url: `${BASE_URL}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1.0 : 0.8,
  }));

  // Programmatic SEO pages
  const topics = [
    "day-trading", "forex-trading", "swing-trading", "scalping",
    "price-action", "technical-analysis", "risk-management",
    "trading-psychology", "cryptocurrency-trading", "stock-trading",
  ];

  const cities = [
    "london", "manchester", "birmingham", "leeds", "glasgow",
    "edinburgh", "bristol", "liverpool", "sheffield", "cardiff",
    "belfast", "nottingham", "newcastle", "southampton", "leicester",
    "brighton", "plymouth", "reading", "coventry", "cambridge",
  ];

  const topicRoutes = topics.map((topic) => ({
    url: `${BASE_URL}/learn-to-trade/${topic}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const locationRoutes = topics.flatMap((topic) =>
    cities.map((city) => ({
      url: `${BASE_URL}/learn-to-trade/${topic}/${city}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.5,
    }))
  );

  return [...staticRoutes, ...topicRoutes, ...locationRoutes];
}

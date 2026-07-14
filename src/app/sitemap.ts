import { MetadataRoute } from "next";
import { siteConfig } from "@/lib/metadata";
import { getAllPosts } from "@/lib/blog";
import { phases } from "@/data/courses";
import { LEARN_TOPICS } from "@/lib/data/learn-to-trade";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = siteConfig.url;

  // 1. Priority 1.0: Homepage (changeFreq: weekly)
  const homeRoute = [
    {
      url: `${baseUrl}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 1.0,
    },
  ];

  // 2. Priority 0.9: /courses, /courses/[all 13 phase slugs] (changeFreq: monthly)
  const phaseIndexRoute = {
    url: `${baseUrl}/courses`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.9,
  };
  const phaseRoutes = phases.map((phase) => ({
    url: `${baseUrl}/courses/${phase.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.9,
  }));

  // 3. Priority 0.8: /courses/[phase-slug]/module-[N] (all 117 module pages) (changeFreq: monthly)
  const moduleRoutes: any[] = [];
  phases.forEach((phase) => {
    phase.modules_list.forEach((_, idx) => {
      moduleRoutes.push({
        url: `${baseUrl}/courses/${phase.slug}/module-${idx + 1}`,
        lastModified: new Date(),
        changeFrequency: "monthly" as const,
        priority: 0.8,
      });
    });
  });

  // 4. Priority 0.8: /learn-to-trade/[all hub pages] (changeFreq: monthly)
  const hubRoutes = LEARN_TOPICS.map((topic) => ({
    url: `${baseUrl}/learn-to-trade/${topic.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  // 5. Priority 0.7: /platform, /pricing, /brokers, /prop-firms, /markets (changeFreq: weekly)
  const platformRoutes = [
    "/platform",
    "/pricing",
    "/brokers",
    "/prop-firms",
    "/markets"
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  // 6. Priority 0.6: /blog/[all posts] (changeFreq: weekly)
  const posts = await getAllPosts();
  const blogRoutes = posts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  // 7. Priority 0.5: /about, /contact (changeFreq: weekly)
  const aboutRoutes = [
    "/about",
    "/contact"
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.5,
  }));

  // 8. Priority 0.1: /login, /signup, /privacy, /disclaimer (changeFreq: weekly)
  const footerRoutes = [
    "/login",
    "/signup",
    "/privacy",
    "/disclaimer"
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.1,
  }));

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
  ] as MetadataRoute.Sitemap;
}


import { MetadataRoute } from "next";
import { siteConfig } from "@/lib/metadata";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/admin/",
        "/dashboard/",
        "/tools/",
        "/api/",
        "/auth/callback",
      ],
    },
    sitemap: `${siteConfig.url}/sitemap.xml`,
  };
}

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
        "/api/",
        "/auth/callback",
        "/login",
        "/signup",
        "/account",
      ],
    },
    sitemap: `${siteConfig.url}/sitemap.xml`,
  };
}

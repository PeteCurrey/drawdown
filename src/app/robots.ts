import { MetadataRoute } from "next";
import { siteConfig } from "@/lib/metadata";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        // Standard crawlers
        userAgent: "*",
        allow: "/",
        disallow: [
          // Private auth flows — user disallowed in sitemap too
          "/admin/",
          "/dashboard/",
          "/api/",
          "/auth/callback",
          "/auth/",
          "/login",
          "/signup",
          "/account",
          // Cron endpoints
          "/api/cron/",
          // Internal redirect intermediaries — not canonical destinations
          "/brokers?",     // query-string variants
          // SSO / webhook endpoints
          "/api/stripe/",
          "/api/resend/",
        ],
      },
      {
        // Block AI training crawlers (optional — add/remove as needed)
        userAgent: "GPTBot",
        disallow: "/",
      },
      {
        userAgent: "Google-Extended",
        disallow: "/",
      },
      {
        userAgent: "CCBot",
        disallow: "/",
      },
      {
        userAgent: "anthropic-ai",
        disallow: "/",
      },
    ],
    sitemap: `${siteConfig.url}/sitemap.xml`,
  };
}

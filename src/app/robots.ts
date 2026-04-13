import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/dashboard", "/learn/", "/tools/", "/profile", "/admin", "/api/"],
      },
    ],
    sitemap: "https://drawdown.trade/sitemap.xml",
  };
}

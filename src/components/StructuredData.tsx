"use client";

import Script from "next/script";

interface StructuredDataProps {
  type: "Organization" | "Course" | "Article" | "Product" | "FAQPage" | "WebSite" | "Person" | "BreadcrumbList" | "ItemList";
  data: any;
}

export function StructuredData({ type, data }: StructuredDataProps) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": type,
    ...data,
  };

  return (
    <Script
      id={`json-ld-${type.toLowerCase()}`}
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

/**
 * Helper to generate default Organization schema
 */
export const defaultOrgSchema = {
  name: "Drawdown Trading",
  url: "https://drawdown.trading",
  logo: "https://drawdown.trading/assets/brand/logo.png",
  sameAs: [
    "https://x.com/drawdowntrading",
    "https://discord.gg/drawdown",
  ],
  contactPoint: {
    "@type": "ContactPoint",
    "email": "support@drawdown.trading",
    "contactType": "customer support",
    "areaServed": "GB",
    "availableLanguage": "English",
  },
};

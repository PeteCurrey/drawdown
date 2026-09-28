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
  name: "Avorria Trading",
  url: "https://avorria.com",
  logo: "https://avorria.com/assets/brand/logo.png",
  sameAs: [
    "https://x.com/avorriatrading",
    "https://discord.gg/avorria",
  ],
  contactPoint: {
    "@type": "ContactPoint",
    "email": "support@avorria.com",
    "contactType": "customer support",
    "areaServed": "GB",
    "availableLanguage": "English",
  },
};

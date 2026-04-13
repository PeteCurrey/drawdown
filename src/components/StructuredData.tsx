"use client";

import Script from "next/script";

interface StructuredDataProps {
  type: "Organization" | "Course" | "Article" | "Product" | "FAQPage" | "WebSite" | "Person" | "BreadcrumbList";
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
  name: "Drawdown",
  url: "https://drawdown.trade",
  logo: "https://drawdown.trade/logo.png",
  sameAs: [
    "https://twitter.com/drawdown",
    "https://discord.gg/drawdown",
  ],
  contactPoint: {
    "@type": "ContactPoint",
    "telephone": "+44-000-0000",
    "contactType": "customer service",
    "areaServed": "GB",
    "availableLanguage": "en",
  },
};

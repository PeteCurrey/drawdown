import type { Metadata } from "next";
import { CoffeezillaAlexGClient } from "./CoffeezillaAlexGClient";

export const metadata: Metadata = {
  title: "The Coffeezilla Video on fxAlexG: What It Actually Tells Us About Trading Education | Drawdown",
  description: "Seven and a half million in course revenue. Demo accounts. Undisclosed affiliates. We break down what the fxAlexG situation really tells us about trading education — and what traders should actually do with that information.",
  openGraph: {
    title: "The Coffeezilla Video on fxAlexG: What It Actually Tells Us About Trading Education | Drawdown",
    description: "Seven and a half million in course revenue. Demo accounts. Undisclosed affiliates. We break down what the fxAlexG situation really tells us about trading education — and what traders should actually do with that information.",
    type: "article",
    url: "https://drawdown.trading/blog/coffeezilla-alexg-trading-education",
    images: [
      {
        url: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=1200&q=80",
        width: 1200,
        height: 630,
        alt: "Trading charts on multiple monitors in a dark room",
      }
    ],
  }
};

export default function CoffeezillaAlexGPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": "The Coffeezilla Video on fxAlexG: What It Actually Tells Us About Trading Education",
    "description": "Seven and a half million in course revenue. Demo accounts. Undisclosed affiliates. We break down what the fxAlexG situation really tells us about trading education — and what traders should actually do with that information.",
    "author": {
      "@type": "Person",
      "name": "Pete",
      "jobTitle": "Founder",
      "worksFor": {
        "@type": "Organization",
        "name": "Drawdown",
        "url": "https://drawdown.trading"
      }
    },
    "publisher": {
      "@type": "Organization",
      "name": "Drawdown",
      "url": "https://drawdown.trading"
    },
    "datePublished": "2026-06-20T12:00:00Z",
    "dateModified": "2026-06-20T12:00:00Z",
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": "https://drawdown.trading/blog/coffeezilla-alexg-trading-education"
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <CoffeezillaAlexGClient />
    </>
  );
}

import type { Metadata } from "next";
import { TradingEducationModelClient } from "./TradingEducationModelClient";

export const metadata: Metadata = {
  title: "The Trading Education Business Model: How the Money Is Really Made | Drawdown",
  description: "Courses. Affiliates. Broker referrals. The trading education business model isn't a secret — it's just rarely explained honestly. Here's exactly how it works, who benefits, and what traders should do with that knowledge.",
  openGraph: {
    title: "The Trading Education Business Model: How the Money Is Really Made | Drawdown",
    description: "Courses. Affiliates. Broker referrals. The trading education business model isn't a secret — it's just rarely explained honestly. Here's exactly how it works, who benefits, and what traders should do with that knowledge.",
    type: "article",
    url: "https://drawdown.trading/blog/trading-education-business-model",
    images: [
      {
        url: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=800",
        width: 800,
        height: 600,
        alt: "The Trading Education Business Model",
      }
    ],
  }
};

export default function TradingEducationBusinessModelPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": "The Trading Education Business Model: How the Money Is Really Made",
    "description": "Courses. Affiliates. Broker referrals. The trading education business model isn't a secret — it's just rarely explained honestly. Here's exactly how it works, who benefits, and what traders should do with that knowledge.",
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
      "@id": "https://drawdown.trading/blog/trading-education-business-model"
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <TradingEducationModelClient />
    </>
  );
}

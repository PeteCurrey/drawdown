import type { Metadata } from "next";
import { TradingEducationModelClient } from "./TradingEducationModelClient";

export const metadata: Metadata = {
  title: "How the Trading Education Business Model Works | Drawdown",
  description: "An honest look at how the trading education business model works. We analyze course fees, affiliate payouts, broker referrals, and how to spot real value.",
  openGraph: {
    title: "How the Trading Education Business Model Works | Drawdown",
    description: "An honest look at how the trading education business model works. We analyze course fees, affiliate payouts, broker referrals, and how to spot real value.",
    type: "article",
    url: "https://drawdown.trading/blog/trading-education-business-model",
    images: [
      {
        url: "https://images.unsplash.com/photo-1559526324-593bc073d938?w=1200&q=80",
        width: 1200,
        height: 630,
        alt: "Financial data and market analysis dashboard",
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

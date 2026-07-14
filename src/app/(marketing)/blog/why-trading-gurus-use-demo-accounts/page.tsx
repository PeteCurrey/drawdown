import type { Metadata } from "next";
import { WhyGurusDemoClient } from "./WhyGurusDemoClient";

export const metadata: Metadata = {
  title: "Why Trading Gurus Use Demo Accounts — And What It Actually Means | Drawdown",
  description: "The hate around demo accounts in trading content is mostly misdirected. Here's the honest reason gurus use them, why the omission is the real problem, and what traders should actually be looking for.",
  openGraph: {
    title: "Why Trading Gurus Use Demo Accounts — And What It Actually Means | Drawdown",
    description: "The hate around demo accounts in trading content is mostly misdirected. Here's the honest reason gurus use them, why the omission is the real problem, and what traders should actually be looking for.",
    type: "article",
    url: "https://drawdown.trading/blog/why-trading-gurus-use-demo-accounts",
    images: [
      {
        url: "https://images.unsplash.com/photo-1642790551116-18e150f248e3?w=1200&q=80",
        width: 1200,
        height: 630,
        alt: "Trader analysing candlestick charts on screen",
      }
    ],
  }
};

export default function WhyTradingGurusUseDemoAccountsPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": "Why Trading Gurus Use Demo Accounts — And What It Actually Means",
    "description": "The hate around demo accounts in trading content is mostly misdirected. Here's the honest reason gurus use them, why the omission is the real problem, and what traders should actually be looking for.",
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
      "@id": "https://drawdown.trading/blog/why-trading-gurus-use-demo-accounts"
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <WhyGurusDemoClient />
    </>
  );
}

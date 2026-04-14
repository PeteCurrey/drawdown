import { Metadata } from "next";

interface MetadataProps {
  title?: string;
  description?: string;
  image?: string;
  noIndex?: boolean;
  path?: string;
}

export const siteConfig = {
  name: "Drawdown",
  title: "Drawdown — Trade the Truth",
  description: "Learn to trade properly with structured courses, AI-powered tools, and honest mentorship. No gurus. No hype. Just edge.",
  url: "https://drawdown.trade",
  ogImage: "/og/default-og.png",
  links: {
    twitter: "https://twitter.com/drawdown",
    discord: "https://discord.gg/drawdown",
  },
};

export function getMetadata({
  title,
  description = siteConfig.description,
  image = siteConfig.ogImage,
  noIndex = false,
  path = "",
}: MetadataProps = {}): Metadata {
  const fullTitle = title 
    ? `${title} | ${siteConfig.name}` 
    : siteConfig.title;

  const url = `${siteConfig.url}${path}`;

  return {
    title: fullTitle,
    description,
    keywords: [
      "trading education",
      "learn to trade",
      "day trading UK",
      "forex education",
      "trading courses UK",
      "AI trading tools",
      "trading psychology",
      "risk management",
      "technical analysis"
    ],
    authors: [
      {
        name: "Pete (Founder)",
        url: "https://drawdown.trade/about",
      },
    ],
    openGraph: {
      type: "website",
      locale: "en_GB",
      url,
      title: fullTitle,
      description,
      siteName: siteConfig.name,
      images: [
        {
          url: image.startsWith('http') ? image : `${siteConfig.url}${image}`,
          width: 1200,
          height: 630,
          alt: fullTitle,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [image.startsWith('http') ? image : `${siteConfig.url}${image}`],
      creator: "@drawdown",
    },
    icons: {
      icon: "/icon.svg",
      shortcut: "/icon.svg",
      apple: "/icon.svg",
    },
    metadataBase: new URL(siteConfig.url),
    alternates: {
      canonical: url,
    },
    ...(noIndex && {
      robots: {
        index: false,
        follow: false,
      },
    }),
  };
}

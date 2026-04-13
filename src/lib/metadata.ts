import { Metadata } from "next";

interface MetadataProps {
  title?: string;
  description?: string;
  image?: string;
  noIndex?: boolean;
}

export const siteConfig = {
  name: "Drawdown",
  title: "Drawdown — Trade the Truth",
  description: "Learn to trade properly with structured courses, AI-powered tools, and honest mentorship. No gurus. No hype. Just edge.",
  url: "https://drawdown.trade",
  ogImage: "/og-image.png", // Default OG image
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
}: MetadataProps = {}): Metadata {
  const fullTitle = title 
    ? `${title} | ${siteConfig.name}` 
    : siteConfig.title;

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
    ],
    authors: [
      {
        name: "Pete Currey",
        url: "https://drawdown.trade/about",
      },
    ],
    openGraph: {
      type: "website",
      locale: "en_GB",
      url: siteConfig.url,
      title: fullTitle,
      description,
      siteName: siteConfig.name,
      images: [
        {
          url: image,
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
      images: [image],
      creator: "@drawdown",
    },
    icons: {
      icon: "/favicon.ico",
      shortcut: "/favicon.ico",
      apple: "/apple-touch-icon.png",
    },
    manifest: `${siteConfig.url}/site.webmanifest`,
    metadataBase: new URL(siteConfig.url),
    ...(noIndex && {
      robots: {
        index: false,
        follow: false,
      },
    }),
  };
}

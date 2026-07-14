import { Metadata } from "next";

interface MetadataProps {
  title?: string;
  description?: string;
  image?: string;
  noIndex?: boolean;
  path?: string;
  hasRegionalVariants?: boolean;
}

export const siteConfig = {
  name: "Drawdown",
  title: "Drawdown — Trade the Truth",
  description: "Learn to trade properly with structured courses, AI-powered tools, and honest mentorship. No gurus. No hype. Just edge.",
  url: "https://drawdown.trading",
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
  path,
  hasRegionalVariants = false,
}: MetadataProps = {}): Metadata {
  const fullTitle = title 
    ? `${title} | ${siteConfig.name}` 
    : siteConfig.title;

  const url = path !== undefined ? `${siteConfig.url}${path}` : undefined;

  const languages: Record<string, string> = {};
  if (hasRegionalVariants && path !== undefined) {
    const cleanPath = path === "/" ? "" : path.startsWith("/") ? path : `/${path}`;
    languages['en-GB'] = `${siteConfig.url}${cleanPath}`;
    languages['en-AU'] = `${siteConfig.url}/au${cleanPath}`;
    languages['en-US'] = `${siteConfig.url}/us${cleanPath}`;
    languages['en-SG'] = `${siteConfig.url}/sg${cleanPath}`;
    languages['en-HK'] = `${siteConfig.url}/hk${cleanPath}`;
    languages['x-default'] = `${siteConfig.url}${cleanPath}`;
  }

  return {
    title: fullTitle,
    description,
    authors: [
      {
        name: "Pete Currey",
        url: "https://drawdown.trading/about",
      },
    ],
    openGraph: {
      type: "website",
      locale: "en_GB",
      url: url || siteConfig.url,
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
      icon: "/favicon.png",
      shortcut: "/favicon.png",
      apple: "/favicon.png",
    },
    metadataBase: new URL(siteConfig.url),
    alternates: {
      canonical: url,
      languages: hasRegionalVariants && path !== undefined ? languages : undefined,
    },
    ...(noIndex && {
      robots: {
        index: false,
        follow: false,
      },
    }),
  };
}

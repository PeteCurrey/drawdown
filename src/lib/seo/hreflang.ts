import { siteConfig } from "@/lib/metadata";

export type Region = "uk" | "au" | "us" | "sg" | "hk";

interface HreflangTag {
  rel: string;
  hreflang: string;
  href: string;
}

export const REGIONS: Record<Region, { code: string; label: string; flag: string; currency: string }> = {
  uk: { code: "en-GB", label: "UK", flag: "🇬🇧", currency: "GBP" },
  au: { code: "en-AU", label: "Australia", flag: "🇦🇺", currency: "AUD" },
  us: { code: "en-US", label: "United States", flag: "🇺🇸", currency: "USD" },
  sg: { code: "en-SG", label: "Singapore", flag: "🇸🇬", currency: "SGD" },
  hk: { code: "en-HK", label: "Hong Kong", flag: "🇭🇰", currency: "HKD" },
};

/**
 * Generates hreflang tags for a given path.
 * Assumes that if a page exists in one region, it has a corresponding path in others.
 * Note: Not all pages exist in all regions, so this should be used selectively.
 */
export function getHreflangTags(path: string, activeRegions: Region[] = ["uk", "au", "us", "sg", "hk"]): HreflangTag[] {
  const baseUrl = siteConfig.url;
  const tags: HreflangTag[] = [];

  activeRegions.forEach((region) => {
    const regionPrefix = region === "uk" ? "" : `/${region}`;
    const href = `${baseUrl}${regionPrefix}${path === "/" ? "" : path}`;
    
    tags.push({
      rel: "alternate",
      hreflang: REGIONS[region].code,
      href,
    });
  });

  // x-default points to UK
  tags.push({
    rel: "alternate",
    hreflang: "x-default",
    href: `${baseUrl}${path === "/" ? "" : path}`,
  });

  return tags;
}

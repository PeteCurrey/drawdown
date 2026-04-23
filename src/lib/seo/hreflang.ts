import { siteConfig } from "@/lib/metadata";

export type Region = "uk" | "au" | "us" | "sg" | "hk" | "ca" | "de" | "ae" | "in" | "my" | "ph";

interface HreflangTag {
  rel: string;
  hreflang: string;
  href: string;
}

export const REGIONS: Record<Region, { code: string; label: string; demonym: string; flag: string; currency: string }> = {
  uk: { code: "en-GB", label: "UK", demonym: "UK", flag: "🇬🇧", currency: "GBP" },
  au: { code: "en-AU", label: "Australia", demonym: "Australian", flag: "🇦🇺", currency: "AUD" },
  us: { code: "en-US", label: "United States", demonym: "US", flag: "🇺🇸", currency: "USD" },
  sg: { code: "en-SG", label: "Singapore", demonym: "Singaporean", flag: "🇸🇬", currency: "SGD" },
  hk: { code: "en-HK", label: "Hong Kong", demonym: "Hong Kong", flag: "🇭🇰", currency: "HKD" },
  ca: { code: "en-CA", label: "Canada", demonym: "Canadian", flag: "🇨🇦", currency: "CAD" },
  de: { code: "de-DE", label: "Germany", demonym: "German", flag: "🇩🇪", currency: "EUR" },
  ae: { code: "en-AE", label: "UAE", demonym: "UAE", flag: "🇦🇪", currency: "AED" },
  in: { code: "en-IN", label: "India", demonym: "Indian", flag: "🇮🇳", currency: "INR" },
  my: { code: "en-MY", label: "Malaysia", demonym: "Malaysian", flag: "🇲🇾", currency: "MYR" },
  ph: { code: "en-PH", label: "Philippines", demonym: "Filipino", flag: "🇵🇭", currency: "PHP" },
};

/**
 * Generates hreflang tags for a given path.
 * Assumes that if a page exists in one region, it has a corresponding path in others.
 * Note: Not all pages exist in all regions, so this should be used selectively.
 */
export function getHreflangTags(path: string, activeRegions: Region[] = ["uk", "au", "us", "sg", "hk", "ca", "de", "ae", "in", "my", "ph"]): HreflangTag[] {
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

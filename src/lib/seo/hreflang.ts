import { siteConfig } from "@/lib/metadata";

export type Region = 'uk' | 'au' | 'us' | 'sg' | 'hk' | 'ca' | 'de' | 'ae' | 'in' | 'my' | 'ph';
export const REGIONS: Region[] = ['uk', 'au', 'us', 'sg', 'hk', 'ca', 'de', 'ae', 'in', 'my', 'ph'];

export interface RegionData {
  hreflang: string;
  locale: string;
  label: string;
  currency: string;
  demonym: string;
  flag: string;
}

export const REGIONS_MAP: Record<Region, RegionData> = {
  uk: { hreflang: 'en-GB', locale: 'en_GB', label: 'United Kingdom', currency: 'GBP', demonym: 'British', flag: 'gb' },
  au: { hreflang: 'en-AU', locale: 'en_AU', label: 'Australia', currency: 'AUD', demonym: 'Australian', flag: 'au' },
  us: { hreflang: 'en-US', locale: 'en_US', label: 'United States', currency: 'USD', demonym: 'American', flag: 'us' },
  sg: { hreflang: 'en-SG', locale: 'en_SG', label: 'Singapore', currency: 'SGD', demonym: 'Singaporean', flag: 'sg' },
  hk: { hreflang: 'en-HK', locale: 'en_HK', label: 'Hong Kong', currency: 'HKD', demonym: 'Hong Konger', flag: 'hk' },
  ca: { hreflang: 'en-CA', locale: 'en_CA', label: 'Canada', currency: 'CAD', demonym: 'Canadian', flag: 'ca' },
  de: { hreflang: 'de-DE', locale: 'de_DE', label: 'Germany', currency: 'EUR', demonym: 'German', flag: 'de' },
  ae: { hreflang: 'en-AE', locale: 'en_AE', label: 'United Arab Emirates', currency: 'AED', demonym: 'Emirati', flag: 'ae' },
  in: { hreflang: 'en-IN', locale: 'en_IN', label: 'India', currency: 'INR', demonym: 'Indian', flag: 'in' },
  my: { hreflang: 'en-MY', locale: 'en_MY', label: 'Malaysia', currency: 'MYR', demonym: 'Malaysian', flag: 'my' },
  ph: { hreflang: 'en-PH', locale: 'en_PH', label: 'Philippines', currency: 'PHP', demonym: 'Filipino', flag: 'ph' },
};

export function getHreflangTags(path: string) {
  const baseUrl = siteConfig.url;
  
  // Strip existing region prefix if any to get the base path
  let basePath = path;
  const prefixes = REGIONS.filter(r => r !== 'uk').map(r => `/${r}/`);
  const exacts = REGIONS.filter(r => r !== 'uk').map(r => `/${r}`);

  const activePrefix = prefixes.find(p => path.startsWith(p));
  const activeExact = exacts.find(e => path === e);

  if (activePrefix) {
    basePath = path.substring(3);
  } else if (activeExact) {
    basePath = '/';
  }

  // Ensure leading slash
  if (!basePath.startsWith('/')) basePath = '/' + basePath;

  const tags = Object.entries(REGIONS_MAP).map(([region, config]) => {
    const regionalPath = region === 'uk' ? basePath : `/${region}${basePath === '/' ? '' : basePath}`;
    return {
      rel: 'alternate',
      hreflang: config.hreflang,
      href: `${baseUrl}${regionalPath}`,
    };
  });

  // Add x-default (usually the UK version)
  tags.push({
    rel: 'alternate',
    hreflang: 'x-default',
    href: `${baseUrl}${basePath}`,
  });

  return tags;
}

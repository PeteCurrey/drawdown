import { siteConfig } from "@/lib/metadata";

export type Region = 'uk' | 'au' | 'us' | 'sg' | 'hk' | 'ca' | 'de' | 'ae' | 'in' | 'my' | 'ph';
export const REGIONS: Region[] = ['uk', 'au', 'us', 'sg', 'hk', 'ca', 'de', 'ae', 'in', 'my', 'ph'];

const REGION_CONFIG: Record<Region, { hreflang: string; locale: string }> = {
  uk: { hreflang: 'en-GB', locale: 'en_GB' },
  au: { hreflang: 'en-AU', locale: 'en_AU' },
  us: { hreflang: 'en-US', locale: 'en_US' },
  sg: { hreflang: 'en-SG', locale: 'en_SG' },
  hk: { hreflang: 'en-HK', locale: 'en_HK' },
  ca: { hreflang: 'en-CA', locale: 'en_CA' },
  de: { hreflang: 'de-DE', locale: 'de_DE' },
  ae: { hreflang: 'en-AE', locale: 'en_AE' },
  in: { hreflang: 'en-IN', locale: 'en_IN' },
  my: { hreflang: 'en-MY', locale: 'en_MY' },
  ph: { hreflang: 'en-PH', locale: 'en_PH' },
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
    basePath = path.substring(3); // This only works for 2-char regions.
    // Wait, all our regions are 2 chars except 'uk' which we don't prefix here.
    // Actually, 'uk' is the root.
  } else if (activeExact) {
    basePath = '/';
  }

  // Ensure leading slash
  if (!basePath.startsWith('/')) basePath = '/' + basePath;

  const tags = Object.entries(REGION_CONFIG).map(([region, config]) => {
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

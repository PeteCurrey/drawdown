import { siteConfig } from "@/lib/metadata";

export type Region = 'uk' | 'au' | 'us' | 'sg' | 'hk';
export const REGIONS: Region[] = ['uk', 'au', 'us', 'sg', 'hk'];

const REGION_CONFIG: Record<Region, { hreflang: string; locale: string }> = {
  uk: { hreflang: 'en-GB', locale: 'en_GB' },
  au: { hreflang: 'en-AU', locale: 'en_AU' },
  us: { hreflang: 'en-US', locale: 'en_US' },
  sg: { hreflang: 'en-SG', locale: 'en_SG' },
  hk: { hreflang: 'en-HK', locale: 'en_HK' },
};

export function getHreflangTags(path: string) {
  const baseUrl = siteConfig.url;
  
  // Strip existing region prefix if any to get the base path
  let basePath = path;
  if (path.startsWith('/au/') || path.startsWith('/us/') || path.startsWith('/sg/') || path.startsWith('/hk/')) {
    basePath = path.substring(3);
  } else if (path === '/au' || path === '/us' || path === '/sg' || path === '/hk') {
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

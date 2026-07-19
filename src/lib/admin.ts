import { LEARN_TOPICS } from "@/lib/data/learn-to-trade";
import { UK_LOCATIONS } from "@/lib/data/locations";
import { INSTRUMENT_SLUGS } from "@/lib/data/instruments";
import { brokers } from "@/data/brokers";
import { brokersAu } from "@/data/brokers-au";
import { brokersUs } from "@/data/brokers-us";
import { brokersSg, brokersHk } from "@/data/brokers-asia";
import { getAllPosts } from "@/lib/blog";

export interface SEOPageInfo {
  title: string;
  slug: string;
  category: string;
  type: 'static' | 'instrument' | 'location' | 'glossary' | 'howto' | 'blog' | 'ranking' | 'comparison' | 'broker' | 'tool';
  region?: string;
  isAffiliate?: boolean;
}

export async function getAllSEOPages(): Promise<SEOPageInfo[]> {
  const pages: SEOPageInfo[] = [];

  // Static Marketing Pages
  const staticPages = [
    { title: "Home", slug: "/", category: "Core", region: "Global" },
    { title: "About", slug: "/about", category: "Corporate", region: "Global" },
    { title: "Pricing", slug: "/pricing", category: "Sales", region: "Global" },
    { title: "Brokers Hub", slug: "/brokers", category: "Affiliate", region: "Global", isAffiliate: true },
    { title: "Markets Hub", slug: "/markets/pulse", category: "Markets", region: "Global" },
    { title: "Learning Hub", slug: "/learn-to-trade", category: "Education", region: "Global" },
  ];
  
  staticPages.forEach(p => pages.push({ ...p, type: 'static' }));

  // Tool Marketing Routes
  const toolRoutes = [
    { title: "AI Trade Journal", slug: "/tools/ai-trade-journal", category: "Tools", region: "Global" },
    { title: "Risk Calculator", slug: "/tools/risk-calculator", category: "Tools", region: "Global" },
    { title: "AI Market Scanner", slug: "/tools/ai-market-scanner", category: "Tools", region: "Global" },
    { title: "Strategy Backtester", slug: "/tools/strategy-backtester", category: "Tools", region: "Global" },
  ];
  toolRoutes.forEach(p => pages.push({ ...p, type: 'tool' }));

  // Global Education & Locations
  LEARN_TOPICS.forEach(topic => {
    pages.push({
      title: `Learn ${topic.title}`,
      slug: `/learn-to-trade/${topic.slug}`,
      category: "Education",
      type: 'static',
      region: "Global"
    });

    UK_LOCATIONS.forEach(loc => {
      pages.push({
        title: `${topic.title} in ${loc.name}`,
        slug: `/learn-to-trade/${topic.slug}/${loc.slug}`,
        category: "Localized",
        type: 'location',
        region: "UK"
      });
    });
  });

  // Global Instruments
  INSTRUMENT_SLUGS.forEach(slug => {
    pages.push({
      title: `${slug.toUpperCase()} Trading Guide`,
      slug: `/markets/${slug}`,
      category: "Markets",
      type: 'instrument',
      region: "Global"
    });
  });

  // Global Brokers
  brokers.forEach(broker => {
    pages.push({
      title: `${broker.name} Review`,
      slug: `/brokers/${broker.slug}`,
      category: "Brokers",
      type: 'broker',
      region: "Global",
      isAffiliate: true
    });
  });

  // Blog
  const posts = await getAllPosts();
  posts.forEach(post => {
    pages.push({
      title: post.title,
      slug: `/blog/${post.slug}`,
      category: "Insights",
      type: 'blog',
      region: "Global"
    });
  });

  // --- REGIONAL BRANCHES ---

  // Australia (AU)
  brokersAu.forEach(b => pages.push({ title: `${b.name} Review (AU)`, slug: `/au/brokers/${b.slug}`, category: "Brokers", type: 'broker', region: "AU", isAffiliate: true }));

  // United States (US)
  brokersUs.forEach(b => pages.push({ title: `${b.name} Review (US)`, slug: `/us/brokers/${b.slug}`, category: "Brokers", type: 'broker', region: "US", isAffiliate: true }));

  // Singapore (SG)
  brokersSg.forEach(b => pages.push({ title: `${b.name} Review (SG)`, slug: `/sg/brokers/${b.slug}`, category: "Brokers", type: 'broker', region: "SG", isAffiliate: true }));

  // Hong Kong (HK)
  brokersHk.forEach(b => pages.push({ title: `${b.name} Review (HK)`, slug: `/hk/brokers/${b.slug}`, category: "Brokers", type: 'broker', region: "HK", isAffiliate: true }));

  return pages;
}

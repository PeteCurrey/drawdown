import { LEARN_TOPICS } from "@/lib/data/learn-to-trade";
import { UK_LOCATIONS } from "@/lib/data/locations";
import { INSTRUMENT_SLUGS } from "@/lib/data/instruments";
import { GLOSSARY_TERMS } from "@/data/seo/glossary";
import { HOW_TO_PAGES_AU } from "@/data/seo/how-to-au";
import { BEST_OF_PAGES_AU } from "@/data/seo/best-au";
import { COMPARE_PAGES_AU } from "@/data/seo/compare-au";
import { AU_CITIES, AU_TOPICS, TOPIC_DISPLAY_AU } from "@/data/seo/locations-au";
import { HOW_TO_PAGES_US, BEST_OF_PAGES_US, COMPARE_PAGES_US, US_CITIES, US_TOPICS, TOPIC_DISPLAY_US } from "@/data/seo/us-data";
import { HOW_TO_PAGES_SG, BEST_OF_PAGES_SG, SG_CITIES, SG_TOPICS, TOPIC_DISPLAY_SG } from "@/data/seo/sg-data";
import { BEST_OF_PAGES_HK, HK_CITIES, HK_TOPICS, TOPIC_DISPLAY_HK } from "@/data/seo/hk-data";
import { HOW_TO_PAGES_CA, BEST_OF_PAGES_CA, COMPARE_PAGES_CA, CA_CITIES, CA_TOPICS, TOPIC_DISPLAY_CA } from "@/data/seo/ca-data";
import { HOW_TO_PAGES_DE, BEST_OF_PAGES_DE, COMPARE_PAGES_DE, DE_CITIES, DE_TOPICS, TOPIC_DISPLAY_DE } from "@/data/seo/de-data";
import { HOW_TO_PAGES } from "@/data/seo/howto";
import { BEST_OF_PAGES } from "@/data/seo/best";
import { COMPARISON_PAGES } from "@/data/seo/compare";
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

  // Global Glossary
  GLOSSARY_TERMS.forEach(term => {
    pages.push({
      title: `Glossary: ${term.term}`,
      slug: `/glossary/${term.slug}`,
      category: "Glossary",
      type: 'glossary',
      region: "Global"
    });
  });

  // Global How-To
  HOW_TO_PAGES.forEach(guide => {
    pages.push({
      title: `How To: ${guide.title}`,
      slug: `/how-to/${guide.slug}`,
      category: "Guides",
      type: 'howto',
      region: "Global"
    });
  });

  // Global Best-Of
  BEST_OF_PAGES.forEach(page => {
    pages.push({
      title: page.title,
      slug: `/best/${page.slug}`,
      category: "Rankings",
      type: 'ranking',
      region: "Global",
      isAffiliate: true
    });
  });

  // Global Comparisons
  COMPARISON_PAGES.forEach(page => {
    pages.push({
      title: page.title,
      slug: `/compare/${page.slug}`,
      category: "Comparisons",
      type: 'comparison',
      region: "Global",
      isAffiliate: true
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
  BEST_OF_PAGES_AU.forEach(p => pages.push({ title: p.title, slug: `/au/best/${p.slug}`, category: "Rankings", type: 'ranking', region: "AU", isAffiliate: true }));
  HOW_TO_PAGES_AU.forEach(p => pages.push({ title: p.title, slug: `/au/how-to/${p.slug}`, category: "Guides", type: 'howto', region: "AU" }));
  COMPARE_PAGES_AU.forEach(p => pages.push({ title: p.title, slug: `/au/compare/${p.slug}`, category: "Comparisons", type: 'comparison', region: "AU", isAffiliate: true }));
  AU_TOPICS.forEach(topic => AU_CITIES.forEach(city => pages.push({ title: `${TOPIC_DISPLAY_AU[topic]} in ${city}`, slug: `/au/learn-to-trade/${topic}/${city}`, category: "Localized", type: 'location', region: "AU" })));

  // United States (US)
  brokersUs.forEach(b => pages.push({ title: `${b.name} Review (US)`, slug: `/us/brokers/${b.slug}`, category: "Brokers", type: 'broker', region: "US", isAffiliate: true }));
  BEST_OF_PAGES_US.forEach(p => pages.push({ title: p.title, slug: `/us/best/${p.slug}`, category: "Rankings", type: 'ranking', region: "US", isAffiliate: true }));
  HOW_TO_PAGES_US.forEach(p => pages.push({ title: p.title, slug: `/us/how-to/${p.slug}`, category: "Guides", type: 'howto', region: "US" }));
  COMPARE_PAGES_US.forEach(p => pages.push({ title: p.title, slug: `/us/compare/${p.slug}`, category: "Comparisons", type: 'comparison', region: "US", isAffiliate: true }));
  US_TOPICS.forEach(topic => US_CITIES.forEach(city => pages.push({ title: `${TOPIC_DISPLAY_US[topic]} in ${city}`, slug: `/us/learn-to-trade/${topic}/${city}`, category: "Localized", type: 'location', region: "US" })));

  // Singapore (SG)
  brokersSg.forEach(b => pages.push({ title: `${b.name} Review (SG)`, slug: `/sg/brokers/${b.slug}`, category: "Brokers", type: 'broker', region: "SG", isAffiliate: true }));
  BEST_OF_PAGES_SG.forEach(p => pages.push({ title: p.title, slug: `/sg/best/${p.slug}`, category: "Rankings", type: 'ranking', region: "SG", isAffiliate: true }));
  HOW_TO_PAGES_SG.forEach(p => pages.push({ title: p.title, slug: `/sg/how-to/${p.slug}`, category: "Guides", type: 'howto', region: "SG" }));
  SG_TOPICS.forEach(topic => SG_CITIES.forEach(city => pages.push({ title: `${TOPIC_DISPLAY_SG[topic]} in ${city}`, slug: `/sg/learn-to-trade/${topic}/${city}`, category: "Localized", type: 'location', region: "SG" })));

  // Hong Kong (HK)
  brokersHk.forEach(b => pages.push({ title: `${b.name} Review (HK)`, slug: `/hk/brokers/${b.slug}`, category: "Brokers", type: 'broker', region: "HK", isAffiliate: true }));
  BEST_OF_PAGES_HK.forEach(p => pages.push({ title: p.title, slug: `/hk/best/${p.slug}`, category: "Rankings", type: 'ranking', region: "HK", isAffiliate: true }));
  HK_TOPICS.forEach(topic => HK_CITIES.forEach(city => pages.push({ title: `${TOPIC_DISPLAY_HK[topic]} in ${city}`, slug: `/hk/learn-to-trade/${topic}/${city}`, category: "Localized", type: 'location', region: "HK" })));

  // Canada (CA)
  BEST_OF_PAGES_CA.forEach(p => pages.push({ title: p.title, slug: `/ca/best/${p.slug}`, category: "Rankings", type: 'ranking', region: "CA", isAffiliate: true }));
  HOW_TO_PAGES_CA.forEach(p => pages.push({ title: p.title, slug: `/ca/how-to/${p.slug}`, category: "Guides", type: 'howto', region: "CA" }));
  COMPARE_PAGES_CA.forEach(p => pages.push({ title: p.title, slug: `/ca/compare/${p.slug}`, category: "Comparisons", type: 'comparison', region: "CA", isAffiliate: true }));
  CA_TOPICS.forEach(topic => CA_CITIES.forEach(city => pages.push({ title: `${TOPIC_DISPLAY_CA[topic]} in ${city}`, slug: `/ca/learn-to-trade/${topic}/${city}`, category: "Localized", type: 'location', region: "CA" })));

  // Germany (DE)
  BEST_OF_PAGES_DE.forEach(p => pages.push({ title: p.title, slug: `/de/best/${p.slug}`, category: "Rankings", type: 'ranking', region: "DE", isAffiliate: true }));
  HOW_TO_PAGES_DE.forEach(p => pages.push({ title: p.title, slug: `/de/how-to/${p.slug}`, category: "Guides", type: 'howto', region: "DE" }));
  COMPARE_PAGES_DE.forEach(p => pages.push({ title: p.title, slug: `/de/compare/${p.slug}`, category: "Comparisons", type: 'comparison', region: "DE", isAffiliate: true }));
  DE_TOPICS.forEach(topic => DE_CITIES.forEach(city => pages.push({ title: `${TOPIC_DISPLAY_DE[topic]} in ${city}`, slug: `/de/learn-to-trade/${topic}/${city}`, category: "Localized", type: 'location', region: "DE" })));

  return pages;
}

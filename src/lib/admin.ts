import { LEARN_TOPICS } from "@/lib/data/learn-to-trade";
import { UK_LOCATIONS } from "@/lib/data/locations";
import { INSTRUMENT_SLUGS } from "@/lib/data/instruments";
import { GLOSSARY_TERMS } from "@/data/seo/glossary";
import { HOW_TO_PAGES_AU } from "@/data/seo/how-to-au";
import { BEST_OF_PAGES_AU } from "@/data/seo/best-au";
import { COMPARE_PAGES_AU } from "@/data/seo/compare-au";
import { AU_CITIES, AU_TOPICS, TOPIC_DISPLAY_AU } from "@/data/seo/locations-au";
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
}

export function getAllSEOPages(): SEOPageInfo[] {
  const pages: SEOPageInfo[] = [];

  // Static Marketing Pages
  const staticPages = [
    { title: "Home", slug: "/", category: "Core" },
    { title: "About", slug: "/about", category: "Corporate" },
    { title: "Pricing", slug: "/pricing", category: "Sales" },
    { title: "Brokers Hub", slug: "/brokers", category: "Affiliate" },
    { title: "Markets Hub", slug: "/markets/pulse", category: "Markets" },
    { title: "Learning Hub", slug: "/learn-to-trade", category: "Education" },
  ];
  
  staticPages.forEach(p => pages.push({ ...p, type: 'static' }));

  // Tool Marketing Routes
  const toolRoutes = [
    { title: "AI Trade Journal", slug: "/tools/ai-trade-journal", category: "Tools" },
    { title: "Risk Calculator", slug: "/tools/risk-calculator", category: "Tools" },
    { title: "AI Market Scanner", slug: "/tools/ai-market-scanner", category: "Tools" },
    { title: "Strategy Backtester", slug: "/tools/strategy-backtester", category: "Tools" },
  ];
  toolRoutes.forEach(p => pages.push({ ...p, type: 'tool' }));

  // Topics
  LEARN_TOPICS.forEach(topic => {
    pages.push({
      title: `Learn ${topic.title}`,
      slug: `/learn-to-trade/${topic.slug}`,
      category: "Education",
      type: 'static'
    });

    // Locations (Batch 2)
    UK_LOCATIONS.forEach(loc => {
      pages.push({
        title: `${topic.title} in ${loc.name}`,
        slug: `/learn-to-trade/${topic.slug}/${loc.slug}`,
        category: "Localized",
        type: 'location'
      });
    });
  });

  // Instruments (Batch 3)
  INSTRUMENT_SLUGS.forEach(slug => {
    pages.push({
      title: `${slug.toUpperCase()} Trading Guide`,
      slug: `/markets/${slug}`,
      category: "Markets",
      type: 'instrument'
    });
  });

  // Glossary (Batch 4)
  GLOSSARY_TERMS.forEach(term => {
    pages.push({
      title: `Glossary: ${term.term}`,
      slug: `/glossary/${term.slug}`,
      category: "Glossary",
      type: 'glossary'
    });
  });

  // How-To (Batch 4)
  HOW_TO_PAGES.forEach(guide => {
    pages.push({
      title: `How To: ${guide.title}`,
      slug: `/how-to/${guide.slug}`,
      category: "Guides",
      type: 'howto'
    });
  });

  // Best-Of (Batch 4)
  BEST_OF_PAGES.forEach(page => {
    pages.push({
      title: page.title,
      slug: `/best/${page.slug}`,
      category: "Rankings",
      type: 'ranking'
    });
  });

  // Comparisons (Batch 4)
  COMPARISON_PAGES.forEach(page => {
    pages.push({
      title: page.title,
      slug: `/compare/${page.slug}`,
      category: "Comparisons",
      type: 'comparison'
    });
  });

  // Brokers (Batch 4)
  brokers.forEach(broker => {
    pages.push({
      title: `${broker.name} Review`,
      slug: `/brokers/${broker.slug}`,
      category: "Brokers",
      type: 'broker'
    });
  });

  // Blog (Batch 5)
  getAllPosts().forEach(post => {
    pages.push({
      title: post.title,
      slug: `/blog/${post.slug}`,
      category: "Insights",
      type: 'blog'
    });
  });

  // REGIONAL PAGES (Batch 7-9)
  const regions = ["au", "us", "sg", "hk"];

  // Regional Homes
  regions.forEach(reg => {
    pages.push({
      title: `${reg.toUpperCase()} Home`,
      slug: `/${reg}`,
      category: "Regional",
      type: 'static'
    });
    pages.push({
      title: `${reg.toUpperCase()} Pricing`,
      slug: `/${reg}/pricing`,
      category: "Regional",
      type: 'static'
    });
    pages.push({
      title: `${reg.toUpperCase()} Brokers Hub`,
      slug: `/${reg}/brokers`,
      category: "Regional",
      type: 'static'
    });
  });

  // Australia Specific (Batch 7)
  brokersAu.forEach(b => {
    pages.push({ title: `${b.name} Review (AU)`, slug: `/au/brokers/${b.slug}`, category: "Regional AU", type: 'broker' });
  });
  BEST_OF_PAGES_AU.forEach(p => {
    pages.push({ title: p.title, slug: `/au/best/${p.slug}`, category: "Regional AU", type: 'ranking' });
  });
  HOW_TO_PAGES_AU.forEach(p => {
    pages.push({ title: p.title, slug: `/au/how-to/${p.slug}`, category: "Regional AU", type: 'howto' });
  });
  COMPARE_PAGES_AU.forEach(p => {
    pages.push({ title: p.title, slug: `/au/compare/${p.slug}`, category: "Regional AU", type: 'comparison' });
  });
  AU_TOPICS.forEach(topic => {
    AU_CITIES.forEach(city => {
      pages.push({
        title: `${TOPIC_DISPLAY_AU[topic]} in ${city}`,
        slug: `/au/learn-to-trade/${topic}/${city}`,
        category: "Regional AU Localized",
        type: 'location'
      });
    });
  });

  // US Specific (Batch 8)
  brokersUs.forEach(b => {
    pages.push({ title: `${b.name} Review (US)`, slug: `/us/brokers/${b.slug}`, category: "Regional US", type: 'broker' });
  });

  // Asia Specific (Batch 9)
  brokersSg.forEach(b => {
    pages.push({ title: `${b.name} Review (SG)`, slug: `/sg/brokers/${b.slug}`, category: "Regional SG", type: 'broker' });
  });
  brokersHk.forEach(b => {
    pages.push({ title: `${b.name} Review (HK)`, slug: `/hk/brokers/${b.slug}`, category: "Regional HK", type: 'broker' });
  });

  return pages;
}

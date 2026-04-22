import { LEARN_TOPICS } from "@/lib/data/learn-to-trade";
import { UK_LOCATIONS } from "@/lib/data/locations";
import { INSTRUMENT_SLUGS } from "@/lib/data/instruments";
import { GLOSSARY_TERMS } from "@/data/seo/glossary";
import { HOW_TO_PAGES } from "@/data/seo/howto";
import { BEST_OF_PAGES } from "@/data/seo/best";
import { COMPARISON_PAGES } from "@/data/seo/compare";
import { brokers } from "@/data/brokers";
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

  return pages;
}

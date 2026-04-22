import { LEARN_TOPICS } from "@/lib/data/learn-to-trade";
import { UK_LOCATIONS } from "@/lib/data/locations";
import { INSTRUMENT_SLUGS } from "@/lib/data/instruments";
import { glossaryData, howToData } from "@/data/glossary";
import { getAllPosts } from "@/lib/blog";

export interface SEOPageInfo {
  title: string;
  slug: string;
  category: string;
  type: 'static' | 'instrument' | 'location' | 'glossary' | 'howto' | 'blog';
}

export function getAllSEOPages(): SEOPageInfo[] {
  const pages: SEOPageInfo[] = [];

  // Static Marketing Pages
  const staticPages = [
    { title: "Home", slug: "/", category: "Core" },
    { title: "About", slug: "/about", category: "Corporate" },
    { title: "Pricing", slug: "/pricing", category: "Sales" },
    { title: "Brokers", slug: "/brokers", category: "Affiliate" },
  ];
  
  staticPages.forEach(p => pages.push({ ...p, type: 'static' }));

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
        title: `Learn ${topic.title} in ${loc.name}`,
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
  glossaryData.forEach(term => {
    pages.push({
      title: `Glossary: ${term.title}`,
      slug: `/glossary/${term.slug}`,
      category: "Glossary",
      type: 'glossary'
    });
  });

  // How-To (Batch 4)
  howToData.forEach(guide => {
    pages.push({
      title: `How To: ${guide.title}`,
      slug: `/how-to/${guide.slug}`,
      category: "Guides",
      type: 'howto'
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

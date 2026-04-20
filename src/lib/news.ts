import { categoriseArticle } from "./news/categorise";

export interface NewsItem {
  title: string;
  url: string;
  source: string;
  publishedAt: string;
  excerpt: string;
  categories: string[];
  imageUrl?: string;
}

const RSS_FEEDS = [
  { name: "ForexLive", url: "https://www.forexlive.com/feed" },
  { name: "BBC Business", url: "https://feeds.bbci.co.uk/news/business/rss.xml" },
  { name: "CNBC Markets", url: "https://www.cnbc.com/id/10000664/device/rss/rss.html" },
  { name: "Reuters", url: "https://www.reutersagency.com/feed/?best-topics=business&post_type=best" },
  { name: "Investing.com", url: "https://www.investing.com/rss/news.rss" },
];

export async function fetchNews(): Promise<NewsItem[]> {
  const allNews: NewsItem[] = [];

  try {
    const results = await Promise.allSettled(
      RSS_FEEDS.map(async (feed) => {
        try {
          const response = await fetch(feed.url, { next: { revalidate: 900 } });
          if (!response.ok) return [];
          const xml = await response.text();
          
          const items: NewsItem[] = [];
          // More robust case-insensitive item matching
          const itemRegex = /<item>([\s\S]*?)<\/item>/gi;
          let match;
          
          let count = 0;
          while ((match = itemRegex.exec(xml)) !== null && count < 8) {
            const content = match[1];
            
            // Helper to extract tags with CDATA support
            const extract = (tag: string) => {
              const regex = new RegExp(`<${tag}[^>]*>(?:<!\\[CDATA\\[)?([\\s\\S]*?)(?:\\]\\]>)?<\\/${tag}>`, "i");
              return content.match(regex)?.[1] || "";
            };

            const title = extract("title").trim();
            const url = extract("link").trim();
            const publishedAt = extract("pubDate").trim();
            const rawExcerpt = extract("description") || extract("content:encoded") || "";
            const excerpt = rawExcerpt.replace(/<[^>]*>?/gm, '').trim().slice(0, 180).replace(/\s+/g, ' ') + "...";

            // Extract image from enclosure, media:content, or media:thumbnail
            const enclosureMatch = content.match(/<enclosure[^>]+url=["']([^"']+)["'][^>]*type=["']image/i);
            const mediaMatch = content.match(/<media:content[^>]+url=["']([^"']+)["']/i);
            const mediaThumbnail = content.match(/<media:thumbnail[^>]+url=["']([^"']+)["']/i);
            const imgInDesc = rawExcerpt.match(/<img[^>]+src=["']([^"']+)["']/i);
            const imageUrl = enclosureMatch?.[1] || mediaMatch?.[1] || mediaThumbnail?.[1] || imgInDesc?.[1] || undefined;

            if (title && url) {
              items.push({
                title,
                url,
                source: feed.name,
                publishedAt,
                excerpt,
                categories: categoriseArticle(title, excerpt),
                imageUrl,
              });
              count++;
            }
          }
          return items;
        } catch (err) {
          console.error(`Error fetching ${feed.name}:`, err);
          return [];
        }
      })
    );

    results.forEach((result) => {
      if (result.status === "fulfilled") {
        allNews.push(...result.value);
      }
    });

    return allNews.sort((a, b) => 
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );
  } catch (error) {
    console.error("News aggregation overall failure:", error);
    return [];
  }
}

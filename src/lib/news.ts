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
  { name: "Sky News Business", url: "https://feeds.skynews.com/feeds/rss/business.xml" },
  { name: "BBC Business", url: "https://feeds.bbci.co.uk/news/business/rss.xml" },
  { name: "WSJ Markets", url: "https://feeds.a.dj.com/rss/RSSMarketsMain.xml" },
  { name: "CNBC Markets", url: "https://www.cnbc.com/id/10000664/device/rss/rss.html" },
  { name: "Reuters", url: "https://www.reutersagency.com/feed/?best-topics=business&post_type=best" },
  { name: "MarketWatch", url: "http://feeds.marketwatch.com/marketwatch/topstories" },
  { name: "Investing.com", url: "https://www.investing.com/rss/news.rss" },
  { name: "Yahoo Finance", url: "https://finance.yahoo.com/news/rssindex" },
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
          const itemRegex = /<item>([\s\S]*?)<\/item>/gi;
          let match;
          
          // Limit individual source fetch per update to ensure diversity
          const SOURCE_CAP = 6;
          let count = 0;
          while ((match = itemRegex.exec(xml)) !== null && count < SOURCE_CAP) {
            const content = match[1];
            
            const extract = (tag: string) => {
              const regex = new RegExp(`<${tag}[^>]*>(?:<!\\[CDATA\\[)?([\\s\\S]*?)(?:\\]\\]>)?<\\/${tag}>`, "i");
              return content.match(regex)?.[1] || "";
            };

            const title = extract("title").trim();
            const url = extract("link").trim();
            const publishedAt = extract("pubDate").trim();
            const rawExcerpt = extract("description") || extract("content:encoded") || "";
            const excerpt = rawExcerpt.replace(/<[^>]*>?/gm, '').trim().slice(0, 180).replace(/\s+/g, ' ') + "...";

            // Enhanced image extraction reaching deeper for diverse formats
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

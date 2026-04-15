import { categoriseArticle } from "./news/categorise";

export interface NewsItem {
  title: string;
  url: string;
  source: string;
  publishedAt: string;
  excerpt: string;
  categories: string[];
}

const RSS_FEEDS = [
  { name: "ForexLive", url: "https://www.forexlive.com/feed" },
  { name: "BBC Business", url: "https://feeds.bbci.co.uk/news/business/rss.xml" },
  { name: "CNBC Markets", url: "https://www.cnbc.com/id/10000664/device/rss/rss.html" },
];

export async function fetchNews(): Promise<NewsItem[]> {
  const allNews: NewsItem[] = [];

  try {
    const results = await Promise.allSettled(
      RSS_FEEDS.map(async (feed) => {
        const response = await fetch(feed.url);
        const xml = await response.text();
        
        // Simple Regex Parser for RSS Items
        const items: NewsItem[] = [];
        const itemRegex = /<item>([\s\S]*?)<\/item>/g;
        let match;
        
        let count = 0;
        while ((match = itemRegex.exec(xml)) !== null && count < 6) {
          const content = match[1];
          
          const title = content.match(/<title>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/title>/)?.[1] || "";
          const url = content.match(/<link>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/link>/)?.[1] || "";
          const publishedAt = content.match(/<pubDate>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/pubDate>/)?.[1] || "";
          const rawExcerpt = content.match(/<description>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/description>/)?.[1] || "";
          const excerpt = rawExcerpt.replace(/<[^>]*>?/gm, '').trim().slice(0, 160) + "...";

          if (title && url) {
            items.push({
              title: title.trim(),
              url: url.trim(),
              source: feed.name,
              publishedAt: publishedAt.trim(),
              excerpt,
              categories: categoriseArticle(title, excerpt),
            });
            count++;
          }
        }
        return items;
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
    console.error("News aggregation error:", error);
    return [];
  }
}

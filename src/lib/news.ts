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
  { name: "Sky News", url: "https://feeds.skynews.com/feeds/rss/world.xml" },
  { name: "BBC", url: "https://feeds.bbci.co.uk/news/world/rss.xml" },
  { name: "WSJ Markets", url: "https://feeds.a.dj.com/rss/RSSMarketsMain.xml" },
  { name: "CNBC Markets", url: "https://www.cnbc.com/id/10000664/device/rss/rss.html" },
  { name: "Reuters", url: "https://www.reutersagency.com/feed/?best-topics=business&post_type=best" },
  { name: "MarketWatch", url: "http://feeds.marketwatch.com/marketwatch/topstories" },
  { name: "Investing.com", url: "https://www.investing.com/rss/news.rss" },
  { name: "Yahoo Finance", url: "https://finance.yahoo.com/news/rssindex" },
  { name: "CNN", url: "https://news.google.com/rss/search?q=site:cnn.com&hl=en-US&gl=US&ceid=US:en" },
  { name: "Fox News", url: "http://feeds.foxnews.com/foxnews/world" },
  { name: "Bloomberg", url: "https://www.bloomberg.com/politics/feeds/site.xml" }, // Bloomberg RSS varies, using a stable one
  { name: "Forbes", url: "https://www.forbes.com/business/feed/" },
  { name: "ForexLive", url: "https://www.forexlive.com/Feed" },
  { name: "CoinDesk", url: "https://www.coindesk.com/arc/outboundfeeds/rss/" },
  { name: "Financial Times", url: "https://www.ft.com/?format=rss" }
];

/**
 * Sources that produce exclusively market-relevant content.
 * Articles from these sources pass through regardless of category.
 * All other sources are general-interest: only articles with at least one
 * specific trading category (not just the world-economy catch-all) are kept.
 */
const MARKET_SPECIFIC_SOURCES = new Set([
  "WSJ Markets",
  "CNBC Markets",
  "MarketWatch",
  "Investing.com",
  "ForexLive",
  "CoinDesk",
  "Financial Times",
]);

/** Categories that represent genuine trading-relevant content. */
const TRADING_CATEGORIES = new Set([
  "uk-markets",
  "us-markets",
  "forex",
  "crypto",
  "commodities",
]);

function decodeHtmlEntities(str: string): string {
  return str
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&#39;/g, "'");
}

async function getArticleUrl(googleRssUrl: string): Promise<string | null> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), 3000);
  try {
    const res = await fetch(googleRssUrl, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });
    clearTimeout(id);
    if (!res.ok) return null;
    const html = await res.text();
    const match = html.match(/<c-wiz[^>]+data-p=["']([^"']+)["']/i);
    if (!match) return null;
    const data = decodeHtmlEntities(match[1]);
    const obj = JSON.parse(data.replace('%.@.', '["garturlreq",'));
    const payload = new URLSearchParams();
    payload.append('f.req', JSON.stringify([[["Fbv4je", JSON.stringify([...obj.slice(0, -6), ...obj.slice(-2)]), 'null', 'generic']]]));
    
    const postController = new AbortController();
    const postId = setTimeout(() => postController.abort(), 3000);
    const postResponse = await fetch('https://news.google.com/_/DotsSplashUi/data/batchexecute', {
      method: 'POST',
      body: payload,
      signal: postController.signal,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });
    clearTimeout(postId);
    if (!postResponse.ok) return null;
    const postText = await postResponse.text();
    const cleanText = postText.replace(")]}'", "");
    const parsed = JSON.parse(cleanText);
    const arrayString = parsed[0][2];
    return JSON.parse(arrayString)[1];
  } catch (err) {
    console.error("Error decoding CNN URL:", err);
    return null;
  }
}

async function fetchOgImage(url: string): Promise<string | undefined> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), 3000);
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });
    clearTimeout(id);
    if (!res.ok) return undefined;
    const html = await res.text();
    const ogImageRegex = /<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i;
    const ogImageRegexAlt = /<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i;
    const match = html.match(ogImageRegex) || html.match(ogImageRegexAlt);
    return match ? match[1] : undefined;
  } catch (err) {
    console.error("Error fetching og:image:", err);
    return undefined;
  }
}

async function resolveCNNItem(googleRssUrl: string): Promise<{ url: string; imageUrl?: string }> {
  const realUrl = await getArticleUrl(googleRssUrl);
  if (!realUrl) return { url: googleRssUrl };
  const imageUrl = await fetchOgImage(realUrl);
  return { url: realUrl, imageUrl };
}

export async function fetchNews(): Promise<NewsItem[]> {
  const allNews: NewsItem[] = [];

  try {
    const results = await Promise.allSettled(
      RSS_FEEDS.map(async (feed) => {
        try {
          const response = await fetch(feed.url, { next: { revalidate: 900 } });
          if (!response.ok) return [];
          const xml = await response.text();
          
          const itemRegex = /<item>([\s\S]*?)<\/item>/gi;
          let match;
          
          // Limit individual source fetch per update to ensure diversity
          const SOURCE_CAP = 6;
          let count = 0;
          const tempItems: {
            title: string;
            url: string;
            publishedAt: string;
            rawExcerpt: string;
            enclosureMatch: RegExpMatchArray | null;
            mediaMatch: RegExpMatchArray | null;
            mediaThumbnail: RegExpMatchArray | null;
            imgInDesc: RegExpMatchArray | null;
          }[] = [];

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
            
            if (title && url) {
              const enclosureMatch = content.match(/<enclosure[^>]+url=["']([^"']+)["'][^>]*type=["']image/i);
              const mediaMatch = content.match(/<media:content[^>]+url=["']([^"']+)["']/i);
              const mediaThumbnail = content.match(/<media:thumbnail[^>]+url=["']([^"']+)["']/i);
              const imgInDesc = rawExcerpt.match(/<img[^>]+src=["']([^"']+)["']/i);

              tempItems.push({
                title,
                url,
                publishedAt,
                rawExcerpt,
                enclosureMatch,
                mediaMatch,
                mediaThumbnail,
                imgInDesc,
              });
              count++;
            }
          }

          // Process and resolve items concurrently
          const processedItems = await Promise.all(
            tempItems.map(async (item) => {
              const excerpt = item.rawExcerpt.replace(/<[^>]*>?/gm, '').trim().slice(0, 180).replace(/\s+/g, ' ') + "...";
              let imageUrl = item.enclosureMatch?.[1] || item.mediaMatch?.[1] || item.mediaThumbnail?.[1] || item.imgInDesc?.[1] || undefined;
              let finalUrl = item.url;
              let finalTitle = item.title;

              if (feed.name === "CNN") {
                finalTitle = item.title.replace(/\s*-\s*CNN\s*$/i, '');
                const resolved = await resolveCNNItem(item.url);
                finalUrl = resolved.url;
                if (resolved.imageUrl) {
                  imageUrl = resolved.imageUrl;
                }
              } else if (feed.name === "BBC" && imageUrl) {
                // Upscale BBC thumbnail to high-res
                imageUrl = imageUrl.replace(/\/240\//, '/800/');
              }

              return {
                title: finalTitle,
                url: finalUrl,
                source: feed.name,
                publishedAt: item.publishedAt,
                excerpt,
                categories: categoriseArticle(finalTitle, excerpt),
                imageUrl,
              };
            })
          );

          return processedItems;
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

    // ── Relevance filter ───────────────────────────────────────────────────
    // Market-specific sources: keep everything (ForexLive, WSJ Markets, etc.).
    // General-interest sources: only keep articles with at least one specific
    // trading category. Articles that fall through to the 'world-economy'
    // catch-all (i.e. no specific keywords matched) from Fox News, Sky News,
    // BBC World, CNN, etc. are the source of lifestyle/wellness content — exclude.
    const relevantNews = allNews.filter(item =>
      MARKET_SPECIFIC_SOURCES.has(item.source) ||
      item.categories.some(cat => TRADING_CATEGORIES.has(cat))
    );

    return relevantNews.sort((a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );
  } catch (error) {
    console.error("News aggregation overall failure:", error);
    return [];
  }
}

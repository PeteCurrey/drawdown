import { getLobbyArticles, categoryToSlug } from "@/lib/lobby";
import { siteConfig } from "@/lib/metadata";

export const dynamic = "force-dynamic";

export async function GET() {
  const articles = await getLobbyArticles({ limit: 50 });
  const baseUrl = siteConfig.url;

  const rss = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">
<channel>
  <title>Drawdown | The Lobby</title>
  <link>${baseUrl}/lobby</link>
  <description>What's happening in markets, trading and the businesses built around them. Broadsheet market intelligence and trading industry surveillance.</description>
  <language>en-gb</language>
  <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
  <atom:link href="${baseUrl}/lobby/rss.xml" rel="self" type="application/rss+xml" />
  ${articles
    .map((article) => {
      const categorySlug = categoryToSlug(article.category);
      const articleUrl = `${baseUrl}/lobby/${categorySlug}/${article.slug}`;
      const pubDate = article.published_at 
        ? new Date(article.published_at).toUTCString() 
        : new Date(article.created_at).toUTCString();

      return `
    <item>
      <title><![CDATA[${article.title}]]></title>
      <link>${articleUrl}</link>
      <guid isPermaLink="true">${articleUrl}</guid>
      <pubDate>${pubDate}</pubDate>
      <description><![CDATA[${article.excerpt}]]></description>
      <content:encoded><![CDATA[<p>${article.excerpt}</p><div>${article.body.replace(/\n\n/g, '<br/><br/>')}</div>]]></content:encoded>
      ${article.hero_image_url ? `<enclosure url="${article.hero_image_url}" length="0" type="image/jpeg" />` : ''}
      <category><![CDATA[${article.category}]]></category>
      <author>${article.author_name}</author>
    </item>`;
    })
    .join("")}
</channel>
</rss>`;

  return new Response(rss, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "s-maxage=1800, stale-while-revalidate=3600",
    },
  });
}

import { getAllPosts } from "@/lib/blog";
import { siteConfig } from "@/lib/metadata";

export async function GET() {
  const posts = await getAllPosts();
  const baseUrl = siteConfig.url;

  const rss = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">
<channel>
  <title>Drawdown | Market Insights</title>
  <link>${baseUrl}/blog</link>
  <description>Professional market analysis, trading education, and honest commentary from the Drawdown team.</description>
  <language>en-gb</language>
  <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
  <atom:link href="${baseUrl}/blog/rss.xml" rel="self" type="application/rss+xml" />
  ${posts
    .map((post) => `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>${baseUrl}/blog/${post.slug}</link>
      <guid>${baseUrl}/blog/${post.slug}</guid>
      <pubDate>${new Date(post.publishedAt).toUTCString()}</pubDate>
      <description><![CDATA[${post.excerpt}]]></description>
      <content:encoded><![CDATA[<p>${post.excerpt}</p>]]></content:encoded>
      <enclosure url="${post.image}" length="0" type="image/jpeg" />
      <category>${post.category}</category>
    </item>`)
    .join("")}
</channel>
</rss>`;

  return new Response(rss, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "s-maxage=3600, stale-while-revalidate",
    },
  });
}

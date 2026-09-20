/**
 * Drawdown Intelligence Data Platform — Universal RSS 2.0 & Atom 1.0 XML Parser
 *
 * Fast, resilient, zero-dependency feed parser:
 *  - Handles RSS 2.0 (<rss><channel><item>) and Atom 1.0 (<feed><entry>)
 *  - Strips/decodes CDATA sections and XML/HTML entities
 *  - Extracts namespaces: dc:creator, content:encoded, media:content
 *  - Normalizes timestamps to ISO-8601 strings
 *  - Extracts canonical URLs and GUIDs
 */

export interface ParsedFeedItem {
  id: string;
  title: string;
  link: string;
  description: string;
  contentSnippet?: string;
  pubDate: string; // ISO 8601
  updatedDate?: string; // ISO 8601
  author?: string;
  categories: string[];
  enclosureUrl?: string;
}

export interface ParsedFeed {
  title: string;
  link: string;
  description?: string;
  updated?: string;
  items: ParsedFeedItem[];
}

function decodeXmlEntities(str: string): string {
  if (!str) return "";
  return str
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&#x2F;/g, "/")
    .replace(/&#(\d+);/g, (_, dec) => String.fromCharCode(parseInt(dec, 10)))
    .replace(/&#x([0-9a-fA-F]+);/g, (_, hex) => String.fromCharCode(parseInt(hex, 16)));
}

function extractCDataOrText(raw: string): string {
  if (!raw) return "";
  const cdataMatch = raw.match(/<!\[CDATA\[([\s\S]*?)\]\]>/i);
  if (cdataMatch) {
    return cdataMatch[1].trim();
  }
  return decodeXmlEntities(raw.replace(/<[^>]+>/g, "").trim());
}

function extractTagValue(block: string, tagName: string): string | null {
  // Support both <tag>value</tag> and <tag attr="...">value</tag>
  const regex = new RegExp(`<${tagName}(?:\\s+[^>]*)?>([\\s\\S]*?)<\\/${tagName}>`, "i");
  const match = block.match(regex);
  return match ? extractCDataOrText(match[1]) : null;
}

function extractAttribute(block: string, tagName: string, attrName: string): string | null {
  const regex = new RegExp(`<${tagName}\\s+[^>]*?${attrName}=["']([^"']+)["'][^>]*>`, "i");
  const match = block.match(regex);
  return match ? decodeXmlEntities(match[1].trim()) : null;
}

export class UniversalFeedParser {
  /**
   * Parses raw XML string into a structured ParsedFeed.
   */
  static parse(xml: string): ParsedFeed {
    const isAtom = /<feed[\s>]/i.test(xml);

    if (isAtom) {
      return this.parseAtom(xml);
    }
    return this.parseRss(xml);
  }

  private static parseRss(xml: string): ParsedFeed {
    const feedTitle = extractTagValue(xml, "title") || "Untitled Feed";
    const feedLink = extractTagValue(xml, "link") || "";
    const feedDesc = extractTagValue(xml, "description") || undefined;

    const items: ParsedFeedItem[] = [];
    const itemRegex = /<item(?:\s+[^>]*)?>([\s\S]*?)<\/item>/gi;
    let match: RegExpExecArray | null;

    while ((match = itemRegex.exec(xml)) !== null) {
      const itemBlock = match[1];
      const title = extractTagValue(itemBlock, "title") || "Untitled";
      let link = extractTagValue(itemBlock, "link") || "";
      if (!link) {
        link = extractAttribute(itemBlock, "link", "href") || "";
      }

      const guid = extractTagValue(itemBlock, "guid") || link || crypto.randomUUID();
      const rawDate =
        extractTagValue(itemBlock, "pubDate") ||
        extractTagValue(itemBlock, "dc:date") ||
        new Date().toISOString();

      let pubDateIso = new Date().toISOString();
      const parsedDate = new Date(rawDate);
      if (!isNaN(parsedDate.getTime())) {
        pubDateIso = parsedDate.toISOString();
      }

      const description =
        extractTagValue(itemBlock, "description") ||
        extractTagValue(itemBlock, "content:encoded") ||
        "";

      const author =
        extractTagValue(itemBlock, "author") ||
        extractTagValue(itemBlock, "dc:creator") ||
        undefined;

      const enclosureUrl = extractAttribute(itemBlock, "enclosure", "url") || undefined;

      const categories: string[] = [];
      const catRegex = /<category(?:\s+[^>]*)?>([\s\S]*?)<\/category>/gi;
      let catMatch: RegExpExecArray | null;
      while ((catMatch = catRegex.exec(itemBlock)) !== null) {
        const cat = extractCDataOrText(catMatch[1]);
        if (cat && !categories.includes(cat)) categories.push(cat);
      }

      items.push({
        id: guid,
        title,
        link,
        description,
        pubDate: pubDateIso,
        author,
        categories,
        enclosureUrl,
      });
    }

    return {
      title: feedTitle,
      link: feedLink,
      description: feedDesc,
      items,
    };
  }

  private static parseAtom(xml: string): ParsedFeed {
    const feedTitle = extractTagValue(xml, "title") || "Untitled Atom Feed";
    const feedLink = extractAttribute(xml, "link", "href") || extractTagValue(xml, "link") || "";
    const feedUpdated = extractTagValue(xml, "updated") || undefined;

    const items: ParsedFeedItem[] = [];
    const entryRegex = /<entry(?:\s+[^>]*)?>([\s\S]*?)<\/entry>/gi;
    let match: RegExpExecArray | null;

    while ((match = entryRegex.exec(xml)) !== null) {
      const entryBlock = match[1];
      const title = extractTagValue(entryBlock, "title") || "Untitled";

      // Atom link is typically <link href="..." rel="alternate"/>
      let link = extractAttribute(entryBlock, "link", "href") || "";
      if (!link) {
        link = extractTagValue(entryBlock, "link") || "";
      }

      const id = extractTagValue(entryBlock, "id") || link || crypto.randomUUID();
      const rawPublished =
        extractTagValue(entryBlock, "published") ||
        extractTagValue(entryBlock, "updated") ||
        new Date().toISOString();

      let pubDateIso = new Date().toISOString();
      const parsedDate = new Date(rawPublished);
      if (!isNaN(parsedDate.getTime())) {
        pubDateIso = parsedDate.toISOString();
      }

      const rawUpdated = extractTagValue(entryBlock, "updated");
      let updatedDateIso: string | undefined = undefined;
      if (rawUpdated) {
        const u = new Date(rawUpdated);
        if (!isNaN(u.getTime())) updatedDateIso = u.toISOString();
      }

      const summary =
        extractTagValue(entryBlock, "summary") ||
        extractTagValue(entryBlock, "content") ||
        "";

      const author = extractTagValue(entryBlock, "name") || undefined;

      const categories: string[] = [];
      const catRegex = /<category\s+[^>]*?term=["']([^"']+)["'][^>]*>/gi;
      let catMatch: RegExpExecArray | null;
      while ((catMatch = catRegex.exec(entryBlock)) !== null) {
        const cat = decodeXmlEntities(catMatch[1]);
        if (cat && !categories.includes(cat)) categories.push(cat);
      }

      items.push({
        id,
        title,
        link,
        description: summary,
        pubDate: pubDateIso,
        updatedDate: updatedDateIso,
        author,
        categories,
      });
    }

    return {
      title: feedTitle,
      link: feedLink,
      updated: feedUpdated,
      items,
    };
  }
}

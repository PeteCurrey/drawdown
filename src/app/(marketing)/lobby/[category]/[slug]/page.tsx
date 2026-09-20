import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { getMetadata, siteConfig } from "@/lib/metadata";
import { StructuredData, defaultOrgSchema } from "@/components/StructuredData";
import { LobbyNav } from "@/components/lobby/LobbyNav";
import { LobbyImage } from "@/components/lobby/LobbyImage";
import { LobbySourceAttribution } from "@/components/lobby/LobbySourceAttribution";
import { LobbyInternalLinks } from "@/components/lobby/LobbyInternalLinks";
import { 
  getLobbyArticleBySlug, 
  getLobbyArticles,
  categoryToSlug, 
  slugToCategory 
} from "@/lib/lobby";
import { Clock, ShieldCheck, ChevronRight, ArrowLeft } from "lucide-react";

interface ArticlePageProps {
  params: Promise<{
    category: string;
    slug: string;
  }>;
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { category: categorySlug, slug } = await params;
  const article = await getLobbyArticleBySlug(categorySlug, slug);

  if (!article) {
    return { title: "Article Not Found | The Lobby" };
  }

  const category = slugToCategory(categorySlug) || article.category;
  const metaTitle = article.meta_title || `${article.title} | The Lobby`;
  const metaDesc = article.meta_description || article.excerpt;
  const canonicalUrl = article.canonical_url || `${siteConfig.url}/lobby/${categorySlug}/${article.slug}`;

  return {
    ...getMetadata({
      title: metaTitle,
      description: metaDesc,
      image: article.hero_image_url || siteConfig.ogImage,
      path: `/lobby/${categorySlug}/${article.slug}`,
    }),
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      type: "article",
      title: metaTitle,
      description: metaDesc,
      url: canonicalUrl,
      publishedTime: article.published_at || undefined,
      modifiedTime: article.updated_at || undefined,
      authors: [article.author_name],
      section: category,
      tags: article.tags,
      images: [
        {
          url: article.hero_image_url?.startsWith("http") 
            ? article.hero_image_url 
            : `${siteConfig.url}${siteConfig.ogImage}`,
          width: 1200,
          height: 630,
          alt: article.hero_image_alt || article.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: metaTitle,
      description: metaDesc,
      images: [article.hero_image_url?.startsWith("http") ? article.hero_image_url : `${siteConfig.url}${siteConfig.ogImage}`],
    },
  };
}

export default async function LobbyArticlePage({ params }: ArticlePageProps) {
  const { category: categorySlug, slug } = await params;
  const article = await getLobbyArticleBySlug(categorySlug, slug);

  if (!article) {
    notFound();
  }

  // Related stories in same category
  const relatedArticles = await getLobbyArticles({
    category: article.category,
    limit: 3,
  }).then(list => list.filter(a => a.id !== article.id));

  const canonicalUrl = article.canonical_url || `${siteConfig.url}/lobby/${categorySlug}/${article.slug}`;
  const formattedDate = article.published_at
    ? new Date(article.published_at).toLocaleDateString("en-GB", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric"
      })
    : "Recently Published";

  const updatedDate = article.updated_at
    ? new Date(article.updated_at).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric"
      })
    : null;

  // JSON-LD Structured Data for Article or NewsArticle
  const schemaType = article.schema_type === "NewsArticle" ? "NewsArticle" : "Article";
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": schemaType,
    headline: article.title,
    description: article.excerpt,
    image: article.hero_image_url || `${siteConfig.url}/images/og-default.png`,
    datePublished: article.published_at || article.created_at,
    dateModified: article.updated_at || article.created_at,
    author: {
      "@type": "Person",
      name: article.author_name,
    },
    publisher: defaultOrgSchema,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": canonicalUrl,
    },
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Drawdown",
        item: siteConfig.url,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "The Lobby",
        item: `${siteConfig.url}/lobby`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: article.category,
        item: `${siteConfig.url}/lobby/${categorySlug}`,
      },
      {
        "@type": "ListItem",
        position: 4,
        name: article.title,
        item: canonicalUrl,
      },
    ],
  };

  return (
    <div className="w-full bg-[#FFFFFF] min-h-screen text-[#0B0E12] font-sans selection:bg-[#16213E] selection:text-[#FFFFFF]">
      <LobbyNav />

      {/* JSON-LD Schemas */}
      <StructuredData type={schemaType as any} data={articleSchema} />
      <StructuredData type="BreadcrumbList" data={breadcrumbSchema} />

      <article className="max-w-[1080px] mx-auto px-4 sm:px-6 py-8 md:py-12">
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumbs" className="flex items-center gap-2 text-[11px] font-mono uppercase tracking-wider text-[#4B5157] mb-6">
          <Link href="/lobby" className="hover:text-[#16213E] transition-colors">
            THE LOBBY
          </Link>
          <ChevronRight className="w-3 h-3 text-[#DEDDD8]" />
          <Link href={`/lobby/${categorySlug}`} className="hover:text-[#16213E] font-semibold transition-colors">
            {article.category}
          </Link>
          <ChevronRight className="w-3 h-3 text-[#DEDDD8]" />
          <span className="truncate max-w-[240px] text-[#0B0E12]">{article.title}</span>
        </nav>

        {/* Category, Type & Confidence Indicator */}
        <div className="flex flex-wrap items-center gap-3 mb-4 text-[11px] font-mono uppercase tracking-[0.14em]">
          <span className="text-[#16213E] font-bold">
            {article.category} // {article.article_type}
          </span>
          <span className="text-[#DEDDD8]">•</span>
          <span className="inline-flex items-center gap-1 text-[#4B5157]">
            <Clock className="w-3 h-3" />
            {article.reading_time_minutes} MIN READ
          </span>
          {article.confidence === "VERIFIED" && (
            <>
              <span className="text-[#DEDDD8]">•</span>
              <span className="inline-flex items-center gap-1 text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-[2px] border border-emerald-200">
                <ShieldCheck className="w-3 h-3" />
                VERIFIED EVIDENCE
              </span>
            </>
          )}
        </div>

        {/* Main Editorial Headline */}
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-display font-black tracking-[-0.035em] text-[#0B0E12] leading-[1.08] mb-6">
          {article.title}
        </h1>

        {/* Substantive Deck / Excerpt */}
        <p className="text-lg sm:text-xl text-[#4B5157] font-sans leading-relaxed border-l-2 border-[#16213E] pl-4 sm:pl-6 my-6">
          {article.excerpt}
        </p>

        {/* Author Byline & Dateline */}
        <div className="py-4 border-t border-b border-[#DEDDD8] flex flex-wrap items-center justify-between gap-4 text-xs font-mono text-[#4B5157] my-8">
          <div>
            <span className="uppercase tracking-wider text-[#0B0E12] font-semibold">
              REPORTED BY {article.author_name}
            </span>
            {article.author_role && (
              <span className="text-[#4B5157]/80 ml-1.5 hidden sm:inline">
                • {article.author_role}
              </span>
            )}
          </div>
          <div className="flex items-center gap-3">
            <time dateTime={article.published_at || ""}>
              Published {formattedDate}
            </time>
            {updatedDate && (
              <>
                <span className="text-[#DEDDD8]">•</span>
                <span>Updated {updatedDate}</span>
              </>
            )}
          </div>
        </div>

        {/* Hero Visual Container with Crop & Credit (or Typographic fallback) */}
        <div className="my-8">
          <LobbyImage
            src={article.hero_image_url}
            alt={article.hero_image_alt || article.title}
            category={article.category}
            headline={article.title}
            aspectRatio="16/9"
            caption={article.hero_image_caption}
            credit={article.hero_image_credit || article.primary_source_name}
            priority={true}
          />
        </div>

        {/* Article Body (Formatted for high readability) */}
        <div className="max-w-[760px] mx-auto py-6">
          <div className="prose prose-neutral max-w-none text-[#0B0E12] font-sans text-base sm:text-lg leading-[1.8] space-y-6">
            {article.body.split('\n\n').map((paragraph, idx) => (
              <p key={idx} className="leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>

          {/* Transparent Source Attribution Layer */}
          <LobbySourceAttribution
            sources={article.sources}
            primarySourceName={article.primary_source_name}
            primarySourceUrl={article.primary_source_url}
          />

          {/* Contextual Drawdown Tool & Entity Discovery */}
          <LobbyInternalLinks
            toolSlugs={article.related_tool_slugs}
            brokerSlugs={article.related_broker_slugs}
            propFirmSlugs={article.related_prop_firm_slugs}
            platformSlugs={article.related_platform_slugs}
            relatedMarkets={article.related_markets}
          />

          {/* Tags */}
          {article.tags && article.tags.length > 0 && (
            <div className="pt-6 border-t border-[#DEDDD8] flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#4B5157]">
                TAGGED:
              </span>
              {article.tags.map(tag => (
                <span key={tag} className="px-2 py-0.5 text-xs font-mono bg-[#FAF9F5] border border-[#DEDDD8] text-[#0B0E12] rounded-[2px]">
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Related Stories in this Category */}
        {relatedArticles.length > 0 && (
          <section className="mt-16 pt-12 border-t-2 border-[#0B0E12]">
            <h3 className="text-xs font-mono font-bold uppercase tracking-[0.16em] text-[#0B0E12] mb-6">
              RELATED {article.category} STORIES
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedArticles.map((rel) => (
                <article key={rel.id} className="border border-[#DEDDD8] p-5 rounded-[2px] bg-[#FFFFFF] group hover:border-[#16213E] transition-colors flex flex-col justify-between">
                  <div>
                    <span className="text-[9px] font-mono uppercase tracking-wider text-[#16213E] font-semibold block mb-1">
                      {rel.category}
                    </span>
                    <h4 className="text-base font-display font-bold text-[#0B0E12] leading-snug group-hover:text-[#16213E] transition-colors">
                      <Link href={`/lobby/${categoryToSlug(rel.category)}/${rel.slug}`}>
                        {rel.title}
                      </Link>
                    </h4>
                    <p className="mt-2 text-xs text-[#4B5157] font-sans line-clamp-2">
                      {rel.excerpt}
                    </p>
                  </div>
                  <div className="mt-4 text-[10px] font-mono text-[#4B5157]">
                    {rel.published_at ? new Date(rel.published_at).toLocaleDateString("en-GB", { day: 'numeric', month: 'short' }) : "RECENT"}
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}
      </article>
    </div>
  );
}

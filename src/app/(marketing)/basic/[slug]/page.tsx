import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { getAllBasicPages, getBasicPageBySlug } from '@/lib/basic';
import { MDXRemote } from 'next-mdx-remote/rsc';
import BasicPageTemplate from '@/components/basic/BasicPageTemplate';
import {
  Callout,
  Chart,
  Diagram,
  DataTable,
  PullQuote,
  BlogChart,
  BlogTable,
} from '@/components/blog/MDXComponents';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const pages = getAllBasicPages();
  return pages.map(p => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = getBasicPageBySlug(slug);
  if (!page) return {};
  return {
    title: page.metaTitle,
    description: page.metaDescription,
    alternates: { canonical: `https://drawdown.trading/basic/${slug}` },
    openGraph: {
      title: page.metaTitle,
      description: page.metaDescription,
      images: [{ url: page.heroImage.src, alt: page.heroImage.alt }],
    },
  };
}

export default async function BasicSlugPage({ params }: Props) {
  const { slug } = await params;
  const page = getBasicPageBySlug(slug);
  if (!page) notFound();

  // JSON-LD schemas
  const definedTermSchema = {
    '@context': 'https://schema.org',
    '@type': 'DefinedTerm',
    name: page.title,
    description: page.instantAnswer,
    inDefinedTermSet: {
      '@type': 'DefinedTermSet',
      name: 'Drawdown Trading Glossary',
      url: 'https://drawdown.trading/glossary',
    },
    url: `https://drawdown.trading/basic/${slug}`,
  };

  const faqSchema = page.faq.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: page.faq.map(f => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: { '@type': 'Answer', text: f.answer },
    })),
  } : null;

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://drawdown.trading' },
      { '@type': 'ListItem', position: 2, name: 'Trading Basics', item: 'https://drawdown.trading/basic' },
      { '@type': 'ListItem', position: 3, name: page.cluster, item: `https://drawdown.trading/basic#${page.cluster.toLowerCase().replace(/\s+/g, '-')}` },
      { '@type': 'ListItem', position: 4, name: page.title, item: `https://drawdown.trading/basic/${slug}` },
    ],
  };

  const mdxComponents = {
    Callout,
    Chart,
    Diagram,
    DataTable,
    PullQuote,
    BlogChart,
    BlogTable,
  };

  const renderedContent = <MDXRemote source={page.content} components={mdxComponents} />;

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(definedTermSchema) }} />
      {faqSchema && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <BasicPageTemplate page={page} renderedContent={renderedContent} />
    </>
  );
}

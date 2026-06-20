'use client';

import Link from 'next/link';
import Image from 'next/image';
import { BasicPageMeta, BasicCluster } from '@/lib/basic';

interface BasicHubProps {
  pages: BasicPageMeta[];
}

const CLUSTER_ORDER: BasicCluster[] = [
  'The Markets',
  'The Players',
  'The Mechanics',
  'Getting Started',
];

const CLUSTER_DESCRIPTIONS: Record<BasicCluster, string> = {
  'The Markets': 'The instruments you will actually trade — what they are and why they move.',
  'The Players': 'Who creates, enables, and funds the trades you will place.',
  'The Mechanics': 'The mechanisms, instruments, and tools you operate through.',
  'Getting Started': 'Practical answers to the first questions every new trader asks.',
};

export default function BasicHub({ pages }: BasicHubProps) {
  const byCluster = CLUSTER_ORDER.reduce<Record<BasicCluster, BasicPageMeta[]>>(
    (acc, cluster) => {
      acc[cluster] = pages.filter(p => p.cluster === cluster);
      return acc;
    },
    {} as Record<BasicCluster, BasicPageMeta[]>
  );

  return (
    <div className="bg-white text-mkt-ink">
      {/* Page Header */}
      <div className="border-b border-mkt-bd">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-mkt-i4 mb-8">
            <Link href="/" className="hover:text-mkt-ink transition-colors">Home</Link>
            <span>/</span>
            <span className="text-mkt-ink">Trading Basics</span>
          </nav>

          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-mkt-i3 mb-4">
            // TRADING BASICS
          </p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-mkt-ink mb-4" style={{ letterSpacing: '-0.02em' }}>
            The Fundamentals.
          </h1>
          <p className="text-lg text-mkt-i3 font-sans max-w-2xl">
            Plain-English answers to the questions every new trader asks — from first principles, no jargon.
          </p>
        </div>
      </div>

      {/* Cluster Sections */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 space-y-20">
        {CLUSTER_ORDER.map((cluster) => {
          const clusterPages = byCluster[cluster];
          if (!clusterPages || clusterPages.length === 0) return null;

          const anchorId = cluster.toLowerCase().replace(/\s+/g, '-');

          return (
            <section key={cluster} id={anchorId}>
              {/* Cluster heading */}
              <div className="border-b border-mkt-bd pb-4 mb-8">
                <p className="font-mono text-[10px] uppercase tracking-widest text-mkt-i4 mb-1">
                  // CLUSTER
                </p>
                <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2">
                  <h2 className="text-2xl md:text-3xl font-bold text-mkt-ink" style={{ letterSpacing: '-0.02em' }}>
                    {cluster}
                  </h2>
                  <p className="text-sm text-mkt-i3 font-sans sm:text-right max-w-md">
                    {CLUSTER_DESCRIPTIONS[cluster]}
                  </p>
                </div>
              </div>

              {/* Card Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-mkt-bd">
                {clusterPages.map((page) => (
                  <BasicCard key={page.slug} page={page} />
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}

function BasicCard({ page }: { page: BasicPageMeta }) {
  return (
    <Link
      href={`/basic/${page.slug}`}
      className="group block bg-white hover:bg-[#FAFAFA] transition-colors duration-150"
    >
      {/* Thumbnail */}
      {page.thumbnail && (
        <div className="relative w-full h-44 overflow-hidden bg-[#F5F5F5]">
          <Image
            src={page.thumbnail}
            alt={page.heroImage.alt}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
            unoptimized
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        </div>
      )}

      {/* Content */}
      <div className="p-6">
        {/* Cluster badge */}
        <span className="inline-block font-mono text-[9px] uppercase tracking-widest text-mkt-i4 border border-mkt-bd px-2 py-0.5 mb-3">
          {page.cluster}
        </span>

        <h3 className="text-base font-bold text-mkt-ink mb-2 leading-snug group-hover:text-mkt-grn transition-colors duration-150" style={{ letterSpacing: '-0.01em' }}>
          {page.title}
        </h3>

        <p className="text-sm text-mkt-i3 font-sans leading-relaxed line-clamp-3">
          {page.dek}
        </p>

        {/* Arrow */}
        <div className="mt-4 flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest text-mkt-i4 group-hover:text-mkt-grn transition-colors duration-150">
          <span>Read guide</span>
          <span className="transition-transform duration-150 group-hover:translate-x-1">→</span>
        </div>
      </div>
    </Link>
  );
}

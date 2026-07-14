'use client';

import Link from 'next/link';
import Image from 'next/image';
import { BasicPageMeta } from '@/lib/basic';

interface RelatedBasicsProps {
  slugs: string[];
  allPages: BasicPageMeta[];
}

export default function RelatedBasics({ slugs, allPages }: RelatedBasicsProps) {
  // Filter down to just the requested slugs, preserving order
  const related = slugs
    .map(slug => allPages.find(p => p.slug === slug))
    .filter((p): p is BasicPageMeta => Boolean(p))
    .slice(0, 3);

  // If we have no resolved pages (e.g., allPages not provided), show link-only fallback
  if (related.length === 0) {
    return (
      <div className="border-t border-mkt-bd pt-8">
        <p className="font-mono text-[10px] uppercase tracking-widest text-mkt-i4 mb-4">
          // RELATED GUIDES
        </p>
        <div className="flex flex-col gap-2">
          {slugs.slice(0, 4).map(slug => (
            <Link
              key={slug}
              href={`/basic/${slug}`}
              className="flex items-center gap-2 text-sm font-sans text-mkt-i3 hover:text-mkt-grn transition-colors duration-150 group"
            >
              <span className="font-mono text-[10px] text-mkt-i4 group-hover:text-mkt-grn transition-colors">→</span>
              <span className="capitalize">{slug.replace(/-/g, ' ')}</span>
            </Link>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="border-t border-mkt-bd pt-8">
      <p className="font-mono text-[10px] uppercase tracking-widest text-mkt-i4 mb-6">
        // RELATED GUIDES
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-px bg-mkt-bd">
        {related.map(page => (
          <Link
            key={page.slug}
            href={`/basic/${page.slug}`}
            className="group bg-white hover:bg-[#FAFAFA] transition-colors duration-150 p-4"
          >
            {page.thumbnail && (
              <div className="relative w-full h-24 mb-3 overflow-hidden bg-[#F5F5F5]">
                <Image
                  src={page.thumbnail}
                  alt={page.heroImage.alt}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                  unoptimized
                  sizes="(max-width: 640px) 100vw, 33vw"
                />
              </div>
            )}
            <p className="font-mono text-[9px] uppercase tracking-widest text-mkt-i4 mb-1">
              {page.cluster}
            </p>
            <p className="text-sm font-bold text-mkt-ink leading-snug group-hover:text-mkt-grn transition-colors duration-150" style={{ letterSpacing: '-0.01em' }}>
              {page.title}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}

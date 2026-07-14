'use client';

import Image from 'next/image';
import Link from 'next/link';

interface BasicPageHeroProps {
  title: string;
  dek: string;
  eyebrow: string;
  heroImage: { src: string; alt: string; caption?: string };
}

export default function BasicPageHero({ title, dek, eyebrow, heroImage }: BasicPageHeroProps) {
  return (
    <div className="relative w-full bg-mkt-ink" style={{ minHeight: '50vh' }}>
      {/* Background image */}
      <div className="absolute inset-0">
        <Image
          src={heroImage.src}
          alt={heroImage.alt}
          fill
          className="object-cover"
          unoptimized
          priority
          sizes="100vw"
        />
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/60" />
      </div>

      {/* Breadcrumb + content */}
      <div className="relative z-10 flex flex-col justify-end h-full" style={{ minHeight: '50vh' }}>
        {/* Breadcrumbs */}
        <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-12">
          <nav className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-white/50 mb-6">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <Link href="/basic" className="hover:text-white transition-colors">Trading Basics</Link>
            <span>/</span>
            <span className="text-white/80 truncate max-w-[200px]">{title}</span>
          </nav>
        </div>

        <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pb-12">
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/60 mb-4">
            {eyebrow}
          </p>
          <h1
            className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 max-w-3xl"
            style={{ letterSpacing: '-0.02em', lineHeight: '1.1' }}
          >
            {title}
          </h1>
          <p className="text-base sm:text-lg text-white/75 font-sans leading-relaxed max-w-2xl">
            {dek}
          </p>

          {/* Caption */}
          {heroImage.caption && (
            <p className="mt-3 font-mono text-[10px] text-white/40 uppercase tracking-widest">
              {heroImage.caption}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

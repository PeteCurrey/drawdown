'use client';

import Link from 'next/link';

interface GlossaryCrossRefProps {
  term: string;
}

export default function GlossaryCrossRef({ term }: GlossaryCrossRefProps) {
  if (!term) return null;

  const displayTerm = term
    .split('-')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');

  return (
    <div className="border border-mkt-bd bg-white p-5">
      <p className="font-mono text-[10px] uppercase tracking-widest text-mkt-i4 mb-2">
        // QUICK DEFINITION
      </p>
      <p className="text-sm text-mkt-i3 font-sans mb-3">
        Looking for a concise definition of <strong className="text-mkt-ink">{displayTerm}</strong>?
      </p>
      <Link
        href={`/glossary/${term}`}
        className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-mkt-grn hover:opacity-80 transition-opacity duration-150"
      >
        <span>View glossary entry</span>
        <span>→</span>
      </Link>
    </div>
  );
}

'use client';

import React from 'react';
import Link from 'next/link';

interface KeyTermLinkProps {
  term: string;
  slug: string;
  children?: React.ReactNode;
}

export const KeyTermLink: React.FC<KeyTermLinkProps> = ({ term, slug, children }) => {
  return (
    <Link 
      href={`/glossary/${slug}`}
      className="inline-block relative group text-accent hover:text-accent-hover transition-colors duration-200"
    >
      <span className="relative">
        {children || term}
        <span className="absolute left-0 bottom-0 w-full h-[1px] bg-accent/30 group-hover:bg-accent transition-colors duration-200" />
      </span>
      
      {/* Optional: Add a subtle tooltip indicator if needed in the future */}
    </Link>
  );
};

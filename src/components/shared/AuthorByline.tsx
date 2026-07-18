import React from "react";
import Link from "next/link";
import Script from "next/script";

interface AuthorBylineProps {
  authorName?: string;
  authorRole?: string;
  authorLink?: string;
  date?: string;
  readTime?: string;
}

export function AuthorByline({
  authorName = "Pete Currey",
  authorRole = "Founder, Drawdown",
  authorLink = "/about",
  date,
  readTime,
}: AuthorBylineProps) {
  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": authorName,
    "jobTitle": authorRole,
    "url": `https://drawdown.trading${authorLink}`,
    "worksFor": {
      "@type": "Organization",
      "name": "Drawdown Trading"
    }
  };

  return (
    <>
      <Script
        id={`person-schema-${authorName.replace(/\s+/g, '-')}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />
      <div className="py-4 border-y border-border-slate/50 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-background-primary">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-background-elevated border border-border-slate flex items-center justify-center">
          <span className="text-xs font-mono font-bold text-accent">
            {authorName.split(' ').map(n => n[0]).join('')}
          </span>
        </div>
        <div>
          <div className="flex items-center gap-2">
            <Link href={authorLink} className="text-sm font-bold text-text-primary hover:text-accent transition-colors">
              {authorName}
            </Link>
          </div>
          <div className="flex items-center gap-2 text-xs text-text-tertiary mt-0.5">
            <span>{authorRole}</span>
            {date && (
              <>
                <span className="opacity-50">•</span>
                <time>{date}</time>
              </>
            )}
            {readTime && (
              <>
                <span className="opacity-50">•</span>
                <span>{readTime} read</span>
              </>
            )}
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-2 pl-12 md:pl-0">
        <Link 
          href="/editorial-standards" 
          className="text-xs text-text-secondary hover:text-text-primary transition-colors hover:underline"
        >
          How we write
        </Link>
      </div>
    </div>
    </>
  );
}

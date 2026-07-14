'use client';

import { useEffect, useRef, useState } from 'react';
import { BasicPage } from '@/lib/basic';
import BasicPageHero from './BasicPageHero';
import InstantAnswer from './InstantAnswer';
import KeyTakeaways from './KeyTakeaways';
import RelatedBasics from './RelatedBasics';
import NextStepCta from './NextStepCta';
import GlossaryCrossRef from './GlossaryCrossRef';

interface HeadingItem {
  text: string;
  id: string;
  level: 2 | 3;
}

interface BasicPageTemplateProps {
  page: BasicPage;
  renderedContent: React.ReactNode;
}

// Simple inline reading progress bar
function ReadingProgressBar() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const article = document.querySelector('article');
      if (!article) return;
      const rect = article.getBoundingClientRect();
      const scrollPos = window.scrollY + window.innerHeight - (rect.top + window.scrollY);
      const percent = Math.min(100, Math.max(0, (scrollPos / rect.height) * 100));
      setProgress(percent);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });
    handleScroll();
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  return (
    <div className="fixed top-[58px] left-0 w-full h-[2px] bg-[#F0F0F0] z-[195] pointer-events-none">
      <div
        className="h-full transition-all duration-75 ease-out"
        style={{ width: `${progress}%`, backgroundColor: '#16A34A' }}
      />
    </div>
  );
}

// Simple TOC that reads headings from the DOM
function BasicTOC({ headings }: { headings: HeadingItem[] }) {
  const [activeId, setActiveId] = useState('');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter(e => e.isIntersecting);
        if (visible.length > 0) setActiveId(visible[0].target.id);
      },
      { rootMargin: '0px 0px -60% 0px', threshold: 0.1 }
    );
    headings.forEach(h => {
      const el = document.getElementById(h.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [headings]);

  if (!headings.length) return null;

  const scrollTo = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (!el) return;
    const offset = 80;
    const top = el.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
    setActiveId(id);
  };

  return (
    <div className="font-mono">
      <h4 className="text-[10px] font-bold uppercase tracking-widest text-mkt-i4 mb-4">
        // TABLE OF CONTENTS
      </h4>
      <ul className="space-y-2.5 text-[10px] uppercase tracking-wider">
        {headings.map((h, i) => (
          <li key={i} style={{ paddingLeft: h.level === 3 ? '10px' : '0px' }}>
            <a
              href={`#${h.id}`}
              onClick={(e) => scrollTo(e, h.id)}
              className="flex items-start gap-2 transition-colors duration-150 hover:text-mkt-grn font-medium"
              style={{ color: activeId === h.id ? '#16A34A' : '#666666' }}
            >
              <span className="text-[8px] font-light mt-0.5 opacity-60">0{i + 1}</span>
              <span className="break-words leading-snug">{h.text}</span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

// FAQ accordion — simple useState toggles, no library
function FaqAccordion({ faq }: { faq: { question: string; answer: string }[] }) {
  const [open, setOpen] = useState<number | null>(null);

  if (!faq || faq.length === 0) return null;

  return (
    <div className="mt-10">
      <h2 className="text-xl font-bold text-mkt-ink mb-4" style={{ letterSpacing: '-0.01em' }}>
        Frequently Asked Questions
      </h2>
      <div className="divide-y divide-mkt-bd border border-mkt-bd">
        {faq.map((item, i) => (
          <div key={i}>
            <button
              className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left"
              onClick={() => setOpen(open === i ? null : i)}
              aria-expanded={open === i}
            >
              <span className="text-sm font-semibold text-mkt-ink leading-snug">{item.question}</span>
              <span
                className="flex-shrink-0 font-mono text-base text-mkt-i3 transition-transform duration-200 select-none"
                style={{ transform: open === i ? 'rotate(45deg)' : 'rotate(0deg)' }}
              >
                +
              </span>
            </button>
            {open === i && (
              <div className="px-5 pb-5">
                <p className="text-sm text-mkt-i3 font-sans leading-relaxed">{item.answer}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function BasicPageTemplate({ page, renderedContent }: BasicPageTemplateProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [tocHeadings, setTocHeadings] = useState<HeadingItem[]>([]);

  // Extract headings from rendered content after mount
  useEffect(() => {
    if (!contentRef.current) return;
    const nodes = contentRef.current.querySelectorAll('h2, h3');
    const headings: HeadingItem[] = [];
    nodes.forEach((node, i) => {
      const el = node as HTMLElement;
      const text = el.textContent || '';
      const id = el.id || text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + `-${i}`;
      if (!el.id) el.id = id;
      headings.push({ text, id, level: el.tagName === 'H2' ? 2 : 3 });
    });
    setTocHeadings(headings);
  }, []);

  // Build static headings from FAQ questions too
  const faqHeadings: HeadingItem[] = page.faq.map((f, i) => ({
    text: f.question,
    id: `faq-${i}`,
    level: 2 as const,
  }));

  const allHeadings = [...tocHeadings, ...faqHeadings];

  const eyebrow = `Trading Basics · ${page.cluster}`;

  return (
    <div className="bg-white text-mkt-ink">
      <ReadingProgressBar />

      {/* Hero */}
      <BasicPageHero
        title={page.title}
        dek={page.dek}
        eyebrow={eyebrow}
        heroImage={page.heroImage}
      />

      {/* Instant Answer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        <InstantAnswer answer={page.instantAnswer} />
      </div>

      {/* Main content + sidebar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,_65fr)_minmax(0,_35fr)] gap-12 xl:gap-16">

          {/* Content Column */}
          <article>
            {/* MDX Body */}
            <div
              ref={contentRef}
              className="prose-basic text-mkt-ink"
            >
              {renderedContent}
            </div>

            {/* Key Takeaways */}
            <KeyTakeaways takeaways={page.keyTakeaways} />

            {/* FAQ */}
            <FaqAccordion faq={page.faq} />

            {/* Related Basics */}
            {page.relatedBasics && page.relatedBasics.length > 0 && (
              <div className="mt-12">
                <RelatedBasicsSection slugs={page.relatedBasics} />
              </div>
            )}
          </article>

          {/* Sidebar */}
          <aside>
            <div className="lg:sticky lg:top-24 space-y-6">
              {/* TOC */}
              {allHeadings.length > 0 && (
                <div className="border border-mkt-bd p-5">
                  <BasicTOC headings={allHeadings} />
                </div>
              )}

              {/* Glossary Cross-ref */}
              {page.glossaryTerm && (
                <GlossaryCrossRef term={page.glossaryTerm} />
              )}

              {/* Next Step CTA */}
              <NextStepCta label={page.nextStep.label} href={page.nextStep.href} />
            </div>
          </aside>
        </div>
      </div>

      {/* MDX prose styles scoped */}
      <style>{`
        .prose-basic h2 {
          font-size: 1.5rem;
          font-weight: 700;
          color: #0A0A0A;
          margin-top: 2.5rem;
          margin-bottom: 0.75rem;
          letter-spacing: -0.01em;
          line-height: 1.25;
        }
        .prose-basic h3 {
          font-size: 1.125rem;
          font-weight: 600;
          color: #0A0A0A;
          margin-top: 1.75rem;
          margin-bottom: 0.5rem;
          letter-spacing: -0.01em;
        }
        .prose-basic p {
          font-size: 1rem;
          color: #3A3A3A;
          line-height: 1.75;
          margin-bottom: 1.25rem;
        }
        .prose-basic ul {
          margin-bottom: 1.25rem;
          padding-left: 1.25rem;
          list-style-type: disc;
        }
        .prose-basic ol {
          margin-bottom: 1.25rem;
          padding-left: 1.25rem;
          list-style-type: decimal;
        }
        .prose-basic li {
          font-size: 1rem;
          color: #3A3A3A;
          line-height: 1.7;
          margin-bottom: 0.4rem;
        }
        .prose-basic strong {
          color: #0A0A0A;
          font-weight: 600;
        }
        .prose-basic a {
          color: #16A34A;
          text-decoration: underline;
          text-underline-offset: 3px;
        }
        .prose-basic a:hover {
          color: #0A0A0A;
        }
        .prose-basic blockquote {
          border-left: 3px solid #E5E5E5;
          padding-left: 1rem;
          margin-left: 0;
          color: #666666;
          font-style: italic;
        }
        .prose-basic code {
          font-family: var(--font-mono), ui-monospace, monospace;
          font-size: 0.875rem;
          background: #F5F5F5;
          padding: 0.15em 0.35em;
          border: 1px solid #E5E5E5;
        }
        .prose-basic hr {
          border: none;
          border-top: 1px solid #E5E5E5;
          margin: 2rem 0;
        }
      `}</style>
    </div>
  );
}

// Thin client wrapper to fetch related pages — avoids server import in client component
function RelatedBasicsSection({ slugs }: { slugs: string[] }) {
  // We receive slugs from the server; we'll resolve them via a data fetch
  // Since this is client, we pass the data via props from the parent's allPages
  return <RelatedBasics slugs={slugs} allPages={[]} />;
}

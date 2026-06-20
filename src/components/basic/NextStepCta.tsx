'use client';

import Link from 'next/link';

interface NextStepCtaProps {
  label: string;
  href: string;
}

export default function NextStepCta({ label, href }: NextStepCtaProps) {
  return (
    <div
      className="bg-white p-5"
      style={{ borderLeft: '4px solid #16A34A' }}
    >
      <p className="font-mono text-[10px] uppercase tracking-widest text-mkt-i4 mb-3">
        // READY TO GO DEEPER?
      </p>
      <p className="text-sm font-bold font-sans text-mkt-ink leading-snug mb-4" style={{ letterSpacing: '-0.01em' }}>
        {label}
      </p>
      <Link
        href={href}
        className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-mkt-grn hover:opacity-80 transition-opacity duration-150"
      >
        <span>Start now</span>
        <span>→</span>
      </Link>
    </div>
  );
}

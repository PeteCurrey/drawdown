'use client';

interface InstantAnswerProps {
  answer: string;
}

export default function InstantAnswer({ answer }: InstantAnswerProps) {
  return (
    <div className="border-2 border-mkt-ink bg-white p-6 md:p-8">
      <p className="font-mono text-[10px] uppercase tracking-widest text-mkt-i4 mb-3">
        // QUICK ANSWER
      </p>
      <p className="text-base font-sans text-mkt-ink leading-relaxed">
        {answer}
      </p>
    </div>
  );
}

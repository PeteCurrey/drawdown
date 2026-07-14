'use client';

interface KeyTakeawaysProps {
  takeaways: string[];
}

// Simple checkmark SVG — no emoji
function CheckIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#16A34A"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="flex-shrink-0 mt-0.5"
      aria-hidden="true"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

export default function KeyTakeaways({ takeaways }: KeyTakeawaysProps) {
  if (!takeaways || takeaways.length === 0) return null;

  return (
    <div className="mt-10 border border-mkt-bd p-6 md:p-8" style={{ backgroundColor: '#F7F7F7' }}>
      <p className="font-mono text-[10px] uppercase tracking-widest text-mkt-i4 mb-4">
        // KEY TAKEAWAYS
      </p>
      <ul className="space-y-3">
        {takeaways.map((takeaway, i) => (
          <li key={i} className="flex items-start gap-3">
            <CheckIcon />
            <span className="text-sm font-sans text-mkt-i2 leading-relaxed">{takeaway}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

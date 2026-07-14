import { CheckSquare } from "lucide-react";

interface PrerequisitesProps {
  items: string[];
}

export function Prerequisites({ items }: PrerequisitesProps) {
  if (!items || items.length === 0) return null;

  return (
    <div className="border border-mkt-bd bg-[#FAFAFA] p-6 mb-10">
      <p className="text-[9px] font-mono font-bold uppercase tracking-widest text-mkt-i3 mb-4">
        // Before You Start
      </p>
      <ul className="space-y-2.5">
        {items.map((item, i) => (
          <li key={i} className="flex items-start gap-3 text-sm font-sans text-mkt-ink leading-snug">
            <CheckSquare className="w-4 h-4 text-mkt-grn shrink-0 mt-0.5" aria-hidden="true" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

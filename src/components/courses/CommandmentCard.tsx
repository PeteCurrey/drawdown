"use client";

interface CommandmentCardProps {
  num: number;
  title: string;
  description: string;
}

export function CommandmentCard({ num, title, description }: CommandmentCardProps) {
  return (
    <div className="w-full bg-[#111111] border border-[#22C55E] p-5 rounded-md flex gap-5 items-start">
      <div className="font-mono text-3xl font-bold text-[#22C55E] shrink-0 select-none">
        □ {num}
      </div>
      <div className="space-y-2 flex-1">
        <h4 className="font-display text-base sm:text-lg font-bold text-white uppercase tracking-wide leading-tight">
          {title}
        </h4>
        <p className="text-xs sm:text-sm text-[#9CA3AF] leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
}

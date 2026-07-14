"use client";

type Difficulty = "Beginner" | "Intermediate";

interface DifficultyBadgeProps {
  difficulty: Difficulty;
  className?: string;
}

const CONFIG: Record<Difficulty, { label: string; bg: string; text: string; dot: string }> = {
  Beginner: {
    label: "Beginner",
    bg: "bg-[#F0FDF4]",
    text: "text-[#16A34A]",
    dot: "bg-[#16A34A]",
  },
  Intermediate: {
    label: "Intermediate",
    bg: "bg-[#FFF7ED]",
    text: "text-[#C2410C]",
    dot: "bg-[#C2410C]",
  },
};

export function DifficultyBadge({ difficulty, className = "" }: DifficultyBadgeProps) {
  const c = CONFIG[difficulty];
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[9px] font-mono font-bold uppercase tracking-widest border ${c.bg} ${c.text} border-current/20 ${className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
      {c.label}
    </span>
  );
}

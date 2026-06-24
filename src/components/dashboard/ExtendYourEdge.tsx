import Link from "next/link";
import { ArrowUpRight, BookOpen, Terminal } from "lucide-react";

interface Course {
  name: string;
  slug: string;
  price: string;
  description: string;
  icon: React.ElementType;
  href: string;
}

const STANDALONE_COURSES: Course[] = [
  {
    name: "Prop Firm Survival Kit",
    slug: "prop-survival-kit",
    price: "£14",
    description: "Blueprint to pass your evaluation and stay funded.",
    icon: BookOpen,
    href: "/store/prop-survival-kit",
  },
  {
    name: "Deploy Your Algo",
    slug: "deploy-your-algo",
    price: "£97",
    description: "From generated Pine Script to a live chart in one session.",
    icon: Terminal,
    href: "/courses/deploy-your-algo",
  },
];

/**
 * "Extend Your Edge" standalone courses widget.
 * Shown to signal-centre tier users — low-pressure awareness card,
 * not a sales push. Matches the platform dark aesthetic used in the sidebar.
 */
export function ExtendYourEdge() {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm space-y-4">
      {/* Header */}
      <div className="border-b border-gray-100 pb-3">
        <p className="text-[9px] font-mono uppercase tracking-widest text-gray-400 mb-1">
          One-Time Purchases
        </p>
        <h3 className="text-xs font-mono font-black text-gray-900 uppercase tracking-wider">
          Extend Your Edge
        </h3>
      </div>

      {/* Course List */}
      <div className="space-y-3">
        {STANDALONE_COURSES.map((course) => {
          const Icon = course.icon;
          return (
            <div
              key={course.slug}
              className="flex items-start gap-3 p-3 bg-gray-50 border border-gray-100 rounded-xl"
            >
              <div className="w-8 h-8 rounded-lg bg-[#1A1A1A] flex items-center justify-center shrink-0">
                <Icon className="w-4 h-4 text-[#C8F135]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-gray-900 leading-tight font-sans">
                  {course.name}
                </p>
                <p className="text-[10px] text-gray-400 mt-0.5 font-sans">
                  {course.description}
                </p>
                <p className="text-[9px] font-mono text-gray-400 mt-1">
                  One-time · {course.price}
                </p>
              </div>
              <Link
                href={course.href}
                className="inline-flex items-center gap-1 shrink-0 text-[10px] font-mono font-bold text-[#1A1A1A] hover:text-[#F9771D] transition-colors uppercase tracking-wider"
              >
                Buy <ArrowUpRight className="w-3 h-3" />
              </Link>
            </div>
          );
        })}
      </div>

      {/* Footer note */}
      <p className="text-[8px] font-mono text-gray-400 text-center leading-relaxed pt-1 border-t border-gray-100">
        Standalone purchases · No subscription required
      </p>
    </div>
  );
}

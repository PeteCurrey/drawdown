import { ShieldCheck, ExternalLink } from "lucide-react";
import type { LobbySource } from "@/types/lobby";

interface LobbySourceAttributionProps {
  sources?: LobbySource[];
  primarySourceUrl?: string | null;
  primarySourceName?: string | null;
  className?: string;
}

export function LobbySourceAttribution({
  sources = [],
  primarySourceUrl,
  primarySourceName,
  className
}: LobbySourceAttributionProps) {
  // Combine sources with primary source if provided
  const combinedSources: LobbySource[] = [...sources];
  if (primarySourceName && primarySourceUrl && !combinedSources.some(s => s.url === primarySourceUrl)) {
    combinedSources.unshift({
      name: primarySourceName,
      url: primarySourceUrl,
      source_type: "Primary Source",
      classification: "primary"
    });
  }

  if (combinedSources.length === 0) return null;

  return (
    <div className={`border-t border-b border-[#DEDDD8] py-8 my-10 bg-[#FAF9F5]/70 p-6 sm:p-8 rounded-[2px] ${className || ""}`}>
      <div className="flex items-center gap-2 mb-4">
        <ShieldCheck className="w-4 h-4 text-emerald-700" />
        <h4 className="text-xs font-mono font-bold uppercase tracking-[0.16em] text-[#0B0E12]">
          SOURCES &amp; DOCUMENTATION
        </h4>
      </div>

      <p className="text-xs text-[#4B5157] font-sans mb-6 leading-relaxed">
        Drawdown strictly separates factual findings derived from primary documentation (regulatory registers, audited statements, direct corporate filings) from proprietary Drawdown editorial analysis.
      </p>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs font-mono border-collapse">
          <thead>
            <tr className="border-b border-[#DEDDD8] text-[#4B5157] uppercase text-[10px] tracking-wider">
              <th className="py-2 pr-4">Classification</th>
              <th className="py-2 pr-4">Source Organization</th>
              <th className="py-2 pr-4">Type</th>
              <th className="py-2 text-right">Reference</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#DEDDD8]/60">
            {combinedSources.map((s, idx) => (
              <tr key={idx} className="hover:bg-[#FFFFFF]/60">
                <td className="py-2.5 pr-4">
                  <span className={`inline-block px-1.5 py-0.5 rounded-[1px] text-[9px] uppercase tracking-wider font-semibold ${
                    s.classification === 'primary'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-neutral-200 text-[#0B0E12]'
                  }`}>
                    {s.classification || 'primary'}
                  </span>
                </td>
                <td className="py-2.5 pr-4 font-semibold text-[#0B0E12]">
                  {s.name}
                </td>
                <td className="py-2.5 pr-4 text-[#4B5157] capitalize">
                  {s.source_type ? s.source_type.replace(/_/g, ' ') : 'Official'}
                </td>
                <td className="py-2.5 text-right">
                  <a
                    href={s.url}
                    target="_blank"
                    rel="nofollow noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[#16213E] hover:underline font-semibold"
                  >
                    Inspect Document <ExternalLink className="w-3 h-3" />
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

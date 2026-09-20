import Link from "next/link";
import { Calculator, ArrowRight, ShieldCheck, Briefcase, Cpu } from "lucide-react";
import { DRAWDOWN_TOOLS, DRAWDOWN_ENTITIES } from "@/lib/lobby-constants";

interface LobbyInternalLinksProps {
  toolSlugs?: string[];
  brokerSlugs?: string[];
  propFirmSlugs?: string[];
  platformSlugs?: string[];
  relatedMarkets?: string[];
  className?: string;
}

export function LobbyInternalLinks({
  toolSlugs = [],
  brokerSlugs = [],
  propFirmSlugs = [],
  platformSlugs = [],
  relatedMarkets = [],
  className
}: LobbyInternalLinksProps) {
  // Only render entities that actually exist in the catalogues
  const tools = toolSlugs
    .map(slug => DRAWDOWN_TOOLS[slug])
    .filter(Boolean);

  const brokers = brokerSlugs
    .map(slug => DRAWDOWN_ENTITIES[slug])
    .filter(Boolean);

  const propFirms = propFirmSlugs
    .map(slug => DRAWDOWN_ENTITIES[slug])
    .filter(Boolean);

  const platforms = platformSlugs
    .map(slug => DRAWDOWN_ENTITIES[slug])
    .filter(Boolean);

  const hasAny = tools.length > 0 || brokers.length > 0 || propFirms.length > 0 || platforms.length > 0 || relatedMarkets.length > 0;

  if (!hasAny) return null;

  return (
    <aside aria-label="Related Drawdown Intelligence & Tools" className={`my-10 p-6 sm:p-8 bg-[#FAF9F5] border border-[#DEDDD8] rounded-[2px] ${className || ""}`}>
      <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#16213E] font-bold mb-4">
        DRAWDOWN INTELLIGENCE &amp; TOOL CONNECTIONS
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Connected Drawdown Tools */}
        {tools.length > 0 && (
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-[#4B5157] font-semibold flex items-center gap-1.5 mb-3">
              <Calculator className="w-3.5 h-3.5 text-[#16213E]" />
              Understand &amp; Calculate With Drawdown Tools
            </span>
            <div className="space-y-2">
              {tools.map(tool => (
                <Link
                  key={tool.slug}
                  href={tool.href}
                  className="block p-3 bg-[#FFFFFF] border border-[#DEDDD8] rounded-[2px] hover:border-[#16213E] transition-colors group"
                >
                  <div className="flex items-center justify-between text-xs font-mono font-bold text-[#0B0E12] group-hover:text-[#16213E]">
                    <span>{tool.name}</span>
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                  <p className="mt-1 text-[11px] text-[#4B5157] font-sans">
                    {tool.description}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Connected Industry Entities */}
        {(brokers.length > 0 || propFirms.length > 0 || platforms.length > 0) && (
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-[#4B5157] font-semibold flex items-center gap-1.5 mb-3">
              <ShieldCheck className="w-3.5 h-3.5 text-[#16213E]" />
              Verified Industry Profiles Audited
            </span>
            <div className="space-y-2">
              {brokers.map(broker => (
                <Link
                  key={broker.slug}
                  href={broker.href}
                  className="flex items-center justify-between p-3 bg-[#FFFFFF] border border-[#DEDDD8] rounded-[2px] hover:border-[#16213E] transition-colors text-xs font-mono"
                >
                  <span className="font-semibold text-[#0B0E12]">Broker: {broker.name}</span>
                  <span className="text-[10px] text-[#16213E] uppercase tracking-wider">Audit Profile &rarr;</span>
                </Link>
              ))}
              {propFirms.map(firm => (
                <Link
                  key={firm.slug}
                  href={firm.href}
                  className="flex items-center justify-between p-3 bg-[#FFFFFF] border border-[#DEDDD8] rounded-[2px] hover:border-[#16213E] transition-colors text-xs font-mono"
                >
                  <span className="font-semibold text-[#0B0E12]">Prop Firm: {firm.name}</span>
                  <span className="text-[10px] text-[#16213E] uppercase tracking-wider">Evaluation Rules &rarr;</span>
                </Link>
              ))}
              {platforms.map(platform => (
                <Link
                  key={platform.slug}
                  href={platform.href}
                  className="flex items-center justify-between p-3 bg-[#FFFFFF] border border-[#DEDDD8] rounded-[2px] hover:border-[#16213E] transition-colors text-xs font-mono"
                >
                  <span className="font-semibold text-[#0B0E12]">Platform: {platform.name}</span>
                  <span className="text-[10px] text-[#16213E] uppercase tracking-wider">Overview &rarr;</span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Markets Tagline */}
      {relatedMarkets.length > 0 && (
        <div className="mt-4 pt-3 border-t border-[#DEDDD8]/60 flex items-center gap-2 text-xs font-mono">
          <span className="text-[#4B5157]">Instruments Impacted:</span>
          <div className="flex flex-wrap gap-1.5">
            {relatedMarkets.map(m => (
              <span key={m} className="px-2 py-0.5 bg-[#FFFFFF] border border-[#DEDDD8] rounded-[2px] font-bold text-[#0B0E12]">
                {m}
              </span>
            ))}
          </div>
        </div>
      )}
    </aside>
  );
}

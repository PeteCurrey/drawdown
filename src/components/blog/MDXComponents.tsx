import React from "react";
import { Info, AlertTriangle, CheckCircle, Quote, Shield } from "lucide-react";
import { cn } from "@/lib/utils";

// --- CALLOUT COMPONENT ---
interface CalloutProps {
  type?: "info" | "warning" | "success" | "quote" | "financial-advice";
  children: React.ReactNode;
}

export function Callout({ type = "info", children }: CalloutProps) {
  const configs = {
    info: {
      bg: "bg-[#00C2FF]/5 border-l-4 border-[#00C2FF] text-slate-800",
      icon: <Info className="w-4 h-4 text-[#00C2FF] shrink-0 mt-0.5" />
    },
    warning: {
      bg: "bg-[#FFB020]/5 border-l-4 border-[#FFB020] text-slate-800",
      icon: <AlertTriangle className="w-4 h-4 text-[#FFB020] shrink-0 mt-0.5" />
    },
    success: {
      bg: "bg-[#00E676]/5 border-l-4 border-[#00E676] text-slate-800",
      icon: <CheckCircle className="w-4 h-4 text-[#00E676] shrink-0 mt-0.5" />
    },
    quote: {
      bg: "bg-slate-50 border-l-4 border-slate-400 text-slate-800 italic",
      icon: <Quote className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
    },
    "financial-advice": {
      bg: "bg-[#FF3D57]/5 border-l-4 border-[#FF3D57] text-slate-900 font-sans",
      icon: <Shield className="w-4 h-4 text-[#FF3D57] shrink-0 mt-0.5" />
    }
  };

  const config = configs[type] || configs.info;

  return (
    <div className={cn("p-5 my-8 rounded-none flex gap-4 text-xs sm:text-sm font-sans leading-relaxed border-y border-r border-[#E5E5E5]", config.bg)}>
      {config.icon}
      <div className="flex-1 space-y-1">
        {type === "financial-advice" && (
          <span className="font-mono text-[9px] font-bold uppercase tracking-widest text-[#FF3D57] block mb-1">
            // EDUCATIONAL NOTICE — NOT FINANCIAL ADVICE
          </span>
        )}
        <div className="text-slate-700 leading-relaxed font-sans">{children}</div>
      </div>
    </div>
  );
}

// --- NEW CHARTS / DIAGRAMS / TABLES ---
interface ChartProps {
  src: string;
  alt: string;
  caption: string;
  source?: string;
}

export function Chart({ src, alt, caption, source }: ChartProps) {
  return (
    <figure className="my-10 space-y-3">
      <div className="w-full overflow-hidden border border-[#E5E5E5] rounded-none">
        <img src={src} alt={alt} className="w-full h-auto object-cover block" />
      </div>
      <figcaption className="font-mono text-[9px] text-text-secondary uppercase tracking-wider leading-relaxed">
        {caption} {source && <span className="text-text-tertiary font-light">| Source: {source}</span>}
      </figcaption>
    </figure>
  );
}

interface DiagramProps {
  children: React.ReactNode;
  caption: string;
  source?: string;
}

export function Diagram({ children, caption, source }: DiagramProps) {
  return (
    <figure className="my-10 space-y-3">
      <div className="w-full p-6 bg-slate-50 border border-[#E5E5E5] rounded-none flex items-center justify-center">
        {children}
      </div>
      <figcaption className="font-mono text-[9px] text-text-secondary uppercase tracking-wider leading-relaxed font-bold">
        {caption} {source && <span className="text-text-tertiary font-light">| Source: {source}</span>}
      </figcaption>
    </figure>
  );
}

interface DataTableProps {
  headers: string[];
  rows: string[][];
  caption?: string;
}

export function DataTable({ headers = [], rows = [], caption }: DataTableProps) {
  return (
    <figure className="my-10 space-y-3">
      <div className="w-full overflow-x-auto border border-[#E5E5E5] rounded-none bg-white">
        <table className="w-full border-collapse font-sans text-xs sm:text-sm text-left">
          <thead>
            <tr className="bg-slate-50 border-b border-[#E5E5E5]">
              {headers && headers.map((h, idx) => (
                <th key={idx} className="p-4 font-mono font-bold text-[9px] uppercase tracking-widest text-slate-500">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E5E5E5] text-slate-700 font-mono text-[10px]">
            {rows && rows.map((row, ri) => (
              <tr key={ri} className="hover:bg-slate-50/50 transition-colors">
                {row && row.map((cell, ci) => (
                  <td key={ci} className="p-4">
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {caption && (
        <figcaption className="font-mono text-[9px] text-text-secondary uppercase tracking-wider leading-relaxed">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}

interface PullQuoteProps {
  children: React.ReactNode;
  author?: string;
}

export function PullQuote({ children, author }: PullQuoteProps) {
  return (
    <div className="my-10 p-6 border-l-4 border-accent bg-[#0A0A0A]/5 rounded-none text-slate-800 font-mono text-xs sm:text-sm leading-relaxed">
      <p className="italic">"{children}"</p>
      {author && (
        <cite className="block text-[9px] text-text-tertiary mt-2 uppercase tracking-widest not-italic">
          — {author}
        </cite>
      )}
    </div>
  );
}

// --- BACKWARDS COMPATIBILITY WRAPPERS FOR OLD POSTS ---
interface BlogChartProps {
  type: "trend-sma" | "divergence" | "liquidity" | "leverage";
  title?: string;
}

export function BlogChart({ type, title }: BlogChartProps) {
  return (
    <div className="my-10 p-6 bg-slate-50 border border-[#E5E5E5] rounded-none overflow-hidden shadow-sm">
      {title && (
        <div className="text-[10px] font-mono uppercase tracking-widest text-slate-400 mb-4 font-bold flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-accent" />
          {title}
        </div>
      )}

      {type === "trend-sma" && (
        <div className="w-full">
          <svg className="w-full h-auto bg-slate-900 rounded-none" viewBox="0 0 600 300" fill="none">
            <line x1="50" y1="50" x2="550" y2="50" stroke="#1E293B" strokeDasharray="3 3" />
            <line x1="50" y1="120" x2="550" y2="120" stroke="#1E293B" strokeDasharray="3 3" />
            <line x1="50" y1="190" x2="550" y2="190" stroke="#1E293B" strokeDasharray="3 3" />
            <line x1="50" y1="260" x2="550" y2="260" stroke="#1E293B" strokeDasharray="3 3" />
            <line x1="80" y1="70" x2="80" y2="130" stroke="#EF4444" strokeWidth="2" />
            <rect x="74" y="80" width="12" height="40" fill="#EF4444" />
            <line x1="120" y1="90" x2="120" y2="150" stroke="#EF4444" strokeWidth="2" />
            <rect x="114" y="100" width="12" height="40" fill="#EF4444" />
            <line x1="160" y1="130" x2="160" y2="200" stroke="#EF4444" strokeWidth="2" />
            <rect x="154" y="140" width="12" height="40" fill="#EF4444" />
            <line x1="200" y1="160" x2="200" y2="220" stroke="#10B981" strokeWidth="2" />
            <rect x="194" y="170" width="12" height="30" fill="#10B981" />
            <line x1="240" y1="120" x2="240" y2="180" stroke="#10B981" strokeWidth="2" />
            <rect x="234" y="130" width="12" height="40" fill="#10B981" />
            <line x1="280" y1="90" x2="280" y2="150" stroke="#EF4444" strokeWidth="2" />
            <rect x="274" y="100" width="12" height="30" fill="#EF4444" />
            <line x1="320" y1="60" x2="320" y2="120" stroke="#10B981" strokeWidth="2" />
            <rect x="314" y="70" width="12" height="40" fill="#10B981" />
            <line x1="360" y1="40" x2="360" y2="90" stroke="#10B981" strokeWidth="2" />
            <rect x="354" y="45" width="12" height="35" fill="#10B981" />
            <line x1="400" y1="20" x2="400" y2="70" stroke="#10B981" strokeWidth="2" />
            <rect x="394" y="25" width="12" height="35" fill="#10B981" />
            <path d="M 50 170 Q 200 160 300 135 T 550 70" stroke="#00C2FF" strokeWidth="3" fill="none" />
            <text x="70" y="280" fill="#94A3B8" fontSize="10" fontFamily="sans-serif">200 SMA Trend Filter</text>
            <text x="310" y="160" fill="#00C2FF" fontSize="11" fontFamily="sans-serif" fontWeight="bold">200 SMA</text>
            <text x="420" y="55" fill="#10B981" fontSize="10" fontFamily="sans-serif" fontWeight="bold">Bullish Bias (Above SMA)</text>
            <text x="80" y="165" fill="#EF4444" fontSize="10" fontFamily="sans-serif" fontWeight="bold">Bearish Bias (Below SMA)</text>
            <rect x="235" y="105" width="130" height="20" rx="0" fill="#00C2FF" fillOpacity="0.1" stroke="#00C2FF" strokeWidth="1" />
            <text x="242" y="120" fill="#00C2FF" fontSize="9" fontFamily="sans-serif" fontWeight="bold">Bullish Confirmation Break</text>
          </svg>
          <div className="text-center text-[9px] text-slate-400 mt-2 font-mono uppercase">
            Figure 1: 200 SMA acts as a trend filter. Long actions executed exclusively above SMA.
          </div>
        </div>
      )}

      {type === "divergence" && (
        <div className="w-full">
          <svg className="w-full h-auto bg-slate-900 rounded-none" viewBox="0 0 600 340" fill="none">
            <text x="25" y="30" fill="#E2E8F0" fontSize="11" fontFamily="sans-serif" fontWeight="bold">GBP/USD Price Action</text>
            <line x1="25" y1="180" x2="575" y2="180" stroke="#1E293B" strokeWidth="2" />
            <path d="M 50 140 L 150 110 L 250 130 L 350 80 L 450 100" stroke="#94A3B8" strokeWidth="2" fill="none" />
            <line x1="150" y1="110" x2="350" y2="80" stroke="#EF4444" strokeWidth="2" strokeDasharray="3 3" />
            <circle cx="150" cy="110" r="4" fill="#EF4444" />
            <circle cx="350" cy="80" r="4" fill="#EF4444" />
            <text x="210" y="85" fill="#EF4444" fontSize="10" fontFamily="sans-serif" fontWeight="bold">Higher High in Price</text>
            <text x="25" y="210" fill="#E2E8F0" fontSize="11" fontFamily="sans-serif" fontWeight="bold">RSI Oscillator (14)</text>
            <line x1="50" y1="250" x2="550" y2="250" stroke="#1E293B" strokeDasharray="4 4" />
            <text x="560" y="253" fill="#94A3B8" fontSize="8" fontFamily="sans-serif">70</text>
            <line x1="50" y1="310" x2="550" y2="310" stroke="#1E293B" strokeDasharray="4 4" />
            <text x="560" y="313" fill="#94A3B8" fontSize="8" fontFamily="sans-serif">30</text>
            <path d="M 50 280 L 150 240 L 250 290 L 350 265 L 450 300" stroke="#A855F7" strokeWidth="2" fill="none" />
            <line x1="150" y1="240" x2="350" y2="265" stroke="#EF4444" strokeWidth="2" strokeDasharray="3 3" />
            <circle cx="150" cy="240" r="4" fill="#EF4444" />
            <circle cx="350" cy="265" r="4" fill="#EF4444" />
            <text x="210" y="252" fill="#EF4444" fontSize="10" fontFamily="sans-serif" fontWeight="bold">Lower High in RSI</text>
            <path d="M 370 80 Q 420 120 480 160" stroke="#EF4444" strokeWidth="2" fill="none" markerEnd="url(#arrow)" />
            <text x="475" y="150" fill="#EF4444" fontSize="10" fontFamily="sans-serif" fontWeight="bold">Bearish Reversal</text>
            <defs>
              <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 0 L 10 5 L 0 10 z" fill="#EF4444" />
              </marker>
            </defs>
          </svg>
          <div className="text-center text-[9px] text-slate-400 mt-2 font-mono uppercase">
            Figure 2: Bearish RSI Divergence indicates fading upward momentum.
          </div>
        </div>
      )}

      {type === "liquidity" && (
        <div className="w-full">
          <svg className="w-full h-auto bg-slate-900 rounded-none" viewBox="0 0 600 300" fill="none">
            <line x1="50" y1="180" x2="550" y2="180" stroke="#00C2FF" strokeWidth="2" />
            <text x="440" y="172" fill="#00C2FF" fontSize="10" fontFamily="sans-serif" fontWeight="bold">Retail Support Level</text>
            <line x1="100" y1="100" x2="100" y2="180" stroke="#EF4444" strokeWidth="1.5" />
            <rect x="95" y="110" width="10" height="60" fill="#EF4444" />
            <line x1="150" y1="140" x2="150" y2="200" stroke="#10B981" strokeWidth="1.5" />
            <rect x="145" y="150" width="10" height="30" fill="#10B981" />
            <line x1="200" y1="150" x2="200" y2="185" stroke="#EF4444" strokeWidth="1.5" />
            <rect x="195" y="160" width="10" height="20" fill="#EF4444" />
            <line x1="250" y1="160" x2="250" y2="260" stroke="#EF4444" strokeWidth="2" />
            <rect x="245" y="175" width="10" height="40" fill="#EF4444" />
            <rect x="220" y="195" width="220" height="45" rx="0" fill="#EF4444" fillOpacity="0.08" stroke="#EF4444" strokeWidth="1.5" strokeDasharray="3 3" />
            <text x="230" y="212" fill="#EF4444" fontSize="10" fontFamily="sans-serif" fontWeight="bold">Retail Stop-Loss Cluster</text>
            <text x="230" y="228" fill="#EF4444" fontSize="8" fontFamily="sans-serif">Massive Sell-Stops Triggered Here</text>
            <line x1="300" y1="180" x2="300" y2="220" stroke="#10B981" strokeWidth="1.5" />
            <rect x="295" y="180" width="10" height="30" fill="#10B981" />
            <line x1="350" y1="110" x2="350" y2="175" stroke="#10B981" strokeWidth="1.5" />
            <rect x="345" y="115" width="10" height="55" fill="#10B981" />
            <line x1="400" y1="70" x2="400" y2="130" stroke="#10B981" strokeWidth="1.5" />
            <rect x="395" y="75" width="10" height="50" fill="#10B981" />
            <path d="M 260 250 C 280 260, 310 210, 340 130" stroke="#10B981" strokeWidth="2" strokeDasharray="4 4" markerEnd="url(#arrow-green)" />
            <text x="350" y="100" fill="#10B981" fontSize="11" fontFamily="sans-serif" fontWeight="bold">Liquidity Sweep Reversal</text>
            <defs>
              <marker id="arrow-green" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 0 L 10 5 L 0 10 z" fill="#10B981" />
              </marker>
            </defs>
          </svg>
          <div className="text-center text-[9px] text-slate-400 mt-2 font-mono uppercase">
            Figure 3: Support levels cleared of stop-loss orders prior to upward reversal.
          </div>
        </div>
      )}

      {type === "leverage" && (
        <div className="w-full">
          <svg className="w-full h-auto bg-slate-900 rounded-none" viewBox="0 0 600 300" fill="none">
            <text x="25" y="30" fill="#E2E8F0" fontSize="11" fontFamily="sans-serif" fontWeight="bold">Time to Liquidation vs Leverage (100-pip move against position)</text>
            <line x1="80" y1="50" x2="80" y2="250" stroke="#94A3B8" strokeWidth="2" />
            <line x1="80" y1="250" x2="550" y2="250" stroke="#94A3B8" strokeWidth="2" />
            <text x="50" y="55" fill="#94A3B8" fontSize="8" fontFamily="sans-serif">100%</text>
            <text x="50" y="150" fill="#94A3B8" fontSize="8" fontFamily="sans-serif">50%</text>
            <text x="50" y="245" fill="#94A3B8" fontSize="8" fontFamily="sans-serif">0%</text>
            <text x="25" y="150" fill="#94A3B8" fontSize="8" fontFamily="sans-serif" transform="rotate(-90 25 150)" textAnchor="middle">Drawdown %</text>
            <rect x="120" y="248" width="40" height="2" fill="#10B981" />
            <text x="140" y="265" fill="#E2E8F0" fontSize="9" fontFamily="sans-serif" textAnchor="middle">1x Leverage</text>
            <text x="140" y="240" fill="#10B981" fontSize="9" fontFamily="sans-serif" textAnchor="middle" fontWeight="bold">1% Drawdown</text>
            <rect x="220" y="240" width="40" height="10" fill="#F59E0B" />
            <text x="240" y="265" fill="#E2E8F0" fontSize="9" fontFamily="sans-serif" textAnchor="middle">5x Leverage</text>
            <text x="240" y="232" fill="#F59E0B" fontSize="9" fontFamily="sans-serif" textAnchor="middle" fontWeight="bold">5% Drawdown</text>
            <rect x="320" y="210" width="40" height="40" fill="#EF4444" />
            <text x="340" y="265" fill="#E2E8F0" fontSize="9" fontFamily="sans-serif" textAnchor="middle">20x Leverage</text>
            <text x="340" y="202" fill="#EF4444" fontSize="9" fontFamily="sans-serif" textAnchor="middle" fontWeight="bold">20% Drawdown</text>
            <rect x="420" y="50" width="40" height="200" fill="#EF4444" />
            <text x="440" y="265" fill="#E2E8F0" fontSize="9" fontFamily="sans-serif" textAnchor="middle">100x Leverage</text>
            <text x="440" y="42" fill="#EF4444" fontSize="9" fontFamily="sans-serif" textAnchor="middle" fontWeight="bold">LIQUIDATED</text>
            <rect x="280" y="60" width="120" height="50" rx="0" fill="#EF4444" fillOpacity="0.1" stroke="#EF4444" strokeWidth="1" />
            <text x="288" y="78" fill="#EF4444" fontSize="9" fontFamily="sans-serif" fontWeight="bold">100 pips sweeps</text>
            <text x="288" y="93" fill="#EF4444" fontSize="8" fontFamily="sans-serif">100% of capital at 100x</text>
          </svg>
          <div className="text-center text-[9px] text-slate-400 mt-2 font-mono uppercase">
            Figure 4: Drawdown curves illustrating the severe impact of leverage on portfolio survivability.
          </div>
        </div>
      )}
    </div>
  );
}

interface BlogTableProps {
  headers: string;
  rows: string;
}

export function BlogTable({ headers, rows }: BlogTableProps) {
  if (!headers || !rows) return null;

  const headersArray = headers.split("|").map((h) => h.trim());
  const rowsArray = rows.split(";").map((rowStr) => 
    rowStr.split("|").map((cell) => cell.trim())
  );

  return (
    <div className="my-10 overflow-x-auto border border-[#E5E5E5] rounded-none bg-white">
      <table className="w-full text-left border-collapse font-sans text-xs sm:text-sm">
        <thead>
          <tr className="bg-slate-50 border-b border-[#E5E5E5]">
            {headersArray.map((h, i) => (
              <th key={i} className="p-4 font-bold text-[9px] uppercase tracking-widest text-slate-500 font-mono">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-[#E5E5E5]">
          {rowsArray.map((row, ri) => {
            if (!row || row.length === 0 || (row.length === 1 && row[0] === "")) return null;
            return (
              <tr key={ri} className="hover:bg-slate-50/50 transition-colors">
                {row.map((cell, ci) => {
                  const isBold = cell.startsWith("**") && cell.endsWith("**");
                  const cellText = isBold ? cell.slice(2, -2) : cell;
                  return (
                    <td key={ci} className="p-4 text-slate-700 font-mono text-[10px]">
                      {isBold ? (
                        <strong className="text-slate-900 font-bold">{cellText}</strong>
                      ) : (
                        cellText
                      )}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

interface KeyTakeawaysProps {
  items: string;
}

export function KeyTakeaways({ items }: KeyTakeawaysProps) {
  if (!items) return null;
  const itemsArray = items.split("|").map((item) => item.trim());

  return (
    <div className="my-10 p-8 bg-slate-50 border-l-4 border-accent rounded-none border-y border-r border-[#E5E5E5] shadow-sm">
      <h4 className="text-[10px] font-mono uppercase tracking-[0.2em] text-slate-800 font-bold mb-6 flex items-center gap-2">
        <Shield className="w-4 h-4 text-accent" />
        Key Takeaways
      </h4>
      <ul className="space-y-4">
        {itemsArray.map((item, i) => {
          if (!item) return null;
          return (
            <li key={i} className="flex gap-3 text-xs sm:text-sm text-slate-700 leading-relaxed font-sans">
              <span className="w-1.5 h-1.5 rounded-none bg-accent shrink-0 mt-2" />
              <span>{item}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

import { cn } from "@/lib/utils";

interface NewsSourceLogoProps {
  source: string;
  className?: string;
  showText?: boolean;
  size?: "xs" | "sm" | "md";
}

const logoMap: Record<string, { domain: string; color?: string }> = {
  "Bloomberg": { domain: "bloomberg.com", color: "#2800D8" },
  "Reuters": { domain: "reuters.com", color: "#FF8000" },
  "Financial Times": { domain: "ft.com", color: "#FCD0B1" },
  "FT": { domain: "ft.com", color: "#FCD0B1" },
  "BBC Business": { domain: "bbc.co.uk", color: "#BB1919" },
  "BBC": { domain: "bbc.co.uk", color: "#BB1919" },
  "CNBC Markets": { domain: "cnbc.com", color: "#005596" },
  "CNBC": { domain: "cnbc.com", color: "#005596" },
  "ForexLive": { domain: "forexlive.com", color: "#00C2FF" },
  "Investing.com": { domain: "investing.com", color: "#2B2B2B" },
  "Sky News Business": { domain: "sky.com", color: "#CC0000" },
  "Sky News": { domain: "sky.com", color: "#CC0000" },
  "Sky": { domain: "sky.com", color: "#CC0000" },
  "WSJ Markets": { domain: "wsj.com", color: "#000000" },
  "WSJ": { domain: "wsj.com", color: "#000000" },
  "MarketWatch": { domain: "marketwatch.com", color: "#3B2E2A" },
  "Yahoo Finance": { domain: "yahoo.com", color: "#720099" },
  "CNN": { domain: "cnn.com", color: "#CC0000" },
  "CNN Business": { domain: "cnn.com", color: "#CC0000" },
  "Benzinga": { domain: "benzinga.com", color: "#FF9100" },
};

export function NewsSourceLogo({ source, className, showText = true, size = "sm" }: NewsSourceLogoProps) {
  const mapping = logoMap[source] || Object.entries(logoMap).find(([key]) => source.toLowerCase().includes(key.toLowerCase()))?.[1];

  const sizeClasses = {
    xs: "h-3 w-3",
    sm: "h-4 w-4",
    md: "h-6 w-6",
  };

  if (!mapping) {
    return (
      <span className={cn("text-[9px] font-mono font-bold uppercase tracking-widest text-accent", className)}>
        {source}
      </span>
    );
  }

  return (
    <div className={cn("inline-flex items-center gap-2", className)}>
      <div className={cn("relative flex-shrink-0 bg-white rounded-sm overflow-hidden", sizeClasses[size])}>
        <img 
          src={`https://logo.clearbit.com/${mapping.domain}`}
          alt={source}
          className="w-full h-full object-contain p-0.5"
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = 'none';
          }}
        />
      </div>
      {showText && (
        <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-text-primary">
          {source}
        </span>
      )}
    </div>
  );
}

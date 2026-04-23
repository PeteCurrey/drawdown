import { cn } from "@/lib/utils";

interface NewsSourceLogoProps {
  source: string;
  className?: string;
  showText?: boolean;
  size?: "xs" | "sm" | "md" | "lg";
  monochrome?: boolean;
}

const logoMap: Record<string, { domain: string; color?: string; customUrl?: string }> = {
  "Bloomberg": { domain: "bloomberg.com", color: "#2800D8", customUrl: "https://upload.wikimedia.org/wikipedia/commons/5/5f/Bloomberg_Logo.svg" },
  "Reuters": { domain: "reuters.com", color: "#FF8000", customUrl: "https://upload.wikimedia.org/wikipedia/commons/f/fa/Reuters_logo.svg" },
  "Financial Times": { domain: "ft.com", color: "#FCD0B1", customUrl: "https://upload.wikimedia.org/wikipedia/commons/3/36/Financial_Times_logo_2014.svg" },
  "FT": { domain: "ft.com", color: "#FCD0B1", customUrl: "https://upload.wikimedia.org/wikipedia/commons/3/36/Financial_Times_logo_2014.svg" },
  "CNBC Markets": { domain: "cnbc.com", color: "#005596", customUrl: "https://upload.wikimedia.org/wikipedia/commons/e/e3/CNBC_logo.svg" },
  "CNBC": { domain: "cnbc.com", color: "#005596", customUrl: "https://upload.wikimedia.org/wikipedia/commons/e/e3/CNBC_logo.svg" },
  "WSJ Markets": { domain: "wsj.com", color: "#000000", customUrl: "https://upload.wikimedia.org/wikipedia/commons/4/4a/WSJ_Logo.svg" },
  "WSJ": { domain: "wsj.com", color: "#000000", customUrl: "https://upload.wikimedia.org/wikipedia/commons/4/4a/WSJ_Logo.svg" },
  "MarketWatch": { domain: "marketwatch.com", color: "#3B2E2A", customUrl: "https://upload.wikimedia.org/wikipedia/commons/2/22/MarketWatch_logo.svg" },
  "Yahoo Finance": { domain: "yahoo.com", color: "#720099", customUrl: "https://upload.wikimedia.org/wikipedia/commons/8/8f/Yahoo%21_Finance_logo_2019.svg" },
  "Investing.com": { domain: "investing.com", color: "#2B2B2B", customUrl: "https://upload.wikimedia.org/wikipedia/commons/4/46/Investing.com_logo.svg" },
};

export function NewsSourceLogo({ 
  source, 
  className, 
  showText = true, 
  size = "sm",
  monochrome = false
}: NewsSourceLogoProps) {
  const mapping = logoMap[source] || Object.entries(logoMap).find(([key]) => source.toLowerCase().includes(key.toLowerCase()))?.[1];

  const sizeClasses = {
    xs: "h-3 w-3",
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-8 w-8",
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
      <div className={cn(
        "relative flex-shrink-0 overflow-hidden flex items-center justify-center", 
        sizeClasses[size]
      )}>
        <img 
          src={mapping.customUrl || `https://unavatar.io/${mapping.domain}?fallback=https://www.google.com/s2/favicons?domain=${mapping.domain}&sz=128`}
          alt={source}
          className={cn(
            "w-full h-full object-contain transition-all duration-500",
            monochrome ? "grayscale opacity-50 hover:opacity-100 dark:invert" : "opacity-100"
          )}
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.style.display = 'none';
            const parent = target.parentElement;
            if (parent && !parent.querySelector('.fallback-text')) {
              const fallback = document.createElement('span');
              fallback.innerText = source.charAt(0);
              fallback.className = 'fallback-text text-[10px] font-mono font-bold text-accent';
              parent.appendChild(fallback);
            }
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

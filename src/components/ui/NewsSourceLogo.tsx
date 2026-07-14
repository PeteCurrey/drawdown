import { cn } from "@/lib/utils";

interface NewsSourceLogoProps {
  source: string;
  className?: string;
  showText?: boolean;
  size?: "xs" | "sm" | "md" | "lg";
  monochrome?: boolean;
}

const logoMap: Record<string, { domain: string; color?: string; customUrl?: string }> = {
  "BBC Business": { domain: "bbc.co.uk", color: "#BB1919" },
  "BBC": { domain: "bbc.co.uk", color: "#BB1919" },
  "Yahoo Finance": { domain: "yahoo.com", color: "#720099" },
  "Investing.com": { domain: "investing.com", color: "#2B2B2B" },
  "ForexLive": { domain: "forexlive.com", color: "#007a99" },
  "Sky News Business": { domain: "sky.com", color: "#CC0000" },
  "CNN Business": { domain: "cnn.com", color: "#CC0000" },
  "Fox Business": { domain: "foxbusiness.com", color: "#003380" },
  "Forbes": { domain: "forbes.com", color: "#333300" },
  "CoinDesk": { domain: "coindesk.com", color: "#0052cc" },
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

  if (!mapping || !mapping.customUrl) {
    return (
      <span className={cn(
        "text-[10px] font-mono font-bold uppercase tracking-widest", 
        monochrome ? "text-mkt-i2" : "text-accent", 
        className
      )}>
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
          src={mapping.customUrl}
          alt={source}
          className={cn(
            "w-full h-full object-contain transition-all duration-500",
            monochrome ? "grayscale opacity-50 hover:opacity-100 dark:invert" : "opacity-100"
          )}
        />
      </div>
      {showText && (
        <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-mkt-ink">
          {source}
        </span>
      )}
    </div>
  );
}

import { Sparkline } from "./Sparkline";

interface MarketItem {
  symbol: string;
  name: string;
  price: string;
  change: string;
  changePercent: string;
  sparkline?: number[];
}

export function DashboardStatusBar() {
  const [data, setData] = useState<MarketItem[]>([]);
  const [session, setSession] = useState<{ name: string; open: boolean }>({ name: "London", open: true });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/market/prices");
        const json = await res.json();
        if (Array.isArray(json)) {
          // Add random sparkline data for UI demo
          const augmented = json.map(item => ({
            ...item,
            sparkline: Array.from({ length: 15 }, () => Math.random() * 100)
          }));
          setData(augmented);
        }
      } catch (err) {
        console.error("Dashboard status fetch error:", err);
      }
    };
// ... rest of useEffect

    const updateSession = () => {
      const gmtHour = new Date().getUTCHours();
      if (gmtHour >= 8 && gmtHour < 16) setSession({ name: "London Session", open: true });
      else if (gmtHour >= 13 && gmtHour < 21) setSession({ name: "New York Session", open: true });
      else if (gmtHour >= 22 || gmtHour < 7) setSession({ name: "Tokyo Session", open: true });
      else setSession({ name: "Market Closed", open: false });
    };

    fetchData();
    updateSession();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center gap-6 px-4 py-3 bg-background-elevated border-b border-white/5 overflow-x-auto scrollbar-hide">
      {/* Session Indicator */}
      <div className="flex items-center gap-2 shrink-0 pr-6 border-r border-white/10">
        <div className={cn(
          "w-2 h-2 rounded-full",
          session.open ? "bg-profit animate-pulse" : "bg-text-tertiary"
        )} />
        <span className="text-[10px] font-mono uppercase tracking-widest text-text-primary">
          {session.name}
        </span>
      </div>

      {/* Instruments */}
      <div className="flex items-center gap-8">
        {data.map((item) => (
          <div key={item.symbol} className="flex items-center gap-4 shrink-0">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <span className="text-[9px] font-mono uppercase text-text-tertiary">{item.name}</span>
                <span className={cn(
                  "text-[9px] font-mono font-bold",
                  parseFloat(item.changePercent) >= 0 ? "text-profit" : "text-loss"
                )}>
                  {parseFloat(item.changePercent) >= 0 ? "▲" : "▼"}
                  {Math.abs(parseFloat(item.changePercent))}%
                </span>
              </div>
              <span className="text-xs font-mono font-bold text-text-primary leading-none">
                {item.price}
              </span>
            </div>
            {item.sparkline && (
              <Sparkline 
                data={item.sparkline} 
                color={parseFloat(item.changePercent) >= 0 ? "#00E676" : "#FF3D57"} 
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

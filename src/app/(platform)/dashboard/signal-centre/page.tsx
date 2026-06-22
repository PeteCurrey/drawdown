import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Lock } from "lucide-react";
import Link from "next/link";
import { DotProgressBar } from "@/components/dashboard/DotProgressBar";

const TIER_WEIGHT: Record<string, number> = {
  free:       0,
  foundation: 1,
  edge:       2,
  floor:      3,
};

export default async function SignalCentrePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("subscription_tier")
    .eq("id", user.id)
    .single();

  const tier = (profile as any)?.subscription_tier as string | undefined;
  const userWeight = TIER_WEIGHT[tier ?? "free"] ?? 0;

  // Signal rows for demo states spanning FOREX and CRYPTO
  const signalRows = [
    { asset: "GBP/USD", tf: "4H", bias: "BULLISH", score: 8, rsi: "58.4", rsiCol: "text-white", ema: "ABOVE", emaCol: "text-[#18B880]" },
    { asset: "EUR/USD", tf: "4H", bias: "BULLISH", score: 6, rsi: "51.2", rsiCol: "text-white", ema: "ABOVE", emaCol: "text-[#18B880]" },
    { asset: "USD/JPY", tf: "4H", bias: "BEARISH", score: 9, rsi: "24.5", rsiCol: "text-[#18B880]", ema: "BELOW", emaCol: "text-[#CE6969]" },
    { asset: "EUR/GBP", tf: "1H", bias: "NEUTRAL", score: 4, rsi: "44.9", rsiCol: "text-white", ema: "CROSSING", emaCol: "text-[#F9771D]" },
    { asset: "XAU/USD", tf: "4H", bias: "BULLISH", score: 8, rsi: "76.8", rsiCol: "text-[#CE6969]", ema: "ABOVE", emaCol: "text-[#18B880]" },
    { asset: "BTC/USD", tf: "1D", bias: "BULLISH", score: 9, rsi: "75.2", rsiCol: "text-[#CE6969]", ema: "ABOVE", emaCol: "text-[#18B880]" },
    { asset: "ETH/USD", tf: "4H", bias: "BULLISH", score: 7, rsi: "62.0", rsiCol: "text-white", ema: "ABOVE", emaCol: "text-[#18B880]" },
    { asset: "US30", tf: "1H", bias: "BEARISH", score: 7, rsi: "32.1", rsiCol: "text-white", ema: "BELOW", emaCol: "text-[#CE6969]" },
  ];

  return (
    <div className="space-y-0 -m-6 md:-m-10">
      {/* Dark hero panel layout */}
      <section className="bg-[#181818] text-white p-6 md:p-10 pb-12 space-y-6 border-b border-[#333330]">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight">Signal Centre</h1>
            <div className="flex items-center gap-1.5 px-2 py-0.5 bg-[#F9771D] text-white text-[9px] font-mono font-bold uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-[#18B880] animate-pulse shrink-0" />
              Live Edge+
            </div>
          </div>
          <p className="text-sm text-[#8A8A85] max-w-xl">
            Real-time confluence signals across 40+ instruments, generated from multi-timeframe analysis.
          </p>
        </div>

        {/* Filter row */}
        <div className="flex flex-wrap gap-2 pt-2 border-b border-[#333330] pb-4">
          {["ALL", "FOREX", "INDICES", "COMMODITIES", "CRYPTO"].map((cat, i) => (
            <button 
              key={i} 
              className={`px-4 py-1.5 text-[10px] font-bold uppercase font-mono tracking-wider rounded-none ${
                i === 0 ? "bg-[#F9771D] text-white" : "bg-[#232323] hover:bg-[#2A2A2A] text-[#8A8A85] hover:text-white"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Signal table */}
        <div className="overflow-x-auto select-text pt-4">
          <table className="w-full text-left min-w-[700px]">
            <thead>
              <tr className="border-b border-[#333330] text-[10px] font-mono text-[#8A8A85] uppercase tracking-wider">
                <th className="pb-3">Instrument</th>
                <th className="pb-3">Timeframe</th>
                <th className="pb-3">Bias</th>
                <th className="pb-3 w-40">Confluence</th>
                <th className="pb-3">RSI</th>
                <th className="pb-3">EMA Status</th>
                <th className="pb-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#333330]">
              {signalRows.map((row, i) => (
                <tr key={i} className="hover:bg-[#232323]/50 transition-colors text-xs font-mono">
                  <td className="py-4 font-bold text-white font-sans">{row.asset}</td>
                  <td className="py-4">
                    <span className="px-2 py-0.5 bg-[#2A2A2A] text-[#8A8A85] text-[9px]">{row.tf}</span>
                  </td>
                  <td className="py-4">
                    {row.bias === "BULLISH" && <span className="text-[#18B880] font-bold">BULLISH</span>}
                    {row.bias === "BEARISH" && <span className="text-[#CE6969] font-bold">BEARISH</span>}
                    {row.bias === "NEUTRAL" && <span className="text-[#8A8A85] font-bold">NEUTRAL</span>}
                  </td>
                  <td className="py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex-1">
                        <DotProgressBar percentage={row.score * 10} color="bg-[#F9771D]" />
                      </div>
                      <span className="text-[#8A8A85]">{row.score}/10</span>
                    </div>
                  </td>
                  <td className={`py-4 ${row.rsiCol}`}>{row.rsi}</td>
                  <td className={`py-4 font-bold ${row.emaCol}`}>{row.ema}</td>
                  <td className="py-4 text-right">
                    <Link href="/dashboard/market-intelligence" className="text-[#F9771D] hover:underline font-sans text-xs">
                      Analyse →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Upgrade Prompt overlay for non-Edge users */}
        {userWeight < 2 && (
          <div className="relative border border-dashed border-[#F9771D]/40 p-8 flex flex-col md:flex-row items-center justify-between gap-6 bg-[#232323] mt-8">
            <div className="space-y-1.5">
              <h4 className="text-base font-bold text-white flex items-center gap-2">
                Unlock 40+ Confluence Signals
              </h4>
              <p className="text-xs text-[#8A8A85] leading-relaxed max-w-xl">
                Get real-time alerts across indices, cryptos, and forex majors with full sessional alignment parameters.
              </p>
            </div>
            <div className="flex items-center gap-4 shrink-0">
              <span className="text-xs font-mono text-[#8A8A85]">From £149/mo</span>
              <Link 
                href="/pricing" 
                className="px-6 py-3 bg-[#F9771D] hover:bg-[#e0600d] text-white text-[10px] font-bold uppercase tracking-widest transition-colors rounded-[4px]"
              >
                Upgrade to Edge+
              </Link>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

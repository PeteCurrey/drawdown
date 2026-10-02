import { TrendingUp, AlertTriangle } from "lucide-react";
import { LobbyEmptyState } from "./LobbyEmptyState";
import type { LobbyTradeFeatureData } from "@/types/lobby";

interface LobbyTradeOfTheMonthProps {
  trade?: LobbyTradeFeatureData | null;
}

export function LobbyTradeOfTheMonth({ trade }: LobbyTradeOfTheMonthProps) {
  return (
    <section id="trades" className="w-full py-10 border-b border-[#DEDDD8] bg-[#FAF9F5]">
      <div className="max-w-[1320px] mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="flex items-center justify-between pb-3 mb-6 border-b border-[#DEDDD8]">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-[#16213E]" />
            <h2 className="text-xs font-mono font-bold uppercase tracking-[0.16em] text-[#0B0E12]">
              TRADE OF THE MONTH // POST-TRADE EXECUTION AUDIT
            </h2>
          </div>
          <span className="text-[10px] font-mono text-[#4B5157] tracking-wider uppercase">
            HISTORICAL CASE STUDY
          </span>
        </div>

        {!trade ? (
          <LobbyEmptyState
            title="NO HISTORICAL AUDIT RELEASED FOR THIS CYCLE"
            description="Drawdown publishes rigorous post-trade case studies dissecting invalidation geometry, institutional order flow, and risk/reward management. Previous cases remain archived in the Research Centre."
            badge="EXECUTION AUDIT STANDBY"
            statusLabel="POST-TRADE VERIFICATION BENCHMARK"
            scanTime="WEEKLY AUDIT CYCLE"
          />
        ) : (
          <div className="border border-[#DEDDD8] bg-[#FFFFFF] p-6 sm:p-10 rounded-[2px]">
            {/* Mandatory Regulatory Disclaimer Banner */}
            <div className="flex items-start gap-2.5 p-3.5 bg-amber-50/70 border border-amber-200/80 rounded-[2px] mb-6 text-xs text-amber-950">
              <AlertTriangle className="w-4 h-4 text-amber-800 shrink-0 mt-0.5" />
              <p className="font-sans leading-relaxed">
                <strong className="font-semibold">HISTORICAL EDUCATIONAL CASE STUDY ONLY:</strong> This retrospective analysis examines risk geometry and historical execution mechanics. Past performance is no guarantee of future results and does NOT constitute financial advice, trade signals, or recommendations.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-8">
                <div className="flex items-center gap-3 text-xs font-mono mb-2">
                  <span className="px-2 py-0.5 bg-[#16213E] text-[#FFFFFF] font-bold rounded-[2px]">
                    {trade.instrument}
                  </span>
                  <span className="text-[#4B5157]">Timeframe: {trade.timeframe}</span>
                  <span className="text-[#DEDDD8]">•</span>
                  <span className="text-emerald-700 font-semibold">{trade.outcome}</span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-display font-bold text-[#0B0E12] leading-tight">
                  {trade.setup}
                </h3>

                <p className="mt-4 text-sm sm:text-base text-[#4B5157] font-sans leading-relaxed">
                  {trade.explanation}
                </p>
              </div>

              {/* Execution Geometry Parameter Strip */}
              <div className="lg:col-span-4 bg-[#FAF9F5] border border-[#DEDDD8] p-5 rounded-[2px] flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[#4B5157] block mb-3 font-semibold">
                    TRADE GEOMETRY
                  </span>

                  <dl className="space-y-2.5 text-xs font-mono">
                    <div className="flex items-center justify-between pb-1.5 border-b border-[#DEDDD8]">
                      <dt className="text-[#4B5157]">Entry Price:</dt>
                      <dd className="font-bold text-[#0B0E12]">{trade.entry}</dd>
                    </div>
                    <div className="flex items-center justify-between pb-1.5 border-b border-[#DEDDD8]">
                      <dt className="text-[#4B5157]">Invalidation (Stop):</dt>
                      <dd className="font-bold text-rose-700">{trade.stop}</dd>
                    </div>
                    <div className="flex items-center justify-between pb-1.5 border-b border-[#DEDDD8]">
                      <dt className="text-[#4B5157]">Target (Take Profit):</dt>
                      <dd className="font-bold text-emerald-700">{trade.target}</dd>
                    </div>
                    <div className="flex items-center justify-between pb-1.5 border-b border-[#DEDDD8]">
                      <dt className="text-[#4B5157]">Realised R:R:</dt>
                      <dd className="font-bold text-[#16213E]">{trade.risk_reward}</dd>
                    </div>
                  </dl>
                </div>

                <div className="mt-4 pt-3 border-t border-[#DEDDD8] text-[10px] font-mono text-[#4B5157]">
                  Audited by Drawdown Trading Desk
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

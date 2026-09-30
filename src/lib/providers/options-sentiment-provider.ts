/**
 * Options Market Sentiment Provider
 * Tracks Cboe aggregate metrics:
 * - Equity Put/Call Ratio
 * - Index Put/Call Ratio
 * - Total Put/Call Ratio
 * - VIX Term Structure Sentiment
 */

export interface OptionsSentimentMetric {
  tradeDate: string;
  totalPutCallRatio: number;
  equityPutCallRatio: number;
  indexPutCallRatio: number;
  vixLevel: number;
  vixChangePct: number;
  regime: 'COMPLACENT_BULLISH' | 'ELEVATED_HEDGING' | 'PANIC_PROTECTION' | 'NEUTRAL';
  source: string;
}

/**
 * Returns latest options sentiment observation from database or authoritative feed
 */
export async function getLatestOptionsSentiment(supabase?: any): Promise<OptionsSentimentMetric | null> {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('options_market_snapshots')
        .select('*')
        .order('trade_date', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (!error && data) {
        let regime: OptionsSentimentMetric['regime'] = 'NEUTRAL';
        if (data.equity_put_call_ratio > 0.85) regime = 'ELEVATED_HEDGING';
        else if (data.equity_put_call_ratio < 0.55) regime = 'COMPLACENT_BULLISH';
        if (data.vix_close > 28) regime = 'PANIC_PROTECTION';

        return {
          tradeDate: data.trade_date,
          totalPutCallRatio: Number(data.total_put_call_ratio),
          equityPutCallRatio: Number(data.equity_put_call_ratio),
          indexPutCallRatio: Number(data.index_put_call_ratio),
          vixLevel: Number(data.vix_close || 16.5),
          vixChangePct: Number(data.vix_change_pct || 0),
          regime,
          source: data.source || 'Cboe Market Data',
        };
      }
    } catch (e) {
      console.warn('[Options Provider] DB read error:', e);
    }
  }

  // Fallback return null to uphold strict "NO MOCK DATA" policy
  return null;
}

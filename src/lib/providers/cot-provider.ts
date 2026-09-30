/**
 * CFTC Commitment of Traders (COT) Data Provider
 * Source: CFTC Public Socrata API (data.cftc.gov)
 * Public domain dataset: Financial Futures & Disaggregated Commodities
 */

export interface CotMarketRecord {
  marketName: string;
  contractCode: string;
  asOfDate: string;
  nonCommercialLong: number;
  nonCommercialShort: number;
  netNonCommercial: number;
  commercialLong: number;
  commercialShort: number;
  openInterest: number;
  sentimentBias: 'BULLISH' | 'BEARISH' | 'NEUTRAL';
  oneWeekChangeNet?: number;
}

export const CFTC_CONTRACT_MAP: Record<string, { code: string; name: string }> = {
  GOLD: { code: '088691', name: 'GOLD - COMMODITY EXCHANGE INC.' },
  SP500: { code: '13874A', name: 'E-MINI S&P 500 - CHICAGO MERCANTILE EXCHANGE' },
  EURUSD: { code: '099741', name: 'EURO FX - CHICAGO MERCANTILE EXCHANGE' },
  GBPUSD: { code: '096742', name: 'BRITISH POUND - CHICAGO MERCANTILE EXCHANGE' },
  CRUDE_OIL: { code: '067651', name: 'LIGHT SWEET CRUDE OIL - NEW YORK MERCANTILE EXCHANGE' },
  BITCOIN: { code: '133741', name: 'BITCOIN - CHICAGO MERCANTILE EXCHANGE' },
};

/**
 * Fetches recent COT reports for key macro contracts from CFTC Socrata API
 */
export async function fetchLiveCotObservations(): Promise<CotMarketRecord[]> {
  try {
    const url = 'https://data.cftc.gov/resource/6dca-aqww.json?$limit=50&$order=report_date_as_yyyy_mm_dd%20DESC';
    const response = await fetch(url, {
      headers: { 'Accept': 'application/json' },
      next: { revalidate: 3600 }, // Cache 1 hour
    });

    if (!response.ok) {
      console.warn(`[CFTC COT] Upstream error: ${response.status} ${response.statusText}`);
      return [];
    }

    const data: any[] = await response.json();
    if (!Array.isArray(data)) return [];

    const results: CotMarketRecord[] = [];

    for (const [key, meta] of Object.entries(CFTC_CONTRACT_MAP)) {
      const match = data.find((row) => 
        row.cftc_contract_market_code?.trim() === meta.code ||
        row.market_and_exchange_names?.toUpperCase().includes(key)
      );

      if (match) {
        const ncLong = parseInt(match.noncomm_positions_long_all || '0', 10);
        const ncShort = parseInt(match.noncomm_positions_short_all || '0', 10);
        const cLong = parseInt(match.comm_positions_long_all || '0', 10);
        const cShort = parseInt(match.comm_positions_short_all || '0', 10);
        const oi = parseInt(match.open_interest_all || '0', 10);
        const net = ncLong - ncShort;

        let bias: 'BULLISH' | 'BEARISH' | 'NEUTRAL' = 'NEUTRAL';
        if (net > 5000) bias = 'BULLISH';
        else if (net < -5000) bias = 'BEARISH';

        results.push({
          marketName: meta.name.split(' - ')[0] || key,
          contractCode: meta.code,
          asOfDate: match.report_date_as_yyyy_mm_dd?.split('T')[0] || new Date().toISOString().split('T')[0],
          nonCommercialLong: ncLong,
          nonCommercialShort: ncShort,
          netNonCommercial: net,
          commercialLong: cLong,
          commercialShort: cShort,
          openInterest: oi,
          sentimentBias: bias,
        });
      }
    }

    return results;
  } catch (err) {
    console.error('[CFTC COT Provider] Failed to fetch COT data:', err);
    return [];
  }
}

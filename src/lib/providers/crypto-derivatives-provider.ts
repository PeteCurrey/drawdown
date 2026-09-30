/**
 * Crypto Derivatives Data Provider
 * Fetches real, verifiable derivatives metrics from Binance Public USDT-M Futures API.
 * Metrics: Open Interest (USD), 8-Hour Funding Rate, Annualized Funding Rate, Sentiment Bias.
 */

export interface CryptoDerivativesMetric {
  symbol: string;           // e.g. BTCUSDT
  displayName: string;      // e.g. Bitcoin
  price: number;
  openInterestCoins: number;
  openInterestUsd: number;
  fundingRatePct: number;    // e.g. 0.0100%
  annualizedFundingPct: number;
  bias: 'OVERHEATED_LONGS' | 'SQUEEZE_SHORT' | 'NEUTRAL' | 'MODERATE_BULLISH';
  lastUpdated: string;
}

const TRACKED_SYMBOLS = [
  { symbol: 'BTCUSDT', name: 'Bitcoin' },
  { symbol: 'ETHUSDT', name: 'Ethereum' },
  { symbol: 'SOLUSDT', name: 'Solana' },
];

export async function fetchLiveCryptoDerivatives(): Promise<CryptoDerivativesMetric[]> {
  const metrics: CryptoDerivativesMetric[] = [];

  for (const item of TRACKED_SYMBOLS) {
    try {
      // 1. Fetch Open Interest
      const oiRes = await fetch(
        `https://fapi.binance.com/fapi/v1/openInterest?symbol=${item.symbol}`,
        { next: { revalidate: 60 } }
      );
      
      // 2. Fetch Premium Index / Current Funding Rate & Mark Price
      const fundingRes = await fetch(
        `https://fapi.binance.com/fapi/v1/premiumIndex?symbol=${item.symbol}`,
        { next: { revalidate: 60 } }
      );

      if (!oiRes.ok || !fundingRes.ok) {
        continue;
      }

      const oiData = await oiRes.json();
      const fundingData = await fundingRes.json();

      const markPrice = parseFloat(fundingData.markPrice || '0');
      const openInterestCoins = parseFloat(oiData.openInterest || '0');
      const openInterestUsd = markPrice * openInterestCoins;
      const lastFundingRate = parseFloat(fundingData.lastFundingRate || '0');
      const fundingRatePct = lastFundingRate * 100;
      // 3 funding intervals per day * 365 = 1095 intervals/year
      const annualizedFundingPct = fundingRatePct * 3 * 365;

      let bias: CryptoDerivativesMetric['bias'] = 'NEUTRAL';
      if (fundingRatePct > 0.03) {
        bias = 'OVERHEATED_LONGS';
      } else if (fundingRatePct < -0.01) {
        bias = 'SQUEEZE_SHORT';
      } else if (fundingRatePct > 0.005) {
        bias = 'MODERATE_BULLISH';
      }

      metrics.push({
        symbol: item.symbol,
        displayName: item.name,
        price: markPrice,
        openInterestCoins,
        openInterestUsd,
        fundingRatePct,
        annualizedFundingPct,
        bias,
        lastUpdated: new Date().toISOString(),
      });
    } catch (err) {
      console.error(`[Crypto Derivatives] Error fetching ${item.symbol}:`, err);
    }
  }

  return metrics;
}

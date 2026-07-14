import { InstrumentConfig, TIMEFRAME_MAP } from './instruments';

const TD_KEY = process.env.NEXT_PUBLIC_TWELVE_DATA_API_KEY || process.env.NEXT_PUBLIC_TWELVE_DATA_KEY || process.env.TWELVE_DATA_KEY || '';
const FH_KEY = process.env.NEXT_PUBLIC_FINNHUB_API_KEY || process.env.FINNHUB_API_KEY || '';
const TD_BASE = 'https://api.twelvedata.com';
const FH_BASE = 'https://finnhub.io/api/v1';

// ─── TYPES ────────────────────────────────────────────────────────────────────

export interface QuoteData {
  price: number;
  change: number;
  changePercent: number;
  high: number;
  low: number;
  volume: number;
  timestamp: number;
}

export interface IndicatorData {
  rsi: number | null;
  ema50: number | null;
  ema200: number | null;
  macdValue: number | null;
  macdSignal: number | null;
  macdHistogram: number | null;
  bbUpper: number | null;
  bbMiddle: number | null;
  bbLower: number | null;
  stochK: number | null;
  stochD: number | null;
  atr: number | null;
  cci: number | null;
  volumeAvg: number | null;
  currentVolume: number | null;
}

export interface KeyLevels {
  support: number | null;
  resistance: number | null;
  ema50: number | null;
  ema200: number | null;
  atr: number | null;
}

export interface NewsItem {
  id: string;
  headline: string;
  summary: string;
  source: string;
  url: string;
  datetime: number;
  category: string;
}

export interface EconomicEvent {
  id: string;
  event: string;
  country: string;
  currency: string;
  impact: 'high' | 'medium' | 'low';
  actual: string | null;
  estimate: string | null;
  prev: string | null;
  time: number; // unix timestamp
}

export interface BiasScore {
  score: number;           // 0–100
  direction: 'bullish' | 'bearish' | 'neutral';
  strength: 'strong' | 'moderate' | 'weak';
  label: string;           // "Strong Bullish" etc.
  conflictNodes: string[]; // which nodes are contradicting overall bias
  nodeSignals: Record<string, 'bullish' | 'bearish' | 'neutral'>;
  totalSignals: number;
  bullishSignals: number;
  bearishSignals: number;
}

// ─── QUOTE ───────────────────────────────────────────────────────────────────

export async function fetchQuote(instrument: InstrumentConfig): Promise<QuoteData | null> {
  if (!TD_KEY) {
    console.error('[marketDataService] TD_KEY is missing');
    return null;
  }
  const exchangeParam = instrument.category === 'crypto' ? '&exchange=Binance' : '';
  try {
    const res = await fetch(
      `${TD_BASE}/quote?symbol=${instrument.twelveDataSymbol}${exchangeParam}&apikey=${TD_KEY}`
    );
    const data = await res.json();
    if (data.status === 'error' || !data.close) return null;
    return {
      price: parseFloat(data.close),
      change: parseFloat(data.change || '0'),
      changePercent: parseFloat(data.percent_change || '0'),
      high: parseFloat(data.high || '0'),
      low: parseFloat(data.low || '0'),
      volume: parseInt(data.volume || '0'),
      timestamp: Date.now(),
    };
  } catch {
    return null;
  }
}

// ─── ALL INDICATORS IN ONE BATCHED CALL ──────────────────────────────────────

export async function fetchAllIndicators(
  instrument: InstrumentConfig,
  timeframe: string
): Promise<IndicatorData | null> {
  if (!TD_KEY) {
    console.error('[marketDataService] TD_KEY is missing');
    return null;
  }
  const tf = TIMEFRAME_MAP[timeframe] || '1h';
  const sym = instrument.twelveDataSymbol;
  const exchangeParam = instrument.category === 'crypto' ? '&exchange=Binance' : '';

  const endpoints = [
    `${TD_BASE}/rsi?symbol=${sym}&interval=${tf}&time_period=14${exchangeParam}&apikey=${TD_KEY}`,
    `${TD_BASE}/ema?symbol=${sym}&interval=${tf}&time_period=50${exchangeParam}&apikey=${TD_KEY}`,
    `${TD_BASE}/ema?symbol=${sym}&interval=${tf}&time_period=200${exchangeParam}&apikey=${TD_KEY}`,
    `${TD_BASE}/macd?symbol=${sym}&interval=${tf}${exchangeParam}&apikey=${TD_KEY}`,
    `${TD_BASE}/bbands?symbol=${sym}&interval=${tf}&time_period=20${exchangeParam}&apikey=${TD_KEY}`,
    `${TD_BASE}/stoch?symbol=${sym}&interval=${tf}${exchangeParam}&apikey=${TD_KEY}`,
    `${TD_BASE}/atr?symbol=${sym}&interval=${tf}&time_period=14${exchangeParam}&apikey=${TD_KEY}`,
    `${TD_BASE}/cci?symbol=${sym}&interval=${tf}&time_period=20${exchangeParam}&apikey=${TD_KEY}`,
    `${TD_BASE}/time_series?symbol=${sym}&interval=${tf}&outputsize=20${exchangeParam}&apikey=${TD_KEY}`,
  ];

  try {
    const results = await Promise.allSettled(
      endpoints.map(url => fetch(url).then(r => r.json()))
    );

    const getValue = (result: PromiseSettledResult<any>, path: string[]): number | null => {
      if (result.status !== 'fulfilled') return null;
      const data = result.value;
      if (data.status === 'error' || !data.values) return null;
      let val: any = data.values[0];
      for (const key of path) val = val?.[key];
      return val !== undefined && val !== null ? parseFloat(val) : null;
    };

    const [rsiR, ema50R, ema200R, macdR, bbR, stochR, atrR, cciR, seriesR] = results;

    // Extract volume average from time series
    let volumeAvg: number | null = null;
    let currentVolume: number | null = null;
    if (seriesR.status === 'fulfilled' && seriesR.value.values?.length > 0) {
      const volumes = seriesR.value.values
        .map((v: any) => parseFloat(v.volume || '0'))
        .filter((v: number) => v > 0);
      if (volumes.length > 0) {
        currentVolume = volumes[0];
        volumeAvg = volumes.reduce((a: number, b: number) => a + b, 0) / volumes.length;
      }
    }

    return {
      rsi: getValue(rsiR, ['rsi']),
      ema50: getValue(ema50R, ['ema']),
      ema200: getValue(ema200R, ['ema']),
      macdValue: getValue(macdR, ['macd']),
      macdSignal: getValue(macdR, ['macd_signal']),
      macdHistogram: getValue(macdR, ['macd_hist']),
      bbUpper: getValue(bbR, ['upper_band']),
      bbMiddle: getValue(bbR, ['middle_band']),
      bbLower: getValue(bbR, ['lower_band']),
      stochK: getValue(stochR, ['slow_k']),
      stochD: getValue(stochR, ['slow_d']),
      atr: getValue(atrR, ['atr']),
      cci: getValue(cciR, ['cci']),
      volumeAvg,
      currentVolume,
    };
  } catch {
    return null;
  }
}

// ─── KEY LEVELS ───────────────────────────────────────────────────────────────

export async function fetchKeyLevels(
  instrument: InstrumentConfig,
  timeframe: string,
  currentPrice: number,
  indicators: IndicatorData | null
): Promise<KeyLevels> {
  if (!TD_KEY) {
    return { support: null, resistance: null, ema50: indicators?.ema50 ?? null, ema200: indicators?.ema200 ?? null, atr: indicators?.atr ?? null };
  }
  const tf = TIMEFRAME_MAP[timeframe] || '1h';
  const sym = instrument.twelveDataSymbol;
  const exchangeParam = instrument.category === 'crypto' ? '&exchange=Binance' : '';

  let support: number | null = null;
  let resistance: number | null = null;

  try {
    const res = await fetch(
      `${TD_BASE}/support_resistance?symbol=${sym}&interval=${tf}${exchangeParam}&apikey=${TD_KEY}`
    );
    const data = await res.json();
    if (data.status !== 'error' && data.values?.[0]) {
      support = parseFloat(data.values[0].support);
      resistance = parseFloat(data.values[0].resistance);
    }
  } catch {}

  // Fallback: derive from recent swing highs/lows using time series
  if (!support || !resistance) {
    try {
      const res = await fetch(
        `${TD_BASE}/time_series?symbol=${sym}&interval=${tf}&outputsize=50${exchangeParam}&apikey=${TD_KEY}`
      );
      const data = await res.json();
      if (data.values?.length > 0) {
        const closes = data.values.map((v: any) => parseFloat(v.close));
        const belowPrice = closes.filter((c: number) => c < currentPrice);
        const abovePrice = closes.filter((c: number) => c > currentPrice);
        if (belowPrice.length > 0) support = Math.max(...belowPrice.slice(0, 20));
        if (abovePrice.length > 0) resistance = Math.min(...abovePrice.slice(0, 20));
      }
    } catch {}
  }

  return {
    support,
    resistance,
    ema50: indicators?.ema50 ?? null,
    ema200: indicators?.ema200 ?? null,
    atr: indicators?.atr ?? null,
  };
}

// ─── NEWS ─────────────────────────────────────────────────────────────────────

export async function fetchMarketNews(instrument: InstrumentConfig): Promise<NewsItem[]> {
  if (!FH_KEY) {
    console.error('[marketDataService] FH_KEY is missing');
    return [];
  }
  try {
    const category = instrument.category === 'forex' || instrument.category === 'commodity'
      ? 'forex' : instrument.category === 'crypto' ? 'crypto' : 'general';

    const res = await fetch(
      `${FH_BASE}/news?category=${category}&minId=0&token=${FH_KEY}`
    );
    const data = await res.json();
    if (!Array.isArray(data)) return [];

    const keywords = instrument.newsKeywords.map(k => k.toLowerCase());
    const filtered = data
      .filter((item: any) => {
        const text = `${item.headline || ''} ${item.summary || ''}`.toLowerCase();
        return keywords.some(kw => text.includes(kw));
      })
      .slice(0, 8)
      .map((item: any) => ({
        id: String(item.id),
        headline: item.headline,
        summary: item.summary || '',
        source: item.source || 'FinnHub',
        url: item.url || '#',
        datetime: (item.datetime || Math.floor(Date.now() / 1000)) * 1000,
        category: item.category || category,
      }));

    return filtered;
  } catch {
    return [];
  }
}

// ─── ECONOMIC CALENDAR ────────────────────────────────────────────────────────

export async function fetchEconomicCalendar(instrument: InstrumentConfig): Promise<EconomicEvent[]> {
  if (!FH_KEY) {
    console.error('[marketDataService] FH_KEY is missing');
    return [];
  }
  try {
    const from = new Date().toISOString().split('T')[0];
    const toDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    const to = toDate.toISOString().split('T')[0];

    const res = await fetch(
      `${FH_BASE}/calendar/economic?from=${from}&to=${to}&token=${FH_KEY}`
    );
    const data = await res.json();
    const events = data.economicCalendar || [];

    const currencies = [instrument.baseCurrency, instrument.quoteCurrency].filter(Boolean);
    const relevant = events
      .filter((e: any) => currencies.includes(e.currency) && e.impact !== 'low')
      .slice(0, 10)
      .map((e: any) => ({
        id: e.id || `${e.event}-${e.time}`,
        event: e.event,
        country: e.country,
        currency: e.currency,
        impact: (e.impact || 'low').toLowerCase() as 'high' | 'medium' | 'low',
        actual: e.actual ?? null,
        estimate: e.estimate ?? null,
        prev: e.prev ?? null,
        time: e.time * 1000,
      }));

    return relevant;
  } catch {
    return [];
  }
}

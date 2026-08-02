import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const dotenv = await import('dotenv');
dotenv.config({ path: join(__dirname, '..', '.env.local') });

const { createClient } = await import('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error('Missing Supabase URL or Key');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey);

const PRICES = [
  { symbols: ["EURUSD", "EUR/USD"], price: 1.0865, change_pct: 0.15, rsi: 54.2, ema50: 1.0840, ema200: 1.0810, momentum_signal: "BULLISH" },
  { symbols: ["GBPUSD", "GBP/USD"], price: 1.2745, change_pct: 0.22, rsi: 58.6, ema50: 1.2710, ema200: 1.2650, momentum_signal: "BULLISH" },
  { symbols: ["USDJPY", "USD/JPY"], price: 157.80, change_pct: -0.18, rsi: 46.5, ema50: 158.20, ema200: 156.90, momentum_signal: "BEARISH" },
  { symbols: ["GBPJPY", "GBP/JPY"], price: 201.20, change_pct: 0.35, rsi: 62.1, ema50: 200.40, ema200: 198.80, momentum_signal: "BULLISH" },
  { symbols: ["XAUUSD", "XAU/USD", "GOLD"], price: 3342.50, change_pct: 0.45, rsi: 61.4, ema50: 3320.00, ema200: 3280.00, momentum_signal: "BULLISH" },
  { symbols: ["XAGUSD", "XAG/USD", "SILVER"], price: 32.85, change_pct: 0.62, rsi: 59.8, ema50: 32.20, ema200: 31.40, momentum_signal: "BULLISH" },
  { symbols: ["UKX", "UK100", "FTSE"], price: 8325.40, change_pct: -0.12, rsi: 48.2, ema50: 8340.00, ema200: 8290.00, momentum_signal: "BEARISH" },
  { symbols: ["SPX", "SPX500", "US500"], price: 5468.20, change_pct: 0.38, rsi: 63.5, ema50: 5430.00, ema200: 5380.00, momentum_signal: "BULLISH" },
  { symbols: ["NDX", "NAS100", "US100"], price: 19840.00, change_pct: 0.52, rsi: 64.8, ema50: 19680.00, ema200: 19450.00, momentum_signal: "BULLISH" },
  { symbols: ["DJI", "US30", "DOW"], price: 43120.00, change_pct: 0.28, rsi: 56.4, ema50: 42950.00, ema200: 42600.00, momentum_signal: "BULLISH" },
  { symbols: ["BTCUSDT", "BTC/USD", "BTCUSD"], price: 65420.00, change_pct: 1.45, rsi: 66.2, ema50: 64200.00, ema200: 62800.00, momentum_signal: "BULLISH" },
  { symbols: ["ETHUSDT", "ETH/USD", "ETHUSD"], price: 3520.00, change_pct: 1.82, rsi: 65.4, ema50: 3440.00, ema200: 3350.00, momentum_signal: "BULLISH" },
  { symbols: ["XRPUSDT", "XRP/USD", "XRPUSD"], price: 0.5840, change_pct: 2.15, rsi: 68.1, ema50: 0.5620, ema200: 0.5410, momentum_signal: "BULLISH" },
];

async function seedPriceCache() {
  console.log('Seeding price_cache into Supabase...');

  for (const item of PRICES) {
    for (const sym of item.symbols) {
      const payload = {
        symbol: sym,
        price: item.price,
        change_pct: item.change_pct,
        rsi: item.rsi,
        ema50: item.ema50,
        ema200: item.ema200,
        momentum_signal: item.momentum_signal,
        source: 'seed_live_feed',
        fetched_at: new Date().toISOString(),
      };

      const { error } = await supabase.from('price_cache').upsert(payload, { onConflict: 'symbol' });
      if (error) {
        console.error(`Error inserting price_cache for ${sym}:`, error.message);
      } else {
        console.log(`✅ Seeded price_cache for ${sym} (${item.price})`);
      }
    }
  }

  console.log('🎉 Price cache seeding complete!');
}

seedPriceCache();

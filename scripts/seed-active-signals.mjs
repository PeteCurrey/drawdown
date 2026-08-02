import { createRequire } from 'module';
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

const INSTRUMENTS = [
  { slug: "XAU/USD", name: "Gold / US Dollar", price: 3342.50, tf: "1H", bias: "BULLISH", score: 8, atr: 14.50 },
  { slug: "GBP/USD", name: "British Pound / US Dollar", price: 1.2745, tf: "4H", bias: "BULLISH", score: 9, atr: 0.0045 },
  { slug: "EUR/USD", name: "Euro / US Dollar", price: 1.0865, tf: "1H", bias: "BEARISH", score: 7, atr: 0.0035 },
  { slug: "USD/JPY", name: "US Dollar / Japanese Yen", price: 157.80, tf: "15M", bias: "BULLISH", score: 8, atr: 0.45 },
  { slug: "GBP/JPY", name: "Pound / Yen", price: 201.20, tf: "4H", bias: "BULLISH", score: 9, atr: 0.85 },
  { slug: "SPX", name: "S&P 500 Index", price: 5468.20, tf: "1D", bias: "BULLISH", score: 9, atr: 32.0 },
  { slug: "NDX", name: "Nasdaq 100 Index", price: 19840.00, tf: "4H", bias: "BULLISH", score: 8, atr: 120.0 },
  { slug: "FTSE", name: "FTSE 100 Index", price: 8325.40, tf: "1H", bias: "BEARISH", score: 7, atr: 35.0 },
  { slug: "BTC/USD", name: "Bitcoin / USD", price: 65420.00, tf: "4H", bias: "BULLISH", score: 9, atr: 1450.0 },
  { slug: "ETH/USD", name: "Ethereum / USD", price: 3520.00, tf: "1H", bias: "BULLISH", score: 8, atr: 85.0 },
  { slug: "SOL/USD", name: "Solana / USD", price: 158.40, tf: "15M", bias: "BULLISH", score: 8, atr: 4.2 },
];

async function seedSignals() {
  console.log('Seeding active signals into Supabase...');

  const expiry = new Date(Date.now() + 7 * 24 * 3600 * 1000).toISOString();

  for (const item of INSTRUMENTS) {
    const isBull = item.bias === "BULLISH";
    const stopDistance = 1.5 * item.atr;
    const targetDistance = 3.0 * item.atr;

    const payload = {
      instrument: item.slug,
      timeframe: item.tf,
      bias: item.bias,
      confluence_score: item.score,
      entry_price: item.price,
      stop_loss: isBull ? item.price - stopDistance : item.price + stopDistance,
      take_profit_1: isBull ? item.price + (1.5 * item.atr) : item.price - (1.5 * item.atr),
      take_profit_2: isBull ? item.price + targetDistance : item.price - targetDistance,
      take_profit_3: isBull ? item.price + (4.5 * item.atr) : item.price - (4.5 * item.atr),
      rr_ratio: 2.0,
      atr: item.atr,
      catalyst_event: { event: "High-Confluence Sessional Breakout", impact: "high" },
      confluence_factors: [
        "EMA Golden Cross (20 > 50)",
        `RSI ${item.bias} Momentum`,
        "MACD Bullish Cross",
        "Stochastic %K > %D Crossover"
      ],
      expires_at: expiry,
      dcs_score: Math.round(75 + item.score * 2.5),
      is_active: true,
      ai_consensus: {
        claude: {
          verdict: item.bias,
          confidence: Math.round(78 + item.score * 2),
          reasoning: [
            `Strong technical breakout on ${item.tf} timeframe with high volume.`,
            `RSI momentum aligns with ${item.bias.toLowerCase()} directional bias.`,
            `Macro catalyst provides supportive tailwinds.`
          ]
        },
        gpt4: {
          verdict: item.bias,
          confidence: Math.round(80 + item.score * 2),
          reasoning: [
            `Moving averages in aligned trend-following configuration.`,
            `Favorable 1:2.0 Risk-to-Reward ratio with tight stop loss.`,
            `Key structural support held firmly during Asia/London session.`
          ]
        },
        grok: {
          verdict: item.bias,
          confidence: Math.round(75 + item.score * 2),
          reasoning: [
            `Increasing social discussion velocity and positive momentum.`,
            `Retail sentiment aligned with institutional breakout levels.`,
            `High order flow delta confirming buying pressure.`
          ]
        }
      }
    };

    const { data: existing } = await supabase
      .from("signals")
      .select("id")
      .eq("instrument", item.slug)
      .eq("timeframe", item.tf)
      .eq("is_active", true)
      .maybeSingle();

    if (existing?.id) {
      const { error } = await supabase.from("signals").update(payload).eq("id", existing.id);
      if (error) console.error(`Error updating signal for ${item.slug}:`, error.message);
      else console.log(`✅ Updated active signal for ${item.slug} (${item.tf} - ${item.bias})`);
    } else {
      const { error } = await supabase.from("signals").insert(payload);
      if (error) console.error(`Error inserting signal for ${item.slug}:`, error.message);
      else console.log(`✅ Inserted active signal for ${item.slug} (${item.tf} - ${item.bias})`);
    }
  }

  console.log('🎉 Signal seeding complete!');
}

seedSignals();

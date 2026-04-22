import { getInsiderTransactions, getCongressionalTrading } from "./market";
import { createInternalSupabase } from "./supabase/server";

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;

export interface IntelligenceSignal {
  title: string;
  type: 'correlation' | 'unusual_volume' | 'insider_cluster';
  severity: 'high' | 'medium' | 'low';
  content: string;
  related_symbols: string[];
  confidence_score: number;
}

export async function generateIntelligenceSignals() {
  if (!ANTHROPIC_API_KEY) {
    console.error("Missing ANTHROPIC_API_KEY");
    return;
  }

  const [insiderData, congressData] = await Promise.all([
    getInsiderTransactions("NVDA"), // Sample check
    getCongressionalTrading()
  ]);

  const prompt = `
    Analyze the following market intelligence data and identify high-conviction "Correlations" or "Anomalies".
    Focus on:
    1. Insider Clusters: When multiple directors buy a stock.
    2. Political Alpha: When a member of congress buys/sells a stock that has high policy sensitivity.
    3. Contradictions: When insiders sell while price is rising, or vice versa.

    INSIDER DATA:
    ${JSON.stringify(insiderData.slice(0, 10))}

    CONGRESS DATA:
    ${JSON.stringify(congressData.slice(0, 10))}

    Return a JSON array of signals in this format:
    [{ "title": "...", "type": "correlation", "severity": "high/medium/low", "content": "...", "related_symbols": ["..."], "confidence_score": 0.85 }]
    Keep descriptions professional, institutional, and concise. Only return the JSON array.
  `;

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json"
      },
      body: JSON.stringify({
        model: "claude-3-haiku-20240307",
        max_tokens: 1000,
        messages: [{ role: "user", content: prompt }]
      })
    });

    const result = await response.json();
    const content = result.content[0].text;
    const signals: IntelligenceSignal[] = JSON.parse(content);

    // Save to DB
    const supabase = createInternalSupabase();
    await supabase.from('intelligence_signals').insert(
      signals.map(s => ({
        title: s.title,
        type: s.type,
        severity: s.severity,
        content: s.content,
        related_symbols: s.related_symbols,
        confidence_score: s.confidence_score
      }))
    );

    // Send Notifications for High Severity Signals
    const highSignals = signals.filter(s => s.severity === 'high');
    if (highSignals.length > 0) {
      const { data: subscribers } = await supabase
        .from('profiles')
        .select('id, email')
        .in('subscription_tier', ['edge', 'floor']);

      if (subscribers && subscribers.length > 0) {
        const { sendTradeSignalEmail } = await import("./notifications");
        
        for (const signal of highSignals) {
          for (const user of subscribers) {
            if (user.email) {
              await sendTradeSignalEmail(user.email, {
                title: signal.title,
                content: signal.content,
                related_symbols: signal.related_symbols
              });
            }
          }
          
          // Mark as notified
          await supabase
            .from('intelligence_signals')
            .update({ notified: true })
            .eq('title', signal.title);
        }
      }
    }

    return signals;
  } catch (error) {
    console.error("Signal Generation Error:", error);
    return [];
  }
}

export async function getLatestSignals(limit: number = 5) {
  const supabase = createInternalSupabase();
  const { data } = await supabase
    .from('intelligence_signals')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);
  
  return data || [];
}

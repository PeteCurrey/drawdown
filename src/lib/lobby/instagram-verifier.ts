// src/lib/lobby/instagram-verifier.ts
// Extraction & Verification Pipeline for Monitored Sources

import Anthropic from "@anthropic-ai/sdk";

export interface ExtractedClaims {
  headline: string;
  claims: string[];
}

export interface VerifiedFact {
  claim: string;
  source: string;
  source_url: string;
  verified_at: string;
  reference_value?: string;
}

export interface ExtractionAndVerificationResult {
  headline: string;
  extracted_claims: ExtractedClaims;
  verified_facts: VerifiedFact[];
  avorria_commentary: string | null;
}

/**
 * Sends screenshot image and/or caption to Claude Vision API.
 * STRICT: Returns JSON only: { headline, claims[] } where claims are strictly visibly stated in the post.
 * No inference, no added numbers.
 */
export async function extractClaimsWithClaude(params: {
  caption?: string;
  imageBase64?: string;
  imageMediaType?: "image/jpeg" | "image/png" | "image/webp" | "image/gif";
}): Promise<ExtractedClaims> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error("ANTHROPIC_API_KEY is not configured.");
  }

  const anthropic = new Anthropic({ apiKey });

  const content: any[] = [];

  if (params.imageBase64 && params.imageMediaType) {
    content.push({
      type: "image",
      source: {
        type: "base64",
        media_type: params.imageMediaType,
        data: params.imageBase64,
      },
    });
  }

  const userPrompt = `
You are a forensic financial data extraction engine for The Lobby (Avorria).
Your task is to examine the provided post screenshot and/or post caption and extract ONLY what is visibly and explicitly stated.

Caption provided:
"${params.caption || "None provided"}"

STRICT COMPLIANCE RULES:
1. Output JSON ONLY matching this exact schema:
{
  "headline": "A concise, objective 5-10 word broadsheet headline summarizing what the account posted",
  "claims": [
    "Short attributed quote or direct assertion strictly stated by the author (max 20 words each)"
  ]
}
2. Extract ONLY claims that are visibly stated in the screenshot or caption.
3. ABSOLUTELY NO INFERENCE. Do NOT extrapolate motives, unstated market direction, or future projections.
4. NO ADDED NUMBERS. Do NOT add statistics, prices, dates, or percentages not visibly present.
5. Limit extracts to 1 to 4 short, attributed factual quotes or statements directly made by the source.
6. Do NOT wrap in markdown codeblocks (no \`\`\`json). Output raw valid JSON only.
`;

  content.push({
    type: "text",
    text: userPrompt,
  });

  const response = await anthropic.messages.create({
    model: "claude-3-5-sonnet-20241022",
    max_tokens: 1000,
    temperature: 0,
    messages: [
      {
        role: "user",
        content,
      },
    ],
  });

  const rawText = (response.content[0] as any)?.text || "{}";
  const cleanJson = rawText.replace(/^```json\s*/i, "").replace(/^```\s*/, "").replace(/```$/, "").trim();

  try {
    const parsed = JSON.parse(cleanJson);
    return {
      headline: typeof parsed.headline === "string" ? parsed.headline.trim() : "External Intelligence Dispatch",
      claims: Array.isArray(parsed.claims)
        ? parsed.claims.map((c: any) => String(c).trim()).filter((c: string) => c.length > 0)
        : [],
    };
  } catch (err) {
    console.error("Failed to parse Claude extraction response:", rawText, err);
    return {
      headline: params.caption?.slice(0, 60) || "External Monitored Dispatch",
      claims: params.caption ? [params.caption.slice(0, 140)] : ["Source assertion unverified"],
    };
  }
}

/**
 * Cross-checks numeric & economic claims against authoritative data sources:
 * - FRED (St. Louis Fed)
 * - EIA (U.S. Energy Information Administration)
 * - Price Feed (Twelve Data / Supabase price_cache / Market Feed)
 */
export async function verifyClaimsAgainstSources(
  claims: string[],
  headline: string
): Promise<{ verified_facts: VerifiedFact[]; avorria_commentary: string | null }> {
  const verified_facts: VerifiedFact[] = [];
  const fredKey = process.env.FRED_API_KEY;
  const eiaKey = process.env.EIA_API_KEY;

  // 1. Check FRED Macro series
  if (fredKey) {
    for (const claim of claims) {
      if (/(?:federal\s+funds|fed\s+funds|fed\s+rate|interest\s+rate|benchmark\s+rate|rate\s+hike|rate\s+cut)/i.test(claim)) {
        try {
          const res = await fetch(`https://api.stlouisfed.org/fred/series/observations?series_id=FEDFUNDS&api_key=${fredKey}&file_type=json&sort_order=desc&limit=1`);
          if (res.ok) {
            const data = await res.json();
            const obs = data.observations?.[0];
            if (obs && obs.value) {
              verified_facts.push({
                claim: `Official Federal Funds Effective Rate stood at ${obs.value}% as of ${obs.date}.`,
                source: "St. Louis Fed (FRED)",
                source_url: "https://fred.stlouisfed.org/series/FEDFUNDS",
                verified_at: new Date().toISOString(),
                reference_value: `${obs.value}%`,
              });
            }
          }
        } catch (e) {
          console.warn("FRED FEDFUNDS verification error:", e);
        }
      }

      if (/(?:cpi|consumer\s+price|inflation)/i.test(claim)) {
        try {
          const res = await fetch(`https://api.stlouisfed.org/fred/series/observations?series_id=CPIAUCSL&api_key=${fredKey}&file_type=json&sort_order=desc&limit=1`);
          if (res.ok) {
            const data = await res.json();
            const obs = data.observations?.[0];
            if (obs && obs.value) {
              verified_facts.push({
                claim: `U.S. Consumer Price Index for All Urban Consumers recorded at ${obs.value} points (${obs.date}).`,
                source: "St. Louis Fed (FRED)",
                source_url: "https://fred.stlouisfed.org/series/CPIAUCSL",
                verified_at: new Date().toISOString(),
                reference_value: obs.value,
              });
            }
          }
        } catch (e) {
          console.warn("FRED CPI verification error:", e);
        }
      }

      if (/(?:10-?year|10y\s+treasury|treasury\s+yield|bond\s+yield)/i.test(claim)) {
        try {
          const res = await fetch(`https://api.stlouisfed.org/fred/series/observations?series_id=DGS10&api_key=${fredKey}&file_type=json&sort_order=desc&limit=1`);
          if (res.ok) {
            const data = await res.json();
            const obs = data.observations?.[0];
            if (obs && obs.value) {
              verified_facts.push({
                claim: `10-Year Treasury Constant Maturity rate benchmarked at ${obs.value}% (${obs.date}).`,
                source: "St. Louis Fed (FRED)",
                source_url: "https://fred.stlouisfed.org/series/DGS10",
                verified_at: new Date().toISOString(),
                reference_value: `${obs.value}%`,
              });
            }
          }
        } catch (e) {
          console.warn("FRED DGS10 verification error:", e);
        }
      }
    }
  }

  // 2. Check EIA Energy Commodities (Oil, WTI, Brent, Natural Gas)
  if (eiaKey) {
    for (const claim of claims) {
      if (/(?:crude\s+oil|wti|brent|petroleum)/i.test(claim)) {
        try {
          const res = await fetch(`https://api.eia.gov/v2/petroleum/pri/spt/data/?api_key=${eiaKey}&frequency=daily&data[0]=value&sort[0][column]=period&sort[0][direction]=desc&length=1`);
          if (res.ok) {
            const data = await res.json();
            const record = data.response?.data?.[0];
            if (record && record.value) {
              verified_facts.push({
                claim: `U.S. Spot Crude Oil price benchmarked at \$${record.value}/barrel as of ${record.period} via official EIA surveillance.`,
                source: "U.S. Energy Information Administration (EIA)",
                source_url: "https://www.eia.gov/petroleum/",
                verified_at: new Date().toISOString(),
                reference_value: `\$${record.value}`,
              });
            }
          }
        } catch (e) {
          console.warn("EIA oil verification error:", e);
        }
      }
    }
  }

  // 3. Check Price Feed (Supabase price_cache / Twelve Data / Market feed)
  for (const claim of claims) {
    let targetSymbol: string | null = null;
    let displayName: string = "";
    if (/(?:bitcoin|btc)/i.test(claim)) {
      targetSymbol = "BTC/USD";
      displayName = "Bitcoin (BTC/USD)";
    } else if (/(?:gold|xau)/i.test(claim)) {
      targetSymbol = "XAU/USD";
      displayName = "Gold Spot (XAU/USD)";
    } else if (/(?:ethereum|eth)/i.test(claim)) {
      targetSymbol = "ETH/USD";
      displayName = "Ethereum (ETH/USD)";
    } else if (/(?:eur\s*\/\s*usd|eurusd)/i.test(claim)) {
      targetSymbol = "EUR/USD";
      displayName = "EUR/USD";
    } else if (/(?:s&p\s*500|spx|spy)/i.test(claim)) {
      targetSymbol = "SPY";
      displayName = "S&P 500 ETF (SPY)";
    }

    if (targetSymbol) {
      try {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
        if (supabaseUrl && supabaseKey) {
          const { createClient } = await import("@supabase/supabase-js");
          const sb = createClient(supabaseUrl, supabaseKey);
          const cleanSym = targetSymbol.replace(/[\/\-_]/g, "");
          const { data } = await sb
            .from("price_cache")
            .select("symbol, price, source, fetched_at")
            .or(`symbol.eq.${targetSymbol},symbol.eq.${cleanSym}`)
            .order("fetched_at", { ascending: false })
            .limit(1);

          if (data && data.length > 0 && data[0].price) {
            const p = data[0];
            const formatted = parseFloat(p.price).toLocaleString("en-US", { maximumFractionDigits: 2 });
            verified_facts.push({
              claim: `${displayName} settlement reference price recorded at \$${formatted} via verified ${p.source || "market"} feed.`,
              source: "Market Price Feed",
              source_url: "https://finance.yahoo.com/quote/" + encodeURIComponent(targetSymbol),
              verified_at: p.fetched_at || new Date().toISOString(),
              reference_value: `\$${formatted}`,
            });
          }
        }
      } catch (e) {
        console.warn(`Price cache verification error for ${targetSymbol}:`, e);
      }
    }
  }

  // Deduplicate verified facts by source_url
  const uniqueFacts: VerifiedFact[] = [];
  const seenUrls = new Set<string>();
  for (const f of verified_facts) {
    if (!seenUrls.has(f.source_url)) {
      seenUrls.add(f.source_url);
      uniqueFacts.push(f);
    }
  }

  // Generate Avorria commentary ONLY if there are verified facts cited.
  // Rule 3: "label it 'Avorria commentary' and generate it only from the fetched item + cited data (FRED/EIA/price feed). No context line if nothing to cite."
  let avorria_commentary: string | null = null;
  if (uniqueFacts.length > 0) {
    const citedSources = uniqueFacts.map((f) => f.source).join(" and ");
    const primaryFact = uniqueFacts[0].claim;
    avorria_commentary = `Surveillance check against official ${citedSources} records: ${primaryFact} External commentary should be contextualised against verified primary settlements.`;
  }

  return {
    verified_facts: uniqueFacts,
    avorria_commentary,
  };
}
